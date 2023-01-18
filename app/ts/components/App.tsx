import { useEffect } from 'preact/hooks'
import { Route, Router, useParams } from './HashRouter.js'
import { SendEthPage } from './SendEthPage.js'

export function App() {
	useSplashEffect()

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

function useSplashEffect() {
	useEffect(() => {
		const element = document.querySelector('.splash-screen')
		element?.classList.add('splash-screen--off')
	}, [])
}
