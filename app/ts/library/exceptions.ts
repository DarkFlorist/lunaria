export type EthereumJsonRpcErrorSignature = {
	code: number
	message: string
	data?: any
}

export class EthereumJsonRpcError extends Error {
	public code: number
	public message: string
	public data?: any

	constructor(code: number, message: string, data?: any) {
		super(message)
		this.name = 'EthereumJsonRpcError'
		this.code = code
		this.message = message
		this.data = data

		Object.setPrototypeOf(this, EthereumJsonRpcError.prototype)
	}
}

export function isEthereumJsonRpcError(data: Object): data is EthereumJsonRpcErrorSignature {
	return 'code' in data && typeof data.code === 'number' && 'message' in data && typeof data.message === 'string'
}
