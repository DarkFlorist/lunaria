import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { BrowserProvider, Network } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { assertsEthereumObservable, assertsWithEthereum } from '../library/ethereum.js'
import { AsyncProperty } from '../library/preact-utilities.js'
import { BigIntHex, HexString } from '../schema.js'

type WalletContext = {
	browserProvider: BrowserProvider | undefined
	network: Signal<AsyncProperty<Network>>
}

export const WalletContext = createContext<WalletContext | undefined>(undefined)
export const WalletProvider = ({ children }: { children: ComponentChildren }) => {
	const provider = useSignal<BrowserProvider | undefined>(undefined)
	const network = useSignal<AsyncProperty<Network>>({ state: 'inactive' })

	const updateBrowserProvider = async (chainIdHex?: HexString) => {
		assertsWithEthereum(window)
		const chainId = chainIdHex ? BigIntHex.parse(chainIdHex) : undefined
		provider.value = new BrowserProvider(window.ethereum, chainId)
		const newNetwork = await provider.value.getNetwork()
		network.value = { state: 'resolved', value: newNetwork }
	}

	const listenToWalletsChainChange = () => {
		assertsWithEthereum(window)
		assertsEthereumObservable(window.ethereum)
		window.ethereum.on('chainChanged', updateBrowserProvider)
	}

	const listenToBrowserProviderChange = () => {
		if (provider.value === undefined) return
		listenToWalletsChainChange()
	}

	const context = {
		browserProvider: provider.value,
		network,
	}

	useSignalEffect(listenToBrowserProviderChange)
	useEffect(() => void updateBrowserProvider(), [])

	return <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
}

export function useWallet() {
	const context = useContext(WalletContext)
	if (context === undefined) throw new Error('useWallet can only be used within children of WalletProvider')
	return context
}
