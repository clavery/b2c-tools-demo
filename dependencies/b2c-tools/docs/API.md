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
*   [getDataUnitsFromWeb][49]
    *   [Parameters][50]
*   [configNameFromHostname][51]
    *   [Parameters][52]
*   [CartridgeMapping][53]
    *   [Properties][54]
*   [findCartridges][55]
*   [reloadCodeVersion][56]
    *   [Parameters][57]
*   [syncCartridges][58]
    *   [Parameters][59]
*   [LogFile][60]
    *   [Properties][61]
*   [getLogs][62]
    *   [Parameters][63]
*   [tailCommand][64]
    *   [Parameters][65]
*   [b2cTools/jobs][66]
*   [waitForJob][67]
    *   [Parameters][68]
*   [siteArchiveImport][69]
    *   [Parameters][70]
*   [ExportSitesConfiguration][71]
    *   [Properties][72]
*   [ExportGlobalDataConfiguration][73]
    *   [Properties][74]
*   [ExportDataUnitsConfiguration][75]
    *   [Properties][76]
*   [siteArchiveExport][77]
    *   [Parameters][78]
*   [siteArchiveExportJSON][79]
    *   [Parameters][80]
*   [siteArchiveImportJSON][81]
    *   [Parameters][82]
*   [siteArchiveExportText][83]
    *   [Parameters][84]
*   [siteArchiveImportText][85]
    *   [Parameters][86]
*   [ResourceDocument][87]
    *   [Properties][88]
*   [permissionValidatorCallback][89]
*   [compareResourceDocuments][90]
    *   [Parameters][91]
*   [ensureDataAPIPermissions][92]
    *   [Parameters][93]
*   [sleep][94]
    *   [Parameters][95]

## EnvironmentOpts

[lib/environment.js:74-378][96]

Type: [Object][97]

### Properties

*   `server` **[string][98]**
*   `secureServer` **[string][98]** optional hostname used for WebDAV access
*   `username` **[string][98]**
*   `password` **[string][98]**
*   `clientID` **[string][98]**
*   `clientSecret` **[string][98]**
*   `codeVersion` **[string][98]**
*   `verify` **[boolean][99]** verify SSL
*   `certificate` **[string][98]** pfx path
*   `passphrase` **[string][98]** passphrase for pfx above

## Environment

[lib/environment.js:74-378][100]

Provides for authentication and WebDAV/OCAPI access

### Parameters

*   `opts` **[EnvironmentOpts][101]**  (optional, default `{}`)

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

[lib/environment.js:117-132][102]

account manager (account.demandware.net) scoped Axios instance

Type: axios.AxiosInstance

### ocapi

[lib/environment.js:139-154][103]

OCAPI scoped Axios Client

Type: axios.AxiosInstance

### webdav

[lib/environment.js:161-176][104]

WebDAV scoped Axios Client

Type: axios.AxiosInstance

### deauthenticate

[lib/environment.js:373-377][105]

Clear access token so auths are performed anew

Returns **[Promise][106]\<void>**

## AccessTokenResponse

[lib/environment.js:322-335][107]

Type: [Object][97]

### Properties

*   `accessToken` **[string][98]**
*   `expires` **[Date][108]**

## collectMigrations

[lib/migrations.js:37-47][109]

Find all migration directories and scripts; excluding those matching the given patterns

### Parameters

*   `dir`  {string}
*   `exclude`  {string\[]} (optional, default `[]`)

Returns **[Promise][106]<[Array][110]<[string][98]>>**

## MigrationHelpers

[lib/migrations.js:52-68][111]

## MigrationScriptArguments

[lib/migrations.js:153-171][112]

Type: [Object][97]

### Properties

*   `env` **[Environment][113]**
*   `logger` **Logger**
*   `helpers` **[MigrationHelpers][114]**

## MigrationScriptCallback

[lib/migrations.js:153-171][115]

Type: [Function][116]

### Parameters

*   `args` **[MigrationScriptArguments][117]**

Returns **[Promise][106]<([boolean][99] | void)>**

## ToolkitInstanceState

[lib/migrations.js:153-171][118]

Type: [Object][97]

### Properties

*   `b2cToolkitDataVersion` **[number][119]**
*   `b2cToolkitMigrations` **[string][98]**

