import { EventEmitter } from "node:events";
export interface SessionConnectionOptions {
    name: string;
    rows: number;
    cols: number;
}
export interface SendDataOptions {
    name: string;
    data: string[];
    delayMs?: number;
}
export interface PeekScreenOptions {
    name: string;
    plain?: boolean;
}
/**
 * Programmatic bidirectional connection to a pty session.
 * Unlike the CLI `attach()`, this does not take over stdin/stdout
 * or call process.exit().
 *
 * Events:
 * - 'data' (data: string) — terminal output from the session
 * - 'screen' (screen: string) — initial screen replay on connect
 * - 'exit' (code: number) — session process exited
 * - 'close' () — connection closed
 * - 'error' (err: Error) — connection error
 */
export declare class SessionConnection extends EventEmitter {
    private socket;
    private reader;
    private _connected;
    private options;
    constructor(options: SessionConnectionOptions);
    get connected(): boolean;
    connect(): Promise<string>;
    write(data: string): void;
    press(key: string): void;
    resize(rows: number, cols: number): void;
    disconnect(): void;
}
/** Send data to a session. Promise-based alternative to the CLI send(). */
export declare function sendData(options: SendDataOptions): Promise<void>;
/** Get the current screen content. Promise-based alternative to the CLI peek(). */
export declare function peekScreen(options: PeekScreenOptions): Promise<string>;
