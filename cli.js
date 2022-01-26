#!/usr/bin/env node

// import yargs CLI stub and all commands + logger
const {cli, commands, logger} = require('@SalesforceCommerceCloud/b2c-tools');
// optionally import individual commands
// const exportCommand = require('b2c-tools/lib/command-export');

// extend b2c-tools cli
cli
    .epilogue('Example CLI')
    .command(require('./dummy'))
    .command(commands)
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
    .help()
    .parse()
