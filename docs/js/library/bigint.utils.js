import { ethers } from "ethers";
export const bigintToNumberFormatParts = (amount, decimals = 18n, maximumSignificantDigits = 4) => {
    const floatValue = Number(ethers.formatUnits(amount, decimals));
    let formatterOptions = { useGrouping: false, maximumFractionDigits: 3 };
    // maintain accuracy if value is a fraction of 1 ex 0.00001
    if (floatValue % 1 === floatValue)
        formatterOptions.maximumSignificantDigits = maximumSignificantDigits;
    // apply only compacting with prefixes for values >= 10k or values <= -10k
    if (Math.abs(floatValue) >= 1e4) {
        formatterOptions = { minimumFractionDigits: 0, notation: 'compact' };
    }
    const formatter = new Intl.NumberFormat('en-US', formatterOptions);
    const parts = formatter.formatToParts(floatValue);
    const partsMap = new Map();
    for (const part of parts) {
        if (part.type === 'compact') {
            // replace American format with Metric prefixes https://www.ibiblio.org/units/prefixes.html
            const prefix = part.value.replace('K', 'k').replace('B', 'G');
            partsMap.set(part.type, prefix);
            continue;
        }
        partsMap.set(part.type, part.value);
    }
    return partsMap;
};
export const bigintToRoundedPrettyDecimalString = (amount, decimals, maximumSignificantDigits = 4) => {
    const numberParts = bigintToNumberFormatParts(amount, decimals, maximumSignificantDigits);
    let numberString = '';
    for (const [_type, value] of numberParts)
        numberString += value;
    return numberString;
};
//# sourceMappingURL=bigint.utils.js.map