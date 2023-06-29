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

