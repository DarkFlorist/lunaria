import { Signal } from '@preact/signals';
import * as funtypes from 'funtypes';
import { ComponentChildren } from 'preact';
export declare const TransferHistoryCacheSchema: funtypes.Union<[funtypes.Object<{
    data: funtypes.Array<funtypes.Object<{
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
    }, false>>;
    version: funtypes.Literal<"1.0.0">;
}, false>]>;
export type TransferHistory = funtypes.Static<typeof TransferHistoryCacheSchema>;
export declare const TransferHistoryProvider: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare function useTransferHistory(): Signal<{
    data: {
        hash: string;
        from: `0x${string}`;
        to: `0x${string}`;
        amount: bigint;
        token: {
            chainId: bigint;
            name: string;
            address: `0x${string}`;
            symbol: string;
            decimals: bigint;
        } | undefined;
        date: number;
    }[];
    version: "1.0.0";
}>;
//# sourceMappingURL=TransferHistory.d.ts.map