import { Signal } from '@preact/signals'
import { BigNumber, ethers } from 'ethers'
import { useEffect } from 'preact/hooks'
import { useRouter } from '../HashRouter.js'
import { TransactionReceipt, TransactionResponse } from '../../types.js'
import { AsyncProperty, useAsyncState } from '../../library/preact-utilities.js'
import { useProviders } from '../../store/provider.js'
import { calculateGasFee } from '../../library/utilities.js'
import { Info, InfoError, InfoPending } from './Info.js'
import { useTransaction } from '../../store/transaction.js'
import { parseLogArgsFromReceipt } from '../../library/ethereum.js'
import { useTokenQuery } from '../../store/tokens.js'

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
					<EthRecipient response={response.value.value} />
					<EthAmount response={response.value.value} />
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
					<TokenRecipient receipt={receipt.value.value} />
					<TokenAmount receipt={receipt.value.value} />
					<Info label='Transaction Fee' value={`${transactionFee} ETH`} />
					<AccountBalance receipt={receipt.value.value} />
				</>
			)
	}
}

const EthAmount = (props: { response: TransactionResponse }) => {
	const { response } = props

	if (response.value.eq(0)) return <></>
	const ethAmount = ethers.utils.formatEther(response.value)

	return <Info label='Amount' value={ethAmount} suffix=' ETH' />
}

const EthRecipient = (props: { response: TransactionResponse }) => {
	const { response } = props

	if (response.value.eq(0) || response.to === undefined) return <></>

	return <Info label='Recipient' value={response.to} allowCopy />
}

const TokenRecipient = ({ receipt }: { receipt: TransactionReceipt }) => {
	const logArgs = parseLogArgsFromReceipt(receipt)
	if (logArgs === undefined) return <></>

	return <Info label='Recipient' value={logArgs.to} allowCopy />
}

const TokenAmount = ({ receipt }: { receipt: TransactionReceipt }) => {
	const { query, tokenAddress } = useTokenQuery()
	const logArgs = parseLogArgsFromReceipt(receipt)
	if (logArgs === undefined) return <></>

	tokenAddress.value = receipt.to

	switch (query.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to get token amount' message={query.value.error.message} />
		case 'resolved':
			const { decimals, symbol } = query.value.value
			return <Info label='Amount' value={`${ethers.utils.formatUnits(logArgs.value, decimals)} ${symbol}`} allowCopy />
	}
}

const AccountBalance = ({ receipt }: { receipt: TransactionReceipt }) => {
	const providers = useProviders()
	const { value: asyncBalance, waitFor } = useAsyncState<BigNumber>()

	const getBalance = () => {
		const { from, blockNumber } = receipt
		waitFor(async () => {
			const provider = providers.getbrowserProvider()
			return await provider.getBalance(from, blockNumber)
		})
	}

	useEffect(() => {
		getBalance()
	}, [receipt.blockNumber])

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
