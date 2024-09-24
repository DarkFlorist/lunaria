import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
import { toChildArray } from 'preact';
import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
const routerState = signal({ pathname: location.pathname });
export const Router = ({ children }) => {
    useEffect(() => {
        const handler = {
            apply: (target, thisArg, argArray) => {
                const applied = target.apply(thisArg, argArray);
                // set router routerState on history change
                routerState.value = { ...routerState.value, pathname: argArray[2] };
                return applied;
            },
        };
        // listen for changes from pushState
        history.pushState = new Proxy(history.pushState, handler);
        // listen for changes from replaceState
        history.replaceState = new Proxy(history.replaceState, handler);
        const handlePopState = (event) => {
            routerState.value = {
                ...routerState.value,
                pathname: event.state?.pathname || '/',
            };
        };
        // listen for forward and back button interaction
        addEventListener('popstate', handlePopState);
        return () => removeEventListener('popstate', handlePopState);
    }, []);
    const childrenArray = toChildArray(children);
    const visibleChildren = childrenArray.filter(child => child.props.path === routerState.value.pathname);
    return _jsx(_Fragment, { children: visibleChildren });
};
export const Route = ({ component: Component }) => _jsx(Component, {});
export function useRoute() {
    const navigate = (pathname, replace, skipRender) => {
        if (pathname === location.pathname)
            return;
        if (replace) {
            history.replaceState({ pathname, skipRender }, '', pathname);
            return;
        }
        history.pushState({ pathname, skipRender }, '', pathname);
    };
    return {
        router: routerState,
        navigate,
    };
}
export const Redirect = ({ to, replace = true }) => {
    const { navigate } = useRoute();
    navigate(to, replace);
    return null;
};
//# sourceMappingURL=Router.js.map