import { Contract, Eip1193Provider, TransactionResponse } from 'ethers'

declare global {
	interface Window {
		ethereum?: Eip1193Provider
	}
}

export type HexString = `0x${string}`

export interface ERC20 extends Contract {
	balanceOf(address: string): Promise<BigInt>
	totalSupply(): Promise<BigInt>
	transfer(to: string, value: BigInt): Promise<TransactionResponse>
	transferFrom(from: string, to: string, value: BigInt): Promise<boolean>
	approve(spender: string, value: BigInt): Promise<boolean>
	allowance(owner: string, spender: string): Promise<BigInt>
	name(): Promise<string>
	symbol(): Promise<string>
	decimals(): Promise<number>
}

// makes a single property optional
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
