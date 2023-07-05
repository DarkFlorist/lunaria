import { useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { useRef } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { formatUnits } from 'ethers'
import { removeNonStringsAndTrim } from '../library/utilities.js'
import { useAccount } from '../store/account.js'
import { TokenMeta, useTokenBalance } from '../store/tokens.js'
import * as Icon from './Icon/index.js'

type Props = {
	label: string
	placeholder?: string
	value: string
	onInput: (amount: string) => void
	onClear: () => void
	disabled?: boolean
	token?: TokenMeta
}

export const AmountField = (props: Props) => {
	const { address } = useAccount()
	const inputRef = useRef<HTMLInputElement>(null)
	const isValid = useSignal<boolean>(true)
	const { tokenBalance, getTokenBalance } = useTokenBalance()

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
			inputField.setCustomValidity('Amount value accepts only numbers')
		}
	}

	const isCalculatingMax = useComputed(() => tokenBalance.value.state === 'pending')

	const setTokenBalanceAsAmount = () => {
		if (props.token === undefined) return
		if (address.value.state !== 'resolved') return
		getTokenBalance(address.value.value, props.token.address)
	}

	useSignalEffect(() => {
		if (tokenBalance.value.state !== 'resolved') return
		const balance = formatUnits(tokenBalance.value.value, props.token?.decimals)
		props.onInput(balance)
		inputRef.current?.focus()
	})

	return (
		<div class={removeNonStringsAndTrim(baseClasses.root, isValid.value === false ? 'border-red-400 focus-within:border-red-400' : 'border-white/50 focus-within:border-white/90', props.disabled && 'opacity-70')}>
			<div class='grid grid-cols-[1fr,auto] items-center h-16'>
				<div class='grid px-4'>
					<label class='text-sm text-white/50 leading-tight'>{props.label}</label>
					<input ref={inputRef} placeholder={props.placeholder} inputMode='numeric' pattern='^[\d, ]*\.?\d*$' class={baseClasses.field} type='text' value={props.value} onInput={handleInput} disabled={props.disabled || isCalculatingMax.value} required />
				</div>
				<ClearButton show={props.value !== ''} onClick={handleClear} disabled={props.disabled} />
				<MaxButton show={props.token !== undefined && address.value.state === 'resolved' && props.value === ''} isBusy={isCalculatingMax.value} onClick={setTokenBalanceAsAmount} />
			</div>
		</div>
	)
}

const baseClasses = {
	root: 'border bg-transparent focus-within:bg-white/5',
	field: 'h-6 bg-transparent outline-none placeholder:text-white/20',
}

type MaxButtonProps = {
	show?: boolean
	isBusy?: boolean
	onClick: () => void
}

const MaxButton = (props: MaxButtonProps) => {
	if (props.show !== true) return <></>
	if (props.isBusy)
		return (
			<div class='p-2 mx-2'>
				<Icon.Spinner />
			</div>
		)

	return (
		<button type='button' class='mx-2 p-2 outline-none border border-white/50 focus:border-white text-xs text-white/50 focus:text-white hover:text-white hover:border-white disabled:opacity-50' onClick={props.onClick} disabled={props.isBusy}>
			<span>MAX</span>
		</button>
	)
}

type ClearButtonProps = {
	show?: boolean
	onClick: () => void
	disabled?: boolean
}

const ClearButton = (props: ClearButtonProps) => {
	if (!props.show) return <></>
	return (
		<button type='button' class='mx-2 p-2 outline-none border border-transparent focus:border-white text-sm disabled:opacity-50' onClick={props.onClick} disabled={props.disabled}>
			<Icon.Xmark />
		</button>
	)
}