## OnBootstrapLifecycleFunction

[lib/migrations.js:153-171][120]

Type: [Function][116]

### Parameters

*   `args` **[MigrationScriptArguments][117]**

Returns **[Promise][106]\<void>**

## BeforeAllLifecycleFunction

[lib/migrations.js:153-171][121]

Type: [Function][116]

### Parameters

*   `args` **[MigrationScriptArguments][117]**
*   `migrationsToRun` **[Array][110]<[string][98]>** list of migrations that will be run (mutable)
*   `willApply` **[boolean][99]** true if migrations will be applied to the instance

Returns **[Promise][106]\<void>**

## BeforeEachLifecycleFunction

[lib/migrations.js:153-171][122]

Type: [Function][116]

### Parameters

*   `args` **[MigrationScriptArguments][117]**
*   `migration` **[string][98]** migration to be run
*   `willApply` **[boolean][99]** true if migrations will be applied to the instance

Returns **[Promise][106]<[boolean][99]>** return false to skip the current migration

## AfterEachLifecycleFunction

[lib/migrations.js:153-171][123]

Type: [Function][116]

### Parameters

*   `args` **[MigrationScriptArguments][117]**
*   `migration` **[string][98]** migration to be run
*   `willApply` **[boolean][99]** true if migrations will be applied to the instance

Returns **[Promise][106]\<void>**

## AfterAllLifecycleFunction

[lib/migrations.js:153-171][124]

Type: [Function][116]

### Parameters

*   `args` **[MigrationScriptArguments][117]**
*   `migrationsRan` **[Array][110]<[string][98]>** list of migrations ran
*   `willApply` **[boolean][99]** true if migrations will be applied to the instance

Returns **[Promise][106]\<void>**

## OnFailureLifecycleFunction

[lib/migrations.js:153-171][125]

Type: [Function][116]

### Parameters

*   `args` **[MigrationScriptArguments][117]**
*   `migration` **[string][98]** migration to be run
*   `e` **[Error][126]** exception raised during migration run

Returns **[Promise][106]\<void>** re-raise exception or new exception to stop migration run

## MigrationLifecycleFunctions

[lib/migrations.js:153-171][127]

Type: [Object][97]

### Properties

*   `onBootstrap` **([OnBootstrapLifecycleFunction][128] | [undefined][129])**
*   `beforeAll` **([BeforeAllLifecycleFunction][130] | [undefined][129])**
*   `beforeEach` **([BeforeEachLifecycleFunction][131] | [undefined][129])**
*   `afterEach` **([AfterAllLifecycleFunction][132] | [undefined][129])**
*   `afterAll` **([AfterAllLifecycleFunction][132] | [undefined][129])**
*   `onFailure` **([OnFailureLifecycleFunction][133] | [undefined][129])**

## getInstanceState

[lib/migrations.js:153-171][134]

Get the instance state from global preferences

### Parameters

*   `env`  {Environment}

Returns **[Promise][106]<[ToolkitInstanceState][135]>**

## updateInstanceMetadata

[lib/migrations.js:180-229][136]

Imports the latest toolkit metadata

### Parameters

*   `env` **[Environment][113]**
*   `lifeCycleModule` **[MigrationLifecycleFunctions][137]**

Returns **[Promise][106]\<void>**

## updateInstanceMigrations

[lib/migrations.js:237-251][138]

Updates instance with new migrations set

### Parameters

*   `env`  {Environment}
*   `migrations`  {string\[]}

Returns **[Promise][106]\<void>**

## migrateInstance

[lib/migrations.js:265-384][139]

Inspects an instance and executes site impex imports and "migration scripts" from the
given `dir`.

### Parameters

*   `env` **[Environment][113]**
*   `dir` **[string][98]** migrations directory
*   `exclude` **[Array][110]<[string][98]>** array of regular expression strings (optional, default `[]`)
*   `apply` **[boolean][99]** should migrations be applied to the instance after running? (optional, default `true`)
*   `dryRun` **[boolean][99]** only output migrations to be run (optional, default `false`)
*   `forceBootstrap` **[boolean][99]**  (optional, default `false`)

Returns **[Promise][106]\<void>**

## lifeCycleModule

[lib/migrations.js:272-272][140]

## runMigrationScript

[lib/migrations.js:335-335][141]

