import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useComputed, useSignal, useSignalEffect } from '@preact/signals';
import { toQuantity } from 'ethers';
import { useTemplates } from '../context/TransferTemplates.js';
import { extractERC20TransferRequest } from '../library/ethereum.js';
import { serialize, TransferRequest, TransferTemplate } from '../schema.js';
import { useTransaction } from './TransactionProvider.js';
export const TemplateRecorder = () => {
    const { response, receipt } = useTransaction();
    const { add } = useTemplates();
    const isSaved = useSignal(false);
    const templateDraft = useSignal(undefined);
    const erc20TransferTemplate = useComputed(() => {
        if (receipt.value.state !== 'resolved' || receipt.value.value === null)
            return;
        const erc20TransferRequest = extractERC20TransferRequest(receipt.value.value);
        if (erc20TransferRequest === undefined)
            return;
        const parsed = TransferRequest.safeParse(erc20TransferRequest);
        const label = templateDraft.peek()?.label;
        return parsed.success ? { ...parsed.value, label } : undefined;
    });
    const ethTransferTemplate = useComputed(() => {
        if (response.value.state !== 'resolved' || response.value.value === null)
            return;
        const { to, from, value } = response.value.value;
        const parsed = TransferRequest.safeParse({ to, from, quantity: toQuantity(value) });
        return parsed.success ? { label: templateDraft.peek()?.label, ...parsed.value } : undefined;
    });
    useSignalEffect(() => {
        // Update draft with values coming from transaction
        templateDraft.value = erc20TransferTemplate.value || ethTransferTemplate.value;
    });
    const saveTemplate = () => {
        if (!templateDraft.value)
            return;
        const serialized = serialize(TransferTemplate, templateDraft.value);
        const template = TransferTemplate.parse(serialized);
        add(template);
        isSaved.value = true;
    };
    // Activate form only after the transaction receipt is resolved
    if (receipt.value.state !== 'resolved')
        return _jsx(_Fragment, {});
    if (isSaved.value === true)
        return _jsx(TemplateAddConfirmation, {});
    return _jsx(AddTemplateForm, { formData: templateDraft, onSubmit: saveTemplate });
};
const AddTemplateForm = ({ formData, onSubmit }) => {
    const submitForm = (e) => {
        e.preventDefault();
        onSubmit();
    };
    const updateLabel = (event) => {
        event.preventDefault();
        const templateData = formData.peek();
        if (!templateData)
            return;
        formData.value = { ...templateData, label: event.currentTarget.value };
    };
    return (_jsxs("div", { class: 'my-4', children: [_jsx("div", { class: 'font-bold text-2xl mb-2', children: "Save Transfer" }), _jsx("div", { class: 'border border-dashed border-white/30 p-4', children: _jsxs("div", { class: 'flex flex-col md:flex-row-reverse items-center gap-4', children: [_jsx("div", { class: 'shrink w-full', children: _jsx("p", { class: 'text-white/50 text-sm', children: "Prevent accidental inputs by saving this transfer so you can quickly do this again later. Add a label to this transfer and hit save to continue." }) }), _jsx("form", { class: 'w-full', onSubmit: submitForm, children: _jsxs("div", { class: 'grid gap-2 items-center w-full', children: [_jsx("input", { class: 'border border-white/30 px-4 py-2 bg-transparent outline-none min-w-auto', type: 'text', value: formData.value?.label, onInput: updateLabel, placeholder: 'Add a label (optional)' }), _jsx("button", { type: 'submit', class: 'border border-white/50 bg-white/10 px-4 py-3 outline-none focus:bg-white/20 hover:bg-white/20', children: "Save" })] }) })] }) })] }));
};
const TemplateAddConfirmation = () => {
    return (_jsx("div", { class: 'my-4', children: _jsx("div", { class: 'border border-dashed border-lime-400/40 bg-lime-400/5 p-4', children: _jsxs("div", { class: 'flex items-center justify-left gap-2', children: [_jsx("svg", { width: '60', height: '60', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', children: _jsxs("g", { fill: 'none', fillRule: 'evenodd', children: [_jsx("path", { d: 'M0 0h24v24H0z' }), _jsx("circle", { stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', cx: '12', cy: '12', r: '9' }), _jsx("path", { d: 'm8.5 12.5 1.651 2.064a.5.5 0 0 0 .744.041L15.5 10', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' })] }) }), _jsxs("div", { children: [_jsx("div", { class: 'font-bold text-lg', children: "Transfer Saved!" }), _jsx("div", { class: 'text-white/50 leading-tight', children: "This transfer was added to the sidebar so you can use it as a starting point for your next transfer." })] })] }) }) }));
};
//# sourceMappingURL=TemplateRecorder.js.map