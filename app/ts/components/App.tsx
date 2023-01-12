import { Route, Router, useParams } from './HashRouter.js'

export function App() {
	return (
		<Router>
			<Route path='/#!/tx/send' component={Send} />
			<Route path='/#!/tx/:transaction_hash' component={Transaction} />
			<Route path='/' component={Home} />
		</Router>
	)
}

const Home = () => {
	return (
		<div class='px-4'>
			<h4 class='my-3'>Home Page</h4>
			<a class='px-4 py-2 border' href='#!/tx/send'>
				Go to send page
			</a>
		</div>
	)
}

const Send = () => {
	return (
		<div class='px-4'>
			<h4 class='my-3'>Send Page</h4>
			<a class='px-4 py-2 border' href='#!/tx/43ll'>
				Simulate send transaction
			</a>
		</div>
	)
}

const Transaction = () => {
	const params = useParams()
	const hash = params && 'transaction_hash' in params && params.transaction_hash

	return (
		<div class='px-4'>
			<h4 class='my-3'>Transaction Details</h4>
			<div>
				Transaction Hash: <strong>{hash}</strong>
			</div>
		</div>
	)
}
