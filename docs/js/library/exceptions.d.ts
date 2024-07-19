export type EthereumJsonRpcErrorSignature = {
    error: {
        code: number;
        message: string;
        data?: any;
    };
};
export declare class EthereumJsonRpcError extends Error {
    code: number;
    message: string;
    data?: any;
    constructor(code: number, message: string, data?: any);
}
export declare function isEthereumJsonRpcError(error: unknown): error is EthereumJsonRpcErrorSignature;
//# sourceMappingURL=exceptions.d.ts.map