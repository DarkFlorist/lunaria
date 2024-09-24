import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
import { signal, useComputed } from '@preact/signals';
import { useEffect } from 'preact/hooks';
export const Route = ({ children }) => _jsx(_Fragment, { children: children });
const router = signal({ activeRoute: undefined, params: undefined });
export const Router = ({ children }) => {
    const getValidChildren = () => {
        if (!Array.isArray(children)) {
            router.value = { activeRoute: isRouteComponent(children) ? children : _jsx(_Fragment, {}), params: undefined };
            return;
        }
        const routeChildrenOnly = children.filter(isRouteComponent);
        for (const child of routeChildrenOnly) {
            const pathMatch = matchPathToLocation(child.props.path, window.location.hash);
            if (pathMatch === undefined)
                continue;
            router.value = { activeRoute: child, params: pathMatch };
        }
    };
    useEffect(() => {
        getValidChildren();
        window.addEventListener('hashchange', getValidChildren);
        return () => window.removeEventListener('hashchange', getValidChildren);
    }, []);
    return _jsx(_Fragment, { children: router.value.activeRoute });
};
export function useRouter() {
    return useComputed(() => ({ activeRoute: router.value.activeRoute, params: router.value.params }));
}
const stripLeadingSlash = (path) => {
    return path.startsWith('/') ? path.slice(1) : path;
};
function isRouteComponent(child) {
    return child !== null && typeof child === 'object' && 'props' in child && child.props !== null && typeof child.props === 'object' && 'path' in child.props;
}
export function matchPathToLocation(pattern, location) {
    const patternSegments = stripLeadingSlash(pattern).split('/');
    const locationSegments = stripLeadingSlash(location).split('/');
    const params = {};
    for (const [index, patternSegment] of patternSegments.entries()) {
        const locationSegment = locationSegments[index];
        if (patternSegment.startsWith(':')) {
            const variableName = patternSegment.slice(1);
            params[variableName] = locationSegment || undefined;
        }
        else if (patternSegment !== locationSegment) {
            return undefined;
        }
    }
    return params;
}
//# sourceMappingURL=HashRouter.js.map