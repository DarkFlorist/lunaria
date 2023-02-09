import { Signal, useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider } from '../library/utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'

export type TransactionQuery<T> = {
	transport: AsyncProperty<T>
	dispatch: () => void
	reset: () => void
}

type Transaction =
	| {
			transactionHash: undefined
			setTransactionHash: (transactionHash: `0x${string}`) => void
	  }
	| {
			transactionHash: `0x${string}`
			transactionResponseQuery: {
				transport: Signal<AsyncProperty<TransactionResponse>>
				dispatch: () => void
				reset: () => void
			}
			transactionReceiptQuery: {
				transport: Signal<AsyncProperty<TransactionReceipt>>
				dispatch: () => void
				reset: () => void
			}
	  }

export type TransactionStore = Signal<Transaction>

export function createTransactionStore(): TransactionStore {
	const response = useAsyncState<TransactionResponse>()
	const receipt = useAsyncState<TransactionReceipt>()

	const transactionResponseQuery = {
		transport: response.value,
		dispatch: () => {
			response.waitFor(async () => {
				if (transactionStore.value.transactionHash === undefined) throw new Error('Transaction hash cannot be empty')
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				return await provider.getTransaction(transactionStore.value.transactionHash)
			})
		},
		reset: () => response.reset(),
	} as const

	const transactionReceiptQuery = {
		transport: receipt.value,
		dispatch: () => {
			receipt.waitFor(async () => {
				if (transactionStore.value.transactionHash === undefined) throw new Error('Transaction hash cannot be empty')
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				return await provider.waitForTransaction(transactionStore.value.transactionHash)
			})
		},
		reset: () => receipt.reset(),
	}

	const setTransactionHash = (hash: `0x${string}`) => {
		transactionStore.value = { transactionHash: hash, transactionReceiptQuery, transactionResponseQuery }
		transactionResponseQuery.dispatch()
		transactionReceiptQuery.dispatch()
	}

	const transactionStore = useSignal<Transaction>({ transactionHash: undefined, setTransactionHash })

	return transactionStore
}
