import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

export const TokenIcon = ({ address }: { address: string }) => {
	const TokenIcon = useSignal<JSX.Element | undefined>(undefined)

	const path = iconMap[address]

	const getIcon = async () => await import(path).then(cmp => (TokenIcon.value = cmp.default()))

	useEffect(() => {
		getIcon()
	}, [])

	return <>{TokenIcon.value}</>
}

const iconMap: Record<string, string> = {
	'0x4c9bbfc1fbd93dfb509e718400978fbeedf590e9': './TokenRai.js',
	'0x6b175474e89094c44da98b954eedeac495271d0f': './TokenDai.js',
	'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': './TokenWeth.js',
	'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': './TokenUsdc.js',
	'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': './TokenWbtc.js',
}
