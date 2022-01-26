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
*   [b2cTools/jobs][47]
    *   [sleep][48]
        *   [Parameters][49]
*   [processContent][50]
    *   [Parameters][51]
*   [getDataUnitsFromWeb][52]
    *   [Parameters][53]
*   [configNameFromHostname][54]
    *   [Parameters][55]
*   [CartridgeMapping][56]
    *   [Properties][57]
*   [findCartridges][58]
*   [reloadCodeVersion][59]
    *   [Parameters][60]
*   [syncCartridges][61]
    *   [Parameters][62]
*   [LogFile][63]
    *   [Properties][64]
*   [getLogs][65]
    *   [Parameters][66]
*   [tailCommand][67]
    *   [Parameters][68]
*   [waitForJob][69]
    *   [Parameters][70]
*   [siteArchiveImport][71]
    *   [Parameters][72]
*   [ExportSitesConfiguration][73]
    *   [Properties][74]
*   [ExportGlobalDataConfiguration][75]
    *   [Properties][76]
*   [ExportDataUnitsConfiguration][77]
    *   [Properties][78]
*   [siteArchiveExport][79]
    *   [Parameters][80]
*   [siteArchiveExportJSON][81]
    *   [Parameters][82]
*   [siteArchiveImportJSON][83]
    *   [Parameters][84]
*   [siteArchiveExportText][85]
    *   [Parameters][86]
*   [siteArchiveImportText][87]
    *   [Parameters][88]

## EnvironmentOpts

[lib/environment.js:74-378][89]

Type: [Object][90]

### Properties

*   `server` **[string][91]**
*   `secureServer` **[string][91]** optional hostname used for WebDAV access
*   `username` **[string][91]**
*   `password` **[string][91]**
*   `clientID` **[string][91]**
*   `clientSecret` **[string][91]**
*   `codeVersion` **[string][91]**
*   `verify` **[boolean][92]** verify SSL
*   `certificate` **[string][91]** pfx path
*   `passphrase` **[string][91]** passphrase for pfx above

## Environment

[lib/environment.js:74-378][93]

Provides for authentication and WebDAV/OCAPI access

### Parameters

*   `opts` **[EnvironmentOpts][94]**  (optional, default `{}`)

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

[lib/environment.js:117-132][95]

account manager (account.demandware.net) scoped Axios instance

Type: axios.AxiosInstance

### ocapi

[lib/environment.js:139-154][96]

OCAPI scoped Axios Client

Type: axios.AxiosInstance

### webdav

[lib/environment.js:161-176][97]

WebDAV scoped Axios Client

Type: axios.AxiosInstance

### deauthenticate

[lib/environment.js:373-377][98]

Clear access token so auths are performed anew

Returns **[Promise][99]\<void>**

## AccessTokenResponse

[lib/environment.js:322-335][100]

Type: [Object][90]

### Properties

*   `accessToken` **[string][91]**
*   `expires` **[Date][101]**

## collectMigrations

[lib/migrations.js:33-43][102]

Find all migration directories and scripts; excluding those matching the given patterns

### Parameters

*   `dir`  {string}
*   `exclude`  {string\[]} (optional, default `[]`)

Returns **[Promise][99]<[Array][103]<[string][91]>>**

## MigrationHelpers

[lib/migrations.js:48-57][104]

## MigrationScriptArguments

[lib/migrations.js:142-160][105]

Type: [Object][90]

### Properties

*   `env` **[Environment][106]**
*   `logger` **Logger**
*   `helpers` **[MigrationHelpers][107]**

## MigrationScriptCallback

[lib/migrations.js:142-160][108]

Type: [Function][109]

### Parameters

*   `args` **[MigrationScriptArguments][110]**

Returns **[Promise][99]<([boolean][92] | void)>**

## ToolkitInstanceState

[lib/migrations.js:142-160][111]

Type: [Object][90]

### Properties

