import { Signal, useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider } from '../library/utilities.js'
import { TransactionResponse } from '../types.js'

type TransferInput = {
	to: string
	amount: string
}

type Transfer =
	| {
			isSigned: false
			formData: Signal<TransferInput>
			transactionResponseQuery: {
				transport: Signal<AsyncProperty<TransactionResponse>>
				dispatch: () => void
				reset: () => void
			}
	  }
	| {
			isSigned: true
			transactionResponse: TransactionResponse
	  }

export type TransferStore = ReturnType<typeof createTransferStore>
export function createTransferStore() {
	const defaultFormData = { to: '', amount: '' }
	const formData = useSignal(defaultFormData)
	const response = useAsyncState<TransactionResponse>()

	const transactionResponseQuery = {
		transport: response.value,
		dispatch: () => {
			response.waitFor(async () => {
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const signer = provider.getSigner()
				const value = ethers.utils.parseEther(formData.value.amount)
				const to = ethers.utils.getAddress(formData.value.to)
				const transactionResponse = await signer.sendTransaction({ to, value })
				transferStore.value = { isSigned: true, transactionResponse }
				return transactionResponse
			})
		},
		reset: () => {
			formData.value = defaultFormData
			response.reset()
		},
	}

	const defaultStoreValue = { isSigned: false as const, formData, transactionResponseQuery }
	const transferStore = useSignal<Transfer>(defaultStoreValue)
	return transferStore
}

export function isTransactionHash(hash: string): hash is `0x${string}` {
	return ethers.utils.hexDataLength(hash) === 32
}

export function assertsTransactionHash(hash: string): asserts hash is `0x${string}` {
	if (!isTransactionHash(hash)) throw new Error('Invalid transaction hash')
}
