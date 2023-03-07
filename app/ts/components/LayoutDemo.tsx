import { Aside, Header, HeaderNav, Main, Navigation, Root, usePanels } from "./LayoutV2.js"

const SCROLL_OPTIONS = { inline: 'start', behavior: 'smooth' } as const

export const LayoutDemo = () => {
	return (
		<div class='fixed inset-0 bg-black text-white'>
			<Root>
				<LeftPanel />
				<MainPanel />
				<RightPanel />
			</Root>
		</div>
	)
}

const LeftPanel = () => {
	const { nav, main } = usePanels()

	return (
		<Navigation>
			<Header>
				<div class='flex justify-between h-12 items-center lg:invisible px-4'>
					<button class={`flex items-center gap-2 transition-opacity duration-500 ${nav?.isIntersecting ? `opacity-1` : `opacity-0 pointer-events-none`}`} onClick={() => main?.target.scrollIntoView(SCROLL_OPTIONS)}><span class='text-lg'>&times;</span> Hide Menu</button>
				</div>
			</Header>

			<div class='mb-2 px-4'>
				<div class='bg-white/20 h-12'></div>
			</div>

			<div class='px-4 mb-2'>
				<div class='text-white/50'>Pages</div>
				<div class='grid mb-4'>
					<div class='p-2 border-b border-b-white/20'>nav 1</div>
					<div class='p-2 border-b border-b-white/20'>nav 2</div>
				</div>
			</div>

			<div class='px-4 mb-2'>
				<div class='text-white/50'>Saved Sessions</div>
				<div class='grid mb-4'>
					<div class='p-2 border-b border-b-white/20'>Session 1</div>
					<div class='p-2 border-b border-b-white/20'>Session 2</div>
				</div>
			</div>
		</Navigation>
	)
}

const MainPanel = () => {
	const { nav, main, aside } = usePanels()

	return (
		<Main>
			<Header>
				<div class='flex justify-between h-12 items-center lg:invisible px-4'>
					<HeaderNav show={main?.isIntersecting} text='Menu' iconLeft={() => <span>☰</span>} onClick={() => nav?.target.scrollIntoView(SCROLL_OPTIONS)} />
					<HeaderNav show={main?.isIntersecting} text='Options' iconRight={() => <span>⛭</span>} onClick={() => aside?.target.scrollIntoView(SCROLL_OPTIONS)} />
				</div>
				<div class='grid grid-cols-[1fr,auto] items-center px-4 pb-2'>
					<div class='text-3xl font-bold'>Tokens</div>
					<div class='grid grid-cols-[1fr,46px] gap-2'>
						<div class='text-right'>
							<div class='text-white/50 text-sm'>Wallet Address</div>
							<div>0x2895...5289</div>
						</div>
						<div class='bg-white/20' />
					</div>
				</div>
			</Header>
			<div class='px-4 mb-2'>
				<div class='bg-white/20 h-10 w-full' />
			</div>
			<div class='px-4 grid grid-cols-2 xl:grid-cols-3 gap-2'>{Array.from({ length: 20 }, () => <div class='bg-white/20 aspect-square' />)}</div>
		</Main>
	)
}

const RightPanel = () => {
	const { main, aside } = usePanels()

	return (
		<Aside>
				<div class='flex justify-end h-12 items-center lg:invisible px-4'>
					<HeaderNav show={aside?.isIntersecting} text='Hide Options' iconRight={() => <span>&times;</span>} onClick={() => main?.target.scrollIntoView(SCROLL_OPTIONS)} />
				</div>

			<div class='pb-4 pr-4'>
				<div class='text-white/50'>Network</div>
				<div class='grid'>
					<div class='p-2 border-b border-b-white/20'>
						<div class='font-bold text-lg'>Mainnet</div>
						<div class='text-white/50'>Chain Id: 1</div>
					</div>
				</div>
			</div>

			<div class='mb-4 pr-4'>
				<div class='text-white/50 text-sm'>Options</div>
				<div class='grid'>
					<a href={location.hash} class='p-2 border-b border-b-white/20'>
						<div class='font-bold text-lg'>Option 1</div>
						<div class='text-white/50'>Some description for option 1</div>
					</a>
					<a href={location.hash} class='p-2 border-b border-b-white/20'>
						<div class='font-bold text-lg'>Option 2</div>
						<div class='text-white/50'>Some description for option 2</div>
					</a>
					<a href={location.hash} class='p-2 border-b border-b-white/20'>
						<div class='font-bold text-lg'>Option 3</div>
						<div class='text-white/50'>Some description for option 3</div>
					</a>
				</div>
			</div>
		</Aside>
	)
}


