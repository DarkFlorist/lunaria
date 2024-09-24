import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useSignalEffect } from '@preact/signals';
import { LAYOUT_SCROLL_OPTIONS } from '../../library/constants.js';
import { Header, HeaderNav, Main, Navigation, Root, usePanels } from '../DefaultLayout/index.js';
import { ConnectAccount } from '../ConnectAccount.js';
import { TransferHistory } from '../TransferHistory.js';
import { DiscordInvite } from '../DiscordInvite.js';
import { Templates } from '../Templates.js';
import { MainFooter } from '../MainFooter.js';
import { TransferProvider, useTransfer } from '../../context/Transfer.js';
import { TransferHistoryProvider } from '../../context/TransferHistory.js';
import { SetupTransfer } from '../SetupTransfer.js';
import { TokenManagerProvider } from '../../context/TokenManager.js';
import { AccountReconnect } from '../AccountReconnect.js';
import * as Icon from '../Icon/index.js';
export const TransferPage = () => {
    return (_jsxs(_Fragment, { children: [_jsx(AccountReconnect, {}), _jsx("div", { class: 'fixed inset-0 bg-black text-white h-[100dvh]', children: _jsx(Root, { children: _jsx(TokenManagerProvider, { children: _jsx(TransferHistoryProvider, { children: _jsxs(TransferProvider, { children: [_jsx(LeftPanel, {}), _jsx(MainPanel, {})] }) }) }) }) })] }));
};
const MainPanel = () => {
    const { transaction } = useTransfer();
    const { nav, main } = usePanels();
    const redirectOnSuccess = (path) => {
        window.location.hash = path;
    };
    useSignalEffect(() => {
        if (transaction.value.state !== 'resolved')
            return;
        redirectOnSuccess(`#tx/${transaction.value.value.hash}`);
    });
    return (_jsxs(Main, { children: [_jsx(Header, { children: _jsx(HeaderNav, { show: main?.isIntersecting, iconLeft: Icon.Menu, onClick: () => nav?.target.scrollIntoView(LAYOUT_SCROLL_OPTIONS), text: 'Menu' }) }), _jsx("div", { class: 'px-4', children: _jsx(ConnectAccount, {}) }), _jsx("div", { class: 'px-4', children: _jsx("div", { class: 'py-4', children: _jsx("div", { class: 'text-3xl font-bold', children: "Transfer" }) }) }), _jsx("div", { class: 'px-4', children: _jsx(SetupTransfer, {}) }), _jsx(MainFooter, {})] }));
};
const LeftPanel = () => {
    const { nav, main } = usePanels();
    // full url without the hash route
    const [baseUrl] = window.location.href.split('#');
    return (_jsxs(Navigation, { children: [_jsx(Header, { children: _jsx(HeaderNav, { show: nav?.isIntersecting, iconLeft: Icon.Xmark, onClick: () => main?.target.scrollIntoView(LAYOUT_SCROLL_OPTIONS), text: 'Close Menu' }) }), _jsx("div", { class: 'mb-4 p-4', children: _jsxs("div", { class: 'flex items-center gap-2', children: [_jsx("img", { class: 'w-10 h-10', src: './img/icon-lunaria.svg' }), _jsxs("div", { children: [_jsx("div", { class: 'text-3xl font-bold leading-none', children: "Lunaria" }), _jsx("div", { class: 'text-white/50 leading-none', children: "Decentralized Wallet" })] })] }) }), _jsxs("div", { class: 'pl-4 mb-4', children: [_jsx("div", { class: 'text-white/30 text-sm', children: "Actions" }), _jsx("a", { href: baseUrl, children: _jsxs("div", { class: 'grid grid-cols-[auto,1fr] items-center gap-4 mb-4', children: [_jsx("div", { class: 'bg-white/30 w-10 h-10 rounded-full' }), _jsxs("div", { class: 'py-2 leading-tight', children: [_jsx("div", { class: 'font-bold', children: "New Transfer" }), _jsx("div", { class: 'text-white/50', children: "Send and Manage Tokens" })] })] }) })] }), _jsx(TransferHistory, {}), _jsx(Templates, {}), _jsx(DiscordInvite, {})] }));
};
//# sourceMappingURL=index.js.map