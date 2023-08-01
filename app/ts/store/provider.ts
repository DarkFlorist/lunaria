import { effect, signal } from '@preact/signals'
import { assertsEthereumObservable, assertsWithEthereum } from '../library/ethereum.js'
import { BrowserProvider } from 'ethers'

const provider = signal<BrowserProvider | undefined>(undefined)

export function useProviders() {
	return {
		get browserProvider() {
			assertsWithEthereum(window)
			return new BrowserProvider(window.ethereum)
		},
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
	assertsEthereumObservable(window.ethereum)
	window.ethereum.on('chainChanged', handleChainChange)
})
