import { Signal, ReadonlySignal, useComputed, useSignal } from '@preact/signals'
import { TransactionResponse } from 'ethers'
import * as funtypes from 'funtypes'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { AsyncProperty } from '../library/preact-utilities.js'
import { createUnitParser, safeSerialize, ERC20Token, TransferRequestInput } from '../schema.js'

type PartialInput = { to: string; amount: string; token: ERC20Token | undefined }

type TransferContext = {
	input: Signal<PartialInput>
	safeParse: ReadonlySignal<funtypes.Result<TransferRequestInput>>
	transaction: Signal<AsyncProperty<TransactionResponse>>
	isBusy: Signal<boolean>
}

export const TransferContext = createContext<TransferContext | undefined>(undefined)

export const TransferProvider = ({ children }: { children: ComponentChildren }) => {
	const transaction = useSignal<AsyncProperty<TransactionResponse>>({ state: 'inactive' })
	const input = useSignal<PartialInput>({ to: '', amount: '', token: undefined })
	const isBusy = useSignal(false)

	const parsedAmount = useComputed(() => {
		const HexUnit = funtypes.String.withParser(createUnitParser(input.value.token?.decimals))
		return HexUnit.safeParse(input.value.amount)
	})

	const serializedToken = useComputed(() => {
		if (input.value.token === undefined) return { success: true, value: undefined } satisfies funtypes.Success<undefined>
		return safeSerialize(ERC20Token, input.value.token)
	})

	const safeParse = useComputed(() => {
		if (!parsedAmount.value.success) return { ...parsedAmount.value, key: 'amount' }
		if (!serializedToken.value.success) return { ...serializedToken.value, key: 'token' }
		const amount = parsedAmount.value.value
		const token = serializedToken.value.value
		return TransferRequestInput.safeParse({ ...input.value, amount, token })
	})

	return <TransferContext.Provider value={{ input, safeParse, transaction, isBusy }}>{children}</TransferContext.Provider>
}

export function useTransfer() {
	const context = useContext(TransferContext)
	if (!context) throw new Error('useTransfer can only be used within children of TransferProvider')
	return context
}
