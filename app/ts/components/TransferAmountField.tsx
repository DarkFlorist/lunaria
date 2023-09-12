import { batch, useSignal, useSignalEffect } from "@preact/signals"
import { useTransfer } from "../context/Transfer.js"
import { useSignalRef } from "../library/preact-utilities.js"

export const TransferAmountField = () => {
	const transfer = useTransfer()
	const isPristine = useSignal<true | undefined>(true)
	const { ref, signal: inputRef } = useSignalRef<HTMLInputElement | null>(null)

	const normalizeAndUpdateValue = (newValue: string) => {
		batch(() => {
			isPristine.value = undefined
			transfer.input.value = { ...transfer.input.value, amount: newValue.trim() }
			transfer.validationError.value = undefined
		})
	}

	const clearValue = () => {
		if (inputRef.value) {
			inputRef.value.value = ''
			const inputEvent = new InputEvent('input')
			inputRef.value.dispatchEvent(inputEvent)
			inputRef.value.focus()
		}
	}

	const validateInput = () => {
		if (inputRef.value === null) return
		const error = transfer.validationError.value
		if (error && error.key === 'amount') {
			inputRef.value.setCustomValidity('Amount should be a number')
			inputRef.value.reportValidity()
			return
		}
		inputRef.value.setCustomValidity('')
	}

	useSignalEffect(validateInput)

	return (
		<fieldset data-pristine={isPristine.value} class='px-4 py-3 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 focus-within:border-white disabled:bg-white/10 disabled:border-white/30 enabled:modified:invalid:border-red-400'>
			<label class='absolute top-2 left-4 text-sm text-white/50 capitalize'>amount</label>
			<input ref={ref} type="text" value={transfer.input.value.amount} onInput={e => normalizeAndUpdateValue(e.currentTarget.value)} required placeholder="1.00" class='peer outline-none pt-4 bg-transparent text-ellipsis disabled:text-white/30 placeholder:text-white/20' />
			<MaxButton onClick={clearValue} />
			<ClearButton onClick={clearValue} />
		</fieldset>
	)
}

const MaxButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} class='outline-none px-2 h-8 hidden items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:flex peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white'>max</button>
	)
}

const ClearButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} class='outline-none w-8 h-8 flex items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:hidden peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white'>&times;</button>
	)
}
