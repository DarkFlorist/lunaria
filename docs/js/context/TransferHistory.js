import { jsx as _jsx } from "preact/jsx-runtime";
import { useSignal } from '@preact/signals';
import * as funtypes from 'funtypes';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { RECENT_TRANSFERS_CACHE_KEY } from '../library/constants.js';
import { persistSignalEffect } from '../library/persistent-signal.js';
import { createCacheParser, TransferSchema } from '../schema.js';
export const TransferHistoryCacheSchema = funtypes.Union(funtypes.Object({
    data: funtypes.Array(TransferSchema),
    version: funtypes.Literal('1.0.0'),
}));
const TransferHistoryContext = createContext(undefined);
export const TransferHistoryProvider = ({ children }) => {
    const transfers = useSignal({ data: [], version: '1.0.0' });
    persistSignalEffect(RECENT_TRANSFERS_CACHE_KEY, transfers, createCacheParser(TransferHistoryCacheSchema));
    return _jsx(TransferHistoryContext.Provider, { value: transfers, children: children });
};
export function useTransferHistory() {
    const context = useContext(TransferHistoryContext);
    if (context === undefined)
        throw new Error('useTransferHistory can only be used within children of TransferHistoryProvider');
    return context;
}
//# sourceMappingURL=TransferHistory.js.map