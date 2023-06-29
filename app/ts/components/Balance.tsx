import { useSignal } from '@preact/signals'
import { Contract, formatEther, formatUnits } from 'ethers'
import { useEffect } from 'preact/hooks'
import { useAccountStore } from '../context/Account.js'
import { useEthereumProvider } from '../context/EthereumProvider.js'
import { TokenAsset } from '../library/constants.js'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { assertsWeb3Provider, assertUnreachable } from '../library/utilities.js'
import { ERC20 } from '../types.js'
import { AsyncText } from './AsyncText.js'

type BalanceProps = {
	token: TokenAsset | undefined
}

export const Balance = ({ token }: BalanceProps) => {
	const account = useAccountStore()

	switch (account.value.state) {
		case 'disconnected':
		case 'connecting':
		case 'failed':
			return <span class='italic'></span>
		case 'connected':
			return <AsyncBalance address={account.value.address} token={token} />
		default:
			assertUnreachable(account.value)
	}
}

type BalanceConnectedProps = {
	address: string
	token: TokenAsset | undefined
}

const AsyncBalance = ({ address, token }: BalanceConnectedProps) => {
	const ethProvider = useEthereumProvider()
	const balance = useSignal<string | undefined>(undefined)
	const { value: query, waitFor, reset } = useAsyncState<bigint>()

	const getBalance = () => {
		reset()

		waitFor(async () => {
			const provider = ethProvider.value.provider
			assertsWeb3Provider(provider)

			if (token === undefined) {
				return await provider.getBalance(address)
			}

			const contract = new Contract(token.address, ERC20ABI, provider) as ERC20
			return await contract.balanceOf(address)
		})
	}

	const subscribeToBlockChanges = (handler: () => void) => {
		const provider = ethProvider.value.provider
		assertsWeb3Provider(provider)
		provider.addListener('block', handler)
		handler() // immediately call the handler
		return () => provider.removeListener('block', handler)
	}

	useEffect(() => {
		const unsubscribe = subscribeToBlockChanges(getBalance)
		return () => unsubscribe()
	}, [])

	switch (query.value.state) {
		case 'inactive':
		case 'pending': {
			return <AsyncText>{balance.value === undefined ? null : `balance: ${balance}`}</AsyncText>
		}
		case 'rejected':
			return <span class='italic'>Unable to get balance!</span>
		case 'resolved': {
			balance.value = token === undefined ? formatEther(query.value.value) : formatUnits(query.value.value, token.decimals)
			return <span>balance: {balance}</span>
		}
		default:
			assertUnreachable(query.value)
	}
}
