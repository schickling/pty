export declare function validateName(name: string): void;
export declare function getSessionDir(): string;
export declare function ensureSessionDir(): void;
export declare function getSocketPath(name: string): string;
export declare function getPidPath(name: string): string;
export declare function getMetadataPath(name: string): string;
export declare function getEventsPath(name: string): string;
export interface SessionMetadata {
    command: string;
    args: string[];
    displayCommand: string;
    cwd: string;
    createdAt: string;
    exitCode?: number;
    exitedAt?: string;
    lastLines?: string[];
}
export interface SessionInfo {
    name: string;
    socketPath: string;
    pid: number | null;
    status: "running" | "exited";
    metadata: SessionMetadata | null;
}
export declare function writeMetadata(name: string, metadata: SessionMetadata): void;
export declare function readMetadata(name: string): SessionMetadata | null;
export declare function listSessions(): Promise<SessionInfo[]>;
export declare function getSession(name: string): Promise<SessionInfo | null>;
/** Remove all exited sessions. Returns the names of removed sessions. */
export declare function gc(): Promise<string[]>;
/** Remove socket and pid files (but keep metadata). */
export declare function cleanupSocket(name: string): void;
/** Remove everything including metadata. */
export declare function cleanupAll(name: string): void;
/**
 * Acquire an exclusive lock for a session name. Prevents concurrent
 * `pty run` calls from racing to create the same session.
 * Returns true if acquired, false if another process holds it.
 */
export declare function acquireLock(name: string): boolean;
export declare function releaseLock(name: string): void;
export { cleanupSocket as cleanup };
