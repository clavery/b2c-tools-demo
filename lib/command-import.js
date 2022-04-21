const fsPromise = require('fs').promises;
const path = require('path');

const Environment = require('./environment');
const { siteArchiveImport } = require('./jobs');
const { migrateInstance, runMigrationScript } = require('./migrations');

module.exports = {
    command: 'import',
    desc: 'manage data imports and migrations',
    builder: (yargs) => yargs
        .option('migrations-dir', {
            describe: 'migrations dir',
            default: './migrations'
        })
        .option('k', {
            alias: 'keep-archive',
            describe: 'keep site-import archives on instance',
            type: 'boolean',
            default: false
        })
        .command('run <target>', 'import an impex archive or run a script migration',
            (y) => y
                .positional('target', { describe: 'archive zip, extracted folder in impex format, or migration script' }),
            async (argv) => {
                var fileStat = await fsPromise.stat(argv.target);
                const env = new Environment();
                if (fileStat.isFile() && path.extname(argv.target) === '.js') {
                    await runMigrationScript(env, argv.target);
                } else { // regular archive
                    await siteArchiveImport(env, argv.target, {
                        keepArchive: argv.k
                    });
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
                .option('allow-bootstrap', {
                    describe: 'allow bootstrapping of instance',
                    type: 'boolean',
                    default: true
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
                .boolean(['apply', 'dry-run'])
                .group(['apply', 'migrations-dir', 'exclude-migrations', 'allow-bootstrap', 'force-bootstrap', 'dry-run'], 'Migrations:'),
            async (argv) => {
                const env = new Environment();
                await migrateInstance(env, argv['migrations-dir'], argv['exclude-migrations'], argv.apply, argv['dry-run'], argv["force-bootstrap"], argv["allow-bootstrap"]);
            }
        )
        .demandCommand()
};
