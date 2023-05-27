import { useSignalEffect } from '@preact/signals'
import { BigNumber, ethers } from 'ethers'
import { ERC20ABI } from '../../library/ERC20ABI.js'
import { useAsyncState } from '../../library/preact-utilities.js'
import { useAccount } from '../../store/account.js'
import { useProviders } from '../../store/provider.js'
import { TokenMeta } from '../../store/tokens.js'
import { AsyncText } from '../AsyncText.js'

type Props = {
	token: TokenMeta
}

export const TokenBalance = ({ token }: Props) => {
	const { address } = useAccount()
	const providers = useProviders()
	const { value: query, waitFor } = useAsyncState<BigNumber>()

	const getBalance = (address: string) => {
		waitFor(async () => {
			const provider = providers.getbrowserProvider()
			const contract = new ethers.Contract(token.address, ERC20ABI, provider)
			return await contract.balanceOf(address)
		})
	}

	useSignalEffect(() => {
		if (address.value.state !== 'resolved') return
		getBalance(address.value.value)
	})

	if (address.value.state !== 'resolved') return <></>

	switch (query.value.state) {
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
			const balance = ethers.utils.formatUnits(query.value.value, token.decimals)
			return (
				<div class='text-white/50'>
					{balance} {token.symbol}
				</div>
			)
	}
}
