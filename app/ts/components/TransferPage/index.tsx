import { useSignal } from '@preact/signals'
import { TokenMeta } from '../../store/tokens.js'
import { Header, HeaderNav, Main, Navigation, Root, usePanels } from '../DefaultLayout/index.js'
import { TokenManager } from '../TokenManager/index.js'
import { ConnectAccount } from '../ConnectAccount.js'
import { AmountField } from '../AmountField.js'
import { AddressField } from '../AddressField.js'

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

type FormData = {
	amount: string,
	address: string,
	token?: TokenMeta
}

const MainPanel = () => {
	const tokenManager = useSignal<boolean>(false)
	const formData = useSignal<FormData>({ amount: '', address: '', token: undefined })
	const { nav, main } = usePanels()

	const handleTokenSelect = (token?: TokenMeta) => {
		formData.value = { ...formData.value, token }
		tokenManager.value = false
	}

	const handleAddressChange = (address?: string) => {
		formData.value = { ...formData.value, address: address || '' }
	}

	const handleSubmit = (e: Event) => {
		e.preventDefault()
		console.log(formData.value)
	}

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
							<TokenField token={formData.value.token} onClick={() => tokenManager.value = true} />
							<AmountField label='Amount' placeholder='1.00' value={formData.value.amount} onInput={(value) => formData.value = { ...formData.value, amount: value }} onClear={() => formData.value = { ...formData.value, amount: '' }} />
						</div>
						<AddressField label='Addrses' placeholder='0x123...789' value={formData.value.address} onInput={handleAddressChange} onClear={handleAddressChange} />
						<SubmitButton />
					</div>
				</form>
			</div>
			<TokenManager show={tokenManager.value === true} onClose={() => tokenManager.value = false} onSelect={handleTokenSelect} />
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

			<div class='mb-2 p-4'>
				<div class='flex items-center gap-2'>
					<img class='w-10 h-10' src='/img/icon-lunaria.svg' />
					<div>
						<div class='text-3xl font-bold leading-none'>Lunaria</div>
						<div class='text-white/50 leading-none'>Decentralized Wallet</div>
					</div>
				</div>
			</div>

			<div class='pl-4 mb-2'>
				<div class='text-white/30 text-sm'>Actions</div>
				<div class='grid grid-cols-[auto,1fr] items-center gap-4 mb-4'>
					<div class='bg-white/30 w-10 h-10 rounded-full' />
					<div class='py-2 border-b border-b-white/20 leading-tight'>
						<div class='font-bold'>New Transfer</div>
						<div class='text-white/50'>Send and Manage Tokens</div>
					</div>
				</div>
			</div>

			<div class='pl-4 mb-2'>
				<div class='text-white/30 text-sm'>Saved Sessions</div>
				<div class='grid mb-4'>
					<div class='p-2 border-b border-b-white/20'>
						<div class='font-bold leading-tight'>Staking Wallet</div>
						<div class='text-white/50'>Binance wallet</div>
					</div>
					<div class='p-2 border-b border-b-white/20'>
						<div class='font-bold leading-tight'>Airdrop Wallet</div>
						<div class='text-white/50'>My airdrop wallet</div>
					</div>
				</div>
			</div>
		</Navigation>
	)
}

type TokenFieldProps = {
	token?: TokenMeta
	onClick: () => void
}

