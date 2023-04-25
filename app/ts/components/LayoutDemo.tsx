import { Aside, Main, Navigation, Page, usePanels } from "./LayoutV2"

const SCROLL_OPTIONS = { inline: 'start', behavior: 'smooth' } as const

export const LayoutDemo = () => {
	const { nav, main, aside } = usePanels()

	return (
		<div class='fixed inset-0 bg-black text-white'>
				<div class='sticky h-12 top-0 grid grid-cols-[auto,auto] items-center place-content-between bg-black/50 px-4'>
				{ nav && nav.isActive === true ? 
					<button class='h-12 flex items-center lg:hidden' onClick={() => main?.target.scrollIntoView(SCROLL_OPTIONS)}>&times; Close Menu</button> :
					<button class='h-12 flex items-center lg:hidden' onClick={() => nav?.target.scrollIntoView(SCROLL_OPTIONS)}>&larr; Show Menu</button> }
					<button class='h-12 flex items-center lg:hidden' onClick={() => aside?.target.scrollIntoView(SCROLL_OPTIONS)}>Options &rarr;</button>
				</div>
			<Page>
				<PageNavigation />
				<PanelMain />
				<PageAside />
			</Page>
		</div>
	)
}

const PageNavigation = () => {
	return <Navigation>
		<div class='p-4'>
			<div class='bg-white/20 h-12 mb-4'></div>
			<div class='text-white/50 text-sm'>Pages</div>
			<div class='grid mb-4'>
				<div class='p-2 border-b border-b-white/20'>nav 1</div>
				<div class='p-2 border-b border-b-white/20'>nav 2</div>
			</div>
			<div class='text-white/50 text-sm'>Saved Sessions</div>
			<div class='grid mb-4'>
				<div class='p-2 border-b border-b-white/20'>Session 1</div>
				<div class='p-2 border-b border-b-white/20'>Session 2</div>
			</div>
		</div>
	</Navigation>
}

const PanelMain = () => {
	return <Main>
		<div class='px-4'>
				<div class='grid gap-2 pb-4'>
			<div class='grid grid-cols-[1fr,auto] items-center'>
				<div class='text-3xl font-bold'>Tokens</div>
				<div class='grid grid-cols-[1fr,46px] gap-2'>
					<div class='text-right'>
						<div class='text-white/50 text-sm'>Wallet Address</div>
						<div>0x2895...5289</div>
					</div>
					<div class='bg-white/20' />
				</div>
			</div>
			<div class='bg-white/20 h-10 w-full' />
			<div class='grid grid-cols-2 lg:grid-cols-3 gap-2'>{Array.from({ length: 20 }, () => <div class='bg-white/20 h-40' />)}</div>
			</div>
		</div>
	</Main>
}

const PageAside = () => {
	return <Aside>
		<div class='p-4'>
			<div class='h-12 w-full' />
			<div class='text-white/50 text-sm'>Network</div>
			<div class='grid'>
				<div class='p-2 bg-white/20'>Mainnet</div>
			</div>

			<div class='grid'>
				<div class='p-2 border-b border-b-white/20'>Option 1</div>
				<div class='p-2 border-b border-b-white/20'>Option 2</div>
				<div class='p-2 border-b border-b-white/20'>Option 3</div>
			</div>
		</div>
	</Aside>
}
