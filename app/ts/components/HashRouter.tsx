import { FunctionalComponent, VNode } from 'preact'
import { useEffect, useState } from 'preact/hooks'

export type RouteProps = {
	path: string
	component: FunctionalComponent
}

export const Route = ({ component: Component }: RouteProps) => <Component />

export type RouterProps = {
	children: object[]
	onHashChange?: (event: Event) => void
}

export const Router = ({ children, onHashChange }: RouterProps) => {
	const [activeRoute, setActiveRoute] = useState(getActiveRoute())

	function getActiveRoute() {
		return children.filter(isRouteComponent).find((child) => matchPattern(stripLeadingSlash(child.props.path), window.location.hash))
	}

	useOnHashChange((event: Event) => {
		setActiveRoute(getActiveRoute())
		onHashChange?.(event)
	})

	return <main>{activeRoute}</main>
}

function useOnHashChange(handler?: (event: Event) => void) {
	useEffect(() => {
		if (!handler || typeof handler !== 'function') return
		window.addEventListener('hashchange', handler)
		return () => window.removeEventListener('hashchange', handler)
	}, [])
}

function isRouteComponent(child: object): child is VNode<Parameters<typeof Route>[0]> {
	return 'props' in child && typeof child.props === 'object' && child.props !== null && 'path' in child.props && typeof child.props.path === 'string'
}

function stripLeadingSlash(urlString: string) {
	return urlString.charAt(0) !== '/' ? urlString : urlString.substring(1)
}

function matchPattern(pattern: string, str: string): boolean {
	const patternParts = pattern.split('/')
	const strParts = str.split('/')

	if (patternParts.length !== strParts.length) return false

	for (let i = 0; i < patternParts.length; i++) {
		const patternPart = patternParts[i]
		const strPart = strParts[i]
		if (patternPart.startsWith(':')) continue
		if (patternPart !== strPart) return false
	}

	return true
}
