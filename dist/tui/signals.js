// Reactive signals — wraps @preact/signals-core with .get()/.set() API
import { signal as preactSignal, computed as preactComputed, effect as preactEffect, batch as preactBatch, } from "@preact/signals-core";
export function signal(initial) {
    const s = preactSignal(initial);
    return {
        get() { return s.value; },
        set(value) { s.value = value; },
        peek() { return s.peek(); },
    };
}
export function computed(fn) {
    const c = preactComputed(fn);
    return {
        get() { return c.value; },
    };
}
export { preactEffect as effect, preactBatch as batch };
