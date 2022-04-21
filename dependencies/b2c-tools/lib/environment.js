/*
 * Represents an SFCC Environment and HTTP Clients for Communication
 * with webdav, OCAPI and account manager. Authentication via access keys or AM tokens.
 */

const axios = require('axios');
const querystring = require('querystring');
const format = require('util').format;
const open = require('open');
const http = require('http');
const util = require('util');

const {CONFIG} = require('./config');
const logger = require('./logger');
const https = require("https");
const fs = require("fs");

// same as SFCC-CI
const OAUTH_LOCAL_PORT = process.env.SFCC_OAUTH_LOCAL_PORT ? parseInt(process.env.SFCC_OAUTH_LOCAL_PORT) : 8080;
const OAUTH_REDIRECT_URL = 'http://localhost:' + OAUTH_LOCAL_PORT; // changing the uri requires to update the client_id settings in AM
const ACCOUNT_MANAGER_HOST = process.env.SFCC_LOGIN_URL ? process.env.SFCC_LOGIN_URL : 'account.demandware.com';
const SANDBOX_API_HOST = process.env.SFCC_SANDBOX_API_HOST ? process.env.SFCC_SANDBOX_API_HOST : 'admin.us01.dx.commercecloud.salesforce.com';
const ACCOUNT_MANAGER_AUTH_PATH = '/dwsso/oauth2/authorize?client_id=%s&redirect_uri=%s&response_type=%s';

function getOauth2RedirectHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Return Flow</title>
</head>
<body onload="doReturnFlow()">
<script>
    function doReturnFlow() {
        document.location = "http://localhost:8080/?" + window.location.hash.substring(1);
    }
</script>

