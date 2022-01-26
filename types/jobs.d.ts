/// <reference types="node" />
export type ExportSitesConfiguration = {
    ab_tests: undefined | boolean;
    active_data_feeds: undefined | boolean;
    all: undefined | boolean;
    cache_settings: undefined | boolean;
    campaigns_and_promotions: undefined | boolean;
    content: undefined | boolean;
    coupons: undefined | boolean;
    custom_objects: undefined | boolean;
    customer_cdn_settings: undefined | boolean;
    customer_groups: undefined | boolean;
    distributed_commerce_extensions: undefined | boolean;
    dynamic_file_resources: undefined | boolean;
    gift_certificates: undefined | boolean;
    ocapi_settings: undefined | boolean;
    payment_methods: undefined | boolean;
    payment_processors: undefined | boolean;
    redirect_urls: undefined | boolean;
    search_settings: undefined | boolean;
    shipping: undefined | boolean;
    site_descriptor: undefined | boolean;
    site_preferences: undefined | boolean;
    sitemap_settings: undefined | boolean;
    slots: undefined | boolean;
    sorting_rules: undefined | boolean;
    source_codes: undefined | boolean;
    static_dynamic_alias_mappings: undefined | boolean;
    stores: undefined | boolean;
    tax: undefined | boolean;
    url_rules: undefined | boolean;
};
export type ExportGlobalDataConfiguration = {
    access_roles: undefined | boolean;
    all: undefined | boolean;
    csc_settings: undefined | boolean;
    csrf_whitelists: undefined | boolean;
    custom_preference_groups: undefined | boolean;
    custom_quota_settings: undefined | boolean;
    custom_types: undefined | boolean;
    geolocations: undefined | boolean;
    global_custom_objects: undefined | boolean;
    job_schedules: undefined | boolean;
    job_schedules_deprecated: undefined | boolean;
    locales: undefined | boolean;
    meta_data: undefined | boolean;
    oauth_providers: undefined | boolean;
    ocapi_settings: undefined | boolean;
    page_meta_tags: undefined | boolean;
    preferences: undefined | boolean;
    price_adjustment_limits: undefined | boolean;
    services: undefined | boolean;
    sorting_rules: undefined | boolean;
    static_resources: undefined | boolean;
    system_type_definitions: undefined | boolean;
    users: undefined | boolean;
    webdav_client_permissions: undefined | boolean;
};
export type ExportDataUnitsConfiguration = {
    catalog_static_resources: undefined | {
        [x: string]: boolean;
    };
    catalogs: undefined | {
        [x: string]: boolean;
    };
    customer_lists: undefined | {
        [x: string]: boolean;
    };
    inventory_lists: undefined | {
        [x: string]: boolean;
    };
    library_static_resources: undefined | {
        [x: string]: boolean;
    };
    libraries: undefined | {
        [x: string]: boolean;
    };
    price_books: undefined | {
        [x: string]: boolean;
    };
    sites: undefined | {
        [x: string]: ExportSitesConfiguration;
    };
    global_data: undefined | ExportGlobalDataConfiguration;
};
export type ResourceDocument = {
    resource_id: string;
    cache_time: number;
    methods: string[];
    read_attributes: string;
    write_attributes: string;
};
/**
 * This callback is displayed as part of the Requester class.
 */
export type permissionValidatorCallback = () => boolean;
/**
 *
 * @param env {Environment}
 * @param jobId {string} job identifier
 * @param executionId {string} job execution id
 * @return {Promise<void>}
 */
export function waitForJob(env: Environment, jobId: string, executionId: string): Promise<void>;
/**
 * Export an object of impex files to strings of XML
 *
 * returns:
 * {
 *     "meta/system-objecttype-extensions.xml": "<?xml version=\"1.0\"...."
 * }
 *
 * @param {Environment} env
 * @param {ExportDataUnitsConfiguration} dataUnits
 * @return {Promise<Map<string, string>>}
 */
export function siteArchiveExportText(env: Environment, dataUnits: ExportDataUnitsConfiguration): Promise<Map<string, string>>;
/**
 * Import filename to text strings as site impex
 *
 * @param {Environment} env
 * @param {Map<string, string>} data
 * @return {Promise<void>}
 */
export function siteArchiveImportText(env: Environment, data: Map<string, string>): Promise<void>;
/**
 * Import a site impex
 *
 * @param {Environment} env
 * @param {string|Buffer} target directory, zip file path or buffer of zip content
 * @param {string} archiveName require if Buffer is used
 * @return {Promise<void>}
 */
