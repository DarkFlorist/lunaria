import { signal } from '@preact/signals'
import { FunctionalComponent, VNode } from 'preact'
import { useEffect } from 'preact/hooks'

export type RouteProps = {
	path: string
	component: FunctionalComponent
}

export const Route = ({ component: Component }: RouteProps) => <Component />

export type RouterProps = {
	children: object[]
	onHashChange?: (event: Event) => void
}

const activeRoute = signal<VNode<RouteProps> | undefined>(undefined)

export const Router = ({ children, onHashChange }: RouterProps) => {
	function getActiveRoute() {
		return children.filter(isRouteComponent).find(child => matchPattern(child.props.path, window.location.hash))
	}

	activeRoute.value = getActiveRoute()

	useHashChangeEffect((event: Event) => {
		activeRoute.value = getActiveRoute()
		onHashChange?.(event)
	})

	return <main>{activeRoute.value}</main>
}

export function useParams() {
	if (!activeRoute.value) return
	return matchPath(activeRoute.value.props.path, window.location.hash)
}

function useHashChangeEffect(handler: (event: Event) => void) {
	useEffect(() => {
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
	const patternParts = stripLeadingSlash(pattern).split('/')
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

function matchPath(pattern: string, path: string): { [key: string]: string } | null {
	const patternParts = stripLeadingSlash(pattern).split('/')
	const pathParts = path.split('/')

	if (patternParts.length !== pathParts.length) {
		return null
	}

	return patternParts.reduce((params, part, index) => {
		return part.startsWith(':') ? { ...params, [part.slice(1)]: pathParts[index] } : params
	}, {} as { [key: string]: string })
}
