import { FunctionalComponent } from 'preact';
import { useAsyncState } from '../library/preact-utilities';
import useWallet from '../library/useWallet';
import { Button } from './Button';
import Icon from './Icon/index';

export const Connect = () => {
	const wallet = useWallet();

	switch (wallet.state) {
		case 'unknown':
			return null;
		case 'unavailable':
			return (
				<Wrapper>
					<div class='flex items-center gap-4'>
						<div class='text-right'>
							<div>No web3 wallet detected!</div>
							<div class='text-sm text-white/50 leading-tight'>
								If you just installed one, try refreshing the page
							</div>
						</div>
						<Button onClick={() => window.location.reload()}>Refresh</Button>
					</div>
				</Wrapper>
			);
		case 'disconnected':
			return <WalletConnect connectFn={wallet.connect} />;
		case 'connected':
			return (
				<Wrapper>
					<div class='flex gap-4 min-w-0'>
						<div class='text-right min-w-0'>
							<div class='text-sm text-white/50'>Your Wallet Address</div>
							<div class='overflow-hidden text-ellipsis'>{wallet.account}</div>
						</div>
						<Button>Disconnect</Button>
					</div>
				</Wrapper>
			);
	}
};

type WalletConnectProps = {
	connectFn: () => Promise<void>;
};

const WalletConnect = ({ connectFn }: WalletConnectProps) => {
	const [accounts, queryFn, resetAccountsQuery] = useAsyncState<void>();

	switch (accounts.state) {
		case 'inactive':
			return (
				<Wrapper>
					<div class='leading-tight text-right'>
						Quickly get started by connecting your wallet
					</div>
					<div class='transition animate-bounce-x'>
						<Icon.ArrowRight />
					</div>
					<Button class='whitespace-nowrap' onClick={() => queryFn(connectFn)}>
						Connect Wallet
					</Button>
				</Wrapper>
			);
		case 'pending':
			return (
				<Wrapper>
					<div class='text-right'>
						<div class='text-sm text-white/50'>Your Wallet Address</div>
						<div class='h-6 w-44 animate-pulse bg-white/50 rounded-sm my-1' />
					</div>
					<Button class='border border-white/30 py-2 px-4 rounded leading-tight text-white/50'>
						Connecting...
					</Button>
				</Wrapper>
			);
		case 'rejected':
			return (
				<div class='text-right md:flex items-center gap-2'>
					Failed to connect wallet!{' '}
					<button
						class='font-bold text-purple-600 hover:text-purple-500 hover:underline underline-offset-4'
						onClick={resetAccountsQuery}
					>
						Try again?
					</button>
				</div>
			);
		case 'resolved':
			return null;
	}
};

const Wrapper: FunctionalComponent = ({ children }) => {
	return (
		<div class='flex justify-center my-6'>
			<div class='flex gap-4 items-center justify-center py-4 px-6 border border-dashed border-white/30 rounded md:border-0 min-w-0 max-w-xl md:max-w-none lg:max-w-none'>
				{children}
			</div>
		</div>
	);
};
