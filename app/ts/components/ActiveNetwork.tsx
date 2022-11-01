import { useAsyncState } from '../library/preact-utilities';
import { Network } from '../library/useWallet';

type NetworkProps = {
	network: Network;
	fetchFn: () => Promise<void>;
};

export const ActiveNetwork = ({ network, fetchFn }: NetworkProps) => {
	const [net, queryNetFn] = useAsyncState<void>();

	switch (net.state) {
		case 'inactive':
			queryNetFn(fetchFn);
			return null;
		case 'pending':
			return <div class='h-4 w-24 bg-white/50 rounded-sm animate-pulse' />;
		case 'rejected':
			return <span class='capitalize'>Error</span>;
		case 'resolved':
			return <span class='capitalize'>{network.name}</span>;
	}
};
