import { createAccountStore } from '../store/account.js'
import { AccountProvider } from './AccountContext.js'
import { Route, Router } from './HashRouter.js'
import { SendEthPage } from './SendEthPage.js'
import { TransactionDetailsPage } from './TransactionDetailsPage.js'
import { TransactionPage } from './TransactionPage.js'

export function App() {
	const accountStore = createAccountStore()

	return (
		<AccountProvider store={accountStore}>
			<Router>
				<Route path='#tx' component={TransactionPage} />
				<Route path='#tx/:transaction_hash' component={TransactionDetailsPage} />
				<Route path='/' component={() => <SendEthPage />} />
			</Router>
		</AccountProvider>
	)
}
