import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
export const AbbreviatedValue = ({ floatValue }) => {
    const prefixes = [
        { value: 1e9, symbol: 'G' },
        { value: 1e6, symbol: 'M' },
        { value: 1e3, symbol: 'k' },
    ];
    for (const prefix of prefixes) {
        if (floatValue >= prefix.value) {
            return _jsx(_Fragment, { children: toFixedLengthDigits(floatValue / prefix.value) + prefix.symbol });
        }
    }
    // if value is a fraction of 1
    if (floatValue && floatValue % 1 === floatValue) {
        const [coefficient, exponent] = floatValue.toExponential().split('e');
        const leadingZerosCount = Math.abs(parseInt(exponent)) - 1;
        const significantDigits = coefficient.replace('.', '');
        return _jsxs(_Fragment, { children: ["0.", _jsx("small", { children: '0'.repeat(leadingZerosCount) }), significantDigits] });
    }
    return _jsx(_Fragment, { children: toFixedLengthDigits(floatValue) });
};
function toFixedLengthDigits(num, max = 5) {
    const formatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits: max, useGrouping: false });
    return formatter.format(num);
}
//# sourceMappingURL=AbbreviatedValue.js.map