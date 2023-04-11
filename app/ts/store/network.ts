import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { Network } from '../types.js'
import { useProviders } from './provider.js'
import { signal, useSignalEffect } from '@preact/signals'

const network = signal<AsyncProperty<Network>>({ state: 'inactive' })

export function useNetwork() {
	const providers = useProviders()
	const { value: query, waitFor, reset } = useAsyncState<Network>()

	const getNetwork = () => {
		waitFor(async () => {
			const browserProvider = providers.getbrowserProvider()
			return await browserProvider.getNetwork()
		})
	}

	// only replicate states besides inactive to prevent looping
	const listenForQueryChanges = () => {
		if (query.value.state === 'inactive') return
		network.value = query.value
	}

	useSignalEffect(listenForQueryChanges)

	return { network, getNetwork, reset }
}
