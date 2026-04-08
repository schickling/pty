export declare function clearScreen(): string;
export declare function hideCursor(): string;
export declare function showCursor(): string;
export declare function moveTo(row: number, col: number): string;
export declare function fg(r: number, g: number, b: number): string;
export declare function bg(r: number, g: number, b: number): string;
export declare function reset(): string;
export declare function bold(s: string): string;
export declare function dim(s: string): string;
export declare function italic(s: string): string;
export declare function underline(s: string): string;
export declare function inverse(s: string): string;
export declare const BOLD = "\u001B[1m";
export declare const DIM = "\u001B[2m";
export declare const RESET = "\u001B[0m";
export declare function stripAnsi(text: string): string;
export declare function charWidth(ch: string): number;
export declare function visibleLength(text: string): number;
export declare function truncate(text: string, maxWidth: number): string;
/**
 * Soft-wrap text into multiple visual lines that fit within `maxWidth` columns.
 * Breaks at word boundaries (spaces) when possible, falling back to character-
 * boundary breaking only when a single word exceeds the line width. CJK
 * characters (charWidth === 2) are always valid break points — a line can
 * break after any CJK character.
 *
 * Break semantics: when breaking at a space, the break happens BEFORE the
 * space so the space appears at the start of the next line.  This preserves
 * the invariant that concatenating all output lines reproduces the original
 * text exactly, keeping offset tracking simple.
 *
 * Returns at least one line, plus the starting code-point offset of each line
 * for span splitting.
 */
export declare function wrapText(text: string, maxWidth: number): {
    lines: string[];
    offsets: number[];
};
export declare function pad(text: string, width: number, align?: "left" | "right" | "center"): string;
export declare function writeAt(row: number, col: number, text: string): string;
export declare function fillRect(row: number, col: number, width: number, height: number, char?: string): string;
export declare function fillLine(row: number, col: number, width: number, char?: string): string;
export type BoxStyle = "rounded" | "sharp" | "double" | "heavy";
interface BoxChars {
    tl: string;
    tr: string;
    bl: string;
    br: string;
    h: string;
    v: string;
    lj: string;
    rj: string;
}
export declare function boxChars(style?: BoxStyle): BoxChars;
export declare function drawBox(row: number, col: number, width: number, height: number, opts?: {
    style?: BoxStyle;
    title?: string;
    fill?: boolean;
}): string;
export declare function hSep(row: number, col: number, width: number, style?: BoxStyle): string;
export declare function progressBar(width: number, pct: number): string;
type ThemeColor = [number, number, number] | null;
export interface Theme {
    bg1: ThemeColor;
    bg2: ThemeColor;
    bgHi: ThemeColor;
    bgAc: ThemeColor;
    fg1: ThemeColor;
    fg2: ThemeColor;
    fgAc: ThemeColor;
    fgMu: ThemeColor;
    ok: ThemeColor;
    warn: ThemeColor;
    err: ThemeColor;
    info: ThemeColor;
    border: ThemeColor;
}
export declare const themes: Record<string, Theme>;
export declare function c(theme: Theme): {
    bg1: string;
    bg2: string;
    bgHi: string;
    bgAc: string;
    fg1: string;
    fg2: string;
    fgAc: string;
    fgMu: string;
    ok: string;
    warn: string;
    err: string;
    info: string;
    border: string;
    bgOk: string;
    bgWarn: string;
    bgErr: string;
    bgInfo: string;
};
export declare function initScreen(rows: number, cols: number, theme: Theme): string;
export declare function titleBar(cols: number, left: string, right: string, theme: Theme): string;
export declare function footerBar(row: number, cols: number, text: string, theme: Theme): string;
export declare function panel(row: number, col: number, w: number, h: number, title: string, theme: Theme, style?: BoxStyle): string;
export declare function panelLine(row: number, col: number, text: string): string;
export declare function askBar(row: number, col: number, width: number, theme: Theme, agentContext: string, style?: BoxStyle): string;
export declare function askBarCompact(row: number, col: number, width: number, theme: Theme, agentContext: string): string;
export declare function agentActivity(row: number, col: number, items: [string, string, string][], theme: Theme): string;
export {};
