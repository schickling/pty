import type { KeyEvent } from "./input.ts";
export interface CreateAction {
    type: "create" | "cancel" | "none";
    dir?: string;
    name?: string;
    command?: string;
}
export type CreateStep = "dir-initial" | "dir-browse" | "name-command";
export interface CreateState {
    step: CreateStep;
    selectedIndex: number;
    cwdPath: string;
    browsePath: string;
    browseFilter: string;
    name: string;
    command: string;
    focusedField: "name" | "command";
    termWidth: number;
    termHeight: number;
    existingNames: Set<string>;
}
export declare function createCreateState(termWidth: number, termHeight: number, existingNames: string[]): CreateState;
export declare function dedupName(base: string, existing: Set<string>): string;
export declare function listDirs(dirPath: string, filter: string): string[];
export declare function handleCreateKey(state: CreateState, key: KeyEvent): CreateAction;
export declare function renderCreate(state: CreateState): string;
