import { useComputed } from '@preact/signals'
import { useRecentTransfers } from '../store/recent-transfers.js'

export const RecentTransfers = () => {
	const { recentTxns } = useRecentTransfers()

	const sortedTxns = useComputed(() => recentTxns.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))

	if (recentTxns.value.length < 1) return <></>

	return (
		<div class='pl-4 mb-4'>
			<div class='text-white/30 text-sm mb-2'>Recent Transfers</div>
			<div>
				{sortedTxns.value.map(txn => {
					const date = new Date(txn.date)
					const dateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
					return (
						<a class='block bg-white/10 px-4 py-3 mb-1 hover:bg-white/20' href={`#tx/${txn.hash}`}>
							<div class='overflow-hidden text-ellipsis whitespace-nowrap'>{txn.hash}</div>
							<div class='text-sm text-white/50'>{dateTime}</div>
						</a>
					)
				})}
			</div>
		</div>
	)
}