*   `b2cToolkitDataVersion` **[number][112]**
*   `b2cToolkitMigrations` **[string][91]**

## OnBootstrapLifecycleFunction

[lib/migrations.js:142-160][113]

Type: [Function][109]

### Parameters

*   `args` **[MigrationScriptArguments][110]**

Returns **[Promise][99]\<void>**

## BeforeAllLifecycleFunction

[lib/migrations.js:142-160][114]

Type: [Function][109]

### Parameters

*   `args` **[MigrationScriptArguments][110]**
*   `migrationsToRun` **[Array][103]<[string][91]>** list of migrations that will be run (mutable)
*   `willApply` **[boolean][92]** true if migrations will be applied to the instance

Returns **[Promise][99]\<void>**

## BeforeEachLifecycleFunction

[lib/migrations.js:142-160][115]

Type: [Function][109]

### Parameters

*   `args` **[MigrationScriptArguments][110]**
*   `migration` **[string][91]** migration to be run
*   `willApply` **[boolean][92]** true if migrations will be applied to the instance

Returns **[Promise][99]<[boolean][92]>** return false to skip the current migration

## AfterEachLifecycleFunction

[lib/migrations.js:142-160][116]

Type: [Function][109]

### Parameters

*   `args` **[MigrationScriptArguments][110]**
*   `migration` **[string][91]** migration to be run
*   `willApply` **[boolean][92]** true if migrations will be applied to the instance

Returns **[Promise][99]\<void>**

## AfterAllLifecycleFunction

[lib/migrations.js:142-160][117]

Type: [Function][109]

### Parameters

*   `args` **[MigrationScriptArguments][110]**
*   `migrationsRan` **[Array][103]<[string][91]>** list of migrations ran
*   `willApply` **[boolean][92]** true if migrations will be applied to the instance

Returns **[Promise][99]\<void>**

## OnFailureLifecycleFunction

[lib/migrations.js:142-160][118]

Type: [Function][109]

### Parameters

*   `args` **[MigrationScriptArguments][110]**
*   `migration` **[string][91]** migration to be run
*   `e` **[Error][119]** exception raised during migration run

Returns **[Promise][99]\<void>** re-raise exception or new exception to stop migration run

## MigrationLifecycleFunctions

[lib/migrations.js:142-160][120]

Type: [Object][90]

### Properties

*   `onBootstrap` **([OnBootstrapLifecycleFunction][121] | [undefined][122])**
*   `beforeAll` **([BeforeAllLifecycleFunction][123] | [undefined][122])**
*   `beforeEach` **([BeforeEachLifecycleFunction][124] | [undefined][122])**
*   `afterEach` **([AfterAllLifecycleFunction][125] | [undefined][122])**
*   `afterAll` **([AfterAllLifecycleFunction][125] | [undefined][122])**
*   `onFailure` **([OnFailureLifecycleFunction][126] | [undefined][122])**

## getInstanceState

[lib/migrations.js:142-160][127]

Get the instance state from global preferences

### Parameters

*   `env`  {Environment}

Returns **[Promise][99]<[ToolkitInstanceState][128]>**

## updateInstanceMetadata

[lib/migrations.js:169-247][129]

Imports the latest toolkit metadata

### Parameters

*   `env` **[Environment][106]**
*   `lifeCycleModule` **[MigrationLifecycleFunctions][130]**

Returns **[Promise][99]\<void>**

## updateInstanceMigrations

[lib/migrations.js:255-269][131]

Updates instance with new migrations set

### Parameters

*   `env`  {Environment}
*   `migrations`  {string\[]}

Returns **[Promise][99]\<void>**

## migrateInstance

[lib/migrations.js:283-402][132]

Inspects an instance and executes site impex imports and "migration scripts" from the
given `dir`.

### Parameters

