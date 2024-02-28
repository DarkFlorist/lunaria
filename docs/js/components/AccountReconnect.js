import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
import { useSignalEffect } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { useWallet } from '../context/Wallet.js';
import { useEthereumProvider } from '../context/Ethereum.js';
import { useAsyncState } from '../library/preact-utilities.js';
import { EthereumAddress } from '../schema.js';
export const AccountReconnect = () => {
    const { browserProvider } = useEthereumProvider();
    const { account } = useWallet();
    const { value: query, waitFor } = useAsyncState();
    const attemptToConnect = () => {
        if (!browserProvider.value)
            return;
        const provider = browserProvider.value;
        waitFor(async () => {
            const [signer] = await provider.listAccounts();
            return EthereumAddress.parse(signer.address);
        });
    };
    const listenForQueryChanges = () => {
        // do not reset shared state for other instances of this hooks
        if (query.value.state === 'inactive')
            return;
        account.value = query.value;
    };
    useSignalEffect(listenForQueryChanges);
    useEffect(attemptToConnect, []);
    return _jsx(_Fragment, {});
};
//# sourceMappingURL=AccountReconnect.js.map