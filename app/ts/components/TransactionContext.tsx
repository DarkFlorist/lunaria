import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { TransactionStore } from '../store/transaction'

const TransactionContext = createContext<TransactionStore | undefined>(undefined)

type TransactionProviderProps = {
	children: ComponentChildren
	store: TransactionStore
}

export const TransactionProvider = ({ children, store }: TransactionProviderProps) => {
	return <TransactionContext.Provider value={store}>{children}</TransactionContext.Provider>
}

export function useTransactionStore() {
	const context = useContext<TransactionStore | undefined>(TransactionContext)
	if (!context) throw new Error('useTransactionStore must be used within a child of TransactionProvider')
	return context
}
