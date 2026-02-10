import { Graph, Model, Rbac } from "../../../../types";
export declare const getEnvsUpdatableBaseEnvironments: ((graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]>, getVisibleBaseEnvironments: ((graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]>, getVisibleBaseEnvironmentAndLocalIds: ((graph: Graph.Graph, currentUserId: string, envParentId: string, localsUserId?: string) => string[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, envParentId: string, localsUserId?: string) => string[]>, getEnvsUpdatableSubEnvironments: ((graph: Graph.Graph, currentUserId: string, parentEnvironmentId: string) => ({
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
} & {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
} & {
    isSub: true;
})[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, parentEnvironmentId: string) => ({
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
} & {
    isSub?: true;
    parentEnvironmentId?: string;
    subName?: string;
} & {
    isSub: true;
})[]>, getEnvsReadableForParentId: ((graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]>, getDeletableSubEnvironmentsForEnvParent: ((graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]>, getEnvParentsWithDeletableSubEnvironments: ((graph: Graph.Graph, currentUserId: string) => ({
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
} | {
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
})[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => ({
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
} | {
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
})[]>, getCanCreateSubEnvironmentsForEnvParents: ((graph: Graph.Graph, currentUserId: string) => ({
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
} | {
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
})[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => ({
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
} | {
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
})[]>, getCanCreateBaseEnvironmentWithRoles: ((graph: Graph.Graph, currentUserId: string, envParentId: string) => Rbac.EnvironmentRole[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, envParentId: string) => Rbac.EnvironmentRole[]>, getCanCreateSubEnvironmentForEnvironments: ((graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, envParentId: string) => ({
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
}))[]>, getAppsPassingEnvTest: ((graph: Graph.Graph, currentUserId: string, test: (graph: Graph.Graph, currentUserId: string, environmentId: string) => boolean) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, test: (graph: Graph.Graph, currentUserId: string, environmentId: string) => boolean) => {
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
}[]>, getEnvParentsPassingEnvTest: ((graph: Graph.Graph, currentUserId: string, test: (graph: Graph.Graph, currentUserId: string, environmentId: string) => boolean) => ({
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
} | {
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
})[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, test: (graph: Graph.Graph, currentUserId: string, environmentId: string) => boolean) => ({
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
} | {
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
})[]>, getInheritableEnvironments: ((graph: Graph.Graph, currentUserId: string, environmentId: string, inheritingEnvironmentIds: Set<string>) => Model.Environment[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, environmentId: string, inheritingEnvironmentIds: Set<string>) => Model.Environment[]>;
//# sourceMappingURL=envs.d.ts.map