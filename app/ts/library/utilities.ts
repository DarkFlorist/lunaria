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

/**
 * Correctly parse an address returning a hex string
 * Ex.
 * 		parseAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
 * 		--> '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

 * 		parseAddress('invalid')
 * 		--> throws an error
 */
export function parseAddress(
	address: `0x${string}` | string | undefined
): `0x${string}` {
	if (!address || !address.match(/^0x[0-9A-Fa-f]{40}$/)) {
		throw new Error('Invalid Adress');
	}

	const unprefixedHex = address.substring(2);
	return `0x${unprefixedHex}`;
}

export type LocalCache<T> = { value: T | null; remove: () => void };
export function localCache<T>(id: string, defaultValue?: T): LocalCache<T> {
	return {
		get value() {
			let storageItem = localStorage.getItem(id);

			if (storageItem) {
				return JSON.parse(storageItem);
			}

			if (defaultValue) {
				const value = JSON.stringify(defaultValue);
				localStorage.setItem(id, JSON.parse(value));
				return value;
			}
		},
		set value(v) {
			localStorage.setItem(id, JSON.stringify(v));
		},
		remove() {
			localStorage.removeItem(id);
		},
	};
}

export class CustomJsonRpcError extends Error {
	transaction;
	error;
	code;

	constructor(error: any) {
		super(error);
		this.name = 'CustomJsonRpcError';
		this.code = error.code;
		this.error = error.error;
		this.transaction = error.transaction;
		Object.setPrototypeOf(this, CustomJsonRpcError.prototype);
	}
}
