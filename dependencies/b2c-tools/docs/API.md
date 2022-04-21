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
    *   [webdav][8]
    *   [deauthenticate][9]
*   [AccessTokenResponse][10]
    *   [Properties][11]
*   [collectMigrations][12]
    *   [Parameters][13]
*   [MigrationHelpers][14]
*   [MigrationScriptArguments][15]
    *   [Properties][16]
*   [MigrationScriptCallback][17]
    *   [Parameters][18]
*   [ToolkitInstanceState][19]
    *   [Properties][20]
*   [OnBootstrapLifecycleFunction][21]
    *   [Parameters][22]
*   [BeforeAllLifecycleFunction][23]
    *   [Parameters][24]
*   [BeforeEachLifecycleFunction][25]
    *   [Parameters][26]
*   [AfterEachLifecycleFunction][27]
    *   [Parameters][28]
*   [AfterAllLifecycleFunction][29]
    *   [Parameters][30]
*   [OnFailureLifecycleFunction][31]
    *   [Parameters][32]
*   [MigrationLifecycleFunctions][33]
    *   [Properties][34]
*   [getInstanceState][35]
    *   [Parameters][36]
*   [updateInstanceMetadata][37]
    *   [Parameters][38]
*   [updateInstanceMigrations][39]
    *   [Parameters][40]
*   [migrateInstance][41]
    *   [Parameters][42]
*   [lifeCycleModule][43]
*   [runMigrationScript][44]
*   [runMigrationScript][45]
    *   [Parameters][46]
*   [processContent][47]
    *   [Parameters][48]
*   [CollectionLists][49]
    *   [Properties][50]
*   [getCollectionsFromInstance][51]
    *   [Parameters][52]
*   [getDataUnitsFromWeb][53]
    *   [Parameters][54]
*   [configNameFromHostname][55]
    *   [Parameters][56]
*   [LogFile][57]
    *   [Properties][58]
*   [getLogs][59]
    *   [Parameters][60]
*   [tailCommand][61]
    *   [Parameters][62]
*   [b2cTools/jobs][63]
*   [waitForJob][64]
    *   [Parameters][65]
*   [JobExecutionParameter][66]
    *   [Properties][67]
*   [JobExecution][68]
    *   [Properties][69]
*   [executeJob][70]
    *   [Parameters][71]
*   [siteArchiveImport][72]
    *   [Parameters][73]
*   [ExportSitesConfiguration][74]
    *   [Properties][75]
*   [ExportGlobalDataConfiguration][76]
    *   [Properties][77]
*   [ExportDataUnitsConfiguration][78]
    *   [Properties][79]
*   [siteArchiveExport][80]
    *   [Parameters][81]
*   [siteArchiveExportJSON][82]
    *   [Parameters][83]
*   [siteArchiveImportJSON][84]
    *   [Parameters][85]
*   [siteArchiveExportText][86]
    *   [Parameters][87]
*   [siteArchiveImportText][88]
    *   [Parameters][89]
*   [ResourceDocument][90]
    *   [Properties][91]
*   [permissionValidatorCallback][92]
*   [compareResourceDocuments][93]
    *   [Parameters][94]
*   [ensureDataAPIPermissions][95]
    *   [Parameters][96]
*   [sleep][97]
    *   [Parameters][98]
*   [CartridgeMapping][99]
    *   [Properties][100]
*   [findCartridges][101]
*   [reloadCodeVersion][102]
    *   [Parameters][103]
*   [syncCartridges][104]
    *   [Parameters][105]
*   [downloadCodeVersion][106]
    *   [Parameters][107]

## EnvironmentOpts

[lib/environment.js:74-378][108]

Type: [Object][109]

### Properties

*   `server` **[string][110]**
*   `secureServer` **[string][110]** optional hostname used for WebDAV access
*   `username` **[string][110]**
*   `password` **[string][110]**
*   `clientID` **[string][110]**
*   `clientSecret` **[string][110]**
*   `codeVersion` **[string][110]**
*   `verify` **[boolean][111]** verify SSL
*   `certificate` **[string][110]** pfx path
*   `passphrase` **[string][110]** passphrase for pfx above

