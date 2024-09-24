import { ComponentChildren, ComponentType } from 'preact';
type Panel = {
    target: Element;
    isIntersecting: boolean;
};
type Panels = {
    nav: Panel | undefined;
    main: Panel | undefined;
};
export declare const Root: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare const Navigation: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare const Main: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
export declare const Header: ({ children }: {
    children: ComponentChildren;
}) => import("preact").JSX.Element;
type HeaderNavProps = {
    text?: string;
    onClick: () => void;
    show?: boolean;
    iconLeft?: ComponentType;
    iconRight?: ComponentType;
};
export declare const HeaderNav: (props: HeaderNavProps) => import("preact").JSX.Element;
export declare function usePanels(): Panels;
export {};
//# sourceMappingURL=index.d.ts.map