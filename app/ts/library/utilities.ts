export async function sleep(milliseconds: number) {
	await new Promise((resolve) => setTimeout(resolve, milliseconds));
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
	);
}

/**
 * Shorted account address
 * Ex.
 * 		shortAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
 * 		--> '0xf39f...2266'
 */
export function shortAddress(address: string, mask: string = '***') {
	const start = address.slice(0, 6);
	const end = address.slice(-4);
	return address.length > 13 ? `${start}${mask}${end}` : address;
}
