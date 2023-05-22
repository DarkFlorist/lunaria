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
				<Route path='#assets' component={AssetsPage} />
				<Route path='' component={TransferPage} />
				<Route path='#tx/:transaction_hash' component={TransactionPage} />
			</Router>
			<Notices />
		</SplashScreen>
	)
}
