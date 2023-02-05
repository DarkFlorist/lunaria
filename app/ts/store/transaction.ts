import { Signal, useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { AsyncState, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider } from '../library/utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'

type TransferFormData = Signal<{
	to: string
	amount: string
}>

type DefinedAsyncState = {
	signal: AsyncState<unknown>['value']
	dispatch: () => void
	reset: AsyncState<unknown>['reset']
}

type Transfer =
	| {
			state: 'new'
			formData: TransferFormData
			response: DefinedAsyncState
	  }
	| {
			state: 'signed'
			receipt: DefinedAsyncState
	  }
	| {
			state: 'confirmed'
			transactionResponse: TransactionResponse
			transactionReceipt: TransactionReceipt
	  }

type TransferStore = Signal<Transfer>
export function createTransactionStore(transactionHash?: string): TransferStore {
	const defaultFormData = { to: '', amount: '' }
	const formData = useSignal(defaultFormData)
	const { value, waitFor, reset: resetAsyncState } = useAsyncState()

	const response = {
		signal: value,
		dispatch: () => {
			waitFor(async () => {
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const signer = provider.getSigner()
				const value = ethers.utils.parseEther(formData.value.amount)
				const to = ethers.utils.getAddress(formData.value.to)
				const transactionResponse = await signer.sendTransaction({ to, value })
				assertsTransactionHash(transactionResponse.hash)
				transferStore.value = { state: 'signed', receipt }
			})
		},
		reset: () => {
			formData.value = defaultFormData
			resetAsyncState()
		},
	}

	const receipt = {
		signal: value,
		dispatch: () => {
			if (!transactionHash) throw new Error('Cannot retrieve receipt without a signed transaction')
			// const hash = transferStore.value.transactionHash
			waitFor(async () => {
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const transactionResponse = await provider.getTransaction(transactionHash)
				const transactionReceipt = await transactionResponse.wait()
				transferStore.value = { state: 'confirmed', transactionReceipt, transactionResponse }
			})
		},
		reset,
	}

	const transferDefaults = transactionHash ? ({ state: 'signed', receipt } as const) : ({ state: 'new', formData, response } as const)

	const transferStore = useSignal<Transfer>(transferDefaults)
	return transferStore
}

export function isTransactionHash(hash: string): hash is `0x${string}` {
	return ethers.utils.hexDataLength(hash) === 32
}

export function assertsTransactionHash(hash: string): asserts hash is `0x${string}` {
	if (!isTransactionHash(hash)) throw new Error('Invalid transaction hash')
}