*   `env` **[Environment][106]**
*   `dir` **[string][91]** migrations directory
*   `exclude` **[Array][103]<[string][91]>** array of regular expression strings (optional, default `[]`)
*   `apply` **[boolean][92]** should migrations be applied to the instance after running? (optional, default `true`)
*   `dryRun` **[boolean][92]** only output migrations to be run (optional, default `false`)
*   `forceBootstrap` **[boolean][92]**  (optional, default `false`)

Returns **[Promise][99]\<void>**

## lifeCycleModule

[lib/migrations.js:290-290][133]

## runMigrationScript

[lib/migrations.js:353-353][134]

## runMigrationScript

[lib/migrations.js:410-420][135]

### Parameters

*   `env` **[Environment][106]**
*   `target` **[string][91]** path to migration script

Returns **[Promise][99]<[boolean][92]>**

## b2cTools/jobs

[lib/jobs.js:6-6][136]

import and export job helpers

### sleep

[lib/util.js:7-9][137]

Sleep for ms milliseconds

#### Parameters

*   `ms`  {number} milliseconds

Returns **[Promise][99]\<void>**

## processContent

[lib/command-export.js:25-70][138]

Recursively process a <content> to extract child components and images

### Parameters

*   `content`  jsonified version of <content> via xml2js
*   `allPages`  {object}
*   `contentToKeep`  {Set} array of page ids to retain from library (mutable)
*   `filesToDownload`  {string\[]} array of files to download from webdav static dir (mutable)
*   `logPrefix`  for debugging output
*   `assetQuery`  {string\[]}

## getDataUnitsFromWeb

[lib/command-export.js:182-254][139]

Launch a web page to collect data units to export

### Parameters

*   `sites`  {string\[]}
*   `catalogs`  {string\[]}

Returns **[Promise][99]<[object][90]>**

## configNameFromHostname

[lib/command-instance.js:12-15][140]

### Parameters

*   `hostname` **[string][91]**

## CartridgeMapping

[lib/code.js:22-36][141]

Type: [Object][90]

### Properties

*   `dest` **[string][91]** cartridge name
*   `src` **[string][91]** directory

## findCartridges

[lib/code.js:22-36][142]

Find Cartridges recursively in the working directory

Returns **[Array][103]<[CartridgeMapping][143]>**

## reloadCodeVersion

[lib/code.js:44-62][144]

Reloads (or activates) the environments code version

### Parameters

*   `env` **[Environment][106]**

Returns **[Promise][99]\<void>**

## syncCartridges

[lib/code.js:72-102][145]

Syncs the given cartridge mapping (src:dest) to the environments code version

### Parameters

*   `env` **[Environment][106]**
*   `cartridges` **[Array][103]<[CartridgeMapping][143]>**
*   `reload` **[boolean][92]**  (optional, default `false`)

Returns **[Promise][99]\<void>**

## LogFile

[lib/command-tail.js:19-42][146]

Type: [Object][90]

### Properties

*   `name` **[string][91]**
*   `lastModified` **[Date][101]**

## getLogs

[lib/command-tail.js:19-42][147]

Get the logs from the instance

### Parameters

*   `env`  {Environment}

Returns **[Promise][99]<[Array][103]<[LogFile][148]>>**

## tailCommand

[lib/command-tail.js:49-104][149]

### Parameters

*   `filters`  {string\[]}

Returns **[Promise][99]\<void>**

## waitForJob

[lib/jobs.js:23-48][150]

### Parameters

*   `env`  {Environment}
*   `jobId`  {string} job identifier
*   `executionId`  {string} job execution id

Returns **[Promise][99]\<void>**

## siteArchiveImport

[lib/jobs.js:58-101][151]

Import a site impex

### Parameters

*   `env` **[Environment][106]**
*   `target` **([string][91] | [Buffer][152])** directory, zip file path or buffer of zip content
*   `archiveName` **[string][91]** require if Buffer is used

Returns **[Promise][99]\<void>**

## ExportSitesConfiguration

[lib/jobs.js:185-204][153]

Type: [Object][90]

