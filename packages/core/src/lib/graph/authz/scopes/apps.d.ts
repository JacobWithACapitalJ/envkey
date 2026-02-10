import { Graph, Model, Rbac } from "../../../../types";
export declare const getAppsWithAllPermissions: ((graph: Graph.Graph, currentUserId: string, appPermissions: Rbac.AppPermission[]) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appPermissions: Rbac.AppPermission[]) => {
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
}[]>, getAppsWithAnyPermissions: ((graph: Graph.Graph, currentUserId: string, appPermissions: Rbac.AppPermission[]) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appPermissions: Rbac.AppPermission[]) => {
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
}[]>, getRenameableApps: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getSettingsUpdatableApps: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getDeletableApps: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getAccessGrantableApps: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getAccessGrantableUsersForApp: ((graph: Graph.Graph, currentUserId: string, appId: string) => (Model.OrgUser | Model.CliUser)[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => (Model.OrgUser | Model.CliUser)[]>, getAccessGrantableUserGroupsForApp: ((graph: Graph.Graph, currentUserId: string, appId: string) => {
    type?: "group";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    objectType?: "orgUser" | "app" | "block";
    membershipsUpdatedAt?: number;
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => {
    type?: "group";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    objectType?: "orgUser" | "app" | "block";
    membershipsUpdatedAt?: number;
}[]>, getAccessGrantableOrgUsersForApp: ((graph: Graph.Graph, currentUserId: string, appId: string, now: number) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string, now: number) => {
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
}[]>, getAccessGrantableCliUsersForApp: ((graph: Graph.Graph, currentUserId: string, appId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => {
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
}[]>, getAccessGrantableAppRolesForUser: ((graph: Graph.Graph, currentUserId: string, appId: string, userId: string) => ({
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
} & (({
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
} & ({
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
} | {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
})) & ({
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | ({
    isDefault?: false;
    defaultName?: undefined;
} & ({
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
})))))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string, userId: string) => ({
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
} & (({
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
} & ({
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
} | {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
})) & ({
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | ({
    isDefault?: false;
    defaultName?: undefined;
} & ({
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
})))))[]>, getAccessGrantableAppRolesForUserGroup: ((graph: Graph.Graph, currentUserId: string, appId: string, userGroupId: string) => ({
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
} & (({
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
} & ({
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
} | {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
})) & ({
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | ({
    isDefault?: false;
    defaultName?: undefined;
} & ({
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
})))))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string, userGroupId: string) => ({
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
} & (({
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
} & ({
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
} | {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
})) & ({
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | ({
    isDefault?: false;
    defaultName?: undefined;
} & ({
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
})))))[]>, getAccessGrantableAppsForUserGroup: ((graph: Graph.Graph, currentUserId: string, userGroupId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, userGroupId: string) => {
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
}[]>, getAccessGrantableAppRolesForOrgRole: ((graph: Graph.Graph, currentUserId: string, appId: string, orgRoleId: string) => ({
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
} & (({
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
} & ({
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
} | {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
})) & ({
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | ({
    isDefault?: false;
    defaultName?: undefined;
} & ({
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
})))))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string, orgRoleId: string) => ({
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
} & (({
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
} & ({
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
} | {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
})) & ({
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | ({
    isDefault?: false;
    defaultName?: undefined;
} & ({
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
})))))[]>, getAccessGrantableAppRoles: ((graph: Graph.Graph, currentUserId: string, appId: string) => ({
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
} & (({
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
} & ({
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
} | {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
})) & ({
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | ({
    isDefault?: false;
    defaultName?: undefined;
} & ({
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
})))))[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => ({
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
} & (({
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
} & ({
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
} | {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
})) & ({
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | ({
    isDefault?: false;
    defaultName?: undefined;
} & ({
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
})))))[]>, getAccessRemoveableApps: ((graph: Graph.Graph, currentUserId: string) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string) => {
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
}[]>, getAccessRemoveableUsersForApp: ((graph: Graph.Graph, currentUserId: string, appId: string) => (Model.OrgUser | Model.CliUser)[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => (Model.OrgUser | Model.CliUser)[]>, getAccessRemoveableUserGroupsForApp: ((graph: Graph.Graph, currentUserId: string, appId: string) => {
    type?: "group";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    objectType?: "orgUser" | "app" | "block";
    membershipsUpdatedAt?: number;
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => {
    type?: "group";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    objectType?: "orgUser" | "app" | "block";
    membershipsUpdatedAt?: number;
}[]>, getAppCollaborators: (<UserType extends "orgUser" | "cliUser">(graph: Graph.Graph, currentUserId: string, appId: string, userType: UserType) => (UserType extends "orgUser" ? {
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
})[]) & import("memoizee").Memoized<(<UserType extends "orgUser" | "cliUser">(graph: Graph.Graph, currentUserId: string, appId: string, userType: UserType) => (UserType extends "orgUser" ? {
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
})[])>, getLocalsReadableAppCollaborators: (<UserType extends "orgUser" | "cliUser">(graph: Graph.Graph, currentUserId: string, appId: string, userType: UserType) => (UserType extends "orgUser" ? {
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
})[]) & import("memoizee").Memoized<(<UserType extends "orgUser" | "cliUser">(graph: Graph.Graph, currentUserId: string, appId: string, userType: UserType) => (UserType extends "orgUser" ? {
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
})[])>, getAppConnectedUserGroups: ((graph: Graph.Graph, currentUserId: string, appId: string) => {
    type?: "group";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    objectType?: "orgUser" | "app" | "block";
    membershipsUpdatedAt?: number;
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, currentUserId: string, appId: string) => {
    type?: "group";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    objectType?: "orgUser" | "app" | "block";
    membershipsUpdatedAt?: number;
}[]>;
//# sourceMappingURL=apps.d.ts.map