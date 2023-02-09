import { Signal, useSignal } from '@preact/signals'
import { BigNumber, ethers } from 'ethers'
import { useAsyncState } from '../library/preact-utilities'
import { assertsExternalProvider, assertUnreachable } from '../library/utilities'

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

	switch (query.value.state) {
		case 'inactive':
			balanceStore.value = { state: 'initial' as const, checkBalance }
			break
		case 'pending':
			balanceStore.value = { state: 'updating' as const, reset }
			break
		case 'rejected':
			balanceStore.value = { state: 'failed' as const, error: query.value.error }
			break
		case 'resolved':
			balanceStore.value = { state: 'updated' as const, balance: query.value.value, updated_at: new Date() }
			break
		default:
			assertUnreachable(query.value)
	}

	return balanceStore
}
