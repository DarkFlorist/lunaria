import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { AccountStore } from '../store/account'

const AccountContext = createContext<AccountStore | undefined>(undefined)
export const AccountProvider = ({ children, store }: { children: ComponentChildren; store: AccountStore }) => {
	useEffect(() => {
		if (store.value.isConnected) return
		store.value.connectMutation.dispatch()
	}, [])

	executeSplashExit()

	return <AccountContext.Provider value={store}>{children}</AccountContext.Provider>
}

export function useAccountStore() {
	const context = useContext(AccountContext)
	if (!context) throw new Error('useAccountStore can only be used within a child of AccountProvider')
	return context
}

function executeSplashExit() {
	useEffect(() => {
		const selectorClassName = '.splash-screen'
		const selectorHiddenClassName = 'splash-screen--off'

		const element = document.querySelector(selectorClassName)
		if (!element || element.classList.contains(selectorHiddenClassName)) return
		element.classList.add(selectorHiddenClassName)
	}, [])
}
