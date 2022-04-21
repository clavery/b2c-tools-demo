var semver = require("semver");

/**
 * Super contrived example to demonstrate various methods of interacting with an instance via migration script
 * Moves values from old custom pref to new one
 * Deletes old attribute
 *
 * @param {object} args
 * @param {import('@SalesforceCommerceCloud/b2c-tools').Environment} args.env
 * @param {import('@SalesforceCommerceCloud/b2c-tools').logger} args.logger
 * @param {import('@SalesforceCommerceCloud/b2c-tools').B2C_MIGRATION_HELPERS} args.helpers
 * @return {Promise<void>}
 */
module.exports = async function ({env, logger, helpers}) {
    const {siteArchiveExportJSON, siteArchiveImportJSON, siteArchiveImportText} = helpers;

    if (semver.lt(helpers.version, '0.1.4')) {
        throw new Error(`Invalid Version. Please upgrade to b2c-tools >=0.1.4 (current: ${helpers.version})`)
    }

    logger.info("Exporting existing preferences for testPreferenceForDemo");

    let sites = await env.ocapi.get('sites');
    let siteExportConfig = {};

    for (let site of sites.data.data) {
        siteExportConfig[site.id] = {
            site_preferences: true
        }
    }
    let archive = await siteArchiveExportJSON(env, {
        sites: siteExportConfig
    });

    let foundValue = false;
    for (let site of sites.data.data) {
        let sitePrefs = archive.get(`sites/${site.id}/preferences.xml`);
        delete sitePrefs.preferences["standard-preferences"]

        for (let instanceGroup of ["all-instances", "development", "staging", "production"]) {
            let group = sitePrefs.preferences["custom-preferences"][0][instanceGroup][0];
            // filter, extract and rename preference via xml2js
            if (group.preference) {
                group.preference = group.preference.filter((p) => p["$"]["preference-id"] === "testPreferenceForDemo");
                if (group.preference.length) {
                    foundValue = true;
                    group.preference[0]["$"]["preference-id"] = "testPreferenceForDemo2";
                }
            }
        }
    }

    logger.info("Importing new attribute");
    // import the new attribute as raw XML
    await siteArchiveImportText(env, new Map([
        ["meta/system-objecttype-extensions.xml", NEW_ATTR]
    ]))

    if (foundValue) {
        // copy existing values and modified ids over
        logger.info("copying old values");
        await siteArchiveImportJSON(env, archive)
    }

    // delete the old attribute
    logger.info("deleting old attribute");
    await env.ocapi.delete('system_object_definitions/SitePreferences/attribute_definitions/testPreferenceForDemo');
}

const NEW_ATTR = `<?xml version="1.0" encoding="UTF-8"?>
<metadata xmlns="http://www.demandware.com/xml/impex/metadata/2006-10-31">
    <type-extension type-id="SitePreferences">
        <custom-attribute-definitions>
            <attribute-definition attribute-id="testPreferenceForDemo2">
                <display-name xml:lang="x-default">Test Preference For demo 2</display-name>
                <description xml:lang="x-default"></description>
                <type>text</type>
                <mandatory-flag>false</mandatory-flag>
                <externally-managed-flag>false</externally-managed-flag>
            </attribute-definition>
        </custom-attribute-definitions>
        <group-definitions>
            <attribute-group group-id="TestDemoPrefs">
                <display-name xml:lang="x-default">Test Demo Prefs</display-name>
                <attribute attribute-id="testPreferenceForDemo2"/>
            </attribute-group>
        </group-definitions>
    </type-extension>
</metadata>
`;
