import * as Layout from './Layout'
import { Connect } from './Connect'
import { EthBalance } from './EthBalance'
import { ActiveNetwork } from './ActiveNetwork'

export const SendEthPage = () => {
	return (
		<Layout.Root>
			<Header />
			<Main />
			<Sidebar />
			<Footer />
		</Layout.Root>
	)
}

export type SendTransactionInput = {
	amount: string
	to: string
}

const Main = () => {
	return <div>Send ETH Page</div>
}

const Header = () => {
	return (
		<Layout.Header>
			<div class='md:flex md:gap-6'>
				<Branding />
				<Connect />
			</div>
		</Layout.Header>
	)
}

const Sidebar = () => {
	return (
		<Layout.Aside>
			<ActiveNetwork />
			<EthBalance />
			<UserTips />
			<Support />
		</Layout.Aside>
	)
}

const Footer = () => {
	return (
		<Layout.Footer>
			<SocialLinks />
		</Layout.Footer>
	)
}

const Branding = () => (
	<div class='flex flex-col justify-center items-start grow my-6'>
		<div class='text-3xl font-bold'>EasyWallet</div>
		<div class='text-sm text-white/50'>Securing your crypto assets has never been easier</div>
	</div>
)

const SocialLinks = () => (
	<div class='flex items-center gap-6 text-white/30'>
		<a class='text-white/30 hover:text-white' href='/'>
			Github
		</a>
		<a class='text-white/30 hover:text-white' href='/'>
			Twitter
		</a>
		<a class='text-white/30 hover:text-white' href='/'>
			Discord
		</a>
	</div>
)

const Support = () => {
	return (
		<div class='bg-white/5 py-3 px-6 hover:bg-white/5 mb-6 text-center md:text-left'>
			<div class='font-bold text-lg mb-2'>Need support?</div>
			<div class='text-sm text-white/50 mb-2'>Join our discord channel to get support from our active community members and stay up-to-date with the latest news, events, and announcements.</div>
		</div>
	)
}

const UserTips = () => {
	return (
		<div class='md:border-l-4 md:border-white/10 py-3 px-6 mb-6 text-center md:text-left'>
			<div class='font-bold text-lg mb-2'>Tip!</div>
			<div class='text-sm text-white/50 mb-2'>Refresh your balance before doing any transactions. Simply click on the refresh icon besides the balance value to update.</div>
		</div>
	)
}
