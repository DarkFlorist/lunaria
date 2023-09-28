import { batch, useComputed, useSignal, useSignalEffect } from "@preact/signals"
import { formatUnits } from "ethers"
import { useTokenBalance } from "../context/TokenManager.js"
import { useTransfer } from "../context/Transfer.js"
import { useWallet } from "../context/Wallet.js"
import { useSignalRef } from "../library/preact-utilities.js"
import * as Icon from './Icon/index.js'

export const TransferAmountField = () => {
	const { input, safeParse } = useTransfer()
	const isPristine = useSignal<true | undefined>(true)
	const { ref, signal: inputRef } = useSignalRef<HTMLInputElement | null>(null)

	const normalizeAndUpdateValue = (newValue: string) => {
		batch(() => {
			isPristine.value = undefined
			input.value = { ...input.value, amount: newValue.trim() }
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

	const validationMessage = useComputed(() => {
		const safeParsedInput = safeParse.value
		if (safeParsedInput.success || safeParsedInput.key !== 'amount') return undefined
		return 'Amount should be a number.'
	})

	const validateField = () => {
		if (inputRef.value === null) return
		if (validationMessage.value === undefined) {
			inputRef.value.setCustomValidity('')
			return
		}

		inputRef.value.setCustomValidity(validationMessage.value)
	}

	useSignalEffect(validateField)

	return (
		<fieldset data-pristine={isPristine.value} class='px-4 py-3 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 focus-within:border-white disabled:bg-white/10 disabled:border-white/30 modified:enabled:invalid:border-red-400'>
			<label class='absolute top-2 left-4 text-sm text-white/50 capitalize'>amount</label>
			<input ref={ref} type="text" value={input.value.amount} onInput={e => normalizeAndUpdateValue(e.currentTarget.value)} required placeholder="1.00" class='peer outline-none pt-4 bg-transparent text-ellipsis disabled:text-white/30 placeholder:text-white/20' />
			<MaxButton />
			<ClearButton onClick={clearValue} />
		</fieldset>
	)
}

const MaxButton = () => {
	const { input } = useTransfer()
	const { tokenBalance, getTokenBalance } = useTokenBalance()
	const { account } = useWallet()

	const accountAddress = useComputed(() => account.value.state === 'resolved' ? account.value.value : undefined)
	const tokenAddress = useComputed(() => input.value.token?.address)
	const currentTokenBalance = useComputed(() => tokenBalance.value.state === 'resolved' ? tokenBalance.value.value : undefined)

	const setMaxAmount = async () => {
		if (!tokenAddress.value || !accountAddress.value) return
		getTokenBalance(accountAddress.value, tokenAddress.value)
	}

	useSignalEffect(() => {
		if (!input.value.token || !currentTokenBalance.value) return
		const amount = formatUnits(currentTokenBalance.value, input.value.token.decimals)
		input.value = { ...input.peek(), amount }
	})

	if (!input.value.token) return <></>

	switch (tokenBalance.value.state) {
		case 'inactive':
		case 'rejected':
			return <button type="button" onClick={setMaxAmount} class='outline-none px-2 h-8 hidden items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:flex peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white'>max</button>
		case 'pending':
			return <Icon.Spinner class='opacity-50' />
		case 'resolved':
			return <></>
	}
}

const ClearButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} class='outline-none w-8 h-8 flex items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:hidden peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white text-xs'><Icon.Xmark /></button>
	)
}
