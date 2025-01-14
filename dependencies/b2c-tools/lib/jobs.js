/**
 * import and export job helpers
 * @module b2cTools/jobs
 */

const {Buffer} = require('buffer');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');

const logger = require('./logger');
const util = require('./util');
const {sleep} = require("./util");

/**
 *
 * @param {Environment} env
 * @param {string} jobId job identifier
 * @param {string} executionId job execution id
 * @return {Promise<void>}
 */
async function waitForJob(env, jobId, executionId) {
    var ticks = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await util.sleep(4000);
        var resp = await env.ocapi.get(`jobs/${jobId}/executions/${executionId}`);
        logger.debug(JSON.stringify(resp.data));
        var jobStatus = resp.data.status;
        var executionStatus = resp.data.execution_status;
        if (executionStatus === 'aborted' || jobStatus === 'ERROR') {
            try {
                // log file path is relative to /webdav not /webdav/Sites; simpler to fix this in this one instance
                var logFile = await env.webdav.get(resp.data.log_file_path, {
                    baseURL: `https://${env.secureServer ? env.secureServer : env.server}/on/demandware.servlet/webdav`
                });
                logger.error(`Job log ${resp.data.log_file_path}`);
                logger.error('\n' + logFile.data);
            } catch (e) { /* ignore */
                logger.error("Error retrieving log file");
            }
            throw new Error(`Error executing job`);
        } else if (executionStatus === 'finished') {
            break;
        } else {
            ticks++;
            process.stdout.write('.');
        }
    }
    logger.info(`${ticks ? '\n' : ''}Job ${executionId} (${jobId}) finished. Status ${jobStatus}`);
}

/**
 * @typedef {Object} JobExecutionParameter
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef {Object} JobExecution
 * @property {string} id
 * @property {string} job_id
 * @property {string} status
 */

/**
 *
 * @param {Environment} env
 * @param {string} jobId job identifier
 * @param {JobExecutionParameter[]} parameters
 * @return {Promise<void>}
 */
async function executeJob(env, jobId, parameters = []) {
    var resp = await env.ocapi.post(`jobs/${jobId}/executions`, {
        parameters
    });
    return resp.data;
}

/**
 * Import a site impex
 *
 * @param {Environment} env
 * @param {string|Buffer} target directory, zip file path or buffer of zip content
 * @param {object} options
 * @param {string} [options.archiveName] required if Buffer is used
 * @param {boolean} [options.keepArchive] if true, keep archive on isntance
 * @return {Promise<void>}
 */
async function siteArchiveImport(env, target, options = {}) {
    const {archiveName, keepArchive} = options;
    var now = (new Date()).getTime();

    if (Buffer.isBuffer(target)) {
        if (!archiveName) {
            throw new Error("archiveName is required for buffer objects");
        }
        var archive = target;
        var zipFilename = `${archiveName}.zip`;
    } else {
        if (!fs.existsSync(target)) {
            throw new Error(`${target} not found`);
        }

        if ((await fs.promises.stat(target)).isFile()) {
            archive = await fs.readFile(target);
            zipFilename = path.basename(target);
        } else {
            archive = archiver('zip', {
                zlib: {level: 9} // Sets the compression level.
            });
            archive.directory(target, `import-${now}`);
            archive.finalize();
            zipFilename = `import-${now}.zip`;
        }
    }

    var uploadPath = `Impex/src/instance/${zipFilename}`;

    logger.debug(`uploading ${uploadPath}...`);
    await env.webdav.put(uploadPath, archive);
    logger.debug(`${uploadPath} uploaded`);

    logger.info('Executing sfcc-site-archive-import job');
    var resp = await env.ocapi.post('jobs/sfcc-site-archive-import/executions', {
        file_name: zipFilename
    });
    var jobId = resp.data.id;
    var jobStatus = resp.data.status;
    logger.info(`Job ${jobId} executed. Status ${jobStatus}`);
    logger.debug(JSON.stringify(resp.data));

    await waitForJob(env, 'sfcc-site-archive-import', jobId);

    if (!keepArchive) {
        await env.webdav.delete(uploadPath);
        logger.debug(`${uploadPath} deleted`);
    } else {
        logger.debug(`${uploadPath} not deleted`);
    }
}

