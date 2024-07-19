import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { createContext } from 'preact';
import { useSignal, useSignalEffect } from '@preact/signals';
import { useContext, useEffect } from 'preact/hooks';
import { useSignalRef } from '../library/preact-utilities.js';
const NotificationContext = createContext(undefined);
export const NotificationProvider = ({ children }) => {
    const notifications = useSignal([]);
    useSignalEffect(() => {
        if (!notifications.value.length)
            return;
    });
    return (_jsxs(NotificationContext.Provider, { value: { notifications }, children: [children, _jsx(NotificationCenter, {})] }));
};
export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context)
        throw new Error('useNotification can only be used within children of NotificationProvider');
    const notify = (Notification) => {
        const newNotice = { id: Date.now(), ...Notification };
        context.notifications.value = context.notifications.peek().concat([newNotice]);
    };
    const shift = () => {
        context.notifications.value.shift();
    };
    return { ...context, notify, shift };
}
const NotificationCenter = () => {
    const { ref, signal: dialogRef } = useSignalRef(null);
    const { notifications } = useNotification();
    useSignalEffect(() => {
        const dialogElement = dialogRef.value;
        if (!dialogElement)
            return;
        if (notifications.value.length) {
            dialogElement.show();
        }
        else {
            dialogElement.close();
        }
    });
    return (_jsx("dialog", { ref: ref, class: 'absolute bottom-4 bg-transparent', children: _jsx("div", { class: 'grid gap-y-2', children: notifications.value.map(notification => (_jsx(Notification, { notification: notification }))) }) }));
};
const Notification = ({ notification }) => {
    const { notifications } = useNotification();
    const { id, title, message, duration } = notification;
    const removeNotice = (id) => {
        notifications.value = notifications.peek().filter(n => n.id !== id);
    };
    useEffect(() => {
        setTimeout(() => removeNotice(id), duration || 3000);
    }, []);
    return (_jsxs("div", { class: 'bg-neutral-900 text-white grid grid-cols-[1fr,min-content]', children: [_jsxs("div", { class: 'px-4 py-3 ', children: [_jsx("div", { class: 'font-semibold', children: title }), _jsx("div", { class: 'text-sm text-white/50', children: message })] }), _jsx("button", { class: 'text-white/50 focus|hover:text-white w-10 h-10 flex items-center justify-center', onClick: () => removeNotice(id), children: "\u00D7" })] }));
};
//# sourceMappingURL=Notification.js.map