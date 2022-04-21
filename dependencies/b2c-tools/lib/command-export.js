const AdmZip = require('adm-zip');
const xml2js = require('xml2js');
const http = require('http');
const Handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const open = require('open');

const Environment = require('./environment');
const logger = require('./logger');
const { waitForJob, siteArchiveExport } = require('./jobs');

/**
 * Recursively process a <content> to extract child components and images
 *
 * @param content jsonified version of <content> via xml2js
 * @param allPages {object}
 * @param contentToKeep {Set} array of page ids to retain from library (mutable)
 * @param filesToDownload {string[]} array of files to download from webdav static dir (mutable)
 * @param assetQuery {string[]}
 * @param logPrefix for debugging output
 */
function processContent(content, allPages, contentToKeep, filesToDownload, logPrefix, assetQuery) {
    var contentId = content['$']['content-id'];
    var contentLinks = content['content-links'];
    var contentType = content['type'] ? content['type'][0] : 'n/a';
    logger.info(`${logPrefix}${logPrefix ? '├──' : ''}${contentId} (${contentType})`);

    var data = content['data'];
    if (data && data[0] && data[0]['_']) {
        try {
            // look for asset urls in json using the provided queries
            var dataJson = JSON.parse(data[0]['_']);
            for (var i = 0; i < assetQuery.length; i++) {
                var query = assetQuery[i].split('.');
                var _current = dataJson;
                for (var j = 0; j < query.length; j++) {
                    var _attr = query[j];
                    if (_attr && _current[_attr] && j === query.length - 1) {
                        logger.info(`${logPrefix}   ├── ${_current[_attr]} (STATIC IMAGE)`);
                        filesToDownload.push(_current[_attr]);
                    } else if (_current[_attr]) {
                        _current = _current[_attr];
                    } else {
                        break;
                    }
                }
            }
        } catch (e) {
            logger.error(e.message || e);
            logger.error('Couldn\'t extract images from JSON');
        }
    }

    if (contentLinks && contentLinks[0]['content-link'] && contentLinks[0]['content-link'].length) {
        // recurse
        for (i = 0; i < contentLinks[0]["content-link"].length; i++) {
            let _cl = contentLinks[0]['content-link'][i];
            let _clId = _cl['$']['content-id'];
            if (!allPages[_clId]) {
                logger.warn(`Cannot find component ${_clId} in library; skipping...`);
                continue;
            }
            processContent(allPages[_clId], allPages, contentToKeep, filesToDownload, '   ' + logPrefix, assetQuery);
        }
    }
    contentToKeep.add(contentId);
}

