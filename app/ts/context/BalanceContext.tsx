import { Signal, useSignal } from '@preact/signals'
import { BigNumber, ethers } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider, assertUnreachable, isEthereumObservable } from '../library/utilities.js'

type Balance =
	| {
			state: 'initial'
			checkBalance: () => void
	  }
	| {
			state: 'updating'
			reset: () => void
	  }
	| {
			state: 'updated'
			balance: BigNumber
			updated_at: Date
	  }
	| {
			state: 'failed'
			error: Error
			reset: () => void
	  }

export type BalanceStore = Signal<Balance>
export function createBalanceStore() {
	const { value: query, waitFor, reset } = useAsyncState<BigNumber>()

	const checkBalance = () => {
		waitFor(async () => {
			assertsExternalProvider(window.ethereum)
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			const address = await signer.getAddress()
			return await provider.getBalance(address)
		})
	}

	const balanceStoreDefaults = { state: 'initial' as const, checkBalance }
	const balanceStore = useSignal<Balance>(balanceStoreDefaults)

	const handleAccountChange = (newAccount: string[]) => {
		if (ethers.utils.isAddress(newAccount[0])) {
			checkBalance()
		}
	}

	const listenForAccountChanges = () => {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		if (!isEthereumObservable(provider.provider)) return
		provider.provider.on('accountsChanged', handleAccountChange)
	}

	switch (query.value.state) {
		case 'inactive':
			balanceStore.value = { state: 'initial' as const, checkBalance }
			break
		case 'pending':
			balanceStore.value = { state: 'updating' as const, reset }
			break
		case 'rejected':
			balanceStore.value = { state: 'failed' as const, error: query.value.error, reset }
			break
		case 'resolved':
			balanceStore.value = { state: 'updated' as const, balance: query.value.value, updated_at: new Date() }
			listenForAccountChanges()
			break
		default:
			assertUnreachable(query.value)
	}

	return balanceStore
}

const BalanceContext = createContext<BalanceStore | undefined>(undefined)

type BalanceProviderProps = {
	children: ComponentChildren
	store: BalanceStore
}

export const BalanceProvider = ({ children, store }: BalanceProviderProps) => {
	return <BalanceContext.Provider value={store}>{children}</BalanceContext.Provider>
}

export function useBalanceStore() {
	const context = useContext(BalanceContext)
	if (context === undefined) throw new Error('useBalanceStore can only be used within a child of BalanceProvider')
	return context
}
