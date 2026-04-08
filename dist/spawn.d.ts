export interface SpawnDaemonOptions {
    name: string;
    command: string;
    args: string[];
    displayCommand: string;
    cwd?: string;
    ephemeral?: boolean;
    rows?: number;
    cols?: number;
}
export declare function spawnDaemon(options: SpawnDaemonOptions): Promise<void>;
export declare function waitForSocket(name: string, timeoutMs: number, earlyCheck?: () => void): Promise<void>;
export declare function resolveCommand(cmd: string): string;
