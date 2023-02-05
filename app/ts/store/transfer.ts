import { Signal, useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { AsyncState, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider } from '../library/utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'

type TransferFormData = Signal<{
	to: string
	amount: string
}>

type ReceiptTransport = {
	signal: AsyncState<TransactionReceipt>['value']
	dispatch: () => void
	reset: AsyncState<TransactionReceipt>['reset']
}

type ResponseTransport = {
	signal: AsyncState<TransactionResponse>['value']
	dispatch: () => void
	reset: AsyncState<TransactionResponse>['reset']
}

type Transfer =
	| {
			state: 'new'
			formData: TransferFormData
			response: ResponseTransport
	  }
	| {
			state: 'signed'
			receipt: ReceiptTransport
			transactionResponse?: TransactionResponse
	  }
	| {
			state: 'confirmed'
			transactionResponse: TransactionResponse
			transactionReceipt: TransactionReceipt
	  }

export type TransferStore = Signal<Transfer>
export function createTransferStore(transactionHash?: string): TransferStore {
	const defaultFormData = { to: '', amount: '' }
	const formData = useSignal(defaultFormData)
	const responseState = useAsyncState<TransactionResponse>()
	const receiptState = useAsyncState<TransactionReceipt>()

	const response = {
		signal: responseState.value,
		dispatch: () => {
			console.log('dispatch called')
			responseState.waitFor(async () => {
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const signer = provider.getSigner()
				const value = ethers.utils.parseEther(formData.value.amount)
				const to = ethers.utils.getAddress(formData.value.to)
				const transactionResponse = await signer.sendTransaction({ to, value })
				assertsTransactionHash(transactionResponse.hash)
				transferStore.value = { state: 'signed', receipt, transactionResponse }
				return transactionResponse
			})
		},
		reset: () => {
			formData.value = defaultFormData
			responseState.reset()
		},
	}

	const receipt = {
		signal: receiptState.value,
		dispatch: () => {
			if (!transactionHash) throw new Error('Cannot retrieve receipt without a signed transaction')
			receiptState.waitFor(async () => {
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const transactionResponse = await provider.getTransaction(transactionHash)
				const transactionReceipt = await transactionResponse.wait()
				transferStore.value = { state: 'confirmed', transactionReceipt, transactionResponse }
				return transactionReceipt
			})
		},
		reset: () => receiptState.reset(),
	}

	let defaultStoreValue: Transfer = { state: 'new', formData, response }

	if (transactionHash) {
		assertsTransactionHash(transactionHash)
		defaultStoreValue = { state: 'signed', receipt }
	}

	const transferStore = useSignal<Transfer>(defaultStoreValue)
	return transferStore
}

export function isTransactionHash(hash: string): hash is `0x${string}` {
	return ethers.utils.hexDataLength(hash) === 32
}

export function assertsTransactionHash(hash: string): asserts hash is `0x${string}` {
	if (!isTransactionHash(hash)) throw new Error('Invalid transaction hash')
}
