import { ComponentChildren } from "preact"
import { AddressSchema, BigIntSchema, TransferInputSchema } from "../schema.js"
import { TransferProvider, useTransfer } from "../context/Transfer.js"
import { TransferAddressField } from "./TransferAddressField.js"
import { TransferAmountField } from "./TransferAmountField.js"
import { useComputed } from "@preact/signals"
import { parseUnits } from "ethers"
import { String } from "funtypes"

export function Transfer() {
	return (
		<div class='fixed inset-0 bg-black text-white'>
			<div class='p-6'>
				<TransferProvider>
					<TransferForm>
						<TransferAddressField />
						<TransferAmountField />
						<button type='submit'>send</button>
					</TransferForm>
				</TransferProvider>
			</div>
		</div>
	)
}

const TransferForm = ({ children }: { children: ComponentChildren }) => {
	const transfer = useTransfer()

	const serializedAmount = useComputed(() => {
		try {
			const decimals = transfer.input.value.token?.decimals
			const bigIntValue = parseUnits(transfer.input.value.amount, decimals)
			const serializedValue = BigIntSchema.serialize(bigIntValue)
			return String.parse(serializedValue)
		} catch {
			return ''
		}
	})

	const serializedAddress = useComputed(() => {
		const parsedAddress = AddressSchema.safeParse(transfer.input.value.to)
		if (!parsedAddress.success) return ''
		return parsedAddress.value
	})

	const validateForm = (e: Event) => {
		e.preventDefault()
		const parsed = TransferInputSchema.safeParse({ to: serializedAddress.value, amount: serializedAmount.value })
		if (parsed.success === false) transfer.validationError.value = parsed
	}

	return (
		<form onSubmit={validateForm} class='grid gap-2'>
			{children}
		</form>
	)
}
