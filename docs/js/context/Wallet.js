import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useComputed, useSignal, useSignalEffect } from '@preact/signals';
import { Contract, makeError } from 'ethers';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { DEFAULT_TOKENS, SETTINGS_CACHE_KEY } from '../library/constants.js';
import { ERC20ABI } from '../library/ERC20ABI.js';
import { isEthereumProvider, withEip1193Provider } from '../library/ethereum.js';
import { persistSignalEffect } from '../library/persistent-signal.js';
import { useAsyncState } from '../library/preact-utilities.js';
import { SettingsCacheSchema, createCacheParser, EthereumAddress } from '../schema.js';
import { useEthereumProvider } from './Ethereum.js';
export const WalletContext = createContext(undefined);
export const WalletProvider = ({ children }) => {
    const settings = useSignal({ data: [], version: '1.0.0' });
    const account = useSignal({ state: 'inactive' });
    persistSignalEffect(SETTINGS_CACHE_KEY, settings, createCacheParser(SettingsCacheSchema));
    return (_jsxs(WalletContext.Provider, { value: { account, settings }, children: [_jsx(AccountUpdater, {}), _jsx(SettingsUpdater, {}), children] }));
};
export function useWallet() {
    const context = useContext(WalletContext);
    if (!context)
        throw new Error('useWallet can only be used within children of WalletProvider');
    const { browserProvider } = useEthereumProvider();
    const { value: query, waitFor } = useAsyncState();
    const connect = () => {
        waitFor(async () => {
            if (!browserProvider.value) {
                throw makeError('No compatible web3 wallet detected.', 'UNKNOWN_ERROR', { error: { code: 4900 } });
            }
            const signer = await browserProvider.value.getSigner();
            return EthereumAddress.parse(signer.address);
        });
    };
    const listenForQueryChanges = () => {
        // do not reset shared state for other instances of this hooks
        if (query.value.state === 'inactive')
            return;
        context.account.value = query.value;
    };
    useSignalEffect(listenForQueryChanges);
    return { ...context, connect };
}
const AccountUpdater = () => {
    const { account } = useWallet();
    const addAccountChangeListener = () => {
        if (!withEip1193Provider(window))
            return;
        if (!isEthereumProvider(window.ethereum))
            return;
        window.ethereum.on('accountsChanged', updateAsyncAccount);
    };
    const updateAsyncAccount = ([newAddress]) => {
        account.value = newAddress ? { state: 'resolved', value: EthereumAddress.parse(newAddress) } : { state: 'inactive' };
    };
    const listenToAccountChange = () => {
        if (account.value.state !== 'resolved')
            return;
        addAccountChangeListener();
    };
    useSignalEffect(listenToAccountChange);
    return _jsx(_Fragment, {});
};
const SettingsUpdater = () => {
    const { account, settings } = useWallet();
    const initializeSettings = (accountAddress) => {
        const accountSettingsExist = settings.value.data.some(data => data.address === accountAddress);
        if (accountSettingsExist)
            return;
        const accountSettings = {
            address: accountAddress,
            holdings: DEFAULT_TOKENS.map(token => token.address)
        };
        settings.value = Object.assign({}, settings.peek(), { data: settings.peek().data.concat([accountSettings]) });
    };
    useSignalEffect(() => {
        if (account.value.state !== 'resolved')
            return;
        initializeSettings(account.value.value);
    });
    return _jsx(_Fragment, {});
};
export function useBalance() {
    const { browserProvider, blockNumber } = useEthereumProvider();
    const { account } = useWallet();
    const { value: balance, waitFor } = useAsyncState();
    const token = useSignal(undefined);
    const resolvedAccount = useComputed(() => account.value.state === 'resolved' ? account.value.value : undefined);
    const queryAssetBalance = (accountAddress, token) => {
        if (!browserProvider.value || !blockNumber.value)
            return;
        const provider = browserProvider.value;
        if (!token) {
            waitFor(async () => await provider.getBalance(accountAddress, blockNumber.value));
        }
        else {
            const contract = new Contract(token.address, ERC20ABI, provider);
            waitFor(async () => await contract.balanceOf(accountAddress));
        }
    };
    const fetchLatestBalance = () => {
        if (!resolvedAccount.value)
            return;
        queryAssetBalance(resolvedAccount.value, token.value);
    };
    useSignalEffect(fetchLatestBalance);
    return { balance, token };
}
//# sourceMappingURL=Wallet.js.map