## Environment

[lib/environment.js:74-378][112]

Provides for authentication and WebDAV/OCAPI access

### Parameters

*   `opts` **[EnvironmentOpts][113]**  (optional, default `{}`)

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

[lib/environment.js:117-132][114]

account manager (account.demandware.net) scoped Axios instance

Type: axios.AxiosInstance

### ocapi

[lib/environment.js:139-154][115]

OCAPI scoped Axios Client

Type: axios.AxiosInstance

### webdav

[lib/environment.js:161-176][116]

WebDAV scoped Axios Client

Type: axios.AxiosInstance

### deauthenticate

[lib/environment.js:373-377][117]

Clear access token so auths are performed anew

Returns **[Promise][118]\<void>**

## AccessTokenResponse

[lib/environment.js:322-335][119]

Type: [Object][109]

### Properties

*   `accessToken` **[string][110]**
*   `expires` **[Date][120]**

## collectMigrations

[lib/migrations.js:37-47][121]

Find all migration directories and scripts; excluding those matching the given patterns

### Parameters

*   `dir`  {string}
*   `exclude`  {string\[]} (optional, default `[]`)

Returns **[Promise][118]<[Array][122]<[string][110]>>**

## MigrationHelpers

[lib/migrations.js:52-69][123]

## MigrationScriptArguments

[lib/migrations.js:156-175][124]

Type: [Object][109]

### Properties

*   `env` **[Environment][125]**
*   `logger` **Logger**
*   `helpers` **[MigrationHelpers][126]**

## MigrationScriptCallback

[lib/migrations.js:156-175][127]

Type: [Function][128]

### Parameters

*   `args` **[MigrationScriptArguments][129]**

Returns **[Promise][118]<([boolean][111] | void)>**

## ToolkitInstanceState

[lib/migrations.js:156-175][130]

Type: [Object][109]

### Properties

*   `b2cToolkitDataVersion` **[number][131]**
*   `b2cToolkitMigrations` **[Array][122]<[string][110]>**
*   `b2cToolsBootstrappedClientIDs` **[Array][122]<[string][110]>** list of client IDs that have been bootstrapped

## OnBootstrapLifecycleFunction

[lib/migrations.js:156-175][132]

Type: [Function][128]

### Parameters

*   `args` **[MigrationScriptArguments][129]**

Returns **[Promise][118]\<void>**

## BeforeAllLifecycleFunction

[lib/migrations.js:156-175][133]

Type: [Function][128]

### Parameters

*   `args` **[MigrationScriptArguments][129]**
*   `migrationsToRun` **[Array][122]<[string][110]>** list of migrations that will be run (mutable)
*   `willApply` **[boolean][111]** true if migrations will be applied to the instance
*   `dryRun` **[boolean][111]** true if dry run is requested

Returns **[Promise][118]\<void>**

## BeforeEachLifecycleFunction

[lib/migrations.js:156-175][134]

Type: [Function][128]

### Parameters

*   `args` **[MigrationScriptArguments][129]**
*   `migration` **[string][110]** migration to be run
*   `willApply` **[boolean][111]** true if migrations will be applied to the instance

Returns **[Promise][118]<[boolean][111]>** return false to skip the current migration

## AfterEachLifecycleFunction

[lib/migrations.js:156-175][135]

Type: [Function][128]

### Parameters

*   `args` **[MigrationScriptArguments][129]**
*   `migration` **[string][110]** migration to be run
*   `willApply` **[boolean][111]** true if migrations will be applied to the instance

Returns **[Promise][118]\<void>**

## AfterAllLifecycleFunction

[lib/migrations.js:156-175][136]

Type: [Function][128]

### Parameters

