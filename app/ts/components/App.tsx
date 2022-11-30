import { Route, Router } from './Router'
import { SendEthPage } from './SendEthPage'

export function App() {
	return (
		<Router>
			<Route path='/' component={SendEthPage} />
		</Router>
	)
}
