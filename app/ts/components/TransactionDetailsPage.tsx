import { ComponentChildren } from 'preact'
import { ethers } from 'ethers'
import * as Layout from './Layout.js'
import { useParams } from './HashRouter.js'
import { assertUnreachable, calculateGasFee, isTransactionHash } from '../library/utilities.js'
import { assertTransferStatus, transferStore } from '../store/transfer.js'
import { useAsyncState } from '../library/preact-utilities.js'
import * as Icon from "./Icon/index.js"

export const TransactionDetailsPage = () => {
	return (
		<Layout.Page>
			<Layout.Header />
			<Layout.Body>
				<PageTitle />
				<Main />
			</Layout.Body>
			<Layout.Footer />
		</Layout.Page>
	)
}

const Main = () => {
	const transfer = transferStore
	const hash = extractTransactionHashFromParams()

	if (!hash) return <TransactionDetailsInvalid />

	switch (transfer.value.status) {
		case 'idle':
			return <TransactionDetailsIdle />
		case 'signed':
			return <TransactionDetailsSigned />
		case 'confirmed':
			return <TransactionDetailsConfirmed />
		case 'new':
			return null // render should be handled in send page
		default: assertUnreachable(transfer.value)
	}
}

const TransactionDetailsIdle = () => {
	const transfer = transferStore.value
	const hash = extractTransactionHashFromParams()
	const [transactionResponse, resolveTransactionResponse, resetTransactionResponse] = useAsyncState()

	assertTransferStatus(transfer.status, 'idle')

	const fetchTransactionResponse = () => {
		resolveTransactionResponse(async () => {
			if (!hash || transferStore.value.status !== 'idle') return
			await transferStore.value.fetchTransactionByHash(hash)
		})
	}

	switch (transactionResponse.state) {
		case 'inactive':
			fetchTransactionResponse()
			return null
		case 'pending':
			return (
				<div class='grid grid-cols-1 xl:grid-cols-[repeat(2,_minmax(min-content,_1fr))] gap-x-6'>
					<div class='border-b border-dashed border-white/10 py-2 xl:col-span-full'>
						<div class='text-white/50 text-sm'>Transaction Hash:</div>
						<div class='w-full max-w-[40rem] h-4 my-1 bg-white/30 animate-pulse rounded' />
					</div>
					<InfoLabel>
						<div class='text-white/50 text-sm'>From:</div>
						<div class='w-96 h-4 my-1 bg-white/30 animate-pulse rounded' />
					</InfoLabel>
					<InfoLabel>
						<div class='text-white/50 text-sm'>To:</div>
						<div class='w-96 h-4 my-1 bg-white/30 animate-pulse rounded' />
					</InfoLabel>
					<InfoLabel>
						<div class='text-white/30 text-sm'>Amount:</div>
						<div class='w-64 h-4 my-1 bg-white/30 animate-pulse rounded' />
					</InfoLabel>
					<InfoLabel>
						<div class='text-white/50 text-sm'>Transacton Fee:</div>
						<div class='w-64 h-4 my-1 bg-white/30 animate-pulse rounded' />
					</InfoLabel>
				</div>

			)
		case 'rejected':
			return (
				<div class='border border-dashed border-red-400/30 bg-red-400/5 p-4 text-center'>
					<div>An issue was encounterd while obtaining transaction details.</div>
					<div class='px-2 py-1 text-sm text-white/50 my-2'>{transactionResponse.error.message}</div>
					<div class='flex flex-wrap justify-center gap-y-1 gap-x-6'>
						<button class='hover:underline underline-offset-4 flex items-center gap-1' onClick={() => resetTransactionResponse()}>
							<Icon.Refresh />
							<span>Retry</span>
						</button>
						<button class='hover:underline underline-offset-4 flex items-center gap-1' onClick={() => { }}>
							<Icon.Copy />
							<span>Copy Transaction Hash</span>
						</button>
					</div>
				</div>
			)
		case 'resolved':
			return null
		default: assertUnreachable(transactionResponse)
	}
}

