import { ComponentChildren, JSX } from 'preact';
type RouteProps = {
    path: string;
    children: ComponentChildren;
};
export declare const Route: ({ children }: RouteProps) => JSX.Element;
export declare const Router: ({ children }: {
    children: unknown | unknown[];
}) => JSX.Element;
export declare function useRouter<T extends Partial<{
    [key: string]: string;
}>>(): import("@preact/signals-core").ReadonlySignal<{
    activeRoute: JSX.Element | JSX.Element[] | undefined;
    params: T;
}>;
export declare function matchPathToLocation(pattern: string, location: string): {
    [key: string]: string | undefined;
} | undefined;
export {};
//# sourceMappingURL=HashRouter.d.ts.map