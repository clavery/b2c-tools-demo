/**
 * Contrived example to demonstrate various methods of interacting with an instance via migration script
 * Moves values from old custom pref to new one
 * Deletes old attribute
 *
 * @param {Environment} env
 * @param {Logger} logger
 * @param {MigrationHelpers} helpers
 * @return {Promise<void>}
 */
module.exports = async function ({env, logger, helpers}) {
    const {siteArchiveExportJSON, siteArchiveImportJSON, siteArchiveImportText} = helpers;

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

        for (let instanceGroup in ["all-instances", "development", "staging", "production"]) {
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

    // import the new attribute as raw XML
    await siteArchiveImportText(env, new Map([
        ["meta/system-objecttype-extensions.xml", NEW_ATTR]
    ]))

    if (foundValue) {
        // copy existing values and modified ids over
        await siteArchiveImportJSON(env, archive)
    }

    // delete the old attribute
    try {
        await env.ocapi.delete('system_object_definitions/SitePreferences/attribute_definitions/testPreferenceForDemo');
    } catch(e) { /* ignore */ }
}

const NEW_ATTR = `
<?xml version="1.0" encoding="UTF-8"?>
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
    </type-extension>

</metadata>
`;
