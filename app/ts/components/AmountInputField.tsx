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
	const isInputBusy = useSignal(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const initialValue = useSignal<AmountFieldProps["signalValue"]["value"]>(props.signalValue.peek())

	function setValue(newValue: string) {
		isInputPristine.value = undefined

		if (inputRef.current) {
			let validityMessage = ''
			if (inputRef.current.validity.patternMismatch) validityMessage = 'Expects a numeric input.'
			inputRef.current.setCustomValidity(validityMessage)
			if (inputRef.current.validity.valid === false) return
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

	const requestMaxValue = async () => {
		isInputBusy.value = true
		const maxValue = await wait()
		props.signalValue.value = maxValue
		isInputBusy.value = false
	}

	return (
		<Fieldset isPristine={isInputPristine.value} disabled={props.disabled || isInputBusy.value}>
			<input type="text" ref={inputRef} value={props.signalValue.value} onInput={e => setValue(e.currentTarget.value)} class='peer outline-none pt-6 pb-2 bg-transparent disabled:text-black/30 placeholder:text-white/20 [:not(data-pristine) &]:invalid:text-red-400' placeholder="1.00" pattern='^\s*(\d+(\.\d+)?)?\s*$' required />
			<Label text={props.label} />
			<ClearButton onClick={clearValue} />
			<MaxButton isLoading={isInputBusy.value} onClick={requestMaxValue} />
		</Fieldset>
	)
}

type FieldsetProps = {
	children: ComponentChildren, isPristine?: true
	disabled?: boolean
}

const Fieldset = ({ children, isPristine, disabled }: FieldsetProps) => {
	return (
		<fieldset data-pristine={isPristine} disabled={disabled} class='px-3 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 focus-within:border-white disabled:bg-white/10 disabled:border-white/30 [&:not(:disabled):not([data-pristine]):invalid]:border-red-400'>
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

type MaxButtonProps = {
	onClick: () => void
	isLoading: boolean
	disabled?: boolean
}

const MaxButton = (props: MaxButtonProps) => {
	return (
		<button type="button" onClick={props.onClick} disabled={props.disabled || props.isLoading} class='outline-none px-2 h-8 flex items-center hidden peer-placeholder-shown:flex border border-white/50 text-white/50 focus:border-white focus:text-white [&:not(:disabled):hover]:border-white [&:not(:disabled):hover]:text-white disabled:border-transparent'>{props.isLoading ? <Icon.Spinner /> : 'max'}</button>
	)
}

const wait = (duration: number = 5000) => new Promise<string>((resolve) => {
	setTimeout(() => resolve('101.1'), duration)
})
