import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
import { useComputed, useSignalEffect } from '@preact/signals';
import { useTransferHistory } from '../context/TransferHistory.js';
import { useTransfer } from '../context/Transfer.js';
import { EthereumAddress } from '../schema.js';
export const TransferRecorder = () => {
    const history = useTransferHistory();
    const { safeParse, transaction } = useTransfer();
    const addTransferToHistory = (transfer) => {
        history.value = { ...history.peek(), data: history.peek().data.concat([transfer]) };
    };
    const successfulTransfer = useComputed(() => {
        if (transaction.value.state !== 'resolved')
            return;
        if (!safeParse.value.success)
            return;
        const inputs = safeParse.value.value;
        const currentTransaction = transaction.value.value;
        return {
            from: EthereumAddress.parse(currentTransaction.from),
            to: EthereumAddress.parse(inputs.to),
            amount: inputs.amount,
            date: Date.now(),
            hash: currentTransaction.hash,
            token: inputs.token,
        };
    });
    const listenAndRecordTransfers = () => {
        if (successfulTransfer.value === undefined)
            return;
        addTransferToHistory(successfulTransfer.value);
    };
    useSignalEffect(listenAndRecordTransfers);
    return _jsx(_Fragment, {});
};
//# sourceMappingURL=TransferRecorder.js.map