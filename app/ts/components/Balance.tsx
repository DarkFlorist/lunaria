import { useWallet } from './WalletProvider.js'

export const Balance = () => {
	const { account, status, balance, checkBalance } = useWallet()

	if (!account.value) return null

	if (status.value === 'BUSY') return <div>Balance: ...</div>

	if (!balance.value) return <div>Balance:</div>

	return (
		<div>
			Balance: {balance} <button onClick={() => checkBalance()}>🔄</button>
		</div>
	)
}
