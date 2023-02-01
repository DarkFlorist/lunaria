import { useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { EthereumJsonRpcError } from '../library/exceptions.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { assertsExternalProvider } from '../library/utilities.js'

export type Account =
	| {
			status: 'connected'
			address: string
	  }
	| {
			status: 'disconnected'
			useAsyncConnectState: () => readonly [AsyncProperty<string>, () => void, () => void]
			ensureConnected: () => Promise<string>
	  }
	| {
			status: 'failed'
			error: EthereumJsonRpcError | Error
	  }

export function createAccountStore() {
	async function ensureConnected() {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		return await signer.getAddress()
	}

	const useAsyncConnectState = () => {
		const [subject, resolve, reset] = useAsyncState<string>()

		const connect = () => {
			resolve(async () => {
				assertsExternalProvider(window.ethereum)
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				await provider.send('eth_requestAccounts', [])
				const signer = provider.getSigner()
				return await signer.getAddress()
			})
		}

		return [subject, connect, reset] as const
	}

	const accountDefaults = { status: 'disconnected', useAsyncConnectState, ensureConnected } as const
	return useSignal<Account>(accountDefaults)
}
