import * as Layout from './Layout.js'
import * as Icon from './Icon/index.js'
import { ConnectToWallet } from './ConnectToWallet.js'
import { AddressField } from './AddressField.js'
import { AmountField } from './AmountField.js'
import { ComponentChildren } from 'preact'
import { sendTransactionStore, TransactionComposing, TransactionFailed, TransactionStore } from '../store/transaction.js'
import { accountStore } from '../store/account.js'
import { useEffect } from 'preact/hooks'
import { assertUnreachable } from '../library/utilities.js'

export const SendEthPage = () => {
	return (
		<Page>
			<Header>
				<div class='[grid-area:brand]'>
					<Branding />
				</div>
				<div class='[grid-area:profile]'>
					<ConnectToWallet />
				</div>
			</Header>

			<Body>
				<div class='[grid-area:essentials]'>
					<ActiveNetwork />
					<EthBalance />
				</div>
				<div class='[grid-area:main]'>
					<Main />
				</div>
				<div class='[grid-area:aside]'>
					<Support />
				</div>
			</Body>

			<Footer />
		</Page>
	)
}

export type SendTransactionInput = {
	amount: string
	to: string
}

const Page = ({ children }: { children: ComponentChildren }) => {
	return (
		<Layout.Page class='grid [grid-template-areas:_"header"_"body"_"footer"] grid-rows-[minmax(min-content,max-content)_minmax(min-content,auto)_minmax(min-content,max-content)]'>{children} </Layout.Page>
	)
}

const Header = ({ children }: { children: ComponentChildren }) => <Layout.Header class='grid [grid-template-areas:_"brand"_"profile"] md:[grid-template-areas:_"brand_profile"] md:items-center md:justify-between gap-4 py-4 px-6'>{children}</Layout.Header>

const Body = ({ children }: { children: ComponentChildren }) => <Layout.Body class='grid gap-6 [grid-template-areas:_"essentials"_"main"_"aside"] md:[grid-template-areas:_"main_essentials"_"main_aside"] md:grid-cols-[3fr_2fr] xl:grid-cols-[5fr_2fr] md:grid-rows-[minmax(min-content,max-content)_1fr] px-6'>{children}</Layout.Body>

const Main = () => {
	return (
		<SendForm>
			<div class='grid [grid-template-areas:_"title"_"token"_"amount"_"address"_"tip"_"controls"] grid-rows-[repeat(auto-fit,minmax(min-content,0))] gap-y-4 lg:[grid-template-areas:_"title_title"_"token_amount"_"address_address"_"tip_tip"_"controls_controls"] lg:gap-x-6 xl:[grid-template-areas:_"title_title_title"_"token_amount_tip"_"address_address_tip"_"controls_controls_tip"] lg:grid-cols-2 xl:grid-cols-3'>
				<div class='[grid-area:title]'>
					<div class='bg-white/10 text-xl font-bold px-6 py-2 -ml-6'>Send Funds</div>
				</div>
				<div class='[grid-area:token]'>
					<TokenSelectField />
				</div>
				<div class='[grid-area:amount]'>
					<SendAmountField />
				</div>
				<div class='[grid-area:address]'>
					<SendAddressField />
				</div>
				<div class='[grid-area:tip] border border-dashed border-white/30'>
					<SendGuide />
				</div>
				<div class='[grid-area:controls]'>
					<SendActions />
				</div>
			</div>
		</SendForm>
	)
}

const SendForm = ({ children }: { children: ComponentChildren }) => {
	const txn = sendTransactionStore
	const account = accountStore

	function handleSubmit(event: Event) {
		event.preventDefault()
		switch (account.value.status) {
			case 'disconnected':
				return account.value.connect()
			case 'connected': {
				return handleSubmitWhileConnected()
			}
			case 'busy':
			case 'rejected':
				return
			default:
				assertUnreachable(account.value)
		}
	}

	function handleSubmitWhileConnected() {
		switch (txn.value.status) {
			case 'composing':
				txn.value.send()
				break
			case 'signed':
				location.href = `#tx/${txn.value.transaction.hash}`
				break
			case 'failed':
				txn.value.reset()
				break
			case 'idle':
				txn.value.status
				break
			case 'idle':
			case 'signing':
			case 'confirmed':
			case 'confirming':
				break
			default:
				assertUnreachable(txn.value)
		}
	}

	useEffect(() => {
		txn.value.status === 'idle' && txn.value.compose()
	}, [])

	return <form onSubmit={handleSubmit}>{children}</form>
}

const isEditInputAllowed = (store: TransactionStore): store is TransactionComposing | TransactionFailed =>
	store.status === 'composing' || store.status === 'failed'

const SendAmountField = () => {
	const txn = sendTransactionStore

	function handleChange(amount: string) {
		if (!isEditInputAllowed(txn.value)) return
		txn.value.data = { ...txn.value.data, amount }
		if (txn.value.status === 'failed') txn.value.reset()
	}

	const inputValue = txn.value.status === 'idle' ? '' : txn.value.data.amount
	const disabled = !isEditInputAllowed(txn.value)

	return <AmountField value={inputValue} onChange={handleChange} label='Amount' name='amount' disabled={disabled} />
}

