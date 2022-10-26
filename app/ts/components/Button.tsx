import { ComponentChildren, JSX } from 'preact';
import { weave } from '../library/utilities';

type Props = {
	children: ComponentChildren;
	class?: string;
	onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({ children, class: className, onClick }: Props) => {
	return (
		<button
			type='button'
			class={weave(
				'outline-none flex items-center justify-center px-4 h-8 text-sm border border-white/50 focus:bg-green/10 focus:border-white hover:bg-white/10 hover:border-white disabled:hover:bg-transparent disabled:opacity-30',
				className
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
