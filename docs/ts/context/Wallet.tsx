import { Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { Contract, makeError } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { DEFAULT_TOKENS, SETTINGS_CACHE_KEY } from '../library/constants.js'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { isEthereumProvider, withEip1193Provider } from '../library/ethereum.js'
import { persistSignalEffect } from '../library/persistent-signal.js'
import { AsyncProperty, useAsyncState } from '../library/preact-utilities.js'
import { SettingsCacheSchema, createCacheParser, SettingsCache, EthereumAddress, HexString, AccountSettings, ERC20Token } from '../schema.js'
import { useEthereumProvider } from './Ethereum.js'

export type WalletContext = {
	settings: Signal<SettingsCache>
	account: Signal<AsyncProperty<EthereumAddress>>
}

export const WalletContext = createContext<WalletContext | undefined>(undefined)
export const WalletProvider = ({ children }: { children: ComponentChildren }) => {
	const settings = useSignal<SettingsCache>({ data: [], version: '1.0.0' })
	const account = useSignal<AsyncProperty<EthereumAddress>>({ state: 'inactive' })

	persistSignalEffect(SETTINGS_CACHE_KEY, settings, createCacheParser(SettingsCacheSchema))

	return (
		<WalletContext.Provider value={{ account, settings }}>
			<AccountUpdater />
			<SettingsUpdater />
			{children}
		</WalletContext.Provider>
	)
}

export function useWallet() {
	const context = useContext(WalletContext)
	if (!context) throw new Error('useWallet can only be used within children of WalletProvider')

	const { browserProvider } = useEthereumProvider()
	const { value: query, waitFor } = useAsyncState<EthereumAddress>()

	const connect = () => {
		waitFor(async () => {
			if (!browserProvider.value) {
				throw makeError('No compatible web3 wallet detected.', 'UNKNOWN_ERROR', { error: { code: 4900 } })
			}
			const signer = await browserProvider.value.getSigner()
			return EthereumAddress.parse(signer.address)
		})
	}

	const listenForQueryChanges = () => {
		// do not reset shared state for other instances of this hooks
		if (query.value.state === 'inactive') return
		context.account.value = query.value
	}

	useSignalEffect(listenForQueryChanges)
	return { ...context, connect }
}

const AccountUpdater = () => {
	const { account } = useWallet()
	const addAccountChangeListener = () => {
		if (!withEip1193Provider(window)) return
		if (!isEthereumProvider(window.ethereum)) return
		window.ethereum.on('accountsChanged', updateAsyncAccount)
	}
	const updateAsyncAccount = ([newAddress]: (string | undefined)[]) => {
		account.value = newAddress ? { state: 'resolved', value: EthereumAddress.parse(newAddress) } : { state: 'inactive' }
	}
	const listenToAccountChange = () => {
		if (account.value.state !== 'resolved') return
		addAccountChangeListener()
	}

	useSignalEffect(listenToAccountChange)

	return <></>
}

const SettingsUpdater = () => {
	const { account, settings } = useWallet()
	const initializeSettings = (accountAddress: HexString) => {
		const accountSettingsExist = settings.value.data.some(data => data.address === accountAddress)
		if (accountSettingsExist) return
		const accountSettings: AccountSettings = {
			address: accountAddress,
			holdings: DEFAULT_TOKENS.map(token => token.address)
		}
		settings.value = Object.assign({}, settings.peek(), { data: settings.peek().data.concat([accountSettings]) })
	}

	useSignalEffect(() => {
		if (account.value.state !== 'resolved') return
		initializeSettings(account.value.value)
	})

	return <></>
}

export function useBalance() {
	const { browserProvider, blockNumber } = useEthereumProvider()
	const { account } = useWallet()
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