/**
 * @typedef {Object} ExportSitesConfiguration
 * @property {undefined|boolean} ab_tests
 * @property {undefined|boolean} active_data_feeds
 * @property {undefined|boolean} all
 * @property {undefined|boolean} cache_settings
 * @property {undefined|boolean} campaigns_and_promotions
 * @property {undefined|boolean} content
 * @property {undefined|boolean} coupons
 * @property {undefined|boolean} custom_objects
 * @property {undefined|boolean} customer_cdn_settings
 * @property {undefined|boolean} customer_groups
 * @property {undefined|boolean} distributed_commerce_extensions
 * @property {undefined|boolean} dynamic_file_resources
 * @property {undefined|boolean} gift_certificates
 * @property {undefined|boolean} ocapi_settings
 * @property {undefined|boolean} payment_methods
 * @property {undefined|boolean} payment_processors
 * @property {undefined|boolean} redirect_urls
 * @property {undefined|boolean} search_settings
 * @property {undefined|boolean} shipping
 * @property {undefined|boolean} site_descriptor
 * @property {undefined|boolean} site_preferences
 * @property {undefined|boolean} sitemap_settings
 * @property {undefined|boolean} slots
 * @property {undefined|boolean} sorting_rules
 * @property {undefined|boolean} source_codes
 * @property {undefined|boolean} static_dynamic_alias_mappings
 * @property {undefined|boolean} stores
 * @property {undefined|boolean} tax
 * @property {undefined|boolean} url_rules
 */

/**
 * @typedef {Object} ExportGlobalDataConfiguration
 * @property {undefined|boolean} access_roles
 * @property {undefined|boolean} all
 * @property {undefined|boolean} csc_settings
 * @property {undefined|boolean} csrf_whitelists
 * @property {undefined|boolean} custom_preference_groups
 * @property {undefined|boolean} custom_quota_settings
 * @property {undefined|boolean} custom_types
 * @property {undefined|boolean} geolocations
 * @property {undefined|boolean} global_custom_objects
 * @property {undefined|boolean} job_schedules
 * @property {undefined|boolean} job_schedules_deprecated
 * @property {undefined|boolean} locales
 * @property {undefined|boolean} meta_data
 * @property {undefined|boolean} oauth_providers
 * @property {undefined|boolean} ocapi_settings
 * @property {undefined|boolean} page_meta_tags
 * @property {undefined|boolean} preferences
 * @property {undefined|boolean} price_adjustment_limits
 * @property {undefined|boolean} services
 * @property {undefined|boolean} sorting_rules
 * @property {undefined|boolean} static_resources
 * @property {undefined|boolean} system_type_definitions
 * @property {undefined|boolean} users
 * @property {undefined|boolean} webdav_client_permissions
 */

/**
 * @typedef {Object} ExportDataUnitsConfiguration
 * @property {undefined|Object<string, boolean>} catalog_static_resources
 * @property {undefined|Object<string, boolean>} catalogs
 * @property {undefined|Object<string, boolean>} customer_lists
 * @property {undefined|Object<string, boolean>} inventory_lists
 * @property {undefined|Object<string, boolean>} library_static_resources
 * @property {undefined|Object<string, boolean>} libraries
 * @property {undefined|Object<string, boolean>} price_books
 * @property {undefined|Object<string, ExportSitesConfiguration>} sites
 * @property {undefined|ExportGlobalDataConfiguration} global_data
 */

/**
 * Export the given site archive, returning the zip data
 *
 * @param {Environment} env
 * @param {ExportDataUnitsConfiguration} dataUnits
 * @param {string} zipFilename filename of the export
 * @return {Promise<Buffer>}
 */
