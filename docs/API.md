# API Usage

TODO

### Combined Example

See [../examples](../examples)

```js
var {Environment, siteArchiveExportJson} = require('@SalesforceCommerceCloud/b2c-tools');
```

### Table of Contents

*   [EnvironmentOpts][1]
    *   [Properties][2]
*   [Environment][3]
    *   [Parameters][4]
    *   [Examples][5]
    *   [am][6]
    *   [ocapi][7]
    *   [ods][8]
    *   [webdav][9]
    *   [deauthenticate][10]
*   [AccessTokenResponse][11]
    *   [Properties][12]
*   [collectMigrations][13]
    *   [Parameters][14]
*   [MigrationHelpers][15]
*   [MigrationScriptArguments][16]
    *   [Properties][17]
*   [MigrationScriptCallback][18]
    *   [Parameters][19]
*   [ToolkitInstanceState][20]
    *   [Properties][21]
*   [OnBootstrapLifecycleFunction][22]
    *   [Parameters][23]
*   [BeforeAllLifecycleFunction][24]
    *   [Parameters][25]
*   [BeforeEachLifecycleFunction][26]
    *   [Parameters][27]
*   [AfterEachLifecycleFunction][28]
    *   [Parameters][29]
*   [AfterAllLifecycleFunction][30]
    *   [Parameters][31]
*   [OnFailureLifecycleFunction][32]
    *   [Parameters][33]
*   [MigrationLifecycleFunctions][34]
    *   [Properties][35]
*   [getInstanceState][36]
    *   [Parameters][37]
*   [updateInstanceMetadata][38]
    *   [Parameters][39]
*   [updateInstanceMigrations][40]
    *   [Parameters][41]
*   [migrateInstance][42]
    *   [Parameters][43]
*   [lifeCycleModule][44]
*   [runMigrationScript][45]
*   [runMigrationScript][46]
    *   [Parameters][47]
*   [processContent][48]
    *   [Parameters][49]
*   [CollectionLists][50]
    *   [Properties][51]
*   [getCollectionsFromInstance][52]
    *   [Parameters][53]
*   [getDataUnitsFromWeb][54]
    *   [Parameters][55]
*   [configNameFromHostname][56]
    *   [Parameters][57]
*   [LogFile][58]
    *   [Properties][59]
*   [getLogs][60]
    *   [Parameters][61]
*   [tailCommand][62]
    *   [Parameters][63]
*   [b2cTools/jobs][64]
*   [waitForJob][65]
    *   [Parameters][66]
*   [JobExecutionParameter][67]
    *   [Properties][68]
*   [JobExecution][69]
    *   [Properties][70]
*   [executeJob][71]
    *   [Parameters][72]
*   [siteArchiveImport][73]
    *   [Parameters][74]
*   [ExportSitesConfiguration][75]
    *   [Properties][76]
*   [ExportGlobalDataConfiguration][77]
    *   [Properties][78]
*   [ExportDataUnitsConfiguration][79]
    *   [Properties][80]
*   [siteArchiveExport][81]
    *   [Parameters][82]
*   [siteArchiveExportJSON][83]
    *   [Parameters][84]
*   [siteArchiveImportJSON][85]
    *   [Parameters][86]
*   [siteArchiveExportText][87]
    *   [Parameters][88]
*   [siteArchiveImportText][89]
    *   [Parameters][90]
*   [ResourceDocument][91]
    *   [Properties][92]
*   [permissionValidatorCallback][93]
*   [compareResourceDocuments][94]
    *   [Parameters][95]
*   [ensureDataAPIPermissions][96]
    *   [Parameters][97]
*   [sleep][98]
    *   [Parameters][99]
*   [CartridgeMapping][100]
    *   [Properties][101]
*   [findCartridges][102]
*   [reloadCodeVersion][103]
    *   [Parameters][104]
*   [syncCartridges][105]
    *   [Parameters][106]
*   [downloadCodeVersion][107]
    *   [Parameters][108]

## EnvironmentOpts

[lib/environment.js:75-405][109]

Type: [Object][110]

### Properties

