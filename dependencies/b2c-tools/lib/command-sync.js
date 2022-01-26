const { findCartridges, syncCartridges } = require('./code');
const logger = require('./logger');
const Environment = require('./environment');

async function syncCommand(cartridges = [], reload = false) {
    logger.info('Finding cartridges...');
    var _cartridges = findCartridges();
    if (cartridges.length) {
        _cartridges = _cartridges.filter((c) => cartridges.includes(c.dest))
    }
    if (!_cartridges) {
        throw new Error("No cartridges found");
    }
    _cartridges.forEach(c => logger.info(`\t${c.dest}`));
    logger.debug(cartridges);
    var env = new Environment();
    logger.info('Syncing cartridges...');
    await syncCartridges(env, _cartridges, reload);
}

module.exports = {
    command: 'sync',
    desc: 'sync catridges and optional activate/reload code version',
    builder: (yargs) => yargs
        .option('cartridges', { describe: 'cartridges(s) to sync', type: 'array', default: []})
        .option('r', {
            alias: 'reload',
            default: true
        }),
    handler: async (argv) => await syncCommand(argv.cartridges, argv.reload)
};
