import { useComputed, useSignal } from '@preact/signals'
import { ComponentChild, ComponentChildren } from 'preact'
import { useNetwork } from '../../store/network.js'
import { TokenMeta, useAccountTokens } from '../../store/tokens.js'
import { SearchField } from './SearchField.js'

export type SelectAssetModalProps = {
	show: boolean
	onClose: () => void
	onSelect: (token?: TokenMeta) => void
}

export const TokenManager = (props: SelectAssetModalProps) => {
	const { tokens } = useAccountTokens()
	const { network } = useNetwork()
	const query = useSignal('')

	const chainId = useComputed(() => (network.value.state === 'resolved' ? network.value.value.chainId : 1))
	const tokensMatchingQuery = (token: TokenMeta) => token.name.toLowerCase().includes(query.value)
	const tokensInChain = (token: TokenMeta) => token.chainId === chainId.value
	const tokenList = useComputed(() => tokens.value.filter(tokensInChain).filter(tokensMatchingQuery))

	if (props.show === false) return <></>

	return (
		<div class='fixed inset-0 overflow-y-scroll scrollbar-hidden'>
			<div class='fixed inset-0 top-0 bg-black/80' onClick={() => props.onClose()} />

			<Dialog count={tokenList.value.length}>
				<div class='sticky top-0 bg-black/50 z-10 py-4'>
					<div class='text-3xl font-bold mb-2'>Tokens</div>
					<SearchField value={query} />
				</div>
				<TokenGrid count={tokenList.value.length}>
					{query.value === '' && <NativeCard onSelect={() => props.onSelect(undefined)} />}
					{tokenList.value.map(token => (
						<TokenCard token={token} onSelect={props.onSelect} onClose={() => props.onClose()} />
					))}
					{query.value === '' && <AddTokenCard />}
				</TokenGrid>
			</Dialog>

			<button class='fixed top-4 right-4 text-3xl z-10' onClick={() => props.onClose()}>
				&times;
			</button>
		</div>
	)
}

type TokenGridProps = {
	count: number
	children: ComponentChild
}

const TokenGrid = (props: TokenGridProps) => {
	switch (props.count) {
		case 1:
			return <div class='grid gap-4'>{props.children}</div>
		case 2:
			return <div class='grid grid-cols-2 gap-4'>{props.children}</div>
		case 3:
			return <div class='grid grid-cols-2 sm:grid-cols-3 gap-4'>{props.children}</div>
		case 4:
			return <div class='grid grid-cols-2 sm:grid-cols-4 gap-4'>{props.children}</div>
		default:
			return <div class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>{props.children}</div>
	}
}

type ContainerProps = {
	count: number
	children: ComponentChildren
}

const Dialog = (props: ContainerProps) => {
	switch (props.count) {
		case 1:
			return <div class='relative mx-auto p-4 max-w-sm'>{props.children}</div>
		case 2:
			return <div class='relative mx-auto p-4 max-w-md'>{props.children}</div>
		case 3:
			return <div class='relative mx-auto p-4 max-w-4xl'>{props.children}</div>
		case 4:
			return <div class='relative mx-auto p-4 max-w-5xl'>{props.children}</div>
		default:
			return <div class='relative mx-auto p-4 max-w-6xl'>{props.children}</div>
	}
}

export type TokenCardProps = {
	token: TokenMeta
	onSelect: (token: TokenMeta) => void
	onClose: () => void
}

const TokenCard = ({ token, onSelect }: TokenCardProps) => {
	const removal = useSignal<boolean>(false)

	return (
		<div class='aspect-square bg-neutral-800 p-4 flex items-end relative group outline-none' tabIndex={1}>
			<div class='relative'>
				<img class='w-12 h-12 mb-2' src={`/img/${token.address}.svg`} />
				<div class='font-bold'>{token.name}</div>
			</div>
			<div class='absolute inset-0 hidden group-hover:block group-focus:block'>
				{removal.value ? (
					<>
						<div class='absolute inset-0 w-full flex items-center justify-center bg-black/80 border border-white/50'>
							<div class='text-center p-4'>
								<div class='mb-2'>This will remove {token.name} from your token list, continue?</div>
								<button class='border border-white/50 px-3 py-1' onClick={() => (removal.value = false)}>
									Yes
								</button>
							</div>
						</div>
						<button class='absolute top-4 right-4' onClick={() => (removal.value = false)}>
							<svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path d='M13.5 2.116 8.616 7l4.884 4.884a1.146 1.146 0 0 1 0 1.616 1.146 1.146 0 0 1-1.616 0L7 8.616 2.116 13.5a1.146 1.146 0 0 1-1.616 0 1.146 1.146 0 0 1 0-1.616L5.384 7 .5 2.116A1.146 1.146 0 0 1 .5.5a1.146 1.146 0 0 1 1.616 0L7 5.384 11.884.5A1.146 1.146 0 0 1 13.5.5a1.146 1.146 0 0 1 0 1.616Z' fill='#fff' />
							</svg>
						</button>
					</>
				) : (
					<>
						<button class='absolute inset-0 w-full flex items-center justify-center bg-black/80 border border-white/50' onClick={() => onSelect(token)}>
							Tap to use
						</button>
						<button class='absolute top-4 right-4' onClick={() => (removal.value = true)}>
							<svg width='18' height='20' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path d='M16 5L15.133 17.142C15.0971 17.6466 14.8713 18.1188 14.5011 18.4636C14.1309 18.8083 13.6439 19 13.138 19H4.862C4.35614 19 3.86907 18.8083 3.49889 18.4636C3.1287 18.1188 2.90292 17.6466 2.867 17.142L2 5M7 9V15M11 9V15M12 5V2C12 1.73478 11.8946 1.48043 11.7071 1.29289C11.5196 1.10536 11.2652 1 11 1H7C6.73478 1 6.48043 1.10536 6.29289 1.29289C6.10536 1.48043 6 1.73478 6 2V5M1 5H17' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
							</svg>
						</button>
					</>
				)}
			</div>
		</div>
	)
}

const AddTokenCard = () => {
	return (
		<div class='aspect-square bg-neutral-900 p-4 flex items-center justify-center'>
			<div class='grid place-items-center'>
				<div class='bg-black/20 w-20 h-20 rounded-full mb-2 flex items-center justify-center'>
					<svg class='text-white/50' width='3em' height='3em' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path fill-rule='evenodd' clip-rule='evenodd' d='M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z' fill='currentColor' />
					</svg>
				</div>
				<div class='font-bold text-white/50'>Add Token</div>
			</div>
		</div>
	)
}

const NativeCard = ({ onSelect }: { onSelect: () => void }) => {
	return (
		<div class='aspect-square bg-neutral-800 p-4 flex items-end relative group outline-none' tabIndex={1}>
			<div class='relative'>
				<img class='w-12 h-12 mb-2' src={`/img/ethereum.svg`} />
				<div class='font-bold'>ETH</div>
			</div>
			<div class='absolute inset-0 hidden group-hover:block group-focus:block'>
				<>
					<button class='absolute inset-0 w-full flex items-center justify-center bg-black/80 border border-white/50' onClick={onSelect}>
						Tap to use
					</button>
				</>
			</div>
		</div>
	)
}