*   `server` **[string][111]**
*   `secureServer` **[string][111]** optional hostname used for WebDAV access
*   `username` **[string][111]**
*   `password` **[string][111]**
*   `clientID` **[string][111]**
*   `clientSecret` **[string][111]**
*   `codeVersion` **[string][111]**
*   `verify` **[boolean][112]** verify SSL
*   `certificate` **[string][111]** pfx path
*   `passphrase` **[string][111]** passphrase for pfx above

## Environment

[lib/environment.js:75-405][113]

Provides for authentication and WebDAV/OCAPI access

### Parameters

*   `opts` **[EnvironmentOpts][114]**  (optional, default `{}`)

### Examples

```javascript
const {Environment} = require('@SalesforceCommerceCloud/b2c-tools');
const env = new Environment({
    server: '...',
    clientID: '...',
    clientSecret: '...'
});
const resp = await env.ocapi.get('sites');
```

### am

[lib/environment.js:122-137][115]

account manager (account.demandware.net) scoped Axios instance

Type: axios.AxiosInstance

### ocapi

[lib/environment.js:144-159][116]

OCAPI scoped Axios Client

Type: axios.AxiosInstance

### ods

[lib/environment.js:166-181][117]

ODS scoped Axios Client

Type: axios.AxiosInstance

### webdav

[lib/environment.js:188-203][118]

WebDAV scoped Axios Client

Type: axios.AxiosInstance

### deauthenticate

[lib/environment.js:400-404][119]

Clear access token so auths are performed anew

Returns **[Promise][120]\<void>**

## AccessTokenResponse

[lib/environment.js:349-362][121]

Type: [Object][110]

### Properties

*   `accessToken` **[string][111]**
*   `expires` **[Date][122]**

## collectMigrations

[lib/migrations.js:37-47][123]

Find all migration directories and scripts; excluding those matching the given patterns

### Parameters

*   `dir`  {string}
*   `exclude`  {string\[]} (optional, default `[]`)

Returns **[Promise][120]<[Array][124]<[string][111]>>**

## MigrationHelpers

[lib/migrations.js:52-69][125]

## MigrationScriptArguments

[lib/migrations.js:156-175][126]

Type: [Object][110]

### Properties

*   `env` **[Environment][127]**
*   `logger` **Logger**
*   `helpers` **[MigrationHelpers][128]**

## MigrationScriptCallback

[lib/migrations.js:156-175][129]

Type: [Function][130]

### Parameters

*   `args` **[MigrationScriptArguments][131]**

Returns **[Promise][120]<([boolean][112] | void)>**

## ToolkitInstanceState

[lib/migrations.js:156-175][132]

Type: [Object][110]

### Properties

*   `b2cToolkitDataVersion` **[number][133]**
*   `b2cToolkitMigrations` **[Array][124]<[string][111]>**
*   `b2cToolsBootstrappedClientIDs` **[Array][124]<[string][111]>** list of client IDs that have been bootstrapped

## OnBootstrapLifecycleFunction

[lib/migrations.js:156-175][134]

Type: [Function][130]

### Parameters

*   `args` **[MigrationScriptArguments][131]**

Returns **[Promise][120]\<void>**

## BeforeAllLifecycleFunction

[lib/migrations.js:156-175][135]

Type: [Function][130]

### Parameters

*   `args` **[MigrationScriptArguments][131]**
*   `migrationsToRun` **[Array][124]<[string][111]>** list of migrations that will be run (mutable)
*   `willApply` **[boolean][112]** true if migrations will be applied to the instance
*   `dryRun` **[boolean][112]** true if dry run is requested

Returns **[Promise][120]\<void>**

## BeforeEachLifecycleFunction

[lib/migrations.js:156-175][136]

Type: [Function][130]

### Parameters

*   `args` **[MigrationScriptArguments][131]**
*   `migration` **[string][111]** migration to be run
*   `willApply` **[boolean][112]** true if migrations will be applied to the instance

Returns **[Promise][120]<[boolean][112]>** return false to skip the current migration

## AfterEachLifecycleFunction

