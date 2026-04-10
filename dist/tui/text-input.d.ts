import type { KeyEvent } from "./input.ts";
export interface TextInputState {
    text: string;
    cursor: number;
    active: boolean;
    processing: boolean;
}
export declare function createTextInput(): TextInputState;
export declare function activateTextInput(state: TextInputState): TextInputState;
export declare function deactivateTextInput(state: TextInputState): TextInputState;
export declare function handleTextInputKey(state: TextInputState, key: KeyEvent, onSubmit?: (text: string) => void): TextInputState | null;
export declare function finishProcessing(state: TextInputState): TextInputState;
