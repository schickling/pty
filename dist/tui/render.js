// ANSI rendering primitives for the TUI
export const ESC = "\x1b";
// Strip ANSI escape sequences to get visible text
const ANSI_RE = /\x1b\[[0-9;]*[a-zA-Z]/g;
export function stripAnsi(text) {
    return text.replace(ANSI_RE, "");
}
export function visibleLength(text) {
    return stripAnsi(text).length;
}
// Screen management
export function enterAltScreen() {
    return `${ESC}[?1049h`;
}
export function leaveAltScreen() {
    return `${ESC}[?1049l`;
}
export function clearScreen() {
    return `${ESC}[2J${ESC}[H`;
}
export function hideCursor() {
    return `${ESC}[?25l`;
}
export function showCursor() {
    return `${ESC}[?25h`;
}
export function moveTo(row, col) {
    return `${ESC}[${row};${col}H`;
}
// Text styles
export function bold(text) {
    return `${ESC}[1m${text}${ESC}[22m`;
}
export function dim(text) {
    return `${ESC}[2m${text}${ESC}[22m`;
}
export function inverse(text) {
    return `${ESC}[7m${text}${ESC}[27m`;
}
export function green(text) {
    return `${ESC}[32m${text}${ESC}[39m`;
}
export function red(text) {
    return `${ESC}[31m${text}${ESC}[39m`;
}
export function yellow(text) {
    return `${ESC}[33m${text}${ESC}[39m`;
}
export function cyan(text) {
    return `${ESC}[36m${text}${ESC}[39m`;
}
// Text utilities — operate on plain text (no ANSI codes)
export function truncate(text, maxWidth) {
    if (text.length <= maxWidth)
        return text;
    if (maxWidth <= 1)
        return text.slice(0, maxWidth);
    return text.slice(0, maxWidth - 1) + "\u2026";
}
export function pad(text, width, align = "left") {
    if (text.length >= width)
        return text.slice(0, width);
    const padding = " ".repeat(width - text.length);
    return align === "right" ? padding + text : text + padding;
}
// Box drawing (Unicode)
// Rounded corners (╭╮╰╯) like mactop
const BOX = {
    topLeft: "\u256d",
    topRight: "\u256e",
    bottomLeft: "\u2570",
    bottomRight: "\u256f",
    horizontal: "\u2500",
    vertical: "\u2502",
};
export function drawBox(row, col, width, height, title) {
    let out = "";
    // Top border
    let topLine = BOX.horizontal.repeat(width - 2);
    if (title) {
        const visLen = visibleLength(title);
        const titleCells = visLen + 2; // space on each side
        if (titleCells < width - 2) {
            const remaining = width - 2 - titleCells - 1; // -1 for leading ─
            topLine = BOX.horizontal + ` ${title} ` + BOX.horizontal.repeat(remaining);
        }
    }
    out += moveTo(row, col) + BOX.topLeft + topLine + BOX.topRight;
    // Side borders
    for (let r = 1; r < height - 1; r++) {
        out += moveTo(row + r, col) + BOX.vertical;
        out += moveTo(row + r, col + width - 1) + BOX.vertical;
    }
    // Bottom border
    out += moveTo(row + height - 1, col) + BOX.bottomLeft + BOX.horizontal.repeat(width - 2) + BOX.bottomRight;
    return out;
}
// Layout helpers
export function renderHeader(width, title) {
    return drawBox(1, 1, width, 3, title);
}
export function renderFooter(width, bindings) {
    const text = bindings.join("  ");
    return moveTo(width, 1) + dim(` ${text}`);
}
export function clearLine(row, col, width) {
    return moveTo(row, col) + " ".repeat(width);
}
