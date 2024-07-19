import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useSignalEffect } from '@preact/signals';
import { makeError } from 'ethers';
import { useAsyncState } from '../library/preact-utilities.js';
import { EthereumAddress } from '../schema.js';
import { useEthereumProvider } from '../context/Ethereum.js';
import { useWallet } from '../context/Wallet.js';
import { useNotification } from '../context/Notification.js';
import { AsyncText } from './AsyncText.js';
import SVGBlockie from './SVGBlockie.js';
import { humanReadableEthersError, isJsonRpcError, isEthersError, humanReadableJsonRpcError } from '../library/errors.js';
export const ConnectAccount = () => {
    const { browserProvider } = useEthereumProvider();
    const { account } = useWallet();
    const { value: query, waitFor } = useAsyncState();
    const { notify } = useNotification();
    const connect = () => {
        waitFor(async () => {
            if (!browserProvider.value) {
                throw makeError('No compatible web3 wallet detected.', 'UNKNOWN_ERROR', { error: { code: 4900 } });
            }
            const signer = await browserProvider.value.getSigner();
            return EthereumAddress.parse(signer.address);
        });
    };
    const listenForQueryChanges = () => {
        // do not reset shared state for other instances of this hooks
        if (query.value.state === 'inactive')
            return;
        account.value = query.value;
    };
    useSignalEffect(listenForQueryChanges);
    switch (account.value.state) {
        case 'rejected':
            const accountError = account.value.error;
            if (isEthersError(accountError)) {
                let message = humanReadableEthersError(accountError).message;
                if (accountError.code === 'UNKNOWN_ERROR' && isJsonRpcError(accountError.error)) {
                    message = humanReadableJsonRpcError(accountError.error).message;
                }
                notify({ message, title: 'Notice' });
            }
            return (_jsxs("div", { class: 'grid grid-cols-[1fr,auto] gap-3 px-4 lg:px-0 h-20 border border-white/20 lg:border-none lg:place-items-end place-content-center items-center', children: [_jsxs("div", { class: 'grid lg:place-items-end', children: [_jsx("span", { class: 'font-bold', children: "Get started quickly" }), _jsx("span", { class: 'text-sm text-white/50', children: "by connecting your wallet" })] }), _jsx("button", { class: 'h-12 px-4 border border-white/50 bg-white/20', onClick: connect, children: "Connect" })] }));
        case 'inactive':
            return (_jsxs("div", { class: 'grid grid-cols-[1fr,auto] gap-3 px-4 lg:px-0 h-20 border border-white/20 lg:border-none lg:place-items-end place-content-center items-center', children: [_jsxs("div", { class: 'grid lg:place-items-end', children: [_jsx("span", { class: 'font-bold', children: "Get started quickly" }), _jsx("span", { class: 'text-sm text-white/50', children: "by connecting your wallet" })] }), _jsx("button", { class: 'h-12 px-4 border border-white/50 bg-white/20', onClick: connect, children: "Connect" })] }));
        case 'pending':
        case 'resolved':
            return (_jsxs("div", { class: 'grid grid-cols-[1fr,auto] gap-2 px-4 lg:px-0 h-20 border border-white/20 lg:border-none place-items-end place-content-center items-center', children: [_jsxs("div", { class: 'grid place-items-end', children: [_jsx(AccountAddress, {}), _jsx(WalletNetwork, {})] }), _jsx(AccountAvatar, {})] }));
    }
};
const AccountAddress = () => {
    const { account } = useWallet();
    switch (account.value.state) {
        case 'inactive':
            return _jsx(_Fragment, {});
        case 'rejected':
            return _jsx("div", { class: 'whitespace-nowrap overflow-hidden overflow-ellipsis font-bold', children: "Not connected" });
        case 'pending':
            return _jsx(AsyncText, { placeholderLength: 40 });
        case 'resolved':
            return _jsx("div", { class: 'whitespace-nowrap overflow-hidden overflow-ellipsis font-bold', children: account.value.value });
    }
};
const NetworkIcon = () => (_jsx("svg", { width: '1em', height: '1em', viewBox: '0 0 48 48', xmlns: 'http://www.w3.org/2000/svg', children: _jsx("path", { fill: 'currentColor', d: 'M44 32h-2v-8a2 2 0 0 0-2-2H26v-6h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2v6H8a2 2 0 0 0-2 2v8H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2v-6h12v6h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2v-6h12v6h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-34 8H6v-4h4ZM22 8h4v4h-4Zm4 32h-4v-4h4Zm16 0h-4v-4h4Z', "data-name": 'icons Q2' }) }));
const AccountAvatar = () => {
    const { account } = useWallet();
    switch (account.value.state) {
        case 'inactive':
        case 'rejected':
            return _jsx("div", { class: 'aspect-square w-10 outline-2 outline-white/20 bg-white/20' });
        case 'pending':
            return _jsx("div", { class: 'aspect-square w-10 outline outline-white/20 bg-white/20 animate-pulse' });
        case 'resolved':
            return (_jsx("div", { style: { fontSize: '2.5em' }, children: _jsx(SVGBlockie, { address: account.value.value }) }));
    }
};
const WalletNetwork = () => {
    const { account } = useWallet();
    switch (account.value.state) {
        case 'inactive':
        case 'rejected':
            return _jsx(_Fragment, {});
        case 'pending':
            return _jsx(AsyncText, { placeholderLength: 16 });
        case 'resolved':
            return (_jsxs("div", { class: 'inline-flex items-center justify-end gap-1 text-white/50 text-sm', children: [_jsx(NetworkIcon, {}), _jsx(NetworkName, {})] }));
    }
};
const NetworkName = () => {
    const { network } = useEthereumProvider();
    switch (network.value.state) {
        case 'inactive':
            return _jsx("span", { class: 'capitalize leading-tight', children: "\u00A0" });
        case 'pending':
            return _jsx(AsyncText, { placeholderLength: 8 });
        case 'resolved':
            return _jsx("span", { class: 'capitalize leading-tight', children: network.value.value.name });
        case 'rejected':
            return _jsx("span", { class: 'capitalize leading-tight', children: "Unable to connect to wallet" });
    }
};
//# sourceMappingURL=ConnectAccount.js.map