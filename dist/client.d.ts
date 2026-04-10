export declare const TERMINAL_SANITIZE: string;
export interface PeekOptions {
    name: string;
    follow?: boolean;
    plain?: boolean;
    onExit?: (code: number) => void;
    onDetach?: () => void;
}
/** Read-only view of a session. Input is ignored by the server. */
export declare function peek(options: PeekOptions): void;
export interface SendOptions {
    name: string;
    data: string[];
    delayMs?: number;
}
/** Send data to a session without attaching. Silent on success. */
export declare function send(options: SendOptions): void;
export interface ProcessResources {
    rssKb: number;
    cpuPercent: number;
}
export interface StatsResult {
    name: string;
    terminal: {
        cols: number;
        rows: number;
        cursorX: number;
        cursorY: number;
        scrollbackUsed: number;
        scrollbackCapacity: number;
    };
    process: {
        alive: boolean;
        exitCode: number | null;
        pid: number | null;
        resources: ProcessResources | null;
    };
    daemon: {
        pid: number;
        resources: ProcessResources | null;
    };
    clients: {
        total: number;
        attached: number;
        readOnly: number;
    };
    modes: {
        sgrMouse: boolean;
        cursorHidden: boolean;
        kittyKeyboard: boolean;
        kittyKeyboardFlags: number[];
    };
    uptimeSeconds: number | null;
    createdAt: string | null;
}
/** Query live stats from a running session. */
export declare function queryStats(name: string, timeoutMs?: number): Promise<StatsResult>;
export interface AttachOptions {
    name: string;
    onExit?: (code: number) => void;
    onDetach?: () => void;
}
export declare function attach(options: AttachOptions): void;
