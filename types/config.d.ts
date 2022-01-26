export namespace CONFIG {
    namespace ENVIRONMENT {
        const server: any;
        const secureServer: any;
        const username: any;
        const password: any;
        const clientID: any;
        const clientSecret: any;
        const codeVersion: any;
        const verify: any;
        const certificate: any;
        const passphrase: any;
    }
}
export var cli: yargs.Argv<{
    debug: boolean;
} & {
    i: unknown;
} & {
    verify: boolean;
} & {
    s: unknown;
} & {
    "secure-server": unknown;
} & {
    certificate: unknown;
} & {
    passphrase: unknown;
} & {
    u: unknown;
} & {
    p: unknown;
} & {
    "client-id": unknown;
} & {
    "client-secret": unknown;
} & {
    "code-version": unknown;
} & {
    config: string;
}>;
import yargs = require("yargs");
//# sourceMappingURL=config.d.ts.map