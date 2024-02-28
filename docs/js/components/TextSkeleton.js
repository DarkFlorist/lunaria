import { jsx as _jsx } from "preact/jsx-runtime";
import { removeNonStringsAndTrim } from '../library/utilities.js';
export const TextSkeleton = ({ length = 10, textSize = 'md' }) => {
    const lineHeightMap = { xs: 'h-4', sm: 'h-5', md: 'h-6' };
    const textHeightMap = { xs: 'h-3', sm: 'h-3.5', md: 'h-4' };
    const lineClasses = removeNonStringsAndTrim('flex items-center', lineHeightMap[textSize]);
    const textClasses = removeNonStringsAndTrim('w-full bg-white/30 animate-pulse rounded', textHeightMap[textSize]);
    return (_jsx("div", { class: lineClasses, children: _jsx("div", { class: textClasses, style: { maxWidth: `${length}ch` } }) }));
};
//# sourceMappingURL=TextSkeleton.js.map