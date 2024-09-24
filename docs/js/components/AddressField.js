import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useSignal } from '@preact/signals';
import { useRef } from 'preact/hooks';
import { removeNonStringsAndTrim } from '../library/utilities.js';
import * as Icon from './Icon/index.js';
export const AddressField = (props) => {
    const inputRef = useRef(null);
    const isValid = useSignal(true);
    const handleClear = () => {
        props.onClear?.();
        inputRef.current?.focus();
    };
    const handleInput = (e) => {
        const inputField = inputRef.current;
        const value = e.currentTarget.value;
        if (inputField === null)
            return;
        // clear errors and update field value
        inputField.setCustomValidity('');
        props.onInput(value);
        isValid.value = inputField.validity.valid;
        if (inputField.validity.patternMismatch) {
            inputField.setCustomValidity('Not a valid address');
        }
    };
    return (_jsx("div", { class: removeNonStringsAndTrim(baseClasses.root, isValid.value === false ? 'border-red-400 focus-within:border-red-400' : 'border-white/50 focus-within:border-white/90', props.disabled && 'opacity-50'), children: _jsxs("div", { class: 'grid grid-cols-[1fr,auto] items-center h-16', children: [_jsxs("div", { class: 'grid px-4', children: [_jsx("label", { class: 'text-sm text-white/50 leading-tight', children: props.label }), _jsx("input", { ref: inputRef, placeholder: props.placeholder, pattern: '^\\s*0x[0-9A-Fa-f]{40}\\s*$', class: baseClasses.field, type: 'text', value: props.value, onInput: handleInput, disabled: props.disabled, required: true })] }), props.value !== '' && (_jsx("button", { type: 'button', class: 'mx-2 p-2 outline-none border border-transparent focus:border-white text-sm disabled:opacity-50', onClick: handleClear, disabled: props.disabled, children: _jsx(Icon.Xmark, {}) }))] }) }));
};
const baseClasses = {
    root: 'border bg-transparent focus-within:bg-white/5',
    field: 'h-6 bg-transparent outline-none placeholder:text-white/20',
};
//# sourceMappingURL=AddressField.js.map