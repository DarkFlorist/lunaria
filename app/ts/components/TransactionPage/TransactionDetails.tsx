import { Signal, useComputed, useSignal } from '@preact/signals'
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
import { SaveTransfer } from './SaveTransfer.js'
import { FavoriteModel } from '../../store/favorites.js'

export const TransactionDetails = () => {
	const favorite = useSignal<Partial<FavoriteModel> | undefined>(undefined)
	const router = useRouter<{ transaction_hash: string }>()
	const { transactionResponse, transactionReceipt } = useTransaction(router.value.params.transaction_hash)

	const isDoneFetching = useComputed(() => transactionResponse.value.state === 'resolved' && transactionReceipt.value.state === 'resolved')

	return (
		<div class='grid gap-2'>
			<DataFromResponse response={transactionResponse} addFavoriteStore={favorite} />
			<DataFromReceipt receipt={transactionReceipt} addFavoriteStore={favorite} />
			<SaveTransfer show={isDoneFetching.value} addFavoriteStore={favorite} />
		</div>
	)
}

type DataFromResponseProps = {
	response: Signal<AsyncProperty<TransactionResponse>>
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}

const DataFromResponse = ({ response, addFavoriteStore }: DataFromResponseProps) => {
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
			addFavoriteStore.value = { ...addFavoriteStore.peek(), source: response.value.value.from }
			return (
				<>
					<Info label='Hash' value={response.value.value.hash} allowCopy />
					<Info label='From' value={response.value.value.from} allowCopy />
					<EthRecipient response={response.value.value} addFavoriteStore={addFavoriteStore} />
					<EthAmount response={response.value.value} addFavoriteStore={addFavoriteStore} />
				</>
			)
	}
}

type DataFromReceiptProps = {
	receipt: Signal<AsyncProperty<TransactionReceipt>>
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}

const DataFromReceipt = ({ receipt, addFavoriteStore }: DataFromReceiptProps) => {
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
					<TokenRecipient receipt={receipt.value.value} addFavoriteStore={addFavoriteStore} />
					<TokenAmount receipt={receipt.value.value} addFavoriteStore={addFavoriteStore} />
					<Info label='Transaction Fee' value={`${transactionFee} ETH`} />
					<AccountBalance receipt={receipt.value.value} />
				</>
			)
	}
}

type EthAmountProps = {
	response: TransactionResponse
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}

const EthAmount = ({ response, addFavoriteStore }: EthAmountProps) => {
	if (response.value.eq(0)) return <></>
	const ethAmount = ethers.utils.formatEther(response.value)

	addFavoriteStore.value = { ...addFavoriteStore.peek(), amount: ethAmount }

	return <Info label='Amount' value={ethAmount} suffix=' ETH' />
}

type EthRecipientProps = {
	response: TransactionResponse
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}
const EthRecipient = ({ response, addFavoriteStore }: EthRecipientProps) => {
	if (response.value.eq(0) || response.to === undefined) return <></>

	addFavoriteStore.value = { ...addFavoriteStore.peek(), recipientAddress: response.to }

	return <Info label='Recipient' value={response.to} allowCopy />
}

type TokenRecipientProps = {
	receipt: TransactionReceipt
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}
const TokenRecipient = ({ receipt, addFavoriteStore }: TokenRecipientProps) => {
	const logArgs = parseLogArgsFromReceipt(receipt)
	if (logArgs === undefined) return <></>

	addFavoriteStore.value = { ...addFavoriteStore.peek(), recipientAddress: logArgs.to }

	return <Info label='Recipient' value={logArgs.to} allowCopy />
}

type TokenAmountProps = {
	receipt: TransactionReceipt
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}

const TokenAmount = ({ receipt, addFavoriteStore }: TokenAmountProps) => {
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
			const amount = ethers.utils.formatUnits(logArgs.value, decimals)
			addFavoriteStore.value = { ...addFavoriteStore.peek(), amount, token: query.value.value }
			return <Info label='Amount' value={`${amount} ${symbol}`} allowCopy />
	}
}

const AccountBalance = ({ receipt, onResolve }: { receipt: TransactionReceipt; onResolve?: (amount: BigNumber) => void }) => {
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
			onResolve?.(asyncBalance.value.value)
			const balance = ethers.utils.formatEther(asyncBalance.value.value)
			return <Info label='Balance Before Transaction' value={balance} suffix=' ETH' />
	}
}
