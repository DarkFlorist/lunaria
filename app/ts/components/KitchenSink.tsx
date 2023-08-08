import { useAccount } from '../store/account.js'

export const KitchenSink = () => {
	return (
		<div class='fixed inset-0 bg-black p-6 text-white'>
			<ConnectWallet />
		</div>
	)
}

const ConnectWallet = () => {
	const { address, connect } = useAccount()

	switch (address.value.state) {
		case 'inactive':
			return (
				<button class='px-4 py-2 border border-white/50 text-white' onClick={connect}>
					Connect
				</button>
			)
		case 'pending':
			return <div>connecting...</div>
		case 'rejected':
			return <div>error</div>
		case 'resolved':
			return <div>{address.value.value}</div>
	}
}
