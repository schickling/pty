import type { Theme, BoxStyle } from "./colors.ts";
import type { KeyEvent } from "./input.ts";
export interface Cell {
    char: string;
    fg: [number, number, number] | null;
    bg: [number, number, number] | null;
    bold: boolean;
    dim: boolean;
    italic: boolean;
    underline: boolean;
}
export declare function emptyCell(): Cell;
export declare function cellsEqual(a: Cell, b: Cell): boolean;
export interface ScreenContext {
    rows: number;
    cols: number;
    theme: Theme;
    boxStyle: BoxStyle;
    navigate: (screenId: string) => void;
    back: () => void;
    openOverlay: (screenId: string) => void;
    closeOverlay: () => void;
    isTextInputActive: () => boolean;
    setTextInputActive: (active: boolean) => void;
    [key: string]: any;
}
export interface Screen {
    id: string;
    render(ctx: ScreenContext): string;
    renderToBuffer(ctx: ScreenContext): import("./buffer.ts").CellBuffer;
    handleKey(key: KeyEvent, ctx: ScreenContext): boolean;
    onEnter?(ctx: ScreenContext): void;
    onLeave?(ctx: ScreenContext): void;
}
