const path = require("path");
const fs = require("fs");

const MY_PROJECT_METADATA_VERSION = 1;

/**
 * @typedef {object} MyProjectMetadata
 * @property {number} version
 * @property {string} lastCatalogImport - date of last dev catalog import
 */

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
    onBootstrap: async function ({env, logger, helpers}) {
        const {ensureDataAPIPermissions, siteArchiveImportText} = helpers;

        // Core permissions
        await ensureDataAPIPermissions(env, REQUIRED_RESOURCES, async () => {
            // check that we can read sites, and the first site if there is one
            var sites = await env.ocapi.get('sites');
            if (sites.data.data.count) {
                var firstSiteID = sites.data.data[0].id
                await env.ocapi.get(`sites/${firstSiteID}`);
            }
            return true;
        });

        // add our custom project metadata
        var prefs = `<?xml version="1.0" encoding="UTF-8"?>
            <preferences xmlns="http://www.demandware.com/xml/impex/preferences/2007-03-31">
                <custom-preferences>
                    <development><preference preference-id="b2cDemoMetadataVersion">${MY_PROJECT_METADATA_VERSION}</preference></development>
                </custom-preferences>
            </preferences>
        `;
        await siteArchiveImportText(env, new Map([
            ["meta/system-objecttype-extensions.xml", PROJECT_METADATA],
            ["preferences.xml", prefs]
        ]))

        await ensureDataAPIPermissions(env, [{
            'resource_id': '/global_preferences/preference_groups/b2cDemoMetadata/development',
            'methods': [
                'get',
                'patch'
            ],
            'read_attributes': '(**)',
            'write_attributes': '(**)'
        }], async () => {
            await env.ocapi.get('global_preferences/preference_groups/b2cDemoMetadata/development');
            return true;
        })
    },

    /**
     * Determines if a project should bootstrap
     *
     * @param {object} args
     * @param {import('@SalesforceCommerceCloud/b2c-tools').Environment} args.env
     * @param {import('@SalesforceCommerceCloud/b2c-tools').logger} args.logger
     * @param {import('@SalesforceCommerceCloud/b2c-tools').B2C_MIGRATION_HELPERS} args.helpers
     * @returns {Promise<void>}
     */
    shouldBootstrap: async function ({env, logger, helpers}) {
        let resp = await env.ocapi.get('global_preferences/preference_groups/b2cDemoMetadata/development')
        if (!resp.data.c_b2cDemoMetadataVersion || resp.data.c_b2cDemoMetadataVersion < MY_PROJECT_METADATA_VERSION) {
            return true;
        }
    },

    /**
     * Runs before all migrations. The migrationsToRun list can be mutated to change the list
     * of migrations to run
     *
     * @param {object} args
     * @param {import('@SalesforceCommerceCloud/b2c-tools').Environment} args.env
     * @param {import('@SalesforceCommerceCloud/b2c-tools').logger} args.logger
     * @param {import('@SalesforceCommerceCloud/b2c-tools').B2C_MIGRATION_HELPERS} args.helpers
     * @param {string[]} migrationsToRun list of migrations that will be run (mutable)
     * @param {boolean} willApply true if migrations will be applied to the instance
     * @param {boolean} dryRun
     * @returns {Promise<void>}
     */
    beforeAll: async function ({env, logger, helpers}, migrationsToRun, willApply, dryRun) {
        if (dryRun) {
            return; // don't run on dry runs
        }

        logger.info("==== RUNNING COMMON METADATA IMPORT ====")
        await helpers.siteArchiveImport(env, path.join(helpers.CONFIG.MIGRATIONS_DIR, "_METADATA"));
        logger.info("==== FINISHED COMMON METADATA IMPORT ====")

        if (!env.server.includes("staging") && !env.server.includes("development")) {
            logger.info("==== RUNNING SANDBOX METADATA IMPORT ====")
            await helpers.siteArchiveImport(env, path.join(helpers.CONFIG.MIGRATIONS_DIR, "_METADATA_DEVONLY"));
            logger.info("==== FINISHED SANDBOX METADATA IMPORT ====")

            // fancier project-specific business logic
            let resp = await env.ocapi.get('global_preferences/preference_groups/b2cDemoMetadata/development')
            let projectConfig = JSON.parse(resp.data.c_b2cDemoMetadata || '{}');

            // check for dev catalog import
            let catalogImport = path.join(helpers.CONFIG.MIGRATIONS_DIR, '_DEV_CATALOG.zip');
            if (fs.existsSync(catalogImport)) {
                let _fstats = fs.statSync(catalogImport);
                if (!projectConfig.lastCatalogImport || (new Date(projectConfig.lastCatalogImport)) <= _fstats.mtime) {
                    logger.info("==== IMPORTING DEV CATALOG ====")
                    await helpers.siteArchiveImport(env, catalogImport);
                    await env.ocapi.patch(`/global_preferences/preference_groups/b2cDemoMetadata/development`, {
                        c_b2cDemoMetadata: JSON.stringify({lastCatalogImport: (new Date()).toISOString()})
                    });
                    logger.info("==== FINISHED IMPORTING DEV CATALOG ====")
                } else {
                    logger.info("no dev catalog update needed")
                }
            }
        }

    },

    /**
     * Runs before each migration; Return false to skip this migration
     *
     * @param {object} args
     * @param {import('@SalesforceCommerceCloud/b2c-tools').Environment} args.env
     * @param {import('@SalesforceCommerceCloud/b2c-tools').logger} args.logger
     * @param {import('@SalesforceCommerceCloud/b2c-tools').B2C_MIGRATION_HELPERS} args.helpers
     * @param {string} migration migration to be run
     * @param {boolean} willApply true if migrations will be applied to the instance
     * @returns {Promise<boolean>} return false to skip the current migration
     */
    beforeEach: async function ({env, logger, helpers}, migration, willApply) {
        if (env.server.includes("staging") && migration.includes('NOSTAGING')) {
            return false;
        }
    },

    /**
     * Runs after each migration
     *
     * @param {object} args
     * @param {import('@SalesforceCommerceCloud/b2c-tools').Environment} args.env
     * @param {import('@SalesforceCommerceCloud/b2c-tools').logger} args.logger
     * @param {import('@SalesforceCommerceCloud/b2c-tools').B2C_MIGRATION_HELPERS} args.helpers
     * @param {string} migration migration to be run
     * @param {boolean} willApply true if migrations will be applied to the instance
     * @returns {Promise<void>}
     */
    afterEach: async function ({env, logger, helpers}, migration, willApply) {
    },

    /**
     * Runs after all migrations
     *
     * @param {object} args
     * @param {import('@SalesforceCommerceCloud/b2c-tools').Environment} args.env
     * @param {import('@SalesforceCommerceCloud/b2c-tools').logger} args.logger
     * @param {import('@SalesforceCommerceCloud/b2c-tools').B2C_MIGRATION_HELPERS} args.helpers
     * @param {string[]} migrationsRan list of migrations ran
     * @param {boolean} willApply true if migrations will be applied to the instance
     * @returns {Promise<void>}
     */
    afterAll: async function ({env, logger, helpers}, migrationsRan, willApply) {
    },

    /**
     * Runs on migration exception. Re-raise the exception or a new Error to stop execution
     * Ignoring the error will continue.
     *
     * @param {object} args
     * @param {import('@SalesforceCommerceCloud/b2c-tools').Environment} args.env
     * @param {import('@SalesforceCommerceCloud/b2c-tools').logger} args.logger
     * @param {import('@SalesforceCommerceCloud/b2c-tools').B2C_MIGRATION_HELPERS} args.helpers
     * @param {string} migration migration to be run
     * @param {Error} e exception raised during migration run
     * @returns {Promise<void>} re-raise exception or new exception to stop migration run
     */
    onFailure: async function ({env, logger, helpers}, migration, exc) {
        if (migration.includes("MAY_NOT_WORK")) {
            return;
        }
        throw exc;
    }
}