[lib/migrations.js:156-175][137]

Type: [Function][130]

### Parameters

*   `args` **[MigrationScriptArguments][131]**
*   `migration` **[string][111]** migration to be run
*   `willApply` **[boolean][112]** true if migrations will be applied to the instance

Returns **[Promise][120]\<void>**

## AfterAllLifecycleFunction

[lib/migrations.js:156-175][138]

Type: [Function][130]

### Parameters

*   `args` **[MigrationScriptArguments][131]**
*   `migrationsRan` **[Array][124]<[string][111]>** list of migrations ran
*   `willApply` **[boolean][112]** true if migrations will be applied to the instance

Returns **[Promise][120]\<void>**

## OnFailureLifecycleFunction

[lib/migrations.js:156-175][139]

Type: [Function][130]

### Parameters

*   `args` **[MigrationScriptArguments][131]**
*   `migration` **[string][111]** migration to be run
*   `e` **[Error][140]** exception raised during migration run

Returns **[Promise][120]\<void>** re-raise exception or new exception to stop migration run

## MigrationLifecycleFunctions

[lib/migrations.js:156-175][141]

Type: [Object][110]

### Properties

*   `onBootstrap` **([OnBootstrapLifecycleFunction][142] | [undefined][143])**
*   `beforeAll` **([BeforeAllLifecycleFunction][144] | [undefined][143])**
*   `beforeEach` **([BeforeEachLifecycleFunction][145] | [undefined][143])**
*   `afterEach` **([AfterAllLifecycleFunction][146] | [undefined][143])**
*   `afterAll` **([AfterAllLifecycleFunction][146] | [undefined][143])**
*   `onFailure` **([OnFailureLifecycleFunction][147] | [undefined][143])**

## getInstanceState

[lib/migrations.js:156-175][148]

Get the instance state from global preferences

### Parameters

*   `env`  {Environment}

Returns **[Promise][120]<[ToolkitInstanceState][149]>**

## updateInstanceMetadata

[lib/migrations.js:184-244][150]

Imports the latest toolkit metadata

### Parameters

*   `env` **[Environment][127]**
*   `lifeCycleModule` **[MigrationLifecycleFunctions][151]**

Returns **[Promise][120]\<void>**

## updateInstanceMigrations

[lib/migrations.js:252-266][152]

Updates instance with new migrations set

### Parameters

*   `env`  {Environment}
*   `migrations`  {string\[]}

Returns **[Promise][120]\<void>**

## migrateInstance

[lib/migrations.js:281-408][153]

Inspects an instance and executes site impex imports and "migration scripts" from the
given `dir`.

### Parameters

*   `env` **[Environment][127]**
*   `dir` **[string][111]** migrations directory
*   `exclude` **[Array][124]<[string][111]>** array of regular expression strings (optional, default `[]`)
*   `apply` **[boolean][112]** should migrations be applied to the instance after running? (optional, default `true`)
*   `dryRun` **[boolean][112]** only output migrations to be run (optional, default `false`)
*   `forceBootstrap` **[boolean][112]**  (optional, default `false`)
*   `allowBootstrap` **[boolean][112]**  (optional, default `true`)

Returns **[Promise][120]\<void>**

## lifeCycleModule

[lib/migrations.js:288-288][154]

## runMigrationScript

[lib/migrations.js:359-359][155]

## runMigrationScript

[lib/migrations.js:416-426][156]

### Parameters

*   `env` **[Environment][127]**
*   `target` **[string][111]** path to migration script

Returns **[Promise][120]<[boolean][112]>**

## processContent

[lib/command-export.js:23-68][157]

Recursively process a <content> to extract child components and images

### Parameters

*   `content`  jsonified version of <content> via xml2js
*   `allPages`  {object}
*   `contentToKeep`  {Set} array of page ids to retain from library (mutable)
*   `filesToDownload`  {string\[]} array of files to download from webdav static dir (mutable)
*   `logPrefix`  for debugging output
*   `assetQuery`  {string\[]}

## CollectionLists

[lib/command-export.js:186-245][158]

Type: [Object][110]

