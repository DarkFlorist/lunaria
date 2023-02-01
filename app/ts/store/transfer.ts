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
			createNewTransfer: () => void
	  }
	| {
			status: 'new'
			transactionRequest: TransactionRequest
			sendTransaction: () => Promise<void>
	  }
	| {
			status: 'signed'
			transactionResponse: TransactionResponse
			fetchTransactionReceipt: () => Promise<void>
	  }
	| {
			status: 'confirmed'
			transactionResponse: TransactionResponse
			transactionReceipt: TransactionReceipt
	  }

export const transferStoreDefaults = { status: 'idle', fetchTransactionByHash, createNewTransfer } as const
export const transferStore = signal<TransferTransaction>(transferStoreDefaults)

async function sendTransaction() {
	assertTransferStatus(transferStore.value.status, 'new')
	assertsExternalProvider(window.ethereum)
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const value = ethers.utils.parseEther(transferStore.value.transactionRequest.amount)
	const to = ethers.utils.getAddress(transferStore.value.transactionRequest.to)
	const transactionResponse = await signer.sendTransaction({ to, value })
	transferStore.value = { status: 'signed', transactionResponse, fetchTransactionReceipt }
}

async function fetchTransactionByHash(hash: TransactionResponse['hash']) {
	assertsTransactionHash(hash)
	assertsExternalProvider(window.ethereum)
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const transactionResponse = await provider.getTransaction(hash)
	if (!transactionResponse) throw new Error('Transaction does not exist in chain')
	transferStore.value = { ...transferStore.value, status: 'signed', transactionResponse, fetchTransactionReceipt }
}

async function fetchTransactionReceipt() {
	assertTransferStatus(transferStore.value.status, 'signed')
	assertsExternalProvider(window.ethereum)
	const transactionReceipt = await transferStore.value.transactionResponse.wait()
	if (!transactionReceipt) throw new Error('Unable to get transaction receipt')
	transferStore.value = { ...transferStore.value, status: 'confirmed', transactionReceipt }
}

function createNewTransfer() {
	transferStore.value = { status: 'new', transactionRequest: { to: '', amount: '' }, sendTransaction }
}

export function assertTransferStatus<T extends TransferTransaction['status']>(status: string, requiredStatus: T): asserts status is T {
	if (status !== requiredStatus) throw new Error(`Transfer status "${status}" did not match required "${requiredStatus}"`)
}
