import { Graph, Rbac } from "../../../../types";
export declare const authorizeUser: <UserType extends {
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
} = {
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
}>(graph: Graph.Graph, userId: string, allowedUserTypes?: UserType["type"][]) => false | [UserType, (({
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
    permissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
} | {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
    removePermissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
})))) & (({
    type?: "orgRole";
    autoAppRoleId?: string;
    canHaveCliUsers?: boolean;
} & ({
    canManageAllOrgRoles?: true;
    canManageOrgRoleIds?: undefined;
} | {
    canManageAllOrgRoles?: undefined;
    canManageOrgRoleIds?: string[];
})) & ({
    canInviteAllOrgRoles?: true;
    canInviteOrgRoleIds?: undefined;
} | {
    canInviteAllOrgRoles?: undefined;
    canInviteOrgRoleIds?: string[];
})), Set<"org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs">], hasAllOrgPermissions: <UserType extends {
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
} = {
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
}>(graph: Graph.Graph, currentUserId: string, permissions: Rbac.OrgPermission[], allowedUserTypes?: UserType["type"][]) => boolean, hasOrgPermission: (graph: Graph.Graph, currentUserId: string, permission: Rbac.OrgPermission) => boolean, hasAnyOrgPermissions: <UserType extends {
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
} = {
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
}>(graph: Graph.Graph, currentUserId: string, permissions: Rbac.OrgPermission[], allowedUserTypes?: UserType["type"][]) => boolean, presence: <T extends Graph.GraphObject>(obj: T, type: T["type"], allowDeactivated?: boolean, allowDeleted?: boolean) => false | T, hasAllAppPermissions: (graph: Graph.Graph, currentUserId: string, appId: string, permissions: Rbac.AppPermission[]) => boolean, hasAppPermission: (graph: Graph.Graph, currentUserId: string, appId: string, permission: Rbac.AppPermission) => boolean, hasAnyAppPermissions: (graph: Graph.Graph, currentUserId: string, appId: string, permissions: Rbac.AppPermission[]) => boolean, hasAllConnectedBlockPermissions: (graph: Graph.Graph, currentUserId: string, blockId: string, permissions: Rbac.AppPermission[]) => boolean, hasConnectedBlockPermission: (graph: Graph.Graph, currentUserId: string, blockId: string, permission: Rbac.AppPermission) => boolean, hasAnyConnectedBlockPermissions: (graph: Graph.Graph, currentUserId: string, blockId: string, permissions: Rbac.AppPermission[]) => boolean;
//# sourceMappingURL=helpers.d.ts.map