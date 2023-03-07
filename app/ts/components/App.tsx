import { Route, Router } from './HashRouter.js'
import { TransferPage } from './TransferPage/index.js'
import { AssetsPage } from './AssetsPage/index.js'
import { Notices } from './Notice.js'
import { DemoPage } from './Demo.js'
import { LayoutDemo } from './DefaultLayout/Demo.js'
import { SplashScreen } from './SplashScreen.js'

export function App() {
	return (
		<SplashScreen>
			<Router>
				<Route path='#test' component={DemoPage} />
				<Route path='#layout' component={LayoutDemo} />
				<Route path='#assets' component={AssetsPage} />
				<Route path='/' component={TransferPage} />
			</Router>
			<Notices />
		</SplashScreen>
	)
}
