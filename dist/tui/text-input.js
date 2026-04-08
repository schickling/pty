export function createTextInput() {
    return { text: "", cursor: 0, active: false, processing: false };
}
export function activateTextInput(state) {
    return { ...state, active: true };
}
export function deactivateTextInput(state) {
    return { ...state, active: false };
}
export function handleTextInputKey(state, key, onSubmit) {
    if (!state.active || state.processing)
        return null;
    if (key.name === "escape") {
        return { text: "", cursor: 0, active: false, processing: false };
    }
    if (key.name === "return") {
        if (state.text.length > 0) {
            onSubmit?.(state.text);
            return { ...state, processing: true };
        }
        return null;
    }
    if (key.name === "backspace") {
        if (state.cursor > 0) {
            const text = state.text.slice(0, state.cursor - 1) + state.text.slice(state.cursor);
            return { ...state, text, cursor: state.cursor - 1 };
        }
        return null;
    }
    if (key.name === "delete") {
        if (state.cursor < state.text.length) {
            const text = state.text.slice(0, state.cursor) + state.text.slice(state.cursor + 1);
            return { ...state, text };
        }
        return null;
    }
    if (key.name === "left") {
        if (state.cursor > 0)
            return { ...state, cursor: state.cursor - 1 };
        return null;
    }
    if (key.name === "right") {
        if (state.cursor < state.text.length)
            return { ...state, cursor: state.cursor + 1 };
        return null;
    }
    if (key.name === "home" || (key.name === "a" && key.ctrl)) {
        return { ...state, cursor: 0 };
    }
    if (key.name === "end" || (key.name === "e" && key.ctrl)) {
        return { ...state, cursor: state.text.length };
    }
    // Ctrl+U: clear line
    if (key.name === "u" && key.ctrl) {
        return { ...state, text: state.text.slice(state.cursor), cursor: 0 };
    }
    // Printable character
    if (key.char && !key.ctrl && !key.alt) {
        const text = state.text.slice(0, state.cursor) + key.char + state.text.slice(state.cursor);
        return { ...state, text, cursor: state.cursor + 1 };
    }
    return null;
}
export function finishProcessing(state) {
    return { text: "", cursor: 0, active: false, processing: false };
}
