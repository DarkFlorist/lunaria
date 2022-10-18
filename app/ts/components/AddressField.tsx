import { ethers } from 'ethers';
import { createRef, JSX } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { shortAddress, weave } from '../library/utilities';

type AddressFieldProps = JSX.HTMLAttributes<HTMLInputElement> & {
	label: string;
	value: string;
	onChange?: (e: Event) => void;
};

export const AddressField = ({
	label,
	name,
	disabled,
	value,
	class: className,
	onChange,
	...props
}: AddressFieldProps) => {
	const inputRef = createRef<HTMLInputElement>();

	const isValidAddress = useMemo(() => {
		if (value === '') return true;
		return ethers.utils.isAddress(value);
	}, [value]);

	function handleChange(e: Event) {
		onChange?.(e);
	}

	// set a custom input field validity
	useEffect(() => {
		const validity = isValidAddress ? '' : 'Not a valid address';
		inputRef.current?.setCustomValidity(validity);
	}, [isValidAddress, inputRef.current]);

	return (
		<div class='flex flex-col gap-1'>
			<label for={name} class='text-xs opacity-50'>
				{label}
			</label>
			<div class='relative items-center rounded border border-white/20 group'>
				<div
					class={weave(
						'absolute flex px-3 h-10 w-full items-center group-focus-within:hidden',
						!isValidAddress && 'text-red-200',
						disabled && 'bg-white/5 text-white/30'
					)}
				>
					{shortAddress(value)}
				</div>
				<input
					ref={inputRef}
					name={name}
					id={name}
					disabled={disabled}
					readOnly={!onChange}
					value={value}
					onChange={handleChange}
					class={weave(
						'relative flex px-3 h-10 appearance-none bg-transparent w-full text-transparent outline-none focus:text-white focus:invalid:text-red-200',
						className
					)}
					{...props}
				/>
			</div>
			{!isValidAddress && (
				<div class='text-xs text-red-400'>Address is invalid</div>
			)}{' '}
		</div>
	);
};