const TokenField = (props: TokenFieldProps) => {
	const handleChange = (e: KeyboardEvent) => {
		const shoudSkipKey = ['Tab', 'Meta', 'Alt', 'Shift', 'Escape'].includes(e.key)
		if (shoudSkipKey) return
		e.preventDefault()
		props.onClick()
	}

	return (
		<div class='border border-white/50 bg-transparent outline-none focus-within:border-white/80 focus-within:bg-white/5' onClick={props.onClick}>
			<div class='grid grid-cols-[1fr,auto] gap-4 items-center px-4 h-16'>
				<div class='grid text-left'>
					<div class='text-sm text-white/50 leading-tight'>Asset</div>
					<input class='appearance-none h-6 bg-transparent outline-none' value={props.token?.name || 'ETH'} onKeyDown={handleChange} required />
				</div>
				<div>
					<svg width='1em' height='1em' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M.75 0A.75.75 0 0 0 0 .75v2.5A.75.75 0 0 0 .75 4h2.5A.75.75 0 0 0 4 3.25V.75A.75.75 0 0 0 3.25 0H.75Zm7.226 4.624a.6.6 0 1 0 .848-.848L8.048 3H10.5a.3.3 0 0 1 .3.3v2.1a.6.6 0 1 0 1.2 0V3.3a1.5 1.5 0 0 0-1.5-1.5H8.048l.776-.776a.6.6 0 0 0-.848-.848l-1.8 1.8a.6.6 0 0 0 0 .848l1.8 1.8ZM4.024 7.376a.6.6 0 0 0-.848.848L3.952 9H1.5a.3.3 0 0 1-.3-.3V6.6a.6.6 0 1 0-1.2 0v2.1a1.5 1.5 0 0 0 1.5 1.5h2.452l-.776.776a.6.6 0 1 0 .848.848l1.8-1.8a.6.6 0 0 0 0-.848l-1.8-1.8Zm7.756 4.404a.75.75 0 0 0 .22-.53v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .53-.22Z' fill='currentColor' /></svg>
				</div>
			</div>
		</div>
	)
}

const SubmitButton = () => {
	return (
		<button type='submit' class='px-4 h-16 border border-white/50 text-lg bg-white/10 flex items-center gap-2 justify-center outline-none focus:border-white/90 focus:bg-white/20'>
			<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path fill-rule='evenodd' clip-rule='evenodd' d='M15.1535 9.32481C16.2823 8.80264 16.2823 7.19736 15.1527 6.67602L2.06876 0.634374C1.82818 0.523211 1.56185 0.47977 1.29843 0.508722C1.03501 0.537673 0.784468 0.637923 0.573743 0.798687C0.363018 0.959452 0.200088 1.17465 0.102479 1.42113C0.00486884 1.66761 -0.0237275 1.93605 0.0197653 2.19758L0.978713 7.95298C0.983615 7.98444 0.983337 8.01648 0.977889 8.04784L0.0197656 13.8024C-0.0237271 14.0639 0.00486919 14.3324 0.102479 14.5789C0.200089 14.8254 0.363018 15.0405 0.573743 15.2013C0.784468 15.3621 1.03501 15.4623 1.29843 15.4913C1.56185 15.5202 1.82818 15.4768 2.06876 15.3656L15.1535 9.32481ZM1.83624 2.45413L13.8474 8L1.83624 13.5459L2.62286 8.81584L7.68805 8.81666C7.79525 8.81666 7.9014 8.79554 8.00044 8.7545C8.09947 8.71346 8.18946 8.6533 8.26526 8.57747C8.34106 8.50163 8.40119 8.4116 8.44222 8.31252C8.48324 8.21344 8.50435 8.10725 8.50435 8C8.50435 7.89275 8.48324 7.78656 8.44222 7.68748C8.40119 7.5884 8.34106 7.49837 8.26526 7.42253C8.18946 7.3467 8.09947 7.28654 8.00044 7.2455C7.9014 7.20446 7.79525 7.18334 7.68805 7.18334H2.62368L1.83624 2.45413Z' fill='currentColor' />
			</svg>
			<span>Send</span>
		</button>
	)
}

const MenuIcon = () => <svg width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 448'><path fill='currentColor' d='M0 636.362h448v64H0zm0 160h448v64H0zm0 160h448v64H0z' transform='translate(0 -604.362)' /></svg>

const CloseIcon = () => <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M11.444.067a.895.895 0 0 0-.984.206l-4.465 4.47L1.529.273A.895.895 0 1 0 .262 1.541l4.466 4.47-4.466 4.47a.897.897 0 0 0 1.266 1.268l4.467-4.471 4.466 4.47a.896.896 0 0 0 1.267-1.267L7.26 6.01l4.466-4.47a.899.899 0 0 0-.284-1.474Z' fill='currentColor' /></svg>

