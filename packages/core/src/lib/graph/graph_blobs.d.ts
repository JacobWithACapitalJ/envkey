import { Graph, Blob } from "../../types";
export declare const getRequiredBlobPathsForDeleteEncryptedKeys: (graph: Graph.Graph, userId: string, toDeleteEncryptedKeys: Blob.KeySet) => Set<string>;
export declare const getEnvironmentsQueuedForReencryptionIds: ((graph: Graph.Graph, currentUserId: string) => string[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => string[]>;
export declare const getBlobSetNumUpdatedSummary: (graph: Graph.Graph, blobSet: Blob.BlobSet) => string;
//# sourceMappingURL=graph_blobs.d.ts.map