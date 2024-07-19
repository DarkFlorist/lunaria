import { assertUnreachable } from './utilities.js';
const ethersErrorCodes = ['UNKNOWN_ERROR', 'NOT_IMPLEMENTED', 'UNSUPPORTED_OPERATION', 'NETWORK_ERROR', 'SERVER_ERROR', 'TIMEOUT', 'BAD_DATA', 'CANCELLED', 'BUFFER_OVERRUN', 'NUMERIC_FAULT', 'INVALID_ARGUMENT', 'MISSING_ARGUMENT', 'UNEXPECTED_ARGUMENT', 'CALL_EXCEPTION', 'INSUFFICIENT_FUNDS', 'NONCE_EXPIRED', 'OFFCHAIN_FAULT', 'REPLACEMENT_UNDERPRICED', 'TRANSACTION_REPLACED', 'UNCONFIGURED_NAME', 'ACTION_REJECTED'];
export function isEthersError(error) {
    if (typeof error !== 'object')
        return false;
    if (error === null)
        return false;
    if (!('code' in error))
        return false;
    if (typeof error.code !== 'string')
        return false;
    if (!ethersErrorCodes.includes(error.code))
        return false;
    return true;
}
export function humanReadableEthersError(error) {
    switch (error.code) {
        // Generic Errors
        case 'UNKNOWN_ERROR':
            console.error('Found UNKNOWN_ERROR error: ', error);
            return { warning: true, message: `Unknown Error: ${typeof error === 'string' ? error : JSON.stringify(error)}` };
        case 'NOT_IMPLEMENTED':
            console.error('Found NOT_IMPLEMENTED Error: ', error);
            return { warning: true, message: `Error with EthersJS: "${error.info ? JSON.stringify(error.info) : ''}". This is a bug and you should report it.` };
        case 'UNSUPPORTED_OPERATION':
            return { warning: true, message: `Attempted to execute an unsupported operation: "${error.info ? JSON.stringify(error.info) : ''}". This is a bug and you should report it.` };
        case 'SERVER_ERROR':
            return { warning: true, message: `Could not communicate with server. ${error.info ? JSON.stringify(error.info) : ''}` };
        case 'TIMEOUT':
            return { warning: true, message: `Timeout during action "${error.operation}". ${error.reason}` };
        case 'BAD_DATA':
            return { warning: true, message: `EthersJS tried failed to understand this value: ${JSON.stringify(error.value)}. This is likely a bug and you should report it.` };
        case 'CANCELLED':
            return { warning: false, message: `Request was canceled by app. ${error.info ? JSON.stringify(error.info) : ''}` };
        // Operational Errors
        case 'BUFFER_OVERRUN':
            return { warning: true, message: `Buffer overrun. This likely a bug and you should report it. ${error.info ? JSON.stringify(error.info) : ''}` };
        case 'NUMERIC_FAULT':
            return { warning: true, message: `Failed to ${error.operation}. ${error.fault} with value ${error.value}` };
        // Argument Errors
        case 'INVALID_ARGUMENT':
            return { warning: true, message: `EthersJS received an invalid argument, "${error.argument}" with value ${JSON.stringify(error.value)}. This is a bug and you should report it. ${error.stack ?? ''}` };
        case 'MISSING_ARGUMENT':
            return { warning: true, message: `EthersJS expected ${error.count} arguments and received ${error.expectedCount}. This is a bug and you should report it. ${error.stack ?? ''}` };
        case 'UNEXPECTED_ARGUMENT':
            return { warning: true, message: `EthersJS received too many arguments. This is a bug and you should report it. ${error.stack ?? ''}` };
        // Blockchain Errors
        case 'CALL_EXCEPTION':
            console.error('Encountered CALL_EXCEPTION Error', error);
            if (error.receipt) {
                return { warning: true, message: `Transaction was included in block #${error.receipt.blockNumber} but reverted${error.reason ? ` with error: ${error.reason}` : ''}` };
            }
            else {
                return { warning: true, message: error.reason ? `Transaction will fail. Call exeception during ${error.action}: ${error.reason}` : `The transaction will revert. ${error.reason ?? ''}` };
            }
        case 'INSUFFICIENT_FUNDS':
            return { warning: true, message: `Account ${error.transaction.from} does not have enough funds for this transaction.` };
        case 'NONCE_EXPIRED':
            return { warning: true, message: `The transaction from ${error.transaction.from} got replaced by a transaction with the same nonce.` };
        case 'REPLACEMENT_UNDERPRICED':
            return { warning: true, message: `The replacement transaction is underpriced.` };
        case 'TRANSACTION_REPLACED':
            return { warning: true, message: `The transaction got replaced by a transaction with the same nonce` };
        case 'UNCONFIGURED_NAME':
            return { warning: true, message: `Could not find ${error.value}. This ENS address may not be registered.` };
        case 'OFFCHAIN_FAULT':
            return { warning: true, message: `Offchain CCIP Error: ${error.reason}` };
        // User Interaction Errors
        case 'ACTION_REJECTED':
            return { warning: false, message: 'User rejected the request' };
        default:
            console.error('Found unknown error: ', error);
            return { warning: true, message: `Unknown Error: ${typeof error === 'string' ? error : JSON.stringify(error)}` };
    }
}
/*
 * https://eips.ethereum.org/EIPS/eip-1474#error-codes
 * */
const jsonRpcErrorCodes = [-32002, 4100, 4900];
export function isJsonRpcError(error) {
    if (typeof error !== 'object')
        return false;
    if (error === null)
        return false;
    if (!('code' in error))
        return false;
    if (typeof error.code !== 'number')
        return false;
    if (!jsonRpcErrorCodes.includes(error.code))
        return false;
    return true;
}
export function humanReadableJsonRpcError(error) {
    switch (error.code) {
        case -32002:
            return { warning: false, message: 'A pending request to connect is awaiting response. Check your wallet for more information.' };
        case 4100:
            return { warning: false, message: 'The requested method and/or account has not been authorized by the user.' };
        case 4900:
            return { warning: false, message: 'No compatible web3 wallet was detected.' };
        default:
            assertUnreachable(error.code);
    }
}
//# sourceMappingURL=errors.js.map