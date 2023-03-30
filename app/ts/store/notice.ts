import { signal } from '@preact/signals'
import { Optional } from '../types.js'

export type Notice = {
	id: number
	title: string
	message: string
}

const notices = signal<Notice[]>([])

export function useNotice() {
	const notify = (notice: Optional<Notice, 'id'>) => {
		notices.value = [{ ...notice, id: notice.id || notices.value.length + 1 }, ...notices.value]
	}

	return { notices, notify }
}
