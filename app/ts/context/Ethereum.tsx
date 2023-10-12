import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect, useRef } from 'preact/hooks'
import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { BrowserProvider, Network } from 'ethers'
import { isEthereumProvider, withEip1193Provider } from '../library/ethereum.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { BigIntHex } from '../schema.js'

type EthereumProviderContext = {
	browserProvider: Signal<BrowserProvider | undefined>
	network: Signal<AsyncProperty<Network>>
	blockNumber: Signal<number | undefined>
}

export const EthereumProviderContext = createContext<EthereumProviderContext | undefined>(undefined)
export const EthereumProvider = ({ children }: { children: ComponentChildren }) => {
	const browserProvider = useSignal<BrowserProvider | undefined>(undefined)
	const network = useSignal<AsyncProperty<Network>>({ state: 'inactive' })
	const blockNumber = useSignal<number | undefined>(undefined)

	return (
		<EthereumProviderContext.Provider value={{ browserProvider, network, blockNumber }}>
			<BrowserProviderUpdater />
			<BlockUpdater />
			<NetworkUpdater />
			<>{children}</>
		</EthereumProviderContext.Provider>
	)
}

export function useEthereumProvider() {
	const context = useContext(EthereumProviderContext)
	if (context === undefined) throw new Error('useEthereumProvider can only be used within children of EthereumProvider')
	return context
}

const BrowserProviderUpdater = () => {
	const { browserProvider } = useEthereumProvider()

	const setBrowserProvider = (chainIdHex?: string) => {
		if (!withEip1193Provider(window)) return
		const chainId = chainIdHex ? BigIntHex.parse(chainIdHex) : undefined
		browserProvider.value = new BrowserProvider(window.ethereum, chainId)
	}

	const addChainChangeListener = () => {
		if (!withEip1193Provider(window)) return
		if (!isEthereumProvider(window.ethereum)) return
		window.ethereum.on('chainChanged', setBrowserProvider)
	}

	useEffect(() => {
		setBrowserProvider()
		addChainChangeListener()
	}, [])

	return <></>
}

const BlockUpdater = () => {
	const { browserProvider, blockNumber } = useEthereumProvider()
	const { value: query, waitFor } = useAsyncState<number>()
	const previousProvider = useRef<BrowserProvider | undefined>(undefined)

	const updateBlock = (newBlockNumber: number) => blockNumber.value = newBlockNumber

	const addBlockListener = async (provider: BrowserProvider) => {
		if (previousProvider.current) previousProvider.current.removeListener('block', updateBlock)
		previousProvider.current = await provider.on('block', updateBlock)
	}

	const providerChangeEffect = () => {
		if (!browserProvider.value) return
		const provider = browserProvider.value
		waitFor(async () => await provider.getBlockNumber())
		addBlockListener(provider)
	}

	const queryChangeEffect = () => {
		if (query.value.state !== 'resolved') return
		blockNumber.value = query.value.value
	}

	useSignalEffect(providerChangeEffect)
	useSignalEffect(queryChangeEffect)

	return <></>
}

const NetworkUpdater = () => {
	const { browserProvider, network } = useEthereumProvider()
	const { value: query, waitFor } = useAsyncState<Network>()

	const providerChangeEffect = () => {
		if (!browserProvider.value) return
		const provider = browserProvider.value
		waitFor(async () => provider.getNetwork())
	}

	const queryChangeEffect = () => {
		network.value = query.value
	}

	useSignalEffect(providerChangeEffect)
	useSignalEffect(queryChangeEffect)

	return <></>
}
