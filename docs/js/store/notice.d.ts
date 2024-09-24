export type Notice = {
    id: number;
    title: string;
    message: string;
};
export declare function useNotice(): {
    notices: import("@preact/signals-core").Signal<Notice[]>;
    notify: (notice: Omit<Notice, 'id'>) => void;
};
//# sourceMappingURL=notice.d.ts.map