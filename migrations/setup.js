const boostrapEnsurePermissions = require('./_bootstrap_ensurePermission');
const path = require("path");

module.exports = {
    /**
     * Runs after migration self-bootstrapping, on tool metadata upgrades or when `--force-boostrap` is
     * specified. Projects can use this to provide additional setup, permissions or custom functionality
     * required by migration scripts or lifecycle methods.
     *
     * @param {object} args
     * @param {import('@SalesforceCommerceCloud/b2c-tools').Environment} args.env
     * @param {import('@SalesforceCommerceCloud/b2c-tools').logger} args.logger
     * @param {import('@SalesforceCommerceCloud/b2c-tools').B2C_MIGRATION_HELPERS} args.helpers
     * @returns {Promise<void>}
     */
    onBootstrap: async function({env, logger, helpers}) {
        await boostrapEnsurePermissions({env, logger, helpers});
    },

    /**
     * Runs before all migrations. The migrationsToRun list can be mutated to change the list
     * of migrations to run
     *
     * @param {Environment} env
     * @param {Logger} logger
     * @param {MigrationHelpers} helpers
     * @param {string[]} migrationsToRun list of migrations that will be run (mutable)
     * @param {boolean} willApply true if migrations will be applied to the instance
     * @param {boolean} dryRun
     * @returns {Promise<void>}
     */
    beforeAll: async function({env, logger, helpers}, migrationsToRun, willApply, dryRun) {
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
     * Runs before each migration; Return false to skip this migration
     *
     * @param {Environment} env
     * @param {Logger} logger
     * @param {MigrationHelpers} helpers
     * @param {string} migration migration to be run
     * @param {boolean} willApply true if migrations will be applied to the instance
     * @returns {Promise<boolean>} return false to skip the current migration
     */
    beforeEach: async function({env, logger, helpers}, migration, willApply) {},

    /**
     * Runs after each migration
     *
     * @param {Environment} env
     * @param {Logger} logger
     * @param {MigrationHelpers} helpers
     * @param {string} migration migration to be run
     * @param {boolean} willApply true if migrations will be applied to the instance
     * @returns {Promise<void>}
     */
    afterEach: async function({env, logger, helpers}, migration, willApply) {},

    /**
     * Runs after all migrations
     *
     * @param {Environment} env
     * @param {Logger} logger
     * @param {MigrationHelpers} helpers
     * @param {string[]} migrationsRan list of migrations ran
     * @param {boolean} willApply true if migrations will be applied to the instance
     * @returns {Promise<void>}
     */
    afterAll: async function({env, logger, helpers}, migrationsRan, willApply) {},

    /**
     * Runs on migration exception. Re-raise the exception or a new Error to stop execution
     * Ignoring the error will continue.
     *
     * @param {Environment} env
     * @param {Logger} logger
     * @param {MigrationHelpers} helpers
     * @param {string} migration migration to be run
     * @param {Error} e exception raised during migration run
     * @returns {Promise<void>} re-raise exception or new exception to stop migration run
     */
    onFailure: async function({env, logger, helpers}, migration, e) {
        throw e;
    }
}
