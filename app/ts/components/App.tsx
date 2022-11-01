import { Route, Router } from './Router';
import { HomePage } from './LandingPage';
import { SendEthPage } from './SendEthPage';

export const App = () => {
	return (
		<Router>
			<Route path='/' component={HomePage} />
			<Route path='/send-eth' component={SendEthPage} />
		</Router>
	);
};
