import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { assertsEthereumObservable, assertsExternalProvider } from '../library/utilities.js'
import { Network, Web3Provider } from '../types.js'

type EthereumProvider =
	| {
			provider: undefined
			setWindowEthereumProvider: () => Web3Provider
	  }
	| {
			provider: Web3Provider
	  }

export type ProviderStore = Signal<EthereumProvider>
const EthereumContext = createContext<ProviderStore | undefined>(undefined)

type EthereumProviderProps = {
	children: ComponentChildren
}

export const EthereumProvider = ({ children }: EthereumProviderProps) => {
	const providerStore = createEthereumProviderStore()
	return <EthereumContext.Provider value={providerStore}>{children}</EthereumContext.Provider>
}

export function useEthereumProvider() {
	const context = useContext(EthereumContext)
	if (context === undefined) throw new Error('useEthereumContext can only be used within a child of EthereumProvider')
	return context
}

function createEthereumProviderStore() {
	const setWindowEthereumProvider = (chainId?: string) => {
		assertsExternalProvider(window.ethereum)
		const networkId = chainId ? parseInt(chainId) : undefined
		const provider = new ethers.providers.Web3Provider(window.ethereum, networkId)
		providerStore.value = { provider }
		return provider
	}

	const providerStore = useSignal<EthereumProvider>({ provider: undefined, setWindowEthereumProvider })

	const listenForChainChange = () => {
		const provider = providerStore.value.provider
		if (provider === undefined) return
		assertsEthereumObservable(provider.provider)
		provider.provider.on('chainChanged', setWindowEthereumProvider)
	}

	useSignalEffect(listenForChainChange)

	return providerStore
}

export function useEthereumNetwork() {
	const network = useSignal<Network | undefined>(undefined)
	const ethProvider = useEthereumProvider()

	const getNetwork = async (provider: Web3Provider | undefined) => {
		if (!provider) return
		network.value = await provider.getNetwork()
	}

	useSignalEffect(() => {
		getNetwork(ethProvider.value.provider)
	})

	return network
}