### Properties

*   `ab_tests` **([undefined][122] | [boolean][92])**
*   `active_data_feeds` **([undefined][122] | [boolean][92])**
*   `all` **([undefined][122] | [boolean][92])**
*   `cache_settings` **([undefined][122] | [boolean][92])**
*   `campaigns_and_promotions` **([undefined][122] | [boolean][92])**
*   `content` **([undefined][122] | [boolean][92])**
*   `coupons` **([undefined][122] | [boolean][92])**
*   `custom_objects` **([undefined][122] | [boolean][92])**
*   `customer_cdn_settings` **([undefined][122] | [boolean][92])**
*   `customer_groups` **([undefined][122] | [boolean][92])**
*   `distributed_commerce_extensions` **([undefined][122] | [boolean][92])**
*   `dynamic_file_resources` **([undefined][122] | [boolean][92])**
*   `gift_certificates` **([undefined][122] | [boolean][92])**
*   `ocapi_settings` **([undefined][122] | [boolean][92])**
*   `payment_methods` **([undefined][122] | [boolean][92])**
*   `payment_processors` **([undefined][122] | [boolean][92])**
*   `redirect_urls` **([undefined][122] | [boolean][92])**
*   `search_settings` **([undefined][122] | [boolean][92])**
*   `shipping` **([undefined][122] | [boolean][92])**
*   `site_descriptor` **([undefined][122] | [boolean][92])**
*   `site_preferences` **([undefined][122] | [boolean][92])**
*   `sitemap_settings` **([undefined][122] | [boolean][92])**
*   `slots` **([undefined][122] | [boolean][92])**
*   `sorting_rules` **([undefined][122] | [boolean][92])**
*   `source_codes` **([undefined][122] | [boolean][92])**
*   `static_dynamic_alias_mappings` **([undefined][122] | [boolean][92])**
*   `stores` **([undefined][122] | [boolean][92])**
*   `tax` **([undefined][122] | [boolean][92])**
*   `url_rules` **([undefined][122] | [boolean][92])**

## ExportGlobalDataConfiguration

[lib/jobs.js:185-204][154]

Type: [Object][90]

### Properties

*   `access_roles` **([undefined][122] | [boolean][92])**
*   `all` **([undefined][122] | [boolean][92])**
*   `csc_settings` **([undefined][122] | [boolean][92])**
*   `csrf_whitelists` **([undefined][122] | [boolean][92])**
*   `custom_preference_groups` **([undefined][122] | [boolean][92])**
*   `custom_quota_settings` **([undefined][122] | [boolean][92])**
*   `custom_types` **([undefined][122] | [boolean][92])**
*   `geolocations` **([undefined][122] | [boolean][92])**
*   `global_custom_objects` **([undefined][122] | [boolean][92])**
*   `job_schedules` **([undefined][122] | [boolean][92])**
*   `job_schedules_deprecated` **([undefined][122] | [boolean][92])**
*   `locales` **([undefined][122] | [boolean][92])**
*   `meta_data` **([undefined][122] | [boolean][92])**
*   `oauth_providers` **([undefined][122] | [boolean][92])**
*   `ocapi_settings` **([undefined][122] | [boolean][92])**
*   `page_meta_tags` **([undefined][122] | [boolean][92])**
*   `preferences` **([undefined][122] | [boolean][92])**
*   `price_adjustment_limits` **([undefined][122] | [boolean][92])**
*   `services` **([undefined][122] | [boolean][92])**
*   `sorting_rules` **([undefined][122] | [boolean][92])**
*   `static_resources` **([undefined][122] | [boolean][92])**
*   `system_type_definitions` **([undefined][122] | [boolean][92])**
*   `users` **([undefined][122] | [boolean][92])**
*   `webdav_client_permissions` **([undefined][122] | [boolean][92])**

## ExportDataUnitsConfiguration

[lib/jobs.js:185-204][155]

Type: [Object][90]

### Properties

