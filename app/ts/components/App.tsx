import { Route, Router } from './HashRouter.js'
import { SendEthPage } from './SendEthPage.js'

export function App() {
	function handleHashChange() {
		// handle hash change here
	}

	return (
		<Router onHashChange={handleHashChange}>
			<Route path='/#!/tx/send' component={Send} />
			<Route path='/#!/tx/:transaction_hash' component={SendEthPage} />
			<Route path='/' component={Home} />
		</Router>
	)
}

const Home = () => {
	return (
		<div>
			<h4>Home</h4>
			<a href='#!/tx/send'>send</a>
		</div>
	)
}

const Send = () => {
	return (
		<div>
			<h4>Send</h4>
			<a href='#!/tx/123123'>transaction</a>
		</div>
	)
}
