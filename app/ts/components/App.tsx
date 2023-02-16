import { Route, Router } from './HashRouter.js'
import { SendEthPage } from './SendEthPage.js'
import { TransactionPage } from './TransactionPage.js'
import { TransactionDetailsPage } from './TransactionDetailsPage.js'
import { BalanceProvider } from '../context/BalanceContext.js'
import { EthereumProvider } from '../context/EthereumProvider.js'
import { AccountProvider } from '../context/Account.js'

export function App() {
	return (
		<EthereumProvider>
			<AccountProvider>
				<BalanceProvider>
					<Router>
						<Route path='#tx' component={TransactionPage} />
						<Route path='#tx/:transaction_hash' component={TransactionDetailsPage} />
						<Route path='/' component={SendEthPage} />
					</Router>
				</BalanceProvider>
			</AccountProvider>
		</EthereumProvider>
	)
}
