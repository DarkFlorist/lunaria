import { FunctionalComponent } from 'preact';
import { useAsyncState } from '../library/preact-utilities';
import Icon from './Icon/index';

type BalanceProps = {
	fetchFn: () => Promise<string>;
};

export const EthBalance = ({ fetchFn }: BalanceProps) => {
	const [balance, asyncBalanceFn] = useAsyncState<string>();

	switch (balance.state) {
		case 'inactive':
			asyncBalanceFn(fetchFn);
			return null;
		case 'pending':
			return (
				<Wrapper>
					<Skeleton />
					<span>ETH</span>
				</Wrapper>
			);
		case 'rejected':
			return (
				<Wrapper>
					<span>Failed to get balance.</span>
					<RefreshButton onClick={() => asyncBalanceFn(fetchFn)} />
				</Wrapper>
			);
		case 'resolved':
			return (
				<Wrapper>
					<span>{balance.value} ETH</span>
					<RefreshButton onClick={() => asyncBalanceFn(fetchFn)} />
				</Wrapper>
			);
	}
};

const Wrapper: FunctionalComponent = ({ children }) => {
	return (
		<div class='flex items-center justify-end gap-2 [&>button]:text-white'>
			{children}
		</div>
	);
};

const Skeleton = () => {
	return <div class='h-4 w-36 bg-white/50 rounded-sm animate-pulse' />;
};

type RefreshButtonProps = {
	onClick: () => void;
};

const RefreshButton = ({ onClick }: RefreshButtonProps) => {
	return (
		<button type='button' title='Refresh' onClick={onClick}>
			<Icon.Refresh />
		</button>
	);
};
