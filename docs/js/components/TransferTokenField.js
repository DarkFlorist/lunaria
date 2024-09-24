import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useTransfer } from '../context/Transfer.js';
import { useTokenManager } from '../context/TokenManager.js';
import { removeNonStringsAndTrim } from '../library/utilities.js';
import { useComputed, useSignalEffect } from '@preact/signals';
import { useSignalRef } from '../library/preact-utilities.js';
export const TransferTokenSelectField = () => {
    const { ref, signal: buttonRef } = useSignalRef(null);
    const { isBusy } = useTransfer();
    const { stage } = useTokenManager();
    const { input } = useTransfer();
    const activateOnKeypress = (e) => {
        switch (e.key) {
            case '':
            case 'Enter':
            case 'ArrowUp':
            case 'ArrowDown':
                e.preventDefault();
                stage.value = 'select';
                break;
            default:
                return;
        }
    };
    const selectedAsset = useComputed(() => input.value.token || { name: 'Ether', symbol: 'ETH' });
    const focusButtonOnClearStage = () => {
        if (!buttonRef.value)
            return;
        if (document.activeElement === buttonRef.value)
            return;
        if (stage.value === undefined)
            buttonRef.value.focus();
    };
    useSignalEffect(focusButtonOnClearStage);
    return (_jsx("button", { type: 'button', ref: ref, class: removeNonStringsAndTrim('border border-white/50 bg-transparent outline-none focus-within:border-white/80 focus-within:bg-white/5', isBusy.value && 'opacity-50'), onKeyDown: activateOnKeypress, onClick: () => (stage.value = 'select'), children: _jsxs("div", { class: 'grid grid-cols-[1fr,auto] gap-4 items-center px-4 h-16', children: [_jsxs("div", { class: 'grid text-left', children: [_jsx("div", { class: 'text-sm text-white/50 leading-tight', children: "Asset" }), _jsx("div", { class: 'appearance-none outline-none h-6 bg-transparent text-left', children: selectedAsset.value.name })] }), _jsxs("div", { class: 'grid grid-cols-[min-content,min-content] items-center gap-3', children: [_jsx("div", { class: 'text-white/50', children: selectedAsset.value.symbol }), _jsx(SwitchIcon, {})] })] }) }));
};
const SwitchIcon = () => (_jsx("svg", { width: '1em', height: '1em', viewBox: '0 0 12 12', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: _jsx("path", { d: 'M.75 0A.75.75 0 0 0 0 .75v2.5A.75.75 0 0 0 .75 4h2.5A.75.75 0 0 0 4 3.25V.75A.75.75 0 0 0 3.25 0H.75Zm7.226 4.624a.6.6 0 1 0 .848-.848L8.048 3H10.5a.3.3 0 0 1 .3.3v2.1a.6.6 0 1 0 1.2 0V3.3a1.5 1.5 0 0 0-1.5-1.5H8.048l.776-.776a.6.6 0 0 0-.848-.848l-1.8 1.8a.6.6 0 0 0 0 .848l1.8 1.8ZM4.024 7.376a.6.6 0 0 0-.848.848L3.952 9H1.5a.3.3 0 0 1-.3-.3V6.6a.6.6 0 1 0-1.2 0v2.1a1.5 1.5 0 0 0 1.5 1.5h2.452l-.776.776a.6.6 0 1 0 .848.848l1.8-1.8a.6.6 0 0 0 0-.848l-1.8-1.8Zm7.756 4.404a.75.75 0 0 0 .22-.53v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .53-.22Z', fill: 'currentColor' }) }));
//# sourceMappingURL=TransferTokenField.js.map