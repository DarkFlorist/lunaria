import { Signal, useComputed, useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { useRouter } from '../HashRouter.js'
import { formatEther, formatUnits, TransactionReceipt, TransactionReceiptParams, TransactionResponse } from 'ethers'
import { AsyncProperty, useAsyncState } from '../../library/preact-utilities.js'
import { useProviders } from '../../store/provider.js'
import { Info, InfoError, InfoPending } from './Info.js'
import { useTransaction } from '../../store/transaction.js'
import { calculateGasFee, extractArgValue, extractTransferLogFromSender } from '../../library/ethereum.js'
import { useTokenQuery } from '../../store/tokens.js'
import { SaveTransfer } from './SaveTransfer.js'
import { FavoriteModel } from '../../store/favorites.js'
import SVGBlockie from '../SVGBlockie.js'

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
			const source = response.value.value.from
			addFavoriteStore.value = { ...addFavoriteStore.peek(), source }

			const blockieIcon = () => (
				<span class='text-4xl'>
					<SVGBlockie address={source} />
				</span>
			)
			return (
				<>
					<Info label='Hash' value={response.value.value.hash} allowCopy />
					<Info label='From' value={response.value.value.from} icon={blockieIcon} allowCopy />
					<EthRecipient response={response.value.value} addFavoriteStore={addFavoriteStore} />
					<EthAmount response={response.value.value} addFavoriteStore={addFavoriteStore} />
				</>
			)
	}
}

type DataFromReceiptProps = {
	receipt: Signal<AsyncProperty<TransactionReceipt | null>>
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
			if (receipt.value.value === null) return <></>

			const transactionFee = calculateGasFee(receipt.value.value.gasPrice, receipt.value.value.gasUsed)
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
	if (response.value === 0n) return <></>
	const ethAmount = formatEther(response.value)

	addFavoriteStore.value = { ...addFavoriteStore.peek(), amount: ethAmount }

	return <Info label='Amount' value={ethAmount} suffix=' ETH' />
}

type EthRecipientProps = {
	response: TransactionResponse
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}
const EthRecipient = ({ response, addFavoriteStore }: EthRecipientProps) => {
	if (response.value === 0n || response.to === null) return <></>

	const recipientAddress = response.to
	addFavoriteStore.value = { ...addFavoriteStore.peek(), recipientAddress }

	const blockieIcon = () => (
		<span class='text-4xl'>
			<SVGBlockie address={recipientAddress} />
		</span>
	)

	return <Info label='Recipient' value={recipientAddress} icon={blockieIcon} allowCopy />
}

type TokenRecipientProps = {
	receipt: TransactionReceipt
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}

const TokenRecipient = ({ receipt, addFavoriteStore }: TokenRecipientProps) => {
	const txLog = extractTransferLogFromSender(receipt)
	if (txLog === null) return <></>

	const recipientAddress = extractArgValue<string>(txLog, 'to')
	if (recipientAddress === null) return <></>

	addFavoriteStore.value = { ...addFavoriteStore.peek(), recipientAddress }

	const blockieIcon = () => (
		<span class='text-4xl'>
			<SVGBlockie address={recipientAddress} />
		</span>
	)

	return <Info label='Recipient' value={recipientAddress} icon={blockieIcon} allowCopy />
}

type TokenAmountProps = {
	receipt: TransactionReceipt
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}

const TokenAmount = ({ receipt, addFavoriteStore }: TokenAmountProps) => {
	const { query, tokenAddress } = useTokenQuery()

	if (receipt.to === null) return <></>
	tokenAddress.value = receipt.to

	const txLog = extractTransferLogFromSender(receipt)
	if (txLog === null) return <></>

	const tokenValue = extractArgValue<bigint>(txLog, 'value')
	if (tokenValue === null) return <></>

	switch (query.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to get token amount' message={query.value.error.message} />
		case 'resolved':
			const { decimals, symbol } = query.value.value
			const amount = formatUnits(tokenValue, decimals)
			addFavoriteStore.value = { ...addFavoriteStore.peek(), amount, token: query.value.value }
			return <Info label='Amount' value={`${amount} ${symbol}`} />
	}
}

const AccountBalance = ({ receipt, onResolve }: { receipt: TransactionReceiptParams; onResolve?: (amount: bigint) => void }) => {
	const providers = useProviders()
	const { value: asyncBalance, waitFor } = useAsyncState<bigint>()

	const getBalance = () => {
		const { from, blockNumber } = receipt
		waitFor(async () => {
			return await providers.browserProvider.getBalance(from, blockNumber)
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
			const balance = formatEther(asyncBalance.value.value)
			return <Info label='Balance Before Transaction' value={balance} suffix=' ETH' />
	}
}
