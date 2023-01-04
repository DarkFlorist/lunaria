import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'

export const Redirect = ({ to }: { to: string }) => {
	useEffect(() => {
		route(to, true)
	}, [])

	return null
}
