import { effect as preactEffect, batch as preactBatch } from "@preact/signals-core";
export interface Signal<T> {
    get(): T;
    set(value: T): void;
    peek(): T;
}
export declare function signal<T>(initial: T): Signal<T>;
export declare function computed<T>(fn: () => T): {
    get(): T;
};
export { preactEffect as effect, preactBatch as batch };
