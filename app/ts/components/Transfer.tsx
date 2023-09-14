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

	const to = transfer.input.value.to
	const token = transfer.input.value.token
	const normalizedAmount = useComputed(() => {
		try {
			const decimals = transfer.input.value.token?.decimals
			const bigIntAmount = parseUnits(transfer.input.value.amount, decimals)
			const serializedAmount = BigIntSchema.serialize(bigIntAmount)
			return String.parse(serializedAmount)
		} catch {
			return ''
		}
	})

	const validateForm = (e: Event) => {
		e.preventDefault()
		const address = AddressSchema.safeParse(transfer.input.value.to, )
		console.log(address)
		const parsedInput = TransferInputSchema.safeParse({ amount: normalizedAmount.value, token, to })
		console.log(parsedInput)
		if (!parsedInput.success) transfer.validationError.value = parsedInput
		console.log('ok')
	}

	return (
		<form onSubmit={validateForm} class='grid gap-2'>
			{children}
		</form>
	)
}
