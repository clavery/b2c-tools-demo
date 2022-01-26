export type MigrationScriptArguments = {
    env: Environment;
    logger: Logger;
    helpers: MigrationHelpers;
};
export type MigrationScriptCallback = (args: MigrationScriptArguments) => Promise<boolean | void>;
export type ToolkitInstanceState = {
    b2cToolkitDataVersion: number;
    b2cToolkitMigrations: string;
};
export type OnBootstrapLifecycleFunction = (args: MigrationScriptArguments) => Promise<void>;
export type BeforeAllLifecycleFunction = (args: MigrationScriptArguments, migrationsToRun: string[], willApply: boolean) => Promise<void>;
export type BeforeEachLifecycleFunction = (args: MigrationScriptArguments, migration: string, willApply: boolean) => Promise<boolean>;
export type AfterEachLifecycleFunction = (args: MigrationScriptArguments, migration: string, willApply: boolean) => Promise<void>;
export type AfterAllLifecycleFunction = (args: MigrationScriptArguments, migrationsRan: string[], willApply: boolean) => Promise<void>;
export type OnFailureLifecycleFunction = (args: MigrationScriptArguments, migration: string, e: Error) => Promise<void>;
export type MigrationLifecycleFunctions = {
    onBootstrap: OnBootstrapLifecycleFunction | undefined;
    beforeAll: BeforeAllLifecycleFunction | undefined;
    beforeEach: BeforeEachLifecycleFunction | undefined;
    afterEach: AfterAllLifecycleFunction | undefined;
    afterAll: AfterAllLifecycleFunction | undefined;
    onFailure: OnFailureLifecycleFunction | undefined;
};
export const B2C_TOOLKIT_DATA_VERSION: 4;
export namespace B2C_MIGRATION_HELPERS {
    export { waitForJob };
    export { siteArchiveImport };
    export { siteArchiveExport };
    export { siteArchiveImportJSON };
    export { siteArchiveExportJSON };
    export { siteArchiveImportText };
    export { siteArchiveExportText };
    export { sleep };
}
/**
 * Inspects an instance and executes site impex imports and "migration scripts" from the
 * given `dir`.
 *
 * @param {Environment} env
 * @param {string} dir migrations directory
 * @param {string[]} exclude array of regular expression strings
 * @param {boolean} apply should migrations be applied to the instance after running?
 * @param {boolean} dryRun only output migrations to be run
 * @param {boolean} forceBootstrap
 * @return {Promise<void>}
 */
export function migrateInstance(env: Environment, dir: string, exclude?: string[], apply?: boolean, dryRun?: boolean, forceBootstrap?: boolean): Promise<void>;
/**
 *
 * @param {Environment} env
 * @param {string} target path to migration script
 * @return {Promise<boolean>}
 */
export function runMigrationScript(env: Environment, target: string): Promise<boolean>;
import { waitForJob } from "./jobs";
import { siteArchiveImport } from "./jobs";
import { siteArchiveExport } from "./jobs";
import { siteArchiveImportJSON } from "./jobs";
import { siteArchiveExportJSON } from "./jobs";
import { siteArchiveImportText } from "./jobs";
import { siteArchiveExportText } from "./jobs";
import { sleep } from "./util";
//# sourceMappingURL=migrations.d.ts.map