import { useSignal, useSignalEffect } from '@preact/signals'
import { TransactionResponse, getAddress, parseEther, Contract, parseUnits } from 'ethers'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { useProviders } from './provider.js'
import { useRecentTransfers } from './recent-transfers.js'
import { TokenMeta } from './tokens.js'

export type TransferData = {
	recipientAddress: string
	amount: string
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
			const signer = await providers.browserProvider.getSigner()
			const to = getAddress(data.value.recipientAddress)

			// Ether transfer
			if (data.value.token === undefined) {
				const value = parseEther(data.value.amount)
				const response = await signer.sendTransaction({ to, value })
				add({ hash: response.hash, recipientAddress: to, date: Date.now(), amount: data.value.amount })
				return response
			}

			// Token transfer
			const tokenMetadata = data.value.token
			const contract = new Contract(tokenMetadata.address, ERC20ABI, signer)
			const value = parseUnits(data.value.amount, tokenMetadata.decimals)
			const response = await contract.transfer(to, value)
			add({ hash: response.hash, token: tokenMetadata, recipientAddress: to, date: Date.now(), amount: data.value.amount })
			return response
		})
	}

	const clearData = () => {
		data.value = transferDataDefaults
	}

	const listenForQueryChanges = () => {
		// do not reset shared state for other instances of this hooks
		if (query.value.state === 'inactive') return
		transaction.value = query.value
	}

	useSignalEffect(listenForQueryChanges)

	return { transaction, data, send, clearData }
}
