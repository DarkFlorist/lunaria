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
			<GridItem title='Transaction Hash:' class='xl:col-span-full'>
				<TransactionHash transport={transaction.transactionResponseQuery.transport} />
			</GridItem>
			<GridItem title='From:'>
				<TransactionFrom transport={transaction.transactionResponseQuery.transport} />
			</GridItem>
			<GridItem title='To:'>
				<TransactionTo transport={transaction.transactionResponseQuery.transport} />
			</GridItem>
			<GridItem title='Amount:'>
				<TransactionAmount transport={transaction.transactionResponseQuery.transport} />
			</GridItem>
			<GridItem title='Transaction Fee:'>
				<TransactionFee transport={transaction.transactionReceiptQuery.transport} />
			</GridItem>
		</Grid>
	)
}

const TransactionHash = ({ transport }: { transport: Signal<AsyncProperty<TransactionResponse>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <InfoValue text='' />
		case 'rejected':
			return <InfoValue text='Failed to retrieve transaction hash.' />
		case 'pending':
			return <InfoSkeleton />
		case 'resolved':
			return <InfoValue text={response.value.hash} />
	}
}

const TransactionFrom = ({ transport }: { transport: Signal<AsyncProperty<TransactionResponse>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <InfoValue text='' />
		case 'rejected':
			return <InfoValue text='Failed to retrieve source address (from).' />
		case 'pending':
			return <InfoSkeleton />
		case 'resolved':
			return <InfoValue text={response.value.from} />
	}
}

const TransactionTo = ({ transport }: { transport: Signal<AsyncProperty<TransactionResponse>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <InfoValue text='' />
		case 'rejected':
			return <InfoValue text='Failed to retrieve destination address (to).' />
		case 'pending':
			return <InfoSkeleton />
		case 'resolved':
			return <InfoValue text={response.value.to!} />
	}
}

const TransactionAmount = ({ transport }: { transport: Signal<AsyncProperty<TransactionResponse>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <InfoValue text='' />
		case 'rejected':
			return <InfoValue text='Failed to retrieve amount.' />
		case 'pending':
			return <InfoSkeleton />
		case 'resolved':
			return <InfoValue text={`${ethers.utils.formatEther(response.value.value)} Ether`} />
	}
}

const TransactionFee = ({ transport }: { transport: Signal<AsyncProperty<TransactionReceipt>> }) => {
	const response = transport.value
	switch (response.state) {
		case 'inactive':
			return <InfoValue text='' />
		case 'rejected':
			return <InfoValue text='Failed to retrieve receipt.' />
		case 'pending':
			return <InfoSkeleton />
		case 'resolved': {
			const transactionFee = calculateGasFee(response.value.effectiveGasPrice, response.value.gasUsed)
			return <InfoValue text={`${transactionFee} Ether`} />
		}
	}
}

const TransactionDetailsInvalid = () => {
	return <div class='p-2 border border-dashed border-white/30 my-4'>Invalid transaction hash</div>
}

const PageTitle = () => {
	return <div class='bg-white/10 text-xl font-bold px-6 py-2 -ml-6 mb-4'>Transaction Details</div>
}

const InfoSkeleton = ({ class: className = 'w-full' }: { class?: string }) => {
	const classNames = removeNonStringsAndTrim('h-4 my-1 bg-white/30 animate-pulse rounded', className)
	return <div class={classNames} />
}
const InfoValue = ({ text }: { text: string }) => {
	return <div class='overflow-scroll no-scrollbar'>{text}</div>
}

function extractTransactionHashFromParams() {
	const params = useParams()
	return params && 'transaction_hash' in params && isTransactionHash(params.transaction_hash) ? params.transaction_hash : null
}

const Grid = ({ children }: JSX.HTMLAttributes<HTMLDivElement>) => {
	return <div class='grid grid-cols-1 xl:grid-cols-[repeat(2,_minmax(min-content,_1fr))] gap-x-6'>{children}</div>
}

const GridItem = ({ title, children, class: className }: JSX.HTMLAttributes<HTMLDivElement> & { title: string }) => {
	const classNames = removeNonStringsAndTrim('border-b border-dashed border-white/10 py-2', className)
	return (
		<div class={classNames}>
			<div class='text-white/50 text-sm'>{title}</div>
			{children}
		</div>
	)
}
