import type { UINode, Color, TextNode, SpacerNode, GapNode, SeparatorNode, IndentNode, DotNode, CheckboxNode, ProgressBarNode, SpinnerNode, IconNode, RowNode, ColumnNode, HStackNode, PanelNode, ScrollableNode, SelectableNode, StatusBarNode, FooterNode, AskBarNode, TextInputNode, FPSCounterNode, CanvasNode, DrawContext, PtyHandle, PtyViewNode } from "./nodes.ts";
import type { BoxStyle, Theme } from "./colors.ts";
import type { ScrollRegion } from "./scrollable.ts";
import type { TextInputState } from "./text-input.ts";
export declare function themeToXterm(theme: Theme): Record<string, string>;
export declare function text(str: string, color?: Color, opts?: {
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    truncate?: boolean;
    wrap?: boolean;
    highlight?: (text: string) => import("./nodes.ts").Span[];
}): TextNode;
export declare function spacer(): SpacerNode;
export declare function gap(size: number | "center"): GapNode;
export declare function separator(): SeparatorNode;
export declare function indent(depth: number): IndentNode;
export declare function dot(filled: boolean, color?: Color): DotNode;
export declare function checkbox(checked: boolean, color?: Color): CheckboxNode;
export declare function progressBar(percent: number, opts?: {
    width?: number;
    color?: Color;
}): ProgressBarNode;
export declare function spinner(color?: Color): SpinnerNode;
export declare function icon(char: string, color?: Color): IconNode;
export declare function row(...children: UINode[]): RowNode;
export declare function column(opts: {
    width?: number;
    flex?: boolean;
}, children: UINode[]): ColumnNode;
export declare function hstack(opts: {
    gap?: number;
}, children: ColumnNode[]): HStackNode;
export declare function panel(title: string, children: UINode[], style?: BoxStyle): PanelNode;
export declare function scrollable<T>(items: T[], renderFn: (item: T, index: number) => UINode[]): ScrollableNode;
export declare function selectable<T>(region: ScrollRegion, items: T[], renderFn: (item: T, index: number, selected: boolean) => UINode[]): SelectableNode;
/**
 * Grouped selectable: renders groups of items with section headers.
 * The ScrollRegion's selectedIndex counts only selectable items (not headers).
 * Headers and spacing rows are included in the visual output but the
 * scroll offset is mapped from item-space to visual-row-space automatically.
 */
export declare function groupedSelectable<T>(region: ScrollRegion, groups: {
    title: string;
    items: T[];
}[], renderItem: (item: T, globalIndex: number, selected: boolean) => UINode[], renderHeader?: (title: string, count: number) => UINode[]): SelectableNode;
export declare function statusBar(left: string, right: string): StatusBarNode;
export declare function footer(hints: string): FooterNode;
export declare function askBar(state: TextInputState, opts?: {
    placeholder?: string;
    rightLabel?: string;
    style?: BoxStyle;
}): AskBarNode;
export declare function textInput(state: TextInputState, opts?: {
    placeholder?: string;
}): TextInputNode;
export declare function fpsCounter(): FPSCounterNode;
/**
 * Free-form drawing surface. Participates in layout like any other node
 * (flex by default, or set fixed height/widthHint), but gives you a
 * DrawContext callback to place characters at arbitrary positions.
 *
 * ```
 * canvas((ctx) => {
 *   ctx.fill(0, 0, ctx.width, ctx.height, ".", "muted");
 *   ctx.write(2, 1, "Player", "ok");
 *   ctx.set(playerX, playerY, "@", "accent");
 * })
 * ```
 */
export declare function canvas(draw: (ctx: DrawContext) => void, opts?: {
    height?: number;
    width?: number;
}): CanvasNode;
export declare function createPty(command: string, args?: string[], opts?: {
    cols?: number;
    rows?: number;
    scrollback?: number;
    cwd?: string;
    env?: Record<string, string>;
    theme?: Theme;
}): PtyHandle;
/**
 * Attach to an existing named PTY session (started with `pty run`).
 * Returns the same PtyHandle interface, but the child process is owned
 * by the external daemon — kill() detaches instead of terminating it.
 *
 * ```
 * const handle = await attachPty("my-server");
 * // in render: ptyView(handle)
 * // in handleKey: handle.write(key sequence)
 * // in onLeave: handle.kill() — detaches, process keeps running
 * ```
 */
export declare function attachPty(name: string, opts?: {
    cols?: number;
    rows?: number;
    scrollback?: number;
    theme?: Theme;
}): Promise<PtyHandle>;
/**
 * Render an embedded PTY session into the layout. Flex-sized by default.
 * The PTY is automatically resized to match the layout rect.
 *
 * ```
 * hstack({ gap: 1 }, [
 *   column({ width: 30 }, [panel("Sidebar", [...])]),
 *   column({ flex: true }, [ptyView(handle)]),
 * ])
 * ```
 */
export declare function ptyView(handle: PtyHandle): PtyViewNode;
