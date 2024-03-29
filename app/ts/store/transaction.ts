import { useSignalEffect } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { useAsyncState } from '../library/preact-utilities.js'
import { TransactionReceipt, TransactionResponse } from 'ethers'
import { useEthereumProvider } from '../context/Ethereum.js'

export function useTransaction(transactionHash: string) {
	const { browserProvider } = useEthereumProvider()
	const { value: transactionResponse, waitFor: waitForResponse, reset: resetResponse } = useAsyncState<TransactionResponse>()
	const { value: transactionReceipt, waitFor: waitForReceipt, reset: resetReceipt } = useAsyncState<TransactionReceipt | null>()

	const getTransactionResponse = (transactionHash: string) => {
		if (!browserProvider.value) return
		const provider = browserProvider.value
		waitForResponse(async () => {
			const result = await provider.getTransaction(transactionHash)
			// TransactionResult can actually be null?
			if (result === null) throw new Error('Transaction was not found on chain!')
			return result
		})
	}

	const getTransactionReceipt = (txResponse: TransactionResponse) => {
		waitForReceipt(async () => {
			return await txResponse.wait()
		})
	}

	// automatically get transaction receipt
	useSignalEffect(() => {
		if (transactionResponse.value.state !== 'resolved') return
		getTransactionReceipt(transactionResponse.value.value)
	})

	// reset async states
	useEffect(() => {
		resetReceipt()
		getTransactionResponse(transactionHash)
	}, [transactionHash])

	return { transactionResponse, transactionReceipt, reset: resetResponse }
}
