import { Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { Contract } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { DEFAULT_TOKENS, SETTINGS_CACHE_KEY } from '../library/constants.js'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { isEthereumProvider, withEip1193Provider } from '../library/ethereum.js'
import { persistSignalEffect } from '../library/persistent-signal.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { SettingsCacheSchema, createCacheParser, SettingsCache, EthereumAddress, HexString, AccountSettings, ERC20Token } from '../schema.js'
import { useWallet } from './Wallet.js'

type Balance = {
	contractAddress: EthereumAddress | undefined
	value: bigint
	block: number
}

export type AccountContext = {
	settings: Signal<SettingsCache>
	account: Signal<AsyncProperty<EthereumAddress>>
	balances: Signal<Balance[]>
}

export const AccountContext = createContext<AccountContext | undefined>(undefined)
export const AccountProvider = ({ children }: { children: ComponentChildren }) => {
	const settings = useSignal<SettingsCache>({ data: [], version: '1.0.0' })
	const account = useSignal<AsyncProperty<EthereumAddress>>({ state: 'inactive' })
	const balances = useSignal<Balance[]>([])

	const updateAsyncAccount = ([newAddress]: (string | undefined)[]) => {
		account.value = newAddress ? { state: 'resolved', value: EthereumAddress.parse(newAddress) } : { state: 'inactive' }
	}

	const initializeSettings = (accountAddress: HexString) => {
		const accountSettingsExist = settings.value.data.some(data => data.address === accountAddress)
		if (accountSettingsExist) return
		const accountSettings: AccountSettings = {
			address: accountAddress,
			holdings: DEFAULT_TOKENS.map(token => token.address)
		}
		settings.value = Object.assign({}, settings.peek(), { data: settings.peek().data.concat([accountSettings]) })
	}

	const addAccountChangeListener = () => {
		if (!withEip1193Provider(window)) return
		if (!isEthereumProvider(window.ethereum)) return
		window.ethereum.on('accountsChanged', updateAsyncAccount)
	}

	const listenToAccountChange = () => {
		if (account.value.state !== 'resolved') return
		initializeSettings(account.value.value)
		addAccountChangeListener()
	}

	useSignalEffect(listenToAccountChange)
	persistSignalEffect(SETTINGS_CACHE_KEY, settings, createCacheParser(SettingsCacheSchema))

	return <AccountContext.Provider value={{ account, settings, balances }}>{children}</AccountContext.Provider>
}

export function useAccount() {
	const context = useContext(AccountContext)
	if (!context) throw new Error('useSettings can only be used within children of SettingsProvider')
	return context
}

export function useBalance() {
	const { browserProvider, blockNumber } = useWallet()
	const { account } = useAccount()
	const { value: balance, waitFor } = useAsyncState<bigint>()
	const token = useSignal<ERC20Token | undefined>(undefined)

	const resolvedAccount = useComputed(() => account.value.state === 'resolved' ? account.value.value : undefined)

	const queryAssetBalance = (accountAddress: EthereumAddress, token?: ERC20Token) => {
		if (!browserProvider.value || !blockNumber.value) return
		const provider = browserProvider.value
		if (!token) {
			waitFor(async () => await provider.getBalance(accountAddress, blockNumber.value))
		} else {
			const contract = new Contract(token.address, ERC20ABI, provider)
			waitFor(async () => await contract.balanceOf(accountAddress))
		}
	}

	const fetchLatestBalance = () => {
		if (!resolvedAccount.value) return
		queryAssetBalance(resolvedAccount.value, token.value)
	}

	useSignalEffect(fetchLatestBalance)

	return { balance, token }
}
