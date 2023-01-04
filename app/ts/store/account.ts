import { effect, signal } from '@preact/signals'
import { ethers } from 'ethers'
import { isEthereumJsonRpcError, EthereumJsonRpcError } from '../library/exceptions.js'
import { assertsAddress, assertsExternalProvider, isEthereumObservable, isAddress } from '../library/utilities.js'

type AccountBusy = {
	status: 'busy'
}

type AccountConnected = {
	status: 'connected'
	address: string
}

type AccountDisconnected = {
	status: 'disconnected'
	connect: () => void
	ensureConnected: () => void
}

type AccountConnectRejected = {
	status: 'rejected'
	error: EthereumJsonRpcError | Error
}

export type AccountStore = AccountBusy | AccountConnected | AccountDisconnected | AccountConnectRejected

const storeDefaults = { status: 'disconnected', connect, ensureConnected } as const
const store = signal<AccountStore>(storeDefaults)
export const accountStore = store

async function connect() {
	try {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		store.value = { status: 'busy' }
		const accounts = await provider.send('eth_requestAccounts', [])
		assertsAddress(accounts[0])
		store.value = { status: 'connected', address: accounts[0] }
	} catch (exception) {
		let error = new Error(`An unknown error was encountered ${exception}`)
		if (exception instanceof Error) {
			error = exception
		}
		if (typeof exception === 'string') {
			error = new Error(exception)
		}
		if (exception instanceof Object) {
			if (isEthereumJsonRpcError(exception)) {
				error = new EthereumJsonRpcError(exception.code, exception.message, exception.data)
			}
		}
		store.value = { status: 'rejected', error }
	}
}

async function ensureConnected() {
	assertsExternalProvider(window.ethereum)
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	store.value = { status: 'busy' }
	const accounts = await provider.listAccounts()
	store.value = isAddress(accounts[0]) ? { status: 'connected', address: accounts[0] } : storeDefaults
}

const handleAccountChange = (newAccount: string[]) => {
	if (store.value?.status !== 'connected') return
	store.value = isAddress(newAccount[0]) ? { status: 'connected', address: newAccount[0] } : storeDefaults
}

// watch for account changes when an account is connected
const observeAccountStatusChanges = () => {
	if (!isEthereumObservable(window.ethereum)) return
	window.ethereum.on('accountsChanged', handleAccountChange)
}

effect(() => {
	if (store.value.status !== 'connected') return
	observeAccountStatusChanges()
})
