import { useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { useAccount } from '../../store/account.js'
import { TokenMeta, useTokenBalance } from '../../store/tokens.js'
import { AsyncText } from '../AsyncText.js'

type Props = {
	token: TokenMeta
}

export const TokenBalance = ({ token }: Props) => {
	const { tokenBalance, getTokenBalance } =  useTokenBalance()
	const { address } = useAccount()

	useSignalEffect(() => {
		if (address.value.state !== 'resolved') return
		getTokenBalance(address.value.value, token.address)
	})

	if (address.value.state !== 'resolved') return <></>

	switch (tokenBalance.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return (
				<div class='text-white/50'>
					<AsyncText />
				</div>
			)
		case 'rejected':
			return (
				<div class='text-white/50'>
					<button type='button'>Retry?</button>
				</div>
			)
		case 'resolved':
			const balance = ethers.utils.formatUnits(tokenBalance.value.value, token.decimals)
			return (
				<div class='text-white/50'>
					{balance} {token.symbol}
				</div>
			)
	}
}
