import { jsx as _jsx } from "preact/jsx-runtime";
import { useComputed, useSignal } from '@preact/signals';
import * as funtypes from 'funtypes';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { createUnitParser, safeSerialize, ERC20Token, TransferRequestInput } from '../schema.js';
export const TransferContext = createContext(undefined);
export const TransferProvider = ({ children }) => {
    const transaction = useSignal({ state: 'inactive' });
    const input = useSignal({ to: '', amount: '', token: undefined });
    const isBusy = useSignal(false);
    const parsedAmount = useComputed(() => {
        const HexUnit = funtypes.String.withParser(createUnitParser(input.value.token?.decimals));
        return HexUnit.safeParse(input.value.amount);
    });
    const serializedToken = useComputed(() => {
        if (input.value.token === undefined)
            return { success: true, value: undefined };
        return safeSerialize(ERC20Token, input.value.token);
    });
    const safeParse = useComputed(() => {
        if (!parsedAmount.value.success)
            return { ...parsedAmount.value, key: 'amount' };
        if (!serializedToken.value.success)
            return { ...serializedToken.value, key: 'token' };
        const amount = parsedAmount.value.value;
        const token = serializedToken.value.value;
        return TransferRequestInput.safeParse({ ...input.value, amount, token });
    });
    return _jsx(TransferContext.Provider, { value: { input, safeParse, transaction, isBusy }, children: children });
};
export function useTransfer() {
    const context = useContext(TransferContext);
    if (!context)
        throw new Error('useTransfer can only be used within children of TransferProvider');
    return context;
}
//# sourceMappingURL=Transfer.js.map