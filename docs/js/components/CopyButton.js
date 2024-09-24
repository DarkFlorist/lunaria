import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useSignal, useSignalEffect } from '@preact/signals';
import { useNotification } from '../context/Notification.js';
import * as Icon from './Icon/index.js';
export const CopyButton = ({ value, label, withLabel }) => {
    const isCopied = useSignal(false);
    const { notify } = useNotification();
    const hasLabel = label || withLabel;
    const handleClick = async () => {
        await navigator.clipboard.writeText(value);
        isCopied.value = true;
    };
    useSignalEffect(() => {
        if (isCopied.value !== true)
            return;
        setTimeout(() => {
            isCopied.value = false;
        }, 1000);
    });
    useSignalEffect(() => {
        if (!isCopied.value)
            return;
        notify({ message: 'Copied information may contain private data.', title: 'Copied text to clipboard' });
    });
    if (isCopied.value) {
        return _jsxs(Button, { onClick: handleClick, disabled: true, children: [_jsx(Icon.Check, {}), " ", hasLabel ? _jsx("span", { children: "copied! " }) : _jsx(_Fragment, {}), " "] });
    }
    return _jsxs(Button, { onClick: handleClick, children: [_jsx(Icon.Copy, {}), hasLabel ? _jsx("span", { children: "copy " }) : _jsx(_Fragment, {})] });
};
const Button = ({ children, ...props }) => {
    return (_jsx("button", { type: 'button', title: 'Copy', class: 'text-xs text-white/50 bg-white/10 px-3 h-8 uppercase whitespace-nowrap flex gap-1 items-center focus:text-white hover:text-white hover:bg-white/20 disabled:text-white/30 disabled:hover:text-white/30', ...props, children: children }));
};
//# sourceMappingURL=CopyButton.js.map