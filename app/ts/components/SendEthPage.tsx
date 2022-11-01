import Layout from './Layout';
import useWallet, { HexString } from '../library/useWallet';
import { EthBalance } from './EthBalance';
import { Branding } from './Branding';
import { Connect } from './Connect';
import { SocialLinks } from './SocialLinks';
import { ActiveNetwork } from './ActiveNetwork';
import { HelpCenter, Info, Support, UserTips } from './SidebarWidgets';
import { useEffect } from 'preact/hooks';
import { AmountField } from './AmountField';
import { useRoute } from './Router';
import { useSignal } from '@preact/signals';
import { AddressField } from './AddressField';
import { Button } from './Button';

export const SendEthPage = () => {
	const wallet = useWallet();

	useEffect(() => {
		if (wallet.state !== 'unknown') return;
		wallet.initialize();
	}, []);

	return (
		<Layout>
			<Header />
			<Main />
			<Sidebar />
			<Footer />
		</Layout>
	);
};

const Main = () => {
	const { navigate } = useRoute();

	const formData = useSignal({
		amount: '',
		to: '',
	});

	function handleAmountChange(amount: HexString | string) {
		formData.value = { ...formData.value, amount };
	}

	function handleAddressChange(to: HexString | string) {
		formData.value = { ...formData.value, to };
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		console.log('submit');
	}

	return (
		<Layout.Main>
			<div class='h-14 flex items-center justify-between bg-white/10 px-8 mb-8'>
				<div class='text-lg font-bold'>Send ETH</div>
				<button type='button' onClick={() => navigate('/')}>
					Cancel
				</button>
			</div>

			<form onSubmit={handleSubmit}>
				<div class='lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6 pl-8 pr-8 md:pr-0 mb-8'>
					<div class='flex flex-col gap-6 mb-8'>
						<AmountField
							name='amount'
							label='Send Amount'
							value={formData.value.amount}
							onChange={handleAmountChange}
						/>
						<AddressField
							name='address'
							label='Recipient Address'
							value={formData.value.to}
							onChange={handleAddressChange}
						/>
					</div>
					<ReviewAndSubmit />
				</div>
			</form>
		</Layout.Main>
	);
};

const ReviewAndSubmit = () => {
	const wallet = useWallet();

	switch (wallet.state) {
		case 'unknown':
		case 'unavailable':
		case 'disconnected':
			return (
				<div class='py-4 px-6 border border-white/10 text-center lg:text-left'>
					<div class='text-lg font-bold mb-3'>Important!</div>
					<div class='text-sm mb-3 text-white/50'>
						Connect a wallet to continue sending this transaction.
					</div>
				</div>
			);
		case 'connected':
			return (
				<div class='py-4 px-6 border border-white/10 text-center lg:text-left'>
					<div class='text-lg font-bold mb-3'>Important!</div>
					<div class='text-sm mb-3 text-white/50'>
						Your currently installed web3 wallet will ask you to confirm this
						transaction after clicking the confirm button.
					</div>
					<div class='text-sm text-white/50 mb-3'>
						Make sure to review the details!
					</div>
					<Button class='w-full py-3' type='submit'>
						Confirm Send
					</Button>
				</div>
			);
	}
};

const Header = () => {
	return (
		<Layout.Header>
			<div class='md:flex md:gap-6'>
				<Branding />
				<Connect />
			</div>
		</Layout.Header>
	);
};

const Sidebar = () => {
	const wallet = useWallet();

	switch (wallet.state) {
		case 'unknown':
		case 'disconnected':
		case 'unavailable':
			return (
				<Layout.Aside>
					<HelpCenter />
					<Support />
				</Layout.Aside>
			);
		case 'connected':
			return (
				<Layout.Aside>
					<Info
						title='Network'
						body={
							<ActiveNetwork
								network={wallet.network}
								fetchFn={wallet.getNetwork}
							/>
						}
					/>
					<Info
						title='Balance'
						body={<EthBalance fetchFn={wallet.getBalance} />}
					/>
					<UserTips />
				</Layout.Aside>
			);
	}
};

const Footer = () => {
	return (
		<Layout.Footer>
			<SocialLinks />
		</Layout.Footer>
	);
};
