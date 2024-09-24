import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect } from 'preact/hooks';
export const Modal = ({ onClose, children, hasCloseButton, title, onClickOutside }) => {
    useEffect(() => {
        // prevent page scroll when model is open
        document.body.style.overflow = 'hidden';
        return () => (document.body.style.overflow = 'auto');
    }, []);
    return (_jsxs("div", { class: 'fixed inset-0 z-50 overflow-y-auto py-20', children: [_jsx("div", { class: 'fixed inset-0 bg-black/60 backdrop-blur-sm', onClick: onClickOutside }), _jsxs("div", { class: 'relative bg-white/10 w-11/12 max-w-lg mx-auto z-50 shadow-lg text-white', children: [_jsxs("div", { class: 'items-center justify-between border-b border-b-white/10 grid grid-cols-[1fr_auto]', children: [title ? _jsx("div", { class: 'px-4 h-12 flex items-center', children: title }) : _jsx(_Fragment, {}), hasCloseButton ? (_jsx("button", { class: 'h-12 w-12 text-2xl', onClick: onClose, children: "\u00D7" })) : (_jsx(_Fragment, {}))] }), _jsx("div", { class: 'p-4', children: children })] })] }));
};
export default Modal;
//# sourceMappingURL=Modal.js.map