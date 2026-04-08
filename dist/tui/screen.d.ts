import type { Screen, ScreenContext } from "./types.ts";
import type { KeyEvent } from "./input.ts";
import type { UINode } from "./nodes.ts";
export interface DeclarativeScreenConfig {
    id: string;
    render: (ctx: ScreenContext) => UINode[];
    handleKey?: (key: KeyEvent, ctx: ScreenContext) => boolean;
    onEnter?: (ctx: ScreenContext) => void;
    onLeave?: (ctx: ScreenContext) => void;
    /**
     * Game/animation tick loop. When set, a setInterval runs at the given `ms`
     * rate while this screen is active. The `update` callback should mutate
     * signals — the reactive render loop picks up the changes automatically.
     * The timer starts on onEnter and stops on onLeave.
     */
    tick?: {
        ms: number;
        update: () => void;
    };
}
/**
 * Creates a Screen from declarative UI node builders.
 * The returned Screen is fully compatible with the existing router.
 */
export declare function screen(config: DeclarativeScreenConfig): Screen;
export interface OverlayConfig {
    id: string;
    title: string;
    width: number | ((cols: number) => number);
    height: number | ((rows: number) => number);
    render: (ctx: ScreenContext) => UINode[];
    handleKey?: (key: KeyEvent, ctx: ScreenContext) => boolean;
    onEnter?: (ctx: ScreenContext) => void;
    onLeave?: (ctx: ScreenContext) => void;
}
/**
 * Creates a centered overlay Screen with shadow and panel chrome.
 * Content nodes are laid out inside the panel's content area.
 */
export declare function overlay(config: OverlayConfig): Screen;
