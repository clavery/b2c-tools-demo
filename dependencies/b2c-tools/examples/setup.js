/* eslint-disable no-unused-vars */
/*
Example of a lifecycle module to show various real-world use cases
of lifecycle methods
 */

const path = require("path");

module.exports = {
    /**
     * OnBootstrap runs everytime the tool determines the sandbox
     * or client ID needs to be bootstraped
     *
     * @param {Environment} env
     * @param {Logger} logger
     * @param {MigrationHelpers} helpers
     * @return {Promise<void>}
     */
    onBootstrap: async function ({env, helpers}) {
        const {ensureDataAPIPermissions} = helpers;

        // ensure we have access to additional data API resources for migration scripts and code deployments
        await ensureDataAPIPermissions(env, DATA_API_RESOURCES, async () => {
            // check that we can read code versions
            await env.ocapi.get('code_versions');
            await env.ocapi.get('sites');
            return true;
        });
    },

    /**
     *
     * @param env
     * @param logger
     * @param helpers
     * @param migrationsToRun {string[]}
     * @param willApply {boolean}
     * @param dryRun {boolean}
     * @return {Promise<void>}
     */
    beforeAll: async function ({env, logger, helpers}, migrationsToRun, willApply, dryRun) {
        if (dryRun) {
            return; // don't run on dry runs
        }

        logger.info("==== RUNNING COMMON METADATA IMPORT ====")
        await helpers.siteArchiveImport(env, path.join(helpers.CONFIG.MIGRATIONS_DIR, "_METADATA"));
        logger.info("==== FINISHED COMMON METADATA IMPORT ====")

        if (!env.server.includes("staging")) {
            logger.info("==== RUNNING DEVONLY METADATA IMPORT ====")
            await helpers.siteArchiveImport(env, path.join(helpers.CONFIG.MIGRATIONS_DIR, "_METADATA_DEVONLY"));
            logger.info("==== FINISHED DEVONLY METADATA IMPORT ====")
        }
    },

    /**
     * Runs before every migration, returning false will skip running but apply
     *
     * @param env
     * @param logger
     * @param helpers
     * @param migration {string}
     * @param willApply {boolean}
     * @return {Promise<boolean>}
     */
    beforeEach: async function ({env, logger, helpers}, migration, willApply) {
        if (env.server.includes("staging") && migration.includes('NOSTAGING')) {
            return false;
        }
    },

    /**
     *
     * @param env
     * @param logger
     * @param helpers
     * @param migration
     * @param exc
     * @return {Promise<void>}
     */
    onFailure: async function ({env, logger, helpers}, migration, exc) {
        if (migration.includes("MAY_NOT_WORK")) {
            return;
        }
        throw exc;
    },

    afterEach: async function ({env, logger, helpers}, migration, applied) {
        logger.debug('afterEach');
    },

    afterAll: async function ({env, logger, helpers}, migrationsRan, applied) {
        logger.debug('afterAll');
    }
};


const DATA_API_RESOURCES = [
    {
        'methods': [
            'get'
        ],
        'read_attributes': '(**)',
        'resource_id': '/sites'
    },
    {
        'methods': [
            'get',
            'put',
            'post',
            'delete',
            'patch'
        ],
        'read_attributes': '(**)',
        'write_attributes': '(**)',
        'resource_id': '/sites/**'
    },
    {
        "methods": [
            "get"
        ],
        "read_attributes": "(**)",
        "resource_id": "/code_versions",
        "write_attributes": "(**)"
    }, {
        "methods": [
            "patch",
            "delete"
        ],
        "read_attributes": "(**)",
        "resource_id": "/code_versions/*",
        "write_attributes": "(**)"
    }
];
