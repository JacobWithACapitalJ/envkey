import { Graph } from "../../../../types";
export declare const getAccessGrantableOrRemovableAppsForUser: (graph: Graph.Graph, currentUserId: string, userId: string) => {
    type?: "app";
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
    environmentRoleIpsAllowed?: Record<string, string[]>;
    environmentRoleIpsMergeStrategies?: Record<string, "extend" | "override">;
    envsUpdatedAt?: number;
    localsUpdatedAtByUserId?: Record<string, number>;
    localsUpdatedAt?: number;
    localsEncryptedBy?: Record<string, string>;
    localsReencryptionRequiredAt?: Record<string, number>;
    envsOrLocalsUpdatedAt?: number;
    localsRequireReinit?: boolean;
}[];
export declare const getAccessGrantableAppsForUser: (graph: Graph.Graph, currentUserId: string, userId: string) => {
    type?: "app";
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
    environmentRoleIpsAllowed?: Record<string, string[]>;
    environmentRoleIpsMergeStrategies?: Record<string, "extend" | "override">;
    envsUpdatedAt?: number;
    localsUpdatedAtByUserId?: Record<string, number>;
    localsUpdatedAt?: number;
    localsEncryptedBy?: Record<string, string>;
    localsReencryptionRequiredAt?: Record<string, number>;
    envsOrLocalsUpdatedAt?: number;
    localsRequireReinit?: boolean;
}[];
//# sourceMappingURL=users.d.ts.map