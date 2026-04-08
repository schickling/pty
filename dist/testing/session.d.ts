import { PtyServer } from "../server.ts";
import type { Screenshot, SpawnOptions, ServerOptions } from "./types.ts";
export declare class Session {
    private terminal;
    private serialize;
    private backend;
    private _rows;
    private _cols;
    private constructor();
    /**
     * Spawn a process in a direct PTY. Use this for testing CLI tools, TUI apps,
     * or any process where you send input and check screen output.
     *
     * ```typescript
     * const session = Session.spawn("node", ["--experimental-strip-types", "my-app.ts"], { rows: 30, cols: 100 });
     * await session.waitForText("Ready");
     * session.press("ctrl+c");
     * await session.close();
     * ```
     */
    static spawn(command: string, args?: string[], opts?: SpawnOptions): Session;
    /**
     * Create a persistent session backed by a PtyServer. Use this when testing
     * detach/reattach behavior, multiple clients, or resize. Call `attach()`
     * after creation to start receiving output.
     */
    static server(command: string, args?: string[], opts?: ServerOptions): Promise<Session>;
    /**
     * Create a second client connected to the same server as an existing session.
     * Use this to test multi-client scenarios (e.g., two terminals attached to
     * the same process).
     */
    static connectToExisting(existing: Session, opts?: {
        rows?: number;
        cols?: number;
    }): Promise<Session>;
    /** Current terminal height in rows. */
    get rows(): number;
    /** Current terminal width in columns. */
    get cols(): number;
    /** Whether the process has exited. Server-mode only; always false for spawn-mode. */
    get hasExited(): boolean;
    /** The PtyServer instance (server-mode only). */
    get server(): PtyServer;
    /** The session name (server-mode only). */
    get name(): string;
    /** Send raw keystrokes to the process. Use for literal text or escape sequences. */
    sendKeys(keys: string): void;
    /**
     * Send a named key. Supports modifiers: `"ctrl+c"`, `"alt+x"`, `"shift+a"`.
     * See docs/testing.md for the full list of key names.
     */
    press(keyName: string): void;
    /** Send text to the process. Alias for `sendKeys()`. */
    type(text: string): void;
    /** Capture the current terminal state. Returns plain text lines, joined text, and ANSI output. */
    screenshot(): Screenshot;
    /** Poll until the terminal contains the given text. Returns the matching screenshot. */
    waitForText(text: string, timeoutMs?: number): Promise<Screenshot>;
    /** Poll until the terminal no longer contains the given text. */
    waitForAbsent(text: string, timeoutMs?: number): Promise<Screenshot>;
    /** Poll until a custom predicate returns true. The `description` is used in timeout error messages. */
    waitFor(predicate: (ss: Screenshot) => boolean, timeoutMs?: number, description?: string): Promise<Screenshot>;
    /** Start receiving output from the server. Required after `Session.server()`. Server-mode only. */
    attach(): Promise<void>;
    /** Simulate a detach + reattach cycle. Destroys the socket, resets the terminal, and reconnects. Server-mode only. */
    reconnect(): Promise<void>;
    /** Resize the terminal. Server-mode only. */
    resize(rows: number, cols: number): void;
    /** Clean up the session. Kills the process (spawn) or destroys the socket and server (server). Always call this in `afterEach`. */
    close(): Promise<void>;
    private connectSocket;
}
