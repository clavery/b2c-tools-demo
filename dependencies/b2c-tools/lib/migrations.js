/*
 * Implements B2C Data "migrations"
 *
 * See README.md and MIGRATIONS.md for usage and overview
 */

const { Buffer } = require('buffer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const {
    waitForJob,
    siteArchiveImport,
    siteArchiveExport,
    siteArchiveExportJSON,
    siteArchiveImportJSON,
    siteArchiveExportText,
    siteArchiveImportText,
    ensureDataAPIPermissions
} = require('./jobs');
const logger = require('./logger');
const { sleep } = require('./util');

const B2C_TOOLKIT_DATA_VERSION = 4;

/**
 * Find all migration directories and scripts; excluding those matching the given patterns
 *
 * @param dir {string}
 * @param exclude {string[]}
 * @return {Promise<string[]>}
 */
async function collectMigrations(dir, exclude = []) {
    return (await fs.promises.readdir(dir, { withFileTypes: true }))
        .filter((d) => {
            // valid migrations are directories (impex) or javascript files
            return (d.isDirectory() || path.extname(d.name) === '.js')
                && exclude.every((re) => !d.name.match(re));
        })
        .filter((entry) => entry.name !== 'setup.js')
        .map((d) => d.name)
        .sort((a, b) => a.localeCompare(b, 'en', { numeric: false }));
}

/**
 * @class MigrationHelpers
 */
const B2C_MIGRATION_HELPERS = {
    waitForJob,
    siteArchiveImport,
    siteArchiveExport,
    siteArchiveImportJSON,
    siteArchiveExportJSON,
    siteArchiveImportText,
    siteArchiveExportText,
    ensureDataAPIPermissions,
    sleep
};


/**
 * @typedef {Object} MigrationScriptArguments
 * @property {Environment} env
 * @property {Logger} logger
 * @property {MigrationHelpers} helpers
 */

/**
 *
 * @callback MigrationScriptCallback
 * @param {MigrationScriptArguments} args
 * @returns {Promise<boolean|void>}
 */

/**
 * @typedef {Object} ToolkitInstanceState
 * @property {number} b2cToolkitDataVersion
 * @property {string} b2cToolkitMigrations
 */

/**
 * @callback OnBootstrapLifecycleFunction
 * @param {MigrationScriptArguments} args
 * @returns {Promise<void>}
 */

/**
 * @callback BeforeAllLifecycleFunction
 * @param {MigrationScriptArguments} args
 * @param {string[]} migrationsToRun list of migrations that will be run (mutable)
 * @param {boolean} willApply true if migrations will be applied to the instance
 * @returns {Promise<void>}
 */

/**
 * @callback BeforeEachLifecycleFunction
 * @param {MigrationScriptArguments} args
 * @param {string} migration migration to be run
 * @param {boolean} willApply true if migrations will be applied to the instance
 * @returns {Promise<boolean>} return false to skip the current migration
 */

/**
 * @callback AfterEachLifecycleFunction
 * @param {MigrationScriptArguments} args
 * @param {string} migration migration to be run
 * @param {boolean} willApply true if migrations will be applied to the instance
 * @returns {Promise<void>}
 */

/**
 * @callback AfterAllLifecycleFunction
 * @param {MigrationScriptArguments} args
 * @param {string[]} migrationsRan list of migrations ran
 * @param {boolean} willApply true if migrations will be applied to the instance
 * @returns {Promise<void>}
 */

/**
 * @callback OnFailureLifecycleFunction
 * @param {MigrationScriptArguments} args
 * @param {string} migration migration to be run
 * @param {Error} e exception raised during migration run
 * @returns {Promise<void>} re-raise exception or new exception to stop migration run
 */

/**
 * @typedef {Object} MigrationLifecycleFunctions
 * @property {OnBootstrapLifecycleFunction|undefined} onBootstrap
 * @property {BeforeAllLifecycleFunction|undefined} beforeAll
 * @property {BeforeEachLifecycleFunction|undefined} beforeEach
 * @property {AfterAllLifecycleFunction|undefined} afterEach
 * @property {AfterAllLifecycleFunction|undefined} afterAll
 * @property {OnFailureLifecycleFunction|undefined} onFailure
 */

/**
 * Get the instance state from global preferences
 *
 * @param env {Environment}
 * @return {Promise<ToolkitInstanceState>}
 */
