export type EthereumJsonRpcErrorSignature = {
	error: {
		code: number
		message: string
		data?: any
	}
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

export function isEthereumJsonRpcError(error: unknown): error is EthereumJsonRpcErrorSignature {
	return error instanceof Object && 'error' in error && error.error instanceof Object && 'code' in error.error && typeof error.error.code === 'number' && 'message' in error.error && typeof error.error.message === 'string'
}

export class ConnectAttemptError extends Error {
	constructor(message: string = 'Connection attempt error.') {
		super()
		this.message = message
		Object.setPrototypeOf(this, ConnectAttemptError.prototype)
	}
}

export class WalletError extends Error {
	constructor(message: string = 'Wallet not installed or incompatible.') {
		super()
		this.message = message
		Object.setPrototypeOf(this, WalletError.prototype)
	}
}
