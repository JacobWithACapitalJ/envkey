import { Graph } from "../../../../types";
export declare const getDeviceApprovableUsers: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getRevokableDeviceGrants: ((graph: Graph.Graph, currentUserId: string) => {
    type?: "deviceGrant";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    deviceId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    acceptedAt?: number;
    granteeId?: string;
    grantedByUserId?: string;
    grantedByDeviceId?: string;
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
    type?: "deviceGrant";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    deviceId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    acceptedAt?: number;
    granteeId?: string;
    grantedByUserId?: string;
    grantedByDeviceId?: string;
}[]>, getRevokableDevices: ((graph: Graph.Graph, currentUserId: string) => ({
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
}))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => ({
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
}))[]>;
//# sourceMappingURL=devices.d.ts.map