import { useComputed, useSignal } from "@preact/signals"
import { parseUnits } from "ethers"
import * as funtypes from 'funtypes'

import { BigIntSchema } from "../schema.js"
import { AmountField } from "./AmountInputField.js"

export const Test = () => {
	const amount = useSignal('')

	const sendTransaction = (e: Event) => {
		e.preventDefault()
	}

	const hexValue = useComputed(() => {
		if (amount.value === '') return ''
		const bigIntValue = parseUnits(amount.value)
		const serializedValue = BigIntSchema.serialize(bigIntValue)
		return funtypes.String.parse(serializedValue)
	})

	return (
		<div class='fixed inset-0 bg-black text-white p-6'>
			<form onSubmit={sendTransaction}>
				<div>{hexValue}</div>
				<AmountField label="amount" signalValue={amount} />
				<button class='px-3 py-2 border mt-2' type="submit">send</button>
			</form>
		</div>
	)
}


