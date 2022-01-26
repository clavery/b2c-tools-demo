/*
 * b2c-tools
 * @module @SalesforceCommerceCloud/b2c-tools
 */

// eslint-disable-next-line no-unused-vars
const {AxiosInstance, AxiosError} = require('axios');
const {cli, CONFIG} = require('./config');
const version = require('../package.json').version;
const Environment = require('./environment');
const logger = require('./logger');
const {migrateInstance, runMigrationScript, B2C_MIGRATION_HELPERS} = require('./migrations')

const exportCommand = require('./command-export');
const importCommand = require('./command-import');
const instanceCommand = require('./command-instance');
const syncCommand = require('./command-sync');
const tailCommand = require('./command-tail');

const {
    waitForJob,
    siteArchiveImport,
    siteArchiveExport,
    siteArchiveExportJSON,
    siteArchiveExportText,
    siteArchiveImportText, siteArchiveImportJSON
} = require('./jobs');

module.exports = {
    version,
    cli, CONFIG, logger,
    Environment,
    migrateInstance, runMigrationScript, B2C_MIGRATION_HELPERS,

    // jobs
    waitForJob,
    siteArchiveImport,
    siteArchiveExport,
    siteArchiveExportJSON,
    siteArchiveImportJSON,
    siteArchiveExportText,
    siteArchiveImportText,

    commands: [exportCommand, importCommand, instanceCommand, syncCommand, tailCommand]
};
