import { Buffer } from "node:buffer";
export declare const MessageType: {
    readonly DATA: 0;
    readonly ATTACH: 1;
    readonly DETACH: 2;
    readonly RESIZE: 3;
    readonly EXIT: 4;
    readonly SCREEN: 5;
    readonly PEEK: 6;
    readonly STATUS: 7;
};
export type MessageType = (typeof MessageType)[keyof typeof MessageType];
export interface Packet {
    type: MessageType;
    payload: Buffer;
}
export declare function encodePacket(type: MessageType, payload: Buffer): Buffer;
export declare function encodeData(data: string): Buffer;
export declare function encodeAttach(rows: number, cols: number): Buffer;
export declare function encodeDetach(): Buffer;
export declare function encodeResize(rows: number, cols: number): Buffer;
export declare function encodeExit(code: number): Buffer;
export declare function encodePeek(plain?: boolean): Buffer;
export declare function encodeScreen(data: string): Buffer;
export declare function encodeStatus(): Buffer;
export declare function encodeStatusResponse(json: string): Buffer;
export declare function decodeSize(payload: Buffer): {
    rows: number;
    cols: number;
};
export declare function decodeExit(payload: Buffer): number;
/** Streaming packet parser that handles partial reads on a stream socket. */
export declare class PacketReader {
    private buffer;
    feed(data: Buffer): Packet[];
}
