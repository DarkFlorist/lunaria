import { Route, Router } from './HashRouter.js'
import { Notices } from './Notice.js'
import { SplashScreen } from './SplashScreen.js'
import { TransactionPage } from './TransactionPage/index.js'
import { ErrorAlert } from './ErrorAlert.js'
import { TransferPage } from './TransferPage/index.js'
import { WalletProvider } from '../context/Wallet.js'
import { AccountProvider } from '../context/Account.js'

export function App() {
	return (
		<SplashScreen>
			<WalletProvider>
				<AccountProvider>
					<Router>
						<Route path=''>
							<TransferPage />
						</Route>
						<Route path='#tx/:transaction_hash'>
							<TransactionPage />
						</Route>
					</Router>
					<Notices />
					<ErrorAlert />
				</AccountProvider>
			</WalletProvider>
		</SplashScreen>
	)
}
