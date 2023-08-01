import { signal, useSignalEffect } from '@preact/signals'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { useProviders } from './provider.js'
import { Network } from 'ethers'

const network = signal<AsyncProperty<Network>>({ state: 'inactive' })

export function useNetwork() {
	const providers = useProviders()
	const { value: query, waitFor } = useAsyncState<Network>()

	const getNetwork = () => {
		waitFor(async () => await providers.browserProvider.getNetwork())
	}

	const listenForQueryChanges = () => {
		if (query.value.state !== 'resolved') return
		network.value = query.value
	}

	const listenForProviderChanges = () => {
		getNetwork()
	}

	useSignalEffect(listenForProviderChanges)
	useSignalEffect(listenForQueryChanges)

	return { network }
}
