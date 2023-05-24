import { useSignal } from '@preact/signals'
import { useRef } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { removeNonStringsAndTrim } from '../library/utilities.js'
import * as Icon from './Icon/index.js'

type Props = {
	label: string
	placeholder?: string
	value: string
	onInput: (amount: string) => void
	onClear: () => void
	disabled?: boolean
}

export const AddressField = (props: Props) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const isValid = useSignal<boolean>(true)

	const handleClear = () => {
		props.onClear?.()
		inputRef.current?.focus()
	}

	const handleInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
		const inputField = inputRef.current
		const value = e.currentTarget.value

		if (inputField === null) return

		// clear errors and update field value
		inputField.setCustomValidity('')
		props.onInput(value)

		isValid.value = inputField.validity.valid
		if (inputField.validity.patternMismatch) {
			inputField.setCustomValidity('Not a valid address')
		}
	}

	return (
		<div class={removeNonStringsAndTrim(baseClasses.root, isValid.value === false ? 'border-red-400 focus-within:border-red-400' : 'border-white/50 focus-within:border-white/90', props.disabled && 'opacity-50')}>
			<div class='grid grid-cols-[1fr,auto] items-center h-16'>
				<div class='grid px-4'>
					<label class='text-sm text-white/50 leading-tight'>{props.label}</label>
					<input ref={inputRef} placeholder={props.placeholder} pattern='^0x[0-9A-Fa-f]{40}$' class={baseClasses.field} type='text' value={props.value} onInput={handleInput} disabled={props.disabled} required />
				</div>
				{props.value !== '' && (
					<button type='button' class='mx-2 p-2 outline-none border border-transparent focus:border-white text-sm disabled:opacity-50' onClick={handleClear} disabled={props.disabled}>
						<Icon.Xmark />
					</button>
				)}
			</div>
		</div>
	)
}

const baseClasses = {
	root: 'border bg-transparent focus-within:bg-white/5',
	field: 'h-6 bg-transparent outline-none placeholder:text-white/20',
}
