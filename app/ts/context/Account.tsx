import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { useEthereumProvider } from './EthereumProvider.js'
import { ConnectAttemptError } from '../library/exceptions.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider, assertUnreachable, isEthereumObservable } from '../library/utilities.js'
import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect } from 'preact/hooks'

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

export type AccountStore = Signal<Account>
export function createAccountStore() {
	const { value: query, waitFor, reset } = useAsyncState<string>()
	const providerStore = useEthereumProvider()

	const connect = (attemptOnly?: boolean) => {
		waitFor(async () => {
			if (attemptOnly === true) {
				try {
					// also set the provider for the entire application
					const provider = providerStore.value.provider || providerStore.value.setWindowEthereumProvider()
					const signer = provider.getSigner()
					return await signer.getAddress()
				} catch (unknownError) {
					let error = new ConnectAttemptError(`Unknown error ${unknownError}`)
					if (typeof unknownError === 'string') error = new ConnectAttemptError(unknownError)
					if (unknownError instanceof Error) error = new ConnectAttemptError(error.message)
					throw error
				}
			}

			// this will also set the provider for the entire application
			const provider = providerStore.value.provider || providerStore.value.setWindowEthereumProvider()
			await provider.send('eth_requestAccounts', [])
			const signer = provider.getSigner()
			return await signer.getAddress()
		})
	}
	const accountStoreDefaults = { state: 'disconnected' as const, connect }
	const accountStore = useSignal<Account>(accountStoreDefaults)

	const handleAccountChange = () => connect(true)

	const listenForAccountChanges = () => {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		if (!isEthereumObservable(provider.provider)) return
		provider.provider.on('accountsChanged', handleAccountChange)
	}

	const handleRejection = (error: Error) => {
		accountStore.value = error instanceof ConnectAttemptError ? accountStoreDefaults : { state: 'failed', error }
	}

	const listenForAsyncChanges = () => {
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
	}

	useSignalEffect(listenForAsyncChanges)

	return accountStore
}

const AccountContext = createContext<AccountStore | undefined>(undefined)
export const AccountProvider = ({ children }: { children: ComponentChildren }) => {
	const accountStore = createAccountStore()

	tryConnect(accountStore)
	executeSplashExit()

	return <AccountContext.Provider value={accountStore}>{children}</AccountContext.Provider>
}

export function useAccountStore() {
	const context = useContext(AccountContext)
	if (context === undefined) throw new Error('useAccountStore can only be used within a child of AccountProvider')
	return context
}

function tryConnect(accountStore: AccountStore) {
	useEffect(() => {
		if (accountStore.value.state !== 'disconnected') return
		accountStore.value.connect(true)
	}, [])
}

function executeSplashExit() {
	useEffect(() => {
		const selectorHiddenClassName = 'splash-screen--off'

		const element = document.querySelector('.splash-screen')
		if (element === null || element.classList.contains(selectorHiddenClassName)) return
		element.classList.add(selectorHiddenClassName)
	}, [])
}
