import { signal } from '@preact/signals';
import { ethers } from 'ethers';
import { localCache, parseAddress } from './utilities';

export type TransactionResponse = ethers.providers.TransactionResponse;
export type Network = ethers.providers.Network;

export type HexString = `0x${string}`;

export type Web3Helpers = {
	ethereum: ExternalProvider | Ethereum;
	provider: Web3Provider;
};

export type UnknownWallet = {
	status: 'unknown';
	initialize?: () => void;
};

export type DisconnectedWallet = Web3Helpers & {
	status: 'disconnected';
	connect?: () => Promise<void>;
};

export type SendEthResponse = {
	hash: string;
	to: string;
	fee: string;
};

export type SendEthStatus = {
	hash: string;
	to: string;
	fee: string;
};

export type ConnectedWallet = Web3Helpers & {
	status: 'connected';
	account: HexString;
	disconnect?: () => void;
	getBalance?: () => Promise<string>;
	getNetwork?: () => Promise<Network>;
	sendEth?: (to: HexString, amount: string) => Promise<TransactionResponse>;
	getSendEthStatus?: (
		transaction: TransactionResponse
	) => Promise<SendEthStatus>;
};

export type UseWallet = UnknownWallet | DisconnectedWallet | ConnectedWallet;

const wallet = signal<UseWallet>({ status: 'unknown' });

export default function useWallet(): UseWallet {
	switch (wallet.value.status) {
		case 'disconnected': {
			const { status, provider, ethereum } = wallet.value;
			const autoConnect = localCache('reconnect-on-refresh');

			const nextState: DisconnectedWallet = {
				status,
				provider,
				ethereum,
				connect: async () => {
					const accounts = await provider.send('eth_requestAccounts', []);

					autoConnect.value = true;

					wallet.value = {
						status: 'connected',
						provider,
						ethereum,
						account: parseAddress(accounts[0]),
					};
				},
			};

			if (autoConnect.value) nextState.connect?.();

			return nextState;
		}

		case 'connected': {
			const { status, account, provider, ethereum } = wallet.value;
			const autoConnect = localCache('reconnect-on-refresh');

			const nextState: ConnectedWallet = {
				status,
				account,
				ethereum,
				provider,

				disconnect: () => {
					autoConnect.remove();
					wallet.value = {
						ethereum,
						provider,
						status: 'disconnected',
					};
				},

				getBalance: async () => {
					const bigNumBalance = await provider.getBalance(account);
					const balance = ethers.utils.formatEther(bigNumBalance);
					return balance;
				},

				getNetwork: async () => {
					const network = await provider.getNetwork();

					(ethereum as Ethereum).on('chainChanged', () => {
						window.location.reload();
					});
					return network;
				},

				sendEth: async (to, amount) => {
					const signer = provider.getSigner();
					const value = ethers.utils.parseEther(amount);
					console.time('send_tranaction');
					return await signer.sendTransaction({ to, value });
				},

				getSendEthStatus: async (transaction) => {
					const { to, transactionHash, gasUsed, effectiveGasPrice, status } =
						await transaction.wait();

					const bigNumFee = effectiveGasPrice.mul(gasUsed);
					const fee = ethers.utils.formatEther(bigNumFee);

					if (status === 0) {
						throw new Error('The transaction returned with an error');
					}

					return {
						fee,
						hash: transactionHash,
						to: to,
					};
				},
			};

			return nextState;
		}

		case 'unknown':
			return {
				...wallet.value,
				initialize: async () => {
					console.count('initialized');
					wallet.value = {
						status: 'disconnected',
						ethereum: window.ethereum,
						provider: new ethers.providers.Web3Provider(window.ethereum),
					};
				},
			};

		default:
			const unReachable: never = wallet.value;
			throw new Error(`Unexpected type found ${unReachable}`);
	}
}