async function exportPage(pageIds, library, outputPath, isSite, assetQuery = ['image.path']) {
    var env = new Environment();
    var now = (new Date()).toISOString()
        .replace(/[:.-]+/g, '');
    var archiveDir = `${now}_export`;
    var zipFilename = `${archiveDir}.zip`;
    var webdavPath = `Impex/src/instance/${zipFilename}`;

    logger.info(`Exporting from library ${library}...`);
    var dataUnits;
    if (!isSite) {
        dataUnits = {
            libraries: {
                [library]: true
            }
        };
    } else {
        dataUnits = {
            sites: {
                [library]: {
                    content: true
                }
            }
        };
    }
    var resp = await env.ocapi.post('jobs/sfcc-site-archive-export/executions', {
        export_file: zipFilename,
        data_units: dataUnits
    });
    var jobId = resp.data.id;
    var jobStatus = resp.data.status;
    logger.info(`Job ${jobId} executed. Status ${jobStatus}`);
    logger.debug(JSON.stringify(resp.data));

    await waitForJob(env, 'sfcc-site-archive-export', jobId);

    logger.info('Processing archive...');
    resp = await env.webdav.get(webdavPath, {
        responseType: 'arraybuffer'
    });
    var zip = new AdmZip(resp.data);
    var zipEntries = zip.getEntries();
    await env.webdav.delete(webdavPath);

    var libraryEntry = zipEntries.find((e) => e.name === 'library.xml');

    if (!libraryEntry) {
        throw new Error(`library ${library} not found; for non-shared libraries use the --is-site option`);
    }

    var libraryXML = zip.readAsText(libraryEntry);

    var xml = await xml2js.parseStringPromise(libraryXML);
    // Process library for page(s) and recurse for componentns
    logger.info(`Extracting pages, components and images...`);
    var contentToKeep = new Set();
    var filesToDownload = [];
    var pagesById = new Set();
    xml.library.content.forEach((c) => pagesById[c['$']['content-id']] = c);

    for (var i = 0; i < pageIds.length; i++) {
        let _id = pageIds[i];
        if (!pagesById[_id]) {
            logger.warn(`Cannot find page ${_id} in library; skipping...`);
            continue;
        }
        processContent(pagesById[_id], pagesById, contentToKeep, filesToDownload, '', assetQuery);
    }

    // noinspection JSConstantReassignment
    delete xml.library.folder;

    for (i = xml.library.content.length - 1; i >= 0; i--) {
        let _c = xml.library.content[i];
        if (!contentToKeep.has(_c['$']['content-id'])) {
            xml.library.content.splice(i, 1);
        }
    }

    logger.info('Downloading images...');
    for (var filename of filesToDownload) {
        logger.info(`Getting ${filename}`);
        if (filename[0] === '/') {
            filename = filename.slice(1);
        }
        resp = await env.webdav.get(`Libraries/${library}/default/${filename}`, {
            responseType: 'arraybuffer'
        });
        if (!isSite) {
            zip.addFile(`${archiveDir}/libraries/${library}/static/default/${filename}`, resp.data);
        } else {
            zip.addFile(`${archiveDir}/sites/${library}/library/static/default/${filename}`, resp.data);
        }
    }

    var builder = new xml2js.Builder();
    var xmlStr = builder.buildObject(xml);
    zip.updateFile(libraryEntry, xmlStr);

    await zip.extractAllToAsync(outputPath, true);
    logger.info(`Saved to ${path.join(outputPath, archiveDir)}`);
}

/**
 * @typedef {Object} CollectionLists
 * @property {string[]} sites
 * @property {string[]} inventoryLists
 * @property {string[]} catalogs
 */

/**
 * Retrieves list of catalogs, inventory lists, sites and libraries for interactive display
 *
 * @param env {Environment}
 * @return {Promise<CollectionLists>}
 */
async function getCollectionsFromInstance(env) {
    var resp;
    var sites = [];
    var catalogs = [];
    var inventoryLists = [];
    try {
        let retrieved = 0;
        do {
            resp = await env.ocapi.get(`sites?start=${retrieved}&count=100`);
            if (resp.data.count) {
                sites = sites.concat(resp.data.data.map((s) => s.id));
                retrieved += resp.data.count;
            }
        } while(retrieved !== resp.data.total);
    } catch (e) {
        if (e.response && e.response.status === 403) {
            logger.warn('Cannot query sites (check DATA API permissions)');
        } else {
            throw e;
        }
    }
    try {
        let retrieved = 0;
        do {
            resp = await env.ocapi.get(`catalogs?start=${retrieved}&count=100`);
            if (resp.data.count) {
                catalogs = catalogs.concat(resp.data.data.map((s) => s.id));
                retrieved += resp.data.count;
            }
        } while(retrieved !== resp.data.total);
    } catch (e) {
        if (e.response && e.response.status === 403) {
            logger.warn('Cannot query catalogs (check DATA API permissions)');
        } else {
            throw e;
        }
    }
    try {
        let retrieved = 0;
        do {
            resp = await env.ocapi.get(`inventory_lists?start=${retrieved}&count=100`);
            if (resp.data.count) {
                inventoryLists = inventoryLists.concat(resp.data.data.map((s) => s.id));
                retrieved += resp.data.count;
            }
        } while(retrieved !== resp.data.total);
    } catch (e) {
        if (e.response && e.response.status === 403) {
            logger.warn('Cannot query inventories (check DATA API permissions)');
        } else {
            throw e;
        }
    }

    return {
        sites,
        inventoryLists,
        catalogs
    };
}

/**
 * Launch a web page to collect data units to export
 *
 * @param env {Environment}
 * @param collections {CollectionLists}
 * @return {Promise<object>}
 */
