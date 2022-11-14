import { useSignal } from '@preact/signals'

type AddressFieldProps = {
	name: string
	disabled?: boolean
	label: string
	value: HexString | string
	onChange: (address: HexString | string) => void
}

export const AddressField = ({ label, name, disabled, value, onChange }: AddressFieldProps) => {
	const isValid = useSignal(true)

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement
		isValid.value = target.checkValidity()
		onChange(target.value)
	}

	return (
		<div class='flex flex-col gap-1'>
			<label for={name} class='text-sm text-white/50'>
				{label}
			</label>
			<input
				autoComplete='off'
				id={name}
				name={name}
				type='text'
				pattern='^0x[0-9A-Fa-f]{40}$'
				value={value}
				onChange={handleChange}
				disabled={disabled}
				required
				class='appearance-none relative flex px-3 h-10 bg-white/5 w-full outline-none disabled:bg-white/5 disabled:text-white/30 invalid:text-red-200 border-b border-white/30 focus:border-b-white'
			/>
			{!isValid.value && <div class='text-xs text-red-400'>Address is invalid</div>}{' '}
		</div>
	)
}
