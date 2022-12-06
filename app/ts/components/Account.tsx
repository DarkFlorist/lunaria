import { useWallet } from './WalletProvider.js'

export const Account = () => {
	const { account, connectMetamask } = useWallet()

	if (!account.value) {
		return <button onClick={() => connectMetamask()}>Connect</button>
	}

	return <div>Account: {account}</div>
}
