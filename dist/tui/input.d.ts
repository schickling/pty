export interface KeyEvent {
    name: string;
    char?: string;
    ctrl: boolean;
    alt: boolean;
}
export declare function parseKey(data: Buffer): KeyEvent[];
