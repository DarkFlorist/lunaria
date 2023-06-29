import { signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { useAccount } from './account.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { useProviders } from './provider.js'
import { useNetwork } from './network.js'
import { Contract, isAddress } from 'ethers'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { JSONParse, JSONStringify } from '../library/utilities.js'

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
				const provider = providers.browserProvider.value
				const contract = new Contract(tokenAddress.value, ERC20ABI, provider)
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
	decimals: number
}

export const DEFAULT_TOKENS: TokenMeta[] = [
	{
		chainId: 1n,
		address: '0x4c9BBFc1FbD93dFB509E718400978fbEedf590E9',
		name: 'Rai Reflex Index',
		symbol: 'RAI',
		decimals: 18,
	},
	{
		chainId: 1n,
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		name: 'Dai',
		symbol: 'DAI',
		decimals: 18,
	},
	{
		chainId: 1n,
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		name: 'Wrapped Ether',
		symbol: 'WETH',
		decimals: 18,
	},
	{
		chainId: 1n,
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
	},
	{
		chainId: 1n,
		address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
		name: 'Wrapped Bitcoin',
		symbol: 'WBTC',
		decimals: 8,
	},
	{
		chainId: 5n,
		address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		name: 'Wrapped Ether',
		symbol: 'WETH',
		decimals: 18,
	},
	{
		chainId: 5n,
		address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
	},
]

function isTokenMeta(meta: object): meta is TokenMeta {
	return 'chainId' in meta && typeof meta.chainId === 'bigint' && 'address' in meta && typeof meta.address === 'string' && 'name' in meta && typeof meta.name === 'string' && 'symbol' in meta && typeof meta.symbol === 'string' && 'decimals' in meta && typeof meta.decimals === 'number'
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
			const provider = providers.browserProvider.value
			const contract = new Contract(tokenAddress, ERC20ABI, provider)
			return await contract.balanceOf(accountAddress)
		})
	}

	return { tokenBalance, getTokenBalance }
}
