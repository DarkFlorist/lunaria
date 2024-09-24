import { Signal, ReadonlySignal } from '@preact/signals';
import { TransactionResponse } from 'ethers';
import * as funtypes from 'funtypes';
import { ComponentChildren } from 'preact';
import { AsyncProperty } from '../library/preact-utilities.js';
import { ERC20Token, TransferRequestInput } from '../schema.js';
type PartialInput = {
    to: string;
    amount: string;
    token: ERC20Token | undefined;
};
type TransferContext = {
    input: Signal<PartialInput>;
    safeParse: ReadonlySignal<funtypes.Result<TransferRequestInput>>;
    transaction: Signal<AsyncProperty<TransactionResponse>>;
    isBusy: Signal<boolean>;
};
export declare const TransferContext: import("preact").Context<TransferContext | undefined>;
export declare const TransferProvider: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare function useTransfer(): TransferContext;
export {};
//# sourceMappingURL=Transfer.d.ts.map