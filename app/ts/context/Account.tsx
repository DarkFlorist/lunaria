import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";
import { SETTINGS_CACHE_KEY } from "../library/constants.js";
import { assertsEthereumObservable, assertsWithEthereum } from "../library/ethereum.js";
import { persistSignalEffect } from "../library/persistent-signal.js";
import { AsyncProperty } from "../library/preact-utilities.js";
import { SettingsCacheSchema, createCacheParser, SettingsCache, EthereumAddress } from "../schema.js";

export type AccountContext = {
	settings: Signal<SettingsCache>
	account: Signal<AsyncProperty<EthereumAddress>>
}

export const AccountContext = createContext<AccountContext | undefined>(undefined)
export const AccountProvider = ({ children }: { children: ComponentChildren }) => {
	const settings = useSignal<SettingsCache>({ data: [], version: '1.0.0' })
	const account = useSignal<AsyncProperty<EthereumAddress>>({ state: 'inactive' })

	const updateAsyncAccount = ([newAddress]: (string | undefined)[]) => {
		account.value = newAddress ? { state: 'resolved', value: EthereumAddress.parse(newAddress) } : { state: 'inactive' }
	}

	const listenToWalletsAccountChange = () => {
		assertsWithEthereum(window)
		assertsEthereumObservable(window.ethereum)
		window.ethereum.on('accountsChanged', updateAsyncAccount)
	}

	const listenToAccountChange = () => {
		if (account.value.state !== 'resolved') return
		listenToWalletsAccountChange()
	}

	useSignalEffect(listenToAccountChange)
	persistSignalEffect(SETTINGS_CACHE_KEY, settings, createCacheParser(SettingsCacheSchema))

	return <AccountContext.Provider value={{ account, settings }}>{children}</AccountContext.Provider>
}

export function useAccount() {
	const context = useContext(AccountContext)
	if (!context) throw new Error('useSettings can only be used within children of SettingsProvider')
	return context
}