const TransactionDetailsSigned = () => {
	const transfer = transferStore.value
	const [transactionReceipt, resolveTransactionReceipt, resetTransactionReceipt] = useAsyncState()

	const fetchTransactionReceipt = () => {
		resetTransactionReceipt()
		resolveTransactionReceipt(async () => {
			if (transfer.status !== 'signed') return
			await transfer.fetchTransactionReceipt()
		})
	}

	assertTransferStatus(transfer.status, 'signed')

	switch (transactionReceipt.state) {
		case 'inactive':
			fetchTransactionReceipt()
			return null
		case 'pending':
			return (
				<div class='grid grid-cols-1 xl:grid-cols-[repeat(2,_minmax(min-content,_1fr))] gap-x-6'>
					<div class='border-b border-dashed border-white/10 py-2 xl:col-span-full'>
						<div class='text-white/50 text-sm'>Transaction Hash:</div>
						<div class='overflow-scroll no-scrollbar'>{transfer.transactionResponse.hash}</div>
					</div>
					<InfoLabel>
						<div class='text-white/50 text-sm'>From:</div>
						<div>{transfer.transactionResponse.from}</div>
					</InfoLabel>
					<InfoLabel>
						<div class='text-white/50 text-sm'>To:</div>
						<div>{transfer.transactionResponse.to}</div>
					</InfoLabel>
					<InfoLabel>
						<div class='text-white/50 text-sm'>Amount:</div>
						<div>{ethers.utils.formatEther(transfer.transactionResponse.value)} Ether</div>
					</InfoLabel>
					<InfoLabel>
						<div class='text-white/50 text-sm'>Transacton Fee:</div>
						<div class='w-64 h-4 my-1 bg-white/30 animate-pulse rounded' />
					</InfoLabel>
				</div>
			)
		case 'rejected':
			return (
				<div class='border border-dashed border-red-400/30 bg-red-400/5 p-4 text-center'>
					<div>An issue was encounterd while obtaining transaction details.</div>
					<div class='px-2 py-1 text-sm text-white/50 my-2'>{transactionReceipt.error.message}</div>
					<div class='flex flex-wrap justify-center gap-y-1 gap-x-6'>
						<button class='hover:underline underline-offset-4 flex items-center gap-1' onClick={() => resetTransactionReceipt()}>
							<Icon.Refresh />
							<span>Retry</span>
						</button>
						<button class='hover:underline underline-offset-4 flex items-center gap-1' onClick={() => { }}>
							<Icon.Copy />
							<span>Copy Transaction Hash</span>
						</button>
					</div>
				</div>
			)
		case 'resolved':
			return null
		default: assertUnreachable(transactionReceipt)
	}
}

const TransactionDetailsConfirmed = () => {
	const transfer = transferStore.value

	assertTransferStatus(transfer.status, 'confirmed')

	const transactionFee = calculateGasFee(transfer.transactionReceipt.effectiveGasPrice, transfer.transactionReceipt.gasUsed)

	return (
		<div class='grid grid-cols-1 xl:grid-cols-[repeat(2,_minmax(min-content,_1fr))] gap-x-6'>
			<div class='border-b border-dashed border-white/10 py-2 xl:col-span-full'>
				<div class='text-white/50 text-sm'>Transaction Hash:</div>
				<div class='overflow-scroll no-scrollbar'>{transfer.transactionResponse.hash}</div>
			</div>
			<InfoLabel>
				<div class='text-white/50 text-sm'>From:</div>
				<div>{transfer.transactionResponse.from}</div>
			</InfoLabel>
			<InfoLabel>
				<div class='text-white/50 text-sm'>To:</div>
				<div>{transfer.transactionResponse.to}</div>
			</InfoLabel>
			<InfoLabel>
				<div class='text-white/50 text-sm'>Amount:</div>
				<div>{ethers.utils.formatEther(transfer.transactionResponse.value)} Ether</div>
			</InfoLabel>
			<InfoLabel>
				<div class='text-white/50 text-sm'>Transacton Fee:</div>
				<div>{transactionFee} Ether</div>
			</InfoLabel>
		</div>
	)
}

const TransactionDetailsInvalid = () => {
	return <div class='p-2 border border-dashed border-white/30 my-4'>Invalid transaction hash</div>
}

const PageTitle = () => {
	return <div class='bg-white/10 text-xl font-bold px-6 py-2 -ml-6 mb-4'>Transaction Details</div>
}

const InfoLabel = ({ children }: { children: ComponentChildren }) => <div class='border-b border-dashed border-white/10 py-2'>{children}</div>

function extractTransactionHashFromParams() {
	const params = useParams()
	return params && 'transaction_hash' in params && isTransactionHash(params.transaction_hash) ? params.transaction_hash : null
}
