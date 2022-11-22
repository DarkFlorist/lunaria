import { effect, signal } from '@preact/signals'
import { ethers } from 'ethers'

const balance = signal('')
const account = signal('')
const status = signal<'BUSY' | 'SETTLED'>('SETTLED')

async function checkBalance() {
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	status.value = 'BUSY'
	const rawBalance = await provider.getBalance(account.value)
	balance.value = ethers.utils.formatEther(rawBalance)
	status.value = 'SETTLED'
}

async function connectMetamask() {
	try {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		status.value = 'BUSY'
		const accounts = await provider.send('eth_requestAccounts', [])
		status.value = 'SETTLED'
		account.value = accounts[0]
	} catch (error) {
		handleError(error)
	}
}

function handleError(error: unknown) {
	if (error instanceof Error) {
		console.log('Error caught:', error)
	}

	console.log(error)
}

// automatically check balance when account changes
effect(() => {
	account.value ? checkBalance() : (balance.value = '')
})

export function createWalletStore() {
	return {
		status,
		account,
		balance,
		checkBalance,
		connectMetamask,
	}
}
