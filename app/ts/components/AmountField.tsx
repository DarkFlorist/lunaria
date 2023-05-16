import { useSignal } from "@preact/signals"
import { useRef } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import { removeNonStringsAndTrim } from "../library/utilities.js"
import * as Icon from "./Icon/index.js"

type Props = {
	label: string
	placeholder?: string
	value: string
	onInput: (amount: string) => void
	onClear: () => void
}

export const AmountField = (props: Props) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const isValid = useSignal<boolean>(true)

	const handleClear = () => {
		props.onClear?.()
		inputRef.current?.focus()
	}

	const handleInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
		const inputField = inputRef.current
		const value = e.currentTarget.value

		if (inputField === null) return;

		// clear errors and update field value
		inputField.setCustomValidity('')
		props.onInput(value)

		isValid.value = inputField.validity.valid
		if (inputField.validity.patternMismatch) {
			inputField.setCustomValidity('Amount value accepts only numbers')
		}
	}

	return (
		<div class={removeNonStringsAndTrim(baseClasses.root, isValid.value === false && 'border-red-500 focus-within:border-red-500')}>
			<div class='grid grid-cols-[1fr,auto] items-center h-16'>
				<div class='grid px-4'>
					<label class='text-sm text-white/50 leading-tight'>{props.label}</label>
					<input ref={inputRef} placeholder={props.placeholder} inputMode='numeric' pattern='^[\d, ]*\.?\d*$' class={baseClasses.field} type='text' value={props.value} onInput={handleInput} required />
				</div>
				{props.value !== '' && (
					<button type='button' class='mx-2 p-2 outline-none border border-transparent focus:border-white text-sm' onClick={handleClear}>
						<Icon.Xmark />
					</button>)}

			</div>
		</div>
	)
}

const baseClasses = {
	root: 'border border-white/50 bg-transparent focus-within:border-white/90 focus-within:bg-white/5',
	field: 'h-6 bg-transparent outline-none placeholder:text-white/20' 
}
