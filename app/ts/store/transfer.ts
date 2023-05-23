import { useSignal, useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { ERC20, TransactionResponse } from '../types.js'
import { useProviders } from './provider.js'
import { useRecentTransfers } from './recent-transfers.js'
import { TokenMeta } from './tokens.js'

type TransferData = {
	recipientAddress: string,
	amount: string,
	token?: TokenMeta
}

const transferDataDefaults: TransferData = { recipientAddress: '', amount: '', token: undefined }

export function useTransfer() {
	const { add } = useRecentTransfers()
	const providers = useProviders()
	const transaction = useSignal<AsyncProperty<TransactionResponse>>({ state: 'inactive' })
	const data = useSignal<TransferData>(transferDataDefaults)
	const { value: query, waitFor } = useAsyncState<TransactionResponse>()

	const send = () => {
		waitFor(async () => {
			const provider = providers.getbrowserProvider()
			if (provider === undefined) throw new Error('Web3Provider is not instantiated.')
			const signer = provider.getSigner()
			const to = ethers.utils.getAddress(data.value.recipientAddress)

			// Ether transfer
			if (data.value.token === undefined) {
				const value = ethers.utils.parseEther(data.value.amount)
				return await signer.sendTransaction({ to, value })
			}

			// Token transfer
			const tokenMetadata = data.value.token
			const contract = new ethers.Contract(tokenMetadata.address, ERC20ABI, signer) as ERC20
			const value = ethers.utils.parseUnits(data.value.amount, tokenMetadata.decimals)
			return await contract.transfer(to, value)
		})
	}

	const clearData = () => { data.value = transferDataDefaults }

	const listenForQueryChanges = () => {
		// do not reset shared state for other instances of this hooks
		if (query.value.state === 'inactive') return
		transaction.value = query.value
	}

	useSignalEffect(listenForQueryChanges)
	useSignalEffect(() => {
		if (query.value.state === 'resolved') {
			add({ hash: query.value.value.hash, date: Date.now() })
		}
	})

	return { transaction, data, send, clearData }
}
