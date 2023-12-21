import { Interface, id, TransactionReceipt, Eip1193Provider, EventEmitterable } from 'ethers'
import { TransferLog, ERC20TransferReceipt } from '../schema.js'
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

export const erc20Interface = new Interface(ERC20ABI)
export const transferSignature = id('Transfer(address,address,uint256)')

export const isTransferTopic = (topic: string) => topic === transferSignature
export const isTransferLog = (log: unknown): log is TransferLog => TransferLog.safeParse(log).success

export function extractERC20TransferRequest(receipt: TransactionReceipt) {
	const parsedReceipt = ERC20TransferReceipt.safeParse(receipt)
	if (!parsedReceipt.success) return

	// check for ERC20 Transfer
	for (const log of parsedReceipt.value.logs) {
		const { address, data, topics: [_, from, to] } = log
		// match `receipt.to` value with `log.address` value which should be the contract's address
		if (address !== receipt.to) return
		// match `receipt.from` value with `log.from` as the sender's address
		if (from !== receipt.from) return
		// ensure request is correctly formatted
		return { contractAddress: address, from, to, quantity: data }
	}

	return
}
