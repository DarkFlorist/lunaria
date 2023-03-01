import { ComponentChildren } from 'preact'
import { getRandomNumberBetween, removeNonStringsAndTrim } from '../library/utilities.js'

export type AsyncTextProps = {
	placeholderLength?: number
	children?: ComponentChildren
	class?: string
}

export const AsyncText = ({ placeholderLength = getRandomNumberBetween(10, 20), children, class: classNames }: AsyncTextProps) => {
	const classes = removeNonStringsAndTrim('text-empty', classNames)
	return (
		<span class={classes} data-placeholder={'0'.repeat(placeholderLength)}>
			{children}
		</span>
	)
}