function getDataUnitsFromWeb(env, collections) {
    var {
        sites,
        inventoryLists,
        catalogs
    } = collections;
    return new Promise(function (resolve, _reject) {
        var sockets = [];
        var server = http.createServer(function (request, response) {
            if (request.method === 'GET') {
                // serve html page
                response.writeHead(200, { 'Content-Type': 'text/html' });
                var tpl = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, 'templates/export.html.hbs'))
                    .toString());
                response.write(tpl({
                    sites,
                    catalogs,
                    inventoryLists,
                    env
                }));
                response.end();
            } else {
                // return access token
                var body = '';
                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    var parsed = require('querystring')
                        .parse(body);
                    delete parsed.export;

                    var dataUnits = {};
                    Object.keys(parsed)
                        .forEach((dataUnit) => {
                            var parts = dataUnit.split('|');
                            var parent = parts[0];
                            var subunits = parts.slice(1);

                            if (!dataUnits[parent]) {
                                dataUnits[parent] = {};
                            }
                            var unitConfig = dataUnits[parent];
                            for (var i = 0; i < subunits.length; i++) {
                                var subunit = subunits[i];
                                if (i === subunits.length - 1) { // end of chain
                                    unitConfig[subunit] = true;
                                }
                                if (typeof unitConfig[subunit] === 'undefined') {
                                    unitConfig[subunit] = {};
                                }
                                unitConfig = unitConfig[subunit];
                            }
                        });
                    resolve(dataUnits);
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('You may close this browser window now and return to your terminal or Visual Studio Code...');
                    response.end();
                    setTimeout(function () {
                        logger.debug('Shutting down server');
                        server.close(() => logger.debug('Server shutdown'));
                        sockets.forEach((s) => {
                            if (s) {
                                s.destroy();
                            }
                        });
                    }, 2000);
                });
            }
        });
        server.on('connection', function (socket) {
            sockets.push(socket);
        });
        server.listen(4567, function () {
            var url = 'http://localhost:4567';
            logger.info('Export interface url: %s', url);
            logger.info('If the url does not open automatically, copy/paste the above url into a browser on this machine.');

            // attempt to open the machines default user agent
            open(url).then(() => {});
        });
    });
}

async function exportSiteCommand(outputPath) {
    logger.info(`Exporting to ${outputPath}`);

    var env = new Environment();
    var now = (new Date()).toISOString()
        .replace(/[:.-]+/g, '');
    var archiveDir = `${now}_export`;
    var zipFilename = `${archiveDir}.zip`;

    logger.info('Querying sites, catalogs and inventory lists...');

    var collections = await getCollectionsFromInstance(env)
    var dataUnits = await getDataUnitsFromWeb(env, collections);

    if (dataUnits && dataUnits["cancel"]) {
        return;
    }

    logger.info('Exporting data units...');
    console.log(JSON.stringify(dataUnits, null, 2));

    const data = await siteArchiveExport(env, dataUnits, zipFilename);

    var zip = new AdmZip(data);

    logger.info('Extracting...');
    await zip.extractAllToAsync(outputPath, true);
    logger.info(`Saved to ${outputPath}/${archiveDir}`);
}

module.exports = {
    command: 'export',
    desc: 'exports data from b2c instances',
    builder: (yargs) => yargs
        .command('page <pageid..>', 'export pages by id with all components',
            (y) => y
                .option('library', {
                    describe: 'Library ID to Use',
                    required: true
                })
                .option('is-site-library', {
                    describe: 'library is a site ID (private)',
                    default: false
                })
                .boolean('is-site')
                .option('q', {
                    alias: 'asset-query',
                    describe: 'json paths for file extraction',
                    default: ['image.path'],
                    type: 'array'
                })
                .option('o', {
                    alias: 'output',
                    describe: 'Output path',
                    default: './tmp'
                })
                .positional('pageid', { describe: 'page(s) to export', type: 'array', required: true })
                .group(['library', 'is-site-library', 'output', 'q'], 'Export Options:'),
            async (argv) => await exportPage(argv.pageid, argv.library, argv.output, argv['is-site-library'], argv.q)
        )
        .command('site', 'export a site import/export archive',
            (y) => y
                .option('o', {
                    alias: 'output',
                    describe: 'Output path',
                    default: './tmp'
                }),
            async (argv) => await exportSiteCommand(argv.output)
        )
        .demandCommand()
};
