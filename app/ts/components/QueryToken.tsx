import { JSX } from 'preact/jsx-runtime'
import { ComponentChildren } from 'preact'
import { Signal, useComputed } from '@preact/signals'
import { TokenMeta, useAccountTokens, useManagedTokens, useTokenQuery } from '../store/tokens.js'
import { AsyncProperty } from '../library/preact-utilities.js'

type QueryTokenProps = {
	onSave: (token: TokenMeta) => void
}

export const QueryToken = ({ onSave }: QueryTokenProps) => {
	const { query, tokenAddress } = useTokenQuery()

	return (
		<div>
			<TokenAddressField address={tokenAddress} />
			<Helper query={query} onTokenSave={onSave} />
		</div>
	)
}

type HelperProps = {
	query: Signal<AsyncProperty<TokenMeta>>
	onTokenSave: (token: TokenMeta) => void
}

const Helper = ({ query, onTokenSave }: HelperProps) => {
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
					<SaveToken token={query.value.value} onSuccess={onTokenSave} />
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
		address.value = target.value.trim()
	}

	return (
		<div>
			<input pattern='^\s*0x[0-9A-Fa-f]{40}\s*$' placeholder='Enter token address' value={address.value} onInput={handleChange} class='peer border border-white/50 w-full h-10 px-2 placeholder:text-white/30 invalid:text-red-600 disabled:text-white/50 focus:outline-none bg-transparent' autoFocus={true} />
			<div class='hidden peer-invalid:block text-sm text-red-600'>Invalid address</div>
		</div>
	)
}

type SaveTokenProps = {
	token: TokenMeta
	onSuccess: (token: TokenMeta) => void
}

const SaveToken = ({ token, onSuccess }: SaveTokenProps) => {
	const { tokens } = useManagedTokens()

	const accountTokenExists = useComputed(() => Boolean(tokens.value.find(userToken => userToken.address === token.address)))

	const handleTokenSave = () => {
		tokens.value = tokens.peek().concat(token)
		onSuccess(token)
	}

	return (
		<div class='flex gap-4 items-center'>
			<div>
				<span class='font-bold'>{token.name}</span> <span class='text-white/50'>({token.symbol})</span>
			</div>
			{accountTokenExists.value ? (
				<div class='text-white/50'>Saved</div>
			) : (
				<button onClick={handleTokenSave} class='border px-4 py-2'>
					+ Save
				</button>
			)}
		</div>
	)
}
