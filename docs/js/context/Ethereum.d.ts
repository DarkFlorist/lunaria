import { ComponentChildren } from 'preact';
import { Signal } from '@preact/signals';
import { BrowserProvider, Network } from 'ethers';
import { AsyncProperty } from '../library/preact-utilities.js';
type EthereumProviderContext = {
    browserProvider: Signal<BrowserProvider | undefined>;
    network: Signal<AsyncProperty<Network>>;
    blockNumber: Signal<number | undefined>;
};
export declare const EthereumProviderContext: import("preact").Context<EthereumProviderContext | undefined>;
export declare const EthereumProvider: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare function useEthereumProvider(): EthereumProviderContext;
export {};
//# sourceMappingURL=Ethereum.d.ts.map