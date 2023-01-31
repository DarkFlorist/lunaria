import { ComponentChildren } from 'preact'
import * as Layout from './Layout.js'
import { AddressField } from './AddressField.js'
import { AmountField } from './AmountField.js'
import { accountStore } from '../store/account.js'
import { assertUnreachable } from '../library/utilities.js'
import { transferStore } from '../store/transfer.js'
import { ethers } from 'ethers'
import ErrorBoundary from './ErrorBoundary.js'
import { useEffect } from 'preact/hooks'
import { TransferProvider, useTransfer } from './TransferContext.js'

export const SendEthPage = () => {
	return (
		<Layout.Page>
			<Layout.Header />
			<Layout.Body>
				<ErrorBoundary>
					<Main />
				</ErrorBoundary>
			</Layout.Body>
			<Layout.Footer />
		</Layout.Page>
	)
}

const Main = () => {
	useEffect(() => {
		// on mount, set the state to enable form composition
		if (transferStore.value.status !== 'idle') return
		transferStore.value.createNewTransfer()
	}, [])

	return (
		<TransferProvider>
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
						<SendActions />
					</div>
				</FormLayout>
			</SendForm>
		</TransferProvider>
	)
}

const SendGuide = () => {
	const { asyncResponse } = useTransfer()
	const [transactionResponse] = asyncResponse

	switch (transactionResponse.state) {
		case 'inactive':
			return (
				<Guide title='What happens when I click send?' content='This app will forward your request to the wallet you chose to connect with. The connected wallet handles signing and submitting your request to the chain.' />
			)
		case 'pending':
			return (
				<Guide title='Awaiting wallet confirmation...' content='At this point, your connected wallet will need action to proceed with this transaction. Carefully check the information before accepting the wallet confirmation.' />
			)
		case 'resolved':
			return (
				<Guide title='Request Successfully Sent!' content='Your transaction is awaiting confirmation from the chain. You may click on the View Transaction button to check it&apos;s status.' />
			)
		case 'rejected':
			return (
				<Guide title='Wallet returned an error!' content='Check that your inputs are correct and click Send again.' quote={transactionResponse.error.message} />
			)
		default: assertUnreachable(transactionResponse)
	}
}

const Guide = ({ title, quote, content }: { title: string; quote?: string, content: string }) => {
	return (
		<div class='p-4 text-center xl:text-left'>
			<div class='mb-3 font-bold'>{title}</div>
			{quote && <div class='leading-tight xl:border-l-4 xl:border-l-white/30 px-3 text-white/50 text-sm my-3'>{quote}</div>}
			<div class='leading-tight text-sm mt-3'>{content}</div>
		</div>
	)
}

const SendActions = () => {
	const account = accountStore

	switch (account.value.status) {
		case 'busy':
			return <div class='px-4 py-2 hover:bg-white/10 border w-full'>Connecting...</div>
		case 'connected':
			return <ActionsConnected />
		case 'disconnected':
			return <button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>Connect Wallet</button>
		case 'rejected':
			return <div class='px-4 py-2 bg-red-400/10 border border-red-400/50 text-white/50 text-center cursor-not-allowed'>Unable to connect to wallet!</div>
	}
}

const ActionsConnected = () => {
	const transfer = transferStore.value
	switch (transfer.status) {
		case 'new':
			return <button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>Send</button>
		case 'signed':
			return <button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>View Transaction</button>
		case 'confirmed':
		case 'idle':
			return <button type='submit' class='px-4 py-2 bg-white/10 text-white/20 w-full' disabled>Loading...</button>
		default: assertUnreachable(transfer)
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

const SendForm = ({ children }: { children: ComponentChildren }) => {
	const { asyncResponse, store: transfer } = useTransfer()
	const [_transactionResponse, resolveTransactionResponse] = asyncResponse

	switch (transfer.status) {
		case 'new':
			return <form onSubmit={(event: Event) => { event.preventDefault(); resolveTransactionResponse() }}>{children}</form>
		case 'signed':
			return <form onSubmit={(event: Event) => { event.preventDefault(); location.href = `#tx/${transfer.transactionResponse.hash}` }}>{children}</form>
		case 'confirmed':
		case 'idle':
		case 'signed':
			return <>{children}</>
		default: assertUnreachable(transfer)
	}

}

const SendAmountField = () => {
	const { asyncResponse, store: transfer } = useTransfer()
	const [transactionResponse] = asyncResponse

	const handleChange = (amount: string) => {
		if (transfer.status !== 'new') return // ignore input for other states
		transferStore.value = { ...transfer, transactionRequest: { ...transfer.transactionRequest, amount } }
	}

	switch (transfer.status) {
		case 'new':
			return <AmountField value={transfer.transactionRequest.amount} onChange={handleChange} label='Amount' name='amount' disabled={transactionResponse.state === 'pending'} required />
		case 'signed':
			return <AmountField value={ethers.utils.formatEther(transfer.transactionResponse.value!)} onChange={handleChange} label='Amount' name='amount' disabled />
		case 'idle':
		case 'confirmed':
			return null
		default: assertUnreachable(transfer)
	}
}

const SendToField = () => {
	const { asyncResponse, store: transfer } = useTransfer()
	const [transactionResponse] = asyncResponse

	const handleChange = (to: string) => {
		if (transfer.status !== 'new') return // ignore input for other states
		transferStore.value = { ...transfer, transactionRequest: { ...transfer.transactionRequest, to } }
	}

	switch (transfer.status) {
		case 'new':
			return <AddressField value={transfer.transactionRequest.to} onChange={handleChange} label='To' name='to' disabled={transactionResponse.state === 'pending'} required />
		case 'signed':
			return <AddressField value={transfer.transactionResponse.to!} onChange={handleChange} label='To' name='to' disabled />
		case 'idle':
		case 'confirmed':
			return null
		default: assertUnreachable(transfer)
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
