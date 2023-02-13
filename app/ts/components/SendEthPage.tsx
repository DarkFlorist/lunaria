import { ComponentChildren } from 'preact'
import * as Layout from './Layout.js'
import { AddressField } from './AddressField.js'
import { AmountField } from './AmountField.js'
import { assertUnreachable } from '../library/utilities.js'
import ErrorBoundary from './ErrorBoundary.js'
import { TransferProvider, useTransferStore } from './TransferContext.js'
import { ethers } from 'ethers'
import { createTransferStore } from '../store/transfer.js'
import { isEthereumJsonRpcError } from '../library/exceptions.js'
import { useAccountStore } from '../context/Account.js'

export const SendEthPage = () => {
	const transferStore = createTransferStore()

	return (
		<TransferProvider store={transferStore}>
			<Layout.Page>
				<Layout.Header />
				<Layout.Body>
					<Main />
				</Layout.Body>
				<Layout.Footer />
			</Layout.Page>
		</TransferProvider>
	)
}

const Main = () => {
	return (
		<ErrorBoundary>
			<SendForm>
				<FormLayout>
					<div class='[grid-area:token]'>
						<TokenSelectField />
					</div>
					<div class='[grid-area:amount]'>
						<SendAmountField />
					</div>
					<div class='[grid-area:address]'>
						<SendToField />
					</div>
					<div class='[grid-area:tip] overflow-auto border border-dashed border-white/30'>
						<SendGuide />
					</div>
					<div class='[grid-area:controls]'>
						<FormActions />
					</div>
				</FormLayout>
			</SendForm>
		</ErrorBoundary>
	)
}

const SendForm = ({ children }: { children: ComponentChildren }) => {
	const accountStore = useAccountStore()
	const transfer = useTransferStore()

	const handleSubmit = (event: Event) => {
		event.preventDefault()

		if (accountStore.value.state === 'disconnected') {
			accountStore.value.connect()
			return
		}

		if (!transfer.value.isSigned) {
			transfer.value.transactionResponseQuery.dispatch()
			return
		}

		window.location.href = `#tx/${transfer.value.transactionResponse.hash}`
		return
	}

	return <form onSubmit={handleSubmit}>{children}</form>
}

const SendGuide = () => {
	const transferStore = useTransferStore()

	if (transferStore.value.isSigned) return <Guide title='Request Successfully Sent!' content="Your transaction is awaiting confirmation from the chain. You may click on the View Transaction button to check it's status." />

	const transaction = transferStore.value.transactionResponseQuery.transport
	switch (transaction.value.state) {
		case 'inactive':
			return <Guide title='What happens when I click send?' content='This app will forward your request to the wallet you chose to connect with. The connected wallet handles signing and submitting your request to the chain.' />
		case 'pending':
			return <Guide title='Awaiting wallet confirmation...' content='At this point, your connected wallet will need action to proceed with this transaction. Carefully check the information before accepting the wallet confirmation.' />
		case 'rejected': {
			let errorMessage = isEthereumJsonRpcError(transaction.value.error) ? transaction.value.error.error.message : transaction.value.error.message
			return <Guide title='Wallet returned an error!' content='Check that your inputs are correct and click Send again.' quote={errorMessage} />
		}
		case 'resolved':
			return null
		default:
			assertUnreachable(transaction.value)
	}
}

const Guide = ({ title, quote, content }: { title: string; quote?: string; content: string }) => {
	return (
		<div class='p-4 text-center xl:text-left'>
			<div class='mb-3 font-bold'>{title}</div>
			{quote && <div class='leading-tight xl:border-l-4 xl:border-l-white/30 px-3 text-white/50 text-sm my-3'>{quote}</div>}
			<div class='leading-tight text-sm mt-3'>{content}</div>
		</div>
	)
}

const FormActions = () => {
	const accountStore = useAccountStore()

	switch (accountStore.value.state) {
		case 'disconnected':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>
					<span>Connect Wallet</span>
				</button>
			)
		case 'connecting':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full' disabled>
					<span>Connecting... </span>
				</button>
			)
		case 'failed':
			return <div class='px-4 py-2 bg-red-400/10 border border-red-400/50 text-white/50 text-center cursor-not-allowed'>Unable to connect to wallet!</div>
		case 'connected':
			return <FormActionButton />
	}
}

const FormActionButton = () => {
	const transferStore = useTransferStore()

	if (transferStore.value.isSigned) {
		return (
			<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>
				<span>View Transaction</span>
			</button>
		)
	}

	switch (transferStore.value.transactionResponseQuery.transport.value.state) {
		case 'inactive':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>
					<span>Send</span>
				</button>
			)
		case 'pending':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full disabled:text-white/50 disabled:border-white/30 disabled:cursor-not-allowed disabled:hover:bg-transparent' disabled>
					<span>Sending...</span>
				</button>
			)
		case 'rejected':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>
					<span>Retry?</span>
				</button>
			)
		case 'resolved':
			return null
	}
}

const TokenSelectField = () => {
	return (
		<div class='flex flex-col gap-1'>
			<div class='text-sm text-white/50'>Token</div>
			<div class='appearance-none relative flex items-center px-3 h-10 bg-white/5 w-full outline-none disabled:bg-white/5 disabled:text-white/30 invalid:text-red-200 border-b border-white/30 focus:border-b-white'>
				<div class='cursor-pointer'>ETH</div>
			</div>
		</div>
	)
}

const SendAmountField = () => {
	const transferStore = useTransferStore()

	if (transferStore.value.isSigned) {
		const fieldValue = ethers.utils.formatEther(transferStore.value.transactionResponse.value)
		return <AmountField value={fieldValue} onChange={() => {}} label='Amount' name='amount' disabled />
	}

	const formData = transferStore.value.formData
	return <AmountField value={formData.value.amount} onChange={amount => (formData.value = { ...formData.value, amount })} label='Amount' name='amount' disabled={transferStore.value.transactionResponseQuery.transport.value.state === 'pending'} required />
}

const SendToField = () => {
	const transferStore = useTransferStore()

	if (transferStore.value.isSigned) {
		const fieldValue = transferStore.value.transactionResponse.to!
		return <AddressField value={fieldValue} onChange={() => {}} label='To' name='to' disabled />
	}

	const formData = transferStore.value.formData
	return <AddressField value={formData.value.to} onChange={to => (formData.value = { ...formData.value, to })} label='To' name='to' disabled={transferStore.value.transactionResponseQuery.transport.value.state === 'pending'} required />
}

const PageTitle = () => {
	return (
		<div class='[grid-area:title]'>
			<div class='bg-white/10 text-xl font-bold px-6 py-2 -ml-6'>Send Funds</div>
		</div>
	)
}

const FormLayout = ({ children }: { children: ComponentChildren }) => {
	return (
		<div class='grid [grid-template-areas:_"title"_"token"_"amount"_"address"_"tip"_"controls"] grid-rows-[repeat(auto-fit,minmax(min-content,0))] gap-y-4 lg:[grid-template-areas:_"title_title"_"token_amount"_"address_address"_"tip_tip"_"controls_controls"] lg:gap-x-6 xl:[grid-template-areas:_"title_title_title"_"token_amount_tip"_"address_address_tip"_"controls_controls_tip"_"._._tip"] lg:grid-cols-2 xl:grid-cols-3'>
			<PageTitle />
			{children}
		</div>
	)
}
