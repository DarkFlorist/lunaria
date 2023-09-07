import { Signal, useComputed } from "@preact/signals"
import { formatUnits, Numeric, parseUnits } from "ethers"
import { useRef } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import * as Icon from "./Icon/index.js"

type AmountFieldProps = {
	id: string
	signalValue: Signal<bigint | undefined>,
	decimals?: string | Numeric
	onSetMaxValue: () => void
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
		<div class='relative grid grid-cols-[1fr,min-content] grid-rows-[min-content,min-content] grid-flow-col-dense gap-x-3 py-3 px-4'>
			<label for={props.id} class='text-sm text-white/50'>Amount</label>
			<input ref={inputRef} required id={props.id} placeholder="1.00" value={displayValue.value} inputMode='numeric' pattern='^\s*(\d+(\.\d+)?)?\s*$' onInput={updateValue} class='h-6 bg-transparent outline-none placeholder:text-white/20 peer' />
			<div class='row-span-2 items-center justify-center hidden peer-placeholder-shown:flex'>
				<button type='button' onClick={clearValue} class='px-2 h-8 flex items-center justify-center text-xs outline-none uppercase text-white/50 border border-white/50 focus:border-white focus:text-white'>max</button>
			</div>
			<div class='row-span-2 flex items-center justify-center peer-placeholder-shown:hidden'>
				<button type='button' onClick={props.onSetMaxValue} class='w-8 h-8 flex items-center justify-center text-sm outline-none focus:border focus:border-white'><Icon.Xmark /></button>
			</div>
			<div class='pointer-events-none absolute inset-0 border border-white/50 peer-invalid:border-red-400 peer-invalid:peer-placeholder-shown:border-white/50 peer-invalid:peer-placeholder-shown:peer-focus:border-white'></div>
		</div>
	)
}
