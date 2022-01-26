const {Environment, logger} = require("@SalesforceCommerceCloud/b2c-tools");

async function dummyCommand() {
    var env = new Environment();

    logger.warn(`Currently using ${env.server}`)

    var sites = await env.ocapi.get('sites?select=(**)');
    for (let site of sites.data.data) {
        console.log(`\t${site.id}: ${site.display_name.default}`)
    }
}

module.exports = {
    command: 'dummy',
    desc: 'dummy command',
    builder: (yargs) => yargs,
    handler: async (argv) => await dummyCommand()
};
