/// <reference types="node" />
export = Environment;
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
declare class Environment {
    /**
     * @param {EnvironmentOpts} opts
     */
    constructor(opts?: EnvironmentOpts);
    /**
     * @private
     */
    private _webdavClient;
    /**
     * @private
     */
    private _ocapiClient;
    /**
     * @private
     */
    private _amClient;
    _httpsAgent: https.Agent;
    /**
     * account manager (account.demandware.net) scoped Axios instance
     *
     * @type {axios.AxiosInstance}
     */
    get am(): axios.AxiosInstance;
    /**
     * OCAPI scoped Axios Client
     *
     * @type {axios.AxiosInstance}
     */
    get ocapi(): axios.AxiosInstance;
    /**
     * WebDAV scoped Axios Client
     *
     * @type {axios.AxiosInstance}
     */
    get webdav(): axios.AxiosInstance;
    /**
     *
     * @param config
     * @return {*}
     * @private
     */
    private _loggingRequestInterceptor;
    /**
     *
     * @param response
     * @param err
     * @return {Promise<never>|*}
     * @private
     */
    private _loggingResponseInterceptor;
    /**
     * Request interceptor provides authentication services and lazily loads
     * configuration through the credentials loading options
     *
     * @param {AxiosRequestConfig} config
     * @param {boolean} requireAccessToken
     * @return {Promise<AxiosRequestConfig>}
     * @private
     */
    private _requestInterceptor;
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
    private _implicitFlowLogin;
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
    private _accessTokenFromClientCredentials;
    /**
     * Gets an access token from account manager
     * @return {Promise<void>}
     * @private
     */
    private _getAccessToken;
    /**
     * Clear access token so auths are performed anew
     *
     * @return {Promise<void>}
     */
    deauthenticate(): Promise<void>;
}
declare namespace Environment {
    export { EnvironmentOpts };
}
import https = require("https");
import axios = require("axios");
type EnvironmentOpts = {
    server: string;
    /**
     * optional hostname used for WebDAV access
     */
    secureServer: string;
    username: string;
    password: string;
    clientID: string;
    clientSecret: string;
    codeVersion: string;
    /**
     * verify SSL
     */
    verify: boolean;
    /**
     * pfx path
     */
    certificate: string;
    /**
     * passphrase for pfx above
     */
    passphrase: string;
};
//# sourceMappingURL=environment.d.ts.map