const logger = require("./logger");
const {findCartridges, syncCartridges, downloadCodeVersion} = require("./code");
const Environment = require("./environment");
const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

async function codeDeploy(reload = false, cartridges, excludeCartridges) {
    logger.info('Finding cartridges...');
    var _cartridges = findCartridges();
    if (cartridges && cartridges.length) {
        _cartridges = _cartridges.filter((c) => cartridges.includes(c.dest))
    }
    if (excludeCartridges && excludeCartridges.length) {
        _cartridges = _cartridges.filter((c) => !excludeCartridges.includes(c.dest))
    }
    if (!_cartridges) {
        throw new Error("No cartridges found");
    }
    _cartridges.forEach(c => logger.info(`\t${c.dest}`));
    logger.debug(cartridges);
    var env = new Environment();
    logger.info('Syncing cartridges...');
    await syncCartridges(env, _cartridges, reload);
}

async function codeDownload(outputDir, cartridges, mirror = false, excludeCartridges) {
    logger.info('Downloading cartridges...');
    var localCartridges = {};
    if (mirror) {
        var _cartridges = findCartridges();
        if (cartridges && cartridges.length) {
            _cartridges = _cartridges.filter((c) => cartridges.includes(c.dest))
        }
        _cartridges.forEach((c) => localCartridges[c.dest] = c)
        logger.debug("local cartridges to mirror", _cartridges);
    }
    var env = new Environment();
    const archive = await downloadCodeVersion(env);

    var zip = new AdmZip(archive);

    if (zip.getEntryCount() === 0) {
        throw new Error(`Code version ${env.codeVersion} empty`)
    }
    logger.info('Extracting cartridges...');
    zip.getEntries().forEach((entry) => {
        const entryParts = entry.entryName.split('/');
        if (entryParts.length < 3) {
            return;
        }
        // eslint-disable-next-line no-unused-vars
        const codeVersion = entryParts.shift();
        const cartridgeName = entryParts.shift();

        if (cartridges && cartridges.length && !cartridges.includes(cartridgeName)) {
            return;
        } else if (excludeCartridges && excludeCartridges.length && excludeCartridges.includes(cartridgeName)) {
            return;
        } else if (mirror && localCartridges[cartridgeName]) {
            let outputPath = entryParts.join('/');
            let targetFileName = path.join(localCartridges[cartridgeName].src, outputPath);
            var oldMode = null;
            if (fs.existsSync(targetFileName)) {
                oldMode = fs.statSync(targetFileName).mode;
            }
            zip.extractEntryTo(entry, localCartridges[cartridgeName].src, false, true, false, outputPath);
            if (oldMode) {
                fs.chmodSync(targetFileName, oldMode);
            }
        } else {
            let outputPath = path.join(cartridgeName, entryParts.join('/'));
            let targetFileName = path.join(outputDir, outputPath);
            oldMode = null;
            if (fs.existsSync(targetFileName)) {
                oldMode = fs.statSync(targetFileName).mode;
            }
            zip.extractEntryTo(entry, outputDir, false, true, false, outputPath);
            if (oldMode) {
                fs.chmodSync(targetFileName, oldMode);
            }
        }
    })
}

module.exports = {
    command: 'code',
    desc: 'manage code versions',
    builder: (yargs) => yargs
        .command('deploy', 'deploy cartridges to code version',
            async (y) => y
                .option('r', {
                    desc: 'reload code version',
                    alias: 'reload',
                    default: true
                })
                .group(['reload'], 'Code Deployment'),
            async (argv) => await codeDeploy(argv.reload, argv.cartridge, argv['exclude-cartridges'])
        )
        .command('download', 'download cartridges from code version',
            async (y) => y
                .option('o', {
                    desc: 'cartridge output dir',
                    alias: 'output',
                    default: './cartridges'
                })
                .option('mirror', {
                    desc: 'download cartridges to their local directory',
                    type: 'boolean',
                    default: false
                })
                .group(['output', 'mirror'], 'Code Dowload'),
            async (argv) => await codeDownload(argv.output, argv.cartridge, argv.mirror, argv['exclude-cartridges'])
        )
        .demandCommand()
};
