import { ConnectAttemptError } from '../library/exceptions.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { useProviders } from './provider.js'
import { signal, useSignalEffect } from '@preact/signals'

const address = signal<AsyncProperty<string>>({ state: 'inactive' })

export function useAccount() {
	const providers = useProviders()
	const { value: query, waitFor, reset } = useAsyncState<string>()

	const connect = (attemptOnly?: boolean) => {
		waitFor(async () => {
			const browserProvider = providers.getbrowserProvider()

			if (attemptOnly === true) {
				try {
					const signer = browserProvider.getSigner()
					return await signer.getAddress()
				} catch (unknownError) {
					let error = new ConnectAttemptError(`Unknown error ${unknownError}`)
					if (typeof unknownError === 'string') error = new ConnectAttemptError(unknownError)
					if (unknownError instanceof Error) error = new ConnectAttemptError(error.message)
					throw error
				}
			}

			await browserProvider.send('eth_requestAccounts', [])
			const signer = browserProvider.getSigner()
			return await signer.getAddress()
		})
	}

	// only replicate states besides inactive to prevent looping
	const listenForQueryChanges = () => {
		if (query.value.state === 'inactive') return
		address.value = query.value
	}

	useSignalEffect(listenForQueryChanges)

	return { address, connect, reset }
}
