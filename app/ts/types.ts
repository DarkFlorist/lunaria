import { ethers } from 'ethers'

export type Web3Provider = ethers.providers.Web3Provider
export type ExternalProvider = ethers.providers.ExternalProvider
export type TransactionResponse = ethers.providers.TransactionResponse
export type Network = ethers.providers.Network
export type TransactionReceipt = ethers.providers.TransactionReceipt

declare global {
	interface Window {
		ethereum?: ExternalProvider
	}
}

export type HexString = `0x${string}`
