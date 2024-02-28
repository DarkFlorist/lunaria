import { FunctionalComponent, VNode } from 'preact';
type RouteProps = {
    path: string;
    component: FunctionalComponent;
};
type RouterProps = {
    children: VNode<RouteProps> | VNode<RouteProps>[];
};
type RouterState = {
    pathname: string;
};
export declare const Router: ({ children }: RouterProps) => import("preact").JSX.Element;
export declare const Route: ({ component: Component }: RouteProps) => import("preact").JSX.Element;
export declare function useRoute(): {
    router: import("@preact/signals-core").Signal<RouterState>;
    navigate: (pathname: string, replace?: boolean, skipRender?: boolean) => void;
};
type RedirectProps = {
    to: string;
    replace?: boolean;
};
export declare const Redirect: ({ to, replace }: RedirectProps) => null;
export {};
//# sourceMappingURL=Router.d.ts.map