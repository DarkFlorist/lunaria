import { Route, Router } from './HashRouter.js'
import { SplashScreen } from './SplashScreen.js'
import { TransactionPage } from './TransactionPage/index.js'
import { TransferPage } from './TransferPage/index.js'
import { WalletProvider } from '../context/Wallet.js'
import { AccountProvider } from '../context/Account.js'
import { NotificationProvider } from '../context/Notification.js'

export function App() {
	return (
		<SplashScreen>
			<NotificationProvider>
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
					</AccountProvider>
				</WalletProvider>
			</NotificationProvider>
		</SplashScreen>
	)
}
