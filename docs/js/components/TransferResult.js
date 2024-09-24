import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useComputed } from '@preact/signals';
import { useWallet } from '../context/Wallet.js';
import { useNotification } from '../context/Notification.js';
import { useTokenManager } from '../context/TokenManager.js';
import { useTransfer } from '../context/Transfer.js';
import { humanReadableEthersError, isEthersError } from '../library/errors.js';
import { areEqualStrings } from '../library/utilities.js';
import { CopyButton } from './CopyButton.js';
export const TransferResult = () => {
    const { account } = useWallet();
    const { input, transaction } = useTransfer();
    const { cache: tokensCache } = useTokenManager();
    const { notify } = useNotification();
    const recipientIsSender = useComputed(() => {
        if (account.value.state !== 'resolved')
            return false;
        return account.value.value === input.value.to;
    });
    const recipientIsAKnownToken = useComputed(() => tokensCache.value.data.some(token => areEqualStrings(token.address, input.value.to)));
    switch (transaction.value.state) {
        case 'inactive':
            if (recipientIsSender.value) {
                return _jsx(ConfirmField, { title: 'Warning: The recipient is the same as the sender', description: 'This transactions sends funds to itself and will almost certainly result wasting money on transaction fees.', label: 'I understand that this will almost certainly have no effect but still cost me transactions fees.' });
            }
            if (recipientIsAKnownToken.value) {
                return _jsx(ConfirmField, { title: 'Warning: Recipient is a token address', description: 'The recipient address provided is a token contract address and will probably result in a loss of funds.', label: 'I understand that this will probably result in a loss of funds.' });
            }
            return _jsx(_Fragment, {});
        case 'rejected':
            const txError = transaction.value.error;
            let errorMessage = 'An unknown error occurred';
            if (isEthersError(txError)) {
                const { warning, message } = humanReadableEthersError(txError);
                if (!warning) {
                    notify({ message, title: 'Action Rejected' });
                    return _jsx(_Fragment, {});
                }
                errorMessage = message;
            }
            return _jsx(ErrorDetails, { summary: errorMessage, message: txError.message });
        case 'resolved':
        case 'pending':
            return _jsx(_Fragment, {});
    }
};
const ErrorDetails = ({ message, summary }) => {
    return (_jsxs("div", { class: 'border border-red-400/50 bg-red-400/10 px-4 py-3 grid grid-cols-[min-content,1fr] gap-x-3 items-center min-w-0', children: [_jsx("div", { children: _jsx(ExclamationIcon, {}) }), _jsxs("div", { class: 'min-w-0', children: [_jsx("div", { class: 'font-semibold', children: "Transaction failed!" }), _jsx("div", { class: 'text-sm text-white/50 break-words', children: summary }), _jsxs("details", { class: 'group', children: [_jsx("summary", { class: 'cursor-pointer before:content-["Show"] group-[:is([open])]:before:content-["Hide"]', children: " details" }), _jsxs("div", { class: 'border border-white/10 bg-white/5 px-3 py-2 mt-2 group relative', children: [_jsx("pre", { class: 'whitespace-pre-wrap text-sm text-white/30', children: message }), _jsx("div", { class: 'absolute right-2 bottom-2 hidden group-hover:block', children: _jsx(CopyButton, { value: message, withLabel: true }) })] })] })] })] }));
};
const ConfirmField = ({ title, description, label }) => {
    return (_jsxs("div", { class: 'border border-amber-500/50 bg-amber-500/10 px-4 py-3 grid grid-cols-[min-content,1fr] grid-rows-[min-content,min-content] gap-x-3 items-center', children: [_jsx("div", { class: 'row-span-2', children: _jsx(ExclamationIcon, {}) }), _jsxs("div", { children: [_jsx("div", { class: 'font-semibold leading-tight', children: title }), _jsx("div", { class: 'text-sm text-white/50 mb-2 leading-tight', children: description })] }), _jsxs("label", { class: 'grid grid-cols-[min-content,1fr] gap-x-3 items-start', children: [_jsx("input", { class: 'h-5', type: 'checkbox', required: true }), _jsx("span", { class: 'leading-tight', children: label })] })] }));
};
const ExclamationIcon = () => (_jsx("svg", { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', class: 'text-4xl', children: _jsx("path", { d: 'M12 17.5C12.3117 17.5 12.5731 17.3944 12.7843 17.1832C12.9948 16.9727 13.1 16.7117 13.1 16.4V11.9725C13.1 11.6608 12.9948 11.4042 12.7843 11.2025C12.5731 11.0008 12.3117 10.9 12 10.9C11.6883 10.9 11.4273 11.0052 11.2168 11.2157C11.0056 11.4269 10.9 11.6883 10.9 12V16.4275C10.9 16.7392 11.0056 16.9958 11.2168 17.1975C11.4273 17.3992 11.6883 17.5 12 17.5V17.5ZM12 8.7C12.3117 8.7 12.5731 8.5944 12.7843 8.3832C12.9948 8.17273 13.1 7.91167 13.1 7.6C13.1 7.28833 12.9948 7.0269 12.7843 6.8157C12.5731 6.60523 12.3117 6.5 12 6.5C11.6883 6.5 11.4273 6.60523 11.2168 6.8157C11.0056 7.0269 10.9 7.28833 10.9 7.6C10.9 7.91167 11.0056 8.17273 11.2168 8.3832C11.4273 8.5944 11.6883 8.7 12 8.7ZM12 23C10.4783 23 9.04833 22.7111 7.71 22.1332C6.37167 21.5561 5.2075 20.7725 4.2175 19.7825C3.2275 18.7925 2.44393 17.6283 1.8668 16.29C1.28893 14.9517 1 13.5217 1 12C1 10.4783 1.28893 9.04833 1.8668 7.71C2.44393 6.37167 3.2275 5.2075 4.2175 4.2175C5.2075 3.2275 6.37167 2.44357 7.71 1.8657C9.04833 1.28857 10.4783 1 12 1C13.5217 1 14.9517 1.28857 16.29 1.8657C17.6283 2.44357 18.7925 3.2275 19.7825 4.2175C20.7725 5.2075 21.5561 6.37167 22.1332 7.71C22.7111 9.04833 23 10.4783 23 12C23 13.5217 22.7111 14.9517 22.1332 16.29C21.5561 17.6283 20.7725 18.7925 19.7825 19.7825C18.7925 20.7725 17.6283 21.5561 16.29 22.1332C14.9517 22.7111 13.5217 23 12 23ZM12 20.8C14.4383 20.8 16.5148 19.9431 18.2293 18.2293C19.9431 16.5148 20.8 14.4383 20.8 12C20.8 9.56167 19.9431 7.48523 18.2293 5.7707C16.5148 4.0569 14.4383 3.2 12 3.2C9.56167 3.2 7.4856 4.0569 5.7718 5.7707C4.05727 7.48523 3.2 9.56167 3.2 12C3.2 14.4383 4.05727 16.5148 5.7718 18.2293C7.4856 19.9431 9.56167 20.8 12 20.8Z', fill: 'white' }) }));
//# sourceMappingURL=TransferResult.js.map