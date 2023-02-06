import { ComponentChildren } from 'preact'
import * as Layout from './Layout.js'
import { AddressField } from './AddressField.js'
import { AmountField } from './AmountField.js'
import { assertUnreachable } from '../library/utilities.js'
import ErrorBoundary from './ErrorBoundary.js'
import { TransferProvider, useTransferStore } from './TransferContext.js'
import { useAccountStore } from './AccountContext.js'
import { AsyncProperty } from '../library/preact-utilities.js'
import { TransactionResponse } from '../types.js'
import { ethers } from 'ethers'
import { createTransferStore } from '../store/transfer.js'

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
	const transfer = useTransferStore().value

	const handleSubmit = (event: Event) => {
		event.preventDefault()

		switch (transfer.state) {
			case 'new':
				transfer.response.dispatch()
				return
			case 'signed':
				location.href = `#tx/${transfer.transactionResponse?.hash}`
				return
			case 'confirmed':
				return
			default:
				assertUnreachable(transfer)
		}
	}

	return (
		<ErrorBoundary>
			<form onSubmit={handleSubmit}>
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
			</form>
		</ErrorBoundary>
	)
}

const SendGuide = () => {
	const transfer = useTransferStore().value

	if (transfer.state !== 'new') return null

	const transaction = transfer.response.signal
	switch (transaction.value.state) {
		case 'inactive':
			return <Guide title='What happens when I click send?' content='This app will forward your request to the wallet you chose to connect with. The connected wallet handles signing and submitting your request to the chain.' />
		case 'pending':
			return <Guide title='Awaiting wallet confirmation...' content='At this point, your connected wallet will need action to proceed with this transaction. Carefully check the information before accepting the wallet confirmation.' />
		case 'resolved':
			return <Guide title='Request Successfully Sent!' content="Your transaction is awaiting confirmation from the chain. You may click on the View Transaction button to check it's status." />
		case 'rejected':
			return <Guide title='Wallet returned an error!' content='Check that your inputs are correct and click Send again.' quote={transaction.value.error.message} />
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
	const account = useAccountStore().value

	switch (account.status) {
		case 'connected':
			return <FormActionButton />
		case 'disconnected':
			return <ConnectWalletButton />
		case 'failed':
			return <div class='px-4 py-2 bg-red-400/10 border border-red-400/50 text-white/50 text-center cursor-not-allowed'>Unable to connect to wallet!</div>
	}
}

const ConnectWalletButton = () => {
	const account = useAccountStore().value
	if (account.status !== 'disconnected') throw new Error('ConnectWalletButton')

	switch (account.connect.signal.value.state) {
		case 'inactive':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>
					<span>Connect Wallet</span>
				</button>
			)
		case 'pending':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full' disabled>
					<span>Connecting... </span>
				</button>
			)
		case 'rejected':
		case 'resolved':
			return null
	}
}

const FormActionButton = () => {
	const transfer = useTransferStore().value

	switch (transfer.state) {
		case 'new':
			return <SendButton transferState={transfer.response.signal.value.state} />
		case 'signed':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>
					<span>View Transaction</span>
				</button>
			)
		case 'confirmed':
			return null
		default:
			assertUnreachable(transfer)
	}
}

const SendButton = ({ transferState }: { transferState: AsyncProperty<TransactionResponse>['state'] }) => {
	switch (transferState) {
		case 'inactive':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>
					<span>Send</span>
				</button>
			)
		case 'pending':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full' disabled>
					<span>Sending...</span>
				</button>
			)
		case 'rejected':
			return (
				<button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full' disabled>
					<span>Something went wrong...</span>
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
	const transfer = useTransferStore().value

	switch (transfer.state) {
		case 'new':
			return <AmountField value={transfer.formData.value.amount} onChange={amount => (transfer.formData.value = { ...transfer.formData.value, amount })} label='Amount' name='amount' disabled={transfer.response.signal.value.state === 'pending'} required />
		case 'signed': {
			const fieldValue = transfer.transactionResponse?.value ? ethers.utils.formatEther(transfer.transactionResponse?.value) : ''
			return <AmountField value={fieldValue} onChange={() => {}} label='Amount' name='amount' disabled />
		}
		case 'confirmed':
			return null
	}
}

const SendToField = () => {
	const transfer = useTransferStore().value

	switch (transfer.state) {
		case 'new':
			return <AddressField value={transfer.formData.value.to} onChange={to => (transfer.formData.value = { ...transfer.formData.value, to })} label='To' name='to' disabled={transfer.response.signal.value.state === 'pending'} required />
		case 'signed': {
			const fieldValue = transfer.transactionResponse?.to ? ethers.utils.formatEther(transfer.transactionResponse?.to) : ''
			return <AddressField value={fieldValue} onChange={() => {}} label='To' name='to' disabled />
		}
		case 'confirmed':
			return null
	}
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
		<div class='grid [grid-template-areas:_"title"_"token"_"amount"_"address"_"tip"_"controls"] grid-rows-[repeat(auto-fit,minmax(min-content,0))] gap-y-4 lg:[grid-template-areas:_"title_title"_"token_amount"_"address_address"_"tip_tip"_"controls_controls"] lg:gap-x-6 xl:[grid-template-areas:_"title_title_title"_"token_amount_tip"_"address_address_tip"_"controls_controls_tip"] lg:grid-cols-2 xl:grid-cols-3'>
			<PageTitle />
			{children}
		</div>
	)
}
