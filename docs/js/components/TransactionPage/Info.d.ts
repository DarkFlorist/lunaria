import { JSX } from 'preact/jsx-runtime';
export type InfoProps = {
    label: string;
    value: string;
    prefix?: string;
    suffix?: string;
    allowCopy?: boolean;
    icon?: () => JSX.Element;
};
export declare const Info: (props: InfoProps) => JSX.Element;
export declare const InfoPending: () => JSX.Element;
type InfoError = {
    displayText: string;
    message: string;
};
export declare const InfoError: (props: InfoError) => JSX.Element;
export {};
//# sourceMappingURL=Info.d.ts.map