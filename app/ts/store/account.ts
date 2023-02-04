import { Signal, useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { EthereumJsonRpcError } from '../library/exceptions.js'
import { AsyncState, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider } from '../library/utilities.js'

type ConnectAsync = {
	signal: AsyncState<unknown>['value']
	dispatch: () => void
	reset: AsyncState<unknown>['reset']
}

type Account =
	| {
			status: 'connected'
			address: string
	  }
	| {
			status: 'disconnected'
			connect: ConnectAsync
			ensureConnected: () => Promise<string>
	  }
	| {
			status: 'failed'
			error: EthereumJsonRpcError | Error
	  }

export type AccountStore = Signal<Account>
export function createAccountStore(): AccountStore {
	const { value, waitFor, reset } = useAsyncState()

	const ensureConnected = async () => {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		return await signer.getAddress()
	}

	const connect = {
		signal: value,
		dispatch: () => {
			waitFor(async () => {
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				await provider.send('eth_requestAccounts', [])
				const signer = provider.getSigner()
				const address = await signer.getAddress()
				accountStore.value = { status: 'connected', address }
			})
		},
		reset,
	}

	const accountDefaults = { status: 'disconnected', connect, ensureConnected } as const
	const accountStore = useSignal<Account>(accountDefaults)
	return accountStore
}
