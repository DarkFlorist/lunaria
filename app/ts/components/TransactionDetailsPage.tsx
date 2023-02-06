import { JSX } from 'preact'
import { useCallback, useEffect } from 'preact/hooks'
import { Signal } from '@preact/signals'
import { ethers } from 'ethers'
import * as Layout from './Layout.js'
import { useParams } from './HashRouter.js'
import { calculateGasFee, isTransactionHash, removeNonStringsAndTrim } from '../library/utilities.js'
import { AsyncProperty } from '../library/preact-utilities.js'
import { TransactionReceipt, TransactionResponse } from '../types.js'
import { createTransactionStore } from '../store/transaction.js'
import { TransactionProvider, useTransactionStore } from './TransactionContext.js'
import { TextSkeleton } from './TextSkeleton.js'

export const TransactionDetailsPage = () => {
	const transactionStore = createTransactionStore()

	return (
		<TransactionProvider store={transactionStore}>
			<Layout.Page>
				<Layout.Header />
				<Layout.Body>
					<PageTitle />
					<Main />
				</Layout.Body>
				<Layout.Footer />
			</Layout.Page>
		</TransactionProvider>
	)
}

const Main = () => {
	const transaction = useTransactionStore().value
	const transactionHashFromUrl = extractTransactionHashFromParams()

	const initialize = useCallback(() => {
		if (transactionHashFromUrl === null) return
		if (transaction.transactionHash !== undefined) return
		transaction.setTransactionHash(transactionHashFromUrl)
	}, [transactionHashFromUrl])

	useEffect(() => {
		initialize()
	}, [])

	if (transactionHashFromUrl === null) return <TransactionDetailsInvalid />
	if (transaction.transactionHash === undefined) return <TransactionDetailsInvalid />

	return (
		<Grid>
			<GridItem class='xl:col-span-full'>
				<TransactionHash transport={transaction.transactionResponseQuery.transport} />
			</GridItem>
			<GridItem>
				<TransactionFrom transport={transaction.transactionResponseQuery.transport} />
			</GridItem>
			<GridItem>
				<TransactionTo transport={transaction.transactionResponseQuery.transport} />
			</GridItem>
			<GridItem>
				<TransactionAmount transport={transaction.transactionResponseQuery.transport} />
			</GridItem>
			<GridItem>
				<TransactionFee transport={transaction.transactionReceiptQuery.transport} />
			</GridItem>
		</Grid>
	)
}

const TransactionHashField = ({ text }: { text: string }) => <ReadOnlyField label='Transaction Hash:' value={text} />
const TransactionHash = ({ transport }: { transport: Signal<AsyncProperty<TransactionResponse>> }) => {
	const response = transport.value

	switch (response.state) {
		case 'inactive':
			return <TransactionHashField text='' />
		case 'rejected':
			return <TransactionHashField text='Failed to retrieve transaction hash.' />
		case 'pending':
			return (
				<>
					<TextSkeleton textSize='sm' length={16} />
					<TextSkeleton length={64} />
				</>
			)
		case 'resolved':
			return <TransactionHashField text={response.value.hash} />
	}
}

const TransactionFrom = ({ transport }: { transport: Signal<AsyncProperty<TransactionResponse>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <ReadOnlyField label='From:' value='' />
		case 'rejected':
			return <ReadOnlyField label='From:' value='Failed to retrieve source address (from).' />
		case 'pending':
			return (
				<>
					<TextSkeleton textSize='sm' length={10} />
					<TextSkeleton length={40} />
				</>
			)
		case 'resolved':
			return <ReadOnlyField label='From:' value={response.value.from} />
	}
}

const TransactionTo = ({ transport }: { transport: Signal<AsyncProperty<TransactionResponse>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <ReadOnlyField label='To:' value='' />
		case 'rejected':
			return <ReadOnlyField label='To:' value='Failed to retrieve destination address (to).' />
		case 'pending':
			return (
				<>
					<TextSkeleton textSize='sm' length={10} />
					<TextSkeleton length={40} />
				</>
			)
		case 'resolved':
			return <ReadOnlyField label='To:' value={response.value.to!} />
	}
}

const TransactionAmount = ({ transport }: { transport: Signal<AsyncProperty<TransactionResponse>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <ReadOnlyField label='Amount:' value='' />
		case 'rejected':
			return <ReadOnlyField label='Amount:' value='Failed to retrieve amount.' />
		case 'pending':
			return (
				<>
					<TextSkeleton textSize='sm' length={12} />
					<TextSkeleton length={20} />
				</>
			)
		case 'resolved':
			return <ReadOnlyField label='Amount:' value={`${ethers.utils.formatEther(response.value.value)} Ether`} />
	}
}

const TransactionFee = ({ transport }: { transport: Signal<AsyncProperty<TransactionReceipt>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <ReadOnlyField label='Transaction Fee:' value='' />
		case 'rejected':
			return <ReadOnlyField label='Transaction Fee:' value='Failed to retrieve receipt.' />
		case 'pending':
			return (
				<>
					<TextSkeleton textSize='sm' length={14} />
					<TextSkeleton length={32} />
				</>
			)
		case 'resolved': {
			const transactionFee = calculateGasFee(response.value.effectiveGasPrice, response.value.gasUsed)
			return <ReadOnlyField label='Transaction Fee:' value={`${transactionFee} Ether`} />
		}
	}
}

const TransactionDetailsInvalid = () => {
	return <div class='p-2 border border-dashed border-white/30 my-4'>Invalid transaction hash</div>
}

const PageTitle = () => {
	return <div class='bg-white/10 text-xl font-bold px-6 py-2 -ml-6 mb-4'>Transaction Details</div>
}

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => {
	return (
		<>
			<div class='text-white/50 text-sm'>{label}</div>
			<div class='overflow-scroll no-scrollbar'>{value}</div>
		</>
	)
}

function extractTransactionHashFromParams() {
	const params = useParams()
	return params && 'transaction_hash' in params && isTransactionHash(params.transaction_hash) ? params.transaction_hash : null
}

const Grid = ({ children }: JSX.HTMLAttributes<HTMLDivElement>) => {
	return <div class='grid grid-cols-1 xl:grid-cols-[repeat(2,_minmax(min-content,_1fr))] gap-x-6'>{children}</div>
}

const GridItem = ({ children, class: className }: JSX.HTMLAttributes<HTMLDivElement>) => {
	const classNames = removeNonStringsAndTrim('border-b border-dashed border-white/10 py-2', className)
	return <div class={classNames}>{children}</div>
}
