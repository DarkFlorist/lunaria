import { useEffect } from 'preact/hooks'
import { calculateGasFee } from '../../library/utilities.js'
import { useTransactionReceipt } from '../../store/transaction.js'
import { TransactionReceipt, TransactionResponse } from '../../types.js'

type TransactionReceiptQueryProps = {
	transactionHash: string
	transactionResponse: TransactionResponse | undefined
}

export const TransactionReceiptQuery = (props: TransactionReceiptQueryProps) => {
	const { transactionReceipt: txn, getTransactionReceipt } = useTransactionReceipt()
	if (props.transactionResponse === undefined) return <></>

	useEffect(() => {
		if (props.transactionResponse === undefined) return
		getTransactionReceipt(props.transactionResponse)
	}, [props.transactionHash])

	switch (txn.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <QueryPending />
		case 'rejected':
			return <QueryRefected message={txn.value.error.message} />
		case 'resolved':
			return <QueryResolved receipt={txn.value.value} />
	}
}

const QueryPending = () => {
	return (
		<div class='grid gap-2 grid-cols-[auto,1fr] items-center border border-white/20 px-4 py-3 bg-white/5'>
			<svg width='1em' height='1em' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' fill='none' class='animate-spin'>
				<g fill='currentColor' fill-rule='evenodd' clip-rule='evenodd'>
					<path d='M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z' opacity='.2' />
					<path d='M7.25.75A.75.75 0 0 1 8 0a8 8 0 0 1 8 8 .75.75 0 0 1-1.5 0A6.5 6.5 0 0 0 8 1.5a.75.75 0 0 1-.75-.75z' />
				</g>
			</svg>
			<div>Fetching transaction receipt from chain...</div>
		</div>
	)
}

const QueryRefected = ({ message }: { message: string }) => {
	return (
		<div class='grid gap-2 border border-red-400/50 px-4 py-3 bg-red-200/10'>
			<div class='font-bold text-lg'>Unable to load transaction receipt</div>
			<div>You provider returned the following error:</div>
			<div class='break-all p-3 text-sm bg-white/10 text-white/50'>{message}</div>
		</div>
	)
}

const QueryResolved = (props: { receipt: TransactionReceipt }) => {
	if (props.receipt === null) return <div class='px-4 py-3 border border-red-500/50 text-red-500'>Unable to find transaction in chain!</div>
	const { effectiveGasPrice, gasUsed } = props.receipt

	return (
		<div class='grid gap-2'>
			<div class='px-4 py-2 border border-white/20'>
				<div class='text-sm text-white/50'>Transaction Fee:</div>
				<div class='overflow-hidden text-ellipsis whitespace-nowrap'>{calculateGasFee(effectiveGasPrice, gasUsed)}</div>
			</div>
		</div>
	)
}
