import { signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import * as funtypes from 'funtypes'
import { useAccount } from './account.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { useProviders } from './provider.js'
import { useNetwork } from './network.js'
import { Contract, isAddress } from 'ethers'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { JSONParse, JSONStringify } from '../library/utilities.js'
import { DEFAULT_TOKENS, MANAGED_TOKENS_CACHE_KEY } from '../library/constants.js'
import { persistSignalEffect } from '../library/persistent-signal.js'
import { ManagedTokensCacheParserConfig, TokenSchema } from '../schema.js'

const CACHEID_PREFIX = '_ut'

const tokens = signal<TokenMeta[]>([])

export function useAccountTokens() {
	const { address } = useAccount()

	const cacheKey = useComputed(() => {
		if (address.value.state !== 'resolved') return `${CACHEID_PREFIX}:default`
		return `${CACHEID_PREFIX}:${address.value.value}`
	})

	const addToken = (token: TokenMeta) => {
		tokens.value = [...tokens.value, token]
	}

	const removeToken = (address: TokenMeta['address']) => {
		tokens.value = [...tokens.value.filter(token => token.address !== address)]
	}

	const listenForCacheKeyChange = () => {
		const tokensCache = useTokensCache(cacheKey.value)
		if (tokensCache.error !== undefined) throw new Error('Cache data could not be read.')
		tokens.value = tokensCache.data
	}

	const listenForTokensChange = () => {
		if (cacheKey.value === `${CACHEID_PREFIX}:default`) return
		const newCache = JSONStringify(tokens.value)
		localStorage.setItem(cacheKey.value, newCache)
	}

	useSignalEffect(listenForCacheKeyChange)
	useSignalEffect(listenForTokensChange)

	return {
		tokens,
		addToken,
		removeToken,
	}
}

export function useTokenQuery() {
	const { value: query, waitFor, reset } = useAsyncState<TokenMeta>()
	const providers = useProviders()
	const { network } = useNetwork()
	const tokenAddress = useSignal('')

	const validateChangedAddress = () => {
		reset()

		// check address validity
		if (!isAddress(tokenAddress.value)) return

		waitFor(async () => {
			if (network.value.state !== 'resolved') {
				throw new Error('Disconnected')
			}

			const chainId = network.value.value.chainId

			try {
				const contract = new Contract(tokenAddress.value, ERC20ABI, providers.browserProvider)
				const name = await contract.name()
				const symbol = await contract.symbol()
				const decimals = await contract.decimals()
				return { chainId, name, symbol, decimals, address: tokenAddress.value } as const
			} catch (unknownError) {
				throw new Error('Contract call failed')
			}
		})
	}

	useSignalEffect(validateChangedAddress)

	return { query, tokenAddress }
}

// Move to constants later
export type TokenMeta = {
	chainId: bigint
	name: string
	address: string
	symbol: string
	decimals: bigint
}

function isTokenMeta(meta: object): meta is TokenMeta {
	return 'chainId' in meta && typeof meta.chainId === 'bigint' && 'address' in meta && typeof meta.address === 'string' && 'name' in meta && typeof meta.name === 'string' && 'symbol' in meta && typeof meta.symbol === 'string' && 'decimals' in meta && typeof meta.decimals === 'bigint'
}

export function useTokensCache(cacheKey: string) {
	const tokensCache = localStorage.getItem(cacheKey)

	if (tokensCache === null) {
		return { data: DEFAULT_TOKENS }
	}

	try {
		let tokens = []
		const parsed = JSONParse(tokensCache)
		if (!Array.isArray(parsed)) throw new Error()

		for (const item of parsed) {
			if (!isTokenMeta(item)) continue
			tokens.push(item)
		}

		return { data: tokens }
	} catch (unknownError) {
		let error = new Error('An unknown error has occured.')
		if (unknownError instanceof Error) error = unknownError
		if (typeof unknownError === 'string') error = new Error(unknownError)
		return { error }
	}
}

export function useTokenBalance() {
	const providers = useProviders()
	const { value: tokenBalance, waitFor } = useAsyncState<bigint>()

	const getTokenBalance = (accountAddress: string, tokenAddress: string) => {
		waitFor(async () => {
			const contract = new Contract(tokenAddress, ERC20ABI, providers.browserProvider)
			return await contract.balanceOf(accountAddress)
		})
	}

	return { tokenBalance, getTokenBalance }
}

export type Token = funtypes.Static<typeof TokenSchema>

const managedTokens = signal<Token[]>(DEFAULT_TOKENS)
const cacheKey = signal(MANAGED_TOKENS_CACHE_KEY)

export function useManagedTokens() {
	persistSignalEffect(cacheKey.value, managedTokens, ManagedTokensCacheParserConfig)
	return { tokens: managedTokens, cacheKey }
}
