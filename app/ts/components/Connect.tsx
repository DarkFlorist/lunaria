import { FunctionalComponent } from 'preact'
import { useAsyncState } from '../library/preact-utilities'
import useWallet, { HexString } from '../library/useWallet'
import { Button } from './Button'
import * as Icon from './Icon/index'

export const Connect = () => {
	const wallet = useWallet()

	switch (wallet.status) {
		case 'nowallet':
			return null

		case 'disconnected':
			return <WalletConnect connectFn={wallet.connect} />

		case 'connected':
			return <WalletStatus account={wallet.account} onDisconnect={() => wallet.disconnect()} />
	}
}

type WalletConnectProps = {
	connectFn: () => Promise<void>
}

const WalletConnect = ({ connectFn }: WalletConnectProps) => {
	const [accounts, queryFn, resetAccountsQuery] = useAsyncState<void>()

	switch (accounts.state) {
		case 'inactive':
			return (
				<Wrapper>
					<div class='leading-tight text-right'>Quickly get started by connecting your wallet</div>
					<div class='transition animate-bounce-x'>
						<Icon.ArrowRight />
					</div>
					<Button class='whitespace-nowrap' onClick={() => queryFn(connectFn)}>
						Connect Wallet
					</Button>
				</Wrapper>
			)
		case 'pending':
			return (
				<Wrapper>
					<div class='text-right'>
						<div class='text-sm text-white/50'>Your Wallet Address</div>
						<div class='h-6 w-44 animate-pulse bg-white/50 rounded-sm my-1' />
					</div>
					<Button class='border border-white/30 py-2 px-4 rounded leading-tight text-white/50'>Connecting...</Button>
				</Wrapper>
			)
		case 'rejected':
			return (
				<div class='text-right md:flex items-center gap-2'>
					Failed to connect wallet!{' '}
					<button class='font-bold text-purple-600 hover:text-purple-500 hover:underline underline-offset-4' onClick={resetAccountsQuery}>
						Try again?
					</button>
				</div>
			)
		case 'resolved':
			return null
	}
}

type WalletStatusProps = { account: HexString; onDisconnect: () => void }

const WalletStatus = ({ account, onDisconnect }: WalletStatusProps) => {
	return (
		<Wrapper>
			<div class='flex gap-4 min-w-0'>
				<div class='text-right min-w-0'>
					<div class='text-sm text-white/50'>Your Wallet Address</div>
					<div class='overflow-hidden text-ellipsis'>{account}</div>
				</div>
				<Button onClick={onDisconnect}>Disconnect</Button>
			</div>
		</Wrapper>
	)
}

const Wrapper: FunctionalComponent = ({ children }) => {
	return (
		<div class='flex justify-center my-6'>
			<div class='flex gap-4 items-center justify-center py-4 px-6 border border-dashed border-white/30 rounded md:border-0 min-w-0 max-w-xl md:max-w-none lg:max-w-none'>{children}</div>
		</div>
	)
}
