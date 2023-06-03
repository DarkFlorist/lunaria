import { Signal, useSignalEffect } from '@preact/signals'
import { BigNumber, ethers } from 'ethers'
import { useEffect } from 'preact/hooks'
import { useRouter } from '../HashRouter.js'
import { TransactionReceipt, TransactionResponse } from '../../types.js'
import { AsyncProperty, useAsyncState } from '../../library/preact-utilities.js'
import { useProviders } from '../../store/provider.js'
import { calculateGasFee } from '../../library/utilities.js'
import { Info, InfoError, InfoPending } from './Info.js'

export const TransactionDetails = () => {
	const router = useRouter<{ transaction_hash: string }>()
	const { transactionResponse, transactionReceipt } = useTransaction(router.value.params.transaction_hash)

	return (
		<div class='grid gap-2'>
			<DataFromResponse response={transactionResponse} />
			<DataFromReceipt receipt={transactionReceipt} />
		</div>
	)
}

const DataFromResponse = ({ response }: { response: Signal<AsyncProperty<TransactionResponse>> }) => {
	switch (response.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return (
				<>
					<InfoPending />
					<InfoPending />
				</>
			)
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={response.value.error.message} />
		case 'resolved':
			return (
				<>
					<Info label='Hash' value={response.value.value.hash} allowCopy />
					<Info label='From' value={response.value.value.from} allowCopy />
					<AccountBalance response={response.value.value} />
				</>
			)
	}
}

const DataFromReceipt = ({ receipt }: { receipt: Signal<AsyncProperty<TransactionReceipt>> }) => {
	switch (receipt.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={receipt.value.error.message} />
		case 'resolved':
			const transactionFee = calculateGasFee(receipt.value.value.effectiveGasPrice, receipt.value.value.gasUsed)
			return (
				<>
					<Info label='Transaction Fee' value={`${transactionFee} ETH`} />
				</>
			)
	}
}

const AccountBalance = ({ response }: { response: TransactionResponse }) => {
	const providers = useProviders()
	const { value: asyncBalance, waitFor } = useAsyncState<BigNumber>()

	const getBalance = () => {
		const { from, blockNumber } = response
		waitFor(async () => {
			const provider = providers.getbrowserProvider()
			return await provider.getBalance(from, blockNumber)
		})
	}

	useEffect(() => {
		getBalance()
	}, [response.blockNumber])

	switch (asyncBalance.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={asyncBalance.value.error.message} />
		case 'resolved':
			const balance = ethers.utils.formatEther(asyncBalance.value.value)
			return <Info label='Balance Before Transaction' value={balance} suffix=' ETH' />
	}
}

function useTransaction(transactionHash: string) {
	const providers = useProviders()
	const { value: transactionResponse, waitFor: waitForResponse, reset: resetResponse } = useAsyncState<TransactionResponse>()
	const { value: transactionReceipt, waitFor: waitForReceipt, reset: resetReceipt } = useAsyncState<TransactionReceipt>()

	const getTransactionResponse = (transactionHash: string) => {
		waitForResponse(async () => {
			const provider = providers.getbrowserProvider()
			const result = await provider.getTransaction(transactionHash)
			// TransactionResult can actually be null?
			if (result === null) throw new Error('Transaction was not found in chain!')
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
		resetResponse()
		resetReceipt()
		getTransactionResponse(transactionHash)
	}, [transactionHash])

	return { transactionResponse, transactionReceipt, reset: resetResponse }
}
