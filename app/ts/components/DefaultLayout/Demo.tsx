import { useSignal } from "@preact/signals"
import { JSX } from "preact"
import { Header, HeaderNav, Main, Navigation, Root, usePanels } from "./index.js"
import { SelectAssetModal } from "./SelectAssetModal.js"

const SCROLL_OPTIONS = { inline: 'start', behavior: 'smooth' } as const

export const LayoutDemo = () => {
	return (
		<div class='fixed inset-0 bg-black text-white h-[100dvh]'>
			<Root>
				<LeftPanel />
				<MainPanel />
			</Root>
		</div>
	)
}

const LeftPanel = () => {
	return (
		<Navigation>
			<Header>
				<HeaderNav text='Menu' iconLeft={() => <span>☰</span>} onClick={() => { }} />
			</Header>

			<div class='mb-2 px-4'>

				<div class="flex items-center gap-2">
					<img class='w-10 h-10' src="/img/icon-lunaria.svg" />
					<div>
						<div class="text-3xl font-bold leading-none">Lunaria</div>
						<div class="text-white/50 leading-none">Decentralized Asset Manager</div>
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

const MenuIcon = () => <svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448"><path fill="currentColor" d="M0 636.362h448v64H0zm0 160h448v64H0zm0 160h448v64H0z" transform="translate(0 -604.362)" /></svg>
const NetworkIcon = () => <svg width="1em" height="1em" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M44 32h-2v-8a2 2 0 0 0-2-2H26v-6h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2v6H8a2 2 0 0 0-2 2v8H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2v-6h12v6h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2v-6h12v6h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-34 8H6v-4h4ZM22 8h4v4h-4Zm4 32h-4v-4h4Zm16 0h-4v-4h4Z" data-name="icons Q2" /></svg>

const MainPanel = () => {
	const modal = useSignal<'select' | 'add' | undefined>(undefined)
	const formData = useSignal({ amount: '', address: '', token: '' })
	const { nav, main } = usePanels()

	return (
		<Main>
			<div class='sticky top-0 bg-black/80 lg:hidden'>
				<div class='px-4'>
					<HeaderNav show={main?.isIntersecting} iconLeft={MenuIcon} onClick={() => nav?.target.scrollIntoView(SCROLL_OPTIONS)} />
				</div>
			</div>

			<div class='px-4'>
				<Connect />
			</div>


			<div class='px-4'>
				<div class='flex items-center gap-4 py-4'>
					<div class='text-3xl font-bold'>Transfer</div>
					<div class='border border-white/20 px-2 py-1 flex items-center gap-2'>
						<NetworkIcon />
						<div class='leading-tight'>Mainnet</div>
					</div>
				</div>
			</div>

			<div class='px-4'>
				<div class='grid gap-4'>
					<div class='grid md:grid-cols-2 gap-4'>
						<TokenField onClick={() => modal.value = 'select'}/>
						<InputField label='Amount' placeholder='1.00' value={formData.value.amount} onInput={(value) => formData.value = { ...formData.value, amount: value }} onClear={() => formData.value = {...formData.value, amount: '' }} />
					</div>

					<InputField label='Addrses' placeholder='0x123...789' value={formData.value.address} onInput={(value) => formData.value = { ...formData.value, address: value }}  onClear={() => formData.value = {...formData.value, address: '' }} />
					<SubmitButton />
				</div>
			</div>
			<SelectAssetModal show={modal.value === 'select'} onClose={() => modal.value = undefined} />
		</Main>
	)
}

type TokenFieldProps = {
	onClick: () => void
}

const TokenField = ({ onClick }: TokenFieldProps) => {
	return (
		<button class='border border-white/50 bg-transparent outline-none focus:border-white/80 focus:bg-white/5' onClick={() => onClick()}>
			<div class="grid grid-cols-[1fr,auto] gap-4 items-center px-4 h-16">
				<div class="grid text-left">
					<div class="text-sm text-white/50 leading-tight">Asset</div>
					<div class="h-6 bg-transparent outline-none" type="text">Dai Token (DAI)</div>
				</div>
				<div>
					<svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.75 0A.75.75 0 0 0 0 .75v2.5A.75.75 0 0 0 .75 4h2.5A.75.75 0 0 0 4 3.25V.75A.75.75 0 0 0 3.25 0H.75Zm7.226 4.624a.6.6 0 1 0 .848-.848L8.048 3H10.5a.3.3 0 0 1 .3.3v2.1a.6.6 0 1 0 1.2 0V3.3a1.5 1.5 0 0 0-1.5-1.5H8.048l.776-.776a.6.6 0 0 0-.848-.848l-1.8 1.8a.6.6 0 0 0 0 .848l1.8 1.8ZM4.024 7.376a.6.6 0 0 0-.848.848L3.952 9H1.5a.3.3 0 0 1-.3-.3V6.6a.6.6 0 1 0-1.2 0v2.1a1.5 1.5 0 0 0 1.5 1.5h2.452l-.776.776a.6.6 0 1 0 .848.848l1.8-1.8a.6.6 0 0 0 0-.848l-1.8-1.8Zm7.756 4.404a.75.75 0 0 0 .22-.53v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .53-.22Z" fill="currentColor" /></svg>
				</div>
			</div>
		</button>
	)
}

const Connect = () => {
	return (
		<div class='grid grid-cols-[1fr,46px] gap-2 px-4 lg:px-0 py-4 border border-white/20 lg:border-none'>
			<div class='md:text-right overflow-hidden'>
				<div class='text-white/50 text-sm leading-tight'>Wallet Address</div>
				<div class='whitespace-nowrap overflow-hidden overflow-ellipsis font-bold'>0x91608ba38AF89EFF05c7688d8984DEC7C24A3AEA</div>
			</div>
			<div class='bg-white/20' />
		</div>
	)

}

const SubmitButton = () => {
	return (
		<button class="px-4 h-16 border border-white/50 text-lg bg-white/10 flex items-center gap-2 justify-center outline-none focus:border-white/90 focus:bg-white/20">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M15.1535 9.32481C16.2823 8.80264 16.2823 7.19736 15.1527 6.67602L2.06876 0.634374C1.82818 0.523211 1.56185 0.47977 1.29843 0.508722C1.03501 0.537673 0.784468 0.637923 0.573743 0.798687C0.363018 0.959452 0.200088 1.17465 0.102479 1.42113C0.00486884 1.66761 -0.0237275 1.93605 0.0197653 2.19758L0.978713 7.95298C0.983615 7.98444 0.983337 8.01648 0.977889 8.04784L0.0197656 13.8024C-0.0237271 14.0639 0.00486919 14.3324 0.102479 14.5789C0.200089 14.8254 0.363018 15.0405 0.573743 15.2013C0.784468 15.3621 1.03501 15.4623 1.29843 15.4913C1.56185 15.5202 1.82818 15.4768 2.06876 15.3656L15.1535 9.32481ZM1.83624 2.45413L13.8474 8L1.83624 13.5459L2.62286 8.81584L7.68805 8.81666C7.79525 8.81666 7.9014 8.79554 8.00044 8.7545C8.09947 8.71346 8.18946 8.6533 8.26526 8.57747C8.34106 8.50163 8.40119 8.4116 8.44222 8.31252C8.48324 8.21344 8.50435 8.10725 8.50435 8C8.50435 7.89275 8.48324 7.78656 8.44222 7.68748C8.40119 7.5884 8.34106 7.49837 8.26526 7.42253C8.18946 7.3467 8.09947 7.28654 8.00044 7.2455C7.9014 7.20446 7.79525 7.18334 7.68805 7.18334H2.62368L1.83624 2.45413Z" fill="currentColor" />
			</svg>
			<span>Send</span>
		</button>
	)
}

type InputFieldProps = {
	label: string
	placeholder?: string
	value: JSX.HTMLAttributes<HTMLInputElement>["value"]
	onInput: (amount: string) => void
	onClear?: () => void
}

const InputField = (props: InputFieldProps) => {
	return (
		<div class='border border-white/50 bg-transparent focus-within:border-white/90 focus-within:bg-white/5'>
			<div class="grid grid-cols-[1fr,auto] items-center h-16">
				<div class="grid px-4">
					<label class="text-sm text-white/50 leading-tight">{props.label}</label>
					<input placeholder={props.placeholder} class="h-6 bg-transparent outline-none placeholder:text-white/20" type="text" value={props.value} onInput={event => props.onInput(event.currentTarget.value)} />
				</div>
				{props.value !== '' && (
					<button type='button' class='mx-2 p-2 outline-none border border-transparent focus:border-white' onClick={props.onClear}>
						<svg width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M11.293 3.293a1 1 0 1 1 1.414 1.414L9.414 8l3.293 3.293a1 1 0 0 1-1.414 1.414L8 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L6.586 8 3.293 4.707a1 1 0 0 1 1.414-1.414L8 6.586l3.293-3.293Z" /></svg>
					</button>)}

			</div>
		</div>

	)
}
