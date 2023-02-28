import { useSignal } from '@preact/signals'
import { JSX } from 'preact'
import { useEffect } from 'preact/hooks'

export const TokenIcon = ({ address }: { address: string }) => {
	const component = useSignal<JSX.Element | undefined>(undefined)

	const getTokenIcon = async () => {
		const path = `./${address}.js`
		const module = await import(path)
		component.value = module.default()
	}

	useEffect(() => {
		getTokenIcon()
	}, [])

	if (component.value === undefined) return <></>
	return component.value
}
