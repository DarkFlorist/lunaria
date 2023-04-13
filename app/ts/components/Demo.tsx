import { useComputed, useSignal } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import { useAccount } from '../store/account.js'
import { TokenMeta, useAccountTokens } from '../store/tokens.js'
import { useNetwork } from '../store/network.js'

export const DemoPage = () => {
	return (
		<div class='p-4'>
			<div class='font-bold'>ActiveAddress</div>
			<Address />
			<hr class='my-4' />

			<div class='font-bold'>Network ID</div>
			<Network />
			<hr class='my-4' />

			<div class='font-bold'>Account Tokens</div>
			<AccountTokens />
			<hr class='my-4' />

			<div class='font-bold'>Add Tokens</div>
			<AddToken />
		</div>
	)
}

type ButtonProps = {
	text: string
	onClick: () => void
}

const Button = ({ text, onClick }: ButtonProps) => {
	return (
		<button class='bg-black/20 px-4 py-2 leading-none' onClick={onClick}>
			{text}
		</button>
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
					<div>{network.value.value.chainId}</div>
				</>
			)
	}
}

const AccountTokens = () => {
	const { tokens } = useAccountTokens()
	const { network } = useNetwork()

	const tokensInChain = useComputed(() => {
		return tokens.value.filter(token => {
			const chainId = network.value.state !== 'resolved' ? 1 : network.value.value.chainId
			return token.chainId === chainId
		})
	})

	return (
		<div>
			{tokensInChain.value.map(token => (
				<div>- {token.name}</div>
			))}
		</div>
	)
}

const AddToken = () => {
	const { addToken } = useAccountTokens()
	const { network } = useNetwork()

	const chainId = useComputed(() => {
		return network.value.state !== 'resolved' ? 1 : network.value.value.chainId
	})

	const tokenMeta = useSignal<TokenMeta>({
		chainId: chainId.value,
		name: '',
		address: '',
		symbol: '',
		decimals: 18,
	})

	const handleChange = (e: JSX.TargetedEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget

		let inputValue: string | number = value
		if (name === 'chainId' || name === 'decimals') {
			inputValue = parseInt(inputValue)
		}

		tokenMeta.value = { ...tokenMeta.value, [name]: inputValue }
	}

	const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
		e.preventDefault()
		addToken(tokenMeta.value)
	}

	return (
		<form onSubmit={handleSubmit}>
			<input class='border block' placeholder='Name' name='name' onInput={handleChange} />
			<input class='border block' placeholder='Address' name='address' onInput={handleChange} />
			<input class='border block' placeholder='Symbol' name='symbol' onInput={handleChange} />
			<input class='border block' placeholder='Decimals' name='decimals' onInput={handleChange} />
			<button type='submit' class='bg-black/20 px-4 py-2 leading-none'>
				Add
			</button>
		</form>
	)
}
