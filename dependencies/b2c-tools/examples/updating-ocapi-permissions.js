/**
 * Example migration script for updating DATA API permissions using the helper
 *
 * Can be used standalone, as a migration, or during boostrap
 *
 * @param {Environment} env
 * @param {Logger} logger
 * @param {MigrationHelpers} helpers
 * @return {Promise<void>}
 */
module.exports = async function ({env, logger, helpers}) {
    const {ensureDataAPIPermissions} = helpers;

    logger.info("Ensuring additional permissions are available...")

    await ensureDataAPIPermissions(env, REQUIRED_RESOURCES, async () => {
        // check that we can read sites
        var sites = await env.ocapi.get('sites');
        var firstSiteID = sites.data.data[0].id
        await env.ocapi.get(`sites/${firstSiteID}`);
        return true;
    });
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
    }
];
