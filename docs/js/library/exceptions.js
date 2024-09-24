export class EthereumJsonRpcError extends Error {
    constructor(code, message, data) {
        super(message);
        this.name = 'EthereumJsonRpcError';
        this.code = code;
        this.message = message;
        this.data = data;
        Object.setPrototypeOf(this, EthereumJsonRpcError.prototype);
    }
}
export function isEthereumJsonRpcError(error) {
    return error instanceof Object && 'error' in error && error.error instanceof Object && 'code' in error.error && typeof error.error.code === 'number' && 'message' in error.error && typeof error.error.message === 'string';
}
//# sourceMappingURL=exceptions.js.map