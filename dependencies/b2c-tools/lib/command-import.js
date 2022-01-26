const fsPromise = require('fs').promises;
const path = require('path');

const Environment = require('./environment');
const { siteArchiveImport } = require('./jobs');
const { migrateInstance, runMigrationScript } = require('./migrations');

module.exports = {
    command: 'import',
    desc: 'manage data imports and migrations',
    builder: (yargs) => yargs
        .command('run <target>', 'import an impex archive or run a script migration',
            (y) => y
                .positional('target', { describe: 'archive zip, extracted folder in impex format, or migration script' }),
            async (argv) => {
                var fileStat = await fsPromise.stat(argv.target);
                const env = new Environment();
                if (fileStat.isFile() && path.extname(argv.target) === '.js') {
                    await runMigrationScript(env, argv.target);
                } else { // regular archive
                    await siteArchiveImport(env, argv.target);
                }
            }
        )
        .command('migrate', 'run and apply migrations to instance',
            (y) => y
                .option('force-bootstrap', {
                    describe: 'force a bootstrap install/upgrade',
                    type: 'boolean',
                    default: false
                })
                .option('exclude-migrations', {
                    alias: 'x',
                    describe: 'ignored directory patterns (regexp)',
                    type: 'array'
                })
                .option('apply', {
                    describe: 'apply to instance',
                    default: true
                })
                .option('dry-run', {
                    describe: 'show only migrations that would be applied',
                    default: false
                })
                .option('migrations-dir', {
                    describe: 'migrations dir',
                    default: './migrations'
                })
                .boolean(['apply', 'dry-run'])
                .group(['apply', 'migrations-dir', 'exclude-migrations', 'force-bootstrap', 'dry-run'], 'Migrations:'),
            async (argv) => {
                const env = new Environment();
                await migrateInstance(env, argv['migrations-dir'], argv['exclude-migrations'], argv.apply, argv['dry-run'], argv["force-bootstrap"]);
            }
        )
        .demandCommand()
};