## runMigrationScript

[lib/migrations.js:392-402][142]

### Parameters

*   `env` **[Environment][113]**
*   `target` **[string][98]** path to migration script

Returns **[Promise][106]<[boolean][99]>**

## processContent

[lib/command-export.js:23-68][143]

Recursively process a <content> to extract child components and images

### Parameters

*   `content`  jsonified version of <content> via xml2js
*   `allPages`  {object}
*   `contentToKeep`  {Set} array of page ids to retain from library (mutable)
*   `filesToDownload`  {string\[]} array of files to download from webdav static dir (mutable)
*   `logPrefix`  for debugging output
*   `assetQuery`  {string\[]}

## getDataUnitsFromWeb

[lib/command-export.js:181-253][144]

Launch a web page to collect data units to export

### Parameters

*   `sites`  {string\[]}
*   `catalogs`  {string\[]}
*   `env`  {Environment}

Returns **[Promise][106]<[object][97]>**

## configNameFromHostname

[lib/command-instance.js:12-15][145]

### Parameters

*   `hostname` **[string][98]**

## CartridgeMapping

[lib/code.js:22-36][146]

Type: [Object][97]

### Properties

*   `dest` **[string][98]** cartridge name
*   `src` **[string][98]** directory

## findCartridges

[lib/code.js:22-36][147]

Find Cartridges recursively in the working directory

Returns **[Array][110]<[CartridgeMapping][148]>**

## reloadCodeVersion

[lib/code.js:44-62][149]

Reloads (or activates) the environments code version

### Parameters

*   `env` **[Environment][113]**

Returns **[Promise][106]\<void>**

## syncCartridges

[lib/code.js:72-102][150]

Syncs the given cartridge mapping (src:dest) to the environments code version

### Parameters

*   `env` **[Environment][113]**
*   `cartridges` **[Array][110]<[CartridgeMapping][148]>**
*   `reload` **[boolean][99]**  (optional, default `false`)

Returns **[Promise][106]\<void>**

## LogFile

[lib/command-tail.js:19-42][151]

Type: [Object][97]

### Properties

*   `name` **[string][98]**
*   `lastModified` **[Date][108]**

## getLogs

[lib/command-tail.js:19-42][152]

Get the logs from the instance

### Parameters

*   `env`  {Environment}

Returns **[Promise][106]<[Array][110]<[LogFile][153]>>**

## tailCommand

[lib/command-tail.js:49-104][154]

### Parameters

*   `filters`  {string\[]}

Returns **[Promise][106]\<void>**

## b2cTools/jobs

[lib/jobs.js:6-6][155]

import and export job helpers

## waitForJob

[lib/jobs.js:24-49][156]

### Parameters

*   `env`  {Environment}
*   `jobId`  {string} job identifier
*   `executionId`  {string} job execution id

Returns **[Promise][106]\<void>**

## siteArchiveImport

[lib/jobs.js:59-102][157]

Import a site impex

### Parameters

*   `env` **[Environment][113]**
*   `target` **([string][98] | [Buffer][158])** directory, zip file path or buffer of zip content
*   `archiveName` **[string][98]** require if Buffer is used

Returns **[Promise][106]\<void>**

## ExportSitesConfiguration

[lib/jobs.js:186-205][159]

Type: [Object][97]

### Properties

