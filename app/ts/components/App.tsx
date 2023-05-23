import { Route, Router } from './HashRouter.js'
import { TransferPage } from './TransferPage/index.js'
import { AssetsPage } from './AssetsPage/index.js'
import { Notices } from './Notice.js'
import { SplashScreen } from './SplashScreen.js'
import { TransactionPage } from './TransactionPage/index.js'

export function App() {
	return (
		<SplashScreen>
			<Router>
				<h1>invalid</h1>
				<Route path='#assets'>
					<AssetsPage />
				</Route>
				<Route path=''>
					<TransferPage />
				</Route>
				<Route path='#tx/:transaction_hash'>
					<TransactionPage />
				</Route>
			</Router>
			<Notices />
		</SplashScreen>
	)
}
