import { signal } from '@preact/signals';
import { NOTIFY_DURATION } from '../constants';

import { createPortal } from 'preact/compat';

export const Notifier = () => {
	const { messages, remove } = useNotify();

	return createPortal(
		<div class='fixed inset-x-0 bottom-0 flex items-center flex-col-reverse gap-2 p-4'>
			{messages.value.map(({ id, message }) => {
				return (
					<Notice message={message} onClose={() => remove(id as number)} />
				);
			})}
		</div>,
		document.body
	);
};

type NoticeProps = {
	message: string;
	onClose: () => void;
};

export const Notice = ({ message, onClose }: NoticeProps) => {
	return (
		<div class='shadow-md py-2 px-4 rounded flex items-center gap-4 bg-white/90 border border-gray-100 w-full max-w-lg'>
			<div class='grow leading-tight border-r border-black/10 py-2'>
				{message}
			</div>
			<button class='py-2' onClick={onClose}>
				&#x2715;
			</button>
		</div>
	);
};

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
