import { useCallback } from 'preact/hooks'
import { assertUnreachable } from '../library/utilities.js'
import { accountStore } from '../store/account.js'
import { useBalanceAsync } from '../store/balance.js'
import * as Icon from './Icon/index.js'

export const EthBalance = () => {
	const ethBalance = useBalanceAsync()

	const checkBalance = useCallback(() => {
		if (accountStore.value.status !== 'connected' || ethBalance.state !== 'inactive') return
		ethBalance.checkEthBalance()
	}, [accountStore.value.status])

	if (accountStore.value.status === 'disconnected')
		return (
			<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
				<div class='uppercase text-white/50 text-xs md:text-sm flex'>balance (ETH)</div>
				<div class='flex items-center gap-2'>
					<div>
						<button class='font-bold text-white/80 hover:text-white' onClick={accountStore.value.connect}>
							Connect wallet
						</button>{' '}
						<span class='text-white/50'>to view balance</span>
					</div>
				</div>
			</div>
		)

	switch (ethBalance.state) {
		case 'inactive':
			checkBalance()
			return null

		case 'pending':
			return (
				<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
					<div class='uppercase text-white/50 text-xs md:text-sm'>
						<div class='h-4 md:h-5 w-24 animate-pulse bg-white/30' />
					</div>
					<div class='flex items-center gap-2'>
						<div class='h-5 my-1 w-40 animate-pulse bg-white/30' />
					</div>
				</div>
			)

		case 'resolved':
			return (
				<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
					<div class='uppercase text-white/50 text-xs md:text-sm flex'>balance (ETH)</div>
					<div class='flex items-center gap-2'>
						<div class='text-lg font-bold capitalize'>{ethBalance.balance} ETH</div>
						<button type='button' class='focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white rounded' title='Refresh' onClick={checkBalance}>
							<Icon.Refresh />
						</button>
					</div>
				</div>
			)

		case 'rejected':
			return <div>Error</div>
		default:
			assertUnreachable(ethBalance)
	}
}
