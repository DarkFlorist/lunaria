import { signal } from '@preact/signals';
import { NOTIFY_DURATION } from '../../constants';

export type Notification = {
	id?: number;
	duration?: number;
	message: string;
};

const messages = signal<Notification[]>([]);

function add(newMessage: Notification) {
	const id = window.setTimeout(() => {
		remove(id);
	}, newMessage.duration || NOTIFY_DURATION);

	messages.value = [...messages.value, { id, ...newMessage }];
}

function remove(timerId: number) {
	messages.value = messages.peek().filter(({ id }) => id != timerId);
	clearTimeout(timerId);
}

export function useNotify() {
	return {
		messages,
		add,
		notify: add,
		remove,
	};
}