### Properties

*   `sites` **[Array][124]<[string][111]>**
*   `inventoryLists` **[Array][124]<[string][111]>**
*   `catalogs` **[Array][124]<[string][111]>**

## getCollectionsFromInstance

[lib/command-export.js:186-245][159]

Retrieves list of catalogs, inventory lists, sites and libraries for interactive display

### Parameters

*   `env`  {Environment}

Returns **[Promise][120]<[CollectionLists][160]>**

## getDataUnitsFromWeb

[lib/command-export.js:254-336][161]

Launch a web page to collect data units to export

### Parameters

*   `env`  {Environment}
*   `collections`  {CollectionLists}

Returns **[Promise][120]<[object][110]>**

## configNameFromHostname

[lib/command-instance.js:12-15][162]

### Parameters

*   `hostname` **[string][111]**

## LogFile

[lib/command-tail.js:19-42][163]

Type: [Object][110]

### Properties

*   `name` **[string][111]**
*   `lastModified` **[Date][122]**

## getLogs

[lib/command-tail.js:19-42][164]

Get the logs from the instance

### Parameters

*   `env`  {Environment}

Returns **[Promise][120]<[Array][124]<[LogFile][165]>>**

## tailCommand

[lib/command-tail.js:49-104][166]

### Parameters

*   `filters`  {string\[]}

Returns **[Promise][120]\<void>**

## b2cTools/jobs

[lib/jobs.js:6-6][167]

import and export job helpers

## waitForJob

[lib/jobs.js:24-53][168]

### Parameters

*   `env` **[Environment][127]**
*   `jobId` **[string][111]** job identifier
*   `executionId` **[string][111]** job execution id

Returns **[Promise][120]\<void>**

## JobExecutionParameter

[lib/jobs.js:75-80][169]

Type: [Object][110]

### Properties

*   `name` **[string][111]**
*   `value` **[string][111]**

## JobExecution

[lib/jobs.js:75-80][170]

Type: [Object][110]

### Properties

*   `id` **[string][111]**
*   `job_id` **[string][111]**
*   `status` **[string][111]**

## executeJob

[lib/jobs.js:75-80][171]

### Parameters

*   `env` **[Environment][127]**
*   `jobId` **[string][111]** job identifier
*   `parameters` **[Array][124]<[JobExecutionParameter][172]>**  (optional, default `[]`)

Returns **[Promise][120]\<void>**

## siteArchiveImport

[lib/jobs.js:92-143][173]

Import a site impex

### Parameters

*   `env` **[Environment][127]**
*   `target` **([string][111] | [Buffer][174])** directory, zip file path or buffer of zip content
*   `options` **[object][110]**  (optional, default `{}`)

    *   `options.archiveName` **[string][111]?** required if Buffer is used
    *   `options.keepArchive` **[boolean][112]?** if true, keep archive on isntance

Returns **[Promise][120]\<void>**

## ExportSitesConfiguration

[lib/jobs.js:227-246][175]

Type: [Object][110]

### Properties

*   `ab_tests` **([undefined][143] | [boolean][112])**
*   `active_data_feeds` **([undefined][143] | [boolean][112])**
*   `all` **([undefined][143] | [boolean][112])**
*   `cache_settings` **([undefined][143] | [boolean][112])**
*   `campaigns_and_promotions` **([undefined][143] | [boolean][112])**
*   `content` **([undefined][143] | [boolean][112])**
*   `coupons` **([undefined][143] | [boolean][112])**
*   `custom_objects` **([undefined][143] | [boolean][112])**
*   `customer_cdn_settings` **([undefined][143] | [boolean][112])**
*   `customer_groups` **([undefined][143] | [boolean][112])**
*   `distributed_commerce_extensions` **([undefined][143] | [boolean][112])**
*   `dynamic_file_resources` **([undefined][143] | [boolean][112])**
*   `gift_certificates` **([undefined][143] | [boolean][112])**
*   `ocapi_settings` **([undefined][143] | [boolean][112])**
*   `payment_methods` **([undefined][143] | [boolean][112])**
*   `payment_processors` **([undefined][143] | [boolean][112])**
*   `redirect_urls` **([undefined][143] | [boolean][112])**
*   `search_settings` **([undefined][143] | [boolean][112])**
*   `shipping` **([undefined][143] | [boolean][112])**
*   `site_descriptor` **([undefined][143] | [boolean][112])**
*   `site_preferences` **([undefined][143] | [boolean][112])**
*   `sitemap_settings` **([undefined][143] | [boolean][112])**
*   `slots` **([undefined][143] | [boolean][112])**
*   `sorting_rules` **([undefined][143] | [boolean][112])**
*   `source_codes` **([undefined][143] | [boolean][112])**
*   `static_dynamic_alias_mappings` **([undefined][143] | [boolean][112])**
*   `stores` **([undefined][143] | [boolean][112])**
*   `tax` **([undefined][143] | [boolean][112])**
*   `url_rules` **([undefined][143] | [boolean][112])**

