import { useSignalEffect } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { useAsyncState } from '../library/preact-utilities.js';
import { useEthereumProvider } from '../context/Ethereum.js';
export function useTransaction(transactionHash) {
    const { browserProvider } = useEthereumProvider();
    const { value: transactionResponse, waitFor: waitForResponse, reset: resetResponse } = useAsyncState();
    const { value: transactionReceipt, waitFor: waitForReceipt, reset: resetReceipt } = useAsyncState();
    const getTransactionResponse = (transactionHash) => {
        if (!browserProvider.value)
            return;
        const provider = browserProvider.value;
        waitForResponse(async () => {
            const result = await provider.getTransaction(transactionHash);
            // TransactionResult can actually be null?
            if (result === null)
                throw new Error('Transaction was not found on chain!');
            return result;
        });
    };
    const getTransactionReceipt = (txResponse) => {
        waitForReceipt(async () => {
            return await txResponse.wait();
        });
    };
    // automatically get transaction receipt
    useSignalEffect(() => {
        if (transactionResponse.value.state !== 'resolved')
            return;
        getTransactionReceipt(transactionResponse.value.value);
    });
    // reset async states
    useEffect(() => {
        resetReceipt();
        getTransactionResponse(transactionHash);
    }, [transactionHash]);
    return { transactionResponse, transactionReceipt, reset: resetResponse };
}
//# sourceMappingURL=transaction.js.map