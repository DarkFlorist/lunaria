export async function sleep(milliseconds: number) {
	await new Promise((resolve) => setTimeout(resolve, milliseconds))
}

/**
 * Combine JSX element class attributes
 *
 * JSX Example:
 * 	<div class={weave('button', isPrimary && 'button--primary')}>
 */

export function weave(...strings: (string | boolean | undefined)[]) {
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
