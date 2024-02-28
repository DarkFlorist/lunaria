import { ActionRejectedError, NetworkError, TimeoutError, CancelledError, NumericFaultError, MissingArgumentError, CallExceptionError, TransactionReplacedError, ReplacementUnderpricedError, UnconfiguredNameError, UnexpectedArgumentError, InvalidArgumentError, BufferOverrunError, BadDataError, ServerError, NotImplementedError, UnknownError, UnsupportedOperationError, InsufficientFundsError, NonceExpiredError, OffchainFaultError } from 'ethers';
type EthersError = (UnknownError & {
    code: 'UNKNOWN_ERROR';
}) | (NotImplementedError & {
    code: 'NOT_IMPLEMENTED';
}) | (UnsupportedOperationError & {
    code: 'UNSUPPORTED_OPERATION';
}) | (NetworkError & {
    code: 'NETWORK_ERROR';
}) | (ServerError & {
    code: 'SERVER_ERROR';
}) | (TimeoutError & {
    code: 'TIMEOUT';
}) | (BadDataError & {
    code: 'BAD_DATA';
}) | (CancelledError & {
    code: 'CANCELLED';
}) | (BufferOverrunError & {
    code: 'BUFFER_OVERRUN';
}) | (NumericFaultError & {
    code: 'NUMERIC_FAULT';
}) | (InvalidArgumentError & {
    code: 'INVALID_ARGUMENT';
}) | (MissingArgumentError & {
    code: 'MISSING_ARGUMENT';
}) | (UnexpectedArgumentError & {
    code: 'UNEXPECTED_ARGUMENT';
}) | (CallExceptionError & {
    code: 'CALL_EXCEPTION';
}) | (InsufficientFundsError & {
    code: 'INSUFFICIENT_FUNDS';
}) | (NonceExpiredError & {
    code: 'NONCE_EXPIRED';
}) | (OffchainFaultError & {
    code: 'OFFCHAIN_FAULT';
}) | (ReplacementUnderpricedError & {
    code: 'REPLACEMENT_UNDERPRICED';
}) | (TransactionReplacedError & {
    code: 'TRANSACTION_REPLACED';
}) | (UnconfiguredNameError & {
    code: 'UNCONFIGURED_NAME';
}) | (ActionRejectedError & {
    code: 'ACTION_REJECTED';
});
export declare function isEthersError(error: unknown): error is EthersError;
export type HumanReadableError = {
    message: string;
    warning: boolean;
};
export declare function humanReadableEthersError(error: EthersError): HumanReadableError;
declare const jsonRpcErrorCodes: readonly [-32002, 4100, 4900];
type JsonRpcErrorCode = typeof jsonRpcErrorCodes[number];
type JsonRpcError = Error & {
    code: JsonRpcErrorCode;
};
export declare function isJsonRpcError(error: unknown): error is JsonRpcError;
export declare function humanReadableJsonRpcError(error: JsonRpcError): HumanReadableError;
export {};
//# sourceMappingURL=errors.d.ts.map