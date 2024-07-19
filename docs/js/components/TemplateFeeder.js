import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
import { useComputed, useSignalEffect } from "@preact/signals";
import { formatUnits } from "ethers";
import { useTokenManager } from "../context/TokenManager.js";
import { useTransfer } from "../context/Transfer.js";
import { useTemplates } from "../context/TransferTemplates.js";
import { useRouter } from "./HashRouter.js";
export const TemplateFeeder = () => {
    const templates = useTemplates();
    const tokens = useTokenManager();
    const router = useRouter();
    const transfer = useTransfer();
    const activeTemplate = useComputed(() => {
        const templateIdFromParams = router.value.params.template_id;
        if (templateIdFromParams === undefined)
            return;
        const templateId = parseInt(templateIdFromParams);
        return templates.cache.peek().data.at(templateId);
    });
    const selectedToken = useComputed(() => {
        const tokensCache = tokens.cache.value.data;
        if (activeTemplate.value === undefined)
            return;
        const templateContractAddress = activeTemplate.value.contractAddress;
        return tokensCache.find(token => token.address === templateContractAddress);
    });
    const feedTemplateToTransferInput = () => {
        const tmpl = activeTemplate.value;
        if (tmpl === undefined)
            return;
        const amount = formatUnits(tmpl.quantity, selectedToken.value?.decimals);
        transfer.input.value = { to: tmpl.to, amount, token: selectedToken.value };
    };
    useSignalEffect(feedTemplateToTransferInput);
    return _jsx(_Fragment, {});
};
//# sourceMappingURL=TemplateFeeder.js.map