## ExportGlobalDataConfiguration

[lib/jobs.js:227-246][176]

Type: [Object][110]

### Properties

*   `access_roles` **([undefined][143] | [boolean][112])**
*   `all` **([undefined][143] | [boolean][112])**
*   `csc_settings` **([undefined][143] | [boolean][112])**
*   `csrf_whitelists` **([undefined][143] | [boolean][112])**
*   `custom_preference_groups` **([undefined][143] | [boolean][112])**
*   `custom_quota_settings` **([undefined][143] | [boolean][112])**
*   `custom_types` **([undefined][143] | [boolean][112])**
*   `geolocations` **([undefined][143] | [boolean][112])**
*   `global_custom_objects` **([undefined][143] | [boolean][112])**
*   `job_schedules` **([undefined][143] | [boolean][112])**
*   `job_schedules_deprecated` **([undefined][143] | [boolean][112])**
*   `locales` **([undefined][143] | [boolean][112])**
*   `meta_data` **([undefined][143] | [boolean][112])**
*   `oauth_providers` **([undefined][143] | [boolean][112])**
*   `ocapi_settings` **([undefined][143] | [boolean][112])**
*   `page_meta_tags` **([undefined][143] | [boolean][112])**
*   `preferences` **([undefined][143] | [boolean][112])**
*   `price_adjustment_limits` **([undefined][143] | [boolean][112])**
*   `services` **([undefined][143] | [boolean][112])**
*   `sorting_rules` **([undefined][143] | [boolean][112])**
*   `static_resources` **([undefined][143] | [boolean][112])**
*   `system_type_definitions` **([undefined][143] | [boolean][112])**
*   `users` **([undefined][143] | [boolean][112])**
*   `webdav_client_permissions` **([undefined][143] | [boolean][112])**

## ExportDataUnitsConfiguration

[lib/jobs.js:227-246][177]

Type: [Object][110]

### Properties

*   `catalog_static_resources` **([undefined][143] | [Object][110]<[string][111], [boolean][112]>)**
*   `catalogs` **([undefined][143] | [Object][110]<[string][111], [boolean][112]>)**
*   `customer_lists` **([undefined][143] | [Object][110]<[string][111], [boolean][112]>)**
*   `inventory_lists` **([undefined][143] | [Object][110]<[string][111], [boolean][112]>)**
*   `library_static_resources` **([undefined][143] | [Object][110]<[string][111], [boolean][112]>)**
*   `libraries` **([undefined][143] | [Object][110]<[string][111], [boolean][112]>)**
*   `price_books` **([undefined][143] | [Object][110]<[string][111], [boolean][112]>)**
*   `sites` **([undefined][143] | [Object][110]<[string][111], [ExportSitesConfiguration][178]>)**
*   `global_data` **([undefined][143] | [ExportGlobalDataConfiguration][179])**

## siteArchiveExport

[lib/jobs.js:227-246][180]

Export the given site archive, returning the zip data

### Parameters

*   `env` **[Environment][127]**
*   `dataUnits` **[ExportDataUnitsConfiguration][181]**
*   `zipFilename` **[string][111]** filename of the export

