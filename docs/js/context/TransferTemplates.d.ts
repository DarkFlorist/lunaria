import { Signal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { TemplatesCache, TransferTemplate } from '../schema.js';
export type TemplatesContext = {
    cache: Signal<TemplatesCache>;
};
export declare const TemplatesContext: import("preact").Context<TemplatesContext | undefined>;
export declare const TemplatesProvider: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare function useTemplates(): {
    cache: Signal<{
        data: ({
            contractAddress: `0x${string}` | undefined;
            from: `0x${string}`;
            to: `0x${string}`;
            quantity: bigint;
        } & {
            label: string | undefined;
        })[];
        version: "1.0.0";
    }>;
    add: (newTemplate: TransferTemplate) => void;
};
//# sourceMappingURL=TransferTemplates.d.ts.map