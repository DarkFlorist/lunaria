import { useSignal, useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { useAccountStore } from '../context/Account.js'
import { useEthereumProvider } from '../context/EthereumProvider.js'
import { Network } from '../types.js'

export const ActiveNetwork = () => {
	const network = useSignal<Network | undefined>(undefined)
	const account = useAccountStore()
	const ethProvider = useEthereumProvider()

	const getNetwork = async () => {
		if (ethProvider.value.provider === undefined) return
		network.value = await ethProvider.value.provider.getNetwork()
	}

	useSignalEffect(() => {
		getNetwork()
	})

	if (account.value.state === 'disconnected') {
		return (
			<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2 px-4'>
				<div class='capitalize text-white/50 text-xs md:text-sm'>network</div>

				<div class='flex items-center gap-2'>
					<button class='font-bold text-white/80 hover:text-white' onClick={account.value.connect.bind(undefined, false)}>
						Connect wallet
					</button>
					<span class='text-white/50'>to view network</span>
				</div>
			</div>
		)
	}

	if (network.value === undefined)
		return (
			<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2 px-4'>
				<div class='capitalize text-white/50 text-xs md:text-sm'>network</div>
				<div class='text-lg font-bold capitalize'>Unavailable at this moment</div>
			</div>
		)

	return (
		<div class='flex flex-col items-center justify-center md:items-start md:gap-1 mb-2 px-4'>
			<div class='capitalize text-white/50 text-xs md:text-sm'>network</div>
			<div class='text-lg font-bold capitalize' title={ethers.utils.hexlify(network.value.chainId)}>
				{network.value.chainId === 1 ? 'Ethereum Mainnet' : network.value.name}
			</div>
		</div>
	)
}
