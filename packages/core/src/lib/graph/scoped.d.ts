import { Graph, Rbac } from "../../types";
export declare const getScoped: (graph: Graph.Graph, scope: Rbac.OrgAccessScope) => {
    scopeUsers: ({
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
    } | {
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
    })[];
    scopeDevices: ({
        type?: "orgUserDevice";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        userId?: string;
        id?: string;
        deactivatedAt?: number;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        isRoot?: true;
        revokedRootAt?: number;
        approvedAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
    } & ({
        approvedByType?: "creator";
    } | {
        approvedByType?: "invite";
        inviteId?: string;
    } | {
        approvedByType?: "deviceGrant";
        deviceGrantId?: string;
    } | {
        approvedByType?: "recoveryKey";
        recoveryKeyId?: string;
    }))[];
    scopeApps: {
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
    scopeBlocks: {
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
    }[];
    scopeEnvironments: ({
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
    }))[];
    scopeGeneratedEnvkeys: {
        type?: "generatedEnvkey";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        creatorId?: string;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
        appId?: string;
        environmentId?: string;
        keyableParentId?: string;
        keyableParentType?: "server" | "localKey";
        envkeyShort?: string;
        envkeyIdPartHash?: string;
        blobsUpdatedAt?: number;
    }[];
};
//# sourceMappingURL=scoped.d.ts.map