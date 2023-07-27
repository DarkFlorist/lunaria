import { computed, signal } from '@preact/signals'

export type Notice = {
	id: number
	title: string
	message: string
}

const notices = signal<Notice[]>([])
const nextId = computed(() => notices.value.length+ 1)

export function useNotice() {
	const notify = (notice: Omit<Notice, 'id'>) => {
		notices.value = [{ ...notice, id: nextId.value }, ...notices.peek()]
	}

	return { notices, notify }
}
