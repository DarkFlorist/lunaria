import { Signal, useSignal } from '@preact/signals'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import * as funtypes from 'funtypes'
import { createCacheParser, EthereumAddress, TokenContract } from '../schema.js'
import { DEFAULT_TOKENS, MANAGED_TOKENS_CACHE_KEY } from '../library/constants.js'
import { persistSignalEffect } from '../library/persistent-signal.js'
import { useWallet } from './Wallet.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { Contract } from 'ethers'
import { ERC20ABI } from '../library/ERC20ABI.js'

type TokenManagerContext = {
	tokens: Signal<ManagedTokens>
	query: Signal<string>
	isSelecting: Signal<boolean>
}

export const TokenHolding = funtypes.Intersect(TokenContract, funtypes.Object({ holder: funtypes.Array(EthereumAddress) }))
export type TokenHolding = funtypes.Static<typeof TokenHolding>

export const ManagedTokensCacheSchema = funtypes.Union(
	funtypes.Object({
		data: funtypes.Array(TokenHolding),
		version: funtypes.Literal('1.0.0')
	})
)

export type ManagedTokens = funtypes.Static<typeof ManagedTokensCacheSchema>

export const TokenManagerContext = createContext<TokenManagerContext | undefined>(undefined)

const defaultData = DEFAULT_TOKENS.map(token => ({ ...token, holder: [] }))

export const TokenManagerProvider = ({ children }: { children: ComponentChildren }) => {
	const query = useSignal('')
	const isSelecting = useSignal(false)
	const tokens = useSignal<ManagedTokens>({ data: defaultData, version: '1.0.0' })

	persistSignalEffect(MANAGED_TOKENS_CACHE_KEY, tokens, createCacheParser(ManagedTokensCacheSchema))

	return <TokenManagerContext.Provider value={{ tokens, query, isSelecting }}>{children}</TokenManagerContext.Provider>
}

export function useTokenManager() {
	const context = useContext(TokenManagerContext)
	if (context === undefined) throw new Error('useTokenManager can only be used within children of TokenManagerProvider')
	return context
}

export function useTokenBalance() {
	const { browserProvider }  = useWallet()
	const { value: tokenBalance, waitFor } = useAsyncState<bigint>()

	const getTokenBalance = (accountAddress: string, tokenAddress: string) => {
		waitFor(async () => {
			const contract = new Contract(tokenAddress, ERC20ABI, browserProvider)
			return await contract.balanceOf(accountAddress)
		})
	}

	return { tokenBalance, getTokenBalance }
}
