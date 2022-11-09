import { FunctionalComponent } from 'preact';
import { useAsyncState } from '../library/preact-utilities';
import useWallet from '../library/useWallet';
import { Network } from '../library/useWallet';

type NetworkProps = {
	fetchFn: () => Promise<Network>;
};

export const ActiveNetwork = () => {
	const wallet = useWallet();

	switch (wallet.status) {
		case 'unknown':
			return <Skeleton />;
		case 'disconnected':
			return <Disconnected connectFn={wallet.connect!} />;
		case 'connected':
			return <Connected fetchFn={wallet.getNetwork!} />;
	}
};

const Disconnected = ({ connectFn }: { connectFn: () => void }) => {
	return (
		<Wrapper>
			<div class='uppercase text-white/50 text-xs md:text-sm'>ETH Balance</div>
			<div>
				<button
					class='font-bold underline-offset-4 hover:underline focus:underline focus:outline-none'
					onClick={connectFn}
				>
					Connect now
				</button>{' '}
				<span class='italic text-white/50 text-sm'>to check Network</span>
			</div>
		</Wrapper>
	);
};

const Connected = ({ fetchFn }: NetworkProps) => {
	const [network, queryFn] = useAsyncState<Network>();

	switch (network.state) {
		case 'inactive':
			queryFn(fetchFn);
			return null;
		case 'pending':
			return <Skeleton />;
		case 'rejected':
			return <ErrorMessage />;
		case 'resolved':
			return (
				<Wrapper>
					<div class='uppercase text-white/50 text-xs md:text-sm'>network</div>
					<div
						class='text-lg font-bold capitalize'
						title={`0x${network.value.chainId}`}
					>
						{network.value.name}
					</div>
				</Wrapper>
			);
	}
};

export const Skeleton = () => {
	return (
		<Wrapper>
			<div class='h-3 w-16 bg-white/20 rounded-sm animate-pulse my-1' />
			<div class='h-5 w-24 bg-white/20 rounded-sm animate-pulse my-1' />
		</Wrapper>
	);
};

const ErrorMessage = () => {
	return (
		<Wrapper>
			<div class='uppercase text-white/50 text-xs md:text-sm'>Warning</div>
			<div class='text-lg font-bold italic'>
				Failed to retrieve network information!
			</div>
		</Wrapper>
	);
};

const Wrapper: FunctionalComponent = ({ children }) => {
	return (
		<div class='flex flex-col items-center md:items-start gap-1 mb-6'>
			{children}
		</div>
	);
};
