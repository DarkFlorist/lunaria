import { Signal, useComputed } from '@preact/signals'
import { TokenCard } from './TokenCard.js'
import { TokenMeta, useAccountTokens } from '../../store/tokens.js'
import { useNetwork } from '../../store/network.js'

type Props = {
	query: Signal<string>
}

export const TokenList = ({ query }: Props) => {
	const { tokens } = useAccountTokens()
	const { network } = useNetwork()

	const tokenNameSearch = (token: TokenMeta) => {
		const q = query.value.toLocaleLowerCase()
		const tokenName = token.name.toLocaleLowerCase()
		return tokenName.includes(q)
	}

	const relevantTokens = useComputed(() => {
		if (network.value.state !== 'resolved') return undefined
		const { chainId } = network.value.value
		return tokens.value.filter(token => token.chainId === chainId).filter(tokenNameSearch)
	})

	if (relevantTokens.value === undefined) return <div>No matched tokens</div>

	return (
		<div class='grid sm:grid-cols-2 lg:grid-cols-3 gap-2 xl:grid-cols-4 items-end'>
			{relevantTokens.value.map(token => (
				<TokenCard token={token} />
			))}
		</div>
	)
}
