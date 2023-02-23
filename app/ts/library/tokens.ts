export type TokenMetaData = {
	address: string
	data: {
		name: string
		symbol: string
		decimals: number
	}
	logoUri?: string
}

export const tokenData: Record<'mainnet' | 'goerli', TokenMetaData[]> = {
	mainnet: [
		{
			address: '0x4c9bbfc1fbd93dfb509e718400978fbeedf590e9',
			data: {
				name: 'Rai',
				symbol: 'RAI',
				decimals: 18,
			},
		},
		{
			address: '0x6b175474e89094c44da98b954eedeac495271d0f',
			data: {
				name: 'Dai',
				symbol: 'DAI',
				decimals: 18,
			},
		},
		{
			address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			data: {
				name: 'WETH',
				symbol: 'WETH',
				decimals: 18,
			},
		},
		{
			address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			data: {
				name: 'USD Coin',
				symbol: 'USDC',
				decimals: 6,
			},
		},
		{
			address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
			data: {
				name: 'Wrapped Bitcoin',
				symbol: 'WBTC',
				decimals: 8,
			},
		},
	],
	goerli: [
		{
			address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
			data: {
				name: 'WETH',
				symbol: 'WETH',
				decimals: 18,
			},
		},
		{
			address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
			data: {
				name: 'USD Coin',
				symbol: 'USDC',
				decimals: 6,
			},
		},
	],
}
