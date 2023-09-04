import { TokenMeta } from '../store/tokens'

export const DEFAULT_TOKENS: TokenMeta[] = [
	{
		chainId: 1n,
		address: '0x4c9BBFc1FbD93dFB509E718400978fbEedf590E9',
		name: 'Rai Reflex Index',
		symbol: 'RAI',
		decimals: 18n,
	},
	{
		chainId: 1n,
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		name: 'Dai',
		symbol: 'DAI',
		decimals: 18n,
	},
	{
		chainId: 1n,
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		name: 'Wrapped Ether',
		symbol: 'WETH',
		decimals: 18n,
	},
	{
		chainId: 1n,
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6n,
	},
	{
		chainId: 1n,
		address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
		name: 'Wrapped Bitcoin',
		symbol: 'WBTC',
		decimals: 8n,
	},
	{
		chainId: 5n,
		address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		name: 'Wrapped Ether',
		symbol: 'WETH',
		decimals: 18n,
	},
	{
		chainId: 5n,
		address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6n,
	},
]

export const STORAGE_KEY_RECENTS = 'txns'
export const MANAGED_TOKENS_CACHE_KEY = 'managed_tokens-v1'
