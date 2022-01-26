export type LogFile = {
    name: string;
    lastModified: Date;
};
declare const command: string;
declare const desc: string;
declare function builder(yargs: any): any;
declare function handler(argv: any): Promise<void>;
export {};
//# sourceMappingURL=command-tail.d.ts.map