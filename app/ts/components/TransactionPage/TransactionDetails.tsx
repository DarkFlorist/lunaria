import { useSignalEffect } from '@preact/signals'
import { formatEther, formatUnits } from 'ethers'
import SVGBlockie from '../SVGBlockie.js'
import { useRouter } from '../HashRouter.js'
import { TemplateRecorder } from '../TemplateRecorder.js'
import { Info, InfoError, InfoPending } from './Info.js'
import { useTransaction } from '../TransactionProvider.js'
import { EthereumAddress, TransferRequest } from '../../schema.js'
import { extractERC20TransferRequest } from '../../library/ethereum.js'
import { useTokenManager } from '../../context/TokenManager.js'

export const TransactionDetails = () => {
	const router = useRouter<{ transaction_hash: string }>()
	const { transactionHash } = useTransaction()

	useSignalEffect(() => {
		transactionHash.value = router.value.params.transaction_hash
	})

	return (
		<div class='grid gap-2'>
			<TransactionHash />
			<TransferFrom />
			<TransferTo />
			<TransferAmount />
			<TransferFee />
			<TemplateRecorder />
		</div>
	)
}

const TransactionHash = () => {
	const { transactionHash } = useTransaction()
	if (!transactionHash.value) return <></>
	return <Info label='Hash' value={transactionHash.value} allowCopy />
}

const TransferFrom = () => {
	const { response } = useTransaction()

	switch (response.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={response.value.error.message} />
		case 'resolved':
			const from = response.value.value?.from
			if (from === undefined) return <></>
			const blockieIcon = () => (
				<span class='text-4xl'>
					<SVGBlockie address={from} />
				</span>
			)
			return <Info label='From' value={from} icon={blockieIcon} allowCopy />
	}
}

const TransferTo = () => {
	const { receipt } = useTransaction()


	switch (receipt.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={receipt.value.error.message} />
		case 'resolved':
			const txReceipt = receipt.value.value

			if (txReceipt === null) return <></>

			const erc20Transfer = extractERC20TransferRequest(txReceipt)
			if (erc20Transfer) return <TokenRecipient transfer={erc20Transfer} />

			return <EthRecipient />
	}
}

const TokenRecipient = ({ transfer }: { transfer: TransferRequest }) => {
	const blockieIcon = () => <span class='text-4xl'><SVGBlockie address={transfer.to} /></span>
	return <Info label='To' value={transfer.to} icon={blockieIcon} allowCopy />
}

const EthRecipient = () => {
	const { response } = useTransaction()

	switch (response.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={response.value.error.message} />
		case 'resolved':
			if (!response.value.value) return <></>
			const parsedTo = EthereumAddress.safeParse(response.value.value.to)
			if (!parsedTo.success) return <InfoError displayText='Failed to get valid recipient address' message={parsedTo.message} />

			const blockieIcon = () => <span class='text-4xl'><SVGBlockie address={parsedTo.value} /></span>
			return <Info label='To' value={parsedTo.value} icon={blockieIcon} allowCopy />
	}
}

const TransferAmount = () => {
	const { receipt } = useTransaction()

	switch (receipt.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={receipt.value.error.message} />
		case 'resolved':
			const txReceipt = receipt.value.value
			if (txReceipt === null) return <></>

			const erc20Transfer = extractERC20TransferRequest(txReceipt)

			// display token amount for token transfer
			if (erc20Transfer) return <TokenAmount transfer={erc20Transfer} />

			// else display eth amount
			return <EthAmount />
	}
}

const TokenAmount = ({ transfer }: { transfer: TransferRequest }) => {
	const { cache } = useTokenManager()
	const getCachedToken = (address: EthereumAddress) => cache.value.data.find(token => token.address === address)

	if (!transfer) return <></>

	const token = transfer.contractAddress ? getCachedToken(transfer.contractAddress) : undefined
	if (!token) return <InfoError displayText='Unknown token contract' message={`Contract ${transfer.contractAddress} does not exist on your token list.`} />

	const displayAmount = `${formatUnits(transfer.quantity, token.decimals)} ${token.symbol}`
	return <Info label='Amount' value={displayAmount} />
}

const EthAmount = () => {
	const { response } = useTransaction()

	switch (response.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={response.value.error.message} />
		case 'resolved':
			const txResponse = response.value.value
			if (txResponse === null) return <></>
			const displayValue = `${formatEther(txResponse.value)} ETH`
			return <Info label='Amount' value={displayValue} />
	}
}


const TransferFee = () => {
	const { receipt } = useTransaction()

	switch (receipt.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <InfoPending />
		case 'rejected':
			return <InfoError displayText='Failed to load information' message={receipt.value.error.message} />
		case 'resolved':
			if (receipt.value.value === null) return <></>
			const transactionFee = `${formatEther(receipt.value.value.fee)} ETH`
			return <Info label='Transaction Fee' value={transactionFee} />
	}
}
