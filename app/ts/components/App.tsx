import { useEffect } from 'preact/hooks';
import { Route, Router } from './Router';
import { SendEthPage } from './SendEthPage';
import useWallet from '../library/useWallet';

export const App = () => {
	const wallet = useWallet();

	useEffect(() => {
		if (wallet.status !== 'unknown') return;
		wallet.initialize!();
	}, []);

	return (
		<Router>
			<Route path='/' component={SendEthPage} />
		</Router>
	);
};
