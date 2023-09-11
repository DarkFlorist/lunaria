import { Signal, useSignal } from '@preact/signals'
import { ComponentChildren } from 'preact'
import { useRef } from 'preact/hooks'
import * as Icon from './Icon/index.js'

type AmountFieldProps = {
	label: string
	signalValue: Signal<string>
	disabled?: true
}

export const AmountField = (props: AmountFieldProps) => {
	const isInputPristine = useSignal<true | undefined>(true)
	const inputRef = useRef<HTMLInputElement>(null)
	const initialValue = useSignal<AmountFieldProps["signalValue"]["value"]>(props.signalValue.peek())

	function setValue(newValue: string) {
		isInputPristine.value = undefined

		if (inputRef.current) {
			if (inputRef.current.validity.patternMismatch) {
				inputRef.current.setCustomValidity('Only numbers are allowed')
				return
			}
		}

		props.signalValue.value = newValue.trim()
	}

	const clearValue = () => {
		if (inputRef.current) {
			inputRef.current.value = initialValue.value ?? ''
			const inputEvent = new InputEvent('input')
			inputRef.current.dispatchEvent(inputEvent)
			inputRef.current.focus()
		}
	}

	return (
		<Fieldset isPristine={isInputPristine.value} disabled={props.disabled}>
			<input type="text" ref={inputRef} value={props.signalValue.value} onInput={e => setValue(e.currentTarget.value)} class='peer outline-none pt-6 pb-2 bg-transparent disabled:text-black/30 placeholder:text-white/20' placeholder="1.00" pattern='^\s*(\d+(\.\d+)?)?\s*$' required />
			<Label text={props.label} />
			<ClearButton onClick={clearValue} />
			<MaxButton onSuccess={setValue} />
		</Fieldset>
	)
}

type FieldsetProps = {
	children: ComponentChildren, isPristine?: true
	disabled?:true
}

const Fieldset = ({ children, isPristine, disabled }: FieldsetProps) => {
	return (
		<fieldset class='[&:not([data-pristine]):invalid]:border-red-400 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 disabled:bg-gray-100 px-3 focus-within:border-white' data-pristine={isPristine} disabled={disabled}>
			{children}
		</fieldset>
	)
}

const Label = ({ text }: { text: string }) => {
	return <label class='absolute top-2 left-3 uppercase text-xs text-white/50'>{text}</label>
}

const ClearButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} class='outline-none w-8 h-8 flex items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:hidden focus:text-white focus:border-white hover:text-white hover:border-white'>&times;</button>
	)
}

const MaxButton = ({ onSuccess }: { onSuccess: (maxValue: string) => void }) => {
	const isFetching = useSignal(false)

	const getMaxValue = async () => {
		isFetching.value = true
		const maxValue = await wait()
		isFetching.value = false
		onSuccess(maxValue)
	}

	return (
		<button type="button" class='outline-none px-2 h-8 flex items-center hidden peer-placeholder-shown:flex border border-white/50 text-white/50 focus:border-white focus:text-white [&:not(:disabled):hover]:border-white [&:not(:disabled):hover]:text-white' onClick={getMaxValue} disabled={isFetching.value}>{isFetching.value ? <Icon.Spinner /> : 'max'}</button>
	)
}

const wait = (duration: number = 500) => new Promise<string>((resolve) => {
	setTimeout(() => resolve('101.1'), duration)
})
