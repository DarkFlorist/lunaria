import { JSX } from 'preact/jsx-runtime'
import { ComponentChildren } from 'preact'
import { Signal, useComputed } from '@preact/signals'
import { TokenMeta, useAccountTokens, useTokenQuery } from '../store/tokens.js'
import { AsyncProperty } from '../library/preact-utilities.js'

export const QueryToken = () => {
	const { query, tokenAddress } = useTokenQuery()

	return (
		<div>
			<TokenAddressField address={tokenAddress} />
			<Helper query={query} />
		</div>
	)
}

type HelperProps = {
	query: Signal<AsyncProperty<TokenMeta>>
}

const Helper = ({ query }: HelperProps) => {
	switch (query.value.state) {
		case 'inactive':
			return <></>

		case 'pending':
			return (
				<Boxed>
					<div class='flex gap-2 items-center'>
						<svg class='animate-spin w-4 h-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
							<circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle>
							<path class='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
						</svg>
						<div>Retrieving token information from the network.</div>
					</div>
				</Boxed>
			)

		case 'rejected':
			return (
				<Boxed>
					<div class='flex items-center gap-2'>
						<div class='font-bold'>&times;</div>
						<div>The active network failed to retrieve token information.</div>
					</div>
				</Boxed>
			)

		case 'resolved':
			return (
				<Boxed>
					<AddTokenToAssets token={query.value.value} />
				</Boxed>
			)
	}
}

const Boxed = ({ children }: { children: ComponentChildren }) => {
	return <div class='border px-4 min-h-16 py-3 my-2 leading-tight'>{children}</div>
}

type TokenAddressFieldProps = {
	address: Signal<string>
}

const TokenAddressField = ({ address }: TokenAddressFieldProps) => {
	const handleChange = (e: JSX.TargetedEvent<HTMLInputElement>) => {
		const target = e.currentTarget
		target.checkValidity()
		address.value = target.value
	}

	return (
		<div>
			<input pattern='^0x[0-9A-Fa-f]{40}$' placeholder='Enter token address' value={address.value} onInput={handleChange} class='peer border w-full h-10 px-2 invalid:text-red-600 disabled:text-black/50 focus:outline-none' />
			<div class='hidden peer-invalid:block text-sm text-red-600'>Invalid address</div>
		</div>
	)
}

const AddTokenToAssets = ({ token }: { token: TokenMeta }) => {
	const { tokens, addToken } = useAccountTokens()

	const tokenExist = useComputed(() => Boolean(tokens.value.find(userToken => userToken.address === token.address)))

	console.log(tokenExist.value)

	return (
		<div class='flex gap-4 items-center'>
			<div>
				<span class='font-bold'>{token.name}</span> <span class='text-black/50'>({token.symbol})</span>
			</div>
			{tokenExist.value ? (
				<div class='text-black/50'>Saved</div>
			) : (
				<button onClick={() => addToken(token)} class='border px-4 py-2'>
					+ Add To Assets
				</button>
			)}
		</div>
	)
}
