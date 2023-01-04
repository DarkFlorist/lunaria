import Router, { Route } from 'preact-router'
import { Redirect } from './Redirect.js'
import { SendEthPage } from './SendEthPage.js'

export function App() {
	const handleRouteChange = () => {
		// TODO: reconnect account on page refresh
	}

	return (
		<Router onChange={handleRouteChange}>
			<Route path='/tx/send' component={SendEthPage} />
			<Route path='/' component={() => <Redirect to='/tx/send' />} />
		</Router>
	)
}
