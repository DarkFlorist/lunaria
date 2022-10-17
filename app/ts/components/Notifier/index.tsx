import { createPortal } from 'preact/compat';
import { Notice } from './Notice';
import { useNotify } from './useNotify';

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