*   `ab_tests` **([undefined][129] | [boolean][99])**
*   `active_data_feeds` **([undefined][129] | [boolean][99])**
*   `all` **([undefined][129] | [boolean][99])**
*   `cache_settings` **([undefined][129] | [boolean][99])**
*   `campaigns_and_promotions` **([undefined][129] | [boolean][99])**
*   `content` **([undefined][129] | [boolean][99])**
*   `coupons` **([undefined][129] | [boolean][99])**
*   `custom_objects` **([undefined][129] | [boolean][99])**
*   `customer_cdn_settings` **([undefined][129] | [boolean][99])**
*   `customer_groups` **([undefined][129] | [boolean][99])**
*   `distributed_commerce_extensions` **([undefined][129] | [boolean][99])**
*   `dynamic_file_resources` **([undefined][129] | [boolean][99])**
*   `gift_certificates` **([undefined][129] | [boolean][99])**
*   `ocapi_settings` **([undefined][129] | [boolean][99])**
*   `payment_methods` **([undefined][129] | [boolean][99])**
*   `payment_processors` **([undefined][129] | [boolean][99])**
*   `redirect_urls` **([undefined][129] | [boolean][99])**
*   `search_settings` **([undefined][129] | [boolean][99])**
*   `shipping` **([undefined][129] | [boolean][99])**
*   `site_descriptor` **([undefined][129] | [boolean][99])**
*   `site_preferences` **([undefined][129] | [boolean][99])**
*   `sitemap_settings` **([undefined][129] | [boolean][99])**
*   `slots` **([undefined][129] | [boolean][99])**
*   `sorting_rules` **([undefined][129] | [boolean][99])**
*   `source_codes` **([undefined][129] | [boolean][99])**
*   `static_dynamic_alias_mappings` **([undefined][129] | [boolean][99])**
*   `stores` **([undefined][129] | [boolean][99])**
*   `tax` **([undefined][129] | [boolean][99])**
*   `url_rules` **([undefined][129] | [boolean][99])**

## ExportGlobalDataConfiguration

[lib/jobs.js:186-205][160]

Type: [Object][97]

### Properties

*   `access_roles` **([undefined][129] | [boolean][99])**
*   `all` **([undefined][129] | [boolean][99])**
*   `csc_settings` **([undefined][129] | [boolean][99])**
*   `csrf_whitelists` **([undefined][129] | [boolean][99])**
*   `custom_preference_groups` **([undefined][129] | [boolean][99])**
*   `custom_quota_settings` **([undefined][129] | [boolean][99])**
*   `custom_types` **([undefined][129] | [boolean][99])**
*   `geolocations` **([undefined][129] | [boolean][99])**
*   `global_custom_objects` **([undefined][129] | [boolean][99])**
*   `job_schedules` **([undefined][129] | [boolean][99])**
*   `job_schedules_deprecated` **([undefined][129] | [boolean][99])**
*   `locales` **([undefined][129] | [boolean][99])**
*   `meta_data` **([undefined][129] | [boolean][99])**
*   `oauth_providers` **([undefined][129] | [boolean][99])**
*   `ocapi_settings` **([undefined][129] | [boolean][99])**
*   `page_meta_tags` **([undefined][129] | [boolean][99])**
*   `preferences` **([undefined][129] | [boolean][99])**
*   `price_adjustment_limits` **([undefined][129] | [boolean][99])**
*   `services` **([undefined][129] | [boolean][99])**
*   `sorting_rules` **([undefined][129] | [boolean][99])**
*   `static_resources` **([undefined][129] | [boolean][99])**
*   `system_type_definitions` **([undefined][129] | [boolean][99])**
*   `users` **([undefined][129] | [boolean][99])**
*   `webdav_client_permissions` **([undefined][129] | [boolean][99])**

## ExportDataUnitsConfiguration

[lib/jobs.js:186-205][161]

Type: [Object][97]

### Properties

*   `catalog_static_resources` **([undefined][129] | [Object][97]<[string][98], [boolean][99]>)**
*   `catalogs` **([undefined][129] | [Object][97]<[string][98], [boolean][99]>)**
*   `customer_lists` **([undefined][129] | [Object][97]<[string][98], [boolean][99]>)**
*   `inventory_lists` **([undefined][129] | [Object][97]<[string][98], [boolean][99]>)**
*   `library_static_resources` **([undefined][129] | [Object][97]<[string][98], [boolean][99]>)**
*   `libraries` **([undefined][129] | [Object][97]<[string][98], [boolean][99]>)**
*   `price_books` **([undefined][129] | [Object][97]<[string][98], [boolean][99]>)**
*   `sites` **([undefined][129] | [Object][97]<[string][98], [ExportSitesConfiguration][162]>)**
*   `global_data` **([undefined][129] | [ExportGlobalDataConfiguration][163])**

## siteArchiveExport

[lib/jobs.js:186-205][164]

Export the given site archive, returning the zip data

### Parameters

*   `env` **[Environment][113]**
*   `dataUnits` **[ExportDataUnitsConfiguration][165]**
*   `zipFilename` **[string][98]** filename of the export or autogenerated

Returns **[Promise][106]<[Buffer][158]>**

## siteArchiveExportJSON

