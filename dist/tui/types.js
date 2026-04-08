// Core types for the TUI framework
export function emptyCell() {
    return { char: " ", fg: null, bg: null, bold: false, dim: false, italic: false, underline: false };
}
export function cellsEqual(a, b) {
    return (a.char === b.char &&
        a.bold === b.bold &&
        a.dim === b.dim &&
        a.italic === b.italic &&
        a.underline === b.underline &&
        colorEqual(a.fg, b.fg) &&
        colorEqual(a.bg, b.bg));
}
function colorEqual(a, b) {
    if (a === b)
        return true;
    if (!a || !b)
        return false;
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