Returns **[Promise][120]<[Buffer][174]>**

## siteArchiveExportJSON

[lib/jobs.js:262-276][182]

Export an object of impex files to JSON objects in xml2js form

returns:
{
"meta/system-objecttype-extensions.xml": {
...
}
}

### Parameters

*   `env` **[Environment][127]**
*   `dataUnits` **[ExportDataUnitsConfiguration][181]**

Returns **[Promise][120]<[Map][183]<[string][111], [object][110]>>**

## siteArchiveImportJSON

[lib/jobs.js:285-308][184]

Imports an object of impex filenames to objects to XML/JSON/text

### Parameters

*   `env` **[Environment][127]**
*   `data` **[Map][183]<[string][111], [object][110]>**

Returns **[Promise][120]\<void>**

## siteArchiveExportText

[lib/jobs.js:322-339][185]

Export an object of impex files to strings of XML

returns:
{
"meta/system-objecttype-extensions.xml": "\<?xml version="1.0"...."
}

### Parameters

*   `env` **[Environment][127]**
*   `dataUnits` **[ExportDataUnitsConfiguration][181]**

Returns **[Promise][120]<[Map][183]<[string][111], [string][111]>>**

## siteArchiveImportText

[lib/jobs.js:348-363][186]

Import filename to text strings as site impex

### Parameters

*   `env` **[Environment][127]**
*   `data` **[Map][183]<[string][111], [string][111]>**

Returns **[Promise][120]\<void>**

## ResourceDocument

[lib/jobs.js:386-393][187]

Type: [Object][110]

### Properties

*   `resource_id` **[string][111]**
*   `cache_time` **[number][133]**
*   `methods` **[Array][124]<[string][111]>**
*   `read_attributes` **[string][111]**
*   `write_attributes` **[string][111]**

## permissionValidatorCallback

[lib/jobs.js:386-393][188]

This callback is displayed as part of the Requester class.

Type: [Function][130]

Returns **[boolean][112]** true if permission is validated

## compareResourceDocuments

[lib/jobs.js:386-393][189]

### Parameters

*   `a` **[ResourceDocument][190]**
*   `b` **[ResourceDocument][190]**

Returns **[boolean][112]** true if the documents are trivially equal

## ensureDataAPIPermissions

[lib/jobs.js:411-465][191]

Ensures the environment has access to the given DATA API resources by adding or updating
Resource Documents for the client ID.

If changes are made `validator` will be called asynchronously until it returns true

Note: this method only trivially compares resource identifiers, methods and read/write attributes. If all
values are equal to the instance's state the resource will not be updated.

### Parameters

*   `env` **[Environment][127]**
*   `resources` **[Array][124]<[ResourceDocument][190]>** array of resources to add/update (optional, default `[]`)
*   `validator` **[permissionValidatorCallback][192]** array of resources to add/update
*   `options` **[object][110]**  (optional, default `{maximumChecks:60}`)

    *   `options.maximumChecks` **[number][133]?** maximum number of permission checks

Returns **[Promise][120]\<void>**

## sleep

[lib/util.js:7-9][193]

Sleep for ms milliseconds

### Parameters

*   `ms`  {number} milliseconds

Returns **[Promise][120]\<void>**

## CartridgeMapping

[lib/code.js:22-36][194]

Type: [Object][110]

### Properties

*   `dest` **[string][111]** cartridge name
*   `src` **[string][111]** directory

## findCartridges

[lib/code.js:22-36][195]

Find Cartridges recursively in the working directory

Returns **[Array][124]<[CartridgeMapping][196]>**

## reloadCodeVersion

[lib/code.js:44-62][197]

Reloads (or activates) the environments code version

### Parameters

*   `env` **[Environment][127]**

Returns **[Promise][120]\<void>**

## syncCartridges

[lib/code.js:72-102][198]

Syncs the given cartridge mapping (src:dest) to the environments code version

### Parameters

*   `env` **[Environment][127]**
*   `cartridges` **[Array][124]<[CartridgeMapping][196]>**
*   `reload` **[boolean][112]**  (optional, default `false`)

