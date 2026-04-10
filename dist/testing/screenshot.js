export function captureScreenshot(terminal, serialize) {
    const buffer = terminal.buffer.active;
    const lines = [];
    for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) {
            lines.push(line.translateToString(true));
        }
    }
    while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
        lines.pop();
    }
    return {
        lines,
        text: lines.join("\n"),
        ansi: serialize.serialize(),
    };
}
