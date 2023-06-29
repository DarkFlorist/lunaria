import { useSignalEffect } from '@preact/signals'
import { formatEther } from 'ethers'
import { useAsyncState } from '../../library/preact-utilities.js'
import { useAccount } from '../../store/account.js'
import { useNetwork } from '../../store/network.js'
import { useProviders } from '../../store/provider.js'
import { AsyncText } from '../AsyncText.js'
import * as Icon from '../Icon/index.js'

export const EtherBalance = () => {
	const { network } = useNetwork()
	const { address } = useAccount()
	const providers = useProviders()
	const { value: query, waitFor } = useAsyncState<bigint>()

	const getBalance = () => {
		if (address.value.state !== 'resolved') return
		const accountAddress = address.value.value
		waitFor(async () => {
			const provider = providers.browserProvider.value
			return await provider.getBalance(accountAddress)
		})
	}

	useSignalEffect(() => {
		if (network.value.state !== 'resolved' || address.value.state !== 'resolved') return
		getBalance()
	})

	switch (query.value.state) {
		case 'inactive':
			return <></>
		case 'rejected':
			return (
				<div class='text-white/50' title={query.value.error.message}>
					<Icon.Info />
				</div>
			)
		case 'pending':
			return (
				<div class='text-white/50'>
					<AsyncText />
				</div>
			)
		case 'resolved':
			const balance = formatEther(query.value.value)
			return <div class='text-white/50'>{balance} ETH</div>
	}
}
