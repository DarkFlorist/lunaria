import { effect, signal } from '@preact/signals'
import { assertsWithEthereum } from '../library/ethereum.js'
import { WalletError } from '../library/exceptions.js'
import { BrowserProvider } from 'ethers'

const provider = signal<BrowserProvider | undefined>(undefined)

export function useProviders() {
	const getbrowserProvider = () => {
		if (provider.value !== undefined) return provider.value

		try {
			assertsWithEthereum(window)
			provider.value = new BrowserProvider(window.ethereum)
			return provider.value
		} catch (error) {
			if (error instanceof WalletError) {
				throw error
			}

			const errorMessage = typeof error === 'string' ? error : error instanceof Error ? error.message : 'An unknown error occurred.'
			throw new Error(errorMessage)
		}
	}

	return {
		browserProvider: provider,
		getbrowserProvider,
	}
}

const handleChainChange = async () => {
	removeChainChangeListener()

	// reinitialize provider
	assertsWithEthereum(window)
	provider.value = new BrowserProvider(window.ethereum)
}

const removeChainChangeListener = effect(() => {
	if (provider.value === undefined) return
	assertsWithEthereum(window)
	window.ethereum.on('chainChanged', handleChainChange)
})
