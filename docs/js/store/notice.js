import { computed, signal } from '@preact/signals';
const notices = signal([]);
const nextId = computed(() => notices.value.length + 1);
export function useNotice() {
    const notify = (notice) => {
        notices.value = [{ ...notice, id: nextId.value }, ...notices.peek()];
    };
    return { notices, notify };
}
//# sourceMappingURL=notice.js.map