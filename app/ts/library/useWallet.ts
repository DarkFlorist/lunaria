import { signal } from '@preact/signals';
import { ethers } from 'ethers';

type Web3Provider = ethers.providers.Web3Provider;
type Network = ethers.providers.Network;
type TransactionResponse = ethers.providers.TransactionResponse;

export type HexString = `0x${string}`;

export type UnknownWallet = {
	state: 'unknown';
	initialize: () => void;
};

export type UnavailableWallet = {
	state: 'unavailable';
};

export type DisconnectedWallet = {
	state: 'disconnected';
	provider: ethers.providers.Web3Provider;
	connect: () => Promise<void>;
};

export type ConnectedWallet = {
	state: 'connected';
	provider: Web3Provider;
	account: HexString;
	network: Network;
	getBalance: () => Promise<string>;
	sendEth: (to: HexString, amount: string) => Promise<TransactionResponse>;
	getNetwork: () => Promise<void>;
};

export type Wallet =
	| UnknownWallet
	| UnavailableWallet
	| DisconnectedWallet
	| ConnectedWallet;

const ethereum = window.ethereum;
const provider = signal<Web3Provider | undefined>(undefined);
const state = signal<Wallet['state']>('unknown');
const account = signal<HexString | undefined>(undefined);
const network = signal<Network | undefined>(undefined);

export default function useWallet(): Wallet {
	switch (state.value) {
		case 'unknown':
			return {
				state: 'unknown',
				initialize: () => {
					if (window.ethereum !== undefined) {
						provider.value = new ethers.providers.Web3Provider(window.ethereum);
						state.value = 'disconnected';
						return;
					}

					state.value = 'unavailable';
				},
			};

		case 'unavailable':
			return {
				state: 'unavailable',
			};

		case 'disconnected':
			return {
				state: 'disconnected',
				provider: provider.value as Web3Provider,
				connect: async () => {
					const accounts = (await provider.value?.send(
						'eth_requestAccounts',
						[]
					)) as HexString[];
					account.value = accounts[0];
					state.value = 'connected';

					(ethereum as Ethereum).on(
						'accountsChanged',
						(newAccount: HexString[]) => {
							account.value = newAccount[0];
						}
					);
				},
			};

		case 'connected':
			return {
				state: 'connected',
				provider: provider.value as Web3Provider,
				account: account.value as HexString,
				network: network.value as ethers.providers.Network,

				getBalance: async () => {
					const bigNumBalance = await (
						provider.value as Web3Provider
					).getBalance(account.value as HexString);
					const balance = ethers.utils.formatEther(bigNumBalance);
					return balance;
				},

				sendEth: async (to, amount) => {
					if (!ethers.utils.isAddress(to)) {
						throw new Error('Not a valid address.');
					}

					const provider = new ethers.providers.Web3Provider(ethereum);
					const signer = provider.getSigner();
					const value = ethers.utils.parseEther(amount);
					const transaction = await signer.sendTransaction({ to, value });
					return transaction;
				},

				getNetwork: async () => {
					network.value = await provider.value?.getNetwork();

					// reload page on network change
					(ethereum as Ethereum).on('chainChanged', async () => {
						window.location.reload();
					});
				},
			};
	}
}
