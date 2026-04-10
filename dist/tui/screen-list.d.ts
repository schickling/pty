import type { SessionInfo } from "../sessions.ts";
import type { KeyEvent } from "./input.ts";
export interface ListAction {
    type: "attach" | "create" | "quit" | "none";
    session?: SessionInfo;
}
export interface ListState {
    sessions: SessionInfo[];
    filterText: string;
    selectedIndex: number;
    termWidth: number;
    termHeight: number;
}
export declare function createListState(sessions: SessionInfo[], termWidth: number, termHeight: number): ListState;
export declare function updateSessions(state: ListState, sessions: SessionInfo[]): void;
export declare function sortSessions(sessions: SessionInfo[]): SessionInfo[];
export declare function shortPath(p: string): string;
export declare function timeAgo(date: Date): string;
export declare function handleListKey(state: ListState, key: KeyEvent): ListAction;
export declare function renderList(state: ListState): string;
