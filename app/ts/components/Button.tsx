import { JSX } from 'preact/jsx-runtime';
import { weave } from '../library/utilities';

type ButtonProps = JSX.HTMLAttributes<HTMLButtonElement>;

export const Button = ({
	children,
	class: className,
	onClick,
	type,
}: ButtonProps) => {
	return (
		<button
			type={type || 'button'}
			class={weave(
				'outline-none flex items-center justify-center px-4 py-2 border border-white/50 focus:bg-green/10 focus:border-white focus:bg-white/10 hover:bg-white/10 hover:border-white disabled:hover:bg-transparent disabled:opacity-30 rounded',
				className
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
