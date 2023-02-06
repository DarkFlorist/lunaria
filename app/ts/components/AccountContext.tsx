import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { AccountStore } from '../store/account'

const AccountContext = createContext<AccountStore | undefined>(undefined)
export const AccountProvider = ({ children, store }: { children: ComponentChildren; store: AccountStore }) => {
	ensureConnected(store)
	executeSplashExit()

	return <AccountContext.Provider value={store}>{children}</AccountContext.Provider>
}

export function useAccountStore() {
	const context = useContext(AccountContext)
	if (context === undefined) throw new Error('useAccountStore can only be used within a child of AccountProvider')
	return context
}

function ensureConnected(accountStore: AccountStore) {
	useEffect(() => {
		if (accountStore.value.isConnected === true) return
		accountStore.value.reconnectMutation.dispatch()
	}, [])
}

function executeSplashExit() {
	useEffect(() => {
		const selectorClassName = '.splash-screen'
		const selectorHiddenClassName = 'splash-screen--off'

		const element = document.querySelector(selectorClassName)
		if (element === null || element.classList.contains(selectorHiddenClassName)) return
		element.classList.add(selectorHiddenClassName)
	}, [])
}
