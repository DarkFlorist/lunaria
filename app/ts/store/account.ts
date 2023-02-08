import { effect, Signal, useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider, isEthereumObservable } from '../library/utilities.js'

export type ConnectMutation = {
	transport: Signal<AsyncProperty<string>>
	dispatch: () => void
	reset: () => void
}

export type ReconnectMutation = {
	transport: Signal<AsyncProperty<unknown>>
	dispatch: () => void
	reset: () => void
}

type Account =
	| {
			isConnected: false
			connectMutation: ConnectMutation
			reconnectMutation: ReconnectMutation
	  }
	| {
			isConnected: true
			address: string
	  }

export type AccountStore = Signal<Account>
export function createAccountStore() {
	const { value: asyncValue, waitFor, reset } = useAsyncState<string>()
	const reconnect = useAsyncState()

	const reconnectMutation = {
		transport: reconnect.value,
		dispatch: () => {
			reconnect.waitFor(async () => {
				try {
					assertsExternalProvider(window.ethereum)
					const provider = new ethers.providers.Web3Provider(window.ethereum)
					const signer = provider.getSigner()
					const address = await signer.getAddress()
					accountStore.value = { isConnected: true, address }
				} catch {
					accountStore.value = accountDefaults
				}
			})
		},
		reset: reconnect.reset,
	}

	const connectMutation = {
		transport: asyncValue,
		dispatch: () => waitFor(async () => {
			assertsExternalProvider(window.ethereum)
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			await provider.send('eth_requestAccounts', [])
			const signer = provider.getSigner()
			const address = await signer.getAddress()
			accountStore.value = { isConnected: true, address }
			return address
		}),
		reset,
	}

	const accountDefaults = { isConnected: false as const, connectMutation, reconnectMutation }
	const accountStore = useSignal<Account>(accountDefaults)

	const handleAccountChange = (newAccount: string[]) => {
		if (ethers.utils.isAddress(newAccount[0])) {
			accountStore.value = { isConnected: true, address: newAccount[0] }
			return
		}

		reset()
		accountStore.value = accountDefaults
	}

	effect(() => {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		if (!isEthereumObservable(provider.provider)) return
		provider.provider.on('accountsChanged', handleAccountChange)
	})

	return accountStore
}
