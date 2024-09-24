import { Signal, useSignal } from '@preact/signals'
import * as funtypes from 'funtypes'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { RECENT_TRANSFERS_CACHE_KEY } from '../library/constants.js'
import { persistSignalEffect } from '../library/persistent-signal.js'
import { createCacheParser, TransferSchema } from '../schema.js'

export const TransferHistoryCacheSchema = funtypes.Union(
	funtypes.Object({
		data: funtypes.Array(TransferSchema),
		version: funtypes.Literal('1.0.0'),
	}),
)

export type TransferHistory = funtypes.Static<typeof TransferHistoryCacheSchema>

const TransferHistoryContext = createContext<Signal<TransferHistory> | undefined>(undefined)

export const TransferHistoryProvider = ({ children }: { children: ComponentChildren }) => {
	const transfers = useSignal<TransferHistory>({ data: [], version: '1.0.0' })

	persistSignalEffect(RECENT_TRANSFERS_CACHE_KEY, transfers, createCacheParser(TransferHistoryCacheSchema))

	return <TransferHistoryContext.Provider value={transfers}>{children}</TransferHistoryContext.Provider>
}

export function useTransferHistory() {
	const context = useContext(TransferHistoryContext)
	if (context === undefined) throw new Error('useTransferHistory can only be used within children of TransferHistoryProvider')
	return context
}