*   `args` **[MigrationScriptArguments][129]**
*   `migrationsRan` **[Array][122]<[string][110]>** list of migrations ran
*   `willApply` **[boolean][111]** true if migrations will be applied to the instance

Returns **[Promise][118]\<void>**

## OnFailureLifecycleFunction

[lib/migrations.js:156-175][137]

Type: [Function][128]

### Parameters

*   `args` **[MigrationScriptArguments][129]**
*   `migration` **[string][110]** migration to be run
*   `e` **[Error][138]** exception raised during migration run

Returns **[Promise][118]\<void>** re-raise exception or new exception to stop migration run

## MigrationLifecycleFunctions

[lib/migrations.js:156-175][139]

Type: [Object][109]

### Properties

*   `onBootstrap` **([OnBootstrapLifecycleFunction][140] | [undefined][141])**
*   `beforeAll` **([BeforeAllLifecycleFunction][142] | [undefined][141])**
*   `beforeEach` **([BeforeEachLifecycleFunction][143] | [undefined][141])**
*   `afterEach` **([AfterAllLifecycleFunction][144] | [undefined][141])**
*   `afterAll` **([AfterAllLifecycleFunction][144] | [undefined][141])**
*   `onFailure` **([OnFailureLifecycleFunction][145] | [undefined][141])**

## getInstanceState

[lib/migrations.js:156-175][146]

Get the instance state from global preferences

### Parameters

*   `env`  {Environment}

Returns **[Promise][118]<[ToolkitInstanceState][147]>**

## updateInstanceMetadata

[lib/migrations.js:184-244][148]

Imports the latest toolkit metadata

### Parameters

*   `env` **[Environment][125]**
*   `lifeCycleModule` **[MigrationLifecycleFunctions][149]**

Returns **[Promise][118]\<void>**

## updateInstanceMigrations

[lib/migrations.js:252-266][150]

Updates instance with new migrations set

### Parameters

*   `env`  {Environment}
*   `migrations`  {string\[]}

Returns **[Promise][118]\<void>**

## migrateInstance

[lib/migrations.js:281-408][151]

Inspects an instance and executes site impex imports and "migration scripts" from the
given `dir`.

### Parameters

*   `env` **[Environment][125]**
*   `dir` **[string][110]** migrations directory
*   `exclude` **[Array][122]<[string][110]>** array of regular expression strings (optional, default `[]`)
*   `apply` **[boolean][111]** should migrations be applied to the instance after running? (optional, default `true`)
*   `dryRun` **[boolean][111]** only output migrations to be run (optional, default `false`)
*   `forceBootstrap` **[boolean][111]**  (optional, default `false`)
*   `allowBootstrap` **[boolean][111]**  (optional, default `true`)

Returns **[Promise][118]\<void>**

## lifeCycleModule

[lib/migrations.js:288-288][152]

## runMigrationScript

[lib/migrations.js:359-359][153]

## runMigrationScript

[lib/migrations.js:416-426][154]

### Parameters

*   `env` **[Environment][125]**
*   `target` **[string][110]** path to migration script

Returns **[Promise][118]<[boolean][111]>**

## processContent

[lib/command-export.js:23-68][155]

Recursively process a <content> to extract child components and images

### Parameters

*   `content`  jsonified version of <content> via xml2js
*   `allPages`  {object}
*   `contentToKeep`  {Set} array of page ids to retain from library (mutable)
*   `filesToDownload`  {string\[]} array of files to download from webdav static dir (mutable)
*   `logPrefix`  for debugging output
*   `assetQuery`  {string\[]}

## CollectionLists

[lib/command-export.js:186-245][156]

Type: [Object][109]

### Properties

*   `sites` **[Array][122]<[string][110]>**
*   `inventoryLists` **[Array][122]<[string][110]>**
*   `catalogs` **[Array][122]<[string][110]>**

## getCollectionsFromInstance

[lib/command-export.js:186-245][157]

Retrieves list of catalogs, inventory lists, sites and libraries for interactive display

### Parameters

*   `env`  {Environment}