async function getInstanceState(env) {
    try {
        var resp = await env.ocapi.get(`/global_preferences/preference_groups/b2cToolkit/development`);
        return {
            b2cToolkitDataVersion: resp.data.c_b2cToolkitDataVersion,
            b2cToolkitMigrations: resp.data.c_b2cToolkitMigrations ? resp.data.c_b2cToolkitMigrations.split(',') : []
        };
    } catch (e) {
        if (e.response && e.response.status === 403) {
            logger.warn('No access to global_preferences; will attempt to update during bootstrap');
            return null; // will attempt to upgrade OCAPI through the import
        } else if (e.response && e.response.status === 404) {
            logger.debug('No global_preferences found; update required');
            return null;
        } else {
            throw e;
        }
    }
}

/**
 * Imports the latest toolkit metadata
 *
 * @param {Environment} env
 * @param {MigrationLifecycleFunctions} lifeCycleModule
 * @return {Promise<void>}
 */
async function updateInstanceMetadata(env, lifeCycleModule) {
    var zip = new AdmZip();

    var now = (new Date()).getTime();
    var archiveName = `${now}-import`;

    var metaData = await fs.promises.readFile(path.resolve(__dirname, 'templates/toolkit-metadata.xml'));
    var prefs = `<?xml version="1.0" encoding="UTF-8"?>
<preferences xmlns="http://www.demandware.com/xml/impex/preferences/2007-03-31">
    <custom-preferences>
        <development><preference preference-id="b2cToolkitDataVersion">${B2C_TOOLKIT_DATA_VERSION}</preference></development>
    </custom-preferences>
</preferences>
`;
    zip.addFile(`${archiveName}/preferences.xml`, Buffer.from(prefs, 'utf8'), 'prefs');
    zip.addFile(`${archiveName}/meta/system-objecttype-extensions.xml`, metaData, 'metadata');

    var zipBuffer = await zip.toBufferPromise();
    try {
        await siteArchiveImport(env, zipBuffer, archiveName);
    } catch (e) {
        if (e.response && e.response.status === 403) {
            throw new Error(`Got status 403: At minimum your client ID (${env.clientID}) needs OCAPI DATAAPI access for jobs and webdav write access to /impex; see README.md`);
        } else {
            throw e;
        }
    }

    await ensureDataAPIPermissions(env, [{
        'methods': [
            'get',
            'patch'
        ],
        'read_attributes': '(**)',
        'resource_id': '/global_preferences/preference_groups/b2cToolkit/development',
        'write_attributes': '(**)'
    }], async () => {
        await env.ocapi.get('/global_preferences/preference_groups/b2cToolkit/development');
        return true;
    })

    if (typeof lifeCycleModule.onBootstrap === 'function') {
        logger.info('Calling project onBootstrap...');
        await lifeCycleModule.onBootstrap({
            env,
            logger,
            helpers: B2C_MIGRATION_HELPERS
        });
    }
}

/**
 * Updates instance with new migrations set
 * @param env {Environment}
 * @param migrations {string[]}
 * @return {Promise<void>}
 */
async function updateInstanceMigrations(env, migrations) {
    try {
        await env.ocapi.patch(`/global_preferences/preference_groups/b2cToolkit/development`, {
            c_b2cToolkitMigrations: migrations.join(',')
        });
    } catch (e) {
        if (e.response.status === 403) {
            throw new Error('Permissions error; Ensure you have global_preferences configured for your client ID (run with --force-bootstrap to force a bootstrap upgrade)');
        } else if (e.response.status === 404) {
            throw new Error('Unable to set migrations');
        } else {
            throw e;
        }
    }
}

/**
 * Inspects an instance and executes site impex imports and "migration scripts" from the
 * given `dir`.
 *
 * @param {Environment} env
 * @param {string} dir migrations directory
 * @param {string[]} exclude array of regular expression strings
 * @param {boolean} apply should migrations be applied to the instance after running?
 * @param {boolean} dryRun only output migrations to be run
 * @param {boolean} forceBootstrap
 * @return {Promise<void>}
 */
