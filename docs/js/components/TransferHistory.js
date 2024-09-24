import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useComputed } from '@preact/signals';
import { useWallet } from '../context/Wallet.js';
import { useTransferHistory } from '../context/TransferHistory.js';
import { TimeAgo } from './TimeAgo.js';
import { AbbreviatedValue } from './AbbreviatedValue.js';
export const TransferHistory = () => {
    const history = useTransferHistory();
    const { account } = useWallet();
    const connectedAddress = useComputed(() => (account.value.state !== 'resolved' ? undefined : account.value.value));
    const getTransfersFromConnectedAddress = () => {
        return (history.value.data
            // select only history from connected account
            .filter(transfer => transfer.from === connectedAddress.value)
            // sort by recent transfer date
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };
    const connectedAddressTransfers = useComputed(getTransfersFromConnectedAddress);
    return (_jsxs("div", { class: 'pl-4 mb-4', children: [_jsx("div", { class: 'text-white/30 text-sm mb-2', children: "Recent Transfers" }), _jsx(HistoryList, { transfers: connectedAddressTransfers.value })] }));
};
const HistoryList = ({ transfers }) => {
    if (transfers.length < 1)
        return _jsx("div", { class: 'border border-dashed border-white/30 px-4 h-16 text-sm text-white/50 flex items-center justify-center leading-tight', children: "A history of transfers will be stored locally on the current browser." });
    return (_jsx("div", { children: transfers.map(transfer => {
            const timeStamp = new Date(transfer.date).getTime();
            return (_jsxs("a", { class: 'block bg-white/10 px-4 py-3 mb-1 hover:bg-white/20', href: `#tx/${transfer.hash}`, children: [_jsxs("div", { class: 'overflow-hidden text-ellipsis whitespace-nowrap', children: ["Sent ", _jsx(AbbreviatedValue, { amount: transfer.amount, decimals: transfer.token?.decimals }), " ", transfer.token?.name || 'ETH', " to ", transfer.to] }), _jsx("div", { class: 'text-sm text-white/50', children: _jsx(TimeAgo, { since: timeStamp }) })] }));
        }) }));
};
//# sourceMappingURL=TransferHistory.js.map