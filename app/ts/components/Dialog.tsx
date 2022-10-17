import { JSX } from 'preact';
import { createPortal } from 'preact/compat';
import { weave } from '../library/utilities';

export type DialogProps = JSX.HTMLAttributes<HTMLDivElement> & {
	onBackdropClick?: () => void;
};

export const Root = ({
	children,
	onBackdropClick,
	class: className,
}: DialogProps) => {
	return createPortal(
		<div
			class={weave('fixed inset-0 flex items-center justify-center', className)}
		>
			<div
				class='absolute inset-0 bg-black/30 cursor-pointer'
				onClick={onBackdropClick}
			/>
			<div class='relative'>{children}</div>
		</div>,
		document.body
	);
};

type ContentProps = JSX.HTMLAttributes<HTMLDivElement>;

const Content = ({ children, class: className }: ContentProps) => {
	return (
		<div
			class={weave(
				'bg-white/80 py-4 px-6 rounded-sm shadow-lg cursor-default w-full',
				className
			)}
		>
			{children}
		</div>
	);
};

export const Dialog = Object.assign(Root, {
	Content,
});
