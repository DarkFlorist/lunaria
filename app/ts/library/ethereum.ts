import { TransactionResponse, Interface, id, TransactionReceipt, Eip1193Provider, EventEmitterable, stripZerosLeft, Log, getAddress } from 'ethers'
import { BigIntHex } from '../schema.js'
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
export const erc20TransferMethod = id('Transfer(address,address,uint256)')

export function extractERC20TransferFromReceipt(receipt: TransactionReceipt) {
	const isTransferLog = (log: Log) => {
		const [method] = log.topics
		return method === erc20TransferMethod
	}

	const logOriginAndSenderMatched = (log: Log) => {
		const [_, from] = log.topics
		try {
			const logFrom = getAddress(stripZerosLeft(from))
			const receiptFrom = getAddress(receipt.from)
			return logFrom === receiptFrom
		} catch {
			return false
		}
	}

	const parseTransferLog = (log: Log) => {
		const [_, logFrom, logTo] = log.topics
		const quantity = BigIntHex.parse(log.data)
		const contractAddress = getAddress(log.address)
		const from = getAddress(stripZerosLeft(logFrom))
		const to = getAddress(stripZerosLeft(logTo))
		return { contractAddress, from, to, quantity }
	}

	// get the outbound transfer log
	const transferLog = receipt.logs.filter(isTransferLog).find(logOriginAndSenderMatched)
	if (transferLog === undefined) return
	return parseTransferLog(transferLog)
}

