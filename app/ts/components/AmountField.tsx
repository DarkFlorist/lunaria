import { useSignal } from '@preact/signals'
import { weave } from '../library/utilities'

type Props = {
	name: string
	value: string
	disabled?: boolean
	class?: string
	label: string
	onChange: (value: HexString | string) => void
}

export const AmountField = ({ name, label, value, disabled, onChange, class: className }: Props) => {
	const isValid = useSignal(true)

	const handleChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		isValid.value = target.checkValidity()
		onChange(target.value)
	}

	return (
		<div class={weave('flex flex-col gap-1', className)}>
			<label for={name} class='text-sm text-white/50'>
				{label}
			</label>
			<div class='relative items-center'>
				<input
					autoComplete='off'
					id={name}
					name={name}
					type='text'
					inputMode='numeric'
					pattern='^\d*\.?\d*$'
					value={value}
					onChange={handleChange}
					disabled={disabled}
					required
					class='appearance-none relative flex px-3 h-10 bg-white/5 w-full outline-none disabled:bg-white/5 disabled:text-white/30 invalid:text-red-200 border-b border-white/30 focus:border-b-white'
				/>
			</div>
			{!isValid.value && <div class='text-xs text-red-400'>Invalid amount</div>}
		</div>
	)
}
