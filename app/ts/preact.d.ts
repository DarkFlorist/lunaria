type ExternalProvider = import('ethers').providers.ExternalProvider;

interface Window {
	ethereum: ExternalProvider;
}

interface EthereumProvider extends ExternalProvider {
	on: (...args: any[]) => void;
}
