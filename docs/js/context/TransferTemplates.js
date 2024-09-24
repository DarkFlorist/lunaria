import { jsx as _jsx } from "preact/jsx-runtime";
import { useSignal } from '@preact/signals';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { TEMPLATES_CACHE_KEY } from '../library/constants.js';
import { persistSignalEffect } from '../library/persistent-signal.js';
import { createCacheParser, TemplatesCacheSchema } from '../schema.js';
export const TemplatesContext = createContext(undefined);
export const TemplatesProvider = ({ children }) => {
    const cache = useSignal({ data: [], version: '1.0.0' });
    persistSignalEffect(TEMPLATES_CACHE_KEY, cache, createCacheParser(TemplatesCacheSchema));
    return (_jsx(TemplatesContext.Provider, { value: { cache }, children: children }));
};
export function useTemplates() {
    const context = useContext(TemplatesContext);
    if (!context)
        throw new Error('useTransferTemplates can only be used within children of TransferTemplatesProfider');
    const { cache } = context;
    const add = (newTemplate) => {
        cache.value = { ...cache.peek(), data: [...cache.peek().data, newTemplate] };
    };
    return { cache, add };
}
//# sourceMappingURL=TransferTemplates.js.map