import { DEFAULT_TOKENS, TokenMeta } from '../../library/tokens.js'

type Props = {
	chainId: number
	address: string
	query: string
}

const getOrCreateAccountTokens = (address: string, chainId: number) => {
	const tokenList = localStorage.getItem(`user_tokens:${address}`)
	if (tokenList !== null) {
		const list = JSON.parse(tokenList) as TokenMeta[]
		return list.filter(token => token.chainId === chainId)
	}
	localStorage.setItem(`user_tokens:${address}`, JSON.stringify(DEFAULT_TOKENS))
	return DEFAULT_TOKENS.filter(token => token.chainId === chainId)
}

export const TokenList = ({ address, chainId, query }: Props) => {
	const userTokens = getOrCreateAccountTokens(address, chainId)
	const filteredTokens = userTokens.filter(token => token.name.toLowerCase().includes(query.toLowerCase()))

	if (filteredTokens.length < 1) {
		return <div>Search did not match any</div>
	}

	return (
		<div>
			{filteredTokens.map(token => (
				<div>{token.name}</div>
			))}
		</div>
	)
}
