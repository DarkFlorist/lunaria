import { TransactionReceipt, TransactionResponse } from 'ethers';
export declare function useTransaction(transactionHash: string): {
    transactionResponse: import("@preact/signals-core").Signal<import("../library/preact-utilities.js").AsyncProperty<TransactionResponse>>;
    transactionReceipt: import("@preact/signals-core").Signal<import("../library/preact-utilities.js").AsyncProperty<TransactionReceipt | null>>;
    reset: () => void;
};
//# sourceMappingURL=transaction.d.ts.map