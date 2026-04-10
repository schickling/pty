import * as net from "node:net";
import xterm from "@xterm/headless";
import xtermSerialize from "@xterm/addon-serialize";
import * as pty from "node-pty";
import { PtyServer } from "../server.js";
import { MessageType, PacketReader, encodeAttach, encodeData, encodeResize, } from "../protocol.js";
import { getSocketPath } from "../sessions.js";
import { resolveKey } from "../keys.js";
import { captureScreenshot } from "./screenshot.js";
let nameCounter = 0;
function autoName() {
    return `test-${process.pid}-${Date.now()}-${++nameCounter}`;
}
export class Session {
    terminal;
    serialize;
    backend;
    _rows;
    _cols;
    constructor(terminal, serialize, backend, rows, cols) {
        this.terminal = terminal;
        this.serialize = serialize;
        this.backend = backend;
        this._rows = rows;
        this._cols = cols;
    }
    // ── Factories ──
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
    static spawn(command, args = [], opts = {}) {
        const rows = opts.rows ?? 24;
        const cols = opts.cols ?? 80;
        const terminal = new xterm.Terminal({
            rows,
            cols,
            scrollback: 10000,
            allowProposedApi: true,
        });
        const serialize = new xtermSerialize.SerializeAddon();
        terminal.loadAddon(serialize);
        const env = {
            ...process.env,
            ...opts.env,
        };
        delete env.PTY_SERVER_CONFIG;
        const proc = pty.spawn(command, args, {
            name: "xterm-256color",
            cols,
            rows,
            cwd: opts.cwd ?? process.cwd(),
            env,
        });
        proc.onData((data) => {
            terminal.write(data);
        });
        const backend = { kind: "spawn", ptyProcess: proc };
        return new Session(terminal, serialize, backend, rows, cols);
    }
    /**
     * Create a persistent session backed by a PtyServer. Use this when testing
     * detach/reattach behavior, multiple clients, or resize. Call `attach()`
     * after creation to start receiving output.
     */
    static async server(command, args = [], opts = {}) {
        const rows = opts.rows ?? 24;
        const cols = opts.cols ?? 80;
        const name = opts.name ?? autoName();
        const server = new PtyServer({
            name,
            command,
            args,
            displayCommand: command,
            cwd: opts.cwd ?? process.cwd(),
            rows,
            cols,
        });
        await server.ready;
        const terminal = new xterm.Terminal({
            rows,
            cols,
            scrollback: 10000,
            allowProposedApi: true,
        });
        const serialize = new xtermSerialize.SerializeAddon();
        terminal.loadAddon(serialize);
        const backend = {
            kind: "server",
            server,
            ownsServer: true,
            socket: null,
            reader: null,
            screenCallbacks: [],
            exitCode: null,
            name,
        };
        const session = new Session(terminal, serialize, backend, rows, cols);
        await session.connectSocket();
        return session;
    }
    /**
     * Create a second client connected to the same server as an existing session.
     * Use this to test multi-client scenarios (e.g., two terminals attached to
     * the same process).
     */
    static async connectToExisting(existing, opts = {}) {
        if (existing.backend.kind !== "server") {
            throw new Error("connectToExisting() requires a server-mode session");
        }
        const rows = opts.rows ?? existing._rows;
        const cols = opts.cols ?? existing._cols;
        const terminal = new xterm.Terminal({
            rows,
            cols,
            scrollback: 10000,
            allowProposedApi: true,
        });
        const serialize = new xtermSerialize.SerializeAddon();
        terminal.loadAddon(serialize);
        const backend = {
            kind: "server",
            server: existing.backend.server,
            ownsServer: false,
            socket: null,
            reader: null,
            screenCallbacks: [],
            exitCode: null,
            name: existing.backend.name,
        };
        const session = new Session(terminal, serialize, backend, rows, cols);
        await session.connectSocket();
        return session;
    }
    // ── Properties ──
    /** Current terminal height in rows. */
    get rows() {
        return this._rows;
    }
    /** Current terminal width in columns. */
    get cols() {
        return this._cols;
    }
    /** Whether the process has exited. Server-mode only; always false for spawn-mode. */
    get hasExited() {
        if (this.backend.kind === "server") {
            return this.backend.exitCode !== null;
        }
        return false;
    }
    /** The PtyServer instance (server-mode only). */
    get server() {
        if (this.backend.kind !== "server") {
            throw new Error("server is only available in server mode");
        }
        return this.backend.server;
    }
    /** The session name (server-mode only). */
    get name() {
        if (this.backend.kind !== "server") {
            throw new Error("name is only available in server mode");
        }
        return this.backend.name;
    }
    // ── Input ──
    /** Send raw keystrokes to the process. Use for literal text or escape sequences. */
    sendKeys(keys) {
        if (this.backend.kind === "spawn") {
            this.backend.ptyProcess.write(keys);
        }
        else {
            this.backend.socket.write(encodeData(keys));
        }
    }
    /**
     * Send a named key. Supports modifiers: `"ctrl+c"`, `"alt+x"`, `"shift+a"`.
     * See docs/testing.md for the full list of key names.
     */
    press(keyName) {
        this.sendKeys(resolveKey(keyName));
    }
    /** Send text to the process. Alias for `sendKeys()`. */
    type(text) {
        this.sendKeys(text);
    }
    // ── Screen ──
    /** Capture the current terminal state. Returns plain text lines, joined text, and ANSI output. */
    screenshot() {
        return captureScreenshot(this.terminal, this.serialize);
    }
    // ── Waiting ──
    /** Poll until the terminal contains the given text. Returns the matching screenshot. */
    async waitForText(text, timeoutMs = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            await new Promise((r) => setTimeout(r, 50));
            const ss = this.screenshot();
            if (ss.text.includes(text))
                return ss;
        }
        const ss = this.screenshot();
        throw new Error(`Timed out after ${timeoutMs}ms waiting for "${text}".\nScreen:\n${ss.text}`);
    }
    /** Poll until the terminal no longer contains the given text. */
    async waitForAbsent(text, timeoutMs = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            await new Promise((r) => setTimeout(r, 50));
            const ss = this.screenshot();
            if (!ss.text.includes(text))
                return ss;
        }
        const ss = this.screenshot();
        throw new Error(`Timed out after ${timeoutMs}ms waiting for "${text}" to disappear.\nScreen:\n${ss.text}`);
    }
    /** Poll until a custom predicate returns true. The `description` is used in timeout error messages. */
    async waitFor(predicate, timeoutMs = 5000, description = "predicate") {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            await new Promise((r) => setTimeout(r, 50));
            const ss = this.screenshot();
            if (predicate(ss))
                return ss;
        }
        const ss = this.screenshot();
        throw new Error(`Timed out after ${timeoutMs}ms waiting for ${description}.\nScreen:\n${ss.text}`);
    }
    // ── Server-mode only ──
    /** Start receiving output from the server. Required after `Session.server()`. Server-mode only. */
    async attach() {
        if (this.backend.kind !== "server") {
            throw new Error("attach() is only available in server mode");
        }
        const backend = this.backend;
        const screenPromise = new Promise((resolve) => {
            const timer = setTimeout(resolve, 5000);
            backend.screenCallbacks.push(() => {
                clearTimeout(timer);
                resolve();
            });
        });
        backend.socket.write(encodeAttach(this._rows, this._cols));
        await screenPromise;
    }
    /** Simulate a detach + reattach cycle. Destroys the socket, resets the terminal, and reconnects. Server-mode only. */
    async reconnect() {
        if (this.backend.kind !== "server") {
            throw new Error("reconnect() is only available in server mode");
        }
        this.backend.socket.destroy();
        await new Promise((r) => setTimeout(r, 100));
        this.terminal.reset();
        await this.connectSocket();
        await this.attach();
    }
    /** Resize the terminal. Server-mode only. */
    resize(rows, cols) {
        if (this.backend.kind !== "server") {
            throw new Error("resize() is only available in server mode");
        }
        this._rows = rows;
        this._cols = cols;
        this.backend.socket.write(encodeResize(rows, cols));
        this.terminal.resize(cols, rows);
    }
    // ── Lifecycle ──
    /** Clean up the session. Kills the process (spawn) or destroys the socket and server (server). Always call this in `afterEach`. */
    async close() {
        if (this.backend.kind === "spawn") {
            try {
                this.backend.ptyProcess.kill();
            }
            catch { }
            this.terminal.dispose();
        }
        else {
            this.backend.socket.destroy();
            this.terminal.dispose();
            if (this.backend.ownsServer) {
                await this.backend.server.close();
            }
        }
    }
    // ── Private ──
    async connectSocket() {
        if (this.backend.kind !== "server")
            return;
        const backend = this.backend;
        backend.reader = new PacketReader();
        backend.screenCallbacks = [];
        backend.exitCode = null;
        backend.socket = await new Promise((resolve, reject) => {
            const s = net.createConnection(getSocketPath(backend.name));
            s.on("connect", () => resolve(s));
            s.on("error", reject);
        });
        backend.socket.on("data", (data) => {
            const packets = backend.reader.feed(data);
            for (const packet of packets) {
                switch (packet.type) {
                    case MessageType.SCREEN:
                        this.terminal.reset();
                        this.terminal.write(packet.payload.toString(), () => {
                            const cbs = backend.screenCallbacks;
                            backend.screenCallbacks = [];
                            for (const cb of cbs)
                                cb();
                        });
                        break;
                    case MessageType.DATA:
                        this.terminal.write(packet.payload.toString());
                        break;
                    case MessageType.EXIT:
                        backend.exitCode = packet.payload.readInt32BE(0);
                        break;
                }
            }
        });
    }
}
