import { ethers } from 'ethers'
import { ExternalProvider, Web3Provider } from '../types'

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
export function isExternalProvider(ethereum: unknown): ethereum is ExternalProvider {
	return ethereum !== null && ethereum !== undefined && typeof ethereum === 'object'
}

export function assertsExternalProvider(ethereum: unknown): asserts ethereum is ExternalProvider {
	if (!isExternalProvider(ethereum)) throw new Error('Ethereum object does not exist')
}

export type ObservableEthereum = {
	on(eventName: string | symbol, listener: (...args: any[]) => void): void
}

export function isEthereumObservable(ethereum: unknown): ethereum is ObservableEthereum {
	return ethereum instanceof Object && 'on' in ethereum && typeof ethereum.on === 'function'
}

export function assertsEthereumObservable(ethereum: unknown): asserts ethereum is ObservableEthereum {
	if (!isEthereumObservable(ethereum)) throw new Error('Ethereum object is not observable')
}

export function assertUnreachable(value: never): never {
	throw new Error(`Unexpected code execution (${value})`)
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

export function isWeb3Provider(provider: unknown): provider is Web3Provider {
	return (
		provider !== null &&
		typeof provider === 'object' &&
		// provider functions that matter
		'send' in provider &&
		typeof provider.send === 'function' &&
		'getBalance' in provider &&
		typeof provider.getBalance === 'function' &&
		'sendTransaction' in provider &&
		typeof provider.sendTransaction === 'function' &&
		'getTransaction' in provider &&
		typeof provider.getTransaction === 'function' &&
		'waitForTransaction' in provider &&
		typeof provider.waitForTransaction === 'function'
	)
}

export function assertsWeb3Provider(provider: unknown): asserts provider is Web3Provider {
	if (!isWeb3Provider(provider)) throw new Error('Could not connect to compatible ethereum provider.')
}