async function siteArchiveExport(env, dataUnits, zipFilename) {
    var webdavPath = `Impex/src/instance/${zipFilename}`;

    var resp = await env.ocapi.post('jobs/sfcc-site-archive-export/executions', {
        export_file: zipFilename,
        data_units: dataUnits
    });
    var jobId = resp.data.id;
    var jobStatus = resp.data.status;
    logger.info(`Job ${jobId} executed. Status ${jobStatus}`);
    logger.debug(JSON.stringify(resp.data));

    await waitForJob(env, 'sfcc-site-archive-export', jobId);
    logger.debug(`Downloading archive ${webdavPath}`);
    resp = await env.webdav.get(webdavPath, {
        responseType: 'arraybuffer'
    });
    await env.webdav.delete(webdavPath);
    return resp.data;
}

/**
 * Export an object of impex files to JSON objects in xml2js form
 *
 * returns:
 * {
 *     "meta/system-objecttype-extensions.xml": {
 *          ...
 *     }
 * }
 *
 * @param {Environment} env
 * @param {ExportDataUnitsConfiguration} dataUnits
 * @return {Promise<Map<string, object>>}
 */
async function siteArchiveExportJSON(env, dataUnits) {
    var _export = await siteArchiveExportText(env, dataUnits);
    var jsonMap = new Map();
    for (const entry of _export.entries()) {
        let [filename, contents] = entry;
        if (filename.endsWith(".json")) {
            jsonMap.set(filename, JSON.parse(contents));
        } else if (filename.endsWith('.xml')) {
            jsonMap.set(filename, await xml2js.parseStringPromise(contents));
        } else {
            jsonMap.set(filename, contents);
        }
    }
    return jsonMap;
}

/**
 * Imports an object of impex filenames to objects to XML/JSON/text
 *
 * @param {Environment} env
 * @param {Map<string, object>} data
 * @return {Promise<void>}
 */
async function siteArchiveImportJSON(env, data) {
    var now = (new Date()).toISOString()
        .replace(/[:.-]+/g, '');
    var archiveDir = `${now}_export`;

    var zip = new AdmZip();
    var builder = new xml2js.Builder();

    for (const [filename, content] of data.entries()) {
        logger.debug(`adding ${archiveDir}/${filename} to archive`);
        if (filename.endsWith(".json")) {
            zip.addFile(`${archiveDir}/${filename}`, Buffer.from(JSON.stringify(content, null, 2), "utf8"));
        } else if (filename.endsWith('.xml')) {
            var xmlStr = builder.buildObject(content);
            zip.addFile(`${archiveDir}/${filename}`, Buffer.from(xmlStr, "utf8"));
        } else {
            zip.addFile(`${archiveDir}/${filename}`, Buffer.from(content, "utf8"));
        }
    }

    return await siteArchiveImport(env, zip.toBuffer(), {
        archiveName: archiveDir
    })
}

/**
 * Export an object of impex files to strings of XML
 *
 * returns:
 * {
 *     "meta/system-objecttype-extensions.xml": "<?xml version=\"1.0\"...."
 * }
 *
 * @param {Environment} env
 * @param {ExportDataUnitsConfiguration} dataUnits
 * @return {Promise<Map<string, string>>}
 */
async function siteArchiveExportText(env, dataUnits) {
    var now = (new Date()).toISOString()
        .replace(/[:.-]+/g, '');
    var archiveDir = `${now}_export`;
    var zipFilename = `${archiveDir}.zip`;

    const data = await siteArchiveExport(env, dataUnits, zipFilename);

    var zip = new AdmZip(data);
    var zipEntries = zip.getEntries();

    return new Map(zipEntries.map((e) => {
        return [
            e.entryName.substr(`${archiveDir}/`.length),
            zip.readAsText(e)
        ]
    }))
}

/**
 * Import filename to text strings as site impex
 *
 * @param {Environment} env
 * @param {Map<string, string>} data
 * @return {Promise<void>}
 */
