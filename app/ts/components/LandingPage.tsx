import { FunctionalComponent } from 'preact';
import { SocialLinks } from './SocialLinks';
import Layout from './Layout';
import Icon from './Icon';
import { Support, UserTips } from './SidebarWidgets';
import { Branding } from './Branding';
import { Connect } from './Connect';
import { useRoute } from './Router';
import { ActiveNetwork } from './ActiveNetwork';
import { EthBalance } from './EthBalance';

export const HomePage = () => {
	return (
		<Layout>
			<Header />
			<Main />
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

const Main = () => {
	const { navigate } = useRoute();

	const handleNavigate = (e: Event) => {
		e.preventDefault();
		const target = e.currentTarget as HTMLAnchorElement;
		const url = new URL(target.href);
		navigate(url.pathname);
	};

	return (
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
	);
};

const Sidebar = () => {
	return (
		<Layout.Aside>
			<ActiveNetwork />
			<EthBalance />
			<UserTips />
			<Support />
		</Layout.Aside>
	);
};

const Footer = () => {
	return (
		<Layout.Footer>
			<SocialLinks />
		</Layout.Footer>
	);
};

const Wrapper: FunctionalComponent = ({ children }) => {
	return (
		<div class='flex flex-col items-center md:items-start gap-1 mb-6'>
			{children}
		</div>
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
