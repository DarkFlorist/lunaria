import { Signal, useComputed } from "@preact/signals"
import { formatUnits, Numeric, parseUnits } from "ethers"
import { ComponentChildren } from "preact"
import { useRef } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import { removeNonStringsAndTrim } from "../library/utilities.js"
import * as Icon from "./Icon/index.js"

type AmountFieldProps = {
	id: string
	signalValue: Signal<bigint | undefined>,
	decimals?: string | Numeric
	onSetMaxValue: () => void
	disabled?: true
}

export const AmountField = (props: AmountFieldProps) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const displayValue = useComputed(() => {
		if (props.signalValue.value === undefined) return ''
		const floatValue = parseFloat(formatUnits(props.signalValue.value, props.decimals))
		return (floatValue % 1 === 0 ? Math.floor(floatValue) : floatValue).toString()
	})

	function updateValue(e: JSX.TargetedEvent<HTMLInputElement, Event>) {
		const inputField = e.currentTarget
		const inputValue = inputField.value.trim()

		if (inputField.validity.patternMismatch) {
			inputField.setCustomValidity('Amount value accepts only numbers.')
			return
		}

		inputField.setCustomValidity('')
		props.signalValue.value = inputValue.length ? parseUnits(inputValue, props.decimals) : undefined
	}

	function clearValue() {
		props.signalValue.value = undefined

		if (inputRef.current) {
			inputRef.current.value = ''
			inputRef.current.focus()
		}
	}

	return (
		<Wrapper>
			<label for={props.id} class='text-sm text-white/50'>Amount</label>
			<input ref={inputRef} disabled={props.disabled} required id={props.id} placeholder="1.00" value={displayValue.value} inputMode='numeric' pattern='^\s*(\d+(\.\d+)?)?\s*$' onInput={updateValue} class='h-6 bg-transparent outline-none placeholder:text-white/20 peer disabled:border-white/50 disabled:text-white/50' />
			<Button onClick={props.onSetMaxValue} class='hidden peer-placeholder-shown:flex [&>button]:px-2'>max</Button>
			<Button onClick={clearValue} class='flex peer-placeholder-shown:hidden [&>button]:w-8'><Icon.Xmark /></Button>
			<BackDraft />
		</Wrapper>
	)
}

type ButtonProps = {
	onClick: () => void
	children: ComponentChildren
	class?: string
}

const Button = ({ children, onClick, class: className }: ButtonProps) => {
	return (
		<div class={removeNonStringsAndTrim('row-span-2 items-center justify-center', className)}>
			<button type='button' onClick={onClick} class='h-8 flex items-center justify-center text-xs outline-none uppercase text-white/50 border border-white/50 focus:border-white focus:text-white'>{children}</button>
		</div>
	)
}

const BackDraft = () => <div class='pointer-events-none absolute inset-0 border border-white/50 peer-invalid:border-red-400 peer-invalid:peer-placeholder-shown:border-white/50 peer-invalid:peer-placeholder-shown:peer-focus:border-white'></div>

const Wrapper = ({ children }: { children: ComponentChildren }) => <div class='relative grid grid-cols-[1fr,min-content] grid-rows-2 grid-flow-col-dense gap-x-3 py-3 px-4'>{children}</div>
