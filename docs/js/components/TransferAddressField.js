import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { batch, useComputed, useSignal, useSignalEffect } from '@preact/signals';
import { useTransfer } from '../context/Transfer.js';
import { useSignalRef } from '../library/preact-utilities.js';
import * as Icon from './Icon/index.js';
export const TransferAddressField = () => {
    const transfer = useTransfer();
    const isPristine = useSignal(true);
    const { ref, signal: inputRef } = useSignalRef(null);
    const normalizeAndUpdateValue = (newValue) => {
        batch(() => {
            isPristine.value = undefined;
            transfer.input.value = { ...transfer.input.value, to: newValue.trim() };
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
        const safeParsedInput = transfer.safeParse.value;
        if (safeParsedInput.success || safeParsedInput.key !== 'to')
            return undefined;
        return 'Requires a valid address';
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
    return (_jsxs("fieldset", { "data-pristine": isPristine.value, class: 'px-4 py-3 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 focus-within:border-white disabled:bg-white/10 disabled:border-white/30 modified:enabled:invalid:border-red-400 group', children: [_jsx("label", { class: 'absolute top-2 left-4 text-sm text-white/50 capitalize', children: "to" }), _jsx("input", { ref: ref, type: 'text', value: transfer.input.value.to, onInput: e => normalizeAndUpdateValue(e.currentTarget.value), required: true, placeholder: '0x0123...', class: 'peer outline-none pt-4 bg-transparent text-ellipsis disabled:text-white/30 placeholder:text-white/20 group-modified:enabled:invalid:text-red-400' }), _jsx(ClearButton, { onClick: clearValue })] }));
};
const ClearButton = ({ onClick }) => {
    return (_jsx("button", { type: 'button', onClick: onClick, class: 'outline-none w-8 h-8 flex items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:hidden peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white text-xs', children: _jsx(Icon.Xmark, {}) }));
};
//# sourceMappingURL=TransferAddressField.js.map