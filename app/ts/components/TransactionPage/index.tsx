import { LAYOUT_SCROLL_OPTIONS } from '../../library/constants.js'
import { Header, HeaderNav, Main, Navigation, Root, usePanels } from '../DefaultLayout/index.js'
import { ConnectAccount } from '../ConnectAccount.js'
import { DiscordInvite } from '../DiscordInvite.js'
import { Favorites } from '../Favorites.js'
import { MainFooter } from '../MainFooter.js'
import { TransferHistoryProvider } from '../../context/TransferHistory.js'
import { TransferHistory } from '../TransferHistory.js'
import { TransactionDetails } from './TransactionDetails.js'
import { AccountReconnect } from '../AccountReconnect.js'
import * as Icon from '../Icon/index.js'
import { TokenManagerProvider } from '../../context/TokenManager.js'

export const TransactionPage = () => {
	return (
		<>
			<AccountReconnect />
			<div class='fixed inset-0 bg-black text-white h-[100dvh]'>
				<Root>
					<TokenManagerProvider>
						<TransferHistoryProvider>
							<LeftPanel />
							<MainPanel />
						</TransferHistoryProvider>
					</TokenManagerProvider>
				</Root>
			</div>
		</>
	)
}

const MainPanel = () => {
	const { nav, main } = usePanels()

	return (
		<Main>
			<Header>
				<HeaderNav show={main?.isIntersecting} iconLeft={Icon.Menu} onClick={() => nav?.target.scrollIntoView(LAYOUT_SCROLL_OPTIONS)} text='Menu' />
			</Header>

			<div class='px-4'>
				<ConnectAccount />
			</div>

			<div class='px-4 py-4'>
				<div class='text-3xl font-bold'>Transaction Details</div>
			</div>

			<div class='px-4'>
				<TransactionDetails />
			</div>
			<MainFooter />
		</Main>
	)
}

const LeftPanel = () => {
	const { nav, main } = usePanels()

	return (
		<Navigation>
			<Header>
				<HeaderNav show={nav?.isIntersecting} iconLeft={Icon.Xmark} onClick={() => main?.target.scrollIntoView(LAYOUT_SCROLL_OPTIONS)} text='Close Menu' />
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
				<a href='/'>
					<div class='grid grid-cols-[auto,1fr] items-center gap-4 mb-4'>
						<div class='bg-white/30 w-10 h-10 rounded-full' />
						<div class='py-2 leading-tight'>
							<div class='font-bold'>New Transfer</div>
							<div class='text-white/50'>Send and Manage Tokens</div>
						</div>
					</div>
				</a>
			</div>

			<TransferHistory />

			<Favorites />

			<DiscordInvite />
		</Navigation>
	)
}
