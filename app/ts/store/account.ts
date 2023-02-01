import { Signal, useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { ConnectAttemptError } from '../library/exceptions.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider, assertUnreachable, isEthereumObservable } from '../library/utilities.js'

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
			state: 'disconnected'
			connect: (attemptOnly?: boolean) => void
	  }
	| {
			state: 'connecting'
			reset: () => void
	  }
	| {
			state: 'connected'
			address: string
	  }
	| {
			state: 'failed'
			error: Error
	  }

export type AccountStore = ReturnType<typeof createAccountStore>
export function createAccountStore() {
	const { value: query, waitFor, reset } = useAsyncState<string>()

	const connect = (attemptOnly?: boolean) =>
		waitFor(async () => {
			if (attemptOnly) {
				try {
					assertsExternalProvider(window.ethereum)
					const provider = new ethers.providers.Web3Provider(window.ethereum)
					const signer = provider.getSigner()
					return await signer.getAddress()
				} catch (error) {
					throw new ConnectAttemptError()
				}
			}

			assertsExternalProvider(window.ethereum)
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			await provider.send('eth_requestAccounts', [])
			const signer = provider.getSigner()
			return await signer.getAddress()
		})

	const accountStoreDefaults = { state: 'disconnected' as const, connect }
	const accountStore = useSignal<Account>(accountStoreDefaults)

	const handleAccountChange = (newAccount: string[]) => {
		accountStore.value = ethers.utils.isAddress(newAccount[0]) ? { state: 'connected', address: newAccount[0] } : accountStoreDefaults
	}

	const listenForAccountChanges = () => {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		if (!isEthereumObservable(provider.provider)) return
		provider.provider.on('accountsChanged', handleAccountChange)
	}

	const handleRejection = (error: Error) => {
		accountStore.value = error instanceof ConnectAttemptError ? accountStoreDefaults : { state: 'failed', error }
	}

	switch (query.value.state) {
		case 'inactive':
			break
		case 'pending':
			accountStore.value = { state: 'connecting', reset }
			break
		case 'rejected':
			handleRejection(query.value.error)
			break
		case 'resolved': {
			accountStore.value = { state: 'connected', address: query.value.value }
			listenForAccountChanges()
			break
		}
		default:
			assertUnreachable(query.value)
	}

	return accountStore
}
