import { signal } from '@preact/signals'

export const errors = signal<ApplicationError[]>([])

export function useErrors() {
	const add = (error: ApplicationError) => {
		errors.value = [error, ...errors.value]
	}

	const remove = (id: string) => {
		errors.value = errors.value.filter(error => error.id !== id)
	}

	return { errors, remove, add }
}

export class ApplicationError extends Error {
	id: string

	constructor(id: string, message?: string) {
		super(message)
		this.name = 'ApplicationError'
		this.id = id
	}
}