const REQUIRED_RESOURCES = [
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
        'resource_id': '/sites/**'
    },
    {
        'methods': [
            'get'
        ],
        'read_attributes': '(**)',
        'resource_id': '/catalogs'
    },
    {
        'methods': [
            'get'
        ],
        'read_attributes': '(**)',
        'resource_id': '/inventory_lists'
    },
    {
        'methods': [
            'get',
            'delete'
        ],
        'read_attributes': '(**)',
        'write_attributes': '(**)',
        'resource_id': '/system_object_definitions/**'
    },
];


const PROJECT_METADATA = `<?xml version="1.0" encoding="UTF-8"?>
<metadata xmlns="http://www.demandware.com/xml/impex/metadata/2006-10-31">
    <type-extension type-id="OrganizationPreferences">
        <custom-attribute-definitions>
            <attribute-definition attribute-id="b2cDemoMetadataVersion">
                <display-name xml:lang="x-default">b2c-tools Metadata Version</display-name>
                <description xml:lang="x-default"></description>
                <type>int</type>
                <mandatory-flag>false</mandatory-flag>
                <externally-managed-flag>true</externally-managed-flag>
            </attribute-definition>
            <attribute-definition attribute-id="b2cDemoMetadata">
                <display-name xml:lang="x-default">b2cDemoMetadata</display-name>
                <description xml:lang="x-default"></description>
                <type>text</type>
                <mandatory-flag>false</mandatory-flag>
                <externally-managed-flag>true</externally-managed-flag>
                <default-value>{}</default-value>
            </attribute-definition>
        </custom-attribute-definitions>
        <group-definitions>
            <attribute-group group-id="b2cDemoMetadata">
                <display-name xml:lang="x-default">My Project Meta</display-name>
                <attribute attribute-id="b2cDemoMetadataVersion"/>
                <attribute attribute-id="b2cDemoMetadata"/>
            </attribute-group>
        </group-definitions>
    </type-extension>
</metadata>
`;

