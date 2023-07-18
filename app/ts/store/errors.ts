import { signal, useComputed } from '@preact/signals'

export const errors = signal<ApplicationError[]>([])

export function useErrors() {
	const latest = useComputed(() => errors.value.at(0))

	const add = (error: ApplicationError) => {
		errors.value = [error, ...errors.value]
	}

	const remove = (id: string) => {
		errors.value = errors.value.filter(error => error.id !== id)
	}

	return { errors, remove, add, latest }
}

export class ApplicationError extends Error {
	id: string

	constructor(id: string, message?: string) {
		super(message)
		this.name = 'ApplicationError'
		this.message = message || 'An application error has occurred.'
		this.id = id
	}
}
