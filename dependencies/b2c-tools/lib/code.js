const logger = require('./logger');
const archiver = require('archiver');
const path = require('path');
const querystring = require('querystring');
const glob = require('glob');

const UNZIP_BODY = querystring.stringify({
    method: 'UNZIP'
});

/**
 * @typedef {Object} CartridgeMapping
 * @property {string} dest - cartridge name
 * @property {string} src - directory
 */

/**
 * Find Cartridges recursively in the working directory
 *
 * @param {string} [directory] - directory search for cartridges
 * @return {CartridgeMapping[]}
 */
function findCartridges(directory) {
    if (!directory) {
        directory = process.cwd();
    }
    var projectFiles = glob.sync('.project', {
        matchBase: true,
        ignore: '**/node_modules/**',
        cwd: directory
    });
    var cartridges = projectFiles.map(f => {
        var dirname = path.dirname(f);
        var cartridge = path.basename(dirname);
        return {
            dest: cartridge,
            src: dirname
        };
    });
    return cartridges;
}

/**
 * Reloads (or activates) the environments code version
 *
 * @param {Environment} env
 * @return {Promise<void>}
 */
async function reloadCodeVersion(env) {
    var resp = await env.ocapi.get('code_versions');
    var activeVersion = resp.data.data.filter((cv) => cv.active).pop();
    if (activeVersion.id === env.codeVersion) {
        var anyOtherVersion = resp.data.data.filter((cv) => cv.id !== env.codeVersion).pop();
        if (anyOtherVersion) {
            logger.debug(`Activating ${anyOtherVersion.id}`)
            await env.ocapi.patch(`code_versions/${anyOtherVersion.id}`, {
                active: true
            });
        } else {
            throw new Error("Cannot find alternate code version to activate");
        }
    }
    logger.debug(`Activating ${env.codeVersion}`)
    await env.ocapi.patch(`code_versions/${env.codeVersion}`, {
        active: true
    });
}

/**
 * Syncs the given cartridge mapping (src:dest) to the environments code version
 *
 * @param {Environment} env
 * @param {CartridgeMapping[]} cartridges
 * @param {boolean} reload
 * @return {Promise<void>}
 */
async function syncCartridges(env, cartridges, reload = false) {
    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    var now = (new Date()).getTime();

    cartridges.forEach(c => archive.directory(c.src, path.join(env.codeVersion, c.dest)));
    var uploadPath = `Cartridges/_sync-${now}.zip`;
    archive.finalize();

    try {
        await env.webdav.put(uploadPath, archive);
        logger.debug(`${uploadPath} uploaded`);
        await env.webdav.post(uploadPath, UNZIP_BODY);
        logger.debug(`${uploadPath} unzipped`);
        logger.info(`[UPLOAD] uploaded to ${env.server} code version ${env.codeVersion}`);
        await env.webdav.delete(uploadPath);
        logger.debug(`${uploadPath} deleted`);
        if (reload) {
            logger.info("Reloading code version...");
            try {
                await reloadCodeVersion(env)
            } catch (e) {
                logger.error("Could not reload code version; You may need to do this manually: ");
                logger.error(e.message || e);
            }
        }
    } catch (e) {
        logger.error(e.message || e);
    }
}

/**
 * Downloads the code version as a zipped archive
 *
 * @param {Environment} env
 * @return {Promise<Buffer>}
 */
async function downloadCodeVersion(env) {
    var webdavPath = `Cartridges/${env.codeVersion}?method=ZIP`;
    var zipPath = `Cartridges/${env.codeVersion}.zip`

    logger.debug(`Zipping cartridges: ${webdavPath}`);
    var resp = await env.webdav.post(webdavPath);
    logger.debug(`Downloading archive ${zipPath}`);
    resp = await env.webdav.get(zipPath, {
        responseType: 'arraybuffer'
    });
    logger.debug(`Deleting archive ${zipPath}`);
    await env.webdav.delete(zipPath);
    return resp.data;
}

module.exports = {
    syncCartridges,
    reloadCodeVersion,
    findCartridges,
    downloadCodeVersion
}
