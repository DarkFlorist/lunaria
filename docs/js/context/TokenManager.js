import { jsx as _jsx } from "preact/jsx-runtime";
import { useSignal } from '@preact/signals';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { createCacheParser, TokensCacheSchema } from '../schema.js';
import { DEFAULT_TOKENS, KNOWN_TOKENS_CACHE_KEY } from '../library/constants.js';
import { persistSignalEffect } from '../library/persistent-signal.js';
export const TokenManagerContext = createContext(undefined);
export const TokenManagerProvider = ({ children }) => {
    const query = useSignal('');
    const stage = useSignal(undefined);
    const cache = useSignal({ data: DEFAULT_TOKENS, version: '1.0.0' });
    persistSignalEffect(KNOWN_TOKENS_CACHE_KEY, cache, createCacheParser(TokensCacheSchema));
    return _jsx(TokenManagerContext.Provider, { value: { cache, query, stage }, children: children });
};
export function useTokenManager() {
    const context = useContext(TokenManagerContext);
    if (context === undefined)
        throw new Error('useTokenManager can only be used within children of TokenManagerProvider');
    return context;
}
//# sourceMappingURL=TokenManager.js.map