import { useEffect } from 'preact/hooks'
import { Route, Router, useParams } from './HashRouter.js'
import { SendEthPage } from './SendEthPage.js'

export function App() {
	executeSplashExit()

	return (
		<Router>
			<Route path='#tx/:transaction_hash' component={Transaction} />
			<Route path='/' component={SendEthPage} />
		</Router>
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

function executeSplashExit() {
	useEffect(() => {
		const selectorClassName = '.splash-screen'
		const selectorHiddenClassName = 'splash-screen--off'

		const element = document.querySelector(selectorClassName)
		if (!element || element.classList.contains(selectorHiddenClassName)) return;
		element.classList.add(selectorHiddenClassName)
	}, [])
}
