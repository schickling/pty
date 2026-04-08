import { type Cell } from "./types.ts";
export declare class CellBuffer {
    rows: number;
    cols: number;
    cells: Cell[][];
    constructor(rows: number, cols: number);
    clear(): void;
    getCell(row: number, col: number): Cell | undefined;
    setCell(row: number, col: number, cell: Cell): void;
    /** Parse an ANSI string and write it into the buffer.
     *  Coordinates are 1-based (matching terminal conventions from render.ts moveTo).
     */
    writeAnsi(ansi: string): void;
    clone(): CellBuffer;
}
/** Diff two buffers and emit minimal ANSI to update from prev to next.
 *  Uses DEC synchronized output (mode 2026) to prevent tearing. */
export declare function diff(prev: CellBuffer, next: CellBuffer): string;
/** Render the full buffer to ANSI (for initial draw). */
export declare function fullRender(buf: CellBuffer): string;