Returns **[Promise][120]\<void>**

## downloadCodeVersion

[lib/code.js:110-123][199]

Downloads the code version as a zipped archive

### Parameters

*   `env` **[Environment][127]**

Returns **[Promise][120]<[Buffer][174]>**

[1]: #environmentopts

[2]: #properties

[3]: #environment

[4]: #parameters

[5]: #examples

[6]: #am

[7]: #ocapi

[8]: #ods

[9]: #webdav

[10]: #deauthenticate

[11]: #accesstokenresponse

[12]: #properties-1

[13]: #collectmigrations

[14]: #parameters-1

[15]: #migrationhelpers

[16]: #migrationscriptarguments

[17]: #properties-2

[18]: #migrationscriptcallback

[19]: #parameters-2

[20]: #toolkitinstancestate

[21]: #properties-3

[22]: #onbootstraplifecyclefunction

[23]: #parameters-3

[24]: #beforealllifecyclefunction

[25]: #parameters-4

[26]: #beforeeachlifecyclefunction

[27]: #parameters-5

[28]: #aftereachlifecyclefunction

[29]: #parameters-6

[30]: #afteralllifecyclefunction

[31]: #parameters-7

[32]: #onfailurelifecyclefunction

[33]: #parameters-8

[34]: #migrationlifecyclefunctions

[35]: #properties-4

[36]: #getinstancestate

[37]: #parameters-9

[38]: #updateinstancemetadata

[39]: #parameters-10

[40]: #updateinstancemigrations

[41]: #parameters-11

[42]: #migrateinstance

[43]: #parameters-12

[44]: #lifecyclemodule

[45]: #runmigrationscript

[46]: #runmigrationscript-1

[47]: #parameters-13

[48]: #processcontent

[49]: #parameters-14

[50]: #collectionlists

[51]: #properties-5

[52]: #getcollectionsfrominstance

[53]: #parameters-15

[54]: #getdataunitsfromweb

[55]: #parameters-16

[56]: #confignamefromhostname

[57]: #parameters-17

[58]: #logfile

[59]: #properties-6

[60]: #getlogs

[61]: #parameters-18

[62]: #tailcommand

[63]: #parameters-19

[64]: #b2ctoolsjobs

[65]: #waitforjob

[66]: #parameters-20

[67]: #jobexecutionparameter

[68]: #properties-7

[69]: #jobexecution

[70]: #properties-8

[71]: #executejob

[72]: #parameters-21

[73]: #sitearchiveimport

[74]: #parameters-22

[75]: #exportsitesconfiguration

[76]: #properties-9

[77]: #exportglobaldataconfiguration

[78]: #properties-10

[79]: #exportdataunitsconfiguration

[80]: #properties-11

[81]: #sitearchiveexport

[82]: #parameters-23

[83]: #sitearchiveexportjson

[84]: #parameters-24

[85]: #sitearchiveimportjson

[86]: #parameters-25

[87]: #sitearchiveexporttext

[88]: #parameters-26

[89]: #sitearchiveimporttext

[90]: #parameters-27

[91]: #resourcedocument

[92]: #properties-12

[93]: #permissionvalidatorcallback

[94]: #compareresourcedocuments

[95]: #parameters-28

[96]: #ensuredataapipermissions

[97]: #parameters-29

[98]: #sleep

[99]: #parameters-30

[100]: #cartridgemapping

[101]: #properties-13

[102]: #findcartridges

[103]: #reloadcodeversion

[104]: #parameters-31

[105]: #synccartridges

[106]: #parameters-32

[107]: #downloadcodeversion

[108]: #parameters-33

[109]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/environment.js#L48-L60 "Source code on GitHub"

[110]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[111]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[112]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[113]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/environment.js#L75-L405 "Source code on GitHub"

[114]: #environmentopts

[115]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/environment.js#L122-L137 "Source code on GitHub"

[116]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/environment.js#L144-L159 "Source code on GitHub"

[117]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/environment.js#L166-L181 "Source code on GitHub"

[118]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/environment.js#L188-L203 "Source code on GitHub"

