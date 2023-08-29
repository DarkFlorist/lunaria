import { useComputed } from '@preact/signals'
import { useAccount } from '../store/account.js'
import { useTransfers } from '../store/transfer.js'
import { TimeAgo } from './TimeAgo.js'

export const RecentTransfers = () => {
	const allTransfers = useTransfers()
	const { address } = useAccount()

	const connectedAddress = useComputed(() => address.value.state !== 'resolved' ? undefined : address.value.value)

	const getRecentTransferFromConnecteAddress = () => allTransfers.value.data
		// select only transfers from connected address
		.filter((transfer) => transfer.from === connectedAddress.value)
		// sort by recent transfer date
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	)

	const connectedAddressTransfers = useComputed(getRecentTransferFromConnecteAddress)

	if (connectedAddressTransfers.value.length < 1) return <></>

	return (
		<div class='pl-4 mb-4'>
			<div class='text-white/30 text-sm mb-2'>Recent Transfers</div>
			<div>
				{connectedAddressTransfers.value.map(transfer => {
					const timeStamp = new Date(transfer.date).getTime()
					return (
						<a class='block bg-white/10 px-4 py-3 mb-1 hover:bg-white/20' href={`#tx/${transfer.hash}`}>
							<div class='overflow-hidden text-ellipsis whitespace-nowrap'>
								Sent {transfer.amount} {transfer.token?.name || 'ETH'} to {transfer.to}
							</div>
							<div class='text-sm text-white/50'>
								<TimeAgo since={timeStamp} />
							</div>
						</a>
					)
				})}
			</div>
		</div>
	)
}
