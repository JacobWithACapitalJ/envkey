import { Graph } from "../../types";
export declare const getKeyablesByPubkeyId: ((graph: Graph.Graph) => Record<string, Graph.GraphObject>) & import("memoizee").Memoized<(graph: Graph.Graph) => Record<string, Graph.GraphObject>>;
export declare const getEncryptedByEnvironmentIds: ((graph: Graph.Graph, encryptedById: string) => string[]) & import("memoizee").Memoized<(graph: Graph.Graph, encryptedById: string) => string[]>;
export declare const getEncryptedByLocalIds: ((graph: Graph.Graph, encryptedById: string) => string[]) & import("memoizee").Memoized<(graph: Graph.Graph, encryptedById: string) => string[]>;
export declare const getSignedByKeyableIds: ((graph: Graph.Graph, signedById: string) => string[]) & import("memoizee").Memoized<(graph: Graph.Graph, signedById: string) => string[]>;
export declare const getSignedByNonLocalKeyableIds: ((graph: Graph.Graph, signedById: string) => string[]) & import("memoizee").Memoized<(graph: Graph.Graph, signedById: string) => string[]>;
export declare const getUserIsImmediatelyDeletable: (graph: Graph.Graph, userId: string) => boolean;
export declare const getDeviceIsImmediatelyDeletable: (graph: Graph.Graph, deviceId: string, excludeLocalKeys?: true) => boolean;
//# sourceMappingURL=trust.d.ts.map