Returns **[Promise][118]<[CollectionLists][158]>**

## getDataUnitsFromWeb

[lib/command-export.js:254-336][159]

Launch a web page to collect data units to export

### Parameters

*   `env`  {Environment}
*   `collections`  {CollectionLists}

Returns **[Promise][118]<[object][109]>**

## configNameFromHostname

[lib/command-instance.js:12-15][160]

### Parameters

*   `hostname` **[string][110]**

## LogFile

[lib/command-tail.js:19-42][161]

Type: [Object][109]

### Properties

*   `name` **[string][110]**
*   `lastModified` **[Date][120]**

## getLogs

[lib/command-tail.js:19-42][162]

Get the logs from the instance

### Parameters

*   `env`  {Environment}

Returns **[Promise][118]<[Array][122]<[LogFile][163]>>**

## tailCommand

[lib/command-tail.js:49-104][164]

### Parameters

*   `filters`  {string\[]}

Returns **[Promise][118]\<void>**

## b2cTools/jobs

[lib/jobs.js:6-6][165]

import and export job helpers

## waitForJob

[lib/jobs.js:24-53][166]

### Parameters

*   `env` **[Environment][125]**
*   `jobId` **[string][110]** job identifier
*   `executionId` **[string][110]** job execution id

Returns **[Promise][118]\<void>**

## JobExecutionParameter

[lib/jobs.js:75-80][167]

Type: [Object][109]

### Properties

*   `name` **[string][110]**
*   `value` **[string][110]**

## JobExecution

[lib/jobs.js:75-80][168]

Type: [Object][109]

### Properties

*   `id` **[string][110]**
*   `job_id` **[string][110]**
*   `status` **[string][110]**

## executeJob

[lib/jobs.js:75-80][169]

### Parameters

*   `env` **[Environment][125]**
*   `jobId` **[string][110]** job identifier
*   `parameters` **[Array][122]<[JobExecutionParameter][170]>**  (optional, default `[]`)

Returns **[Promise][118]\<void>**

## siteArchiveImport

[lib/jobs.js:92-143][171]

Import a site impex

### Parameters

*   `env` **[Environment][125]**
*   `target` **([string][110] | [Buffer][172])** directory, zip file path or buffer of zip content
*   `options` **[object][109]**

    *   `options.archiveName` **[string][110]?** required if Buffer is used
    *   `options.keepArchive` **[boolean][111]?** if true, keep archive on isntance

Returns **[Promise][118]\<void>**

## ExportSitesConfiguration

[lib/jobs.js:227-246][173]

Type: [Object][109]

### Properties

*   `ab_tests` **([undefined][141] | [boolean][111])**
*   `active_data_feeds` **([undefined][141] | [boolean][111])**
*   `all` **([undefined][141] | [boolean][111])**
*   `cache_settings` **([undefined][141] | [boolean][111])**
*   `campaigns_and_promotions` **([undefined][141] | [boolean][111])**
*   `content` **([undefined][141] | [boolean][111])**
*   `coupons` **([undefined][141] | [boolean][111])**
*   `custom_objects` **([undefined][141] | [boolean][111])**
*   `customer_cdn_settings` **([undefined][141] | [boolean][111])**
*   `customer_groups` **([undefined][141] | [boolean][111])**
*   `distributed_commerce_extensions` **([undefined][141] | [boolean][111])**
*   `dynamic_file_resources` **([undefined][141] | [boolean][111])**
*   `gift_certificates` **([undefined][141] | [boolean][111])**
*   `ocapi_settings` **([undefined][141] | [boolean][111])**
*   `payment_methods` **([undefined][141] | [boolean][111])**
*   `payment_processors` **([undefined][141] | [boolean][111])**
*   `redirect_urls` **([undefined][141] | [boolean][111])**
*   `search_settings` **([undefined][141] | [boolean][111])**
*   `shipping` **([undefined][141] | [boolean][111])**
*   `site_descriptor` **([undefined][141] | [boolean][111])**
*   `site_preferences` **([undefined][141] | [boolean][111])**
*   `sitemap_settings` **([undefined][141] | [boolean][111])**
*   `slots` **([undefined][141] | [boolean][111])**
*   `sorting_rules` **([undefined][141] | [boolean][111])**
*   `source_codes` **([undefined][141] | [boolean][111])**
*   `static_dynamic_alias_mappings` **([undefined][141] | [boolean][111])**
*   `stores` **([undefined][141] | [boolean][111])**
*   `tax` **([undefined][141] | [boolean][111])**
*   `url_rules` **([undefined][141] | [boolean][111])**

