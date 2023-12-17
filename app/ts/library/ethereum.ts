import { TransactionResponse, Interface, id, TransactionReceipt, Eip1193Provider, EventEmitterable, Log, isHexString } from 'ethers'
import { TransferLog, EthereumAddress, ERC20TransferMeta } from '../schema.js'
import { ERC20ABI } from './ERC20ABI.js'

export interface WithEip1193Provider {
	ethereum: Eip1193Provider
}

export type EthereumProviderEvents = 'chainChanged' | 'accountsChanged'
export type EthereumProvider = EventEmitterable<EthereumProviderEvents>

export function withEip1193Provider(global: unknown): global is WithEip1193Provider {
	return global !== null && typeof global === 'object' && 'ethereum' in global && global.ethereum !== null && typeof global.ethereum === 'object' && 'request' in global.ethereum && typeof global.ethereum.request === 'function'
}

export function isEthereumProvider(ethereum: unknown): ethereum is EthereumProvider {
	return ethereum !== null && typeof ethereum === 'object' && 'on' in ethereum && typeof ethereum.on === 'function' && 'removeListener' in ethereum && typeof ethereum.removeListener === 'function'
}

export type TransferTransactionResponse = TransactionResponse & {
	to: string
}

export function isTransferTransaction(txResponse: TransactionResponse): txResponse is TransferTransactionResponse {
	return txResponse.data.toLowerCase().startsWith('0xa9059cbb')
}

export const erc20Interface = new Interface(ERC20ABI)
export const transferSignature = id('Transfer(address,address,uint256)')

export const isTransferTopic = (topic: string) => topic === transferSignature
export const isTransferLog = (log: Log): log is TransferLog => TransferLog.safeParse(log).success

export function extractERC20TRansferMetaFromReceipt(receipt: TransactionReceipt): ERC20TransferMeta | undefined {
	const receiptTo = EthereumAddress.safeParse(receipt.to)
	const receiptFrom = EthereumAddress.safeParse(receipt.from)

	if (!receiptTo.success || !receiptFrom.success) return

	const isERC20TransferLog = (log: Log) => {
		const xferLog = TransferLog.safeParse(log)
		if (!xferLog.success) return false
		const { address, topics: [_, logFrom] } = xferLog.value
		if (address !== receiptTo.value) return false
		if (logFrom !== receiptFrom.value) return false
		return true
	}

	const erc20TransferLog = receipt.logs.filter(isTransferLog).find(isERC20TransferLog)

	if (!erc20TransferLog) return
	const { address, data, topics: [_, from, to] } = erc20TransferLog
	const parsedERC20Meta = ERC20TransferMeta.safeParse({ contractAddress: address, from, to, quantity: data })
	if (!parsedERC20Meta.success) return
	return parsedERC20Meta.value
}

const win = window as any
win.isHex = isHexString
