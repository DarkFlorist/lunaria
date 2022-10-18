import { useAsyncState } from '../library/preact-utilities';
import useWallet from '../library/useWallet';
import { Dialog } from './Dialog';

export const Connect = () => {
	const { connectWallet } = useWallet();
	const [accounts, queryFn, resetQuery] = useAsyncState<string[]>();

	switch (accounts.state) {
		case 'inactive':
			return (
				<button
					class='flex h-10 px-5 items-center border border-white/50 rounded-full'
					onClick={() => queryFn(connectWallet)}
				>
					Connect Wallet
				</button>
			);
		case 'pending':
			return <div class='flex h-10 px-5 items-center'>Connecting...</div>;
		case 'rejected':
			return (
				<Dialog onBackdropClick={resetQuery}>
					<Dialog.Content>
						<div class='text-center'>
							<button
								class='text-blue-400 font-semibold'
								onClick={() => window.location.reload()}
							>
								Try Reloading?
							</button>
						</div>
					</Dialog.Content>
				</Dialog>
			);
		case 'resolved':
			return null;
	}
};
