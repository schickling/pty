/** Parse a key spec like `ctrl+c`, `return`, `alt+x` into bytes. */
export declare function resolveKey(spec: string): string;
/** If value starts with `key:`, resolve the key name; otherwise return the literal string. */
export declare function parseSeqValue(value: string): string;