export function siteArchiveImport(env: Environment, target: string | Buffer, archiveName: string): Promise<void>;
/**
 * @typedef {Object} ExportSitesConfiguration
 * @property {undefined|boolean} ab_tests
 * @property {undefined|boolean} active_data_feeds
 * @property {undefined|boolean} all
 * @property {undefined|boolean} cache_settings
 * @property {undefined|boolean} campaigns_and_promotions
 * @property {undefined|boolean} content
 * @property {undefined|boolean} coupons
 * @property {undefined|boolean} custom_objects
 * @property {undefined|boolean} customer_cdn_settings
 * @property {undefined|boolean} customer_groups
 * @property {undefined|boolean} distributed_commerce_extensions
 * @property {undefined|boolean} dynamic_file_resources
 * @property {undefined|boolean} gift_certificates
 * @property {undefined|boolean} ocapi_settings
 * @property {undefined|boolean} payment_methods
 * @property {undefined|boolean} payment_processors
 * @property {undefined|boolean} redirect_urls
 * @property {undefined|boolean} search_settings
 * @property {undefined|boolean} shipping
 * @property {undefined|boolean} site_descriptor
 * @property {undefined|boolean} site_preferences
 * @property {undefined|boolean} sitemap_settings
 * @property {undefined|boolean} slots
 * @property {undefined|boolean} sorting_rules
 * @property {undefined|boolean} source_codes
 * @property {undefined|boolean} static_dynamic_alias_mappings
 * @property {undefined|boolean} stores
 * @property {undefined|boolean} tax
 * @property {undefined|boolean} url_rules
 */
/**
 * @typedef {Object} ExportGlobalDataConfiguration
 * @property {undefined|boolean} access_roles
 * @property {undefined|boolean} all
 * @property {undefined|boolean} csc_settings
 * @property {undefined|boolean} csrf_whitelists
 * @property {undefined|boolean} custom_preference_groups
 * @property {undefined|boolean} custom_quota_settings
 * @property {undefined|boolean} custom_types
 * @property {undefined|boolean} geolocations
 * @property {undefined|boolean} global_custom_objects
 * @property {undefined|boolean} job_schedules
 * @property {undefined|boolean} job_schedules_deprecated
 * @property {undefined|boolean} locales
 * @property {undefined|boolean} meta_data
 * @property {undefined|boolean} oauth_providers
 * @property {undefined|boolean} ocapi_settings
 * @property {undefined|boolean} page_meta_tags
 * @property {undefined|boolean} preferences
 * @property {undefined|boolean} price_adjustment_limits
 * @property {undefined|boolean} services
 * @property {undefined|boolean} sorting_rules
 * @property {undefined|boolean} static_resources
 * @property {undefined|boolean} system_type_definitions
 * @property {undefined|boolean} users
 * @property {undefined|boolean} webdav_client_permissions
 */
/**
 * @typedef {Object} ExportDataUnitsConfiguration
 * @property {undefined|Object<string, boolean>} catalog_static_resources
 * @property {undefined|Object<string, boolean>} catalogs
 * @property {undefined|Object<string, boolean>} customer_lists
 * @property {undefined|Object<string, boolean>} inventory_lists
 * @property {undefined|Object<string, boolean>} library_static_resources
 * @property {undefined|Object<string, boolean>} libraries
 * @property {undefined|Object<string, boolean>} price_books
 * @property {undefined|Object<string, ExportSitesConfiguration>} sites
 * @property {undefined|ExportGlobalDataConfiguration} global_data
 */
/**
 * Export the given site archive, returning the zip data
 *
 * @param {Environment} env
 * @param {ExportDataUnitsConfiguration} dataUnits
 * @param {string} zipFilename filename of the export or autogenerated
 * @return {Promise<Buffer>}
 */
export function siteArchiveExport(env: Environment, dataUnits: ExportDataUnitsConfiguration, zipFilename: string): Promise<Buffer>;
/**
 * Export an object of impex files to JSON objects in xml2js form
 *
 * returns:
 * {
 *     "meta/system-objecttype-extensions.xml": {
 *          ...
 *     }
 * }
 *
 * @param {Environment} env
 * @param {ExportDataUnitsConfiguration} dataUnits
 * @return {Promise<Map<string, object>>}
 */
export function siteArchiveExportJSON(env: Environment, dataUnits: ExportDataUnitsConfiguration): Promise<Map<string, object>>;
/**
 * Imports an object of impex filenames to objects to XML/JSON/text
 *
 * @param {Environment} env
 * @param {Map<string, object>} data
 * @return {Promise<void>}
 */
export function siteArchiveImportJSON(env: Environment, data: Map<string, object>): Promise<void>;
/**
 * Ensures the environment has access to the given DATA API resources by adding or updating
 * Resource Documents for the client ID.
 *
 * If changes are made `validator` will be called asynchronously until it returns true
 *
 * Note: this method only trivially compares resource identifiers, methods and read/write attributes. If all
 * values are equal to the instance's state the resource will not be updated.
 *
 * @param {Environment} env
 * @param {ResourceDocument[]} resources array of resources to add/update
 * @param {permissionValidatorCallback} validator array of resources to add/update
 * @param {number} [maximumChecks] maximum number of permission checks
 * @return {Promise<void>}
 */
export function ensureDataAPIPermissions(env: Environment, resources: ResourceDocument[], validator: permissionValidatorCallback, maximumChecks?: number): Promise<void>;
import { Buffer } from "buffer";
//# sourceMappingURL=jobs.d.ts.map