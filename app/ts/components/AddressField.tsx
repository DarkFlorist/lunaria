import { useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { JSX } from 'preact/jsx-runtime'
import { removeNonStringsAndTrim } from '../library/utilities.js'

type AddressFieldProps = {
	label: string
	name: string
	value: string
	onChange: (address: string) => void
	class?: string
	disabled?: boolean
	required?: boolean
}

export const AddressField = ({ label, name, value, onChange, class: className, disabled = false, required = false }: AddressFieldProps) => {
	const isValid = useSignal(true)

	function handleChange(e: JSX.TargetedEvent<HTMLInputElement>) {
		const target = e.currentTarget
		const isAddressPatternValid = target.checkValidity()
		isValid.value = isAddressPatternValid && ethers.utils.isAddress(target.value)
		onChange(target.value)
	}

	return (
		<div class={removeNonStringsAndTrim(baseClass.root, className)}>
			<label for={name} class={baseClass.label}>
				{label}
			</label>
			<input autoComplete='off' id={name} name={name} type='text' pattern='^0x[0-9A-Fa-f]{40}$' value={value} onInput={handleChange} disabled={disabled} required={required} class={baseClass.input} />
			{!isValid.value && <div class={baseClass.error}>Address is invalid</div>}{' '}
		</div>
	)
}

const baseClass = {
	root: 'flex flex-col gap-1',
	label: 'text-sm text-white/50',
	input: 'appearance-none relative flex px-3 h-10 bg-white/5 w-full outline-none disabled:bg-white/5 disabled:text-white/30 invalid:text-red-200 border-b border-white/30 focus:border-b-white',
	error: 'text-xs text-red-400',
}
