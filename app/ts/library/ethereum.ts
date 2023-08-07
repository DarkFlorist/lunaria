import { TransactionResponse, Interface, id, TransactionReceipt, Log, Eip1193Provider, formatEther } from 'ethers'
import { ERC20ABI } from './ERC20ABI.js'
import { ApplicationError } from '../store/errors.js'
import { z, string, function as func, object, array, record, any, promise } from 'zod'

export interface WithEthereum {
	ethereum: Eip1193Provider
}

const eip1193ProviderSchema = object({
	request: func()
		.args(object({ method: string(), params: array(any()).or(record(string(), any())) }))
		.returns(promise(any())),
})

export const globalWithEthereumSchema = z.object({
	ethereum: eip1193ProviderSchema,
})

export type GlobalWithEthereum = z.infer<typeof globalWithEthereumSchema>

export function assertsGlobalHasEthereum(global: unknown): asserts global is GlobalWithEthereum {
	const result = globalWithEthereumSchema.safeParse(global)
	if (!result.success) throw new Error()
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
	if (!withEthereum(global)) throw new ApplicationError('WALLET_MISSING')
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
