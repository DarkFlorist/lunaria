import { Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { TokenMeta } from '../../store/tokens.js'
import { Header, HeaderNav, Main, Navigation, Root, usePanels } from '../DefaultLayout/index.js'
import { TokenManager } from '../TokenManager/index.js'
import { ConnectAccount } from '../ConnectAccount.js'
import { AmountField } from '../AmountField.js'
import { AddressField } from '../AddressField.js'
import { useTransfer } from '../../store/transfer.js'
import { removeNonStringsAndTrim } from '../../library/utilities.js'
import { useAccount } from '../../store/account.js'
import { AsyncProperty } from '../../library/preact-utilities.js'
import { TransactionResponse } from '../../types.js'
import { RecentTransfers } from '../RecentTransfers.js'
import { DiscordInvite } from '../DiscordInvite.js'
import { AddTokenDialog } from './AddTokenDialog.js'
import { TransferValidation } from './Validation.js'
import { Favorites } from '../Favorites.js'

const SCROLL_OPTIONS = { inline: 'start', behavior: 'smooth' } as const

export const TransferPage = () => {
	return (
		<div class='fixed inset-0 bg-black text-white h-[100dvh]'>
			<Root>
				<LeftPanel />
				<MainPanel />
			</Root>
		</div>
	)
}

const MainPanel = () => {
	const tokenManager = useSignal<'select' | 'add' | undefined>(undefined)
	const { nav, main } = usePanels()
	const { transaction, data, send, clearData } = useTransfer()

	const setUserSelectedToken = (token?: TokenMeta) => {
		data.value = { ...data.value, token, amount: '' }
		tokenManager.value = undefined
	}

	const handleAddressChange = (address?: string) => {
		data.value = { ...data.value, recipientAddress: address || '' }
	}

	const handleSubmit = (e: Event) => {
		e.preventDefault()
		send()
	}

	const handleSuccess = (transactionResponse: TransactionResponse) => {
		clearData()
		window.location.hash = `#tx/${transactionResponse.hash}`
	}

	const isFormSubmitting = useComputed(() => transaction.value.state === 'pending')

	useSignalEffect(() => {
		if (transaction.value.state !== 'resolved') return
		handleSuccess(transaction.value.value)
	})

	return (
		<Main>
			<Header>
				<HeaderNav show={main?.isIntersecting} iconLeft={MenuIcon} onClick={() => nav?.target.scrollIntoView(SCROLL_OPTIONS)} text='Menu' />
			</Header>

			<div class='px-4'>
				<ConnectAccount />
			</div>

			<div class='px-4'>
				<div class='py-4'>
					<div class='text-3xl font-bold'>Transfer</div>
				</div>
			</div>

			<div class='px-4'>
				<form onSubmit={handleSubmit}>
					<div class='grid gap-4'>
						<div class='grid md:grid-cols-2 gap-4'>
							<TokenField token={data.value.token} onClick={() => (tokenManager.value = 'select')} disabled={isFormSubmitting.value} />
							<AmountField label='Amount' placeholder='1.00' value={data.value.amount} onInput={value => (data.value = { ...data.value, amount: value })} onClear={() => (data.value = { ...data.value, amount: '' })} disabled={isFormSubmitting.value} token={data.value.token} />
						</div>
						<AddressField label='Address' placeholder='0x123...789' value={data.value.recipientAddress} onInput={handleAddressChange} onClear={handleAddressChange} disabled={isFormSubmitting.value} />
						<TransferStatus transaction={transaction} />
						<TransferValidation data={data} />
						<SubmitButton disabled={isFormSubmitting.value} />
					</div>
				</form>
			</div>
			<TokenManager show={tokenManager.value === 'select'} onClose={() => (tokenManager.value = undefined)} onSelect={setUserSelectedToken} onAddToken={() => (tokenManager.value = 'add')} />
			<AddTokenDialog show={tokenManager} />
		</Main>
	)
}

const LeftPanel = () => {
	const { nav, main } = usePanels()

	return (
		<Navigation>
			<Header>
				<HeaderNav show={nav?.isIntersecting} iconLeft={CloseIcon} onClick={() => main?.target.scrollIntoView(SCROLL_OPTIONS)} text='Close Menu' />
			</Header>

			<div class='mb-4 p-4'>
				<div class='flex items-center gap-2'>
					<img class='w-10 h-10' src='/img/icon-lunaria.svg' />
					<div>
						<div class='text-3xl font-bold leading-none'>Lunaria</div>
						<div class='text-white/50 leading-none'>Decentralized Wallet</div>
					</div>
				</div>
			</div>

			<div class='pl-4 mb-4'>
				<div class='text-white/30 text-sm'>Actions</div>
				<a href='/'>
					<div class='grid grid-cols-[auto,1fr] items-center gap-4 mb-4'>
						<div class='bg-white/30 w-10 h-10 rounded-full' />
						<div class='py-2 leading-tight'>
							<div class='font-bold'>New Transfer</div>
							<div class='text-white/50'>Send and Manage Tokens</div>
						</div>
					</div>
				</a>
			</div>

			<RecentTransfers />

			<Favorites />

			<DiscordInvite />
		</Navigation>
	)
}

type TokenFieldProps = {
	token?: TokenMeta
	onClick: () => void
	disabled?: boolean
}

const TokenField = (props: TokenFieldProps) => {
	const handleChange = (e: KeyboardEvent) => {
		const shoudSkipKey = ['Tab', 'Meta', 'Alt', 'Shift', 'Escape'].includes(e.key)
		if (shoudSkipKey) return
		e.preventDefault()
		props.onClick()
	}

	return (
		<div class={removeNonStringsAndTrim('border border-white/50 bg-transparent outline-none focus-within:border-white/80 focus-within:bg-white/5', props.disabled && 'opacity-50')} onClick={props.onClick}>
			<div class='grid grid-cols-[1fr,auto] gap-4 items-center px-4 h-16'>
				<div class='grid text-left'>
					<div class='text-sm text-white/50 leading-tight'>Asset</div>
					<input class='appearance-none h-6 bg-transparent outline-none' value={props.token?.name || 'ETH'} onKeyDown={handleChange} required />
				</div>
				<div>
					<svg width='1em' height='1em' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path d='M.75 0A.75.75 0 0 0 0 .75v2.5A.75.75 0 0 0 .75 4h2.5A.75.75 0 0 0 4 3.25V.75A.75.75 0 0 0 3.25 0H.75Zm7.226 4.624a.6.6 0 1 0 .848-.848L8.048 3H10.5a.3.3 0 0 1 .3.3v2.1a.6.6 0 1 0 1.2 0V3.3a1.5 1.5 0 0 0-1.5-1.5H8.048l.776-.776a.6.6 0 0 0-.848-.848l-1.8 1.8a.6.6 0 0 0 0 .848l1.8 1.8ZM4.024 7.376a.6.6 0 0 0-.848.848L3.952 9H1.5a.3.3 0 0 1-.3-.3V6.6a.6.6 0 1 0-1.2 0v2.1a1.5 1.5 0 0 0 1.5 1.5h2.452l-.776.776a.6.6 0 1 0 .848.848l1.8-1.8a.6.6 0 0 0 0-.848l-1.8-1.8Zm7.756 4.404a.75.75 0 0 0 .22-.53v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .53-.22Z' fill='currentColor' />
					</svg>
				</div>
			</div>
		</div>
	)
}

const SubmitButton = (props: { disabled?: boolean }) => {
	const { address, connect } = useAccount()

	switch (address.value.state) {
		case 'inactive':
		case 'rejected':
			return (
				<button type='button' class='px-4 h-16 border border-white/50 text-lg bg-white/10 flex items-center gap-2 justify-center outline-none focus:border-white/90 focus:bg-white/20 disabled:opacity-50' onClick={() => connect()}>
					<span>Connect Wallet</span>
				</button>
			)
		case 'resolved':
			return (
				<button type='submit' class='px-4 h-16 border border-white/50 text-lg bg-white/10 flex items-center gap-2 justify-center outline-none focus:border-white/90 focus:bg-white/20 disabled:opacity-50' disabled={props.disabled}>
					<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M15.1535 9.32481C16.2823 8.80264 16.2823 7.19736 15.1527 6.67602L2.06876 0.634374C1.82818 0.523211 1.56185 0.47977 1.29843 0.508722C1.03501 0.537673 0.784468 0.637923 0.573743 0.798687C0.363018 0.959452 0.200088 1.17465 0.102479 1.42113C0.00486884 1.66761 -0.0237275 1.93605 0.0197653 2.19758L0.978713 7.95298C0.983615 7.98444 0.983337 8.01648 0.977889 8.04784L0.0197656 13.8024C-0.0237271 14.0639 0.00486919 14.3324 0.102479 14.5789C0.200089 14.8254 0.363018 15.0405 0.573743 15.2013C0.784468 15.3621 1.03501 15.4623 1.29843 15.4913C1.56185 15.5202 1.82818 15.4768 2.06876 15.3656L15.1535 9.32481ZM1.83624 2.45413L13.8474 8L1.83624 13.5459L2.62286 8.81584L7.68805 8.81666C7.79525 8.81666 7.9014 8.79554 8.00044 8.7545C8.09947 8.71346 8.18946 8.6533 8.26526 8.57747C8.34106 8.50163 8.40119 8.4116 8.44222 8.31252C8.48324 8.21344 8.50435 8.10725 8.50435 8C8.50435 7.89275 8.48324 7.78656 8.44222 7.68748C8.40119 7.5884 8.34106 7.49837 8.26526 7.42253C8.18946 7.3467 8.09947 7.28654 8.00044 7.2455C7.9014 7.20446 7.79525 7.18334 7.68805 7.18334H2.62368L1.83624 2.45413Z'
							fill='currentColor'
						/>
					</svg>
					<span>Send</span>
				</button>
			)
		case 'pending':
			return (
				<button type='button' class='px-4 h-16 border border-white/50 text-lg bg-white/10 flex items-center gap-2 justify-center outline-none focus:border-white/90 focus:bg-white/20 disabled:opacity-50' onClick={() => connect()} disabled>
					<span>Connecting...</span>
				</button>
			)
	}
}

const TransferStatus = ({ transaction }: { transaction: Signal<AsyncProperty<TransactionResponse>> }) => {
	switch (transaction.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return (
				<div class='grid gap-2 grid-cols-[auto,1fr] items-center border border-white/50 px-4 py-3 bg-white/5'>
					<svg width='1em' height='1em' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' fill='none' class='animate-spin'>
						<g fill='currentColor' fill-rule='evenodd' clip-rule='evenodd'>
							<path d='M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z' opacity='.2' />
							<path d='M7.25.75A.75.75 0 0 1 8 0a8 8 0 0 1 8 8 .75.75 0 0 1-1.5 0A6.5 6.5 0 0 0 8 1.5a.75.75 0 0 1-.75-.75z' />
						</g>
					</svg>
					<div>Confirming transaction...</div>
				</div>
			)
		case 'resolved':
			return <></>
		case 'rejected':
			return (
				<div class='grid gap-2 border border-red-400/50 px-4 py-3 bg-red-200/10'>
					<div class='font-bold text-lg'>Failed to complete transfer</div>
					<div>Error: </div>
					<div class='break-all p-3 text-sm bg-white/10 text-white/50'>{transaction.value.error.message}</div>
				</div>
			)
	}
}

const MenuIcon = () => (
	<svg width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 448'>
		<path fill='currentColor' d='M0 636.362h448v64H0zm0 160h448v64H0zm0 160h448v64H0z' transform='translate(0 -604.362)' />
	</svg>
)

const CloseIcon = () => (
	<svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path d='M11.444.067a.895.895 0 0 0-.984.206l-4.465 4.47L1.529.273A.895.895 0 1 0 .262 1.541l4.466 4.47-4.466 4.47a.897.897 0 0 0 1.266 1.268l4.467-4.471 4.466 4.47a.896.896 0 0 0 1.267-1.267L7.26 6.01l4.466-4.47a.899.899 0 0 0-.284-1.474Z' fill='currentColor' />
	</svg>
)
