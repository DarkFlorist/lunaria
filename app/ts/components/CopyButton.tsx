import { useSignal, useSignalEffect } from '@preact/signals'
import { ComponentChild } from 'preact'
import * as Icon from './Icon/index.js'

type CopyButtonProps = {
	value: string
	label: ComponentChild
}

export const CopyButton = ({ value, label }: CopyButtonProps) => {
	const isCopied = useSignal(false)

	const handleClick = async () => {
		await navigator.clipboard.writeText(value)
		isCopied.value = true
	}

	useSignalEffect(() => {
		if (isCopied.value !== true) return
		setTimeout(() => {
			isCopied.value = false
		}, 1000)
	})

	if (isCopied.value) {
		return (
			<button type='button' class='text-xs text-white/30 bg-white/10 px-2 py-1 uppercase whitespace-nowrap flex items-center gap-1' onClick={handleClick} disabled>
				<span>Copied!</span>
				<Icon.Check />
			</button>
		)
	}

	return (
		<button type='button' class='text-xs text-white/50 bg-white/10 px-2 py-1 uppercase whitespace-nowrap flex items-center focus:text-white hover:text-white' onClick={handleClick}>
			{label}
		</button>
	)
}
