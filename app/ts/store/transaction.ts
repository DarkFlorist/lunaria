import { Signal, useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { AsyncState, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider } from '../library/utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'

type TransferFormData = Signal<{
	to: string
	amount: string
}>

type TransactionResponseAsync = {
	signal: AsyncState<unknown>['value']
	dispatch: () => void
	reset: AsyncState<unknown>['reset']
}

type TransactionReceiptAsync = {
	signal: AsyncState<unknown>['value']
	dispatch: () => void
	reset: AsyncState<unknown>['reset']
}

type Transfer =
	| {
			status: 'idle'
			create: () => void
			retrieve: (transactionHash: `0x${string}`) => void
	  }
	| {
			status: 'new'
			formData: TransferFormData
			response: TransactionResponseAsync
	  }
	| {
			status: 'signed'
			transactionHash: `0x${string}`
			receipt: TransactionReceiptAsync
	  }
	| {
			status: 'confirmed'
			transaction: TransactionResponse
			receipt: TransactionReceipt
	  }

type TransferStore = Signal<Transfer>
export function createTransactionStore(): TransferStore {
	const formData = useSignal({ to: '', amount: '' })
	const { value, waitFor, reset } = useAsyncState()

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
				transferStore.value = { status: 'signed', transactionHash: transactionResponse.hash, receipt }
			})
		},
		reset,
	}

	const receipt = {
		signal: value,
		dispatch: () => {
			if (transferStore.value.status !== 'signed') throw new Error('Cannot retrieve receipt without a signed transaction')
			const hash = transferStore.value.transactionHash
			waitFor(async () => {
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const transaction = await provider.getTransaction(hash)
				const receipt = await transaction.wait()
				transferStore.value = { status: 'confirmed', receipt, transaction }
			})
		},
		reset,
	}

	const create = () => {
		transferStore.value = { status: 'new', formData, response }
	}

	const retrieve = (transactionHash: `0x${string}`) => {
		assertsTransactionHash(transactionHash)
		transferStore.value = { status: 'signed', receipt, transactionHash }
	}

	const accountDefaults = { status: 'idle', create, retrieve } as const
	const transferStore = useSignal<Transfer>(accountDefaults)
	return transferStore
}

export function isTransactionHash(hash: string): hash is `0x${string}` {
	return ethers.utils.hexDataLength(hash) === 32
}

export function assertsTransactionHash(hash: string): asserts hash is `0x${string}` {
	if (!isTransactionHash(hash)) throw new Error('Invalid transaction hash')
}
