import { createContext, FunctionalComponent } from 'preact';
import { useContext } from 'preact/hooks';
import { createWalletStore } from '../store/wallet';

export const WalletContext = createContext(
	{} as ReturnType<typeof createWalletStore>
);

export const WalletProvider: FunctionalComponent = ({ children }) => {
	const store = createWalletStore();

	return (
		<WalletContext.Provider value={store}>{children}</WalletContext.Provider>
	);
};

export function useWallet() {
	return useContext(WalletContext);
}
