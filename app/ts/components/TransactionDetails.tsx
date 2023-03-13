import { ethers } from 'ethers'
import { JSX } from 'preact/jsx-runtime'
import { queryTransactionReceipt, queryTransactionResponse, TransactionProvider } from '../context/Transaction.js'
import { calculateGasFee, isTransactionHash, removeNonStringsAndTrim } from '../library/utilities.js'
import { AsyncText } from './AsyncText.js'
import { CopyButton } from './CopyButton.js'
import { useParams } from './HashRouter.js'
import * as Layout from './Layout.js'

export const TransactionDetails = () => {
	const transactionHashFromUrl = extractTransactionHashFromParams()

	if (!transactionHashFromUrl) return <TransactionDetailsInvalid />

	return (
		<TransactionProvider transactionHash={transactionHashFromUrl}>
			<Layout.Page>
				<Layout.Header />
				<Layout.Body>
					<PageTitle />
					<Grid>
						<TransactionResponseDetails />
						<TransactionReceiptDetails />
					</Grid>
				</Layout.Body>
				<Layout.Footer />
			</Layout.Page>
		</TransactionProvider>
	)
}

const TransactionResponseDetails = () => {
	const txResponse = queryTransactionResponse()

	if (txResponse.data === undefined) return null
	const errorMessage = txResponse.error instanceof Error ? 'Failed to fetch transaction response.' : undefined

	return (
		<>
			<GridItem class='xl:col-span-full'>
				<ReadOnlyField label='Transaction Hash:' isLoading={txResponse.isLoading} error={errorMessage} value={txResponse.data.hash} />
			</GridItem>
			<GridItem>
				<ReadOnlyField label='From:' value={txResponse.data.from} error={errorMessage} isLoading={txResponse.isLoading} />
			</GridItem>
			<GridItem>
				<ReadOnlyField label='To:' value={txResponse.data.to!} error={errorMessage} isLoading={txResponse.isLoading} />
			</GridItem>
			<GridItem>
				<ReadOnlyField label='To:' value={ethers.utils.formatEther(txResponse.data.value)} error={errorMessage} isLoading={txResponse.isLoading} />
			</GridItem>
		</>
	)
}

const TransactionReceiptDetails = () => {
	const txReceipt = queryTransactionReceipt()
	if (txReceipt.data === undefined) return null
	const transactionFee = calculateGasFee(txReceipt.data.effectiveGasPrice, txReceipt.data.gasUsed)
	return (
		<GridItem>
			<ReadOnlyField label='Transaction Fee:' value={transactionFee} isLoading={txReceipt.isLoading} />
		</GridItem>
	)
}

const TransactionDetailsInvalid = () => {
	return <div class='p-2 border border-dashed border-white/30 my-4'>Invalid transaction hash</div>
}

const PageTitle = () => {
	return <div class='bg-white/10 text-xl font-bold px-6 py-2 -ml-6 mb-4'>Transaction Details</div>
}

type ReadOnlyFieldProps = {
	label: string
	value?: string
	isLoading?: boolean
	error?: string
}

const ReadOnlyField = ({ label, value, isLoading, error }: ReadOnlyFieldProps) => {
	return (
		<div class='grid [grid-template-areas:"label_copy"_"text_text"] grid-cols-[1fr_min-content] place-content-between'>
			<div style={{ gridArea: 'label' }}>
				<span class='text-white/50 text-sm'>{label}</span>
			</div>
			{value === undefined ? (
				<></>
			) : (
				<div style={{ gridArea: 'copy' }}>
					<CopyButton label='Copy' value={value} />
				</div>
			)}
			<div style={{ gridArea: 'text' }}>{isLoading ? <AsyncText /> : <span class='overflow-scroll no-scrollbar'>{error || value}</span>}</div>
		</div>
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
