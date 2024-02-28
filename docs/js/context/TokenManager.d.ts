import { Signal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { TokensCache } from '../schema.js';
export type TokenManagerContext = {
    cache: Signal<TokensCache>;
    query: Signal<string>;
    stage: Signal<'select' | 'add' | undefined>;
};
export declare const TokenManagerContext: import("preact").Context<TokenManagerContext | undefined>;
export declare const TokenManagerProvider: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare function useTokenManager(): TokenManagerContext;
//# sourceMappingURL=TokenManager.d.ts.map