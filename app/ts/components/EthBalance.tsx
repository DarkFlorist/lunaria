import { ethers } from 'ethers'
import { assertUnreachable } from '../library/utilities.js'
import { useBalanceStore } from '../context/BalanceContext.js'

export const EthBalance = () => {
	const balanceStore = useBalanceStore()

	switch (balanceStore.value.state) {
		case 'unavailable':
			return (
				<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
					<div class='uppercase text-white/50 text-xs md:text-sm flex'>balance (ETH)</div>
					<div class='flex items-center gap-2'>
						<div>Balance is currently unavailable</div>
					</div>
				</div>
			)
		case 'disconnected':
			return (
				<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
					<div class='uppercase text-white/50 text-xs md:text-sm flex'>balance (ETH)</div>
					<div class='flex items-center gap-2'>
						<div>
							<button class='font-bold text-white/80 hover:text-white' onClick={balanceStore.value.connect}>
								Connect wallet
							</button>{' '}
							<span class='text-white/50'>to view balance</span>
						</div>
					</div>
				</div>
			)
		case 'connected':
			return null
		case 'updating':
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
		case 'updated':
			return (
				<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
					<div class='uppercase text-white/50 text-xs md:text-sm flex'>balance (ETH)</div>
					<div class='flex items-center gap-2'>
						<div class='text-lg font-bold capitalize'>{ethers.utils.formatEther(balanceStore.value.balance)} ETH</div>
					</div>
				</div>
			)
		case 'failed':
			return (
				<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2'>
					<div class='uppercase text-white/50 text-xs md:text-sm flex'>balance (ETH)</div>
					<div class='flex items-center gap-2'>
						<div>
							<span class='text-white/50'>Unable to view balance</span>{' '}
							<button class='font-bold text-white/80 hover:text-white' onClick={balanceStore.value.reset}>
								Retry?
							</button>
						</div>
					</div>
				</div>
			)

		default:
			assertUnreachable(balanceStore.value)
	}
}
