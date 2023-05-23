import { signal, useComputed } from "@preact/signals";
import { ComponentChildren, JSX } from "preact";
import { useEffect } from "preact/hooks";

type RouteProps = {
	path: string
	children: ComponentChildren
}

export const Route = ({ children }: RouteProps) => <>{children}</>

type RouterModel = {
	activeRoute: JSX.Element[] | JSX.Element
	params: { [key: string]: string | undefined } | undefined
} | {
	activeRoute: undefined
	params: undefined
}

const router = signal<RouterModel>({ activeRoute: undefined, params: undefined })

export const Router = ({ children }: { children: unknown | unknown[] }) => {

	const getValidChildren = () => {
		if (!Array.isArray(children)) {
			router.value = { activeRoute: isRouteComponent(children) ? children : <></>, params: undefined }
			return
		}

		const routeChildrenOnly = children.filter(isRouteComponent)
		for (const child of routeChildrenOnly) {
			const pathMatch = matchPathToLocation(child.props.path, window.location.hash)
			if (pathMatch === null) continue
			router.value = { activeRoute: child, params: pathMatch }
		}
	}

	useEffect(() => {
		getValidChildren()
		window.addEventListener('hashchange', getValidChildren)
		return () => window.removeEventListener('hashchange', getValidChildren)
	}, [])

	return <>{router.value.activeRoute}</>
}

export function useRouter<T extends { [key: string]: string }>() {
	return useComputed(() => ({ activeRoute: router.value.activeRoute, params: router.value.params as T }))
}

const stripLeadingSlash = (path: string) => {
	return path.startsWith('/') ? path.slice(1) : path
}

function isRouteComponent(child: unknown): child is ReturnType<typeof Route> {
	return child !== null && typeof child === 'object' && 'props' in child && child.props !== null && typeof child.props === 'object' && 'path' in child.props
}

export function matchPathToLocation(pattern: string, location: string) {
	const patternSegments: string[] = stripLeadingSlash(pattern).split('/');
	const locationSegments: string[] = stripLeadingSlash(location).split('/');

	const params: { [key: string]: string | undefined } = {};

	for (const [index, patternSegment] of patternSegments.entries()) {
		const locationSegment = locationSegments[index];

		if (patternSegment.startsWith(':')) {
			const variableName = patternSegment.slice(1);
			params[variableName] = locationSegment || undefined;
		} else if (patternSegment !== locationSegment) {
			return null;
		}
	}

	return params;
}
