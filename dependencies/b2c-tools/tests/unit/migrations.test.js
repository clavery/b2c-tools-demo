const path = require("path");

const Environment = require('../../lib/environment');
const {siteArchiveImport, siteArchiveExportText} = require('../../lib/jobs');
const setupFixture = require('../fixtures/migrations/setup')
const nullScriptMigration = require('../fixtures/migrations/null_script_migration')
const {B2C_TOOLKIT_DATA_VERSION, migrateInstance, runMigrationScript} = require('../../lib/migrations');

const MIGRATIONS_DIR = path.join(__dirname, "../fixtures/migrations");

jest.mock('../../lib/environment');
jest.mock('../../lib/jobs');
jest.mock('../fixtures/migrations/setup');
jest.mock('../fixtures/migrations/null_script_migration');

let env;
beforeAll(() => {
    nullScriptMigration.mockImplementation(() => {
    })
    siteArchiveExportText.mockImplementation(async () => {
        return new Map([
            ["ocapi-settings/wapi_shop_config.json", ""],
            ["ocapi-settings/wapi_data_config.json", JSON.stringify({
                clients: [
                    {
                        client_id: "1234",
                        resources: []
                    }
                ]
            })]
        ])
    })
    Environment.mockImplementation((opts) => {
        return Object.assign(opts, {
            ocapi: {
                get: jest.fn(async () => {
                    return {
                        data: {
                            c_b2cToolkitDataVersion:  B2C_TOOLKIT_DATA_VERSION,
                            c_b2cToolkitMigrations: ""
                        }
                    }
                }),
                patch: jest.fn(async () => {
                    return {}
                })
            },
        });
    });
});
beforeEach(() => {
    jest.clearAllMocks();
    env = new Environment({
        'server': 'example.com',
        'clientID': '1234'
    });
});

test('should import impex directories', async () => {
    await migrateInstance(env, MIGRATIONS_DIR, ['^ignore.*'], true)
    // 3 directory migrations
    expect(siteArchiveImport).toHaveBeenCalledTimes(3);
    expect(nullScriptMigration).toHaveBeenCalledTimes(1);
    expect(env.ocapi.patch).toHaveBeenCalledTimes(4);
})

test('should not write preferences if not applying', async () => {
    await migrateInstance(env, MIGRATIONS_DIR, ['^ignore.*'], false)
    expect(env.ocapi.patch).toHaveBeenCalledTimes(0);
})

test('should not import on dry run', async () => {
    await migrateInstance(env, MIGRATIONS_DIR, ['^ignore.*'], true, true)
    expect(siteArchiveImport).toHaveBeenCalledTimes(0);
})

test('lifecycle methods', async () => {
    await migrateInstance(env, MIGRATIONS_DIR, ['^ignore.*'], true)

    // no bootstrap under normal run
    expect(setupFixture.onBootstrap).toHaveBeenCalledTimes(0);
    // no failures under normal run
    expect(setupFixture.onBootstrap).toHaveBeenCalledTimes(0);

    expect(setupFixture.beforeAll).toHaveBeenCalledTimes(1);
    expect(setupFixture.afterAll).toHaveBeenCalledTimes(1);

    // all migrations should have before/after each
    expect(setupFixture.beforeEach).toHaveBeenCalledTimes(4);
    expect(setupFixture.afterEach).toHaveBeenCalledTimes(4);
})

test('should bootstrap when missing preferences', async () => {
    var getCalls = 0;
    Environment.mockImplementation(() => {
        return {
            clientID: '1234',
            ocapi: {
                get: jest.fn(async (url) => {
                    getCalls++;
                    // return correct response after boostrap
                    if (url === '/global_preferences/preference_groups/b2cToolkit/development' && getCalls >= 2) {
                        return {
                            data: {
                                c_b2cToolkitDataVersion: B2C_TOOLKIT_DATA_VERSION,
                                c_b2cToolkitMigrations: ""
                            }
                        }
                    } else {
                        throw {
                            response: {status: 404}
                        }
                    }
                }),
                patch: jest.fn(async () => {
                    return {}
                })
            },
        };
    });
    env = new Environment({
        'server': 'example.com',
        'clientID': '1234'
    });
    await migrateInstance(env, MIGRATIONS_DIR, ['^ignore.*'], true, true)
    // import preferences but no migrations (dry-run)
    expect(siteArchiveImport).toHaveBeenCalledTimes(1);
    expect(setupFixture.onBootstrap).toHaveBeenCalledTimes(1);
})

test('should call onFailure on failed import and continue if no exception', async () => {
    siteArchiveImport.mockImplementation(() => {
        throw "Error"
    });
    await migrateInstance(env, MIGRATIONS_DIR, ['^ignore.*'], true)
    expect(siteArchiveImport).toHaveBeenCalledTimes(3);
    expect(setupFixture.onFailure).toHaveBeenCalledTimes(3);
})

test('should call onFailure on failed import and reject', async () => {
    siteArchiveImport.mockImplementation(() => {
        throw "Error"
    });
    setupFixture.onFailure.mockImplementation(() => {
        throw "Error"
    })
    await expect(async () => {
        await migrateInstance(env, MIGRATIONS_DIR, ['^ignore.*'], true)
    }).rejects
})

test('should skip migraiton on beforeEach returning false', async () => {
    setupFixture.beforeEach.mockImplementation(() => {
        return false;
    })
    await migrateInstance(env, MIGRATIONS_DIR, ['^ignore.*'], true);
    expect(setupFixture.beforeEach).toHaveBeenCalledTimes(4);
    expect(siteArchiveImport).toHaveBeenCalledTimes(0);
})
