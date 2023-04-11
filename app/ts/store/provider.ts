import { signal } from '@preact/signals'
import { ethers } from 'ethers'
import { assertsWithEthereum } from '../library/ethereum.js'
import { useNotice } from './notice.js'
import { WalletError } from '../library/exceptions.js'

const provider = signal<ethers.providers.Web3Provider | undefined>(undefined)

const createChainChangeListener = (handler: (chainHex?: string) => void) => {
	return {
		subscribe: () => {
			assertsWithEthereum(window)
			window.ethereum.addListener('chainChanged', handler)
		},
		unsubscribe: () => {
			assertsWithEthereum(window)
			window.ethereum.removeListener('chainChanged', handler)
		},
	}
}

const createEthersProvider = (chainHex?: string) => {
	assertsWithEthereum(window)
	const newNetwork = chainHex ? ethers.providers.getNetwork(chainHex) : undefined

	// set browserprovider
	provider.value = new ethers.providers.Web3Provider(window.ethereum, newNetwork)
	return provider.value
}

const chainChangedObserver = createChainChangeListener(createEthersProvider)

export function useProviders() {
	const { notify } = useNotice()

	const getbrowserProvider = () => {
		if (provider.value !== undefined) return provider.value

		try {
			const provider = createEthersProvider()
			chainChangedObserver.subscribe()
			return provider
		} catch (error) {
			if (error instanceof WalletError) {
				notify({ title: 'Important', message: error.message })
				throw error
			}

			const errorMessage = typeof error === 'string' ? error : error instanceof Error ? error.message : 'An unknown error occurred.'
			notify({ title: 'Important', message: errorMessage })
			throw new Error(errorMessage)
		}
	}

	return {
		browserProvider: provider.value,
		getbrowserProvider,
	}
}
