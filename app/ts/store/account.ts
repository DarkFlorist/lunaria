import { assertsEthereumObservable } from '../library/ethereum.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { useProviders } from './provider.js'
import { effect, signal, useSignalEffect } from '@preact/signals'
import { ConnectAttemptError } from '../library/exceptions.js'

const address = signal<AsyncProperty<string>>({ state: 'inactive' })

export function useAccount() {
	const providers = useProviders()
	const { value: query, waitFor } = useAsyncState<string>()

	const connect = () => {
		waitFor(async () => {
			const provider = providers.browserProvider
			const signer = await provider.value.getSigner()
			return await signer.getAddress()
		})
	}

	const attemptToConnect = () => {
		waitFor(async () => {
			if (providers.provider === undefined) throw new ConnectAttemptError()
			const provider = providers.browserProvider
			const [signer] = await provider.value.listAccounts()
			return signer.address
		})
	}

	const listenForQueryChanges = () => {
		// do not reset shared state for other instances of this hooks
		if (query.value.state === 'inactive') return
		address.value = query.value
	}

	useSignalEffect(listenForQueryChanges)

	return { address, connect, attemptToConnect }
}

const handleAccountChanged = ([newAddress]: string[]) => {
	if (address.value.state !== 'resolved') return
	removeAccountChangedListener()
	if (newAddress === undefined) {
		address.value = { state: 'inactive' }
		return
	}
	address.value = { ...address.value, value: newAddress }
}

const removeAccountChangedListener = effect(() => {
	if (address.value.state !== 'resolved') return
	assertsEthereumObservable(window.ethereum)
	window.ethereum.on('accountsChanged', handleAccountChanged)
})
