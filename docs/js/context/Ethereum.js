import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { createContext } from 'preact';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { useSignal, useSignalEffect } from '@preact/signals';
import { BrowserProvider } from 'ethers';
import { isEthereumProvider, withEip1193Provider } from '../library/ethereum.js';
import { useAsyncState } from '../library/preact-utilities.js';
import { BigIntHex } from '../schema.js';
export const EthereumProviderContext = createContext(undefined);
export const EthereumProvider = ({ children }) => {
    const browserProvider = useSignal(undefined);
    const network = useSignal({ state: 'inactive' });
    const blockNumber = useSignal(undefined);
    return (_jsxs(EthereumProviderContext.Provider, { value: { browserProvider, network, blockNumber }, children: [_jsx(BrowserProviderUpdater, {}), _jsx(BlockUpdater, {}), _jsx(NetworkUpdater, {}), _jsx(_Fragment, { children: children })] }));
};
export function useEthereumProvider() {
    const context = useContext(EthereumProviderContext);
    if (context === undefined)
        throw new Error('useEthereumProvider can only be used within children of EthereumProvider');
    return context;
}
const BrowserProviderUpdater = () => {
    const { browserProvider } = useEthereumProvider();
    const setBrowserProvider = (chainIdHex) => {
        if (!withEip1193Provider(window))
            return;
        const chainId = chainIdHex ? BigIntHex.parse(chainIdHex) : undefined;
        browserProvider.value = new BrowserProvider(window.ethereum, chainId);
    };
    const addChainChangeListener = () => {
        if (!withEip1193Provider(window))
            return;
        if (!isEthereumProvider(window.ethereum))
            return;
        window.ethereum.on('chainChanged', setBrowserProvider);
    };
    useEffect(() => {
        setBrowserProvider();
        addChainChangeListener();
    }, []);
    return _jsx(_Fragment, {});
};
const BlockUpdater = () => {
    const { browserProvider, blockNumber } = useEthereumProvider();
    const { value: query, waitFor } = useAsyncState();
    const previousProvider = useRef(undefined);
    const updateBlock = (newBlockNumber) => blockNumber.value = newBlockNumber;
    const addBlockListener = async (provider) => {
        if (previousProvider.current)
            previousProvider.current.removeListener('block', updateBlock);
        previousProvider.current = await provider.on('block', updateBlock);
    };
    const providerChangeEffect = () => {
        if (!browserProvider.value)
            return;
        const provider = browserProvider.value;
        waitFor(async () => await provider.getBlockNumber());
        addBlockListener(provider);
    };
    const queryChangeEffect = () => {
        if (query.value.state !== 'resolved')
            return;
        blockNumber.value = query.value.value;
    };
    useSignalEffect(providerChangeEffect);
    useSignalEffect(queryChangeEffect);
    return _jsx(_Fragment, {});
};
const NetworkUpdater = () => {
    const { browserProvider, network } = useEthereumProvider();
    const { value: query, waitFor } = useAsyncState();
    const providerChangeEffect = () => {
        if (!browserProvider.value)
            return;
        const provider = browserProvider.value;
        waitFor(async () => provider.getNetwork());
    };
    const queryChangeEffect = () => {
        network.value = query.value;
    };
    useSignalEffect(providerChangeEffect);
    useSignalEffect(queryChangeEffect);
    return _jsx(_Fragment, {});
};
//# sourceMappingURL=Ethereum.js.map