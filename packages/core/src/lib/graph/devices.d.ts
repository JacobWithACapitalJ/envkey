import { Graph } from "../../types";
export declare const getDeviceIdsForUser: ((graph: Graph.Graph, userId: string, now: number) => string[]) & import("memoizee").Memoized<(graph: Graph.Graph, userId: string, now: number) => string[]>, getPubkeysByDeviceIdForUser: ((graph: Graph.Graph, userId: string, now: number) => {
    [x: string]: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
}) & import("memoizee").Memoized<(graph: Graph.Graph, userId: string, now: number) => {
    [x: string]: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
}>;
//# sourceMappingURL=devices.d.ts.map