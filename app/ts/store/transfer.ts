import { signal } from '@preact/signals'
import { ethers } from 'ethers'
import { assertsExternalProvider, assertsTransactionHash } from '../library/utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'

type TransactionRequest = {
	to: `0x${string}` | string
	amount: string
}

export type TransferTransaction =
	| {
			status: 'idle'
			fetchTransactionByHash: (hash: string) => Promise<void>
			new: () => void
	  }
	| {
			status: 'new'
			transactionRequest: TransactionRequest
			sendTransaction: () => Promise<void>
			reset: () => void
	  }
	| {
			status: 'signed'
			transactionResponse: TransactionResponse
			fetchTransactionReceipt: () => Promise<void>
			reset: () => void
	  }
	| {
			status: 'confirmed'
			transactionResponse: TransactionResponse
			transactionReceipt: TransactionReceipt
			reset: () => void
	  }

const storeDefaults = { status: 'idle', fetchTransactionByHash, new: createNewTransfer } as const
export const transferStore = signal<TransferTransaction>(storeDefaults)

async function sendTransaction() {
	if (transferStore.value.status !== 'new') return
	assertsExternalProvider(window.ethereum)
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const value = ethers.utils.parseEther(transferStore.value.transactionRequest.amount)
	const to = ethers.utils.getAddress(transferStore.value.transactionRequest.to)
	const transactionResponse = await signer.sendTransaction({ to, value })
	transferStore.value = { ...transferStore.value, status: 'signed', transactionResponse, fetchTransactionReceipt }
}

async function fetchTransactionByHash(hash: TransactionResponse['hash']) {
	if (transferStore.value.status !== 'idle') return
	assertsTransactionHash(hash)
	assertsExternalProvider(window.ethereum)
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const transactionResponse = await provider.getTransaction(hash)
	transferStore.value = { ...transferStore.value, status: 'signed', transactionResponse, fetchTransactionReceipt, reset }
}

async function fetchTransactionReceipt() {
	if (transferStore.value.status !== 'signed') return
	const transactionReceipt = await transferStore.value.transactionResponse.wait()
	transferStore.value = { ...transferStore.value, status: 'confirmed', transactionReceipt }
}

function createNewTransfer() {
	transferStore.value = { status: 'new', transactionRequest: { to: '', amount: '' }, sendTransaction, reset }
}

function reset() {
	transferStore.value = storeDefaults
}
