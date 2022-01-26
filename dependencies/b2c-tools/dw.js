// support dwJson multi-config in prophet and other tools that support dw.js loading
var dwJson = {};
try {
    dwJson = require('./dw.json');
    // if we have an array and the main config is not active (or has no active property)
    if (Array.isArray(dwJson.configs) && dwJson.active !== true) {
        dwJson = dwJson.configs.find((v) => v.active === true) || dwJson;
    }
} catch (e) {
    /* ignore */
}
module.exports = dwJson;
