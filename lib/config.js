/*
 * Configuration store for options pattern
 */

const yargs = require("yargs");
const fs = require("fs");
const logger = require("./logger");
const winston = require("winston");
const path = require("path");

exports.CONFIG = {
    ENVIRONMENT: {}
};

function setupLogging(debug = false) {
    logger.clear()
        .add(new winston.transports.Console({
            level: debug ? 'debug' : 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.simple()
            )
        }));
    if (debug) {
        logger.add(new winston.transports.File({
            filename: 'debug.log',
            level: 'debug',
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.timestamp({format: 'shortTime'})
            )
        }))
    }
}

exports.cli = yargs
    .env("SFCC")
    .option('debug', {
        alias: 'D',
        describe: 'output debug logging (also to debug.log)',
        type: 'boolean',
        default: false
    })
    .option('i', {
        alias: 'instance',
        describe: 'instance name in config file',
    })
    .option('verify', {
        describe: 'verify SSL',
        type: 'boolean',
        default: true
    })
    .option('s', {
        alias: 'server',
        describe: 'b2c instance hostname'
    })
    .option('secure-server', {
        describe: 'b2c instance hostname (webdav write access)'
    })
    .option('certificate', {
        describe: 'path to pkcs12 certificate'
    })
    .option('passphrase', {
        describe: 'passphrase for certificate'
    })
    .option('u', {
        alias: 'username',
        describe: 'webdav username',
    })
    .option('p', {
        alias: 'password',
        describe: 'password/webdav access key'
    })
    .option('client-id', {
        alias: 'oauth-client-id',
        describe: 'API client ID'
    })
    .option('client-secret', {
        alias: 'oauth-client-secret',
        describe: 'API client secret'
    })
    .option('code-version', {
        describe: 'b2c code version'
    })
    .option('cartridge', {
        describe: 'cartridges (Default: autodetect)',
        type: 'array'
    })
    .option('config', {
        describe: 'path to dw.json config',
        default: 'dw.json'
    })
    .group(['i', 's', 'u', 'p', 'client-id', 'client-secret', 'code-version', 'verify', 'secure-server', 'certificate', 'passphrase', 'cartridge'], "B2C Connection:")
    // Load default configs from "b2c-tools" key in package.json (if present)
    .pkgConf("b2c-tools")
    .middleware(function (argv, _yargs) {
        setupLogging(argv.debug);
    })
    // load from a dw.json (or specific config in same format) and fallback defaults
    .middleware(function (argv, yargs) {
        var hasDwJson = fs.existsSync(argv.config);
        var hasDwJs = fs.existsSync('./dw.js');
        var dwJson;

        // if a './dw.js' module is found require it and use the object it exports as the config source
        // this is also used by prophet debugger so we can shim in multi-config support to that tool per-project
        // if an instance or custom config is provided assume we want to read directly from config file
        if (hasDwJs && !argv.instance && yargs.parsed.defaulted.config === true) {
            logger.debug(`Loading configuration from dw.js`);
            dwJson = require(path.resolve(process.cwd(), 'dw.js'));
        } else if (hasDwJson) {
            logger.debug(`Loading configuration from ${argv.config}`);
            dwJson = JSON.parse(fs.readFileSync(argv.config, 'utf-8'));
        }

        // only assume dw.json usage if not explicitly provided a server via higher priority configuration
        // to avoid merging incompatible configuration assumptions
        if (dwJson && !argv.server) {
            // Support jetbrains plugin style multi-config: https://smokeelow.visualstudio.com/Intellij%20SFCC/_wiki/wikis/intellij-sfcc.wiki/25/dw.json?anchor=multiple-connections
            if (Array.isArray(dwJson.configs)) {
                if (argv.instance) {
                    if (dwJson.name === argv.instance) {
                        var _config = dwJson;
                    } else {
                        _config = dwJson.configs.find((v) => v.name === argv.instance);
                    }
                    if (!_config) {
                        logger.warn(`Cannot find ${argv.instance} in ${argv.config}`);
                        return;
                    }
                } else if (dwJson.active === false) { // default config is inactive; find active one
                    _config = dwJson.configs.find((v) => v.active === true);
                }
                if (_config) {
                    dwJson = _config;
                }
            }

            argv.server = argv.s = dwJson.hostname;
            argv.username = argv.u = dwJson.username;
            argv.password = argv.p = dwJson.password;

            // code version should always use configuration priority
            argv["code-version"] = argv["code-version"] ? argv["code-version"] : (dwJson["code-version"] ? dwJson["code-version"] : undefined);

            if (dwJson["client-id"]) { // don't set if empty string
                argv["client-id"] = argv["oauth-client-id"] = dwJson["client-id"];
            }
            if (dwJson["client-secret"]) {
                argv["client-secret"] = argv["oauth-client-secret"] = dwJson["client-secret"];
            }
            if (dwJson["name"] && !argv.instance) {
                argv.instance = argv.i = dwJson["name"];
            }
            // if self-signed is set and we have not explicitly asked to (no)verify then don't
            if (dwJson["self-signed"] === true && yargs.parsed.defaulted.verify === true) {
                argv.verify = false;
            }

            if (dwJson["certificatePath"] && !argv.certificate) {
                argv.certificate = dwJson["certificatePath"];
            }
            if (dwJson["certificatePassphrase"] && !argv.passphrase) {
                argv.passphrase = dwJson["certificatePassphrase"];
            }
            if (dwJson["secureHostname"] && !argv["secure-server"]) {
                argv["secure-server"] = dwJson["secureHostname"];
            }

            if (dwJson.cartridge && Array.isArray(dwJson.cartridge) && !argv["cartridge"]) {
                argv["cartridge"] = dwJson.cartridge;
            }
        }

        // finally allow providing of defaultClientId if we do not have one at this stage
        // (i.e. project-level from package.json)
        if (!argv["client-id"] && argv.defaultClientId) {
            argv["client-id"] = argv.defaultClientId;
        }
    })
    .middleware(function (argv, _yargs) {
        // set b2c connection info to global config store
        exports.CONFIG.ENVIRONMENT = Object.assign(exports.CONFIG.ENVIRONMENT, {
            server: argv.server,
            secureServer: argv["secure-server"],
            username: argv.username,
            password: argv.password,
            clientID: argv['client-id'],
            clientSecret: argv['client-secret'],
            codeVersion: argv['code-version'],
            verify: argv.verify,
            certificate: argv.certificate,
            passphrase: argv.passphrase,
            cartridges: argv.cartridge
        });
    })

