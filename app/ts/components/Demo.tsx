import { useComputed } from '@preact/signals'
import { useAccount } from '../store/account.js'
import { useAccountTokens } from '../store/tokens.js'
import { useNetwork } from '../store/network.js'
import { QueryToken } from './QueryToken.js'
import { assertUnreachable } from '../library/utilities.js'

export const DemoPage = () => {
	return (
		<div class='p-4'>
			<div class='font-bold mt-4'>ActiveAddress</div>
			<hr class='my-1' />
			<Address />

			<div class='font-bold mt-4'>Network ID</div>
			<hr class='my-1' />
			<Network />

			<div class='font-bold mt-4'>Account Tokens</div>
			<hr class='my-1' />
			<AccountTokens />

			<div class='font-bold mt-4'>Add Token</div>
			<hr class='my-1' />
			<AddTokenToAccount />
		</div>
	)
}

const Address = () => {
	const { address, connect } = useAccount()

	switch (address.value.state) {
		case 'inactive':
			return <Button text='Connect' onClick={() => connect()} />
		case 'pending':
			return <>connecting...</>
		case 'rejected':
			return <>error</>
		case 'resolved':
			return (
				<>
					<div>{address.value.value}</div>
				</>
			)
	}
}

const Network = () => {
	const { network } = useNetwork()

	switch (network.value.state) {
		case 'inactive':
			return <div>Disconnected</div>
		case 'pending':
			return <>connecting...</>
		case 'rejected':
			return <>error</>
		case 'resolved':
			return (
				<>
					<div>
						{network.value.value.chainId} - {network.value.value.name}
					</div>
				</>
			)
	}
}

const AccountTokens = () => {
	const { tokens, removeToken } = useAccountTokens()
	const { network } = useNetwork()

	const tokensInChain = useComputed(() => {
		return tokens.value.filter(token => {
			const chainId = network.value.state !== 'resolved' ? 1 : network.value.value.chainId
			return token.chainId === chainId
		})
	})

	if (tokensInChain.value.length < 1) {
		return <div>No tokens</div>
	}

	return (
		<div>
			{tokensInChain.value.map(token => (
				<div class='border-b flex items-center gap-4 h-10'>
					<span>{token.name}</span>
					<button class='border p-1 text-xs font-bold uppercase leading-none' onClick={() => removeToken(token.address)}>
						&times; remove
					</button>
				</div>
			))}
		</div>
	)
}

const AddTokenToAccount = () => {
	const { address, connect } = useAccount()

	switch (address.value.state) {
		case 'inactive':
			return <Button text='Connect' onClick={() => connect()} />
		case 'pending':
			return <Button text='Connect' onClick={() => connect()} disabled />
		case 'rejected':
			return <div>Error connecting to account</div>
		case 'resolved':
			return (
				<div class='grid grid-cols-1 gap-2'>
					<div class=''>Test addresses</div>
					<div class='text-xs'>
						Goerli USDC <pre class='inline px-2 py-1 bg-black/10'>0x07865c6E87B9F70255377e024ace6630C1Eaa37F</pre>
					</div>
					<div class='text-xs'>
						Mainnet USDC <pre class='inline px-2 py-1 bg-black/10'>0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48</pre>
					</div>
					<QueryToken />
				</div>
			)
		default:
			assertUnreachable(address.value)
	}
}

type ButtonProps = {
	text: string
	disabled?: boolean
	onClick: () => void
}

const Button = ({ text, disabled, onClick }: ButtonProps) => {
	return (
		<button class='bg-black/20 px-4 py-2 leading-none' onClick={onClick} disabled={disabled}>
			{text}
		</button>
	)
}