const SendAddressField = () => {
	const txn = sendTransactionStore

	function handleChange(to: string) {
		if (!isEditInputAllowed(txn.value)) return
		txn.value.data = { ...txn.value.data, to }
		if (txn.value.status === 'failed') txn.value.reset()
	}

	const inputValue = txn.value.status === 'idle' ? '' : txn.value.data.to
	const disabled = !isEditInputAllowed(txn.value)

	return <AddressField value={inputValue} onChange={handleChange} label='Address' name='to' disabled={disabled} />
}

const SendGuide = () => {
	const txn = sendTransactionStore

	switch (txn.value.status) {
		case 'composing':
			return (
				<div class='p-4 text-center xl:text-left'>
					<div class='mb-2'>What happens when I click send?</div>
					<div class='leading-tight text-white/50 text-sm'>This app will forward your request to the wallet you chose to connect with. The connected wallet handles signing and submitting your request to the chain.</div>
				</div>
			)
		case 'signing':
			return (
				<div class='p-4 text-center xl:text-left'>
					<div class='mb-2 font-bold'>Awaiting wallet confirmation...</div>
					<div class='leading-tight text-white/50 text-sm'>At this point, your connected wallet will need action to proceed with this transaction. Carefully check the information before accepting the wallet confirmation.</div>
				</div>
			)
		case 'signed':
			return (
				<div class='p-4 text-center xl:text-left'>
					<div class='mb-2 font-bold'>Request Successfully Sent!</div>
					<div class='leading-tight text-white/50 text-sm'>Your transaction is awaiting confirmation from the chain. You may click on the View Transaction button to check it's status.</div>
				</div>
			)
		case 'failed':
			return (
				<div class='p-4 text-center xl:text-left'>
					<div class='mb-2 font-bold'>Wallet returned an error!</div>
					<div class='leading-tight xl:border-l-4 xl:border-l-white/30 px-3 py-1 flex items-center justify-center xl:justify-start text-white/50 text-sm'>{txn.value.error.message}</div>
					<div class='text-sm mt-2'>Check that your inputs are correct and click Send again.</div>
				</div>
			)
		case 'confirmed':
		case 'confirming':
		case 'idle':
			// handle confirmation views on transaction page
			return null
		default: assertUnreachable(txn.value)
	}
}

const SendActions = () => {
	const account = accountStore
	const txn = sendTransactionStore

	switch (account.value.status) {
		case 'busy':
			return <div class='px-4 py-2 hover:bg-white/10 border w-full'>Connecting...</div>
		case 'connected':
			switch (txn.value.status) {
				case 'composing':
					return <button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>Send</button>
				case 'signed':
					return <button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>View Transaction</button>
				case 'confirmed':
				case 'confirming':
				case 'idle':
				case 'signing':
				case 'failed':
					return <button type='submit' class='px-4 py-2 bg-white/10 text-white/20 w-full' disabled>Send</button>
				default: assertUnreachable(txn.value)
			}
		case 'disconnected':
			return <button type='submit' class='px-4 py-2 hover:bg-white/10 border w-full'>Connect Wallet</button>
		case 'rejected':
			return <div class='px-4 py-2 bg-red-400/10 border border-red-400/50 text-white/50 text-center cursor-not-allowed'>Unable to connect to wallet!</div>
	}
}


const TokenSelectField = () => {

	return <div class='flex flex-col gap-1'>
		<div class='text-sm text-white/50'>Token</div>
		<div class='appearance-none relative flex items-center px-3 h-10 bg-white/5 w-full outline-none disabled:bg-white/5 disabled:text-white/30 invalid:text-red-200 border-b border-white/30 focus:border-b-white'>
			<div class='cursor-pointer'>ETH</div>
		</div>
	</div>
}

const Footer = () => {
	return (
		<Layout.Footer class='h-16 col-span-2 flex items-center justify-center px-8'>
			<SocialLinks />
		</Layout.Footer>
	)
}

const Branding = () => (
	<div class='flex flex-col justify-center items-start grow'>
		<div class='text-3xl font-bold'>Lunaria</div>
		<div class='text-sm text-white/50'>Manage your digital assets</div>
	</div>
)

const SocialLinks = () => (
	<div class='flex items-center gap-6 text-white/30'>
		<a class='text-white/30 hover:text-white' href='/'>
			Github
		</a>
		<a class='text-white/30 hover:text-white' href='/'>
			Twitter
		</a>
		<a class='text-white/30 hover:text-white' href='/'>
			Discord
		</a>
	</div>
)

const Support = () => {
	return (
		<div class='bg-white/5 py-3 px-6 hover:bg-white/5 mb-6 text-center md:text-left'>
			<div class='font-bold text-lg mb-2'>Need support?</div>
			<div class='text-sm text-white/50 mb-2'>Join our discord channel to get support from our active community members and stay up-to-date with the latest news, events, and announcements.</div>
		</div>
	)
}

const EthBalance = () => (
	<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
		<div class='uppercase text-white/50 text-xs md:text-sm'>balance (ETH)</div>
		<div class='flex items-center gap-2'>
			<div class='text-lg font-bold capitalize'>100.0159 ETH</div>
			<button type='button' class='focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white rounded' title='Refresh' onClick={() => { }}>
				<Icon.Refresh />
			</button>
		</div>
	</div>
)

const ActiveNetwork = () => (
	<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
		<div class='uppercase text-white/50 text-xs md:text-sm'>network</div>
		<div class='text-lg font-bold capitalize' title='0x5'>
			Goerli
		</div>
	</div>
)
