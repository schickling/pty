// FPS counter: tracks frame timestamps and computes rolling FPS
import { signal } from "./signals.js";
const showFPS = signal(false);
const frameTimes = [];
const FPS_WINDOW = 60;
let currentFPS = 0;
export function recordFrame() {
    const now = performance.now();
    frameTimes.push(now);
    while (frameTimes.length > FPS_WINDOW)
        frameTimes.shift();
    if (frameTimes.length >= 2) {
        const elapsed = now - frameTimes[0];
        if (elapsed > 0) {
            currentFPS = Math.round(((frameTimes.length - 1) / elapsed) * 1000);
        }
    }
}
export function getCurrentFPS() {
    return currentFPS;
}
export function isFPSVisible() {
    return showFPS.get();
}
export function toggleFPS() {
    showFPS.set(!showFPS.peek());
}
