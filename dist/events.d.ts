export declare const EventType: {
    readonly BELL: "bell";
    readonly TITLE_CHANGE: "title_change";
    readonly NOTIFICATION: "notification";
    readonly FOCUS_REQUEST: "focus_request";
    readonly CURSOR_VISIBLE: "cursor_visible";
};
export type EventType = (typeof EventType)[keyof typeof EventType];
export interface EventBase {
    session: string;
    type: EventType;
    ts: string;
}
export interface BellEvent extends EventBase {
    type: "bell";
}
export interface TitleChangeEvent extends EventBase {
    type: "title_change";
    value: string;
}
export interface NotificationEvent extends EventBase {
    type: "notification";
    title?: string;
    body?: string;
    source?: "osc9" | "osc99" | "osc777";
}
export interface FocusRequestEvent extends EventBase {
    type: "focus_request";
}
export interface CursorVisibleEvent extends EventBase {
    type: "cursor_visible";
}
export type EventRecord = BellEvent | TitleChangeEvent | NotificationEvent | FocusRequestEvent | CursorVisibleEvent;
/** Manages async, serialized writes to a session's events JSONL file. */
export declare class EventWriter {
    private chain;
    private appendCount;
    private name;
    constructor(name: string);
    /** Queue an event for writing. Returns immediately; I/O happens async. */
    append(event: EventRecord): void;
    /** Wait for all pending writes to complete. */
    flush(): Promise<void>;
}
export declare function clearEvents(name: string): void;
export declare function removeEvents(name: string): void;
export declare function readRecentEvents(name: string, count?: number): EventRecord[];
export interface FollowerOptions {
    names?: string[];
    onEvent: (event: EventRecord) => void;
}
export declare class EventFollower {
    private watchers;
    private dirWatcher;
    private options;
    constructor(options: FollowerOptions);
    start(): void;
    stop(): void;
    private watchFile;
    private readNewLines;
    private scanAndWatchAll;
}
export declare function formatEvent(event: EventRecord): string;
