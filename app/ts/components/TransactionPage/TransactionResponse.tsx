import { useEffect } from 'preact/hooks'
import { useTransactionResponse } from '../../store/transaction.js'
import { TransactionResponse } from '../../types.js'

type TransactionQueryProps = {
	transactionHash: string
	onSuccess: (response: TransactionResponse) => void
}

export const TransactionResponseQuery = (props: TransactionQueryProps) => {
	const { transactionResponse: txn, getTransactionResponse } = useTransactionResponse()

useEffect(() => {
		getTransactionResponse(props.transactionHash)
	}, [props.transactionHash])

	switch (txn.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <QueryPending />
		case 'rejected':
			return <QueryRejected message={txn.value.error.message} />
		case 'resolved':
			props.onSuccess(txn.value.value)
			return <QueryResolved transactionHash={props.transactionHash} transactionResponse={txn.value.value} />
	}
}

const QueryRejected = ({ message }: { message: string }) => {
	return (
		<div class='grid gap-2 border border-red-400/50 px-4 py-3 bg-red-200/10'>
			<div class='font-bold text-lg'>Unable to load transaction details</div>
			<div>Error:</div>
			<div class='break-all p-3 text-sm bg-white/10 text-white/50'>{message}</div>
		</div>
	)
}

const QueryPending = () => {
	return (
		<div class='grid gap-2 grid-cols-[auto,1fr] items-center border border-white/20 px-4 py-3 bg-white/5'>
			<svg width='1em' height='1em' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' fill='none' class='animate-spin'>
				<g fill='currentColor' fill-rule='evenodd' clip-rule='evenodd'>s
					<path d='M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z' opacity='.2' />
					<path d='M7.25.75A.75.75 0 0 1 8 0a8 8 0 0 1 8 8 .75.75 0 0 1-1.5 0A6.5 6.5 0 0 0 8 1.5a.75.75 0 0 1-.75-.75z' />
				</g>
			</svg>
			<div>Fetching transaction details from chain...</div>
		</div>
	)
}

type TransactionDetailsProps = {
	transactionHash: string
	transactionResponse: TransactionResponse | null
}

const QueryResolved = (props: TransactionDetailsProps) => {
	if (props.transactionResponse === null) return <div class='px-4 py-3 border border-red-500/50 text-red-500'>Unable to find transaction on chain!</div>

	return (
		<div class='grid gap-2'>
			<div class='px-4 py-2 border border-white/20 min-w-0'>
				<div class='text-sm text-white/50'>Hash</div>
				<div class='overflow-hidden text-ellipsis whitespace-nowrap'>{props.transactionHash}</div>
			</div>
			<div class='px-4 py-2 border border-white/20'>
				<div class='text-sm text-white/50'>From</div>
				<div class='overflow-hidden text-ellipsis whitespace-nowrap'>{props.transactionResponse.from}</div>
			</div>
		</div>
	)
}
