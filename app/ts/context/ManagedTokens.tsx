import { Signal, useSignal } from '@preact/signals';
import * as funtypes from 'funtypes'
import { ComponentChildren, createContext } from "preact";
import { useContext } from 'preact/hooks';
import { DEFAULT_TOKENS, MANAGED_TOKENS_CACHE_KEY } from '../library/constants.js';
import { persistSignalEffect } from '../library/persistent-signal.js';
import { createCacheParser, TokenContract } from '../schema.js';

export const ManagedTokensCacheSchema = funtypes.Union(
	funtypes.Object({
		data: funtypes.Array(TokenContract),
		version: funtypes.Literal('1.0.0')
	})
)

export type ManagedTokens = funtypes.Static<typeof ManagedTokensCacheSchema>

const ManagedTokensContext = createContext<Signal<ManagedTokens> | undefined>(undefined)

export const ManagedTokensProvider = ({ children }: { children: ComponentChildren }) => {
	const tokens = useSignal<ManagedTokens>({ data: DEFAULT_TOKENS, version: '1.0.0' })

	persistSignalEffect(MANAGED_TOKENS_CACHE_KEY, tokens, createCacheParser(ManagedTokensCacheSchema))

	return (
		<ManagedTokensContext.Provider value={tokens}>{children}</ManagedTokensContext.Provider>
	)
}

export function useManagedTokens() {
	const context = useContext(ManagedTokensContext)
	if (context === undefined) throw new Error('useManagedTokens can only be used within children of ManagedTokensProvider')
	return context
}
