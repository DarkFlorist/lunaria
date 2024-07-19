import { ComponentChildren } from 'preact';
import { Signal } from '@preact/signals';
import { TransactionReceipt, TransactionResponse } from 'ethers';
import { AsyncProperty } from '../library/preact-utilities.js';
type TransactionContext = {
    transactionHash: Signal<string | undefined>;
    response: Signal<AsyncProperty<TransactionResponse | null>>;
    receipt: Signal<AsyncProperty<TransactionReceipt | null>>;
};
declare const TransactionContext: import("preact").Context<TransactionContext | undefined>;
export declare const TransactionProvider: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare function useTransaction(): TransactionContext;
export {};
//# sourceMappingURL=TransactionProvider.d.ts.map