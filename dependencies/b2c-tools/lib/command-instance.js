const logger = require('./logger');
const inquirer = require('inquirer');
const questions = require('./questions');
const fs = require('fs');
const open = require('open');
const fsPromise = require('fs').promises;

/**
 *
 * @param {string} hostname
 */
function configNameFromHostname(hostname) {
    return hostname.split('.')
        .shift();
}

async function setupDwjson(configFile) {
    logger.info('Please answer the following questions.');
    var answers = await inquirer.prompt([questions.SERVER, questions.USERNAME, questions.PASSWORD, questions.CODE_VERSION], {});

    if (fs.existsSync(configFile)) {
        var configName = configNameFromHostname(answers.server);
        logger.warn(`A dw.json file already exists. Add an additional config named ${configName}?`);
        var confirmAnswers = await inquirer.prompt([questions.CONFIRM]);
        if (!confirmAnswers.confirm) {
            return;
        }

        var newDwJson = JSON.parse(fs.readFileSync(configFile)
            .toString());
        newDwJson.configs = newDwJson.configs || [];
        newDwJson.configs.push({
            name: configName,
            hostname: answers.server,
            username: answers.username,
            password: answers.password,
            'code-version': answers.codeVersion,
            active: false
        });
        logger.info('You can set this configuration as the default with `instance set`');
    } else {
        newDwJson = {
            name: configNameFromHostname(answers.server),
            hostname: answers.server,
            username: answers.username,
            password: answers.password,
            'code-version': answers.codeVersion,
            active: true
        };
    }

    await fsPromise.writeFile(configFile, JSON.stringify(newDwJson, null, 2));
    logger.info('Sucessfully Wrote new dw.json file...');
}

async function setActiveDwjson(instance, configFile) {
    if (fs.existsSync(configFile)) {
        var newDwJson = JSON.parse(fs.readFileSync(configFile)
            .toString());
        if (!newDwJson.configs) {
            logger.warn('No alternate configs found; Run dw.json setup to add additional');
        }
        var answers = await inquirer.prompt([questions.DW_JSON_CONFIG_NAME(configFile)], {
            configName: instance
        });
        var activeServer = newDwJson.hostname;
        if ((newDwJson.name === answers.configName) || (!newDwJson.name && answers.configName === 'Default')) {
            newDwJson.active = true;
        }
        for (var i = 0; i < newDwJson.configs.length; i++) {
            let _c = newDwJson.configs[i];
            if (_c.name === answers.configName) {
                _c.active = true;
                activeServer = _c.hostname;
                newDwJson.active = false;
            } else {
                _c.active = false;
            }
        }
        logger.info(`Setting ${activeServer} as default config for all commands`);
        await fsPromise.writeFile(configFile, JSON.stringify(newDwJson, null, 2));
    } else {
        logger.warn('No dw.json found...exiting');
    }
}

module.exports = {
    command: 'instance',
    desc: 'project setup commands',
    builder: (yargs) => {
        return yargs
            .command('setup', 'create or add to dwjson',
                async (y) => y,
                async (argv) => {
                    await setupDwjson(argv.config);
                }
            )
            .command('set [name]', 'set active instance in dw.json',
                async (y) => y.positional('name', {
                    describe: 'name to set active'
                }),
                async (argv) => await setActiveDwjson(argv.name, argv.config)
            )
            .command('debug', 'debugging cli environment',
                async (y) => y,
                async (argv) => {
                    console.log(argv);
                }
            )
            .command('open', 'open business manager',
                async (yargs) => yargs,
                async (argv) => {
                    if (!argv.server) {
                        throw new Error("No server specified or configured");
                    }
                    var url = `https://${argv.server}/on/demandware.store/Sites-Site`;
                    logger.info(`Opening ${url}`);
                    open(url);
                }
            )
            .command('list', 'list instances',
                async (y) => y,
                async (argv) => {
                    if (fs.existsSync(argv.config)) {
                        var dwJson = JSON.parse(fs.readFileSync(argv.config)
                            .toString());
                        var names = [];
                        if (dwJson.configs) {
                            names = dwJson.configs.map((c) => {
                                return `${c.name}${c.active ? ' (default)' : ''}`;
                            });

                        }
                        if (dwJson.name) {
                            names.unshift(`${dwJson.name}${dwJson.active ? ' (default)' : ''}`);
                        }
                        logger.info('Instance names:\n' + names.join('\n'));
                    }
                }
            )
            .demandCommand();
    }
};
