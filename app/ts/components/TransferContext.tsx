import { ComponentChildren, createContext } from "preact"
import { useContext } from "preact/hooks"
import { AsyncProperty, useAsyncState } from "../library/preact-utilities.js"
import { assertTransferStatus, transferStore, TransferTransaction } from "../store/transfer.js"

export type TransferContext = {
	asyncResponse: readonly [AsyncProperty<unknown>, () => void, () => void]
	store: TransferTransaction
}

const TransferContext = createContext<TransferContext | undefined>(undefined)

export const TransferProvider = ({ children }: { children: ComponentChildren }) => {
	const [response, resolve, reset] = useAsyncState()

	const send = () => {
		assertTransferStatus(transferStore.value.status, 'new')
		resolve(transferStore.value.sendTransaction)
	}

	const contextValues = {
		asyncResponse: [response, send, reset] as const,
		store: transferStore.value
	}

	return (
		<TransferContext.Provider value={contextValues}>{children}</TransferContext.Provider>
	)
}

export function useTransfer(): TransferContext {
	const transferContext = useContext(TransferContext)
	if (!transferContext) throw new Error('useTransfer must be a child of TransferProvider')
	return transferContext
}
