import { BigNumber, Contract, ethers } from 'ethers'

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

export interface ERC20 extends Contract {
	balanceOf(address: string): Promise<BigNumber>
	totalSupply(): Promise<BigNumber>
	transfer(to: string, value: BigNumber): Promise<TransactionResponse>
	transferFrom(from: string, to: string, value: BigNumber): Promise<boolean>
	approve(spender: string, value: BigNumber): Promise<boolean>
	allowance(owner: string, spender: string): Promise<BigNumber>
	name(): Promise<string>
	symbol(): Promise<string>
	decimals(): Promise<number>
}

export type TransferTransactionResponse = TransactionResponse & {
	to: string
}
