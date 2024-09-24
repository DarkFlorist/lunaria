import { jsx as _jsx } from "preact/jsx-runtime";
import { removeNonStringsAndTrim } from '../library/utilities.js';
export const AsyncText = ({ placeholderLength = 8, children, class: classNames }) => {
    const classes = removeNonStringsAndTrim('text-empty', classNames);
    return (_jsx("span", { class: classes, "data-placeholder": '0'.repeat(placeholderLength), children: children }));
};
//# sourceMappingURL=AsyncText.js.map