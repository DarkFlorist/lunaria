import { ethers } from 'ethers';
import { createRef } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { HexString } from '../library/useWallet';

type AddressFieldProps = {
	name: string;
	disabled?: boolean;
	class?: string;
	label: string;
	value: HexString | string;
	onChange: (address: HexString | string) => void;
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
		const target = e.target as HTMLInputElement;
		onChange(target.value);
	}

	// set a custom input field validity
	useEffect(() => {
		const validity = isValidAddress ? '' : 'Not a valid address';
		inputRef.current?.setCustomValidity(validity);
	}, [isValidAddress, inputRef.current]);

	return (
		<div class='flex flex-col gap-1'>
			<label for={name} class='text-sm text-white/50'>
				{label}
			</label>
			<div class='relative items-center group'>
				<input
					ref={inputRef}
					name={name}
					id={name}
					disabled={disabled}
					readOnly={!onChange}
					value={value}
					onChange={handleChange}
					class='appearance-none relative flex px-3 h-10 bg-white/5 w-full outline-none disabled:bg-white/5 disabled:text-white/30 invalid:text-red-200 border-b border-white/30 focus:border-b-white'
					{...props}
				/>
			</div>
			{!isValidAddress && (
				<div class='text-xs text-red-400'>Address is invalid</div>
			)}{' '}
		</div>
	);
};
