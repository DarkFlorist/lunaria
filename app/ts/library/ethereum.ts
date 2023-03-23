import { BigNumber, ethers } from 'ethers'
import { Result } from 'ethers/lib/utils.js'
import { TransactionResponse, TransferTransactionResponse } from '../types.js'

export function isTransferTransaction(txResponse: TransactionResponse): txResponse is TransferTransactionResponse {
	return txResponse.data.toLowerCase().startsWith('0xa9059cbb')
}

export function isTransferLogFrom(log: ethers.providers.Log, address: string) {
	const [topic, from] = log.topics

	const transferTopic = ethers.utils.id('Transfer(address,address,uint256)')
	const topicFrom = ethers.utils.getAddress(ethers.utils.hexStripZeros(from))
	return topic === transferTopic && topicFrom === address
}

export interface TransferResult extends Result {
	from: string
	to: string
	value: BigNumber
}

export function isTransferResult(result: unknown): result is TransferResult {
	return result !== null && typeof result === 'object' && 'value' in result && typeof result.value === 'object' && 'from' in result && typeof result.from === 'string' && 'to' in result && typeof result.to === 'string'
}
