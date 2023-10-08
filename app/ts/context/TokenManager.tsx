import { Signal, useSignal } from '@preact/signals'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { Contract } from 'ethers'
import { createCacheParser, TokensCache, TokensCacheSchema } from '../schema.js'
import { DEFAULT_TOKENS, KNOWN_TOKENS_CACHE_KEY } from '../library/constants.js'
import { persistSignalEffect } from '../library/persistent-signal.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { useWallet } from './Wallet.js'

export type TokenManagerContext = {
	cache: Signal<TokensCache>
	query: Signal<string>
	stage: Signal<'select' | 'add' | undefined>
}

export const TokenManagerContext = createContext<TokenManagerContext | undefined>(undefined)

export const TokenManagerProvider = ({ children }: { children: ComponentChildren }) => {
	const query = useSignal('')
	const stage = useSignal(undefined)
	const cache = useSignal<TokensCache>({ data: DEFAULT_TOKENS, version: '1.0.0' })

	persistSignalEffect(KNOWN_TOKENS_CACHE_KEY, cache, createCacheParser(TokensCacheSchema))

	return <TokenManagerContext.Provider value={{ cache, query, stage }}>{children}</TokenManagerContext.Provider>
}

export function useTokenManager() {
	const context = useContext(TokenManagerContext)
	if (context === undefined) throw new Error('useTokenManager can only be used within children of TokenManagerProvider')
	return context
}

export function useTokenBalance() {
	const { browserProvider } = useWallet()
	const { value: tokenBalance, waitFor } = useAsyncState<bigint>()

	const getTokenBalance = (accountAddress: string, tokenAddress: string) => {
		if (!browserProvider.value) return
		const provider = browserProvider.value
		waitFor(async () => {
			const contract = new Contract(tokenAddress, ERC20ABI, provider)
			return await contract.balanceOf(accountAddress)
		})
	}

	return { tokenBalance, getTokenBalance }
}
