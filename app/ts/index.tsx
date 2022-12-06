import { render } from 'preact'
import { App } from './components/App.js'
import { WalletProvider } from './components/WalletProvider.js'

render(
	<WalletProvider>
		<App />
	</WalletProvider>,
	document.body,
	document.querySelector('main') as HTMLElement
)
