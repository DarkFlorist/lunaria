import { JSX } from 'preact/jsx-runtime'
import { removeNonStringsAndTrim } from '../../library/utilities.js'
import { AsyncText } from '../AsyncText.js'
import { CopyButton } from '../CopyButton.js'
import * as Icon from '../Icon/index.js'

export type InfoProps = {
	label: string
	value: string
	prefix?: string
	suffix?: string
	allowCopy?: boolean
	icon?: () => JSX.Element
}

export const Info = (props: InfoProps) => {
	const { label, value, prefix = '', suffix = '', allowCopy, icon } = props

	const Icon = () => (icon === undefined ? <></> : icon())

	return (
		<div class={removeNonStringsAndTrim('grid gap-4 items-center px-4 py-2 border border-white/20 min-w-0', icon === undefined ? ' grid-cols-[1fr,auto]' : 'grid-cols-[auto,1fr,auto]')}>
			<Icon />
			<div>
				<div class='text-sm text-white/50'>{label}</div>
				<div class='overflow-hidden text-ellipsis whitespace-nowrap'>{`${prefix}${value}${suffix}`}</div>
			</div>
			{allowCopy ? <CopyButton value={value} label='Copy' /> : <></>}
		</div>
	)
}

export const InfoPending = () => {
	return (
		<div class='grid px-4 py-2 border border-white/20 min-w-0'>
			<AsyncText class='text-sm' placeholderLength={8} />
			<AsyncText placeholderLength={40} />
		</div>
	)
}

type InfoError = {
	displayText: string
	message: string
}

export const InfoError = (props: InfoError) => {
	const { displayText, message } = props
	return (
		<div class='grid grid-cols-[1fr,auto] items-center px-4 py-2 border border-white/20 min-w-0'>
			<div>
				<div class='overflow-hidden text-ellipsis whitespace-nowrap'>{displayText}</div>
				<div class='text-sm text-white/50'>Hover over the icon for more information.</div>
			</div>
			<div title={message}>
				<Icon.Info />
			</div>
		</div>
	)
}
