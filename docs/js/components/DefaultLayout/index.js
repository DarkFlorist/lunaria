import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useRef } from 'preact/hooks';
import { signal } from '@preact/signals';
const panelsObserver = signal(undefined);
const panels = signal({ nav: undefined, main: undefined });
export const Root = ({ children }) => {
    const rootRef = useRef(null);
    const onIntersect = entries => {
        entries.map(entry => (panels.value = { ...panels.value, [entry.target.id]: entry }));
    };
    useEffect(() => {
        const options = { root: rootRef.current, rootMargin: '0px', threshold: 0.9 };
        panelsObserver.value = new IntersectionObserver(onIntersect, options);
        return () => panelsObserver.value?.disconnect();
    }, [rootRef.current]);
    return (_jsx("div", { ref: rootRef, class: 'grid grid-cols-[75vw,100vw] sm:grid-cols-[40vw,100vw] md:grid-cols-[35vw,100vw] lg:grid-cols-[2fr,5fr] h-full snap-mandatory snap-x overflow-y-hidden scrollbar-hidden', children: children }));
};
export const Navigation = ({ children }) => {
    const elementRef = useRef(null);
    useEffect(() => {
        const element = elementRef.current;
        const observer = panelsObserver.value;
        if (element === null || observer === undefined)
            return;
        observer.observe(element);
        return () => observer.unobserve(element);
    }, [elementRef.current, panelsObserver.value]);
    return (_jsx("div", { id: 'nav', ref: elementRef, class: 'overflow-x-hidden snap-start scrollbar-hidden', children: children }));
};
export const Main = ({ children }) => {
    const elementRef = useRef(null);
    useEffect(() => {
        if (elementRef.current === null || panelsObserver.value === undefined)
            return;
        panelsObserver.value.observe(elementRef.current);
    }, [elementRef.current, panelsObserver.value]);
    return (_jsx("div", { id: 'main', ref: elementRef, class: 'overflow-x-hidden overflow-y-scroll snap-start scrollbar-hidden', children: children }));
};
export const Header = ({ children }) => {
    return _jsx("div", { class: 'sticky top-0 bg-black/50 lg:hidden', children: children });
};
export const HeaderNav = (props) => {
    const LeftIcon = props.iconLeft || (() => _jsx(_Fragment, {}));
    const RightIcon = props.iconRight || (() => _jsx(_Fragment, {}));
    const NavText = (() => _jsx(_Fragment, { children: props.text })) || (() => _jsx(_Fragment, {}));
    return (_jsxs("button", { class: `px-4 h-12 flex items-center gap-2 transition-opacity duration-500 ${props.show ? `opacity-1` : `opacity-0 pointer-events-none`}`, onClick: props.onClick, children: [_jsx(LeftIcon, {}), _jsx(NavText, {}), _jsx(RightIcon, {})] }));
};
export function usePanels() {
    return panels.value;
}
//# sourceMappingURL=index.js.map