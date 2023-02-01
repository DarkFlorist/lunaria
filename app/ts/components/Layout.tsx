import { ComponentChildren, JSX } from 'preact'
import { removeNonStringsAndTrim } from '../library/utilities.js'
import { ActiveNetwork } from './ActiveNetwork.js'
import { ConnectToWallet } from './ConnectToWallet.js'
import { EthBalance } from './EthBalance.js'

type LayoutComponentProps = JSX.HTMLAttributes<HTMLDivElement> & { children: ComponentChildren }

export const Page = ({ children, class: classString }: LayoutComponentProps) => {
	const classNames = removeNonStringsAndTrim(`absolute inset-0 text-white overflow-y-scroll grid [grid-template-areas:_"header"_"body"_"footer"] grid-rows-[minmax(min-content,max-content)_minmax(min-content,auto)_minmax(min-content,max-content)]`, classString)
	return (
		<div class='fixed bg-main inset-0'>
			<div class='fixed inset-0 bg-polka'></div>
			<div class={classNames}>{children}</div>
		</div>
	)
}

export const Header = () => {
	return (
		<div class='[grid-area:header] grid md:grid-cols-[minmax(min-content,auto),minmax(min-content,1fr)] md:gap-x-6  md:items-center md:justify-between gap-4 py-4 px-6'>
			<Branding />
			<ConnectToWallet />
		</div>
	)
}

export const Body = ({ children }: { children: ComponentChildren }) => {
	return (
		<div class='[grid-area:body] grid gap-6 [grid-template-areas:_"essentials"_"main"_"aside"] md:[grid-template-areas:_"main_essentials"_"main_aside"] md:grid-cols-[3fr_2fr] xl:grid-cols-[5fr_2fr] grid-rows-[minmax(min-content,max-content)_1fr] px-6'>
			<div class='[grid-area:essentials]'>
				<ActiveNetwork />
				<EthBalance />
			</div>
			<div class='[grid-area:main]'>{children}</div>
			<div class='[grid-area:aside]'>
				<Support />
			</div>
		</div>
	)
}

export const Footer = () => {
	return (
		<div class='[grid-area:footer] h-16 col-span-2 flex items-center justify-center px-8'>
			<SocialLinks />
		</div>
	)
}

const Branding = () => (
	<div class='flex flex-col justify-center items-start grow'>
		<div class='text-3xl font-bold'>Lunaria</div>
		<div class='text-sm text-white/50'>Decentralized • Open • Non-custodial</div>
	</div>
)

const SocialLinks = () => (
	<div class='flex items-center gap-6 text-white/30'>
		<a class='text-white/30 hover:text-white' href='https://github.com/DarkFlorist'>
			Github
		</a>
		<a class='text-white/30 hover:text-white' href='https://twitter.com/DarkFlorist'>
			Twitter
		</a>
		<a class='text-white/30 hover:text-white' target='' href='https://discord.gg/gU8BNhqj'>
			Discord
		</a>
	</div>
)

const Support = () => {
	return (
		<div class='bg-white/5 py-3 px-6 hover:bg-white/5 text-center md:text-left'>
			<div class='font-bold text-lg mb-2'>Need support?</div>
			<div class='text-sm text-white/50 mb-2'>Join our discord channel to get support from our active community members and stay up-to-date with the latest news, events, and announcements.</div>
		</div>
	)
}
