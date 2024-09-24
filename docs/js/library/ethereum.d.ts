import { Interface, TransactionReceipt, Eip1193Provider, EventEmitterable, Log } from 'ethers';
export interface WithEip1193Provider {
    ethereum: Eip1193Provider;
}
export type EthereumProviderEvents = 'chainChanged' | 'accountsChanged';
export type EthereumProvider = EventEmitterable<EthereumProviderEvents>;
export declare function withEip1193Provider(global: unknown): global is WithEip1193Provider;
export declare function isEthereumProvider(ethereum: unknown): ethereum is EthereumProvider;
export declare const erc20Interface: Interface;
export declare const transferSignature: string;
export declare const isTransferTopic: (topic: string) => boolean;
export declare const ERC20Interface: Interface;
export declare const parseERC20ReceiptLog: ({ topics, data }: Log) => import("ethers").LogDescription | null;
export declare function extractERC20TransferRequest(receipt: TransactionReceipt): {
    contractAddress: string;
    from: string;
    to: any;
    quantity: string;
} | undefined;
//# sourceMappingURL=ethereum.d.ts.map