import { signal } from '@preact/signals'
import { ethers } from 'ethers'
import { assertsExternalProvider } from '../library/utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'

export type SendFunctionInput = {
	amount: string
	to: string
}

export type TransactionIdle = {
	status: 'idle'
	fetch: (hash: string) => void
	compose: () => void
}

export type TransactionComposing = {
	status: 'composing'
	data: SendFunctionInput
	send: () => void
}

export type TransactionSigning = {
	status: 'signing'
	readonly data: SendFunctionInput
}

export type TransactionSigned = {
	status: 'signed'
	transaction: TransactionResponse
	fetch: (hash: string) => void
	readonly data: SendFunctionInput
}

export type TransactionConfirming = {
	status: 'confirming'
	transaction: TransactionResponse
	readonly data: SendFunctionInput
}

export type TransactionConfirmed = {
	status: 'confirmed'
	transaction: TransactionResponse
	receipt: TransactionReceipt
	readonly data: SendFunctionInput
}

export type TransactionFailed = {
	status: 'failed'
	error: Error
	reset: (clearData?: boolean) => void
	data: SendFunctionInput
}

export type TransactionStore = TransactionComposing | TransactionSigning | TransactionSigned | TransactionConfirming | TransactionConfirmed | TransactionFailed | TransactionIdle

const storeDefaults: TransactionIdle = { status: 'idle', fetch, compose }
const store = signal<TransactionStore>(storeDefaults)
export const sendTransactionStore = store

async function send() {
	if (store.value.status !== 'composing') return
	const { data } = store.value

	try {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const value = ethers.utils.parseEther(data.amount)
		const to = ethers.utils.getAddress(data.to)
		store.value = { status: 'signing', data }
		const transaction = await signer.sendTransaction({ to, value })
		store.value = { status: 'signed', transaction, fetch, data }
	} catch (exception) {
		let error = new Error(`Unknown error (${exception})`)

		if (exception instanceof Error) {
			const parsedMessage = exception.message.replace(/ \(.*\)/, '')
			const shortMessage = parsedMessage[0].toUpperCase() + parsedMessage.slice(1)
			error = new Error(shortMessage)
		}

		store.value = { status: 'failed', error, data, reset }
	}
}

async function fetch(hash: string) {
	if (store.value.status !== 'signed') return
	const { data } = store.value
	try {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const transaction = await provider.getTransaction(hash)
		store.value = { status: 'confirming', transaction, data }
		const receipt = await transaction.wait()
		store.value = { status: 'confirmed', transaction, receipt, data }
	} catch (error) {
		console.log(error)
	}
}

function reset(clearData?: boolean) {
	if (store.value.status !== 'failed') return
	store.value = clearData ? storeDefaults : { status: 'composing', data: store.value.data, send }
}

function compose() {
	store.value = { status: 'composing', data: { to: '', amount: '' }, send }
}
