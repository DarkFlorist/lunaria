import { signal } from '@preact/signals'
import { ethers } from 'ethers'
import { assertsExternalProvider, assertsTransactionHash } from '../library/utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'

type TransactionRequest = {
	to: `0x${string}`
	amount: string
	type: 'ETH' | 'LINK'
}

export type TransferTransaction =
	| {
			status: 'unsigned'
			request: TransactionRequest
			send: () => Promise<void>
	  }
	| {
			status: 'signed'
			request: Readonly<TransactionRequest>
			transactionResponse: TransactionResponse
			fetch: (hash: string) => Promise<void>
	  }
	| {
			status: 'confirmed'
			request: Readonly<TransactionRequest>
			transactionResponse: TransactionResponse
			transactionReceipt: TransactionReceipt
	  }

const storeDefaults = { status: 'unsigned', request: { to: '0x', amount: '', type: 'ETH' }, send: initiateTransfer } as const
export const transferStore = signal<TransferTransaction>(storeDefaults)

async function initiateTransfer() {
	assertsExternalProvider(window.ethereum)
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const value = ethers.utils.parseEther(transferStore.value.request.amount)
	const to = ethers.utils.getAddress(transferStore.value.request.to)
	const transactionResponse = await signer.sendTransaction({ to, value })
	transferStore.value = { ...transferStore.value, status: 'signed', fetch: (hash: string) => fetchTransactionByHash(hash), transactionResponse }
}

async function fetchTransactionByHash(hash: TransactionResponse['hash']) {
	if (transferStore.value.status !== 'signed') return
	assertsTransactionHash(hash)
	assertsExternalProvider(window.ethereum)
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const transaction = await provider.getTransaction(hash)
	const transactionReceipt = await transaction.wait()
	transferStore.value = { ...transferStore.value, status: 'confirmed', transactionReceipt }
}
