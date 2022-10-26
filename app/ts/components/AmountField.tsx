import { useSignal } from '@preact/signals';
import { JSX } from 'preact';
import { weave } from '../library/utilities';

type Props = JSX.HTMLAttributes<HTMLInputElement> & {
	label: string;
	onChange: (e: Event) => void;
};

export const AmountField = ({
	name,
	label,
	value,
	disabled,
	onChange,
	class: className,
	...props
}: Props) => {
	const isValid = useSignal(true);

	const handleChange = (e: Event) => {
		isValid.value = (e.target as HTMLInputElement).checkValidity();
		onChange?.(e);
	};

	return (
		<div class='flex flex-col gap-1'>
			<label for={name} class='text-xs opacity-50'>
				{label}
			</label>
			<div class='relative items-center rounded border border-white/20'>
				<input
					id={name}
					name={name}
					value={value}
					type='text'
					inputMode='numeric'
					pattern='^\d*.?\d*$'
					onChange={handleChange}
					disabled={disabled}
					required
					class={weave(
						'relative flex px-3 h-10 appearance-none bg-transparent w-full outline-none disabled:bg-white/5 disabled:text-white/30 invalid:text-red-200',
						className
					)}
					{...props}
				/>
			</div>
			{!isValid.value && <div class='text-xs text-red-400'>Invalid amount</div>}
		</div>
	);
};
