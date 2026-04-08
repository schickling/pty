import type { Screen } from "./types.ts";
import type { Theme, BoxStyle } from "./colors.ts";
import type { KeyEvent } from "./input.ts";
/** Configuration for an app created with `app()`. */
export interface AppConfig {
    /** The screen to render. A function is called each frame (reads signals → auto-rerenders). */
    screen: Screen | (() => Screen);
    /** Optional overlay rendered on top of the main screen. */
    overlay?: () => Screen | null;
    /** Called before the screen's handleKey. Return true = key consumed, false = pass to screen. */
    onKey?: (key: KeyEvent) => boolean;
    /** Theme provider. Defaults to coolBlue. */
    theme?: () => Theme;
    /** Box style provider. Defaults to "rounded". */
    boxStyle?: () => BoxStyle;
}
/** A running TUI app with lifecycle control. */
export interface App {
    /** Enter alt screen, raw mode, start render loop and input handling. */
    start(): void;
    /** Clean exit: restore terminal, dispose everything. */
    stop(): void;
    /** Hand terminal to another process. Stops rendering and releases stdin. */
    pause(): void;
    /** Take terminal back after pause. Restores rendering and input. */
    resume(): void;
}
export declare function app(config: AppConfig): App;