[lib/jobs.js:221-235][166]

Export an object of impex files to JSON objects in xml2js form

returns:
{
"meta/system-objecttype-extensions.xml": {
...
}
}

### Parameters

*   `env` **[Environment][113]**
*   `dataUnits` **[ExportDataUnitsConfiguration][165]**

Returns **[Promise][106]<[Map][167]<[string][98], [object][97]>>**

## siteArchiveImportJSON

[lib/jobs.js:244-265][168]

Imports an object of impex filenames to objects to XML/JSON/text

### Parameters

*   `env` **[Environment][113]**
*   `data` **[Map][167]<[string][98], [object][97]>**

Returns **[Promise][106]\<void>**

## siteArchiveExportText

[lib/jobs.js:279-296][169]

Export an object of impex files to strings of XML

returns:
{
"meta/system-objecttype-extensions.xml": "\<?xml version="1.0"...."
}

### Parameters

*   `env` **[Environment][113]**
*   `dataUnits` **[ExportDataUnitsConfiguration][165]**

Returns **[Promise][106]<[Map][167]<[string][98], [string][98]>>**

## siteArchiveImportText

[lib/jobs.js:305-318][170]

Import filename to text strings as site impex

### Parameters

*   `env` **[Environment][113]**
*   `data` **[Map][167]<[string][98], [string][98]>**

Returns **[Promise][106]\<void>**

## ResourceDocument

[lib/jobs.js:341-348][171]

Type: [Object][97]

### Properties

*   `resource_id` **[string][98]**
*   `cache_time` **[number][119]**
*   `methods` **[Array][110]<[string][98]>**
*   `read_attributes` **[string][98]**
*   `write_attributes` **[string][98]**

## permissionValidatorCallback

[lib/jobs.js:341-348][172]

This callback is displayed as part of the Requester class.

Type: [Function][116]

Returns **[boolean][99]** true if permission is validated

## compareResourceDocuments

[lib/jobs.js:341-348][173]

### Parameters

*   `a` **[ResourceDocument][174]**
*   `b` **[ResourceDocument][174]**

Returns **[boolean][99]** true if the documents are trivially equal

## ensureDataAPIPermissions

[lib/jobs.js:365-418][175]

Ensures the environment has access to the given DATA API resources by adding or updating
Resource Documents for the client ID.

If changes are made `validator` will be called asynchronously until it returns true

Note: this method only trivially compares resource identifiers, methods and read/write attributes. If all
values are equal to the instance's state the resource will not be updated.

### Parameters

*   `env` **[Environment][113]**
*   `resources` **[Array][110]<[ResourceDocument][174]>** array of resources to add/update (optional, default `[]`)
*   `validator` **[permissionValidatorCallback][176]** array of resources to add/update
*   `maximumChecks` **[number][119]?** maximum number of permission checks (optional, default `60`)

Returns **[Promise][106]\<void>**

## sleep

[lib/util.js:7-9][177]

Sleep for ms milliseconds

### Parameters

*   `ms`  {number} milliseconds

Returns **[Promise][106]\<void>**

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

[49]: #getdataunitsfromweb

[50]: #parameters-15

[51]: #confignamefromhostname

[52]: #parameters-16

[53]: #cartridgemapping

[54]: #properties-5

[55]: #findcartridges

[56]: #reloadcodeversion

[57]: #parameters-17

[58]: #synccartridges

[59]: #parameters-18

[60]: #logfile

[61]: #properties-6

[62]: #getlogs

[63]: #parameters-19

[64]: #tailcommand

[65]: #parameters-20

[66]: #b2ctoolsjobs

[67]: #waitforjob

[68]: #parameters-21

[69]: #sitearchiveimport

[70]: #parameters-22

[71]: #exportsitesconfiguration

[72]: #properties-7

[73]: #exportglobaldataconfiguration

[74]: #properties-8

[75]: #exportdataunitsconfiguration

[76]: #properties-9

[77]: #sitearchiveexport

[78]: #parameters-23

[79]: #sitearchiveexportjson

[80]: #parameters-24

[81]: #sitearchiveimportjson

[82]: #parameters-25

[83]: #sitearchiveexporttext

[84]: #parameters-26

[85]: #sitearchiveimporttext

[86]: #parameters-27

[87]: #resourcedocument

