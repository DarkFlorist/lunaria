import { signal } from '@preact/signals'
import { ethers } from 'ethers'
import { isEthereumJsonRpcError, EthereumJsonRpcError } from '../library/exceptions.js'
import { assertsExternalProvider, isEthereumObservable } from '../library/utilities.js'

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
}

type AccountConnectRejected = {
	status: 'rejected'
	error: EthereumJsonRpcError | Error
}

export type AccountStore = AccountBusy | AccountConnected | AccountDisconnected | AccountConnectRejected

const storeDefaults = { status: 'disconnected', connect } as const
const store = signal<AccountStore>(storeDefaults)
export const accountStore = store

async function connect() {
	try {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		store.value = { status: 'busy' }
		await provider.send('eth_requestAccounts', [])
		const signer = provider.getSigner()
		const address = await signer.getAddress()
		store.value = { status: 'connected', address }
		// watch for account changes
		if (!isEthereumObservable(provider.provider)) return
		provider.provider.on('accountsChanged', handleAccountChange)
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

const handleAccountChange = (newAccount: string[]) => {
	if (store.value?.status !== 'connected') return
	store.value = ethers.utils.isAddress(newAccount[0]) ? { status: 'connected', address: newAccount[0] } : storeDefaults
}
