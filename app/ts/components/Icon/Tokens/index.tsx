import { useSignal } from '@preact/signals'
import { JSX } from 'preact'
import { useEffect } from 'preact/hooks'
import { AssetMetadata } from '../../../library/constants'

export const TokenIcon = ({ assetMetadata }: { assetMetadata: AssetMetadata | undefined }) => {
	const component = useSignal<JSX.Element | undefined>(undefined)

	const getTokenIcon = async () => {
		if (assetMetadata === undefined) {
			component.value = undefined
			return
		}

		const path = assetMetadata.type === 'token' ? `./${assetMetadata.address}.js` : `./Native.js`
		const module = await import(path)
		component.value = module.default()
	}

	useEffect(() => {
		getTokenIcon()
	}, [])

	if (component.value === undefined) return <div class='animate-pulse bg-white/50 rounded-full' style={{ width: '1em', height: '1em' }} />

	return component.value
}
