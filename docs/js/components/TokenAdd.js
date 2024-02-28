import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { batch, useComputed, useSignal, useSignalEffect } from '@preact/signals';
import { Contract } from 'ethers';
import { useTokenManager } from '../context/TokenManager.js';
import { useTransfer } from '../context/Transfer.js';
import { useEthereumProvider } from '../context/Ethereum.js';
import { ERC20ABI } from '../library/ERC20ABI.js';
import { useAsyncState, useSignalRef } from '../library/preact-utilities.js';
import { ERC20Token, EthereumAddress, serialize } from '../schema.js';
import { useNotice } from '../store/notice.js';
import * as Icon from './Icon/index.js';
export const TokenAdd = () => {
    const queryResult = useSignal(undefined);
    return (_jsx(AddTokenDialog, { children: _jsxs("div", { class: 'lg:w-[32rem] mx-auto', children: [_jsx("div", { class: 'text-2xl font-semibold px-4 pt-5 leading-0', children: "Add a token" }), _jsx("div", { class: 'px-4 mb-3 text-white/50', children: "Enter the token's contract address to retrieve details" }), _jsx("form", { method: 'dialog', children: _jsxs("div", { class: 'px-4 grid gap-y-3', children: [_jsx(QueryAddressField, { result: queryResult }), _jsx(QueryResult, { result: queryResult })] }) })] }) }));
};
const AddTokenDialog = ({ children }) => {
    const { ref, signal: dialogRef } = useSignalRef(null);
    const { stage } = useTokenManager();
    const closeDialogOnBackdropClick = (e) => {
        const isClickWithinDialog = e.type === 'click' && e.target !== dialogRef?.value;
        if (isClickWithinDialog)
            return;
        dialogRef.value?.close();
    };
    const unsetStageIfClosedIntentionally = () => {
        stage.value = stage.value === 'add' ? undefined : stage.value;
    };
    const showOrHideDialog = () => {
        const dialogElement = dialogRef.value;
        const isDialogOpen = stage.value === 'add';
        if (!dialogElement)
            return;
        dialogElement.onclose = unsetStageIfClosedIntentionally;
        isDialogOpen ? dialogElement.showModal() : dialogElement.close();
    };
    const setClickListenerForDialog = () => {
        if (stage.value !== 'add')
            return;
        document.addEventListener('click', closeDialogOnBackdropClick);
        return () => document.removeEventListener('click', closeDialogOnBackdropClick);
    };
    useSignalEffect(showOrHideDialog);
    useSignalEffect(setClickListenerForDialog);
    return (_jsx("dialog", { ref: ref, class: 'w-full text-white backdrop:bg-black/80 backdrop:backdrop-blur-[2px] max-w-full max-h-full md:max-w-fit md:max-h-[calc(100vh-3rem)] md:max-w-fit bg-transparent', children: children }));
};
const QueryAddressField = ({ result }) => {
    const query = useSignal('');
    const isPristine = useSignal(true);
    const { ref, signal: inputRef } = useSignalRef(null);
    const parsedAddress = useComputed(() => EthereumAddress.safeParse(query.value));
    const normalizeAndUpdateValue = (newValue) => {
        batch(() => {
            isPristine.value = undefined;
            query.value = newValue.trim();
        });
    };
    const clearValue = () => {
        if (inputRef.value) {
            inputRef.value.value = '';
            const inputEvent = new InputEvent('input');
            inputRef.value.dispatchEvent(inputEvent);
            inputRef.value.focus();
        }
    };
    const validationMessage = useComputed(() => {
        if (parsedAddress.value.success)
            return undefined;
        return 'Invalid ERC20 contract address.';
    });
    const validateField = () => {
        if (inputRef.value === null)
            return;
        if (validationMessage.value === undefined) {
            inputRef.value.setCustomValidity('');
            return;
        }
        inputRef.value.setCustomValidity(validationMessage.value);
        inputRef.value.reportValidity();
    };
    useSignalEffect(() => {
        result.value = parsedAddress.value;
    });
    useSignalEffect(validateField);
    return (_jsxs("fieldset", { "data-pristine": isPristine.value, class: 'px-4 py-3 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 focus-within:border-white disabled:bg-white/10 disabled:border-white/30 modified:enabled:invalid:border-red-400 group', children: [_jsx("label", { class: 'absolute top-2 left-4 text-sm text-white/50 capitalize', children: "contract address" }), _jsx("input", { ref: ref, type: 'text', value: query.value, onInput: e => normalizeAndUpdateValue(e.currentTarget.value), required: true, placeholder: '0x0123...', class: 'peer outline-none pt-4 bg-transparent text-ellipsis disabled:text-white/30 placeholder:text-white/20 group-modified:enabled:invalid:text-red-400' }), _jsx(ClearButton, { onClick: clearValue })] }));
};
const QueryResult = ({ result }) => {
    const { notify } = useNotice();
    const { value: query, waitFor, reset } = useAsyncState();
    const { browserProvider, network } = useEthereumProvider();
    const getTokenMetadata = () => {
        if (!result.value?.success) {
            reset();
            return;
        }
        if (!browserProvider.value) {
            notify({ message: 'No compatible web3 wallet detected.', title: 'Failed to connect' });
            return;
        }
        if (network.value.state !== 'resolved') {
            notify({ message: 'Your wallet may not connected to the chain.', title: 'Network unavailable' });
            return;
        }
        const tokenAddress = result.value.value;
        const activeChainId = network.value.value.chainId;
        const provider = browserProvider.value;
        waitFor(async () => {
            const contract = new Contract(tokenAddress, ERC20ABI, provider);
            const namePromise = contract.name();
            const symbolPromise = contract.symbol();
            const decimalsPromise = contract.decimals();
            const name = await namePromise;
            const symbol = await symbolPromise;
            const decimals = await decimalsPromise;
            const chainId = activeChainId;
            return { chainId, name, symbol, decimals, address: tokenAddress };
        });
    };
    useSignalEffect(getTokenMetadata);
    switch (query.value.state) {
        case 'inactive':
            return _jsx(_Fragment, {});
        case 'pending':
            return (_jsxs("div", { class: 'px-4 py-3 grid grid-cols-[min-content,1fr] gap-x-2 items-center', children: [_jsx(Icon.Spinner, {}), _jsx("span", { children: "Retrieving token information from the network..." })] }));
        case 'rejected':
            return (_jsxs("div", { class: 'px-4 py-3 border border-dashed border-white/30 grid grid-cols-[min-content,1fr] gap-x-3 items-center', children: [_jsx("div", { class: 'text-3xl text-white/50', children: _jsx(EmptyIcon, {}) }), _jsxs("div", { children: [_jsx("div", { class: 'leading-tight', children: "No token contract matches the provided address" }), _jsx("div", { class: 'text-sm text-white/50', children: "Make sure the address and network is correctly set in your connected wallet." })] })] }));
        case 'resolved':
            const token = serialize(ERC20Token, query.value.value);
            const parsedToken = ERC20Token.parse(token);
            return (_jsxs("div", { class: 'px-4 py-3 border border-dashed border-white/30 grid grid-cols-[1fr,min-content] gap-x-2 items-center', children: [_jsxs("div", { children: [token.name, " ", _jsxs("span", { class: 'text-white/50', children: ["(", token.symbol, ")"] })] }), _jsx(UseTokenButton, { token: parsedToken })] }));
    }
};
const UseTokenButton = ({ token }) => {
    const { cache, stage } = useTokenManager();
    const { input } = useTransfer();
    const tokenExistsInCache = useComputed(() => cache.value.data.some(t => t.address === token.address));
    const saveNewToken = () => {
        cache.value = Object.assign({}, cache.peek(), { data: cache.peek().data.concat([token]) });
    };
    const useToken = () => {
        batch(() => {
            if (!tokenExistsInCache.value)
                saveNewToken();
            input.value = Object.assign({}, input.peek(), { token });
            stage.value = undefined;
        });
    };
    return (_jsxs("button", { type: 'button', class: 'outline-none border border-white/50 focus|hover:border-white focus|hover:bg-white/10 px-4 h-10 whitespace-nowrap grid grid-cols-[min-content,1fr] gap-x-1 items-center font-semibold', onClick: useToken, children: [_jsx(PlusIcon, {}), _jsxs("span", { children: [!tokenExistsInCache.value ? 'Save and ' : '', "Use"] })] }));
};
const ClearButton = ({ onClick }) => {
    return (_jsx("button", { type: 'button', onClick: onClick, class: 'outline-none w-8 h-8 flex items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:hidden peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white text-xs', children: _jsx(Icon.Xmark, {}) }));
};
const PlusIcon = () => (_jsx("svg", { width: '1em', height: '1em', viewBox: '0 0 24 24', "data-name": 'Line Color', xmlns: 'http://www.w3.org/2000/svg', children: _jsx("path", { d: 'M5 12h14m-7-7v14', style: 'fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2' }) }));
const EmptyIcon = () => (_jsxs("svg", { width: '1em', height: '1em', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', fill: 'none', stroke: 'currentColor', "stroke-width": '2', "stroke-linecap": 'round', "stroke-linejoin": 'round', children: [_jsx("circle", { cx: '12', cy: '12', r: '10' }), _jsx("path", { d: 'm4.93 4.93 14.14 14.14' })] }));
//# sourceMappingURL=TokenAdd.js.map