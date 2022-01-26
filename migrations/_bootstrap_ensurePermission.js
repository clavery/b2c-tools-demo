/**
 * Adds additional permissions required by this project
 *
 * @param {Environment} env
 * @param {Logger} logger
 * @param {MigrationHelpers} helpers
 * @return {Promise<void>}
 */
module.exports = async function ({env, logger, helpers}) {
    const {ensureDataAPIPermissions} = helpers;

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
