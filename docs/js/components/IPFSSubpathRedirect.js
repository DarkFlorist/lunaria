import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
import { CID } from 'multiformats';
import { useEffect } from 'preact/hooks';
export const IPFSSubpathRedirect = () => {
    function extractHashFromBasePath() {
        const htmlBase = document.querySelector('base');
        if (!htmlBase || !htmlBase.href.includes('/ipfs/'))
            return;
        const cidRegex = /\/ipfs\/(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})/;
        const [_, maybeCidMatch] = htmlBase.href.match(cidRegex) || [];
        return maybeCidMatch;
    }
    function generateIPFSRedirectUrl() {
        const cidFromPath = extractHashFromBasePath();
        if (!cidFromPath)
            return;
        const v1CidString = CID.parse(cidFromPath).toV1().toString();
        if (!v1CidString)
            return;
        return `${location.protocol}//${v1CidString}.ipfs.${location.host}`;
    }
    useEffect(() => {
        const redirectUrl = generateIPFSRedirectUrl();
        if (!redirectUrl)
            return;
        window.location.href = redirectUrl;
    }, []);
    return _jsx(_Fragment, {});
};
//# sourceMappingURL=IPFSSubpathRedirect.js.map