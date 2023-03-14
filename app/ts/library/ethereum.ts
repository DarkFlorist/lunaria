import { BigNumber, ethers } from 'ethers'
import { TransactionReceipt, TransactionResponse, TransferTransactionResponse } from '../types.js'
import { ERC20ABI } from './ERC20ABI.js'

export function isTransferTransaction(txResponse: TransactionResponse): txResponse is TransferTransactionResponse {
	return txResponse.data.startsWith('0xa9059cbb')
}

export function getTransferTokenValue(transactionReceipt: TransactionReceipt): BigNumber {
	const IERC20 = new ethers.utils.Interface(ERC20ABI)

	let tokenValue = undefined

	for (const receiptLog of transactionReceipt.logs) {
		const parsedLog = IERC20.parseLog(receiptLog)
		if (parsedLog.name.toLowerCase() === 'transfer') {
			tokenValue = parsedLog.args.value
		}
	}

	return tokenValue
}
