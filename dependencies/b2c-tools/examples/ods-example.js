const {Environment} = require("../lib");
const {syncCartridges, findCartridges} = require("../lib/code");
const {migrateInstance} = require("../lib/migrations");
const path = require("path");

/**
 *
 * Example launch ODS and import
 *
 * @param {object} options
 * @param {Environment} options.env
 * @param {Logger} options.logger
 * @param {MigrationHelpers} options.helpers
 * @return {Promise<void>}
 */
module.exports = async function ({env, logger, helpers}) {
    var realm = process.env.SFCC_REALM;

    logger.info(`Launching sandbox in ${realm}`)
    var resp = await env.ods.post('sandboxes', {
        "realm": realm,
        "ttl": 24,
        "autoScheduled": false,
        "resourceProfile": "medium",
        settings: sandboxSettings(env.clientID)
    })

    var sandboxID = resp.data.data.id;
    var state = resp.data.data.state;
    var hostname = resp.data.data.hostName;
    logger.info(`Started sandbox ${sandboxID}`)

    while (state !== 'started') {
        await helpers.sleep(5000);
        let resp = await env.ods.get(`sandboxes/${sandboxID}`)
        state = resp.data.data.state;
        logger.info("Waiting for sandbox....")
    }

    var targetEnv = new Environment({
        server: hostname,
        codeVersion: 'autodeploy',
        // don't use any local webdav connection, only clientID
        username: undefined,
        password: undefined
    })

    logger.info("Uploading cartridges")
    var cartridges = findCartridges(path.join(__dirname, './catridges'));
    await syncCartridges(targetEnv, cartridges, true);

    logger.info("Running migrations")
    await migrateInstance(targetEnv, path.join(__dirname, './migrations'));
};

/* mostly same as sfcc-ci */
function sandboxSettings(clientID) {
    return {
        "ocapi": [
            {
                "client_id": clientID,
                resources: [
                    {
                        resource_id: "/code_versions",
                        methods: ["get"],
                        read_attributes: "(**)",
                        write_attributes: "(**)"
                    },
                    {
                        resource_id: "/code_versions/*", methods: ["patch", "delete"],
                        read_attributes: "(**)", write_attributes: "(**)"
                    },
                    {
                        resource_id: "/jobs/*/executions",
                        methods: ["post"],
                        read_attributes: "(**)",
                        write_attributes: "(**)"
                    },
                    {
                        resource_id: "/jobs/*/executions/*",
                        methods: ["get"],
                        read_attributes: "(**)",
                        write_attributes: "(**)"
                    },
                    {
                        resource_id: "/sites/*/cartridges",
                        methods: ["post"],
                        read_attributes: "(**)",
                        write_attributes: "(**)"
                    }
                ]

            }
        ],
        "webdav": [
            {
                "client_id": clientID,
                permissions: [
                    {path: "/logs", operations: ["read"]},
                    {path: "/impex", operations: ["read_write"]},
                    {path: "/cartridges", operations: ["read_write"]},
                    {path: "/static", operations: ["read_write"]}
                ]

            }
        ]
    }
}