import { BigNumber, ethers } from 'ethers';
import { FunctionalComponent, JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { useAsyncState } from '../library/preact-utilities';
import useWallet from '../library/useWallet';
import Icon from './Icon/index';

type BalanceProps = {
	address: string;
};

export const Balance = ({ address }: BalanceProps) => {
	const { getBalance } = useWallet();
	const [balance, asyncBalanceFn, resetBalance] = useAsyncState<BigNumber>();

	async function checkBalance() {
		return await getBalance(address);
	}

	useEffect(() => {
		if (!ethers.utils.isAddress(address)) {
			return resetBalance();
		}

		asyncBalanceFn(checkBalance);
	}, [address]);

	switch (balance.state) {
		case 'inactive':
			return <Info />;
		case 'pending':
			return (
				<Info>
					<Skeleton />
					<span>ETH</span>
				</Info>
			);
		case 'rejected':
			return (
				<Info>
					<Button onClick={() => asyncBalanceFn(checkBalance)} />
					<span>Failed to get balance.</span>
				</Info>
			);
		case 'resolved':
			return (
				<Info>
					<Button onClick={() => asyncBalanceFn(checkBalance)} />
					<span>{ethers.utils.formatEther(balance.value)} ETH</span>
				</Info>
			);
	}
};

const Info: FunctionalComponent = ({ children }) => {
	return (
		<div class='flex items-center justify-end text-sm text-white/50 gap-1 [&>button]:text-white'>
			{children}
		</div>
	);
};

const Skeleton = () => {
	return <div class='h-3 w-14 bg-white/50 rounded-sm animate-pulse' />;
};

const Button = (props: JSX.HTMLAttributes<HTMLButtonElement>) => {
	return (
		<button type='button' title='Refresh' {...props}>
			<Icon.Refresh />
		</button>
	);
};
