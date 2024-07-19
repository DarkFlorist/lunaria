export async function sleep(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}
/**
 * Combine JSX element class attributes
 *
 * JSX Example:
 * 	<div class={weave('button', isPrimary && 'button--primary')}>
 */
export function removeNonStringsAndTrim(...strings) {
    return (strings
        // remove non-string
        .filter(Boolean)
        // remove leading and  trailing whitespaces
        .map(i => i.trim())
        // combine strings separated by spaces
        .join(' '));
}
/**
 * Generate a number within a number range
 */
export function getRandomNumberBetween(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}
export function assertUnreachable(value) {
    throw new Error(`Unexpected code execution (${value})`);
}
export function JSONStringify(object) {
    return JSON.stringify(object, (_, value) => (typeof value === 'bigint' ? `0x${value.toString(16)}n` : value));
}
export function JSONParse(jsonString) {
    return JSON.parse(jsonString, (_, value) => {
        return typeof value === 'string' && /^0x[a-fA-F0-9]+n$/.test(value) ? BigInt(value.slice(0, -1)) : value;
    });
}
/**
 * Checks if a search string can be found within the source string
 */
export function stringIncludes(source, search, caseSensitive) {
    if (caseSensitive)
        return source.includes(search);
    return source.toLowerCase().includes(search.toLowerCase());
}
export function preventFocus(e) {
    e.currentTarget.blur();
}
/**
 * Match string equality
 */
export function areEqualStrings(a, b, caseSensitive) {
    if (caseSensitive)
        return a === b;
    return a.toLowerCase() === b.toLowerCase();
}
//# sourceMappingURL=utilities.js.map