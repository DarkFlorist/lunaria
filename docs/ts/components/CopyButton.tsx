import { useSignal, useSignalEffect } from '@preact/signals'
import { ComponentChild, JSX } from 'preact'
import { useNotification } from '../context/Notification.js'
import * as Icon from './Icon/index.js'

type CopyButtonProps = {
	value: string
	withLabel?: boolean
	// for deprecation: use `withLabel` to display text label
	label?: ComponentChild
}

export const CopyButton = ({ value, label, withLabel }: CopyButtonProps) => {
	const isCopied = useSignal(false)
	const { notify } = useNotification()
	const hasLabel = label || withLabel

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

	useSignalEffect(() => {
		if (!isCopied.value) return
		notify({ message: 'Copied information may contain private data.', title: 'Copied text to clipboard' })
	})

	if (isCopied.value) {
		return <Button onClick={handleClick} disabled><Icon.Check /> {hasLabel ? <span>copied! </span> : <></>} </Button>
	}

	return <Button onClick={handleClick}><Icon.Copy />{hasLabel ? <span>copy </span> : <></>}</Button>
}

const Button = ({ children, ...props }: JSX.HTMLAttributes<HTMLButtonElement>) => {
	return (
		<button type='button' title='Copy' class='text-xs text-white/50 bg-white/10 px-3 h-8 uppercase whitespace-nowrap flex gap-1 items-center focus:text-white hover:text-white hover:bg-white/20 disabled:text-white/30 disabled:hover:text-white/30' { ...props }>
			{children}
		</button>
	)
}
