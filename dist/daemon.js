import { cleanupAll } from "./sessions.js";
import { PtyServer } from "./server.js";
const config = JSON.parse(process.env.PTY_SERVER_CONFIG ?? "{}");
if (!config.name || !config.command) {
    console.error("PTY_SERVER_CONFIG env var required");
    process.exit(1);
}
const isEphemeral = config.ephemeral === true;
let server;
function cleanShutdown(code) {
    return server.close().then(() => {
        if (isEphemeral)
            cleanupAll(config.name);
        process.exit(code);
    });
}
server = new PtyServer({
    name: config.name,
    command: config.command,
    args: config.args ?? [],
    displayCommand: config.displayCommand,
    cwd: config.cwd ?? process.cwd(),
    rows: config.rows ?? 24,
    cols: config.cols ?? 80,
    onExit: (code) => {
        setTimeout(() => cleanShutdown(code), 500);
    },
});
process.on("SIGTERM", () => {
    void cleanShutdown(0);
});
process.on("SIGINT", () => {
    void cleanShutdown(0);
});
