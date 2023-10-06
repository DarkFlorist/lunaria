import { useComputed } from '@preact/signals'
import { formatUnits } from 'ethers'
import { useAccount } from '../context/Account.js'
import { useTransferHistory } from '../context/TransferHistory.js'
import { Transfer } from '../schema.js'
import { TimeAgo } from './TimeAgo.js'

export const TransferHistory = () => {
	const history = useTransferHistory()
	const { account } = useAccount()

	const connectedAddress = useComputed(() => (account.value.state !== 'resolved' ? undefined : account.value.value))

	const getTransfersFromConnectedAddress = () => {
		return (
			history.value.data
				// select only history from connected account
				.filter(transfer => transfer.from === connectedAddress.value)
				// sort by recent transfer date
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		)
	}

	const connectedAddressTransfers = useComputed(getTransfersFromConnectedAddress)

	return (
		<div class='pl-4 mb-4'>
			<div class='text-white/30 text-sm mb-2'>Recent Transfers</div>
			<HistoryList transfers={connectedAddressTransfers.value} />
		</div>
	)
}

const HistoryList = ({ transfers }: { transfers: Transfer[] }) => {
	if (transfers.length < 1) return <div class='border border-dashed border-white/30 px-4 h-16 text-sm text-white/50 flex items-center justify-center leading-tight'>A history of transfers will be stored locally on the current browser.</div>

	return (
		<div>
			{transfers.map(transfer => {
				const timeStamp = new Date(transfer.date).getTime()
				const amount = formatUnits(transfer.amount, transfer.token?.decimals)
				return (
					<a class='block bg-white/10 px-4 py-3 mb-1 hover:bg-white/20' href={`#tx/${transfer.hash}`}>
						<div class='overflow-hidden text-ellipsis whitespace-nowrap'>
							Sent {amount} {transfer.token?.name || 'ETH'} to {transfer.to}
						</div>
						<div class='text-sm text-white/50'>
							<TimeAgo since={timeStamp} />
						</div>
					</a>
				)
			})}
		</div>
	)
}
