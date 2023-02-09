import { createAccountStore } from '../store/account.js'
import { AccountProvider } from './AccountContext.js'
import { Route, Router } from './HashRouter.js'
import { SendEthPage } from './SendEthPage.js'
import { TransactionPage } from './TransactionPage.js'
import { TransactionDetailsPage } from './TransactionDetailsPage.js'
import { BalanceProvider, createBalanceStore } from '../context/BalanceContext.js'

export function App() {
	const accountStore = createAccountStore()
	const balanceStore = createBalanceStore()

	return (
		<AccountProvider store={accountStore}>
			<BalanceProvider store={balanceStore}>
				<Router>
					<Route path='#tx' component={TransactionPage} />
					<Route path='#tx/:transaction_hash' component={TransactionDetailsPage} />
					<Route path='/' component={SendEthPage} />
				</Router>
			</BalanceProvider>
		</AccountProvider>
	)
}
