import { signal, useComputed } from '@preact/signals'

export const errors = signal<ApplicationError[]>([])

export function useErrors() {
	const latest = useComputed(() => errors.value.at(0))

	const add = (code: keyof typeof ErrorsDictionary, message?: string) => {
		const error = new ApplicationError(code, message)
		errors.value = [error, ...errors.value]
	}

	const remove = (code: keyof typeof ErrorsDictionary) => {
		errors.value = errors.value.filter(error => error.code !== code)
	}

	return { errors, remove, add, latest }
}

export class ApplicationError extends Error {
	code: keyof typeof ErrorsDictionary

	constructor(code: keyof typeof ErrorsDictionary, customMessage?: string) {
		super(customMessage)
		this.name = 'ApplicationError'
		this.message = customMessage || ErrorsDictionary[code]
		this.code = code
	}
}

// TODO: create a map of possible errors
export const ErrorsDictionary = {
	'UNKNOWN': 'An unknown error has occurred.',
	'WALLET_MISSING': 'No web 3 compatible wallet detected.'
}
