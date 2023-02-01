import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { AccountStore } from '../store/account'

const AccountContext = createContext<AccountStore | undefined>(undefined)
export const AccountProvider = ({ children, store }: { children: ComponentChildren; store: AccountStore }) => {
	tryConnect(store)
	executeSplashExit()

	return <AccountContext.Provider value={store}>{children}</AccountContext.Provider>
}

export function useAccountStore() {
	const context = useContext(AccountContext)
	if (context === undefined) throw new Error('useAccountStore can only be used within a child of AccountProvider')
	return context
}

function tryConnect(accountStore: AccountStore) {
	useEffect(() => {
		if (accountStore.value.state !== 'disconnected') return
		accountStore.value.connect(true)
	}, [])
}

function executeSplashExit() {
	useEffect(() => {
		const selectorHiddenClassName = 'splash-screen--off'

		const element = document.querySelector('.splash-screen')
		if (element === null || element.classList.contains(selectorHiddenClassName)) return
		element.classList.add(selectorHiddenClassName)
	}, [])
}