[88]: #properties-10

[89]: #permissionvalidatorcallback

[90]: #compareresourcedocuments

[91]: #parameters-28

[92]: #ensuredataapipermissions

[93]: #parameters-29

[94]: #sleep

[95]: #parameters-30

[96]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/environment.js#L47-L59 "Source code on GitHub"

[97]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[98]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[99]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[100]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/environment.js#L74-L378 "Source code on GitHub"

[101]: #environmentopts

[102]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/environment.js#L117-L132 "Source code on GitHub"

[103]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/environment.js#L139-L154 "Source code on GitHub"

[104]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/environment.js#L161-L176 "Source code on GitHub"

[105]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/environment.js#L373-L377 "Source code on GitHub"

[106]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[107]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/environment.js#L311-L315 "Source code on GitHub"

[108]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[109]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L37-L47 "Source code on GitHub"

[110]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[111]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L52-L68 "Source code on GitHub"

[112]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L71-L76 "Source code on GitHub"

[113]: #environment

[114]: #migrationhelpers

[115]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L78-L83 "Source code on GitHub"

[116]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[117]: #migrationscriptarguments

[118]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L85-L89 "Source code on GitHub"

[119]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[120]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L91-L95 "Source code on GitHub"

[121]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L97-L103 "Source code on GitHub"

[122]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L105-L111 "Source code on GitHub"

[123]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L113-L119 "Source code on GitHub"

[124]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L121-L127 "Source code on GitHub"

[125]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L129-L135 "Source code on GitHub"

[126]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error

[127]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L137-L145 "Source code on GitHub"

[128]: #onbootstraplifecyclefunction

[129]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined

[130]: #beforealllifecyclefunction

[131]: #beforeeachlifecyclefunction

[132]: #afteralllifecyclefunction

[133]: #onfailurelifecyclefunction

[134]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L153-L171 "Source code on GitHub"

[135]: #toolkitinstancestate

[136]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L180-L229 "Source code on GitHub"

[137]: #migrationlifecyclefunctions

[138]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L237-L251 "Source code on GitHub"

[139]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L265-L384 "Source code on GitHub"

[140]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L272-L272 "Source code on GitHub"

[141]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L335-L335 "Source code on GitHub"

[142]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/migrations.js#L392-L402 "Source code on GitHub"

[143]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/command-export.js#L23-L68 "Source code on GitHub"

[144]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/command-export.js#L181-L253 "Source code on GitHub"

[145]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/command-instance.js#L12-L15 "Source code on GitHub"

[146]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/code.js#L11-L15 "Source code on GitHub"

[147]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/code.js#L22-L36 "Source code on GitHub"

[148]: #cartridgemapping

[149]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/code.js#L44-L62 "Source code on GitHub"

[150]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/code.js#L72-L102 "Source code on GitHub"

[151]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/command-tail.js#L7-L11 "Source code on GitHub"

[152]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/command-tail.js#L19-L42 "Source code on GitHub"

[153]: #logfile

[154]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/command-tail.js#L49-L104 "Source code on GitHub"

[155]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L6-L6 "Source code on GitHub"

[156]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L24-L49 "Source code on GitHub"

[157]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L59-L102 "Source code on GitHub"

[158]: https://nodejs.org/api/buffer.html

[159]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L104-L135 "Source code on GitHub"

[160]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L137-L163 "Source code on GitHub"

[161]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L165-L176 "Source code on GitHub"

[162]: #exportsitesconfiguration

[163]: #exportglobaldataconfiguration

[164]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L186-L205 "Source code on GitHub"

[165]: #exportdataunitsconfiguration

[166]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L221-L235 "Source code on GitHub"

[167]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map

[168]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L244-L265 "Source code on GitHub"

[169]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L279-L296 "Source code on GitHub"

[170]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L305-L318 "Source code on GitHub"

[171]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L320-L327 "Source code on GitHub"

[172]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L329-L333 "Source code on GitHub"

[173]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L341-L348 "Source code on GitHub"

[174]: #resourcedocument

[175]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/jobs.js#L365-L418 "Source code on GitHub"

[176]: #permissionvalidatorcallback

[177]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/31dbac333c580261644e05e9248ae94a004d818b/lib/util.js#L7-L9 "Source code on GitHub"
