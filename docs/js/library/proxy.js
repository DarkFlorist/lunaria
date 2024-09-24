export function createOnChangeProxy(onChange, target) {
    for (const key in target) {
        const item = target[key];
        if (!isMutableObject(item))
            continue;
        target[key] = createOnChangeProxy(onChange, item);
    }
    return new Proxy(target, createProxyHandler(onChange));
}
function createProxyHandler(onChange) {
    return {
        set: (object, property, newValue) => {
            ;
            object[property] = typeof newValue === 'object' ? createOnChangeProxy(onChange, newValue) : newValue;
            onChange();
            return true;
        },
    };
}
function isMutableObject(maybe) {
    if (maybe === null)
        return false;
    if (maybe instanceof Date)
        return false;
    // TODO: filter out any other special cases we can find, where something identifies as an `object` but is effectively immutable for our use cases
    return typeof maybe === 'object';
}
//# sourceMappingURL=proxy.js.map