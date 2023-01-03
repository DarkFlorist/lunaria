import { ethers } from 'ethers'

declare global {
	interface Window {
		ethereum?: ExternalProvider
	}
}

export type HexString = `0x${string}`

export type ExternalProvider = ethers.providers.ExternalProvider
