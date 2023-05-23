import { useSignal, useSignalEffect } from "@preact/signals"
import { AsyncProperty, useAsyncState } from "../library/preact-utilities.js"
import { TransactionReceipt, TransactionResponse } from "../types.js"
import { useProviders } from "./provider.js"

export function useTransactionResponse() {
	const providers = useProviders()
	const transactionResponse = useSignal<AsyncProperty<TransactionResponse>>({ state: 'inactive' })
	const { value: query, waitFor } = useAsyncState<TransactionResponse>()

	const getTransactionResponse = (transactionHash: string) => {
		waitFor(async () => {
			const provider = providers.getbrowserProvider()
			return await provider.getTransaction(transactionHash)
		})
	}

	const listenForQueryChanges = () => {
		transactionResponse.value = query.value
	}

	useSignalEffect(listenForQueryChanges)

	return { transactionResponse, getTransactionResponse }

}

export function useTransactionReceipt() {
	const transactionReceipt = useSignal<AsyncProperty<TransactionReceipt>>({ state: 'inactive' })
	const { value: query, waitFor } = useAsyncState<TransactionReceipt>()

	const getTransactionReceipt = (transactionResponse: TransactionResponse) => {
		waitFor(async () => {
			return await transactionResponse.wait()
		})
	}

	const listenForQueryChanges = () => {
		transactionReceipt.value = query.value
	}

	useSignalEffect(listenForQueryChanges)

	return { transactionReceipt, getTransactionReceipt }

}