*   `catalog_static_resources` **([undefined][122] | [Object][90]<[string][91], [boolean][92]>)**
*   `catalogs` **([undefined][122] | [Object][90]<[string][91], [boolean][92]>)**
*   `customer_lists` **([undefined][122] | [Object][90]<[string][91], [boolean][92]>)**
*   `inventory_lists` **([undefined][122] | [Object][90]<[string][91], [boolean][92]>)**
*   `library_static_resources` **([undefined][122] | [Object][90]<[string][91], [boolean][92]>)**
*   `libraries` **([undefined][122] | [Object][90]<[string][91], [boolean][92]>)**
*   `price_books` **([undefined][122] | [Object][90]<[string][91], [boolean][92]>)**
*   `sites` **([undefined][122] | [Object][90]<[string][91], [ExportSitesConfiguration][156]>)**
*   `global_data` **([undefined][122] | [ExportGlobalDataConfiguration][157])**

## siteArchiveExport

[lib/jobs.js:185-204][158]

Export the given site archive, returning the zip data

### Parameters

*   `env` **[Environment][106]**
*   `dataUnits` **[ExportDataUnitsConfiguration][159]**
*   `zipFilename` **[string][91]** filename of the export or autogenerated

Returns **[Promise][99]<[Buffer][152]>**

## siteArchiveExportJSON

[lib/jobs.js:220-234][160]

Export an object of impex files to JSON objects in xml2js form

returns:
{
"meta/system-objecttype-extensions.xml": {
...
}
}

### Parameters

*   `env` **[Environment][106]**
*   `dataUnits` **[ExportDataUnitsConfiguration][159]**

Returns **[Promise][99]<[Map][161]<[string][91], [object][90]>>**

## siteArchiveImportJSON

[lib/jobs.js:243-264][162]

Imports an object of impex filenames to objects to XML/JSON/text

### Parameters

*   `env` **[Environment][106]**
*   `data` **[Map][161]<[string][91], [object][90]>**

Returns **[Promise][99]\<void>**

## siteArchiveExportText

[lib/jobs.js:278-295][163]

Export an object of impex files to strings of XML

returns:
{
"meta/system-objecttype-extensions.xml": "\<?xml version="1.0"...."
}

### Parameters

*   `env` **[Environment][106]**
*   `dataUnits` **[ExportDataUnitsConfiguration][159]**

Returns **[Promise][99]<[Map][161]<[string][91], [string][91]>>**

## siteArchiveImportText

[lib/jobs.js:304-317][164]

Import filename to text strings as site impex

### Parameters

*   `env` **[Environment][106]**
*   `data` **[Map][161]<[string][91], [string][91]>**

Returns **[Promise][99]\<void>**

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

[47]: #b2ctoolsjobs

[48]: #sleep

[49]: #parameters-14

[50]: #processcontent

[51]: #parameters-15

[52]: #getdataunitsfromweb

[53]: #parameters-16

[54]: #confignamefromhostname

[55]: #parameters-17

[56]: #cartridgemapping

[57]: #properties-5

[58]: #findcartridges

[59]: #reloadcodeversion

[60]: #parameters-18

[61]: #synccartridges

[62]: #parameters-19

[63]: #logfile

[64]: #properties-6

[65]: #getlogs

[66]: #parameters-20

[67]: #tailcommand

[68]: #parameters-21

[69]: #waitforjob

[70]: #parameters-22

[71]: #sitearchiveimport

[72]: #parameters-23

[73]: #exportsitesconfiguration

[74]: #properties-7

[75]: #exportglobaldataconfiguration

[76]: #properties-8

[77]: #exportdataunitsconfiguration

[78]: #properties-9

[79]: #sitearchiveexport

[80]: #parameters-24

[81]: #sitearchiveexportjson

[82]: #parameters-25

[83]: #sitearchiveimportjson

[84]: #parameters-26

[85]: #sitearchiveexporttext

