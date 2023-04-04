import { computed, signal } from '@preact/signals'

export type Notice = {
	id: number
	title: string
	message: string
}

const notices = signal<Notice[]>([])
const noticesCount = computed(() => notices.value.length)

export function useNotice() {
	const notify = (notice: Omit<Notice, 'id'>) => {
		notices.value = [{ ...notice, id: noticesCount.value + 1 }, ...notices.value]
	}

	return { notices, notify }
}
