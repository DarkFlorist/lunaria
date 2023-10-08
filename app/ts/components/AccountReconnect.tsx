import { useSignalEffect } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { useAccount } from '../context/Account.js'
import { useWallet } from '../context/Wallet.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { EthereumAddress } from '../schema.js'

export const AccountReconnect = () => {
	const { browserProvider } = useWallet()
	const { account } = useAccount()
	const { value: query, waitFor } = useAsyncState<EthereumAddress>()

	const attemptToConnect = () => {
		if (!browserProvider.value) return
		const provider = browserProvider.value
		waitFor(async () => {
			const [signer] = await provider.listAccounts()
			return EthereumAddress.parse(signer.address)
		})
	}

	const listenForQueryChanges = () => {
		// do not reset shared state for other instances of this hooks
		if (query.value.state === 'inactive') return
		account.value = query.value
	}

	useSignalEffect(listenForQueryChanges)
	useEffect(attemptToConnect, [])

	return <></>
}
