import { ethers } from 'ethers'

export async function sleep(milliseconds: number) {
	await new Promise((resolve) => setTimeout(resolve, milliseconds))
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
			.map((i) => (i as string).trim())
			// combine strings separated by spaces
			.join(' ')
	)
}

/**
 * Check string for valid address format
 */
export function assertsAddress(string: string): asserts string is `0x${string}` {
	if (!/^0x[0-9A-Fa-f]{40}$/.test(string)) throw new Error(`Invalid address ${string}`)
}

export function isAddress(string: string): string is `0x${string}` {
	return /^0x[0-9A-Fa-f]{40}$/.test(string)
}

/**
 * Describe a window ethereum object
 */
type ExternalProvider = ethers.providers.ExternalProvider
export function assertsExternalProvider(ethereum: unknown): asserts ethereum is ExternalProvider {
	if (ethereum === null || ethereum === undefined || typeof ethereum !== 'object') throw new Error('Ethereum object does not exist')
}

export type EthereumWithListeners = {
	on(eventName: string | symbol, listener: (...args: any[]) => void): void
}

export function isEthereumObservable(ethereum: unknown): ethereum is EthereumWithListeners {
	return ethereum instanceof Object && 'on' in ethereum && typeof ethereum.on === 'function'
}
