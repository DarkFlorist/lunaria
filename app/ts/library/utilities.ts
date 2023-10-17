import { JSX } from 'preact/jsx-runtime'

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
 * Generate a number within a number range
 */

export function getRandomNumberBetween(from: number, to: number): number {
	return Math.floor(Math.random() * (to - from + 1)) + from
}

export function assertUnreachable(value: never): never {
	throw new Error(`Unexpected code execution (${value})`)
}

export function JSONStringify(object: Object) {
	return JSON.stringify(object, (_, value) => (typeof value === 'bigint' ? `0x${value.toString(16)}n` : value))
}

export function JSONParse(jsonString: string) {
	return JSON.parse(jsonString, (_, value) => {
		return typeof value === 'string' && /^0x[a-fA-F0-9]+n$/.test(value) ? BigInt(value.slice(0, -1)) : value
	})
}

/**
 * Checks if a search string can be found within the source string
 */
export function stringIncludes(source: string, search: string, caseSensitive?: boolean) {
	if (caseSensitive) return source.includes(search)
	return source.toLowerCase().includes(search.toLowerCase())
}

export function preventFocus(e: JSX.TargetedEvent<HTMLElement>) {
	e.currentTarget.blur()
}

/**
 * Match string equality
 */
export function areEqualStrings(a: string, b: string, caseSensitive?: true) {
	if (caseSensitive) return a === b
	return a.toLowerCase() === b.toLowerCase()
}

/**
 * Abbreviate huge numbers
 */
export function abbreviateNumber(num: number): string {
	const suffixes = ["", "K", "M", "B", "T", "Q"]
	const exponent = Math.floor(Math.log10(num) / 3)
	const shortValue = num / Math.pow(1000, exponent)
	const displayValue = shortValue.toFixed(1)
	const suffix = suffixes[exponent]
	return `${displayValue}${suffix}`
}
