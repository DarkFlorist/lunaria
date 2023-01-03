export type MetaMaskRpcErrorSignature = {
	code: number
	stack: string
	message: string
}

export class MetaMaskRpcError extends Error {
	constructor(data: MetaMaskRpcErrorSignature) {
		super(data.message)

		this.name = 'MetaMaskRpcError'
		this.code = data.code
		this.stack = data.stack

		Object.setPrototypeOf(this, MetaMaskRpcError.prototype)
	}

	code: number
}

export function isMetaMaskRpcError(data: Object): data is MetaMaskRpcErrorSignature {
	return 'code' in data && typeof data.code === 'number' && 'stack' in data && typeof data.stack === 'string' && 'message' in data && typeof data.message === 'string'
}
