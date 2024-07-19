import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Route, Router } from './HashRouter.js';
import { SplashScreen } from './SplashScreen.js';
import { TransactionPage } from './TransactionPage/index.js';
import { TransferPage } from './TransferPage/index.js';
import { EthereumProvider } from '../context/Ethereum.js';
import { WalletProvider } from '../context/Wallet.js';
import { NotificationProvider } from '../context/Notification.js';
import { IPFSSubpathRedirect } from './IPFSSubpathRedirect.js';
import { TemplatesProvider } from '../context/TransferTemplates.js';
export function App() {
    return (_jsxs(SplashScreen, { children: [_jsx(IPFSSubpathRedirect, {}), _jsx(NotificationProvider, { children: _jsx(EthereumProvider, { children: _jsx(WalletProvider, { children: _jsx(TemplatesProvider, { children: _jsxs(Router, { children: [_jsx(Route, { path: '', children: _jsx(TransferPage, {}) }), _jsx(Route, { path: '#saved/:template_id', children: _jsx(TransferPage, {}) }), _jsx(Route, { path: '#tx/:transaction_hash', children: _jsx(TransactionPage, {}) })] }) }) }) }) })] }));
}
//# sourceMappingURL=App.js.map