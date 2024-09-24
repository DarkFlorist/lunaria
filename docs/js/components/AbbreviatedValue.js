import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { bigintToNumberFormatParts } from '../library/bigint.utils.js';
export const AbbreviatedValue = ({ amount, decimals = 18n }) => {
    const numberParts = bigintToNumberFormatParts(amount, decimals);
    const domElement = [];
    for (const [type, value] of numberParts) {
        if (type === 'fraction') {
            const significantDigits = `${Number(value)}`;
            const zeroPad = value.replace(significantDigits, '');
            if (zeroPad.length) {
                domElement.push(_jsxs(_Fragment, { children: [_jsx("small", { children: zeroPad }), significantDigits] }));
                continue;
            }
        }
        domElement.push([value]);
    }
    return _jsx(_Fragment, { children: domElement });
};
//# sourceMappingURL=AbbreviatedValue.js.map