</body>
</html>
    `;
}

// TODO: this is hacky to support multiple instances; use global conf
const ACCESS_TOKEN_CACHE = {};

/**
 * @typedef {Object} EnvironmentOpts
 * @property {string} server
 * @property {string} secureServer optional hostname used for WebDAV access
 * @property {string} username
 * @property {string} password
 * @property {string} clientID
 * @property {string} clientSecret
 * @property {string} codeVersion
 * @property {boolean} verify verify SSL
 * @property {string} certificate pfx path
 * @property {string} passphrase passphrase for pfx above
 */

/**
 * Provides for authentication and WebDAV/OCAPI access
 *
 * @example
 * const {Environment} = require('@SalesforceCommerceCloud/b2c-tools');
 * const env = new Environment({
 *     server: '...',
 *     clientID: '...',
 *     clientSecret: '...'
 * });
 * const resp = await env.ocapi.get('sites');
 *
 */
class Environment {
    /**
     * @param {EnvironmentOpts} opts
     */
    constructor(opts = {}) {
        // if not provided explicitly will be loaded via the various means (dw.json, etc)
        // stored in global conf store (./conf.js)
        Object.assign(this, CONFIG.ENVIRONMENT, opts);

        /**
         * @private
         */
        this._webdavClient = null;
        /**
         * @private
         */
        this._ocapiClient = null;
        /**
         * @private
         */
        this._amClient = null;
        /**
         * @private
         */
        this._odsClient = null;

        let agentOptions = {
            rejectUnauthorized: this.verify !== false,
        }
        if (this.certificate) {
            agentOptions.pfx = fs.readFileSync(this.certificate);
            if (this.passphrase) {
                agentOptions.passphrase = this.passphrase;
            }
        }
        this._httpsAgent = new https.Agent(agentOptions);
        if (!this.server && !this.clientID) {
            throw new Error("No serve or clientID found; Have you configured your dw.json file?");
        }
        return this;
    }

    /**
     * account manager (account.demandware.net) scoped Axios instance
     *
     * @type {axios.AxiosInstance}
     */
    get am() {
        if (this._amClient) {
            return this._amClient;
        }
        this._amClient = axios.create({
            baseURL: `https://${ACCOUNT_MANAGER_HOST}/`,
            timeout: 8000,
            auth: {
                username: this.clientID,
                password: this.clientSecret
            }
        })
        this._amClient.interceptors.request.use(this._loggingRequestInterceptor.bind(this), (err) => Promise.reject(err))
        this._amClient.interceptors.response.use(this._loggingResponseInterceptor.bind(this), (err) => Promise.reject(err))
        return this._amClient;
    }

    /**
     * OCAPI scoped Axios Client
     *
     * @type {axios.AxiosInstance}
     */
    get ocapi() {
        if (this._ocapiClient) {
            return this._ocapiClient;
        }
        this._ocapiClient = axios.create({
            baseURL: `https://${this.server}/s/-/dw/data/v21_10/`,
            timeout: 60000, // 1 minute
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            httpsAgent: this._httpsAgent
        });
        this._ocapiClient.interceptors.request.use(this._loggingRequestInterceptor.bind(this), (err) => Promise.reject(err))
        this._ocapiClient.interceptors.request.use((config) => this._requestInterceptor(config, true), (err) => Promise.reject(err))
        this._ocapiClient.interceptors.response.use(this._loggingResponseInterceptor.bind(this), (err) => this._loggingResponseInterceptor(null, err))
        return this._ocapiClient;
    }

    /**
     * ODS scoped Axios Client
     *
     * @type {axios.AxiosInstance}
     */
    get ods() {
        if (this._odsClient) {
            return this._odsClient;
        }
        this._odsClient = axios.create({
            baseURL: `https://${SANDBOX_API_HOST}/api/v1/`,
            timeout: 60000, // 1 minute
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            httpsAgent: this._httpsAgent
        });
        this._odsClient.interceptors.request.use(this._loggingRequestInterceptor.bind(this), (err) => Promise.reject(err))
        this._odsClient.interceptors.request.use((config) => this._requestInterceptor(config, true), (err) => Promise.reject(err))
        this._odsClient.interceptors.response.use(this._loggingResponseInterceptor.bind(this), (err) => this._loggingResponseInterceptor(null, err))
        return this._odsClient;
    }

    /**
     * WebDAV scoped Axios Client
     *
     * @type {axios.AxiosInstance}
     */
    get webdav() {
        if (this._webdavClient) {
            return this._webdavClient;
        }
        this._webdavClient = axios.create({
            baseURL: `https://${this.secureServer ? this.secureServer : this.server}/on/demandware.servlet/webdav/Sites/`,
            timeout: 600000, // 10 minutes
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            httpsAgent: this._httpsAgent
        });
        this._webdavClient.interceptors.request.use(this._requestInterceptor.bind(this), (err) => Promise.reject(err))
        this._webdavClient.interceptors.request.use(this._loggingRequestInterceptor.bind(this), (err) => Promise.reject(err))
        this._webdavClient.interceptors.response.use(this._loggingResponseInterceptor.bind(this), (err) => this._loggingResponseInterceptor(null, err))
        return this._webdavClient;
    }

    /**
     *
     * @param config
     * @return {*}
     * @private
     */
    _loggingRequestInterceptor(config) {
        logger.debug("REQUEST");
        logger.debug(util.inspect(config));
        return config;
    }

    /**
     *
     * @param response
     * @param err
     * @return {Promise<never>|*}
     * @private
     */
    _loggingResponseInterceptor(response, err) {
        logger.debug("RESPONSE");
        if (err) {
            if (err.response) {
                logger.debug(util.inspect(Object.fromEntries(Object.entries(err.response).filter(([key]) => key !== 'request'))));
            }
            return Promise.reject(err);
        } else {
            logger.debug(util.inspect(response));
            return response;
        }
    }

    /**
     * Request interceptor provides authentication services and lazily loads
     * configuration through the credentials loading options
     *
     * @param {AxiosRequestConfig} config
     * @param {boolean} requireAccessToken
     * @return {Promise<AxiosRequestConfig>}
     * @private
     */
    async _requestInterceptor(config, requireAccessToken = false) {

        // for webdav we can use access key if available; faster and no expiration
        if (this.username && this.password && !requireAccessToken) {
            config.auth = {
                username: this.username,
                password: this.password
            };
        } else {
            if (!this.clientID) {
                throw new Error("No client ID available; Cannot get access token");
            }
            config.headers['x-dw-client-id'] = this.clientID;
            var accessToken = await this._getAccessToken()
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }

    /**
     * Performs an implicit oauth2 login flow
     * User will flow through AM login procedure to obtain access token
     *
     * NOTE: this method requires a TTY and user intervention; it is interactive
     * NOTE: access token is valid for 30 minutes and cannot be renewed
     *
     * @return {Promise<AccessTokenResponse>}
     * @private
     */
    async _implicitFlowLogin() {
        var flow = {grant: 'implicit', response_type: 'token', redirect_uri: OAUTH_REDIRECT_URL};
        var clientID = this.clientID;

        var url = 'https://' + format(ACCOUNT_MANAGER_HOST + ACCOUNT_MANAGER_AUTH_PATH, clientID, flow['redirect_uri'],
            flow['response_type']);

        // print url to console (in case machine has no default user agent)
        logger.info('Login url: %s', url);
        logger.info('If the url does not open automatically, copy/paste the login url into a browser on this machine.');

        // attempt to open the machines default user agent
        open(url);

        return new Promise(function (resolve, reject) {

            var sockets = [];
            var server = http.createServer(function (request, response) {
                var parsed = require('url')
                    .parse(request.url, true);

                if (!parsed.query['access_token'] && !parsed.query['error']) {
                    // serve html page
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(getOauth2RedirectHTML());
                    response.end();
                } else if (parsed.query['access_token']) {
                    // return access token
                    logger.debug('Got access token response ' + parsed.query['access_token']);
                    logger.info('Successfully authenticated');
                    var now = new Date();
                    var expiration = new Date(now.getTime() + parseInt(parsed.query["expires_in"]) * 1000);
                    resolve({
                        accessToken: parsed.query['access_token'],
                        expires: expiration
                    });
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write('You may close this browser window now and return to your terminal or Visual Studio Code...');
                    response.end();
                    setTimeout(function () {
                        logger.debug("Shutting down server")
                        server.close(() => logger.debug("Server shutdown"));
                        sockets.forEach((s) => {
                            if (s) {
                                s.destroy();
                            }
                        });
                    }, 1);
                } else if (parsed.query['error']) {
                    // throw exception
                    reject(parsed.query['error']);
                }
            });
            server.on('connection', function (socket) {
                sockets.push(socket);
            });
            server.listen(OAUTH_LOCAL_PORT, function () {
                logger.debug('Local server for login redirect listening at http://localhost:%s', OAUTH_LOCAL_PORT);
                logger.info('Waiting for user to authenticate...');
            });
        });
    }

    /**
     * @typedef {Object} AccessTokenResponse
     * @property {string} accessToken
     * @property {Date} expires
     */

    /**
     * Gets an access token from a client credentials grant
     * @return {Promise<AccessTokenResponse>}
     * @private
     */
    async _accessTokenFromClientCredentials() {
        logger.debug("Getting access token from client credentials");
        var resp = await this.am.post('dwsso/oauth2/access_token', querystring.stringify({
            grant_type: 'client_credentials'
        }));

        var now = new Date();
        var expiration = new Date(now.getTime() + parseInt(resp.data.expires_in) * 1000);

        return {
            accessToken: resp.data.access_token,
            expires: expiration
        };
    }

    /**
     * Gets an access token from account manager
     * @return {Promise<void>}
     * @private
     */
    async _getAccessToken() {
        // use module cache to manage tokens across instances of this class
        // discard those that have expired
        if (ACCESS_TOKEN_CACHE[this.clientID]) {
            var now = new Date();
            var _tokenStruct = ACCESS_TOKEN_CACHE[this.clientID];
            if (_tokenStruct.expires && now.getTime() > _tokenStruct.expires) {
                logger.warn("Access token expired; invalidating and re-authenticating");
                delete ACCESS_TOKEN_CACHE[this.clientID]
            } else {
                logger.debug("Reusing cached access token");
                return ACCESS_TOKEN_CACHE[this.clientID].accessToken;
            }
        }
        if (this.clientID && this.clientSecret) {
            let accessTokenStruct = await this._accessTokenFromClientCredentials();
            ACCESS_TOKEN_CACHE[this.clientID] = accessTokenStruct;
            return accessTokenStruct.accessToken;
        } else {
            // finally try implicit login if we are still lacking info for obtaining a token
            let accessTokenStruct = await this._implicitFlowLogin(this.clientID);
            ACCESS_TOKEN_CACHE[this.clientID] = accessTokenStruct;
            return accessTokenStruct.accessToken;
        }
    }

    /**
     * Clear access token so auths are performed anew
     *
     * @return {Promise<void>}
     */
    deauthenticate() {
        if (ACCESS_TOKEN_CACHE[this.clientID]) {
            delete ACCESS_TOKEN_CACHE[this.clientID]
        }
    }
}
module.exports = Environment;