async function siteArchiveImportText(env, data) {
    var now = (new Date()).toISOString()
        .replace(/[:.-]+/g, '');
    var archiveDir = `${now}_export`;

    var zip = new AdmZip();

    for (const [filename, content] of data.entries()) {
        logger.debug(`adding ${archiveDir}/${filename} to archive`);
        zip.addFile(`${archiveDir}/${filename}`, Buffer.from(content, "utf8"));
    }

    return await siteArchiveImport(env, zip.toBuffer(), {
        archiveName: archiveDir
    })
}

/**
 * @typedef {Object} ResourceDocument
 * @property {string} resource_id
 * @property {number} cache_time
 * @property {string[]} methods
 * @property {string} read_attributes
 * @property {string} write_attributes
 */

/**
 * This callback is displayed as part of the Requester class.
 * @callback permissionValidatorCallback
 * @returns {boolean} true if permission is validated
 */

/**
 *
 * @param {ResourceDocument} a
 * @param {ResourceDocument} b
 * @returns {boolean} true if the documents are trivially equal
 */
function compareResourceDocuments(a, b) {
    return (
        a.resource_id === b.resource_id
        && (a.methods.length === b.methods.length && a.methods.every((v) => b.methods.includes(v)))
        && (a.read_attributes === b.read_attributes)
        && (a.write_attributes === b.write_attributes)
    );
}

/**
 * Ensures the environment has access to the given DATA API resources by adding or updating
 * Resource Documents for the client ID.
 *
 * If changes are made `validator` will be called asynchronously until it returns true
 *
 * Note: this method only trivially compares resource identifiers, methods and read/write attributes. If all
 * values are equal to the instance's state the resource will not be updated.
 *
 * @param {Environment} env
 * @param {ResourceDocument[]} resources array of resources to add/update
 * @param {permissionValidatorCallback} validator array of resources to add/update
 * @param {object} options
 * @param {number} [options.maximumChecks] maximum number of permission checks
 * @return {Promise<void>}
 */
async function ensureDataAPIPermissions(env, resources = [], validator, options = {maximumChecks: 60}) {
    const {maximumChecks} = options;
    const currentClientID = env.clientID;
    if (!resources.length) {
        throw new Error("Resources must not be empty");
    }

    logger.info(`Ensuring DATA API permissions for clientID ${currentClientID}`);

    const archive = await siteArchiveExportText(env, {
        global_data: {
            ocapi_settings: true
        }
    });

    archive.delete('ocapi-settings/wapi_shop_config.json');
    var dataAPIConfig = JSON.parse(archive.get('ocapi-settings/wapi_data_config.json'));

    var currentConfig = dataAPIConfig.clients.find((config) => config.client_id === currentClientID);
    var hasUpdatedAnything = false;

    resources.reverse().forEach((resource) => {
        let idx = currentConfig.resources.findIndex((r) => r.resource_id === resource.resource_id);
        if (idx === -1) {
            hasUpdatedAnything = true;
            currentConfig.resources.unshift(resource);
        } else if (!compareResourceDocuments(currentConfig.resources[idx], resource)) { // update
            hasUpdatedAnything = true;
            currentConfig.resources[idx] = resource;
        }
    });

    if (hasUpdatedAnything) {
        archive.set('ocapi-settings/wapi_data_config.json', JSON.stringify(dataAPIConfig, null, 2));
        await siteArchiveImportText(env, archive);

        var iterations = 1;
        while (iterations <= maximumChecks) {
            logger.warn(`Checking for updated permissions (try ${iterations} / ${maximumChecks})...`);
            try {
                var checkResult = await validator();
                if (checkResult) {
                    break;
                }
                logger.debug(`Permissions check returned falsey value`);
            } catch (e) {
                logger.debug(`Permissions check exception: ${e.message}`)
            }
            await sleep(2000);
            iterations++;
        }
    } else {
        logger.info('No permissions update required');
    }
}

module.exports = {
    executeJob,
    waitForJob,
    siteArchiveExportText,
    siteArchiveImportText,
    siteArchiveImport,
    siteArchiveExport,
    siteArchiveExportJSON,
    siteArchiveImportJSON,
    ensureDataAPIPermissions
}