## ExportGlobalDataConfiguration

[lib/jobs.js:227-246][174]

Type: [Object][109]

### Properties

*   `access_roles` **([undefined][141] | [boolean][111])**
*   `all` **([undefined][141] | [boolean][111])**
*   `csc_settings` **([undefined][141] | [boolean][111])**
*   `csrf_whitelists` **([undefined][141] | [boolean][111])**
*   `custom_preference_groups` **([undefined][141] | [boolean][111])**
*   `custom_quota_settings` **([undefined][141] | [boolean][111])**
*   `custom_types` **([undefined][141] | [boolean][111])**
*   `geolocations` **([undefined][141] | [boolean][111])**
*   `global_custom_objects` **([undefined][141] | [boolean][111])**
*   `job_schedules` **([undefined][141] | [boolean][111])**
*   `job_schedules_deprecated` **([undefined][141] | [boolean][111])**
*   `locales` **([undefined][141] | [boolean][111])**
*   `meta_data` **([undefined][141] | [boolean][111])**
*   `oauth_providers` **([undefined][141] | [boolean][111])**
*   `ocapi_settings` **([undefined][141] | [boolean][111])**
*   `page_meta_tags` **([undefined][141] | [boolean][111])**
*   `preferences` **([undefined][141] | [boolean][111])**
*   `price_adjustment_limits` **([undefined][141] | [boolean][111])**
*   `services` **([undefined][141] | [boolean][111])**
*   `sorting_rules` **([undefined][141] | [boolean][111])**
*   `static_resources` **([undefined][141] | [boolean][111])**
*   `system_type_definitions` **([undefined][141] | [boolean][111])**
*   `users` **([undefined][141] | [boolean][111])**
*   `webdav_client_permissions` **([undefined][141] | [boolean][111])**

## ExportDataUnitsConfiguration

[lib/jobs.js:227-246][175]

Type: [Object][109]

### Properties

*   `catalog_static_resources` **([undefined][141] | [Object][109]<[string][110], [boolean][111]>)**
*   `catalogs` **([undefined][141] | [Object][109]<[string][110], [boolean][111]>)**
*   `customer_lists` **([undefined][141] | [Object][109]<[string][110], [boolean][111]>)**
*   `inventory_lists` **([undefined][141] | [Object][109]<[string][110], [boolean][111]>)**
*   `library_static_resources` **([undefined][141] | [Object][109]<[string][110], [boolean][111]>)**
*   `libraries` **([undefined][141] | [Object][109]<[string][110], [boolean][111]>)**
*   `price_books` **([undefined][141] | [Object][109]<[string][110], [boolean][111]>)**
*   `sites` **([undefined][141] | [Object][109]<[string][110], [ExportSitesConfiguration][176]>)**
*   `global_data` **([undefined][141] | [ExportGlobalDataConfiguration][177])**

## siteArchiveExport

[lib/jobs.js:227-246][178]

Export the given site archive, returning the zip data

### Parameters

*   `env` **[Environment][125]**
*   `dataUnits` **[ExportDataUnitsConfiguration][179]**
*   `zipFilename` **[string][110]** filename of the export

Returns **[Promise][118]<[Buffer][172]>**

## siteArchiveExportJSON

[lib/jobs.js:262-276][180]

Export an object of impex files to JSON objects in xml2js form

