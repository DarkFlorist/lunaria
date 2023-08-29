import { assertsEthereumObservable, assertsWithEthereum } from '../library/ethereum.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { ApplicationError } from './errors.js'
import { useNotice } from './notice.js'
import { useProviders } from './provider.js'
import { effect, signal, useSignalEffect } from '@preact/signals'
import { Address, AddressSchema } from '../schema.js'
import { getAddress } from 'ethers'

const address = signal<AsyncProperty<Address>>({ state: 'inactive' })

export function useAccount() {
	const { notify } = useNotice()
	const provider = useProviders()
	const { value: query, waitFor } = useAsyncState<Address>()

	const connect = () => {
		waitFor(async () => {
			try {
				const signer = await provider.browserProvider.getSigner()
				return AddressSchema.parse(getAddress(signer.address))
			} catch (error) {
				let errorMessage = 'An unknown error occurred.'
				if (error instanceof ApplicationError) errorMessage = error.message
				notify({ message: errorMessage, title: 'Unable to connect' })
				throw error
			}
		})
	}

	const attemptToConnect = () => {
		waitFor(async () => {
			const [signer] = await provider.browserProvider.listAccounts()
			return AddressSchema.parse(getAddress(signer.address))
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
	address.value = { ...address.value, value: AddressSchema.parse(getAddress(newAddress)) }
}

const removeAccountChangedListener = effect(() => {
	if (address.value.state !== 'resolved') return
	assertsWithEthereum(window)
	assertsEthereumObservable(window.ethereum)
	window.ethereum.on('accountsChanged', handleAccountChanged)
})
