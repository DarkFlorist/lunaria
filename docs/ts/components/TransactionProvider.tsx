import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { TransactionReceipt, TransactionResponse } from 'ethers'
import { useEthereumProvider } from '../context/Ethereum.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'

type TransactionContext = {
	transactionHash: Signal<string | undefined>
	response: Signal<AsyncProperty<TransactionResponse | null>>
	receipt: Signal<AsyncProperty<TransactionReceipt | null>>
}

const TransactionContext = createContext<TransactionContext | undefined>(undefined)

export const TransactionProvider = ({ children }: { children: ComponentChildren }) => {
	const { browserProvider } = useEthereumProvider()
	const { value: response, waitFor: waitForResponse, reset: resetResponse } = useAsyncState<TransactionResponse | null>()
	const { value: receipt, waitFor: waitForReceipt, reset: resetReceipt } = useAsyncState<TransactionReceipt | null>()
	const transactionHash = useSignal<`0x{string}` | undefined>(undefined)

	const getTransactionResponse = (transactionHash: string) => {
		if (!browserProvider.value) return
		const provider = browserProvider.value
		waitForResponse(async () => {
			return await provider.getTransaction(transactionHash)
		})
	}

	const getTransactionReceipt = (txResponse: TransactionResponse) => {
		waitForReceipt(async () => {
			return await txResponse.wait()
		})
	}

	// automatically get transaction receipt
	useSignalEffect(() => {
		if (response.value.state !== 'resolved') return
		if (response.value.value === null) return
		getTransactionReceipt(response.value.value)
	})

	useSignalEffect(() => {
		if (transactionHash.value === undefined) return
		resetResponse()
		resetReceipt()
		getTransactionResponse(transactionHash.value)
	})

	return (
		<TransactionContext.Provider value={{ transactionHash, response, receipt }}>
			{children}
		</TransactionContext.Provider>
	)
}

export function useTransaction() {
	const context = useContext(TransactionContext)
	if (context === undefined) throw ('use useTransaction within children of TransactionProvider')
	return context
}