returns:
{
"meta/system-objecttype-extensions.xml": {
...
}
}

### Parameters

*   `env` **[Environment][125]**
*   `dataUnits` **[ExportDataUnitsConfiguration][179]**

Returns **[Promise][118]<[Map][181]<[string][110], [object][109]>>**

## siteArchiveImportJSON

[lib/jobs.js:285-308][182]

Imports an object of impex filenames to objects to XML/JSON/text

### Parameters

*   `env` **[Environment][125]**
*   `data` **[Map][181]<[string][110], [object][109]>**

Returns **[Promise][118]\<void>**

## siteArchiveExportText

[lib/jobs.js:322-339][183]

Export an object of impex files to strings of XML

returns:
{
"meta/system-objecttype-extensions.xml": "\<?xml version="1.0"...."
}

### Parameters

*   `env` **[Environment][125]**
*   `dataUnits` **[ExportDataUnitsConfiguration][179]**

Returns **[Promise][118]<[Map][181]<[string][110], [string][110]>>**

## siteArchiveImportText

[lib/jobs.js:348-363][184]

Import filename to text strings as site impex

### Parameters

*   `env` **[Environment][125]**
*   `data` **[Map][181]<[string][110], [string][110]>**

Returns **[Promise][118]\<void>**

## ResourceDocument

[lib/jobs.js:386-393][185]

Type: [Object][109]

### Properties

*   `resource_id` **[string][110]**
*   `cache_time` **[number][131]**
*   `methods` **[Array][122]<[string][110]>**
*   `read_attributes` **[string][110]**
*   `write_attributes` **[string][110]**

## permissionValidatorCallback

[lib/jobs.js:386-393][186]

This callback is displayed as part of the Requester class.

Type: [Function][128]

Returns **[boolean][111]** true if permission is validated

## compareResourceDocuments

[lib/jobs.js:386-393][187]

### Parameters

*   `a` **[ResourceDocument][188]**
*   `b` **[ResourceDocument][188]**

Returns **[boolean][111]** true if the documents are trivially equal

## ensureDataAPIPermissions

[lib/jobs.js:411-464][189]

Ensures the environment has access to the given DATA API resources by adding or updating
Resource Documents for the client ID.

If changes are made `validator` will be called asynchronously until it returns true

Note: this method only trivially compares resource identifiers, methods and read/write attributes. If all
values are equal to the instance's state the resource will not be updated.

### Parameters

*   `env` **[Environment][125]**
*   `resources` **[Array][122]<[ResourceDocument][188]>** array of resources to add/update (optional, default `[]`)
*   `validator` **[permissionValidatorCallback][190]** array of resources to add/update
*   `options` **[object][109]**

    *   `options.maximumChecks` **[number][131]?** maximum number of permission checks (optional, default `60`)

Returns **[Promise][118]\<void>**

## sleep

[lib/util.js:7-9][191]

Sleep for ms milliseconds

### Parameters

*   `ms`  {number} milliseconds

Returns **[Promise][118]\<void>**

## CartridgeMapping

[lib/code.js:22-36][192]

Type: [Object][109]

### Properties

*   `dest` **[string][110]** cartridge name
*   `src` **[string][110]** directory

## findCartridges

[lib/code.js:22-36][193]

Find Cartridges recursively in the working directory

Returns **[Array][122]<[CartridgeMapping][194]>**

## reloadCodeVersion

[lib/code.js:44-62][195]

Reloads (or activates) the environments code version

### Parameters

*   `env` **[Environment][125]**

Returns **[Promise][118]\<void>**

## syncCartridges

[lib/code.js:72-102][196]

Syncs the given cartridge mapping (src:dest) to the environments code version

### Parameters

*   `env` **[Environment][125]**
*   `cartridges` **[Array][122]<[CartridgeMapping][194]>**
*   `reload` **[boolean][111]**  (optional, default `false`)

Returns **[Promise][118]\<void>**

## downloadCodeVersion

[lib/code.js:110-123][197]

