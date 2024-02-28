import { ComponentChildren } from 'preact';
import { Signal } from '@preact/signals';
type Notification = {
    id: number;
    message: string;
    title: string;
    duration?: number;
};
export declare const NotificationProvider: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare function useNotification(): {
    notify: (Notification: Omit<Notification, "id">) => void;
    shift: () => void;
    notifications: Signal<Notification[]>;
};
declare const Notification: ({ notification }: {
    notification: Notification;
}) => import("preact").JSX.Element;
export {};
//# sourceMappingURL=Notification.d.ts.map