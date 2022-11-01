import { useEffect } from 'preact/hooks';
import { SocialLinks } from './SocialLinks';
import useWallet from '../library/useWallet';
import Layout from './Layout';
import { HelpCenter, Info, Support, UserTips } from './SidebarWidgets';
import { Branding } from './Branding';
import { Connect } from './Connect';
import { useRoute } from './Router';
import Icon from './Icon/index';
import { ActiveNetwork } from './ActiveNetwork';
import { EthBalance } from './EthBalance';

export const HomePage = () => {
	const wallet = useWallet();
	const { navigate } = useRoute();

	const handleNavigate = (e: Event) => {
		e.preventDefault();
		const target = e.currentTarget as HTMLAnchorElement;
		const url = new URL(target.href);
		navigate(url.pathname);
	};

	useEffect(() => {
		if (wallet.state !== 'unknown') return;
		wallet.initialize();
	}, []);

	return (
		<Layout>
			<Header />
			<Layout.Main>
				<div class='flex flex-col items-center my-8'>
					<div class='text-center mb-8 text-2xl font-bold leading-tight max-w-[14rem] md:max-w-none'>
						How are you going to use your wallet?
					</div>
					<div class='flex items-center justify-center gap-6 mb-8'>
						<a href='/send-eth' onClick={handleNavigate}>
							<div class='p-10 bg-[#34153F] flex flex-col gap-6 items-center hover:bg-[#391F44] hover:cursor-pointert'>
								<span class='text-[4rem]'>
									<Icon.Ethereum />
								</span>
								<span class='font-semibold'>Send ETH</span>
							</div>
						</a>
						<div class='p-10 bg-[#34153F] flex flex-col gap-6 items-center hover:bg-[#391F44] hover:cursor-pointer'>
							<span class='text-[4rem]'>
								<Icon.Ethereum />
							</span>
							<span class='font-semibold'>Send Token</span>
						</div>
					</div>
				</div>
			</Layout.Main>
			<Sidebar />
			<Footer />
		</Layout>
	);
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