[86]: #parameters-27

[87]: #sitearchiveimporttext

[88]: #parameters-28

[89]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/environment.js#L47-L59 "Source code on GitHub"

[90]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[91]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[92]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[93]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/environment.js#L74-L378 "Source code on GitHub"

[94]: #environmentopts

[95]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/environment.js#L117-L132 "Source code on GitHub"

[96]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/environment.js#L139-L154 "Source code on GitHub"

[97]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/environment.js#L161-L176 "Source code on GitHub"

[98]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/environment.js#L373-L377 "Source code on GitHub"

[99]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[100]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/environment.js#L311-L315 "Source code on GitHub"

[101]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[102]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L33-L43 "Source code on GitHub"

[103]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[104]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L48-L57 "Source code on GitHub"

[105]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L60-L65 "Source code on GitHub"

[106]: #environment

[107]: #migrationhelpers

[108]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L67-L72 "Source code on GitHub"

[109]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[110]: #migrationscriptarguments

[111]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L74-L78 "Source code on GitHub"

[112]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[113]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L80-L84 "Source code on GitHub"

[114]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L86-L92 "Source code on GitHub"

[115]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L94-L100 "Source code on GitHub"

[116]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L102-L108 "Source code on GitHub"

[117]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L110-L116 "Source code on GitHub"

[118]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L118-L124 "Source code on GitHub"

[119]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error

[120]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L126-L134 "Source code on GitHub"

[121]: #onbootstraplifecyclefunction

[122]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined

[123]: #beforealllifecyclefunction

[124]: #beforeeachlifecyclefunction

[125]: #afteralllifecyclefunction

[126]: #onfailurelifecyclefunction

[127]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L142-L160 "Source code on GitHub"

[128]: #toolkitinstancestate

[129]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L169-L247 "Source code on GitHub"

[130]: #migrationlifecyclefunctions

[131]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L255-L269 "Source code on GitHub"

[132]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L283-L402 "Source code on GitHub"

[133]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L290-L290 "Source code on GitHub"

[134]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L353-L353 "Source code on GitHub"

[135]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/migrations.js#L410-L420 "Source code on GitHub"

[136]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L6-L6 "Source code on GitHub"

[137]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/util.js#L7-L9 "Source code on GitHub"

[138]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/command-export.js#L25-L70 "Source code on GitHub"

[139]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/command-export.js#L182-L254 "Source code on GitHub"

[140]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/command-instance.js#L12-L15 "Source code on GitHub"

[141]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/code.js#L11-L15 "Source code on GitHub"

[142]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/code.js#L22-L36 "Source code on GitHub"

[143]: #cartridgemapping

[144]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/code.js#L44-L62 "Source code on GitHub"

[145]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/code.js#L72-L102 "Source code on GitHub"

[146]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/command-tail.js#L7-L11 "Source code on GitHub"

[147]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/command-tail.js#L19-L42 "Source code on GitHub"

[148]: #logfile

[149]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/command-tail.js#L49-L104 "Source code on GitHub"

[150]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L23-L48 "Source code on GitHub"

[151]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L58-L101 "Source code on GitHub"

[152]: https://nodejs.org/api/buffer.html

[153]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L103-L134 "Source code on GitHub"

[154]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L136-L162 "Source code on GitHub"

[155]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L164-L175 "Source code on GitHub"

[156]: #exportsitesconfiguration

[157]: #exportglobaldataconfiguration

[158]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L185-L204 "Source code on GitHub"

[159]: #exportdataunitsconfiguration

[160]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L220-L234 "Source code on GitHub"

[161]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map

[162]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L243-L264 "Source code on GitHub"

[163]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L278-L295 "Source code on GitHub"

[164]: https://github.com/SalesforceCommerceCloud/b2c-tools/blob/ac52442d586c4488b402d4c2d7dcc4b6a865e2f9/lib/jobs.js#L304-L317 "Source code on GitHub"
