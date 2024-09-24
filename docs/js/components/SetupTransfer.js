import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useSignalEffect } from '@preact/signals';
import { Contract } from 'ethers';
import { useTransfer } from '../context/Transfer.js';
import { ERC20ABI } from '../library/ERC20ABI.js';
import { useAsyncState } from '../library/preact-utilities.js';
import { TransferAddressField } from './TransferAddressField.js';
import { TransferAmountField } from './TransferAmountField.js';
import { TransferRecorder } from './TransferRecorder.js';
import { TransferButton } from './TransferButton.js';
import { TransferTokenSelectField } from './TransferTokenField.js';
import { useEthereumProvider } from '../context/Ethereum.js';
import { useNotice } from '../store/notice.js';
import { TokenPicker } from './TokenPicker.js';
import { TokenAdd } from './TokenAdd.js';
import { TransferResult } from './TransferResult.js';
import { TemplateFeeder } from './TemplateFeeder.js';
export function SetupTransfer() {
    return (_jsx(TransferForm, { children: _jsxs("div", { class: 'grid gap-3', children: [_jsxs("div", { class: 'grid gap-3 md:grid-cols-2', children: [_jsx(TransferTokenSelectField, {}), _jsx(TransferAmountField, {})] }), _jsx(TransferAddressField, {}), _jsx(TransferResult, {}), _jsx(TransferButton, {}), _jsx(TransferRecorder, {}), _jsx(TokenPicker, {}), _jsx(TokenAdd, {}), _jsx(TemplateFeeder, {})] }) }));
}
const TransferForm = ({ children }) => {
    const { browserProvider, network } = useEthereumProvider();
    const { input, transaction, safeParse } = useTransfer();
    const { value: transactionQuery, waitFor } = useAsyncState();
    const { notify } = useNotice();
    const sendTransferRequest = (e) => {
        e.preventDefault();
        if (!browserProvider.value) {
            notify({ message: 'No compatible web3 wallet detected.', title: 'Failed to connect' });
            return;
        }
        if (!safeParse.value.success)
            return;
        const transferInput = safeParse.value.value;
        const provider = browserProvider.value;
        waitFor(async () => {
            const signer = await provider.getSigner();
            // Ether transfer
            if (transferInput.token === undefined) {
                return await signer.sendTransaction({ to: transferInput.to, value: transferInput.amount });
            }
            // Token transfer
            const tokenMetadata = transferInput.token;
            const contract = new Contract(tokenMetadata.address, ERC20ABI, signer);
            return await contract.transfer(transferInput.to, transferInput.amount);
        });
    };
    const listenForQueryChanges = () => {
        // do not reset shared state for other instances of this hooks
        if (transactionQuery.value.state === 'inactive')
            return;
        transaction.value = transactionQuery.value;
    };
    const listenForWalletsChainChange = () => {
        if (network.value.state === 'resolved')
            return;
        // reset token input as it may not exist on the active network
        input.value = { ...input.peek(), token: undefined };
    };
    useSignalEffect(listenForWalletsChainChange);
    useSignalEffect(listenForQueryChanges);
    return _jsx("form", { onSubmit: sendTransferRequest, children: children });
};
//# sourceMappingURL=SetupTransfer.js.map