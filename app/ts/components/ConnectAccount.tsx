import { useAccount } from '../store/account.js'
import { useNetwork } from '../store/network.js'
import { AsyncText } from './AsyncText.js'
import SVGBlockie from './SVGBlockie.js'

export const ConnectAccount = () => {
	const { address, connect } = useAccount()

	switch (address.value.state) {
		case 'inactive':
			return (
				<div class='grid grid-cols-[1fr,auto] gap-3 px-4 lg:px-0 h-20 border border-white/20 lg:border-none lg:place-items-end place-content-center items-center'>
					<div class='grid lg:place-items-end'>
						<span class='font-bold'>Get started quickly</span>
						<span class='text-sm text-white/50'>by connecting your wallet</span>
					</div>
					<button class='h-12 px-4 border border-white/50 bg-white/20' onClick={connect}>
						Connect
					</button>
				</div>
			)
		case 'rejected':
			console.log(address.value.error)
			return (
				<div class='grid grid-cols-[1fr,auto] gap-3 px-4 lg:px-0 h-20 border border-white/20 lg:border-none lg:place-items-end place-content-center items-center'>
					<div class='grid lg:place-items-end'>
						<span class='font-bold'>Get started quickly</span>
						<span class='text-sm text-white/50'>by connecting your wallet</span>
					</div>
					<button class='h-12 px-4 border border-white/50 bg-white/20' onClick={connect}>
						Connect
					</button>
				</div>
			)
		case 'pending':
		case 'resolved':
			return (
				<div class='grid grid-cols-[1fr,auto] gap-2 px-4 lg:px-0 h-20 border border-white/20 lg:border-none place-items-end place-content-center items-center'>
					<div class='grid place-items-end'>
						<AccountAddress />
						<WalletNetwork />
					</div>
					<AccountAvatar />
				</div>
			)
	}
}

const AccountAddress = () => {
	const { address } = useAccount()

	switch (address.value.state) {
		case 'inactive':
		case 'rejected':
			return <div class='whitespace-nowrap overflow-hidden overflow-ellipsis font-bold'>Not connected</div>
		case 'pending':
			return <AsyncText placeholderLength={40} />
		case 'resolved':
			return <div class='whitespace-nowrap overflow-hidden overflow-ellipsis font-bold'>{address.value.value}</div>
	}
}

const NetworkIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>
		<path fill='currentColor' d='M44 32h-2v-8a2 2 0 0 0-2-2H26v-6h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2v6H8a2 2 0 0 0-2 2v8H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2v-6h12v6h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2v-6h12v6h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-34 8H6v-4h4ZM22 8h4v4h-4Zm4 32h-4v-4h4Zm16 0h-4v-4h4Z' data-name='icons Q2' />
	</svg>
)

const AccountAvatar = () => {
	const { address } = useAccount()

	switch (address.value.state) {
		case 'inactive':
		case 'rejected':
			return <div class='aspect-square w-10 outline-2 outline-white/20 bg-white/20' />
		case 'pending':
			return <div class='aspect-square w-10 outline outline-white/20 bg-white/20 animate-pulse' />
		case 'resolved':
			return (
				<div style={{ fontSize: '2.5em' }}>
					<SVGBlockie address={address.value.value} />
				</div>
			)
	}
}

const WalletNetwork = () => {
	const { address } = useAccount()

	switch (address.value.state) {
		case 'inactive':
		case 'rejected':
			return <></>
		case 'pending':
			return <AsyncText placeholderLength={16} />
		case 'resolved':
			return (
				<div class='inline-flex items-center justify-end gap-1 text-white/50 text-sm'>
					<NetworkIcon />
					<NetworkName />
				</div>
			)
	}
}

const NetworkName = () => {
	const { network } = useNetwork()
	console.log(network.value)

	switch (network.value.state) {
		case 'inactive':
			return <span class='capitalize leading-tight'>&nbsp;</span>
		case 'pending':
			return <AsyncText placeholderLength={8} />
		case 'resolved':
			return <span class='capitalize leading-tight'>{network.value.value.name}</span>
		case 'rejected':
			return <span class='capitalize leading-tight'>Unable to connect to wallet</span>
	}
}
