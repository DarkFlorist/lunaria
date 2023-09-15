import { Signal, useSignal } from '@preact/signals'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import * as funtypes from 'funtypes'
import { createCacheParser, TokenContract } from '../schema.js'
import { DEFAULT_TOKENS, MANAGED_TOKENS_CACHE_KEY } from '../library/constants.js'
import { persistSignalEffect } from '../library/persistent-signal.js'

type TokenManagerContext = {
	tokens: Signal<ManagedTokens>
	query: Signal<string>
	isSelecting: Signal<boolean>
}

export const ManagedTokensCacheSchema = funtypes.Union(
	funtypes.Object({
		data: funtypes.Array(TokenContract),
		version: funtypes.Literal('1.0.0')
	})
)

export type ManagedTokens = funtypes.Static<typeof ManagedTokensCacheSchema>

export const TokenManagerContext = createContext<TokenManagerContext | undefined>(undefined)

export const TokenManagerProvider = ({ children }: { children: ComponentChildren }) => {
	const query = useSignal('')
	const isSelecting = useSignal(false)
	const tokens = useSignal<ManagedTokens>({ data: DEFAULT_TOKENS, version: '1.0.0' })

	persistSignalEffect(MANAGED_TOKENS_CACHE_KEY, tokens, createCacheParser(ManagedTokensCacheSchema))

	return <TokenManagerContext.Provider value={{ tokens, query, isSelecting }}>{children}</TokenManagerContext.Provider>
}

export function useTokenManager() {
	const context = useContext(TokenManagerContext)
	if (context === undefined) throw new Error('useTokenManager can only be used within children of TokenManagerProvider')
	return context
}

