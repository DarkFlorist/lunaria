import * as Layout from './Layout.js'
import * as Icon from './Icon/index.js'
import { ConnectToWallet } from './ConnectToWallet.js'
import { AddressField } from './AddressField.js'
import { AmountField } from './AmountField.js'
import { ComponentChildren } from 'preact'

export const SendEthPage = () => {
	return (
		<Page>
			<Header>
				<div class='[grid-area:brand]'>
					<Branding />
				</div>
				<div class='[grid-area:profile]'>
					<ConnectToWallet />
				</div>
			</Header>

			<Body>
				<div class='[grid-area:essentials]'>
					<ActiveNetwork />
					<EthBalance />
				</div>
				<div class='[grid-area:main]'>
					<Main />
				</div>
				<div class='[grid-area:aside]'>
					<Support />
				</div>
			</Body>

			<Footer />
		</Page>
	)
}


export type SendTransactionInput = {
	amount: string
	to: string
}

const Page = ({ children }: { children: ComponentChildren }) => {
	return (
		<Layout.Page class='grid [grid-template-areas:_"header"_"body"_"footer"] grid-rows-[minmax(min-content,max-content)_minmax(min-content,auto)_minmax(min-content,max-content)]'>{children} </Layout.Page>
	)
}
const Header = ({ children }: { children: ComponentChildren }) => <Layout.Header class='grid [grid-template-areas:_"brand"_"profile"] md:[grid-template-areas:_"brand_profile"] md:items-center md:justify-between gap-4 py-4 px-6'>{children}</Layout.Header>

const Body = ({ children }: { children: ComponentChildren }) => <Layout.Body class='grid gap-6 [grid-template-areas:_"essentials"_"main"_"aside"] md:[grid-template-areas:_"main_essentials"_"main_aside"] md:grid-cols-[3fr_2fr] xl:grid-cols-[5fr_2fr] md:grid-rows-[minmax(min-content,max-content)_1fr] px-6'>{children}</Layout.Body>

const Main = () => <div class='grid [grid-template-areas:_"title"_"token"_"amount"_"address"_"tip"_"controls"] grid-rows-[repeat(auto-fit,minmax(min-content,0))] gap-y-4 lg:[grid-template-areas:_"title_title"_"token_amount"_"address_address"_"tip_tip"_"controls_controls"] lg:gap-x-6 xl:[grid-template-areas:_"title_title_title"_"token_amount_tip"_"address_address_tip"_"controls_controls_tip"]'>
	<div class='[grid-area:title]'>
		<div class='bg-white/10 text-xl font-bold px-6 py-2 -ml-6'>Send Funds</div>
	</div>
	<div class='[grid-area:token]'>
		<TokenSelectField />
	</div>
	<div class='[grid-area:amount]'>
		<AmountField value='0' onChange={() => { }} label='Amount' name='amount' />
	</div>
	<div class='[grid-area:address]'>
		<AddressField value='' onChange={() => { }} label='Address' name='to' />
	</div>
	<div class='[grid-area:tip] border border-dashed border-white/30'>
		<div class='p-4'>Guide</div>
	</div>
	<div class='[grid-area:controls]'>
		<button class='px-4 py-2 hover:bg-white/10 border w-full'>Send</button>
	</div>
</div>

const TokenSelectField = () => {

	return <div class='flex flex-col gap-1'>
		<div class='text-sm text-white/50'>Token</div>
		<div class='appearance-none relative flex items-center px-3 h-10 bg-white/5 w-full outline-none disabled:bg-white/5 disabled:text-white/30 invalid:text-red-200 border-b border-white/30 focus:border-b-white'>
			<div class='cursor-pointer'>ETH</div>
		</div>
	</div>
}

const Footer = () => {
	return (
		<Layout.Footer class='h-16 col-span-2 flex items-center justify-center px-8'>
			<SocialLinks />
		</Layout.Footer>
	)
}

const Branding = () => (
	<div class='flex flex-col justify-center items-start grow'>
		<div class='text-3xl font-bold'>Lunaria</div>
		<div class='text-sm text-white/50'>Manage your digital assets</div>
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

const EthBalance = () => (
	<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
		<div class='uppercase text-white/50 text-xs md:text-sm'>balance (ETH)</div>
		<div class='flex items-center gap-2'>
			<div class='text-lg font-bold capitalize'>100.0159 ETH</div>
			<button type='button' class='focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white rounded' title='Refresh' onClick={() => { }}>
				<Icon.Refresh />
			</button>
		</div>
	</div>
)

const ActiveNetwork = () => (
	<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
		<div class='uppercase text-white/50 text-xs md:text-sm'>network</div>
		<div class='text-lg font-bold capitalize' title='0x5'>
			Goerli
		</div>
	</div>
)
