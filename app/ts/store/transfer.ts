import { signal, useSignal, useSignalEffect } from '@preact/signals'
import * as funtypes from 'funtypes'
import { TransactionResponse, parseEther, Contract, parseUnits } from 'ethers'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { useProviders } from './provider.js'
import { EthereumAddress, createCacheParser, TransferSchema, TokenContract } from '../schema.js'
import { RECENT_TRANSFERS_CACHE_KEY } from '../library/constants.js'
import { persistSignalEffect } from '../library/persistent-signal.js'

export type TransferData = {
	recipientAddress: string
	amount: string
	token?: TokenContract
}

const transferDataDefaults: TransferData = { recipientAddress: '', amount: '', token: undefined }

export function useTransfer() {
	const providers = useProviders()
	const transaction = useSignal<AsyncProperty<TransactionResponse>>({ state: 'inactive' })
	const data = useSignal<TransferData>(transferDataDefaults)
	const { value: query, waitFor } = useAsyncState<TransactionResponse>()

	const send = () => {
		waitFor(async () => {
			const signer = await providers.browserProvider.getSigner()
			const to = EthereumAddress.parse(data.value.recipientAddress)

			// Ether transfer
			if (data.value.token === undefined) {
				const value = parseEther(data.value.amount)
				return await signer.sendTransaction({ to, value })
			}

			// Token transfer
			const tokenMetadata = data.value.token
			const contract = new Contract(tokenMetadata.address, ERC20ABI, signer)
			const value = parseUnits(data.value.amount, tokenMetadata.decimals)
			return await contract.transfer(to, value)
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

const RecentTransfersCacheSchema = funtypes.Union(
	funtypes.Object({
		data: funtypes.Array(TransferSchema),
		version: funtypes.Literal('1.0.0'),
	}),
)

type RecentTransfers = funtypes.Static<typeof RecentTransfersCacheSchema>
const recentTransfers = signal<RecentTransfers>({ data: [], version: '1.0.0' })

export function useTransfers() {
	persistSignalEffect(RECENT_TRANSFERS_CACHE_KEY, recentTransfers, createCacheParser(RecentTransfersCacheSchema))
	return recentTransfers
}
