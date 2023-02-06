import { removeNonStringsAndTrim } from '../library/utilities.js'

type TextSkeletonProps = {
	length?: number
	textSize?: 'xs' | 'sm' | 'md'
}

export const TextSkeleton = ({ length = 10, textSize = 'md' }: TextSkeletonProps) => {
	const lineHeightMap = { xs: 'h-4', sm: 'h-5', md: 'h-6' }
	const textHeightMap = { xs: 'h-3', sm: 'h-3.5', md: 'h-4' }
	const lineClasses = removeNonStringsAndTrim('flex items-center', lineHeightMap[textSize])
	const textClasses = removeNonStringsAndTrim('w-full bg-white/30 animate-pulse rounded', textHeightMap[textSize])

	return (
		<div class={lineClasses}>
			<div class={textClasses} style={{ maxWidth: `${length}ch` }}></div>
		</div>
	)
}
