import { ActionRejectedError, NetworkError, TimeoutError, CancelledError, NumericFaultError, MissingArgumentError, CallExceptionError, TransactionReplacedError, ReplacementUnderpricedError, UnconfiguredNameError, UnexpectedArgumentError, InvalidArgumentError, BufferOverrunError, BadDataError, ServerError, NotImplementedError, UnknownError, UnsupportedOperationError, InsufficientFundsError, NonceExpiredError, OffchainFaultError } from 'ethers'

type ETHERS_ERROR = (UnknownError & { code: 'UNKNOWN_ERROR' })
  | (NotImplementedError & { code: 'NOT_IMPLEMENTED' })
  | (UnsupportedOperationError & { code: 'UNSUPPORTED_OPERATION' })
  | (NetworkError & { code: 'NETWORK_ERROR' })
  | (ServerError & { code: 'SERVER_ERROR' })
  | (TimeoutError & { code: 'TIMEOUT' })
  | (BadDataError & { code: 'BAD_DATA' })
  | (CancelledError & { code: 'CANCELLED' })
  | (BufferOverrunError & { code: 'BUFFER_OVERRUN' })
  | (NumericFaultError & { code: 'NUMERIC_FAULT' })
  | (InvalidArgumentError & { code: 'INVALID_ARGUMENT' })
  | (MissingArgumentError & { code: 'MISSING_ARGUMENT' })
  | (UnexpectedArgumentError & { code: 'UNEXPECTED_ARGUMENT' })
  | (CallExceptionError & { code: 'CALL_EXCEPTION' })
  | (InsufficientFundsError & { code: 'INSUFFICIENT_FUNDS' })
  | (NonceExpiredError & { code: 'NONCE_EXPIRED' })
  | (OffchainFaultError & { code: 'OFFCHAIN_FAULT' })
  | (ReplacementUnderpricedError & { code: 'REPLACEMENT_UNDERPRICED' })
  | (TransactionReplacedError & { code: 'TRANSACTION_REPLACED' })
  | (UnconfiguredNameError & { code: 'UNCONFIGURED_NAME' })
  | (ActionRejectedError & { code: 'ACTION_REJECTED' })
const ETHERS_ERROR_CODES = [ 'UNKNOWN_ERROR', 'NOT_IMPLEMENTED', 'UNSUPPORTED_OPERATION', 'NETWORK_ERROR', 'SERVER_ERROR', 'TIMEOUT', 'BAD_DATA', 'CANCELLED', 'BUFFER_OVERRUN', 'NUMERIC_FAULT', 'INVALID_ARGUMENT', 'MISSING_ARGUMENT', 'UNEXPECTED_ARGUMENT', 'CALL_EXCEPTION', 'INSUFFICIENT_FUNDS', 'NONCE_EXPIRED', 'OFFCHAIN_FAULT', 'REPLACEMENT_UNDERPRICED', 'TRANSACTION_REPLACED', 'UNCONFIGURED_NAME', 'ACTION_REJECTED' ] as const
type ETHERS_ERROR_CODES = typeof ETHERS_ERROR_CODES[number]

export function isEthersError(error: unknown): error is ETHERS_ERROR {
	if (typeof error !== 'object') return false
	if (error === null) return false
	if (!('code' in error)) return false
	const code = error.code
	if (typeof code !== 'string') return false
	if (!ETHERS_ERROR_CODES.includes(code as ETHERS_ERROR_CODES)) return false
	return true
}

export type HumanReadableEthersError = { message: string, warning: boolean }

