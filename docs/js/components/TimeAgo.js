import { jsx as _jsx } from "preact/jsx-runtime";
import { useComputed, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
export const TimeAgo = ({ since }) => {
    const timeNow = useSignal(Date.now());
    const secondsApart = useComputed(() => (timeNow.value - since) / 1000);
    useEffect(() => {
        const age = setInterval(() => {
            timeNow.value = Date.now();
        }, 1000);
        return () => clearInterval(age);
    }, []);
    return _jsx("div", { children: formatTimeSince(secondsApart.value) });
};
const formatTimeSince = (seconds) => {
    if (seconds <= 15)
        return 'Just now';
    if (seconds <= 60)
        return 'Less than a minute ago';
    if (seconds <= 3600)
        return 'Less than an hour ago';
    if (seconds <= 86400)
        return 'Earlier today';
    return `Around ${Math.floor(seconds / 86400)} days ago`;
};
//# sourceMappingURL=TimeAgo.js.map