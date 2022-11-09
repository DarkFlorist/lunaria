import { FunctionalComponent } from 'preact';
import { useAsyncState } from '../library/preact-utilities';
import useWallet from '../library/useWallet';
import Icon from './Icon';

type BalanceProps = {
	fetchFn: () => Promise<string>;
};

export const EthBalance = () => {
	const wallet = useWallet();

	switch (wallet.status) {
		case 'unknown':
			return <Skeleton />;
		case 'disconnected':
			return <Disconnected connectFn={wallet.connect!} />;
		case 'connected':
			return <Connected fetchFn={wallet.getBalance!} />;
	}
};

const Disconnected = ({ connectFn }: { connectFn: () => void }) => {
	return (
		<div class='flex flex-col items-center md:items-start gap-1 mb-6'>
			<div class='uppercase text-white/50 text-xs md:text-sm'>ETH Balance</div>
			<div>
				<button
					class='font-bold underline-offset-4 hover:underline focus:underline focus:outline-none'
					onClick={connectFn}
				>
					Connect now
				</button>{' '}
				<span class='italic text-white/50 text-sm'>to check ETH Balance</span>
			</div>
		</div>
	);
};

const Connected = ({ fetchFn }: BalanceProps) => {
	const [balance, queryBalance] = useAsyncState<string>();

	function getCurrentBalance() {
		queryBalance(fetchFn);
	}

	switch (balance.state) {
		case 'inactive':
			queryBalance(fetchFn);
			return <Skeleton />;
		case 'pending':
			return <Skeleton />;
		case 'rejected':
			return (
				<Wrapper>
					<div class='uppercase text-white/50 text-xs md:text-sm'>balance</div>
					<div class='flex items-center gap-2'>
						<div class='italic capitalize'>Failed to get balance.</div>
						<RefreshButton onClick={getCurrentBalance} />
					</div>
				</Wrapper>
			);
		case 'resolved':
			return (
				<Wrapper>
					<div class='uppercase text-white/50 text-xs md:text-sm'>
						balance (ETH)
					</div>
					<div class='flex items-center gap-2'>
						<div class='text-lg font-bold capitalize'>{balance.value} ETH</div>
						<RefreshButton onClick={getCurrentBalance} />
					</div>
				</Wrapper>
			);
	}
};

const Wrapper: FunctionalComponent = ({ children }) => {
	return (
		<div class='flex flex-col items-center md:items-start gap-1 mb-6'>
			{children}
		</div>
	);
};

const RefreshButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button
			type='button'
			class='focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white rounded'
			title='Refresh'
			onClick={onClick}
		>
			<Icon.Refresh />
		</button>
	);
};

export const Skeleton = () => {
	return (
		<Wrapper>
			<div class='h-3 w-16 bg-white/20 rounded-sm animate-pulse my-1' />
			<div class='h-5 w-48 bg-white/20 rounded-sm animate-pulse my-1' />
		</Wrapper>
	);
};
