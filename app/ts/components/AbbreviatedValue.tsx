import { parseNumericTerm } from '../library/utilities.js'

export const AbbreviatedValue = ({ floatValue }: { floatValue: number }) => {
	const { coefficient, exponent } = parseNumericTerm(floatValue)

	if (exponent < 0) {
		const leadingZeros = Math.abs(exponent) - 1
		return <>0.<small>{'0'.repeat(leadingZeros)}</small>{coefficient}</>
	}

	const prefixes = ['', 'k', 'M', 'G']
	const prefix = prefixes[Math.floor(exponent/3)]
	const displayValue = coefficient.toFixed(3)

	return <>{displayValue}{prefix}</>
}
