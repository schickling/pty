// Public API for the declarative TUI framework
// Input
export { parseKey } from "./input.js";
// Signals
export { signal, computed, effect, batch } from "./signals.js";
export { emptyCell, cellsEqual } from "./types.js";
export { charWidth, visibleLength, stripAnsi, truncate, wrapText, pad, moveTo, fg, bg, reset, bold, dim, italic, underline, inverse, BOLD, DIM, RESET, clearScreen, hideCursor, showCursor, writeAt, fillRect, fillLine, drawBox, hSep, boxChars, progressBar as progressBarString, themes, c, initScreen, titleBar, footerBar, panel as drawPanel, panelLine, askBar as drawAskBar, askBarCompact, agentActivity, } from "./colors.js";
// Cell buffer
export { CellBuffer, diff, fullRender } from "./buffer.js";
// Scrollable
export { createScrollRegion, updateScrollRegion, scrollUp, scrollDown, pageUp, pageDown, scrollToTop, scrollToBottom, visibleSlice, } from "./scrollable.js";
// Text input
export { createTextInput, activateTextInput, deactivateTextInput, handleTextInputKey, finishProcessing, } from "./text-input.js";
// Builders
export { text, spacer, gap, separator, indent, dot, checkbox, progressBar, spinner, icon, row, column, hstack, panel, scrollable, selectable, groupedSelectable, statusBar, footer, askBar, textInput, fpsCounter, canvas, createPty, attachPty, ptyView, themeToXterm, } from "./builders.js";
// Layout
export { layoutRoot, layoutVertical, layoutRow, layoutPanel, textWidth } from "./layout.js";
// Renderer
export { renderToAnsi, resolveColor } from "./renderer.js";
// Screen wrapper
export { screen, overlay } from "./screen.js";
// Animation
export { spinnerChar, startSpinnerTimer, stopSpinnerTimer, isSpinnerRunning, } from "./animation.js";
// FPS
export { recordFrame, getCurrentFPS, isFPSVisible, toggleFPS, } from "./fps.js";
// App lifecycle
export { app } from "./app.js";
// Session management
export { listSessions, getSession, } from "../sessions.js";
// Daemon spawning
export { spawnDaemon } from "../spawn.js";
