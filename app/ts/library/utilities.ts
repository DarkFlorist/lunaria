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
 * Validate string is a valid address format
 */

export function assertIsAddress(address: string): asserts address is `0x${string}` {
	if (!/^0x[0-9A-Fa-f]{40}$/.test(address)) throw new Error(`Invalid address ${address}`)
}

/**
 * Localstorage cache
 */

export type LocalCache<T> = { value: T | null; remove: () => void }
export function localCache<T>(id: string, defaultValue?: T): LocalCache<T> {
	return {
		get value() {
			let storageItem = localStorage.getItem(id)

			if (storageItem) {
				return JSON.parse(storageItem)
			}

			if (defaultValue) {
				const value = JSON.stringify(defaultValue)
				localStorage.setItem(id, JSON.parse(value))
				return value
			}
		},
		set value(v) {
			localStorage.setItem(id, JSON.stringify(v))
		},
		remove() {
			localStorage.removeItem(id)
		},
	}
}
