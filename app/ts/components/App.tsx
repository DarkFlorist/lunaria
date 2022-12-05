import { Route, Router } from './Router.js'
import { SendEthPage } from './SendEthPage.js'

export function App() {
	return (
		<Router>
			<Route path='/' component={SendEthPage} />
		</Router>
	)
}
