// Public API for programmatic session management.
// Import from "@myobie/pty/client".
// Session management
export { listSessions, getSession, gc, validateName, getSessionDir, getSocketPath, cleanupSocket, cleanupAll, } from "./sessions.js";
// Session creation
export { spawnDaemon, resolveCommand, waitForSocket } from "./spawn.js";
export { PtyServer } from "./server.js";
// Session interaction (programmatic — no process.exit, no stdin/stdout)
export { SessionConnection, sendData, peekScreen, } from "./connection.js";
// Session interaction (CLI-oriented — uses process.stdin/stdout, may call process.exit)
export { attach, peek, send, queryStats, TERMINAL_SANITIZE, } from "./client.js";
// Events
export { EventType, EventFollower, readRecentEvents, formatEvent, } from "./events.js";
// Keys
export { resolveKey, parseSeqValue } from "./keys.js";
// Protocol (advanced)
export { PacketReader, MessageType, } from "./protocol.js";
