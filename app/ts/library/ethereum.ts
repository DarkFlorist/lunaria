import { BigNumber, ethers } from 'ethers'
import { Result } from 'ethers/lib/utils.js'
import { TransactionReceipt, TransactionResponse, TransferTransactionResponse } from '../types.js'
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

export function isTransferTransaction(txResponse: TransactionResponse): txResponse is TransferTransactionResponse {
	return txResponse.data.toLowerCase().startsWith('0xa9059cbb')
}

export function getTransferTokenValue(transactionReceipt: TransactionReceipt) {
	const erc20Interface = new ethers.utils.Interface(ERC20ABI)
	const transferLog = transactionReceipt.logs.find(isTokenTransferLog)
	if (transferLog === undefined) return undefined
	const logArgs = erc20Interface.parseLog(transferLog).args
	return isTransferResult(logArgs) ? logArgs.value : undefined
}

export function isTokenTransferLog(log: ethers.providers.Log) {
	const [topic] = log.topics
	const transferTopic = ethers.utils.id('Transfer(address,address,uint256)')
	return topic === transferTopic
}

export interface TransferResult extends Result {
	from: string
	to: string
	value: BigNumber
}

export function isTransferResult(result: unknown): result is TransferResult {
	return result !== null && typeof result === 'object' && 'value' in result && typeof result.value === 'object' && 'from' in result && typeof result.from === 'string' && 'to' in result && typeof result.to === 'string'
}
