import { JSX } from 'preact/jsx-runtime';
type Props = {
    label: string;
    placeholder?: string;
    value: string;
    onInput: (address: string) => void;
    onClear: () => void;
    disabled?: boolean;
};
export declare const AddressField: (props: Props) => JSX.Element;
export {};
//# sourceMappingURL=AddressField.d.ts.map