async function migrateInstance(env, dir, exclude = [], apply = true, dryRun = false, forceBootstrap = false) {
    var projectMigrations = await collectMigrations(dir, exclude);
    logger.debug(`Project Migrations ${projectMigrations.join(',')}`);
    logger.info('Getting instance migration state...');
    var instanceState = await getInstanceState(env);

    /** @type MigrationLifecycleFunctions */
    var lifeCycleModule = {};
    if (fs.existsSync(path.join(dir, 'setup.js'))) {
        lifeCycleModule = require(path.resolve(dir, 'setup.js'));
    }

    if (forceBootstrap || !instanceState || !instanceState.b2cToolkitDataVersion || instanceState.b2cToolkitDataVersion < B2C_TOOLKIT_DATA_VERSION) {
        logger.warn('Toolkit metadata bootstrap required...');
        await updateInstanceMetadata(env, lifeCycleModule);
        instanceState = await getInstanceState(env);
    } else if (instanceState && instanceState.b2cToolkitDataVersion > B2C_TOOLKIT_DATA_VERSION) {
        throw new Error('Instance is using a b2c-tools version greater than currently installed; upgrade required');
    }

    logger.debug(JSON.stringify(instanceState, null, 2));

    var instanceMigrations = instanceState.b2cToolkitMigrations.slice();
    var migrationsToApply = projectMigrations.filter((m) => !instanceMigrations.includes(m));

    if (typeof lifeCycleModule.beforeAll === 'function') {
        logger.debug('Calling lifecycle function beforeAll');
        await lifeCycleModule.beforeAll({
            env,
            logger,
            helpers: B2C_MIGRATION_HELPERS
        }, migrationsToApply, apply);
    }

    if (migrationsToApply.length === 0) {
        logger.info(`No migrations required. Instance is up to date (last: ${instanceMigrations ? instanceMigrations.pop() : 'none'})`);
        return;
    }

    logger.info(`${migrationsToApply.length} Migrations Required:\n      ${migrationsToApply.join('\n      ')}`);

    if (dryRun) {
        logger.warn('Dry run requested. Will not run migrations.');
        return;
    }

    logger.info(`Running migrations on ${env.server}...`);
    var migrationsRan = [];
    for (const migration of migrationsToApply) {
        let now = (new Date()).getTime();

        var target = path.join(dir, migration);
        var fileStat = await fs.promises.stat(target);

        var runMigration = true;
        if (typeof lifeCycleModule.beforeEach === 'function') {
            logger.debug('Calling lifecycle function beforeEach');
            runMigration = await lifeCycleModule.beforeEach({
                env,
                logger,
                helpers: B2C_MIGRATION_HELPERS
            }, migration, apply);
        }

        if (runMigration !== false) {
            try {
                if (fileStat.isDirectory()) {
                    await siteArchiveImport(env, path.join(dir, migration));
                } else {
                    /** @type MigrationScriptCallback */
                    await runMigrationScript(env, target);
                }
            } catch (e) {
                logger.error(`[${migration}] Unable to execute migration`);
                if (typeof lifeCycleModule.onFailure === 'function') {
                    logger.warn('Calling lifecycle function onFailure');
                    await lifeCycleModule.onFailure({
                        env,
                        logger,
                        helpers: B2C_MIGRATION_HELPERS
                    }, migration, e);
                    logger.warn(`[${migration}] onFailure handled exception, ignoring error...`);
                } else {
                    throw e;
                }
            }
        } else {
            logger.warn(`[${migration}] skipping execution due to lifecycle function...`);
        }

        instanceMigrations.push(migration);

        if (apply) {
            logger.debug(`Applying new migrations: ${instanceMigrations}`);
            await updateInstanceMigrations(env, instanceMigrations);
        }

        if (typeof lifeCycleModule.afterEach === 'function') {
            logger.debug('Calling lifecycle function afterEach');
            await lifeCycleModule.afterEach({
                env,
                logger,
                helpers: B2C_MIGRATION_HELPERS
            }, migration, apply);
        }

        let timeToRun = (new Date()).getTime() - now;
        migrationsRan.push(migration);
        logger.info(`[${migration}] Migrated in (${timeToRun / 1000}s)`);
    }

    if (typeof lifeCycleModule.afterAll === 'function') {
        logger.debug('Calling lifecycle function afterAll');
        await lifeCycleModule.afterAll({
            env,
            logger,
            helpers: B2C_MIGRATION_HELPERS
        }, migrationsRan, apply);
    }
}

/**
 *
 * @param {Environment} env
 * @param {string} target path to migration script
 * @return {Promise<boolean>}
 */
async function runMigrationScript(env, target) {
    const migrationScript = require(path.resolve(target));
    if (typeof migrationScript !== 'function') {
        throw new Error(`${target} is not a valid migration; should export a function`);
    }
    await migrationScript.call(null, {
        env,
        logger,
        helpers: B2C_MIGRATION_HELPERS
    });
}

module.exports = {
    B2C_TOOLKIT_DATA_VERSION,
    B2C_MIGRATION_HELPERS,
    migrateInstance,
    runMigrationScript
};
