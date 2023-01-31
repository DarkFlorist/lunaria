import { signal } from '@preact/signals'
import { ethers } from 'ethers'
import { assertsExternalProvider } from '../library/utilities.js'
import { accountStore } from './account.js'

type BalanceStore =
	| {
			state: 'inactive'
			checkEthBalance: () => Promise<void>
	  }
	| {
			state: 'pending'
			reset: () => void
	  }
	| {
			state: 'rejected'
			error: Error
			reset: () => void
	  }
	| {
			state: 'resolved'
			balance: string
			lastChecked: Date
			reset: () => void
	  }

async function checkEthBalance() {
	try {
		assertsExternalProvider(window.ethereum)
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		if (accountStore.value.status !== 'connected') throw new Error('Not connected!')
		balanceStore.value = { state: 'pending', reset }
		const balanceBigNumber = await provider.getBalance(accountStore.value.address)
		const balance = ethers.utils.formatEther(balanceBigNumber)
		balanceStore.value = { state: 'resolved', balance, lastChecked: new Date(), reset }
	} catch (exception) {
		let error = new Error(`Unhandled exception. ${exception}`)
		if (exception instanceof Error) error = exception
		balanceStore.value = { state: 'rejected', error, reset }
	}
}

function reset() {
	balanceStore.value = { state: 'inactive', checkEthBalance }
}

const balanceStore = signal<BalanceStore>({ state: 'inactive', checkEthBalance })
export const useBalanceAsync = () => balanceStore.value
