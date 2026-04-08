import type { UINode, Rect, PanelNode } from "./nodes.ts";
export declare function textWidth(str: string): number;
export declare function measureHeight(node: UINode, maxWidth: number): number | "flex";
export declare function measureWidth(node: UINode): number | "flex";
export declare function layoutRoot(nodes: UINode[], viewport: Rect): void;
export declare function layoutVertical(nodes: UINode[], rect: Rect): void;
export declare function layoutRow(children: UINode[], rect: Rect): void;
export declare function layoutPanel(node: PanelNode, rect: Rect): void;
