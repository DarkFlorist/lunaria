import { ethers } from "ethers"

export function bigintToRoundedPrettyDecimalString(value: bigint, power: bigint, significantNumbers = 4): string {
	const numberParts = bigintToNumberFormatParts(value, power, significantNumbers)
	let decimalString = ''

	for (const { type, value } of numberParts) {
		// convert American to Metric suffix
		if (type === 'compact') {
			if (value === 'K') decimalString += 'k'
			if (value === 'B') decimalString += 'G'
		}
		decimalString += value
	}

	return decimalString
}

export const bigintToNumberFormatParts = (amount: bigint, decimals = 18n, maximumSignificantDigits = 4) => {
	const formatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits, notation: 'compact' })
	const floatValue = Number(ethers.formatUnits(amount, decimals))
	// Typescript only accepts numbers as parameters for `formatToParts`, generally a string is also accepted
	return formatter.formatToParts(Number(floatValue))
}
