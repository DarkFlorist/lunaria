import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { TransferStore } from '../store/transfer'

const TransferContext = createContext<TransferStore | undefined>(undefined)

type TransferProviderProps = {
	children: ComponentChildren
	store: TransferStore
}

export const TransferProvider = ({ children, store }: TransferProviderProps) => {
	return <TransferContext.Provider value={store}>{children}</TransferContext.Provider>
}

export function useTransferStore() {
	const context = useContext<TransferStore | undefined>(TransferContext)
	if (!context) throw new Error('useTransferStore must be used within a child of TransferProvider')
	return context
}
