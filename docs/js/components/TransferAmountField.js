import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { batch, useComputed, useSignal, useSignalEffect } from '@preact/signals';
import { formatUnits, parseUnits } from 'ethers';
import { useBalance } from '../context/Wallet.js';
import { useTransfer } from '../context/Transfer.js';
import { useSignalRef } from '../library/preact-utilities.js';
import * as Icon from './Icon/index.js';
export const TransferAmountField = () => {
    const { input, safeParse } = useTransfer();
    const isPristine = useSignal(true);
    const { ref, signal: inputRef } = useSignalRef(null);
    const normalizeAndUpdateValue = (newValue) => {
        batch(() => {
            isPristine.value = undefined;
            input.value = { ...input.value, amount: newValue.trim() };
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
        const safeParsedInput = safeParse.value;
        if (safeParsedInput.success || safeParsedInput.key !== 'amount')
            return undefined;
        return 'Amount should be a number.';
    });
    const validateField = () => {
        if (inputRef.value === null)
            return;
        if (validationMessage.value === undefined) {
            inputRef.value.setCustomValidity('');
            return;
        }
        inputRef.value.setCustomValidity(validationMessage.value);
    };
    useSignalEffect(validateField);
    return (_jsxs("fieldset", { "data-pristine": isPristine.value, class: 'px-4 py-3 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 focus-within:border-white disabled:bg-white/10 disabled:border-white/30 modified:enabled:invalid:border-red-400', children: [_jsx("label", { class: 'absolute top-2 left-4 text-sm text-white/50 capitalize', children: "amount" }), _jsx("input", { ref: ref, type: 'text', value: input.value.amount, onInput: e => normalizeAndUpdateValue(e.currentTarget.value), required: true, placeholder: '1.00', class: 'peer outline-none pt-4 bg-transparent text-ellipsis disabled:text-white/30 placeholder:text-white/20' }), _jsx(MaxButton, {}), _jsx(ClearButton, { onClick: clearValue })] }));
};
const MaxButton = () => {
    const { balance, token } = useBalance();
    const { input } = useTransfer();
    const resolvedBalance = useComputed(() => balance.value.state === 'resolved' ? balance.value.value : undefined);
    const setMaxAmount = async () => {
        const amount = formatUnits(resolvedBalance.value || 0n, input.value.token?.decimals);
        input.value = Object.assign({}, input.peek(), { amount });
    };
    const isInputAmountAtMax = useComputed(() => {
        try {
            const amount = parseUnits(input.value.amount, input.value.token?.decimals);
            return resolvedBalance.value === amount;
        }
        catch {
            return false;
        }
    });
    useSignalEffect(() => {
        token.value = input.value.token;
    });
    if (!input.value.token || isInputAmountAtMax.value)
        return _jsx(_Fragment, {});
    switch (balance.value.state) {
        case 'inactive':
        case 'rejected':
            return _jsx(_Fragment, {});
        case 'pending':
            return _jsxs(_Fragment, { children: [_jsx(Icon.Spinner, { class: 'opacity-50' }), " ", _jsxs("div", { class: 'text-xs text-white/50 flex flex-col', children: [_jsx("span", { children: "checking" }), _jsx("span", { children: "balance" })] })] });
        case 'resolved':
            return (_jsx("button", { type: 'button', onClick: setMaxAmount, class: 'outline-none px-2 h-8 items-center justify-center border border-white/50 text-white/50 peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white', children: "max" }));
    }
};
const ClearButton = ({ onClick }) => {
    return (_jsx("button", { type: 'button', onClick: onClick, class: 'outline-none w-8 h-8 flex items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:hidden peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white text-xs', children: _jsx(Icon.Xmark, {}) }));
};
//# sourceMappingURL=TransferAmountField.js.map