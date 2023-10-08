import { TransactionResponse, Interface, id, TransactionReceipt, Log, Eip1193Provider, formatEther, EventEmitterable } from 'ethers'
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

export const calculateGasFee = (effectiveGasPrice: bigint, gasUsed: bigint) => {
	const gasFeeBigNum = effectiveGasPrice * gasUsed
	const gasFee = formatEther(gasFeeBigNum)
	return gasFee
}

export type TransferTransactionResponse = TransactionResponse & {
	to: string
}

export function isTransferTransaction(txResponse: TransactionResponse): txResponse is TransferTransactionResponse {
	return txResponse.data.toLowerCase().startsWith('0xa9059cbb')
}

export const erc20Interface = new Interface(ERC20ABI)
export const transferTopic = id('Transfer(address,address,uint256)')

export function parseERC20Log({ topics: [...topics], data }: Log) {
	// topics is spread to conform to parseLog parameters
	try {
		return erc20Interface.parseLog({ topics, data })
	} catch (error) {
		return null
	}
}

export function extractArgValue<T>(log: Log, argKey: string): T | null {
	const parsedLog = parseERC20Log(log)
	return parsedLog ? parsedLog.args.getValue(argKey) : null
}

export function extractTransferLogFromSender(receipt: TransactionReceipt) {
	const hasTransferTopic = (log: Log) => log.topics.some(topic => topic === transferTopic)
	const isAddressFromSender = (log: Log) => extractArgValue(log, 'from') === receipt.from
	return receipt.logs.filter(hasTransferTopic).find(isAddressFromSender) || null
}
