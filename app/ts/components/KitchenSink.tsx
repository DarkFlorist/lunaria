import { TokenSchema } from '../schema.js'
import { Static } from 'funtypes'
import { useAccount } from '../store/account.js'
import { MANAGED_TOKENS_CACHE_KEY } from '../library/constants.js'
import { Signal, useSignalEffect } from '@preact/signals'
import { useManagedTokens } from '../store/tokens.js'

type Token = Static<typeof TokenSchema>

const sampleToken = { address: '0x0', chainId: 5n, decimals: 18n, name: 'Foo Token', symbol: 'Foo' } satisfies Token

export const KitchenSink = () => {
	const { address, connect } = useAccount()
	const { tokens, cacheKey } = useManagedTokens()

	const addToken = (token: Token) => {
		tokens.value = tokens.peek().concat([token])
	}

	useSignalEffect(() => {
		if (address.value.state !== 'resolved') return
		cacheKey.value = `${MANAGED_TOKENS_CACHE_KEY}:${address.value.value}`
	})

	return (
		<>
			{address.value.state === 'resolved' && (
				<button class='px-4 py-2 border' onClick={() => addToken(sampleToken)}>
					add
				</button>
			)}

			<button class='px-4 py-2 border' onClick={connect}>
				connect
			</button>
			<TokenList tokens={tokens} />
		</>
	)
}

const TokenList = ({ tokens }: { tokens: Signal<Token[]> }) => {
	const removeToken = (address: Token['address']) => {
		tokens.value = [...tokens.value.filter(token => token.address !== address)]
	}

	return (
		<div>
			<div>
				{tokens.value.map(token => (
					<div class='flex gap-2'>
						<div>{token.name}</div>
						<button onClick={() => removeToken(token.address)}>x</button>
					</div>
				))}
			</div>
		</div>
	)
}
