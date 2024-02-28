import * as funtypes from 'funtypes';
export declare function createCacheParser<T>(funType: funtypes.Codec<T>): import("funtypes/lib/types/ParsedValue").ParsedValueConfig<funtypes.String, T>;
export declare const BigIntParser: funtypes.ParsedValue<funtypes.String, bigint>['config'];
export declare const BigIntHex: funtypes.ParsedValue<funtypes.String, bigint>;
export declare const HexString: funtypes.Constraint<funtypes.String, `0x${string}`, unknown>;
export type HexString = funtypes.Static<typeof HexString>;
export declare function createUnitParser(decimals?: bigint): funtypes.ParsedValue<funtypes.String, HexString>['config'];
export declare const AddressParser: funtypes.ParsedValue<funtypes.String, string>['config'];
export declare const EthereumAddress: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
export type EthereumAddress = funtypes.Static<typeof EthereumAddress>;
export declare const ERC20Token: funtypes.Object<{
    chainId: funtypes.ParsedValue<funtypes.String, bigint>;
    name: funtypes.String;
    address: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    symbol: funtypes.String;
    decimals: funtypes.ParsedValue<funtypes.String, bigint>;
}, false>;
export type ERC20Token = funtypes.Static<typeof ERC20Token>;
export declare const TransferSchema: funtypes.Object<{
    hash: funtypes.String;
    from: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    to: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    amount: funtypes.ParsedValue<funtypes.String, bigint>;
    token: funtypes.Union<[funtypes.Object<{
        chainId: funtypes.ParsedValue<funtypes.String, bigint>;
        name: funtypes.String;
        address: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
        symbol: funtypes.String;
        decimals: funtypes.ParsedValue<funtypes.String, bigint>;
    }, false>, funtypes.Literal<undefined>]>;
    date: funtypes.Number;
}, false>;
export type Transfer = funtypes.Static<typeof TransferSchema>;
export declare const TransferRequestInput: funtypes.Object<{
    to: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    amount: funtypes.ParsedValue<funtypes.String, bigint>;
    token: funtypes.Union<[funtypes.Object<{
        chainId: funtypes.ParsedValue<funtypes.String, bigint>;
        name: funtypes.String;
        address: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
        symbol: funtypes.String;
        decimals: funtypes.ParsedValue<funtypes.String, bigint>;
    }, false>, funtypes.Literal<undefined>]>;
}, false>;
export type TransferRequestInput = funtypes.Static<typeof TransferRequestInput>;
export declare const TokensCacheSchema: funtypes.Union<[funtypes.Object<{
    data: funtypes.Array<funtypes.Object<{
        chainId: funtypes.ParsedValue<funtypes.String, bigint>;
        name: funtypes.String;
        address: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
        symbol: funtypes.String;
        decimals: funtypes.ParsedValue<funtypes.String, bigint>;
    }, false>>;
    version: funtypes.Literal<"1.0.0">;
}, false>]>;
export type TokensCache = funtypes.Static<typeof TokensCacheSchema>;
export declare const Holdings: funtypes.Array<funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>>;
export type Holdings = funtypes.Static<typeof Holdings>;
declare const AccountSettings: funtypes.Object<{
    address: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    holdings: funtypes.Array<funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>>;
}, false>;
export type AccountSettings = funtypes.Static<typeof AccountSettings>;
export declare const SettingsCacheSchema: funtypes.Union<[funtypes.Object<{
    data: funtypes.Array<funtypes.Object<{
        address: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
        holdings: funtypes.Array<funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>>;
    }, false>>;
    version: funtypes.Literal<"1.0.0">;
}, false>]>;
export type SettingsCache = funtypes.Static<typeof SettingsCacheSchema>;
export declare function serialize<T, U extends funtypes.Codec<T>>(funType: U, value: T): ToWireType<U>;
export declare function safeSerialize<T, U extends funtypes.Codec<T>>(funType: U, value: T): funtypes.Result<ToWireType<U>>;
export type UnionToIntersection<T> = (T extends unknown ? (k: T) => void : never) extends (k: infer I) => void ? I : never;
export type ToWireType<T> = T extends funtypes.Intersect<infer U> ? UnionToIntersection<{
    [I in keyof U]: ToWireType<U[I]>;
}[number]> : T extends funtypes.Union<infer U> ? {
    [I in keyof U]: ToWireType<U[I]>;
}[number] : T extends funtypes.Record<infer U, infer V> ? Record<funtypes.Static<U>, ToWireType<V>> : T extends funtypes.Partial<infer U, infer V> ? V extends true ? {
    readonly [K in keyof U]?: ToWireType<U[K]>;
} : {
    [K in keyof U]?: ToWireType<U[K]>;
} : T extends funtypes.Object<infer U, infer V> ? V extends true ? {
    readonly [K in keyof U]: ToWireType<U[K]>;
} : {
    [K in keyof U]: ToWireType<U[K]>;
} : T extends funtypes.Readonly<funtypes.Tuple<infer U>> ? {
    readonly [P in keyof U]: ToWireType<U[P]>;
} : T extends funtypes.Tuple<infer U> ? {
    [P in keyof U]: ToWireType<U[P]>;
} : T extends funtypes.ReadonlyArray<infer U> ? readonly ToWireType<U>[] : T extends funtypes.Array<infer U> ? ToWireType<U>[] : T extends funtypes.ParsedValue<infer U, infer _> ? ToWireType<U> : T extends funtypes.Codec<infer U> ? U : never;
export declare const TransferRequest: funtypes.Object<{
    contractAddress: funtypes.Union<[funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>, funtypes.Literal<undefined>]>;
    from: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    to: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    quantity: funtypes.ParsedValue<funtypes.String, bigint>;
}, false>;
export type TransferRequest = funtypes.Static<typeof TransferRequest>;
export declare const TransferTemplate: funtypes.Intersect<[funtypes.Object<{
    contractAddress: funtypes.Union<[funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>, funtypes.Literal<undefined>]>;
    from: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    to: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
    quantity: funtypes.ParsedValue<funtypes.String, bigint>;
}, false>, funtypes.Object<{
    label: funtypes.Union<[funtypes.String, funtypes.Literal<undefined>]>;
}, false>]>;
export type TransferTemplate = funtypes.Static<typeof TransferTemplate>;
export declare const TemplatesCacheSchema: funtypes.Union<[funtypes.Object<{
    data: funtypes.Array<funtypes.Intersect<[funtypes.Object<{
        contractAddress: funtypes.Union<[funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>, funtypes.Literal<undefined>]>;
        from: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
        to: funtypes.Constraint<funtypes.ParsedValue<funtypes.String, string>, `0x${string}`, unknown>;
        quantity: funtypes.ParsedValue<funtypes.String, bigint>;
    }, false>, funtypes.Object<{
        label: funtypes.Union<[funtypes.String, funtypes.Literal<undefined>]>;
    }, false>]>>;
    version: funtypes.Literal<"1.0.0">;
}, false>]>;
export type TemplatesCache = funtypes.Static<typeof TemplatesCacheSchema>;
export {};
//# sourceMappingURL=schema.d.ts.map