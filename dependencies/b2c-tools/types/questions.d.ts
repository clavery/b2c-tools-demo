export namespace SERVER {
    const name: string;
    const message: string;
    function filter(v: any): any;
    function validate(v: any): any;
}
export namespace CODE_VERSION {
    const name_1: string;
    export { name_1 as name };
    const message_1: string;
    export { message_1 as message };
    export function validate_1(v: any): any;
    export { validate_1 as validate };
}
export namespace USERNAME {
    const name_2: string;
    export { name_2 as name };
    const message_2: string;
    export { message_2 as message };
    export function validate_2(v: any): any;
    export { validate_2 as validate };
}
export namespace PASSWORD {
    const name_3: string;
    export { name_3 as name };
    export function message_3(answers: any): string;
    export { message_3 as message };
    export function validate_3(v: any): any;
    export { validate_3 as validate };
}
export namespace CONFIRM {
    const name_4: string;
    export { name_4 as name };
    const message_4: string;
    export { message_4 as message };
    export const type: string;
    const _default: boolean;
    export { _default as default };
}
export namespace CONFIRM_YES {
    const name_5: string;
    export { name_5 as name };
    const message_5: string;
    export { message_5 as message };
    const type_1: string;
    export { type_1 as type };
    const _default_1: boolean;
    export { _default_1 as default };
}
export function DW_JSON_CONFIG_NAME(configFile: any): {
    name: string;
    message: string;
    type: string;
    choices: () => {
        name: string;
        value: string;
        short: string;
    }[];
    validate: (v: any) => any;
};
//# sourceMappingURL=questions.d.ts.map