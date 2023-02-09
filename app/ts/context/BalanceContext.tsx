import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { BigNumber } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { useEthereumProvider } from '../components/EthereumProvider.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { assertUnreachable, isEthereumObservable } from '../library/utilities.js'
import { AccountStore } from '../store/account.js'
import { Web3Provider } from '../types.js'

type Balance =
	| {
			state: 'unavailable'
	  }
	| {
			state: 'disconnected'
			connect: () => void
	  }
	| {
			state: 'connected'
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

type BlockChangeObserver = {
	removeListener: () => Web3Provider
}

export type BalanceStore = Signal<Balance>
export function createBalanceStore(accountStore: AccountStore) {
	const blockListener = useSignal<BlockChangeObserver | undefined>(undefined)
	const { value: query, waitFor, reset } = useAsyncState<BigNumber>()
	const ethereumProvider = useEthereumProvider()

	const checkBalance = (address: string) => {
		reset()
		waitFor(async () => {
			return await ethereumProvider.getBalance(address)
		})
	}

	const connect = () => {
		if (accountStore.value.state !== 'disconnected') return
		return accountStore.value.connect()
	}

	const balanceStore = useSignal<Balance>({ state: 'disconnected' as const, connect })

	const createBlockListener = (handler: () => void) => {
		if (!isEthereumObservable(ethereumProvider.provider)) return
		const listener = ethereumProvider.on('block', handler)
		const removeListener = () => listener.off('block', handler)
		// run handler after create
		handler()
		return { removeListener }
	}

	const listenForAsyncStateChanges = () => {
		if (accountStore.value.state !== 'connected') return

		switch (query.value.state) {
			case 'inactive':
				balanceStore.value = { state: 'connected' as const }
				break
			case 'pending':
				balanceStore.value = { state: 'updating' as const, reset }
				break
			case 'rejected':
				balanceStore.value = { state: 'failed' as const, error: query.value.error, reset }
				break
			case 'resolved':
				balanceStore.value = { state: 'updated' as const, balance: query.value.value, updated_at: new Date() }
				break
			default:
				assertUnreachable(query.value)
		}
	}

	const listenForAccountChange = () => {
		switch (accountStore.value.state) {
			case 'disconnected':
				// remove previous periodical balance check
				if (blockListener.value !== undefined) blockListener.value.removeListener()
				balanceStore.value = { state: 'disconnected', connect: accountStore.value.connect }
				break
			case 'connecting':
				balanceStore.value = { state: 'updating' as const, reset }
				break
			case 'connected':
				blockListener.value = createBlockListener(checkBalance.bind(null, accountStore.value.address))
				break
			case 'failed':
				balanceStore.value = { state: 'unavailable' }
				break
			default:
				assertUnreachable(accountStore.value)
		}
	}

	// listen for account store signal
	useSignalEffect(listenForAccountChange)

	// listen for async state
	useSignalEffect(listenForAsyncStateChanges)

	return balanceStore
}

const BalanceContext = createContext<BalanceStore | undefined>(undefined)

type BalanceProviderProps = {
	children: ComponentChildren
	accountStore: AccountStore
}

export const BalanceProvider = ({ children, accountStore }: BalanceProviderProps) => {
	const store = createBalanceStore(accountStore)
	return <BalanceContext.Provider value={store}>{children}</BalanceContext.Provider>
}

export function useBalanceStore() {
	const context = useContext(BalanceContext)
	if (context === undefined) throw new Error('useBalanceStore can only be used within a child of BalanceProvider')
	return context
}
