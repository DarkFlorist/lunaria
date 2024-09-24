import { Route, Router } from './HashRouter.js'
import { SplashScreen } from './SplashScreen.js'
import { TransactionPage } from './TransactionPage/index.js'
import { TransferPage } from './TransferPage/index.js'
import { EthereumProvider } from '../context/Ethereum.js'
import { WalletProvider } from '../context/Wallet.js'
import { NotificationProvider } from '../context/Notification.js'
import { IPFSSubpathRedirect } from './IPFSSubpathRedirect.js'
import { TemplatesProvider } from '../context/TransferTemplates.js'

export function App() {

	return (
		<SplashScreen>
			<IPFSSubpathRedirect />
			<NotificationProvider>
				<EthereumProvider>
					<WalletProvider>
						<TemplatesProvider>
							<Router>
								<Route path=''>
									<TransferPage />
								</Route>
								<Route path='#saved/:template_id'>
									<TransferPage />
								</Route>
								<Route path='#tx/:transaction_hash'>
									<TransactionPage />
								</Route>
							</Router>
						</TemplatesProvider>
					</WalletProvider>
				</EthereumProvider>
			</NotificationProvider>
		</SplashScreen>
	)
}
