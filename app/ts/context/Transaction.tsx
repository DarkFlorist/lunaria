import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { ComponentChildren, createContext } from 'preact'
import { useCallback, useContext } from 'preact/hooks'
import { useAsyncState } from '../library/preact-utilities.js'
import { assertUnreachable } from '../library/utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'
import { useEthereumProvider } from './EthereumProvider.js'

type TransactionQuery<T> = {
	isLoading: boolean
	data?: T
	error?: Error
}

type UseTransactionContext = {
	response: Signal<TransactionQuery<TransactionResponse>>
	receipt: Signal<TransactionQuery<TransactionReceipt>>
}

const TransactionContext = createContext<UseTransactionContext | undefined>(undefined)

type TransactionResponseProviderProps = {
	children: ComponentChildren
	transactionHash: string
}

export const TransactionProvider = ({ children, transactionHash }: TransactionResponseProviderProps) => {
	const ethProvider = useEthereumProvider()
	const asyncResponse = useAsyncState<TransactionResponse>()
	const asyncReceipt = useAsyncState<TransactionReceipt>()

	const responseQuery = useSignal<TransactionQuery<TransactionResponse>>({
		isLoading: false,
		data: undefined,
		error: undefined,
	})

	const receiptQuery = useSignal<TransactionQuery<TransactionReceipt>>({
		isLoading: false,
		data: undefined,
		error: undefined,
	})

	const getTransactionResponse = useCallback(
		(hash: string) => {
			const provider = ethProvider.value.provider
			if (provider === undefined) return
			asyncResponse.waitFor(async () => await provider.getTransaction(hash))
		},
		[ethProvider.value.provider]
	)

	function listenForResponseQueryChanges() {
		switch (asyncResponse.value.value.state) {
			case 'inactive':
				break
			case 'pending':
				responseQuery.value = { ...responseQuery.peek(), isLoading: true }
				break
			case 'rejected':
				responseQuery.value = { ...responseQuery.peek(), isLoading: false, error: asyncResponse.value.value.error }
				break
			case 'resolved': {
				const transactionResponse = asyncResponse.value.value.value
				asyncReceipt.waitFor(transactionResponse.wait)
				responseQuery.value = { ...responseQuery.peek(), isLoading: false, data: transactionResponse }
				break
			}
			default:
				assertUnreachable(asyncResponse.value.value)
		}
	}

	function listenForReceiptQueryChanges() {
		switch (asyncReceipt.value.value.state) {
			case 'inactive':
				break
			case 'pending':
				receiptQuery.value = { ...receiptQuery.peek(), isLoading: true }
				break
			case 'rejected': {
				const error = asyncReceipt.value.value.error
				receiptQuery.value = { ...receiptQuery.peek(), isLoading: false, error }
				break
			}
			case 'resolved': {
				const transactionReceipt = asyncReceipt.value.value.value
				receiptQuery.value = { ...receiptQuery.peek(), isLoading: false, data: transactionReceipt }
				break
			}
			default:
				assertUnreachable(asyncReceipt.value.value)
		}
	}

	useSignalEffect(listenForResponseQueryChanges)
	useSignalEffect(listenForReceiptQueryChanges)
	useSignalEffect(() => {
		getTransactionResponse(transactionHash)
	})

	return <TransactionContext.Provider value={{ response: responseQuery, receipt: receiptQuery }}>{children}</TransactionContext.Provider>
}

export function queryTransactionResponse() {
	const context = useContext(TransactionContext)
	if (context === undefined) throw new Error('useTransactionResponse can only be used within a child of TransactionProvider')
	return context.response.value
}

export function queryTransactionReceipt() {
	const context = useContext(TransactionContext)
	if (context === undefined) throw new Error('useTransactionReceipt can only be used within a child of TransactionProvider')
	return context.receipt.value
}
