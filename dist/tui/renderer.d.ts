import type { UINode, Color, Rect, CanvasNode } from "./nodes.ts";
import type { Theme, BoxStyle } from "./colors.ts";
export interface RenderOpts {
    spinnerChar: string;
    fps: number;
    showFPS: boolean;
}
export declare function resolveColor(color: Color | undefined, theme: Theme): [number, number, number] | null;
export declare function renderToAnsi(nodes: UINode[], theme: Theme, boxStyle: BoxStyle, opts: RenderOpts, clip?: Rect): string;
/**
 * Run the canvas draw callback, building the DrawContext and collecting cells.
 * Exported so the buffer renderer can also call it.
 */
export declare function executeCanvasDraw(node: CanvasNode, rect: Rect, theme: Theme): void;
