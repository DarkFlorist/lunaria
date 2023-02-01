import { useEffect } from 'preact/hooks'
import { accountStore } from '../store/account.js'
import { Route, Router } from './HashRouter.js'
import { SendEthPage } from './SendEthPage.js'
import { TransactionDetailsPage } from './TransactionDetailsPage.js'
import { TransactionPage } from './TransactionPage.js'

export function App() {
	const account = accountStore.value

	useEffect(() => {
		if (account.status !== 'disconnected') return
		account.ensureConnected()
	}, [])

	executeSplashExit()

	return (
		<Router>
			<Route path='#tx' component={TransactionPage} />
			<Route path='#tx/:transaction_hash' component={TransactionDetailsPage} />
			<Route path='/' component={SendEthPage} />
		</Router>
	)
}

function executeSplashExit() {
	useEffect(() => {
		const selectorClassName = '.splash-screen'
		const selectorHiddenClassName = 'splash-screen--off'

		const element = document.querySelector(selectorClassName)
		if (!element || element.classList.contains(selectorHiddenClassName)) return;
		element.classList.add(selectorHiddenClassName)
	}, [])
}
