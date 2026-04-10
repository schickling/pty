export interface ServerOptions {
    name: string;
    command: string;
    args: string[];
    displayCommand: string;
    cwd: string;
    rows: number;
    cols: number;
    onExit?: (code: number) => void;
}
export interface ProcessResources {
    rssKb: number;
    cpuPercent: number;
}
export declare class PtyServer {
    private terminal;
    private serialize;
    private ptyProcess;
    private socketServer;
    private clients;
    private exited;
    private exitCode;
    private name;
    private options;
    private attachCounter;
    private sgrMouseMode;
    private cursorHidden;
    private kittyKeyboardStack;
    private lastResizeTime;
    private eventWriter;
    private lastTitle;
    readonly ready: Promise<void>;
    constructor(options: ServerOptions);
    private handleClient;
    private getModePrefix;
    private collectStats;
    /** Resize the PTY to the smallest dimensions across all connected writable clients.
     *  Returns true if the size actually changed. */
    private negotiateSize;
    /** Briefly resize the PTY by 1 column and back to trigger SIGWINCH,
     *  forcing the child to do a complete redraw. The xterm-headless terminal
     *  is resized in sync so its buffer stays correct. */
    private nudgeRedraw;
    private emitEvent;
    private broadcast;
    private getPlainScreen;
    private getLastLines;
    private saveExitMetadata;
    /** Clean up resources. Does not call process.exit(). */
    close(): Promise<void>;
}
