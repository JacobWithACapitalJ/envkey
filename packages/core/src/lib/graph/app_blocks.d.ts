import { Graph, Client } from "../../types";
export declare const getAppBlockGroupAssoc: ((graph: Graph.Graph, appId: string, blockId: string) => {
    type?: "appGroupBlock";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    blockId?: string;
    appGroupId?: string;
} | {
    type?: "appBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockGroupId?: string;
} | {
    type?: "appGroupBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appGroupId?: string;
    blockGroupId?: string;
}) & import("memoizee").Memoized<(graph: Graph.Graph, appId: string, blockId: string) => {
    type?: "appGroupBlock";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    blockId?: string;
    appGroupId?: string;
} | {
    type?: "appBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockGroupId?: string;
} | {
    type?: "appGroupBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appGroupId?: string;
    blockGroupId?: string;
}>, getAppBlockGroupMembership: ((graph: Graph.Graph, appId: string, blockId: string) => {
    type?: "groupMembership";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    groupId?: string;
    objectId?: string;
}) & import("memoizee").Memoized<(graph: Graph.Graph, appId: string, blockId: string) => {
    type?: "groupMembership";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    groupId?: string;
    objectId?: string;
}>, getConnectedAppsForBlock: ((graph: Graph.Graph, blockId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, blockId: string) => {
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
}[]>, getConnectedBlocksForApp: ((graph: Graph.Graph, appId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, appId: string) => {
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
}[]>, getBlockSortVal: (graph: Graph.Graph, appId: string, blockId: string) => number, getEnvParentWithConnectedIds: ((graph: Client.Graph.UserGraph, envParentId: string) => string[]) & import("memoizee").Memoized<(graph: Client.Graph.UserGraph, envParentId: string) => string[]>, getConnectedBlockEnvironmentsForApp: ((graph: Graph.Graph, appId: string, blockId?: string, environmentId?: string, environmentRoleId?: string) => ({
    type?: "environment";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    "upgradedCrypto-2.1.0"?: boolean;
    environmentRoleId?: string;
    envParentId?: string;
    envUpdatedAt?: number;
    encryptedById?: string;
    reencryptionRequiredAt?: number;
    requiresReinit?: boolean;
} & ({
    settings?: {
        autoCommit?: boolean;
    };
    isSub?: false;
} | {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, appId: string, blockId?: string, environmentId?: string, environmentRoleId?: string) => ({
    type?: "environment";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    "upgradedCrypto-2.1.0"?: boolean;
    environmentRoleId?: string;
    envParentId?: string;
    envUpdatedAt?: number;
    encryptedById?: string;
    reencryptionRequiredAt?: number;
    requiresReinit?: boolean;
} & ({
    settings?: {
        autoCommit?: boolean;
    };
    isSub?: false;
} | {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
}))[]>, getAllConnectedAppEnvironmentsForBlock: ((graph: Graph.Graph, blockId: string, blockEnvironmentIds?: Set<string>) => ({
    type?: "environment";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    "upgradedCrypto-2.1.0"?: boolean;
    environmentRoleId?: string;
    envParentId?: string;
    envUpdatedAt?: number;
    encryptedById?: string;
    reencryptionRequiredAt?: number;
    requiresReinit?: boolean;
} & ({
    settings?: {
        autoCommit?: boolean;
    };
    isSub?: false;
} | {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, blockId: string, blockEnvironmentIds?: Set<string>) => ({
    type?: "environment";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    "upgradedCrypto-2.1.0"?: boolean;
    environmentRoleId?: string;
    envParentId?: string;
    envUpdatedAt?: number;
    encryptedById?: string;
    reencryptionRequiredAt?: number;
    requiresReinit?: boolean;
} & ({
    settings?: {
        autoCommit?: boolean;
    };
    isSub?: false;
} | {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
}))[]>, getConnectedEnvironments: ((graph: Graph.Graph, environmentId: string) => ({
    type?: "environment";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    "upgradedCrypto-2.1.0"?: boolean;
    environmentRoleId?: string;
    envParentId?: string;
    envUpdatedAt?: number;
    encryptedById?: string;
    reencryptionRequiredAt?: number;
    requiresReinit?: boolean;
} & ({
    settings?: {
        autoCommit?: boolean;
    };
    isSub?: false;
} | {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, environmentId: string) => ({
    type?: "environment";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    "upgradedCrypto-2.1.0"?: boolean;
    environmentRoleId?: string;
    envParentId?: string;
    envUpdatedAt?: number;
    encryptedById?: string;
    reencryptionRequiredAt?: number;
    requiresReinit?: boolean;
} & ({
    settings?: {
        autoCommit?: boolean;
    };
    isSub?: false;
} | {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
}))[]>, getConnectedAppEnvironmentsForBlock: ((graph: Graph.Graph, blockId: string, environmentId?: string, appId?: string) => ({
    type?: "environment";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    "upgradedCrypto-2.1.0"?: boolean;
    environmentRoleId?: string;
    envParentId?: string;
    envUpdatedAt?: number;
    encryptedById?: string;
    reencryptionRequiredAt?: number;
    requiresReinit?: boolean;
} & ({
    settings?: {
        autoCommit?: boolean;
    };
    isSub?: false;
} | {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, blockId: string, environmentId?: string, appId?: string) => ({
    type?: "environment";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    "upgradedCrypto-2.1.0"?: boolean;
    environmentRoleId?: string;
    envParentId?: string;
    envUpdatedAt?: number;
    encryptedById?: string;
    reencryptionRequiredAt?: number;
    requiresReinit?: boolean;
} & ({
    settings?: {
        autoCommit?: boolean;
    };
    isSub?: false;
} | {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
}))[]>;
//# sourceMappingURL=app_blocks.d.ts.map