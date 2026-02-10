import { Graph, Model } from "../../types";
export declare const getPermittedBlocksForUser: ((graph: Graph.Graph, userId: string) => {
    type?: "block";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    settings?: {
        autoCommitLocals?: boolean;
        autoCaps?: boolean;
    };
    envsUpdatedAt?: number;
    localsUpdatedAtByUserId?: Record<string, number>;
    localsUpdatedAt?: number;
    localsEncryptedBy?: Record<string, string>;
    localsReencryptionRequiredAt?: Record<string, number>;
    envsOrLocalsUpdatedAt?: number;
    localsRequireReinit?: boolean;
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, userId: string) => {
    type?: "block";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    settings?: {
        autoCommitLocals?: boolean;
        autoCaps?: boolean;
    };
    envsUpdatedAt?: number;
    localsUpdatedAtByUserId?: Record<string, number>;
    localsUpdatedAt?: number;
    localsEncryptedBy?: Record<string, string>;
    localsReencryptionRequiredAt?: Record<string, number>;
    envsOrLocalsUpdatedAt?: number;
    localsRequireReinit?: boolean;
}[]>;
export declare const getAppConnectionsByBlockId: ((graph: Graph.Graph, userId: string) => Record<string, Model.App[]>) & import("memoizee").Memoized<(graph: Graph.Graph, userId: string) => Record<string, Model.App[]>>;
//# sourceMappingURL=user_blocks.d.ts.map