[119]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/environment.js#L400-L404 "Source code on GitHub"

[120]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[121]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/environment.js#L338-L342 "Source code on GitHub"

[122]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[123]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L37-L47 "Source code on GitHub"

[124]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[125]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L52-L69 "Source code on GitHub"

[126]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L72-L77 "Source code on GitHub"

[127]: #environment

[128]: #migrationhelpers

[129]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L79-L84 "Source code on GitHub"

[130]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[131]: #migrationscriptarguments

[132]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L86-L91 "Source code on GitHub"

[133]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[134]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L93-L97 "Source code on GitHub"

[135]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L99-L106 "Source code on GitHub"

[136]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L108-L114 "Source code on GitHub"

[137]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L116-L122 "Source code on GitHub"

[138]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L124-L130 "Source code on GitHub"

[139]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L132-L138 "Source code on GitHub"

[140]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error

[141]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L140-L148 "Source code on GitHub"

[142]: #onbootstraplifecyclefunction

[143]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined

[144]: #beforealllifecyclefunction

[145]: #beforeeachlifecyclefunction

[146]: #afteralllifecyclefunction

[147]: #onfailurelifecyclefunction

[148]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L156-L175 "Source code on GitHub"

[149]: #toolkitinstancestate

[150]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L184-L244 "Source code on GitHub"

[151]: #migrationlifecyclefunctions

[152]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L252-L266 "Source code on GitHub"

[153]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L281-L408 "Source code on GitHub"

[154]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L288-L288 "Source code on GitHub"

[155]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L359-L359 "Source code on GitHub"

[156]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/migrations.js#L416-L426 "Source code on GitHub"

[157]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/command-export.js#L23-L68 "Source code on GitHub"

[158]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/command-export.js#L173-L178 "Source code on GitHub"

[159]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/command-export.js#L186-L245 "Source code on GitHub"

[160]: #collectionlists

[161]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/command-export.js#L254-L336 "Source code on GitHub"

[162]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/command-instance.js#L12-L15 "Source code on GitHub"

[163]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/command-tail.js#L7-L11 "Source code on GitHub"

[164]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/command-tail.js#L19-L42 "Source code on GitHub"

[165]: #logfile

[166]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/command-tail.js#L49-L104 "Source code on GitHub"

[167]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L6-L6 "Source code on GitHub"

[168]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L24-L53 "Source code on GitHub"

[169]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L55-L59 "Source code on GitHub"

[170]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L61-L66 "Source code on GitHub"

[171]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L75-L80 "Source code on GitHub"

[172]: #jobexecutionparameter

[173]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L92-L143 "Source code on GitHub"

[174]: https://nodejs.org/api/buffer.html

[175]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L145-L176 "Source code on GitHub"

[176]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L178-L204 "Source code on GitHub"

[177]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L206-L217 "Source code on GitHub"

[178]: #exportsitesconfiguration

[179]: #exportglobaldataconfiguration

[180]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L227-L246 "Source code on GitHub"

[181]: #exportdataunitsconfiguration

[182]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L262-L276 "Source code on GitHub"

[183]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map

[184]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L285-L308 "Source code on GitHub"

[185]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L322-L339 "Source code on GitHub"

[186]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L348-L363 "Source code on GitHub"

[187]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L365-L372 "Source code on GitHub"

[188]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L374-L378 "Source code on GitHub"

[189]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L386-L393 "Source code on GitHub"

[190]: #resourcedocument

[191]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/jobs.js#L411-L465 "Source code on GitHub"

[192]: #permissionvalidatorcallback

[193]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/util.js#L7-L9 "Source code on GitHub"

[194]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/code.js#L11-L15 "Source code on GitHub"

[195]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/code.js#L22-L36 "Source code on GitHub"

[196]: #cartridgemapping

[197]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/code.js#L44-L62 "Source code on GitHub"

[198]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/code.js#L72-L102 "Source code on GitHub"

[199]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/c1953bbe777de5d19a629ea1e9c5d72b649d90ab/lib/code.js#L110-L123 "Source code on GitHub"

