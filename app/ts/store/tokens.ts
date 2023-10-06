import { signal, useSignal, useSignalEffect } from '@preact/signals'
import * as funtypes from 'funtypes'
import { useAsyncState } from '../library/preact-utilities.js'
import { useProviders } from './provider.js'
import { useNetwork } from './network.js'
import { Contract, isAddress } from 'ethers'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { DEFAULT_TOKENS, MANAGED_TOKENS_CACHE_KEY } from '../library/constants.js'
import { persistSignalEffect } from '../library/persistent-signal.js'
import { createCacheParser, EthereumAddress, ERC20Token } from '../schema.js'

export function useTokenQuery() {
	const { value: query, waitFor, reset } = useAsyncState<ERC20Token>()
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
				const address = EthereumAddress.parse(tokenAddress.value)
				return { chainId, name, symbol, decimals, address } as const
			} catch (unknownError) {
				throw new Error('Contract call failed')
			}
		})
	}

	useSignalEffect(validateChangedAddress)

	return { query, tokenAddress }
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

const ManagedTokensSchema = funtypes.Array(ERC20Token)
const managedTokens = signal<ERC20Token[]>(DEFAULT_TOKENS)
const managedTokensCacheKey = signal(MANAGED_TOKENS_CACHE_KEY)

export function useManagedTokens() {
	persistSignalEffect(managedTokensCacheKey.value, managedTokens, createCacheParser(ManagedTokensSchema))
	return { tokens: managedTokens, cacheKey: managedTokensCacheKey }
}
