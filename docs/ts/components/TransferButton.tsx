import { useComputed, useSignalEffect } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import { removeNonStringsAndTrim } from '../library/utilities.js'
import { useTransfer } from '../context/Transfer.js'
import * as Icon from './Icon/index.js'
import { useEthereumProvider } from '../context/Ethereum.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { EthereumAddress } from '../schema.js'
import { useWallet } from '../context/Wallet.js'
import { makeError } from 'ethers'

export const TransferButton = () => {
	const { transaction } = useTransfer()

	const isTransferring = useComputed(() => transaction.value.state === 'pending')

	if (isTransferring.value)
		return (
			<Button type='button' disabled>
				<Icon.Spinner />
				<span>Transfer in progress...</span>
			</Button>
		)

	return <ConnectOrTransferButton />
}

const ConnectOrTransferButton = () => {
	const { value: query, waitFor } = useAsyncState<EthereumAddress>()
	const { browserProvider } = useEthereumProvider()
	const { account } = useWallet()

	const connect = () => {
		waitFor(async () => {
			if (!browserProvider.value) {
				throw makeError('No compatible web3 wallet detected.', 'UNKNOWN_ERROR', { error: { code: 4900 } })
			}
			const signer = await browserProvider.value.getSigner()
			return EthereumAddress.parse(signer.address)
		})
	}

	const listenForQueryChanges = () => {
		// do not reset shared state for other instances of this hooks
		if (query.value.state === 'inactive') return
		account.value = query.value
	}

	useSignalEffect(listenForQueryChanges)

	switch (account.value.state) {
		case 'inactive':
		case 'rejected':
			return (
				<Button type='button' onClick={connect}>
					<ConnectIcon />
					<span>Connect Wallet</span>
				</Button>
			)
		case 'pending':
			return (
				<Button type='button' disabled>
					<Icon.Spinner />
					<span>Connecting wallet...</span>
				</Button>
			)
		case 'resolved':
			return (
				<Button type='submit'>
					<TransferIcon />
					<span>Start Transfer</span>
				</Button>
			)
	}
}

const Button = ({ class: className, children, ...props }: JSX.HTMLAttributes<HTMLButtonElement>) => {
	return (
		<button class={removeNonStringsAndTrim('outline-none border border-white/50 h-16 px-4 grid grid-flow-col items-center place-content-center gap-2 bg-white/10 font-semibold disabled:text-white/50 disabled:border-white/50 focus|hover:enabled:border-white focus|hover:enabled:bg-white/20', className)} {...props}>
			{children}
		</button>
	)
}

const ConnectIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
		<path fill='none' stroke='currentColor' stroke-width='2' d='M10 21c-2.5 2.5-5 2-7 0s-2.5-4.5 0-7l3-3 7 7-3 3Zm4-18c2.5-2.5 5-2 7.001 0 2.001 2 2.499 4.5 0 7l-3 3L11 6l3-3Zm-3 7-2.5 2.5L11 10Zm3 3-2.5 2.5L14 13Z' />
	</svg>
)

const TransferIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
		<g fill='none'>
			<path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z' />
			<path d='M20 14a1.5 1.5 0 0 1 .144 2.993L20 17H7.621l1.44 1.44a1.5 1.5 0 0 1-2.008 2.224l-.114-.103-3.829-3.83c-.974-.974-.34-2.617.991-2.725l.14-.006H20ZM14.94 3.44a1.5 1.5 0 0 1 2.007-.104l.114.103 3.829 3.83c.974.974.34 2.617-.991 2.725l-.14.006H4a1.5 1.5 0 0 1-.144-2.993L4 7h12.379l-1.44-1.44a1.5 1.5 0 0 1 0-2.12Z' fill='currentColor' />
		</g>
	</svg>
)
