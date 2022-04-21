#!/usr/bin/env node
/**
 * b2c-tools CLI Entry Point
 */

const path = require('path');
const logger = require('./lib/logger');
const {cli} = require('./lib/config');

// support .env files
require('dotenv').config({ override: true })

cli
    .epilogue('For more information, read our manual at https://github.com/SalesforceCommerceCloud/b2c-tools')
    .commandDir(path.join(__dirname, 'lib'), {
        include: /command.*/
    })
    .fail(function (msg, err, yargs) {
        if (err) {
            logger.error(err.message);
            logger.debug(err.stack);
        } else {
            console.error(yargs.help());
            console.error();
            console.error(msg);
        }
        process.exit(1);
    })
    .demandCommand()
    .strictCommands()
    .help()
    .parse()
