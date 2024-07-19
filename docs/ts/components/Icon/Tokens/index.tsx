import { useSignal } from '@preact/signals'
import { JSX } from 'preact'
import { useEffect } from 'preact/hooks'

export const TokenIcon = ({ address }: { address?: string }) => {
	const component = useSignal<JSX.Element | undefined>(undefined)

	const getTokenIcon = async () => {
		const path = address === undefined ? './Native.js' : `./${address}.js`
		const module = await import(path)
		component.value = module.default()
	}

	useEffect(() => {
		getTokenIcon()
	}, [])

	if (component.value === undefined) return <div class='animate-pulse bg-white/50 rounded-full' style={{ width: '1em', height: '1em' }} />

	return component.value
}
