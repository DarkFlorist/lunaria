import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useCallback, useContext } from 'preact/hooks'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { useAsyncState } from '../library/preact-utilities.js'
import { assertUnreachable } from '../library/utilities.js'
import { ERC20, TransactionReceipt, TransactionResponse } from '../types.js'
import { useEthereumProvider } from './EthereumProvider.js'

type TransactionQuery<T> =
	| {
			isLoading: false
			data: undefined
			error: undefined
	  }
	| {
			isLoading: true
			data: undefined
			error: undefined
	  }
	| {
			isLoading: false
			data: undefined
			error: Error
	  }
	| {
			isLoading: false
			data: T
			error: undefined
	  }

type TokenContractMeta = {
	name: string
	decimals: number
	symbol: string
}

type UseTransactionContext = {
	response: Signal<TransactionQuery<TransactionResponse>>
	receipt: Signal<TransactionQuery<TransactionReceipt>>
	token: Signal<TokenContractMeta | undefined>
}

const TransactionContext = createContext<UseTransactionContext | undefined>(undefined)

type TransactionResponseProviderProps = {
	children: ComponentChildren
	transactionHash: string
}

export const TransactionProvider = ({ children, transactionHash }: TransactionResponseProviderProps) => {
	const ethProvider = useEthereumProvider()
	const asyncResponse = useAsyncState<TransactionResponse>()
	const asyncReceipt = useAsyncState<TransactionReceipt>()
	const asyncTokenContract = useAsyncState<TokenContractMeta>()

	const token: UseTransactionContext['token'] = useSignal(undefined)

	const response: UseTransactionContext['response'] = useSignal({
		isLoading: false,
		data: undefined,
		error: undefined,
	})

	const receipt: UseTransactionContext['receipt'] = useSignal({
		isLoading: false,
		data: undefined,
		error: undefined,
	})

	const getTokenMeta = useCallback(
		(transactionResponse: TransactionResponse) => {
			const provider = ethProvider.value.provider
			if (provider === undefined) return
			asyncTokenContract.waitFor(async () => {
				const contract = new ethers.Contract(transactionResponse.to!, ERC20ABI, provider) as ERC20
				const decimals = await contract.decimals()
				const symbol = await contract.symbol()
				const name = await contract.name()
				return { name, symbol, decimals }
			})
		},
		[ethProvider.value.provider]
	)

	const getTransactionResponse = useCallback(
		(hash: string) => {
			const provider = ethProvider.value.provider
			if (provider === undefined) return
			asyncResponse.waitFor(async () => await provider.getTransaction(hash))
		},
		[ethProvider.value.provider]
	)

	function listenForResponseQueryChanges() {
		switch (asyncResponse.value.value.state) {
			case 'inactive':
				break
			case 'pending':
				response.value = { error: undefined, data: undefined, isLoading: true }
				break
			case 'rejected':
				response.value = { data: undefined, isLoading: false, error: asyncResponse.value.value.error }
				break
			case 'resolved': {
				const transactionResponse = asyncResponse.value.value.value
				asyncReceipt.waitFor(transactionResponse.wait)
				getTokenMeta(transactionResponse)
				response.value = { error: undefined, isLoading: false, data: transactionResponse }
				break
			}
			default:
				assertUnreachable(asyncResponse.value.value)
		}
	}

	function listenForContractChanges() {
		token.value = asyncTokenContract.value.value.state !== 'resolved' ? undefined : asyncTokenContract.value.value.value
	}

	function listenForReceiptQueryChanges() {
		switch (asyncReceipt.value.value.state) {
			case 'inactive':
				break
			case 'pending':
				receipt.value = { isLoading: true, error: undefined, data: undefined }
				break
			case 'rejected': {
				const error = asyncReceipt.value.value.error
				receipt.value = { isLoading: false, error, data: undefined }
				break
			}
			case 'resolved': {
				const transactionReceipt = asyncReceipt.value.value.value
				receipt.value = { isLoading: false, data: transactionReceipt, error: undefined }
				break
			}
			default:
				assertUnreachable(asyncReceipt.value.value)
		}
	}

	useSignalEffect(listenForResponseQueryChanges)
	useSignalEffect(listenForReceiptQueryChanges)
	useSignalEffect(listenForContractChanges)
	useSignalEffect(() => {
		getTransactionResponse(transactionHash)
	})

	return <TransactionContext.Provider value={{ response, receipt, token }}>{children}</TransactionContext.Provider>
}

export function queryTransactionResponse() {
	const context = useContext(TransactionContext)
	if (context === undefined) throw new Error('queryTransactionResponse can only be used within a child of TransactionProvider')
	return context.response.value
}

export function queryTransactionReceipt() {
	const context = useContext(TransactionContext)
	if (context === undefined) throw new Error('queryTransactionReceipt can only be used within a child of TransactionProvider')
	return context.receipt.value
}

export function queryTransactionToken() {
	const context = useContext(TransactionContext)
	if (context === undefined) throw new Error('queryTransactionToken can only be used within a child of TransactionProvider')
	return context.token.value
}
