import { signal } from '@preact/signals';
import { ethers } from 'ethers';
import { MINIMUM_SEND } from '../constants';

const { ethereum } = window;
const accounts = signal<string[] | undefined>(undefined);

async function connectWallet() {
	if (!ethereum) {
		throw new Error('No Web3 wallet detected.');
	}

	const ethAccounts = await ethereum.request?.({
		method: 'eth_requestAccounts',
		params: [],
	});

	(ethereum as EthereumProvider).on(
		'accountsChanged',
		(newAccounts: string[]) => {
			accounts.value = newAccounts;
		}
	);

	accounts.value = ethAccounts;
	return ethAccounts;
}

async function getBalance(address: string) {
	if (!ethereum) {
		throw new Error('No Web3 wallet detected.');
	}
	const provider = new ethers.providers.Web3Provider(ethereum);
	return await provider.getBalance(address);
}

async function sendTransaction(to: string, amount: number) {
	if (!ethereum) {
		throw new Error('No Web3 wallet detected.');
	}

	if (!ethers.utils.isAddress(to)) {
		throw new Error('Not a valid address.');
	}

	if (amount < MINIMUM_SEND) {
		throw new Error('Cannot send below minimum value.');
	}

	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();
	const value = ethers.utils.parseEther(`${amount}`);
	const transaction = await signer.sendTransaction({ to, value });
	return transaction;
}

export default function useWallet() {
	return {
		accounts: accounts.value,
		connectWallet,
		sendTransaction,
		getBalance,
	};
}

export type WalletModel = ReturnType<typeof useWallet>;
