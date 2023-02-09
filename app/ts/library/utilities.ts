import { ethers } from 'ethers'

export async function sleep(milliseconds: number) {
	await new Promise(resolve => setTimeout(resolve, milliseconds))
}

/**
 * Combine JSX element class attributes
 *
 * JSX Example:
 * 	<div class={weave('button', isPrimary && 'button--primary')}>
 */

export function removeNonStringsAndTrim(...strings: (string | boolean | undefined)[]) {
	return (
		strings
			// remove non-string
			.filter(Boolean)
			// remove leading and  trailing whitespaces
			.map(i => (i as string).trim())
			// combine strings separated by spaces
			.join(' ')
	)
}

/**
 * Describe a window ethereum object
 */
type ExternalProvider = ethers.providers.ExternalProvider
export function assertsExternalProvider(ethereum: unknown): asserts ethereum is ExternalProvider {
	if (ethereum === null || ethereum === undefined || typeof ethereum !== 'object') throw new Error('Ethereum object does not exist')
}

export function isExternalProvider(ethereum: unknown): ethereum is ExternalProvider {
	return ethereum !== null && ethereum !== undefined && typeof ethereum === 'object'
}

export type EthereumWithListeners = {
	on(eventName: string | symbol, listener: (...args: any[]) => void): void
}

export function isEthereumObservable(ethereum: unknown): ethereum is EthereumWithListeners {
	return ethereum instanceof Object && 'on' in ethereum && typeof ethereum.on === 'function'
}

export function assertUnreachable(value: never): never {
	throw new Error(`Never gonna give you up (${value})`)
}

export function isTransactionHash(hash: string): hash is `0x${string}` {
	return ethers.utils.hexDataLength(hash) === 32
}

export function assertsTransactionHash(hash: string): asserts hash is `0x${string}` {
	if (!isTransactionHash(hash)) throw new Error('Invalid transaction hash')
}

export const calculateGasFee = (effectiveGasPrice: ethers.BigNumber, gasUsed: ethers.BigNumber) => {
	const gasFeeBigNum = effectiveGasPrice.mul(gasUsed)
	const gasFee = ethers.utils.formatEther(gasFeeBigNum)
	return gasFee
}
