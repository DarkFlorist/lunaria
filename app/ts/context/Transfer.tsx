import { Signal, useSignal } from "@preact/signals"
import { Failure } from "funtypes"
import { ComponentChildren, createContext } from "preact"
import { useContext } from "preact/hooks"
import { Token } from "../schema"

type TransferContext = {
	input: Signal<{ amount: string, to: string, token?: Token }>
	validationError: Signal<Failure | undefined>
}

export const TransferContext = createContext<TransferContext | undefined>(undefined)

export const TransferProvider = ({ children }: { children: ComponentChildren }) => {
	const input = useSignal({ to: '', amount: '', token: undefined })
	const validationError = useSignal(undefined)
	return (
		<TransferContext.Provider value={{ input, validationError }}>
			{children}
		</TransferContext.Provider>
	)
}

export function useTransfer() {
	const context = useContext(TransferContext)
	if (!context) throw new Error('useTransfer can only be used within children of TransferProvider')
	return context
}
