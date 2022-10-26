type ExternalProvider = import('ethers').providers.ExternalProvider;
type Web3Provider = import('ethers').providers.Web3Provider;

interface Window {
	ethereum: ExternalProvider | Ethereum;
}

interface Ethereum extends ExternalProvider {
	on: (...args: any[]) => void;
}
