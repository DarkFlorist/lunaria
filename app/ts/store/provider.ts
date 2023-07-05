import { effect, signal, useComputed } from '@preact/signals'
import { assertsEthereumObservable, assertsWithEthereum } from '../library/ethereum.js'
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
		} catch (exception) {
			let errorMessage = 'An unknown error occurred.'
			if (exception instanceof WalletError) errorMessage = exception.message
			if (typeof exception === 'string') errorMessage = exception
			throw new Error(errorMessage)
		}
	}

	const browserProvider = useComputed(getbrowserProvider)

	return { provider, browserProvider }
}

const handleChainChange = async () => {
	removeChainChangeListener()

	// reinitialize provider
	assertsWithEthereum(window)
	provider.value = new BrowserProvider(window.ethereum)
}

const removeChainChangeListener = effect(() => {
	if (provider.value === undefined) return
	assertsEthereumObservable(window.ethereum)
	window.ethereum.on('chainChanged', handleChainChange)
})
