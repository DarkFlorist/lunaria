import { Signal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { AsyncProperty } from '../library/preact-utilities.js';
import { SettingsCache, EthereumAddress } from '../schema.js';
export type WalletContext = {
    settings: Signal<SettingsCache>;
    account: Signal<AsyncProperty<EthereumAddress>>;
};
export declare const WalletContext: import("preact").Context<WalletContext | undefined>;
export declare const WalletProvider: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare function useWallet(): {
    connect: () => void;
    settings: Signal<{
        data: {
            address: `0x${string}`;
            holdings: `0x${string}`[];
        }[];
        version: "1.0.0";
    }>;
    account: Signal<AsyncProperty<`0x${string}`>>;
};
export declare function useBalance(): {
    balance: Signal<AsyncProperty<bigint>>;
    token: Signal<{
        chainId: bigint;
        name: string;
        address: `0x${string}`;
        symbol: string;
        decimals: bigint;
    } | undefined>;
};
//# sourceMappingURL=Wallet.d.ts.map