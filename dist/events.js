import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import { getEventsPath, getSessionDir, ensureSessionDir } from "./sessions.js";
export const EventType = {
    BELL: "bell",
    TITLE_CHANGE: "title_change",
    NOTIFICATION: "notification",
    FOCUS_REQUEST: "focus_request",
    CURSOR_VISIBLE: "cursor_visible",
};
const MAX_LINES = 1000;
const KEEP_LINES = 500;
const TRUNCATE_CHECK_INTERVAL = 100;
/** Manages async, serialized writes to a session's events JSONL file. */
export class EventWriter {
    chain = Promise.resolve();
    appendCount = 0;
    name;
    constructor(name) {
        this.name = name;
    }
    /** Queue an event for writing. Returns immediately; I/O happens async. */
    append(event) {
        this.chain = this.chain
            .then(() => {
            const line = JSON.stringify(event) + "\n";
            return fsp.appendFile(getEventsPath(this.name), line);
        })
            .then(() => {
            this.appendCount++;
            if (this.appendCount >= TRUNCATE_CHECK_INTERVAL) {
                this.appendCount = 0;
                return truncate(getEventsPath(this.name));
            }
        })
            .catch(() => { });
    }
    /** Wait for all pending writes to complete. */
    flush() {
        return this.chain;
    }
}
async function truncate(filePath) {
    const content = await fsp.readFile(filePath, "utf-8");
    const lines = content.trimEnd().split("\n");
    if (lines.length >= MAX_LINES) {
        await fsp.writeFile(filePath, lines.slice(-KEEP_LINES).join("\n") + "\n");
    }
}
export function clearEvents(name) {
    ensureSessionDir();
    try {
        fs.writeFileSync(getEventsPath(name), "");
    }
    catch { }
}
export function removeEvents(name) {
    try {
        fs.unlinkSync(getEventsPath(name));
    }
    catch { }
}
export function readRecentEvents(name, count = 50) {
    try {
        const content = fs.readFileSync(getEventsPath(name), "utf-8");
        const lines = content.trimEnd().split("\n").filter((l) => l.length > 0);
        return lines.slice(-count).map((l) => JSON.parse(l));
    }
    catch {
        return [];
    }
}
export class EventFollower {
    watchers = new Map();
    dirWatcher = null;
    options;
    constructor(options) {
        this.options = options;
    }
    start() {
        if (this.options.names) {
            for (const name of this.options.names) {
                this.watchFile(name);
            }
        }
        else {
            this.scanAndWatchAll();
        }
    }
    stop() {
        for (const { watcher } of this.watchers.values()) {
            watcher.close();
        }
        this.watchers.clear();
        this.dirWatcher?.close();
        this.dirWatcher = null;
    }
    watchFile(name) {
        const filePath = getEventsPath(name);
        // Start at the end of the current file
        let offset = 0;
        try {
            offset = fs.statSync(filePath).size;
        }
        catch { }
        try {
            const watcher = fs.watch(filePath, () => {
                this.readNewLines(name, filePath);
            });
            this.watchers.set(name, { watcher, offset });
        }
        catch { }
    }
    readNewLines(name, filePath) {
        const entry = this.watchers.get(name);
        if (!entry)
            return;
        try {
            const stat = fs.statSync(filePath);
            if (stat.size < entry.offset) {
                // File was truncated — reset to beginning
                entry.offset = 0;
            }
            if (stat.size === entry.offset)
                return;
            const fd = fs.openSync(filePath, "r");
            const buf = Buffer.alloc(stat.size - entry.offset);
            fs.readSync(fd, buf, 0, buf.length, entry.offset);
            fs.closeSync(fd);
            entry.offset = stat.size;
            const chunk = buf.toString("utf-8");
            const lines = chunk.split("\n").filter((l) => l.length > 0);
            for (const line of lines) {
                try {
                    const event = JSON.parse(line);
                    this.options.onEvent(event);
                }
                catch { }
            }
        }
        catch { }
    }
    scanAndWatchAll() {
        const dir = getSessionDir();
        // Watch existing .events.jsonl files
        try {
            for (const entry of fs.readdirSync(dir)) {
                if (entry.endsWith(".events.jsonl")) {
                    const name = entry.replace(/\.events\.jsonl$/, "");
                    this.watchFile(name);
                }
            }
        }
        catch { }
        // Watch directory for new .events.jsonl files
        try {
            this.dirWatcher = fs.watch(dir, (_eventType, filename) => {
                if (filename &&
                    filename.endsWith(".events.jsonl") &&
                    !this.watchers.has(filename.replace(/\.events\.jsonl$/, ""))) {
                    const name = filename.replace(/\.events\.jsonl$/, "");
                    this.watchFile(name);
                }
            });
        }
        catch { }
    }
}
export function formatEvent(event) {
    const time = new Date(event.ts).toLocaleTimeString("en-US", {
        hour12: false,
    });
    const prefix = `[${time}] ${event.session}:`;
    switch (event.type) {
        case "bell":
            return `${prefix} bell`;
        case "title_change":
            return `${prefix} title -> "${event.value}"`;
        case "notification": {
            const parts = [prefix, "notification"];
            if (event.title)
                parts.push(`-- "${event.title}"`);
            if (event.body)
                parts.push(event.body);
            return parts.join(" ");
        }
        case "focus_request":
            return `${prefix} focus requested`;
        case "cursor_visible":
            return `${prefix} cursor restored`;
    }
}