export function humanReadableEthersError(error: unknown): HumanReadableEthersError {
	if (isEthersError(error)) {
		switch (error.code) {
				// Generic Errors
			case 'UNKNOWN_ERROR':
				console.error('Found UNKNOWN_ERROR error: ', error)
				return { warning: true, message: `Unknown Error: ${typeof error === 'string' ? error : JSON.stringify(error)}` }
			case 'NOT_IMPLEMENTED':
				console.error('Found NOT_IMPLEMENTED Error: ', error)
				return { warning: true, message: `Error with EthersJS: "${error.info ? JSON.stringify(error.info) : ''}". This is a bug and you should report it.`}
			case 'UNSUPPORTED_OPERATION':
				return { warning: true, message: `Attempted to execute an unsupported operation: "${error.info ? JSON.stringify(error.info) : ''}". This is a bug and you should report it.` }
			case 'SERVER_ERROR':
				return { warning: true, message: `Could not communicate with server. ${error.info ? JSON.stringify(error.info) : ''}` }
			case 'TIMEOUT':
				return { warning: true, message: `Timeout during action "${error.operation}". ${error.reason}` }
			case 'BAD_DATA':
				return { warning: true, message: `EthersJS tried failed to understand this value: ${JSON.stringify(error.value)}. This is likely a bug and you should report it.` }
			case 'CANCELLED':
				return { warning: false, message: `Request was canceled by app. ${error.info ? JSON.stringify(error.info) : ''}` }
			// Operational Errors
			case 'BUFFER_OVERRUN':
				return { warning: true, message: `Buffer overrun. This likely a bug and you should report it. ${error.info ? JSON.stringify(error.info): ''}` }
			case 'NUMERIC_FAULT':
				return { warning: true, message: `Failed to ${error.operation}. ${error.fault} with value ${error.value}` }
			// Argument Errors
			case 'INVALID_ARGUMENT':
				return { warning: true, message: `EthersJS received an invalid argument, "${error.argument}" with value ${JSON.stringify(error.value)}. This is a bug and you should report it. ${error.stack ?? ''}` }
			case 'MISSING_ARGUMENT':
				return { warning: true, message: `EthersJS expected ${error.count} arguments and received ${error.expectedCount}. This is a bug and you should report it. ${error.stack ?? ''}` }
			case 'UNEXPECTED_ARGUMENT':
				return { warning: true, message: `EthersJS received too many arguments. This is a bug and you should report it. ${error.stack ?? ''}` }
			// Blockchain Errors
			case 'CALL_EXCEPTION':
				if (error.receipt) {
					return { warning: true, message: `Transaction was included in block #${error.receipt.blockNumber} but reverted${error.reason ? ` with error: ${error.reason}`: ''}` }
				} else {
					return { warning: true, message: error.reason ? `Transaction will fail. Call exeception during ${error.action}: ${error.reason}`: `The transaction will revert. ${error.reason ?? ''}` }
				}
			case 'INSUFFICIENT_FUNDS':
				return { warning: true, message: `Account ${error.transaction.from} does not have enough funds for this transaction.` }
			case 'NONCE_EXPIRED':
				return { warning: true, message: `The transaction from ${error.transaction.from} got replaced by a transaction with the same nonce.` }
			case 'REPLACEMENT_UNDERPRICED':
				return { warning: true, message: `The replacement transaction is underpriced.` }
			case 'TRANSACTION_REPLACED':
				return { warning: true, message: `The transaction got replaced by a transaction with the same nonce` }
			case 'UNCONFIGURED_NAME':
				return { warning: true, message: `Could not find ${error.value}. This ENS address may not be registered.` }
			case 'OFFCHAIN_FAULT':
				return { warning: true, message: `Offchain CCIP Error: ${error.reason}` }
			// User Interaction Errors
			case 'ACTION_REJECTED':
				return { warning: false, message: 'User rejected the request' }
			default:
				console.error('Found unknown error: ', error)
				return { warning: true, message: `Unknown Error: ${typeof error === 'string' ? error : JSON.stringify(error)}` }
		}
	} else {
		// string, code, extra?, fallback
		console.error('Found unknown error: ', error)
		return { warning: true, message: `Unknown Error: ${typeof error === 'string' ? error : JSON.stringify(error)}` }
	}
}
