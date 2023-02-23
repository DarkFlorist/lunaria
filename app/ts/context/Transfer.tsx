import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { useAsyncState } from '../library/preact-utilities.js'
import { assertUnreachable } from '../library/utilities.js'
import { TransactionResponse } from '../types.js'
import { useEthereumProvider } from './EthereumProvider.js'

type TransferInput = {
	to: string
	amount: string
}

type TransferSigning =
	| {
			state: 'unsigned'
			formData: Signal<TransferInput>
			send: () => void
	  }
	| {
			state: 'signing'
			formData: Signal<TransferInput>
			reset: () => void
	  }
	| {
			state: 'signed'
			transactionResponse: TransactionResponse
	  }
	| {
			state: 'failed'
			formData: Signal<TransferInput>
			error: Error
			reset: () => void
	  }

const TransferContext = createContext<Signal<TransferSigning> | undefined>(undefined)

export const TransferProvider = ({ children }: { children: ComponentChildren }) => {
	const store = createTransferStore()
	return <TransferContext.Provider value={store}>{children}</TransferContext.Provider>
}

const createTransferStore = () => {
	const { value: query, waitFor, reset } = useAsyncState<TransactionResponse>()
	const transferInput = useSignal<TransferInput>({ to: '', amount: '' })
	const providerStore = useEthereumProvider()

	const send = () => {
		waitFor(async () => {
			if (providerStore.value.provider === undefined) throw new Error('Web3Provider is not instantiated.')
			const provider = providerStore.value.provider
			const signer = provider.getSigner()
			const value = ethers.utils.parseEther(transferInput.value.amount)
			const to = ethers.utils.getAddress(transferInput.value.to)
			return await signer.sendTransaction({ to, value })
		})
	}

	const storeDefaults = { state: 'unsigned' as const, formData: transferInput, send }
	const transactionStore = useSignal<TransferSigning>(storeDefaults)

	const listenForAsyncChanges = () => {
		switch (query.value.state) {
			case 'inactive':
				transactionStore.value = storeDefaults
				break
			case 'pending':
				transactionStore.value = { state: 'signing', formData: transferInput, reset }
				break
			case 'rejected':
				transactionStore.value = { state: 'failed', error: query.value.error, formData: transferInput, reset }
				break
			case 'resolved':
				transactionStore.value = { state: 'signed', transactionResponse: query.value.value }
				break
			default:
				assertUnreachable(query.value)
		}
	}

	useSignalEffect(listenForAsyncChanges)

	return transactionStore
}

export function useTransfer() {
	const context = useContext(TransferContext)
	if (context === undefined) throw new Error('useTransfer can only be used within a child of TransferProvider')
	return context
}