Downloads the code version as a zipped archive

### Parameters

*   `env` **[Environment][125]**

Returns **[Promise][118]<[Buffer][172]>**

[1]: #environmentopts

[2]: #properties

[3]: #environment

[4]: #parameters

[5]: #examples

[6]: #am

[7]: #ocapi

[8]: #webdav

[9]: #deauthenticate

[10]: #accesstokenresponse

[11]: #properties-1

[12]: #collectmigrations

[13]: #parameters-1

[14]: #migrationhelpers

[15]: #migrationscriptarguments

[16]: #properties-2

[17]: #migrationscriptcallback

[18]: #parameters-2

[19]: #toolkitinstancestate

[20]: #properties-3

[21]: #onbootstraplifecyclefunction

[22]: #parameters-3

[23]: #beforealllifecyclefunction

[24]: #parameters-4

[25]: #beforeeachlifecyclefunction

[26]: #parameters-5

[27]: #aftereachlifecyclefunction

[28]: #parameters-6

[29]: #afteralllifecyclefunction

[30]: #parameters-7

[31]: #onfailurelifecyclefunction

[32]: #parameters-8

[33]: #migrationlifecyclefunctions

[34]: #properties-4

[35]: #getinstancestate

[36]: #parameters-9

[37]: #updateinstancemetadata

[38]: #parameters-10

[39]: #updateinstancemigrations

[40]: #parameters-11

[41]: #migrateinstance

[42]: #parameters-12

[43]: #lifecyclemodule

[44]: #runmigrationscript

[45]: #runmigrationscript-1

[46]: #parameters-13

[47]: #processcontent

[48]: #parameters-14

[49]: #collectionlists

[50]: #properties-5

[51]: #getcollectionsfrominstance

[52]: #parameters-15

[53]: #getdataunitsfromweb

[54]: #parameters-16

[55]: #confignamefromhostname

[56]: #parameters-17

[57]: #logfile

[58]: #properties-6

[59]: #getlogs

[60]: #parameters-18

[61]: #tailcommand

[62]: #parameters-19

[63]: #b2ctoolsjobs

[64]: #waitforjob

[65]: #parameters-20

[66]: #jobexecutionparameter

[67]: #properties-7

[68]: #jobexecution

[69]: #properties-8

[70]: #executejob

[71]: #parameters-21

[72]: #sitearchiveimport

[73]: #parameters-22

[74]: #exportsitesconfiguration

[75]: #properties-9

[76]: #exportglobaldataconfiguration

[77]: #properties-10

[78]: #exportdataunitsconfiguration

[79]: #properties-11

[80]: #sitearchiveexport

[81]: #parameters-23

[82]: #sitearchiveexportjson

[83]: #parameters-24

[84]: #sitearchiveimportjson

[85]: #parameters-25

[86]: #sitearchiveexporttext

[87]: #parameters-26

[88]: #sitearchiveimporttext

[89]: #parameters-27

[90]: #resourcedocument

[91]: #properties-12

[92]: #permissionvalidatorcallback

[93]: #compareresourcedocuments

[94]: #parameters-28

[95]: #ensuredataapipermissions

[96]: #parameters-29

[97]: #sleep

[98]: #parameters-30

[99]: #cartridgemapping

[100]: #properties-13

[101]: #findcartridges

[102]: #reloadcodeversion

[103]: #parameters-31

[104]: #synccartridges

[105]: #parameters-32

[106]: #downloadcodeversion

[107]: #parameters-33

[108]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/environment.js#L47-L59 "Source code on GitHub"

[109]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[110]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[111]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[112]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/environment.js#L74-L378 "Source code on GitHub"

[113]: #environmentopts

[114]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/environment.js#L117-L132 "Source code on GitHub"

[115]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/environment.js#L139-L154 "Source code on GitHub"

[116]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/environment.js#L161-L176 "Source code on GitHub"

[117]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/environment.js#L373-L377 "Source code on GitHub"

