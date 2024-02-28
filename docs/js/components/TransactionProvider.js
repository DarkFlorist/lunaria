import { jsx as _jsx } from "preact/jsx-runtime";
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { useSignal, useSignalEffect } from '@preact/signals';
import { useEthereumProvider } from '../context/Ethereum.js';
import { useAsyncState } from '../library/preact-utilities.js';
const TransactionContext = createContext(undefined);
export const TransactionProvider = ({ children }) => {
    const { browserProvider } = useEthereumProvider();
    const { value: response, waitFor: waitForResponse, reset: resetResponse } = useAsyncState();
    const { value: receipt, waitFor: waitForReceipt, reset: resetReceipt } = useAsyncState();
    const transactionHash = useSignal(undefined);
    const getTransactionResponse = (transactionHash) => {
        if (!browserProvider.value)
            return;
        const provider = browserProvider.value;
        waitForResponse(async () => {
            return await provider.getTransaction(transactionHash);
        });
    };
    const getTransactionReceipt = (txResponse) => {
        waitForReceipt(async () => {
            return await txResponse.wait();
        });
    };
    // automatically get transaction receipt
    useSignalEffect(() => {
        if (response.value.state !== 'resolved')
            return;
        if (response.value.value === null)
            return;
        getTransactionReceipt(response.value.value);
    });
    useSignalEffect(() => {
        if (transactionHash.value === undefined)
            return;
        resetResponse();
        resetReceipt();
        getTransactionResponse(transactionHash.value);
    });
    return (_jsx(TransactionContext.Provider, { value: { transactionHash, response, receipt }, children: children }));
};
export function useTransaction() {
    const context = useContext(TransactionContext);
    if (context === undefined)
        throw ('use useTransaction within children of TransactionProvider');
    return context;
}
//# sourceMappingURL=TransactionProvider.js.map