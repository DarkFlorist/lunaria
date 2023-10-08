import { Signal, useComputed, useSignal } from '@preact/signals'
import { useRouter } from '../HashRouter.js'
import { formatEther, TransactionReceipt, TransactionResponse } from 'ethers'
import { AsyncProperty } from '../../library/preact-utilities.js'
import { Info, InfoError, InfoPending } from './Info.js'
import { useTransaction } from '../../store/transaction.js'
import { calculateGasFee, extractArgValue, extractTransferLogFromSender } from '../../library/ethereum.js'
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
	// TODO: implement amount query
	console.log('token amount', receipt, addFavoriteStore)
	return <></>
}
