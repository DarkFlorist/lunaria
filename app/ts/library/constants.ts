export type TokenAsset = {
	type: 'token'
	chainId: string
	address: string
	name: string
	symbol: string
	decimals: number
}

export type NativeAsset = {
	type: 'native'
	chainId: string
	name: string
	symbol: string
}

export type AssetMetadata = TokenAsset | NativeAsset

export const assets: AssetMetadata[] = [
	{
		type: 'native',
		chainId: '0x01',
		name: 'Ether',
		symbol: 'ETH',
	},
	{
		type: 'token',
		chainId: '0x01',
		address: '0x4c9bbfc1fbd93dfb509e718400978fbeedf590e9',
		name: 'Rai',
		symbol: 'RAI',
		decimals: 18,
	},
	{
		type: 'token',
		chainId: '0x01',
		address: '0x6b175474e89094c44da98b954eedeac495271d0f',
		name: 'Dai',
		symbol: 'DAI',
		decimals: 18,
	},
	{
		type: 'token',
		chainId: '0x01',
		address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		name: 'WETH',
		symbol: 'WETH',
		decimals: 18,
	},
	{
		type: 'token',
		chainId: '0x01',
		address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
	},
	{
		type: 'token',
		chainId: '0x01',
		address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
		name: 'Wrapped Bitcoin',
		symbol: 'WBTC',
		decimals: 8,
	},
	{
		type: 'native',
		chainId: '0x05',
		name: 'Goerli Ether',
		symbol: 'GoerliETH',
	},
	{
		type: 'token',
		chainId: '0x05',
		address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		name: 'WETH',
		symbol: 'WETH',
		decimals: 18,
	},
	{
		type: 'token',
		chainId: '0x05',
		address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
	},
]

export type NetworkMetaData = {
	id: string
	name: string
}

export const networks: NetworkMetaData[] = [
	{
		id: '0x01',
		name: 'Mainnet',
	},
	{
		id: '0x05',
		name: 'Goerli',
	},
]

export function isTokenAsset(asset: AssetMetadata): asset is TokenAsset {
	return asset.type === 'token'
}

export function isNativeAsset(asset: AssetMetadata): asset is NativeAsset {
	return asset.type === 'native'
}

export function getTokenByChainId(chainId: string) {
	return assets.filter(isTokenAsset).filter(asset => asset.chainId === chainId)
}

export function getNativeCurrencyByChainId(chainId: string) {
	const match = assets.filter(asset => asset.chainId === chainId).find(isNativeAsset)
	if (match === undefined) throw new Error(`Could not find the native currency for ${chainId}`)
	return match
}

export function getAssetMetadata(chainId: string, address?: string) {
	if (address === undefined) {
		const match = assets.find(asset => asset.chainId === chainId && asset.type === 'native')
		if (match === undefined) throw new Error('Specified asset is unsupported')
		return match
	}

	const match = assets.find(asset => asset.chainId === chainId && asset.type === 'token' && asset.address === address)
	if (match === undefined) throw new Error('Specified asset is unsupported')
	return match
}
