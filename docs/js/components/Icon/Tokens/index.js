import { jsx as _jsx } from "preact/jsx-runtime";
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
export const TokenIcon = ({ address }) => {
    const component = useSignal(undefined);
    const getTokenIcon = async () => {
        const path = address === undefined ? './Native.js' : `./${address}.js`;
        const module = await import(path);
        component.value = module.default();
    };
    useEffect(() => {
        getTokenIcon();
    }, []);
    if (component.value === undefined)
        return _jsx("div", { class: 'animate-pulse bg-white/50 rounded-full', style: { width: '1em', height: '1em' } });
    return component.value;
};
//# sourceMappingURL=index.js.map