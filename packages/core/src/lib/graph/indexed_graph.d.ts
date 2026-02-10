import { Graph, Model } from "../../types";
export declare const environmentCompositeId: (environment: Model.Environment) => string, getOrgUsersByOrgRoleId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>>, getCliUsersByOrgRoleId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>>, getOrgRolesByAutoAppRoleId: ((graph: Graph.Graph) => Graph.MaybeGrouped<(({
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
}))>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<(({
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
}))>>, getOrgRolesByExtendsId: ((graph: Graph.Graph) => Graph.MaybeGrouped<(({
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
}))>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<(({
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
}))>>, getAppRolesByExtendsId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}))))>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}))))>>, getOrgUserDevicesByUserId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
})>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
})>>, getActiveOrgUserDevicesByUserId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
})>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
})>>, getActiveInvites: ((graph: Graph.Graph, now: number) => {
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => {
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}[]>, getActiveOrgUsers: ((graph: Graph.Graph) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph) => {
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
}[]>, getActiveOrInvitedOrgUsers: ((graph: Graph.Graph) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph) => {
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
}[]>, getActiveCliUsers: ((graph: Graph.Graph) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph) => {
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
}[]>, getActiveOrExpiredInvites: ((graph: Graph.Graph) => {
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}[]) & import("memoizee").Memoized<(graph: Graph.Graph) => {
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}[]>, getActiveDeviceGrants: ((graph: Graph.Graph, now: number) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => {
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
}[]>, getNumActiveDeviceLike: ((graph: Graph.Graph, now: number) => number) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => number>, getNumActiveOrInvitedUsers: ((graph: Graph.Graph, now: number) => number) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => number>, getExpiredDeviceGrants: ((graph: Graph.Graph, now: number) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => {
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
}[]>, getActiveOrExpiredDeviceGrants: ((graph: Graph.Graph) => {
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
}[]) & import("memoizee").Memoized<(graph: Graph.Graph) => {
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
}[]>, getActiveInvitesByInviteeId: ((graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}>) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}>>, getActiveOrExpiredInvitesByInviteeId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}>>, getActiveDeviceGrantsByGranteeId: ((graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
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
}>>, getExpiredDeviceGrantsByGranteeId: ((graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
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
}>>, getActiveOrExpiredDeviceGrantsByGranteeId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>>, getActiveInvitesByInvitedByUserId: ((graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}>) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}>>, getActiveOrExpiredInvitesByInvitedByUserId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "invite";
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
    expiresAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    inviteeId?: string;
    invitedByUserId?: string;
    invitedByDeviceId?: string;
    signedById?: string;
    acceptedAt?: number;
    v1Invite?: boolean;
}>>, getActiveDeviceGrantsByGrantedByUserId: ((graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph, now: number) => Graph.MaybeGrouped<{
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
}>>, getActiveOrExpiredDeviceGrantsByGrantedByUserId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>>, getActiveRecoveryKeys: ((graph: Graph.Graph) => {
    type?: "recoveryKey";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    userId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    creatorDeviceId?: string;
    redeemedAt?: number;
}[]) & import("memoizee").Memoized<(graph: Graph.Graph) => {
    type?: "recoveryKey";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    userId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    creatorDeviceId?: string;
    redeemedAt?: number;
}[]>, getActiveRecoveryKeysByUserId: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "recoveryKey";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    userId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    creatorDeviceId?: string;
    redeemedAt?: number;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "recoveryKey";
    pubkey?: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    userId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    pubkeyId?: string;
    pubkeyUpdatedAt?: number;
    signedById?: string;
    creatorDeviceId?: string;
    redeemedAt?: number;
}>>, getAppUserGrantsByUserId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appUserGrant";
    userId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appUserGrant";
    userId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>>, getAppUserGrantsByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appUserGrant";
    userId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appUserGrant";
    userId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>>, getAppUserGrantsByAppRoleId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appUserGrant";
    userId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appUserGrant";
    userId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>>, getAppRoleEnvironmentRolesByAppRoleId: ((graph: Graph.Graph) => Graph.Grouped<{
    type?: "appRoleEnvironmentRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
    appRoleId?: string;
    environmentRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.Grouped<{
    type?: "appRoleEnvironmentRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
    appRoleId?: string;
    environmentRoleId?: string;
}>>, getAppRoleEnvironmentRolesByEnvironmentRoleId: ((graph: Graph.Graph) => Graph.Grouped<{
    type?: "appRoleEnvironmentRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
    appRoleId?: string;
    environmentRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.Grouped<{
    type?: "appRoleEnvironmentRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
    appRoleId?: string;
    environmentRoleId?: string;
}>>, getAppRoleEnvironmentRolesByComposite: ((graph: Graph.Graph) => Graph.Indexed<{
    type?: "appRoleEnvironmentRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
    appRoleId?: string;
    environmentRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.Indexed<{
    type?: "appRoleEnvironmentRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
    appRoleId?: string;
    environmentRoleId?: string;
}>>, getAppBlocksByBlockId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appBlock";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appBlock";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockId?: string;
}>>, getAppBlocksByAppId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appBlock";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appBlock";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockId?: string;
}>>, getAppBlocksByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appBlock";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appBlock";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockId?: string;
}>>, getEnvironmentsByEnvParentId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
})>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
})>>, getEnvironmentsByRoleId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
})>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
})>>, getSubEnvironmentsByParentEnvironmentId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>>, getLocalKeysByEnvironmentId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>>, getLocalKeysByUserId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>>, getLocalKeysByDeviceId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>>, getLocalKeysByEnvironmentComposite: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>>, getLocalKeysByLocalsComposite: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "localKey";
    userId?: string;
    deviceId?: string;
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
    autoGenerated?: true;
    isV1UpgradeKey?: true;
}>>, getServersByEnvironmentId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "server";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "server";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    appId?: string;
    environmentId?: string;
}>>, getIncludedAppRolesByAppId: ((graph: Graph.Graph) => Graph.Grouped<{
    type?: "includedAppRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.Grouped<{
    type?: "includedAppRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>>, getIncludedAppRolesByAppRoleId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "includedAppRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "includedAppRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>>, getIncludedAppRolesByComposite: ((graph: Graph.Graph) => Graph.Indexed<{
    type?: "includedAppRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.Indexed<{
    type?: "includedAppRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
}>>, getActiveGeneratedEnvkeysByKeyableParentId: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
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
}>>, getActiveGeneratedEnvkeysByAppId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
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
}>>, getGroupsByObjectType: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "group";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    objectType?: "orgUser" | "app" | "block";
    membershipsUpdatedAt?: number;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "group";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    objectType?: "orgUser" | "app" | "block";
    membershipsUpdatedAt?: number;
}>>, getGroupMembershipsByObjectId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "groupMembership";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    groupId?: string;
    objectId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "groupMembership";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    groupId?: string;
    objectId?: string;
}>>, getGroupMembershipsByGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "groupMembership";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    groupId?: string;
    objectId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "groupMembership";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    groupId?: string;
    objectId?: string;
}>>, getGroupMembershipsByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "groupMembership";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    groupId?: string;
    objectId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "groupMembership";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    groupId?: string;
    objectId?: string;
}>>, getAppUserGroupsByAppId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appUserGroup";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
    userGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appUserGroup";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
    userGroupId?: string;
}>>, getAppUserGroupsByGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appUserGroup";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
    userGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appUserGroup";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
    userGroupId?: string;
}>>, getAppUserGroupsByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appUserGroup";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
    userGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appUserGroup";
    id?: string;
    importId?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appId?: string;
    appRoleId?: string;
    userGroupId?: string;
}>>, getAppGroupUserGroupsByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appGroupUserGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    userGroupId?: string;
    appGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appGroupUserGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    userGroupId?: string;
    appGroupId?: string;
}>>, getAppGroupUserGroupsByAppGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupUserGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    userGroupId?: string;
    appGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupUserGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    userGroupId?: string;
    appGroupId?: string;
}>>, getAppGroupUserGroupsByUserGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupUserGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    userGroupId?: string;
    appGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupUserGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    userGroupId?: string;
    appGroupId?: string;
}>>, getAppGroupUsersByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appGroupUser";
    userId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    appGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appGroupUser";
    userId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    appGroupId?: string;
}>>, getAppGroupUsersByAppGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupUser";
    userId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    appGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupUser";
    userId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    appRoleId?: string;
    appGroupId?: string;
}>>, getAppBlockGroupsByAppId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockGroupId?: string;
}>>, getAppBlockGroupsByBlockGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockGroupId?: string;
}>>, getAppBlockGroupsByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appId?: string;
    blockGroupId?: string;
}>>, getAppGroupBlockGroupsByAppGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appGroupId?: string;
    blockGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appGroupId?: string;
    blockGroupId?: string;
}>>, getAppGroupBlockGroupsByBlockGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appGroupId?: string;
    blockGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appGroupId?: string;
    blockGroupId?: string;
}>>, getAppGroupBlockGroupsByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appGroupBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appGroupId?: string;
    blockGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appGroupBlockGroup";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    appGroupId?: string;
    blockGroupId?: string;
}>>, getAppGroupBlocksByAppGroupId: ((graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupBlock";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    blockId?: string;
    appGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeGrouped<{
    type?: "appGroupBlock";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    blockId?: string;
    appGroupId?: string;
}>>, getAppGroupBlocksByComposite: ((graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appGroupBlock";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    blockId?: string;
    appGroupId?: string;
}>) & import("memoizee").Memoized<(graph: Graph.Graph) => Graph.MaybeIndexed<{
    type?: "appGroupBlock";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    blockId?: string;
    appGroupId?: string;
}>>;
//# sourceMappingURL=indexed_graph.d.ts.map