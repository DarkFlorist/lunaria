import { signal } from '@preact/signals'
import { ethers } from 'ethers'
import { assertsWithEthereum } from '../library/ethereum'
import { Notice, useNotice } from './notice'

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

const getBrowserProvider = (chainHex?: string) => {
	assertsWithEthereum(window)
	const newNetwork = chainHex ? ethers.providers.getNetwork(chainHex) : undefined
	provider.value = new ethers.providers.Web3Provider(window.ethereum, newNetwork)
	return provider.value
}

const chainChangedObserver = createChainChangeListener(getBrowserProvider)

export function useProviders() {
	return {
		// only initialize provider when called, avoid calling this function on page load
		get browserProvider() {
			const { notices } = useNotice()

			if (provider.value !== undefined) return provider.value

			try {
				chainChangedObserver.subscribe()
				return getBrowserProvider()
			} catch (error) {
				const message = error instanceof Error ? error.message : 'An unknown error occurred.'
				const notice: Notice = {
					id: notices.value.length + 1,
					title: 'Important',
					message,
				}
				notices.value = [...notices.value, notice]
				throw message
			}
		},
	}
}
