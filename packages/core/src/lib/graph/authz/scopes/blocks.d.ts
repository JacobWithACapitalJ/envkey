import { Graph } from "../../../../types";
export declare const getRenameableBlocks: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getSettingsUpdatableBlocks: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getDeletableBlocks: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getConnectableBlocksForApp: ((graph: Graph.Graph, currentUserId: string, appId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => {
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
}[]>, getConnectableAppsForBlock: ((graph: Graph.Graph, currentUserId: string, blockId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, blockId: string) => {
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
}[]>, getDisconnectableBlocksForApp: ((graph: Graph.Graph, currentUserId: string, appId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => {
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
}[]>, getDisconnectableAppsForBlock: ((graph: Graph.Graph, currentUserId: string, blockId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, blockId: string) => {
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
}[]>, getBlockCollaborators: (<UserType extends "orgUser" | "cliUser">(graph: Graph.Graph, currentUserId: string, blockId: string, userType: UserType) => (UserType extends "orgUser" ? {
    type?: "orgUser";
    email?: string;
    id?: string;
    uid?: string;
    provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
    externalAuthProviderId?: string;
    firstName?: string;
    lastName?: string;
    invitedById?: string;
    isCreator?: boolean;
    inviteAcceptedAt?: number;
    orgRoleId?: string;
    deactivatedAt?: number;
    orgRoleUpdatedAt?: number;
    scim?: {
        providerId?: string;
        candidateId?: string;
    };
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
} : {
    type?: "cliUser";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    id?: string;
    orgRoleId?: string;
    deactivatedAt?: number;
    orgRoleUpdatedAt?: number;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    creatorId?: string;
    isRoot?: true;
    revokedRootAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    creatorDeviceId?: string;
})[]) & import("memoizee").Memoized<(<UserType extends "orgUser" | "cliUser">(graph: Graph.Graph, currentUserId: string, blockId: string, userType: UserType) => (UserType extends "orgUser" ? {
    type?: "orgUser";
    email?: string;
    id?: string;
    uid?: string;
    provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
    externalAuthProviderId?: string;
    firstName?: string;
    lastName?: string;
    invitedById?: string;
    isCreator?: boolean;
    inviteAcceptedAt?: number;
    orgRoleId?: string;
    deactivatedAt?: number;
    orgRoleUpdatedAt?: number;
    scim?: {
        providerId?: string;
        candidateId?: string;
    };
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
} : {
    type?: "cliUser";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    id?: string;
    orgRoleId?: string;
    deactivatedAt?: number;
    orgRoleUpdatedAt?: number;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    creatorId?: string;
    isRoot?: true;
    revokedRootAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    creatorDeviceId?: string;
})[])>, getLocalsReadableBlockCollaborators: (<UserType extends "orgUser" | "cliUser">(graph: Graph.Graph, currentUserId: string, blockId: string, userType: UserType) => (UserType extends "orgUser" ? {
    type?: "orgUser";
    email?: string;
    id?: string;
    uid?: string;
    provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
    externalAuthProviderId?: string;
    firstName?: string;
    lastName?: string;
    invitedById?: string;
    isCreator?: boolean;
    inviteAcceptedAt?: number;
    orgRoleId?: string;
    deactivatedAt?: number;
    orgRoleUpdatedAt?: number;
    scim?: {
        providerId?: string;
        candidateId?: string;
    };
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
} : {
    type?: "cliUser";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    id?: string;
    orgRoleId?: string;
    deactivatedAt?: number;
    orgRoleUpdatedAt?: number;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    creatorId?: string;
    isRoot?: true;
    revokedRootAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    creatorDeviceId?: string;
})[]) & import("memoizee").Memoized<(<UserType extends "orgUser" | "cliUser">(graph: Graph.Graph, currentUserId: string, blockId: string, userType: UserType) => (UserType extends "orgUser" ? {
    type?: "orgUser";
    email?: string;
    id?: string;
    uid?: string;
    provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
    externalAuthProviderId?: string;
    firstName?: string;
    lastName?: string;
    invitedById?: string;
    isCreator?: boolean;
    inviteAcceptedAt?: number;
    orgRoleId?: string;
    deactivatedAt?: number;
    orgRoleUpdatedAt?: number;
    scim?: {
        providerId?: string;
        candidateId?: string;
    };
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
} : {
    type?: "cliUser";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    id?: string;
    orgRoleId?: string;
    deactivatedAt?: number;
    orgRoleUpdatedAt?: number;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    creatorId?: string;
    isRoot?: true;
    revokedRootAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    creatorDeviceId?: string;
})[])>;
//# sourceMappingURL=blocks.d.ts.map