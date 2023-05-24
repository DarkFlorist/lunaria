import { FunctionalComponent, toChildArray, VNode } from 'preact'
import { signal } from '@preact/signals'
import { useEffect } from 'preact/hooks'

type RouteProps = { path: string; component: FunctionalComponent }
type RouterProps = {
	children: VNode<RouteProps> | VNode<RouteProps>[]
}

type HistoryStateProxyHandler = ProxyHandler<typeof history.pushState | typeof history.replaceState>
type RouterState = {
	pathname: string
}

const routerState = signal<RouterState>({ pathname: location.pathname })

export const Router = ({ children }: RouterProps) => {
	useEffect(() => {
		const handler: HistoryStateProxyHandler = {
			apply: (target, thisArg, argArray) => {
				const applied = target.apply(thisArg, argArray as Parameters<typeof target>)
				// set router routerState on history change
				routerState.value = { ...routerState.value, pathname: argArray[2] }
				return applied
			},
		}

		// listen for changes from pushState
		history.pushState = new Proxy(history.pushState, handler)

		// listen for changes from replaceState
		history.replaceState = new Proxy(history.replaceState, handler)

		const handlePopState = (event: PopStateEvent) => {
			routerState.value = {
				...routerState.value,
				pathname: (event.state as RouterState)?.pathname || '/',
			}
		}

		// listen for forward and back button interaction
		addEventListener('popstate', handlePopState)
		return () => removeEventListener('popstate', handlePopState)
	}, [])

	const childrenArray = toChildArray(children) as VNode<RouteProps>[]
	const visibleChildren = childrenArray.filter(child => child.props.path === routerState.value.pathname)

	return <>{visibleChildren}</>
}

export const Route = ({ component: Component }: RouteProps) => <Component />

export function useRoute() {
	const navigate = (pathname: string, replace?: boolean, skipRender?: boolean) => {
		if (pathname === location.pathname) return

		if (replace) {
			history.replaceState({ pathname, skipRender }, '', pathname)
			return
		}

		history.pushState({ pathname, skipRender }, '', pathname)
	}

	return {
		router: routerState,
		navigate,
	}
}

type RedirectProps = { to: string; replace?: boolean }
export const Redirect = ({ to, replace = true }: RedirectProps) => {
	const { navigate } = useRoute()
	navigate(to, replace)
	return null
}
