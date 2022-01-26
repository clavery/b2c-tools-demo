const xml2js = require('xml2js');

const Environment = require('./environment');
const util = require('./util');
const logger = require('./logger');

/**
 * @typedef {Object} LogFile
 * @property {string} name
 * @property {Date} lastModified
 */

/**
 * Get the logs from the instance
 *
 * @param env {Environment}
 * @return {Promise<LogFile[]>}
 */
async function getLogs(env) {
    var resp = await env.webdav({
        url: 'Logs/',
        method: 'PROPFIND'
    });
    var xml = await xml2js.parseStringPromise(resp.data);

    return xml.multistatus.response.map((_resp) => {
        let prop = _resp.propstat[0].prop[0];
        let name = prop.displayname[0];
        // getlastmodified: Array(1) [Sat, 04 Dec 2021 02:32:05 GMT]
        let _lastModified = prop.getlastmodified[0];
        if (prop.resourcetype[0].collection) {
            // is dir
            return;
        }
        let lastModified = new Date(Date.parse(_lastModified));
        return {
            name,
            lastModified
        };
    })
        .filter((_file) => !!_file);
}

/**
 *
 * @param filters {string[]}
 * @return {Promise<void>}
 */
async function tailCommand(filters) {
    /* @type Environment */
    var env = new Environment();


    var contentPositions = {};

    // eslint-disable-next-line no-constant-condition
    while (true) {
        var logs = await getLogs(env);
        for (const filter of filters) {
            var targetLogs = logs.filter((l) => l.name.substr(0, filter.length) === filter);
            if (!targetLogs || !targetLogs.length) {
                continue;
            }
            targetLogs.sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime());
            var targetLog = targetLogs.pop();

            // TODO: this probably doesn't support multi-byte utf-8 chars; fix to calculate actual byte offset
            var currentPosition = contentPositions[targetLog.name];
            if (currentPosition) {
                try {
                    var resp = await env.webdav.get(`Logs/${targetLog.name}`, {
                        headers: {
                            "range": `bytes=${currentPosition}-`
                        }
                    });
                } catch(e) {
                    if (e.response.status === 416) {
                        continue;
                    } else {
                        throw e;
                    }
                }
                // TODO better regexp split
                var logEntries = [resp.data.split(/(?<=^)\[/m)].filter((entry) => entry !== "");
                contentPositions[targetLog.name] = resp.data.length + currentPosition;
            } else {
                // initial request
                resp = await env.webdav.get(`Logs/${targetLog.name}`);
                logEntries = [resp.data.split(/(?<=^)\[/m).pop()];
                contentPositions[targetLog.name] = resp.data.length;
            }

            if (resp.data.length) {
                console.log('-'.repeat(targetLog.name.length + 6));
                logger.info(targetLog.name);
                console.log('-'.repeat(targetLog.name.length + 6));
                // kindy hacky
                console.log(logEntries.map((e) => "[" + e).join(''));
                console.log('');
            }
        }
        await util.sleep(3000);
    }
}

module.exports = {
    command: 'tail',
    desc: 'watch instance logs',
    builder: (yargs) => yargs
        .option('f', {
            alias: 'filter',
            default: ['error-', 'customerror-'],
            describe: 'log prefixes to watch',
            type: 'array'
        }),
    handler: async (argv) => await tailCommand(argv.filter)
};
