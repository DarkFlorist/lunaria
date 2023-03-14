import { ethers } from 'ethers'
import { useMemo } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { queryTransactionReceipt, queryTransactionResponse, queryTransactionToken, TransactionProvider } from '../context/Transaction.js'
import { getTransferTokenValue } from '../library/ethereum.js'
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
	const { data, isLoading, error } = queryTransactionResponse()

	const response = isLoading === false && error === undefined ? data : undefined
	const errorMessage = 'Failed to fetch transaction resopnse'

	return (
		<>
			<GridItem class='xl:col-span-full'>
				<ReadOnlyField label='Transaction Hash:' isLoading={isLoading} value={response ? response.hash : errorMessage} />
			</GridItem>
			<GridItem>
				<ReadOnlyField label='From:' isLoading={isLoading} value={response ? response.from : errorMessage} />
			</GridItem>
			<GridItem>
				<ReadOnlyField label='To:' isLoading={isLoading} value={response ? response.to! : errorMessage} />
			</GridItem>
			<GridItem>
				<ReadOnlyField label='Amount:' isLoading={isLoading} value={response ? ethers.utils.formatEther(response.value) : errorMessage} />
			</GridItem>
		</>
	)
}

const TransactionReceiptDetails = () => {
	const { data, isLoading, error } = queryTransactionReceipt()
	const txToken = queryTransactionToken()

	const receipt = isLoading === false && error === undefined ? data : undefined
	const errorMessage = 'Failed to fetch transaction receipt'

	const tokenValue = useMemo(() => {
		if (txToken === undefined) return
		if (receipt === undefined) return
		const valueBigNumber = getTransferTokenValue(receipt)

		return ethers.utils.formatUnits(valueBigNumber, txToken.decimals)
	}, [receipt, txToken])

	return (
		<>
			<GridItem>
				<ReadOnlyField label='Transaction Fee:' value={receipt ? calculateGasFee(receipt.effectiveGasPrice, receipt.gasUsed) : errorMessage} isLoading={isLoading} />
			</GridItem>
			{txToken === undefined ? (
				<></>
			) : (
				<GridItem>
					<ReadOnlyField label='Token Transferred:' value={`${tokenValue} ${txToken.symbol}`} isLoading={isLoading} />
				</GridItem>
			)}
		</>
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
	value: string
	isLoading?: boolean
}

const ReadOnlyField = ({ label, value, isLoading }: ReadOnlyFieldProps) => {
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
			<div style={{ gridArea: 'text' }}>{isLoading ? <AsyncText /> : <span class='overflow-scroll no-scrollbar'>{value}</span>}</div>
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
