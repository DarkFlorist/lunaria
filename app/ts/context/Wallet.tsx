import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { BrowserProvider, Network } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { assertsEthereumObservable, assertsWithEthereum } from '../library/ethereum.js'
import { AsyncProperty } from '../library/preact-utilities.js'
import { BigIntHex, EthereumAddress, HexString } from '../schema.js'

type WalletContext = {
	browserProvider: BrowserProvider
	network: Signal<AsyncProperty<Network>>
	account: Signal<AsyncProperty<EthereumAddress>>
}

export const WalletContext = createContext<WalletContext | undefined>(undefined)
export const WalletProvider = ({ children }: { children: ComponentChildren }) => {
	const provider = useSignal<BrowserProvider | undefined>(undefined)
	const network = useSignal<AsyncProperty<Network>>({ state: 'inactive' })
	const account = useSignal<AsyncProperty<EthereumAddress>>({ state: 'inactive' })

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
		get browserProvider() {
			if (!provider.value) throw new Error('No compatible web3 wallet detected.')
			return provider.value
		},
		account,
		network,
	}

	const updateAsyncAccount = ([newAddress]: (string | undefined)[]) => {
		account.value = newAddress ? { state: 'resolved', value: EthereumAddress.parse(newAddress) } : { state: 'inactive' }
	}

	const listenToWalletsAccountChange = () => {
		assertsWithEthereum(window)
		assertsEthereumObservable(window.ethereum)
		window.ethereum.on('accountsChanged', updateAsyncAccount)
	}

	const listenToAccountChange = () => {
		if (account.value.state !== 'resolved') return
		listenToWalletsAccountChange()
	}

	useSignalEffect(listenToBrowserProviderChange)
	useSignalEffect(listenToAccountChange)
	useEffect(() => void updateBrowserProvider(), [])

	return <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
}

export function useWallet() {
	const context = useContext(WalletContext)
	if (context === undefined) throw new Error('useWallet can only be used within children of WalletProvider')
	return context
}
