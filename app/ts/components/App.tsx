import { Route, Router } from './HashRouter.js'
import { TransactionPage } from './TransactionPage.js'
import { BalanceProvider } from '../context/BalanceContext.js'
import { EthereumProvider } from '../context/EthereumProvider.js'
import { AccountProvider } from '../context/Account.js'
import { TransferPage } from './TransferPage/index.js'
import { TransactionDetails } from './TransactionDetailsPage.js'
import { AssetsPage } from './AssetsPage/index.js'
import { Notices } from './Notice.js'
import { DemoPage } from './Demo.js'

export function App() {
	return (
		<>
			<EthereumProvider>
				<AccountProvider>
					<BalanceProvider>
						<Router>
							<Route path='#tx' component={TransactionPage} />
							<Route path='#tx/:transaction_hash' component={TransactionDetails} />
							<Route path='#test' component={DemoPage} />
							<Route path='#assets' component={AssetsPage} />
							<Route path='/' component={TransferPage} />
						</Router>
					</BalanceProvider>
				</AccountProvider>
			</EthereumProvider>
			<Notices />
		</>
	)
}
