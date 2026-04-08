import { parseKey } from "./input.js";
import { hideCursor, showCursor, reset } from "./colors.js";
import { diff, fullRender } from "./buffer.js";
import { recordFrame, getCurrentFPS, isFPSVisible } from "./fps.js";
import { themes } from "./colors.js";
import { effect } from "./signals.js";
const enterAltScreen = "\x1b[?1049h";
const leaveAltScreen = "\x1b[?1049l";
export function app(config) {
    const stdin = process.stdin;
    const stdout = process.stdout;
    let running = false;
    let prevBuffer = null;
    let effectDispose = null;
    let stdinHandler = null;
    let resizeHandler = null;
    let sigintHandler = null;
    let sigtermHandler = null;
    let exitHandler = null;
    let activeScreen = null;
    let activeOverlay = null;
    function getSize() {
        return [stdout.rows ?? 35, stdout.columns ?? 120];
    }
    function getTheme() {
        return config.theme ? config.theme() : themes.coolBlue;
    }
    function getBoxStyle() {
        return config.boxStyle ? config.boxStyle() : "rounded";
    }
    function resolveScreen() {
        return typeof config.screen === "function" ? config.screen() : config.screen;
    }
    function createContext(rows, cols) {
        return {
            rows,
            cols,
            theme: getTheme(),
            boxStyle: getBoxStyle(),
            navigate: () => { },
            back: () => { },
            openOverlay: () => { },
            closeOverlay: () => { },
            isTextInputActive: () => false,
            setTextInputActive: () => { },
        };
    }
    function renderFrame() {
        if (!running)
            return;
        recordFrame();
        const [rows, cols] = getSize();
        const ctx = createContext(rows, cols);
        const scr = resolveScreen();
        // Detect screen transition
        if (scr !== activeScreen) {
            activeScreen?.onLeave?.(ctx);
            activeScreen = scr;
            scr.onEnter?.(ctx);
        }
        const buf = scr.renderToBuffer(ctx);
        // Composite overlay if present
        if (config.overlay) {
            const ov = config.overlay() ?? null;
            // Detect overlay transition
            if (ov !== activeOverlay) {
                activeOverlay?.onLeave?.(ctx);
                activeOverlay = ov;
                ov?.onEnter?.(ctx);
            }
            if (ov) {
                const overlayBuf = ov.renderToBuffer(ctx);
                // Bounding-box composite: find non-empty region, copy all cells within
                let minR = buf.rows, maxR = 0, minC = buf.cols, maxC = 0;
                for (let r = 0; r < buf.rows; r++) {
                    for (let c = 0; c < buf.cols; c++) {
                        const cell = overlayBuf.cells[r]?.[c];
                        if (cell && (cell.char !== " " || cell.bg !== null)) {
                            minR = Math.min(minR, r);
                            maxR = Math.max(maxR, r);
                            minC = Math.min(minC, c);
                            maxC = Math.max(maxC, c);
                        }
                    }
                }
                for (let r = minR; r <= maxR; r++) {
                    for (let c = minC; c <= maxC; c++) {
                        const cell = overlayBuf.cells[r]?.[c];
                        if (cell)
                            buf.cells[r][c] = cell;
                    }
                }
            }
        }
        // FPS overlay (top-right corner)
        if (isFPSVisible()) {
            const fps = getCurrentFPS();
            const theme = getTheme();
            const label = ` ${fps} FPS `;
            const col = (getSize()[1]) - label.length - 1;
            for (let i = 0; i < label.length; i++) {
                if (col + i >= 0 && col + i < buf.cols) {
                    buf.cells[0][col + i] = {
                        char: label[i], fg: theme.bg1 ? [...theme.bg1] : null, bg: theme.fgAc ? [...theme.fgAc] : null,
                        bold: false, dim: false, italic: false, underline: false,
                    };
                }
            }
        }
        let output;
        const [rows2, cols2] = getSize();
        if (prevBuffer && prevBuffer.rows === rows2 && prevBuffer.cols === cols2) {
            output = diff(prevBuffer, buf);
        }
        else {
            output = fullRender(buf);
        }
        prevBuffer = buf;
        stdout.write(hideCursor() + output);
    }
    function registerListeners() {
        stdinHandler = (data) => {
            const buf = typeof data === "string" ? Buffer.from(data) : data;
            const keys = parseKey(buf);
            for (const key of keys) {
                // Global key interceptor
                if (config.onKey && config.onKey(key))
                    continue;
                // Screen key handler
                const [rows, cols] = getSize();
                const ctx = createContext(rows, cols);
                const scr = resolveScreen();
                const cont = scr.handleKey(key, ctx);
                if (!cont) {
                    self.stop();
                    process.exit(0);
                }
            }
        };
        stdin.on("data", stdinHandler);
        resizeHandler = () => {
            prevBuffer = null;
            renderFrame();
        };
        stdout.on("resize", resizeHandler);
        sigintHandler = () => { self.stop(); process.exit(0); };
        sigtermHandler = () => { self.stop(); process.exit(0); };
        exitHandler = () => { self.stop(); };
        process.on("SIGINT", sigintHandler);
        process.on("SIGTERM", sigtermHandler);
        process.on("exit", exitHandler);
    }
    function removeListeners() {
        if (stdinHandler) {
            stdin.removeListener("data", stdinHandler);
            stdinHandler = null;
        }
        if (resizeHandler) {
            stdout.removeListener("resize", resizeHandler);
            resizeHandler = null;
        }
        if (sigintHandler) {
            process.removeListener("SIGINT", sigintHandler);
            sigintHandler = null;
        }
        if (sigtermHandler) {
            process.removeListener("SIGTERM", sigtermHandler);
            sigtermHandler = null;
        }
        if (exitHandler) {
            process.removeListener("exit", exitHandler);
            exitHandler = null;
        }
    }
    function enterTerminal() {
        stdout.write(enterAltScreen + hideCursor());
        if (stdin.isTTY)
            stdin.setRawMode(true);
        stdin.resume();
    }
    function leaveTerminal(full) {
        if (full) {
            stdout.write(showCursor() + reset() + leaveAltScreen);
        }
        else {
            stdout.write(showCursor() + leaveAltScreen);
        }
        if (stdin.isTTY && stdin.isRaw)
            stdin.setRawMode(false);
        stdin.pause();
    }
    const self = {
        start() {
            running = true;
            prevBuffer = null;
            enterTerminal();
            registerListeners();
            effectDispose = effect(() => { renderFrame(); });
        },
        stop() {
            if (!running)
                return;
            running = false;
            if (effectDispose) {
                effectDispose();
                effectDispose = null;
            }
            removeListeners();
            // Call onLeave for active overlay and screen
            const ctx = createContext(...getSize());
            activeOverlay?.onLeave?.(ctx);
            activeScreen?.onLeave?.(ctx);
            activeOverlay = null;
            activeScreen = null;
            leaveTerminal(true);
        },
        pause() {
            if (!running)
                return;
            running = false;
            if (effectDispose) {
                effectDispose();
                effectDispose = null;
            }
            removeListeners();
            leaveTerminal(false);
        },
        resume() {
            running = true;
            prevBuffer = null;
            enterTerminal();
            registerListeners();
            effectDispose = effect(() => { renderFrame(); });
        },
    };
    return self;
}
