import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useSignalEffect } from '@preact/signals';
import { formatEther, formatUnits } from 'ethers';
import SVGBlockie from '../SVGBlockie.js';
import { useRouter } from '../HashRouter.js';
import { TemplateRecorder } from '../TemplateRecorder.js';
import { Info, InfoError, InfoPending } from './Info.js';
import { useTransaction } from '../TransactionProvider.js';
import { EthereumAddress, TransferRequest } from '../../schema.js';
import { extractERC20TransferRequest } from '../../library/ethereum.js';
import { useTokenManager } from '../../context/TokenManager.js';
export const TransactionDetails = () => {
    const router = useRouter();
    const { transactionHash } = useTransaction();
    useSignalEffect(() => {
        transactionHash.value = router.value.params.transaction_hash;
    });
    return (_jsxs("div", { class: 'grid gap-2', children: [_jsx(TransactionHash, {}), _jsx(TransferFrom, {}), _jsx(TransferTo, {}), _jsx(TransferAmount, {}), _jsx(TransferFee, {}), _jsx(TemplateRecorder, {})] }));
};
const TransactionHash = () => {
    const { transactionHash } = useTransaction();
    if (!transactionHash.value)
        return _jsx(_Fragment, {});
    return _jsx(Info, { label: 'Hash', value: transactionHash.value, allowCopy: true });
};
const TransferFrom = () => {
    const { response } = useTransaction();
    switch (response.value.state) {
        case 'inactive':
            return _jsx(_Fragment, {});
        case 'pending':
            return _jsx(InfoPending, {});
        case 'rejected':
            return _jsx(InfoError, { displayText: 'Failed to load information', message: response.value.error.message });
        case 'resolved':
            const from = response.value.value?.from;
            if (from === undefined)
                return _jsx(_Fragment, {});
            const blockieIcon = () => (_jsx("span", { class: 'text-4xl', children: _jsx(SVGBlockie, { address: from }) }));
            return _jsx(Info, { label: 'From', value: from, icon: blockieIcon, allowCopy: true });
    }
};
const TransferTo = () => {
    const { receipt } = useTransaction();
    switch (receipt.value.state) {
        case 'inactive':
            return _jsx(_Fragment, {});
        case 'pending':
            return _jsx(InfoPending, {});
        case 'rejected':
            return _jsx(InfoError, { displayText: 'Failed to load information', message: receipt.value.error.message });
        case 'resolved':
            const txReceipt = receipt.value.value;
            if (txReceipt === null)
                return _jsx(_Fragment, {});
            const extractedRequest = extractERC20TransferRequest(txReceipt);
            if (extractedRequest)
                return _jsx(TokenRecipient, { transferRequest: extractedRequest });
            return _jsx(EthRecipient, {});
    }
};
const TokenRecipient = ({ transferRequest }) => {
    // loading states are handled by the parent component
    const parsedERC20Request = TransferRequest.safeParse(transferRequest);
    if (!parsedERC20Request.success)
        return _jsx(InfoError, { displayText: 'Failed to extract recipient address from transfer details.', message: parsedERC20Request.message });
    const Blockie = () => _jsx("span", { class: 'text-4xl', children: _jsx(SVGBlockie, { address: parsedERC20Request.value.to }) });
    return _jsx(Info, { label: 'To', value: parsedERC20Request.value.to, icon: Blockie, allowCopy: true });
};
const EthRecipient = () => {
    const { response } = useTransaction();
    // loading states are handled by the parent component
    if (response.value.state !== 'resolved')
        return _jsx(_Fragment, {});
    const txResponse = response.value.value;
    if (!txResponse)
        return _jsx(_Fragment, {});
    const parsedTo = EthereumAddress.safeParse(txResponse.to);
    if (!parsedTo.success)
        return _jsx(InfoError, { displayText: 'Failed to extract recipient address', message: parsedTo.message });
    const blockieIcon = () => _jsx("span", { class: 'text-4xl', children: _jsx(SVGBlockie, { address: parsedTo.value }) });
    return _jsx(Info, { label: 'To', value: parsedTo.value, icon: blockieIcon, allowCopy: true });
};
const TransferAmount = () => {
    const { receipt } = useTransaction();
    switch (receipt.value.state) {
        case 'inactive':
            return _jsx(_Fragment, {});
        case 'pending':
            return _jsx(InfoPending, {});
        case 'rejected':
            return _jsx(InfoError, { displayText: 'Failed to load information', message: receipt.value.error.message });
        case 'resolved':
            const txReceipt = receipt.value.value;
            if (txReceipt === null)
                return _jsx(_Fragment, {});
            const extractedRequest = extractERC20TransferRequest(txReceipt);
            if (extractedRequest)
                return _jsx(TokenAmount, { transferRequest: extractedRequest });
            return _jsx(EthAmount, {});
    }
};
const TokenAmount = ({ transferRequest }) => {
    const { cache } = useTokenManager();
    const parsedERC20Request = TransferRequest.safeParse(transferRequest);
    if (!parsedERC20Request.success)
        return _jsx(InfoError, { displayText: 'Failed to extract amount from transfer info', message: parsedERC20Request.message });
    const getTokenMetaFromCache = (address) => cache.value.data.find(token => token.address === address);
    const token = parsedERC20Request.value.contractAddress ? getTokenMetaFromCache(parsedERC20Request.value.contractAddress) : undefined;
    if (!token)
        return _jsx(InfoError, { displayText: 'The token is not on your token list', message: `Contract ${parsedERC20Request.value.contractAddress} does not exist on your token list.` });
    const displayAmount = `${formatUnits(parsedERC20Request.value.quantity, token.decimals)} ${token.symbol}`;
    return _jsx(Info, { label: 'Amount', value: displayAmount });
};
const EthAmount = () => {
    const { response } = useTransaction();
    switch (response.value.state) {
        case 'inactive':
            return _jsx(_Fragment, {});
        case 'pending':
            return _jsx(InfoPending, {});
        case 'rejected':
            return _jsx(InfoError, { displayText: 'Failed to load information', message: response.value.error.message });
        case 'resolved':
            const txResponse = response.value.value;
            if (txResponse === null)
                return _jsx(_Fragment, {});
            const displayValue = `${formatEther(txResponse.value)} ETH`;
            return _jsx(Info, { label: 'Amount', value: displayValue });
    }
};
const TransferFee = () => {
    const { receipt } = useTransaction();
    switch (receipt.value.state) {
        case 'inactive':
            return _jsx(_Fragment, {});
        case 'pending':
            return _jsx(InfoPending, {});
        case 'rejected':
            return _jsx(InfoError, { displayText: 'Failed to load information', message: receipt.value.error.message });
        case 'resolved':
            if (receipt.value.value === null)
                return _jsx(_Fragment, {});
            const transactionFee = `${formatEther(receipt.value.value.fee)} ETH`;
            return _jsx(Info, { label: 'Transaction Fee', value: transactionFee });
    }
};
//# sourceMappingURL=TransactionDetails.js.map