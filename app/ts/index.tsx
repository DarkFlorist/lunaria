import { render } from 'preact';
import { App } from './components/App';
import { WalletProvider } from './components/WalletProvider';

render(
	<WalletProvider>
		<App />
	</WalletProvider>,
	document.body,
	document.querySelector('main') as HTMLElement
);
