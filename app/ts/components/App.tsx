import { Route, Router } from './HashRouter.js'
import { SplashScreen } from './SplashScreen.js'
import { TransactionPage } from './TransactionPage/index.js'
import { TransferPage } from './TransferPage/index.js'
import { EthereumProvider } from '../context/Ethereum.js'
import { WalletProvider } from '../context/Wallet.js'
import { NotificationProvider } from '../context/Notification.js'
import { SubpathHostWarning } from './SubpathHostWarning.js'

export function App() {
	return (
		<SplashScreen>
			<NotificationProvider>
				<EthereumProvider>
					<WalletProvider>
						<Router>
							<Route path=''>
								<TransferPage />
							</Route>
							<Route path='#tx/:transaction_hash'>
								<TransactionPage />
							</Route>
						</Router>
					</WalletProvider>
				</EthereumProvider>
			</NotificationProvider>
			<SubpathHostWarning />
		</SplashScreen>
	)
}
