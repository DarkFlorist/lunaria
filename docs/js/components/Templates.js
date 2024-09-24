import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useComputed, useSignal } from '@preact/signals';
import { formatEther, formatUnits } from 'ethers';
import { useTokenManager } from '../context/TokenManager.js';
import { useTemplates } from '../context/TransferTemplates.js';
import { removeNonStringsAndTrim } from '../library/utilities.js';
import * as Icon from './Icon/index.js';
export const Templates = () => {
    const manage = useSignal(false);
    const { cache: templatesCache } = useTemplates();
    const { cache: tokensCache } = useTokenManager();
    const templates = useComputed(() => templatesCache.value.data);
    const getCachedToken = (contractAddress) => tokensCache.value.data.find(token => token.address === contractAddress);
    if (templates.value.length < 1)
        return (_jsxs("div", { class: 'pl-4 mb-4', children: [_jsx("div", { class: 'flex justify-between', children: _jsx("div", { class: 'text-white/30 text-sm mb-2', children: "Saved Transfers" }) }), _jsx("div", { class: 'border border-white/30 border-dashed px-4 py-3', children: _jsx("p", { class: 'text-white/50 text-sm', children: "Tip: You can save completed transfers so you don't have to fill out the form everytime." }) })] }));
    return (_jsxs("div", { class: 'pl-4 mb-4', children: [_jsxs("div", { class: 'flex justify-between', children: [_jsx("div", { class: 'text-white/30 text-sm mb-2', children: "Saved Transfers" }), _jsx("button", { class: 'text-xs mb-2 uppercase', onClick: () => (manage.value = !manage.value), children: manage.value ? 'done' : 'manage' })] }), _jsx("div", { class: 'grid gap-2', children: templates.value.map((template, index) => {
                    const token = template.contractAddress && getCachedToken(template.contractAddress);
                    const amount = token ? formatUnits(template.quantity, token.decimals) : formatEther(template.quantity);
                    return (_jsxs("a", { class: removeNonStringsAndTrim('grid gap-2 items-center bg-white/10 px-4 py-3', manage.value ? 'grid-cols-[min-content,minmax(0,1fr),min-content]' : 'grid-cols-1 hover:bg-white/30'), href: `#saved/${index}`, children: [_jsx(MoveUpButton, { show: manage.value === true, template: template, index: index }), _jsxs("div", { class: 'grid gap-2 grid-cols-[auto,minmax(0,1fr)] items-center', children: [token ? _jsx("img", { class: 'w-8 h-8', src: `/img/${token.address.toLowerCase()}.svg` }) : _jsx("img", { class: 'w-8 h-8', src: `/img/ethereum.svg` }), _jsxs("div", { class: 'text-left', children: [_jsx("div", { children: template.label }), _jsxs("div", { class: 'overflow-hidden text-ellipsis whitespace-nowrap text-sm text-white/50', children: [amount, " ", token ? token.symbol : 'ETH', " to ", template.to] })] })] }), _jsx(RemoveButton, { show: manage.value === true, index: index })] }));
                }) })] }));
};
const MoveUpButton = (props) => {
    const { cache } = useTemplates();
    const templates = useComputed(() => cache.value.data);
    const swapIndex = (indexA, indexB) => {
        // ignore same indices swap
        if (indexA === indexB)
            return;
        const orderedTemplates = [...templates.value];
        const tempA = orderedTemplates[indexA];
        orderedTemplates[indexA] = orderedTemplates[indexB];
        orderedTemplates[indexB] = tempA;
        cache.value = { ...cache.peek(), data: orderedTemplates };
    };
    if (!props.show)
        return _jsx(_Fragment, {});
    if (props.index === 0)
        return _jsx("div", {});
    return (_jsx("button", { class: 'text-lg', onClick: () => swapIndex(props.index, props.index - 1), children: _jsx(Icon.ArrowUp, {}) }));
};
const RemoveButton = (props) => {
    const { cache } = useTemplates();
    const remove = (index) => {
        const newData = [...cache.value.data.slice(0, index), ...cache.value.data.slice(index + 1)];
        cache.value = { ...cache.peek(), data: newData };
    };
    if (!props.show)
        return _jsx(_Fragment, {});
    return (_jsx("button", { class: 'text-sm', onClick: () => remove(props.index), children: _jsx(Icon.Xmark, {}) }));
};
//# sourceMappingURL=Templates.js.map