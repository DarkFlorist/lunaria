import { Route, Router } from './HashRouter.js'
import { TransactionPage } from './TransactionPage.js'
import { BalanceProvider } from '../context/BalanceContext.js'
import { EthereumProvider } from '../context/EthereumProvider.js'
import { AccountProvider } from '../context/Account.js'
import { TransferPage } from './TransferPage/index.js'
import { TransactionDetails } from './TransactionDetailsPage.js'
import { Notices } from './Notice.js'
import { useNotice } from '../store/notice.js'

export function App() {
	const { notify } = useNotice()
	return (
		<>
			<EthereumProvider>
				<AccountProvider>
					<BalanceProvider>
						<Router>
							<Route path='#tx' component={TransactionPage} />
							<Route path='#tx/:transaction_hash' component={TransactionDetails} />
							<Route path='/' component={TransferPage} />
						</Router>
					</BalanceProvider>
				</AccountProvider>
			</EthereumProvider>
			<button class='fixed bottom-10 right-10 bg-white px-3 py-2' onClick={() => notify({ title: 'Notice', message: 'Hello' })}>
				Test notice
			</button>
			<Notices />
		</>
	)
}
