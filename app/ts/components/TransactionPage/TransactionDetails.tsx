import { Signal, useSignalEffect } from '@preact/signals'
import { BigNumber, ethers } from 'ethers'
import { useEffect } from 'preact/hooks'
import { AsyncText } from '../AsyncText.js'
import { useRouter } from '../HashRouter.js'
import { TransactionReceipt, TransactionResponse } from '../../types.js'
import { AsyncProperty, useAsyncState } from '../../library/preact-utilities.js'
import { useProviders } from '../../store/provider.js'
import { calculateGasFee } from '../../library/utilities.js'
import { CopyButton } from '../CopyButton.js'

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
					<InfoSkeleton />
					<InfoSkeleton />
				</>
			)
		case 'rejected':
			return <div>error</div>
		case 'resolved':
			return (
				<>
					<Info label='Hash' value={response.value.value.hash} allowCopy />
					<Info label='From' value={response.value.value.from} allowCopy />
				</>
			)
	}
}

const DataFromReceipt = ({ receipt }: { receipt: Signal<AsyncProperty<TransactionReceipt>> }) => {
	switch (receipt.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoSkeleton />
		case 'rejected':
			return <div>error</div>
		case 'resolved':
			console.log('receipt block', receipt.value.value.blockNumber)
			const transactionFee = calculateGasFee(receipt.value.value.effectiveGasPrice, receipt.value.value.gasUsed)
			return (
				<>
					<Info label='Transaction Fee' value={`${transactionFee} ETH`} />
					<AccountBalance receipt={receipt.value.value} />
				</>
			)
	}
}

const AccountBalance = ({ receipt }: { receipt: TransactionReceipt }) => {
	const providers = useProviders()
	const { value, waitFor } = useAsyncState<BigNumber>()

	const getBalance = () => {
		console.log('fetching balance...')
		const { from, blockNumber } = receipt
		waitFor(async () => {
			const provider = providers.getbrowserProvider()
			return await provider.getBalance(from, blockNumber)
		})
	}

	useEffect(() => {
		getBalance()
	}, [receipt.blockNumber])

	switch (value.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoSkeleton />
		case 'rejected':
			return <div>Error</div>
		case 'resolved':
			const balance = ethers.utils.formatEther(value.value.value)
			return <Info label='Balance' value={balance} suffix=' ETH' />
	}
}

type InfoProps = {
	label: string
	value: string
	prefix?: string
	suffix?: string
	allowCopy?: boolean
}

const Info = (props: InfoProps) => {
	const { label, value, prefix = '', suffix = '', allowCopy } = props
	return (
		<div class='grid grid-cols-[1fr,auto] items-center px-4 py-2 border border-white/20 min-w-0'>
			<div>
				<div class='text-sm text-white/50'>{label}</div>
				<div class='overflow-hidden text-ellipsis whitespace-nowrap'>{`${prefix}${value}${suffix}`}</div>
			</div>
			{allowCopy ? <CopyButton value={value} label='Copy' /> : <></>}
		</div>
	)
}

const InfoSkeleton = () => {
	return (
		<div class='grid px-4 py-2 border border-white/20 min-w-0'>
			<AsyncText class='text-sm' placeholderLength={8} />
			<AsyncText placeholderLength={40} />
		</div>
	)
}

function useTransaction(transactionHash: string) {
	const providers = useProviders()
	const { value: transactionResponse, waitFor: waitForResponse, reset: resetResponse } = useAsyncState<TransactionResponse>()
	const { value: transactionReceipt, waitFor: waitForReceipt, reset: resetReceipt } = useAsyncState<TransactionReceipt>()

	const getTransactionResponse = (transactionHash: string) => {
		waitForResponse(async () => {
			const provider = providers.getbrowserProvider()
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
