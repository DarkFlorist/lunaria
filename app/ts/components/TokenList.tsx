import { TokenMetaData } from '../library/tokens.js'
import { removeNonStringsAndTrim } from '../library/utilities.js'
import { TokenIcon } from './Icon/Tokens/index.js'

export const TokenList = () => {
	// const active = useSignal<string | undefined>(undefined)
	// let children = []
	// for (const [id, metadata] of tokenList) {
	// 	children.push(<TokenListItem key={id} isActive={active.value === id} metadata={metadata} onChange={address => (active.value = address)} />)
	// }
	// return <div class='bg-black text-white'>{children}</div>
}

type ItemProps = {
	isActive?: boolean
	metadata: TokenMetaData
	onChange: (address: string) => void
}

export const TokenListItem = ({ metadata, isActive, onChange }: ItemProps) => {
	const classNames = removeNonStringsAndTrim('py-2 px-4 flex items-center gap-2 border-b border-white/20 cursor-pointer', isActive && 'fade-to-white')

	return (
		<div class={classNames} key={metadata.address} onClick={() => onChange(metadata.address)}>
			<div class='text-4xl'>
				<TokenIcon address={metadata.address} />
			</div>
			<div>
				<div class='font-bold'>
					{metadata.data.name} <span class='text-white/50'>{metadata.data.symbol}</span>
				</div>
				<div class='text-sm text-white/50'>BALANCE: 175.9278827423</div>
			</div>
		</div>
	)
}
