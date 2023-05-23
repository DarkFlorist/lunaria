import { Header, HeaderNav, Main, Navigation, Root, usePanels } from '../DefaultLayout/index.js'
import { ConnectAccount } from '../ConnectAccount.js'
import { RecentTransfers } from '../RecentTransfers.js'
import { useRouter } from '../HashRouter.js'
import { TransactionResponseQuery } from './TransactionResponse.js'

const SCROLL_OPTIONS = { inline: 'start', behavior: 'smooth' } as const

export const TransactionPage = () => {
	return (
		<div class='fixed inset-0 bg-black text-white h-[100dvh]'>
			<Root>
				<LeftPanel />
				<MainPanel />
			</Root>
		</div>
	)
}

const MainPanel = () => {
	const { nav, main } = usePanels()
	const router = useRouter<{ transaction_hash: string }>()

	return (
		<Main>
			<Header>
				<HeaderNav show={main?.isIntersecting} iconLeft={MenuIcon} onClick={() => nav?.target.scrollIntoView(SCROLL_OPTIONS)} text='Menu' />
			</Header>

			<div class='px-4'>
				<ConnectAccount />
			</div>

			<div class='px-4'>
				<div class='py-4'>
					<div class='text-3xl font-bold'>Transaction Details</div>
				</div>
			</div>

			<div class='px-4'>
				<TransactionResponseQuery transactionHash={router.value.params.transaction_hash} />
			</div>
		</Main>
	)
}

const LeftPanel = () => {
	const { nav, main } = usePanels()

	return (
		<Navigation>
			<Header>
				<HeaderNav show={nav?.isIntersecting} iconLeft={CloseIcon} onClick={() => main?.target.scrollIntoView(SCROLL_OPTIONS)} text='Close Menu' />
			</Header>

			<div class='mb-4 p-4'>
				<div class='flex items-center gap-2'>
					<img class='w-10 h-10' src='/img/icon-lunaria.svg' />
					<div>
						<div class='text-3xl font-bold leading-none'>Lunaria</div>
						<div class='text-white/50 leading-none'>Decentralized Wallet</div>
					</div>
				</div>
			</div>

			<div class='pl-4 mb-4'>
				<div class='text-white/30 text-sm'>Actions</div>
				<a href="/">
					<div class='grid grid-cols-[auto,1fr] items-center gap-4 mb-4'>
						<div class='bg-white/30 w-10 h-10 rounded-full' />
						<div class='py-2 leading-tight'>
							<div class='font-bold'>New Transfer</div>
							<div class='text-white/50'>Send and Manage Tokens</div>
						</div>
					</div>
				</a>
			</div>

			<RecentTransfers />

			<div class='pl-4 mb-4'>
				<div class='text-white/30 text-sm mb-2'>Support</div>
				<div class='p-4 text-sm bg-white/5 border border-white/10 text-white/50'>
					Join our discord channel to get support from our active community members and stay up-to-date with the latest news, events, and announcements.
				</div>
			</div>

		</Navigation>
	)
}

const MenuIcon = () => <svg width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 448'><path fill='currentColor' d='M0 636.362h448v64H0zm0 160h448v64H0zm0 160h448v64H0z' transform='translate(0 -604.362)' /></svg>

const CloseIcon = () => <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M11.444.067a.895.895 0 0 0-.984.206l-4.465 4.47L1.529.273A.895.895 0 1 0 .262 1.541l4.466 4.47-4.466 4.47a.897.897 0 0 0 1.266 1.268l4.467-4.471 4.466 4.47a.896.896 0 0 0 1.267-1.267L7.26 6.01l4.466-4.47a.899.899 0 0 0-.284-1.474Z' fill='currentColor' /></svg>

