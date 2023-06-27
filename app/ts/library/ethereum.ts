import { Result } from 'ethers/lib/utils.js'
import { TransactionReceipt, TransactionResponse, Interface, Log, id } from 'ethers'
import { ERC20ABI } from './ERC20ABI.js'
import { WalletError } from './exceptions.js'

interface BrowserProvider extends ethers.providers.ExternalProvider {
	on(eventName: string | symbol, listener: (...args: any[]) => void): void
}

export interface WithEthereum {
	ethereum: BrowserProvider
}

export function withEthereum(global: unknown): global is WithEthereum {
	return global !== null && typeof global === 'object' && 'ethereum' in global && global.ethereum !== null && typeof global.ethereum === 'object' && 'on' in global.ethereum && typeof global.ethereum.on === 'function'
}

export type ObservableEthereum = {
	on(eventName: string | symbol, listener: (...args: any[]) => void): void
}

export function isEthereumObservable(ethereum: unknown): ethereum is ObservableEthereum {
	return ethereum instanceof Object && 'on' in ethereum && typeof ethereum.on === 'function'
}

export function assertsEthereumObservable(ethereum: unknown): asserts ethereum is ObservableEthereum {
	if (!isEthereumObservable(ethereum)) throw new Error('Ethereum object is not observable')
}

export function assertsWithEthereum(global: unknown): asserts global is WithEthereum {
	if (!withEthereum(global)) throw new WalletError()
}


export type TransferTransactionResponse = TransactionResponse & {
	to: string
}

export function isTransferTransaction(txResponse: TransactionResponse): txResponse is TransferTransactionResponse {
	return txResponse.data.toLowerCase().startsWith('0xa9059cbb')
}

export const erc20Interface = new Interface(ERC20ABI)

export function parseLogArgsFromReceipt(transactionReceipt: TransactionReceipt) {
	const transferLog = transactionReceipt.logs.find(isTransferLog)
	if (transferLog === undefined) return undefined
	const logArgs = erc20Interface.parseLog(transferLog)?.args
	return isTransferResult(logArgs) ? logArgs : undefined
}

export const transferTopic = id('Transfer(address,address,uint256)')

export function isTransferLog(log: Log) {
	const [topic] = log.topics
	return topic === transferTopic
}

export interface TransferResult extends Result {
	from: string
	to: string
	value: BigInt
}

export function isTransferResult(result: unknown): result is TransferResult {
	return result !== null && typeof result === 'object' && 'value' in result && typeof result.value === 'object' && 'from' in result && typeof result.from === 'string' && 'to' in result && typeof result.to === 'string'
}
