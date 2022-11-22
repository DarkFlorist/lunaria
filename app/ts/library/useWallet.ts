import { signal } from '@preact/signals'
import { ethers } from 'ethers'
import { CACHE_ID } from '../constants'
import { assertIsAddress, localCache } from './utilities'

declare global {
	interface Window {
		ethereum?: WindowEthereumProvider
	}
}

export type Web3Provider = ethers.providers.Web3Provider
export type Network = ethers.providers.Network
type WindowEthereumProvider = ethers.providers.ExternalProvider & {
	on(eventName: string | symbol, listener: (...args: any[]) => void): void
}

export type HexString = `0x${string}`

export type NoWallet = {
	status: 'nowallet'
	initialize: () => void
}

export type DisconnectedWallet = {
	status: 'disconnected'
	ethereum: WindowEthereumProvider
	provider: Web3Provider
	connect: () => Promise<void>
}

export type ConnectedWallet = {
	status: 'connected'
	account: HexString
	provider: Web3Provider
	ethereum: WindowEthereumProvider
	disconnect: () => Promise<void>
	getBalance: () => Promise<string>
	getNetwork: () => Promise<Network>
}

export type UseWallet = NoWallet | DisconnectedWallet | ConnectedWallet

const initialState: NoWallet = { status: 'nowallet', initialize: () => {} }
const wallet = signal<UseWallet>(initialState)

export default function useWallet(): UseWallet {
	const reconnect = localCache(CACHE_ID)

	switch (wallet.value.status) {
		case 'disconnected': {
			const { status, provider, ethereum } = wallet.value

			const connect = async () => {
				const accounts = await provider.send('eth_requestAccounts', [])
				const activeAccount = accounts[0]

				assertIsAddress(activeAccount)

				// store in cache to reconnect on page refresh
				reconnect.value = true

				wallet.value = {
					status: 'connected',
					account: activeAccount,
					ethereum,
					provider,
					disconnect: () => new Promise(() => {}),
					getBalance: () => new Promise(() => {}),
					getNetwork: () => new Promise(() => {}),
				}
			}

			if (reconnect.value === true) connect()

			return { status, provider, ethereum, connect }
		}

		case 'connected': {
			const { status, account, provider, ethereum } = wallet.value

			async function disconnect() {
				wallet.value = {
					status: 'disconnected',
					ethereum,
					provider,
					connect: () => new Promise(() => {}),
				}

				reconnect.remove()
			}

			async function getBalance() {
				const bigNumBalance = await provider.getBalance(account)
				const balance = ethers.utils.formatEther(bigNumBalance)
				return balance
			}

			async function getNetwork() {
				return await provider.getNetwork()
			}

			function switchAccount(account: HexString) {
				wallet.value = Object.assign({}, wallet.value, { account })
			}

			// listen on account change event
			ethereum.on('accountsChanged', (accounts: typeof account[]) => {
				const newAccount = accounts[0]
				!ethers.utils.isAddress(newAccount) ? disconnect() : switchAccount(newAccount)
			})

			// listen on chainId / network change event
			ethereum.on('chainChanged', () => window.location.reload())

			return { status, account, ethereum, provider, disconnect, getBalance, getNetwork }
		}

		case 'nowallet':
			const { status } = wallet.value

			function initialize() {
				web3WalletExists(window.ethereum)
				wallet.value = {
					status: 'disconnected',
					ethereum: window.ethereum,
					provider: new ethers.providers.Web3Provider(window.ethereum),
					connect: () => new Promise(() => {}),
				}
			}

			initialize()

			return { status, initialize }

		default:
			const _exhaustiveCheck: never = wallet.value
			throw new Error(`Exhaustiveness check failed with value ${_exhaustiveCheck}`)
	}
}

function web3WalletExists(windowEthereum: unknown): asserts windowEthereum is WindowEthereumProvider {
	if (windowEthereum === undefined) throw new Error('No Web3 wallet installed.')
}
