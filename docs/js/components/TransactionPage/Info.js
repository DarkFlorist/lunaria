import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { removeNonStringsAndTrim } from '../../library/utilities.js';
import { AsyncText } from '../AsyncText.js';
import { CopyButton } from '../CopyButton.js';
import * as Icon from '../Icon/index.js';
export const Info = (props) => {
    const { label, value, prefix = '', suffix = '', allowCopy, icon } = props;
    const Icon = () => (icon === undefined ? _jsx(_Fragment, {}) : icon());
    return (_jsxs("div", { class: removeNonStringsAndTrim('grid gap-4 items-center px-4 py-2 border border-white/20 min-w-0', icon === undefined ? ' grid-cols-[1fr,auto]' : 'grid-cols-[auto,1fr,auto]'), children: [_jsx(Icon, {}), _jsxs("div", { children: [_jsx("div", { class: 'text-sm text-white/50', children: label }), _jsx("div", { class: 'overflow-hidden text-ellipsis whitespace-nowrap', children: `${prefix}${value}${suffix}` })] }), allowCopy ? _jsx(CopyButton, { value: value, label: 'Copy' }) : _jsx(_Fragment, {})] }));
};
export const InfoPending = () => {
    return (_jsxs("div", { class: 'grid px-4 py-2 border border-white/20 min-w-0', children: [_jsx(AsyncText, { class: 'text-sm', placeholderLength: 8 }), _jsx(AsyncText, { placeholderLength: 40 })] }));
};
export const InfoError = (props) => {
    const { displayText, message } = props;
    return (_jsxs("div", { class: 'grid grid-cols-[1fr,auto] items-center px-4 py-2 border border-white/20 min-w-0', children: [_jsxs("div", { children: [_jsx("div", { class: 'overflow-hidden text-ellipsis whitespace-nowrap', children: displayText }), _jsx("div", { class: 'text-sm text-white/50', children: "Hover over the icon for more information." })] }), _jsx("div", { title: message, children: _jsx(Icon.Info, {}) })] }));
};
//# sourceMappingURL=Info.js.map