[118]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[119]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/environment.js#L311-L315 "Source code on GitHub"

[120]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[121]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L37-L47 "Source code on GitHub"

[122]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[123]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L52-L69 "Source code on GitHub"

[124]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L72-L77 "Source code on GitHub"

[125]: #environment

[126]: #migrationhelpers

[127]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L79-L84 "Source code on GitHub"

[128]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[129]: #migrationscriptarguments

[130]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L86-L91 "Source code on GitHub"

[131]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[132]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L93-L97 "Source code on GitHub"

[133]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L99-L106 "Source code on GitHub"

[134]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L108-L114 "Source code on GitHub"

[135]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L116-L122 "Source code on GitHub"

[136]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L124-L130 "Source code on GitHub"

[137]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L132-L138 "Source code on GitHub"

[138]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error

[139]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L140-L148 "Source code on GitHub"

[140]: #onbootstraplifecyclefunction

[141]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined

[142]: #beforealllifecyclefunction

[143]: #beforeeachlifecyclefunction

[144]: #afteralllifecyclefunction

[145]: #onfailurelifecyclefunction

[146]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L156-L175 "Source code on GitHub"

[147]: #toolkitinstancestate

[148]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L184-L244 "Source code on GitHub"

[149]: #migrationlifecyclefunctions

[150]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L252-L266 "Source code on GitHub"

[151]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L281-L408 "Source code on GitHub"

[152]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L288-L288 "Source code on GitHub"

[153]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L359-L359 "Source code on GitHub"

[154]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/migrations.js#L416-L426 "Source code on GitHub"

[155]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/command-export.js#L23-L68 "Source code on GitHub"

[156]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/command-export.js#L173-L178 "Source code on GitHub"

[157]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/command-export.js#L186-L245 "Source code on GitHub"

[158]: #collectionlists

[159]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/command-export.js#L254-L336 "Source code on GitHub"

[160]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/command-instance.js#L12-L15 "Source code on GitHub"

[161]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/command-tail.js#L7-L11 "Source code on GitHub"

[162]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/command-tail.js#L19-L42 "Source code on GitHub"

[163]: #logfile

[164]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/command-tail.js#L49-L104 "Source code on GitHub"

[165]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L6-L6 "Source code on GitHub"

[166]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L24-L53 "Source code on GitHub"

[167]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L55-L59 "Source code on GitHub"

[168]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L61-L66 "Source code on GitHub"

[169]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L75-L80 "Source code on GitHub"

[170]: #jobexecutionparameter

[171]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L92-L143 "Source code on GitHub"

[172]: https://nodejs.org/api/buffer.html

[173]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L145-L176 "Source code on GitHub"

[174]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L178-L204 "Source code on GitHub"

[175]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L206-L217 "Source code on GitHub"

[176]: #exportsitesconfiguration

[177]: #exportglobaldataconfiguration

[178]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L227-L246 "Source code on GitHub"

[179]: #exportdataunitsconfiguration

[180]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L262-L276 "Source code on GitHub"

[181]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map

[182]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L285-L308 "Source code on GitHub"

[183]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L322-L339 "Source code on GitHub"

[184]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L348-L363 "Source code on GitHub"

[185]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L365-L372 "Source code on GitHub"

[186]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L374-L378 "Source code on GitHub"

[187]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L386-L393 "Source code on GitHub"

[188]: #resourcedocument

[189]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/jobs.js#L411-L464 "Source code on GitHub"

[190]: #permissionvalidatorcallback

[191]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/util.js#L7-L9 "Source code on GitHub"

[192]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/code.js#L11-L15 "Source code on GitHub"

[193]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/code.js#L22-L36 "Source code on GitHub"

[194]: #cartridgemapping

[195]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/code.js#L44-L62 "Source code on GitHub"

[196]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/code.js#L72-L102 "Source code on GitHub"

[197]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/9a518b45295aef93c441cf44b2eb87bd29ace8f3/lib/code.js#L110-L123 "Source code on GitHub"

