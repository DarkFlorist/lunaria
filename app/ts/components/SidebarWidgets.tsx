import useWallet from '../library/useWallet';

export const Support = () => {
	return (
		<div class='bg-white/5 py-3 px-6 hover:bg-white/5 mb-6 text-center md:text-left'>
			<div class='font-bold text-lg mb-2'>Need support?</div>
			<div class='text-sm text-white/50 mb-2'>
				Join our discord channel to get support from our active community
				members and stay up-to-date with the latest news, events, and
				announcements.
			</div>
		</div>
	);
};

export const UserTips = () => {
	const wallet = useWallet();

	if (wallet.status !== 'connected') return null;

	return (
		<div class='md:border-l-4 md:border-white/10 py-3 px-6 mb-6 text-center md:text-left'>
			<div class='font-bold text-lg mb-2'>Tip!</div>
			<div class='text-sm text-white/50 mb-2'>
				Refresh your balance before doing any transactions. Simply click on the
				refresh icon besides the balance value to update.
			</div>
		</div>
	);
};
