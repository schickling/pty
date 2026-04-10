import type { Terminal } from "@xterm/headless";
import type { SerializeAddon } from "@xterm/addon-serialize";
import type { Screenshot } from "./types.ts";
export declare function captureScreenshot(terminal: Terminal, serialize: SerializeAddon): Screenshot;
