import { useSignal } from '@preact/signals'
import { useAccountStore } from '../../context/Account.js'
import { useEthereumNetwork } from '../../context/EthereumProvider.js'
import { TokenList } from './TokenList.js'

export const AssetsPage = () => {
	const account = useAccountStore()
	const network = useEthereumNetwork()
	const searchQuery = useSignal('')

	if (account.value.state !== 'connected') {
		return <div>Not connected</div>
	}

	if (network.value === undefined) {
		return <div>No network</div>
	}

	return (
		<div>
			<div>
				<input class='border border-gray-200 border-b-gray-300' type='text' onInput={event => (searchQuery.value = event.currentTarget.value)} value={searchQuery.value} />
			</div>
			<TokenList address={account.value.address} chainId={network.value.chainId} query={searchQuery.value} />
		</div>
	)
}
