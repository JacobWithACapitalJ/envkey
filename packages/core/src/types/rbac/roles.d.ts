import * as z from "zod";
export declare const RoleBaseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    orderIndex: z.ZodNumber;
}, {
    strict: true;
}, {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
}>, RoleDefaultPropsSchema: z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    defaultDescription: z.ZodString;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
}>, z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
    defaultDescription: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
}>]>, DefaultableRoleSchema: z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    orderIndex: z.ZodNumber;
}, {
    strict: true;
}, {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
}>, z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    defaultDescription: z.ZodString;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
}>, z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
    defaultDescription: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
}>]>>, DefaultableRoleWithPermissions: <ZodSchemaType extends z.ZodEnum<any>>(permissionsSchema: ZodSchemaType) => z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    orderIndex: z.ZodNumber;
}, {
    strict: true;
}, {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
}>, z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    defaultDescription: z.ZodString;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
}>, z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
    defaultDescription: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
}>]>>, z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    permissions: z.ZodUndefined;
    extendsRoleId: z.ZodUndefined;
    addPermissions: z.ZodUndefined;
    removePermissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
}>, z.ZodIntersection<z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
}>, z.ZodUnion<[z.ZodObject<{
    permissions: z.ZodArray<ZodSchemaType>;
    extendsRoleId: z.ZodUndefined;
    addPermissions: z.ZodUndefined;
    removePermissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    permissions?: ZodSchemaType["_type"][];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
}>, z.ZodObject<{
    extendsRoleId: z.ZodString;
    addPermissions: z.ZodArray<ZodSchemaType>;
    removePermissions: z.ZodArray<ZodSchemaType>;
    permissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ZodSchemaType["_type"][];
    removePermissions?: ZodSchemaType["_type"][];
}>]>>]>>, WithPermissions: <ZodSchemaType extends z.ZodEnum<any>>(permissionsSchema: ZodSchemaType) => z.ZodUnion<[z.ZodObject<{
    permissions: z.ZodArray<ZodSchemaType>;
    extendsRoleId: z.ZodUndefined;
    addPermissions: z.ZodUndefined;
    removePermissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    permissions?: ZodSchemaType["_type"][];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
}>, z.ZodObject<{
    extendsRoleId: z.ZodString;
    addPermissions: z.ZodArray<ZodSchemaType>;
    removePermissions: z.ZodArray<ZodSchemaType>;
    permissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ZodSchemaType["_type"][];
    removePermissions?: ZodSchemaType["_type"][];
}>]>, WithOptionalPermissions: <ZodSchemaType extends z.ZodEnum<any>>(permissionsSchema: ZodSchemaType) => z.ZodUnion<[z.ZodObject<{
    permissions: z.ZodUnion<[z.ZodUnion<[z.ZodArray<ZodSchemaType>, z.ZodUndefined]>, z.ZodUndefined]>;
    extendsRoleId: z.ZodUnion<[z.ZodUndefined, z.ZodUndefined]>;
    addPermissions: z.ZodUnion<[z.ZodUndefined, z.ZodUndefined]>;
    removePermissions: z.ZodUnion<[z.ZodUndefined, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    permissions?: ZodSchemaType["_type"][];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
}>, z.ZodObject<{
    extendsRoleId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    addPermissions: z.ZodUnion<[z.ZodArray<ZodSchemaType>, z.ZodUndefined]>;
    removePermissions: z.ZodUnion<[z.ZodArray<ZodSchemaType>, z.ZodUndefined]>;
    permissions: z.ZodUnion<[z.ZodUndefined, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ZodSchemaType["_type"][];
    removePermissions?: ZodSchemaType["_type"][];
}>]>, OrgRoleCanManageSchema: z.ZodUnion<[z.ZodObject<{
    canManageAllOrgRoles: z.ZodLiteral<true>;
    canManageOrgRoleIds: z.ZodUndefined;
}, {
    strict: true;
}, {
    canManageAllOrgRoles?: true;
    canManageOrgRoleIds?: undefined;
}>, z.ZodObject<{
    canManageAllOrgRoles: z.ZodUndefined;
    canManageOrgRoleIds: z.ZodArray<z.ZodString>;
}, {
    strict: true;
}, {
    canManageAllOrgRoles?: undefined;
    canManageOrgRoleIds?: string[];
}>]>, OrgRoleOptionalCanManageSchema: z.ZodUnion<[z.ZodObject<{
    canManageAllOrgRoles: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    canManageOrgRoleIds: z.ZodUnion<[z.ZodUndefined, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    canManageAllOrgRoles?: true;
    canManageOrgRoleIds?: undefined;
}>, z.ZodObject<{
    canManageAllOrgRoles: z.ZodUnion<[z.ZodUndefined, z.ZodUndefined]>;
    canManageOrgRoleIds: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    canManageAllOrgRoles?: undefined;
    canManageOrgRoleIds?: string[];
}>]>, OrgRoleCanInviteSchema: z.ZodUnion<[z.ZodObject<{
    canInviteAllOrgRoles: z.ZodLiteral<true>;
    canInviteOrgRoleIds: z.ZodUndefined;
}, {
    strict: true;
}, {
    canInviteAllOrgRoles?: true;
    canInviteOrgRoleIds?: undefined;
}>, z.ZodObject<{
    canInviteAllOrgRoles: z.ZodUndefined;
    canInviteOrgRoleIds: z.ZodArray<z.ZodString>;
}, {
    strict: true;
}, {
    canInviteAllOrgRoles?: undefined;
    canInviteOrgRoleIds?: string[];
}>]>, OrgRoleOptionalCanInviteSchema: z.ZodUnion<[z.ZodObject<{
    canInviteAllOrgRoles: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    canInviteOrgRoleIds: z.ZodUnion<[z.ZodUndefined, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    canInviteAllOrgRoles?: true;
    canInviteOrgRoleIds?: undefined;
}>, z.ZodObject<{
    canInviteAllOrgRoles: z.ZodUnion<[z.ZodUndefined, z.ZodUndefined]>;
    canInviteOrgRoleIds: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    canInviteAllOrgRoles?: undefined;
    canInviteOrgRoleIds?: string[];
}>]>, OrgRoleBaseSchema: z.ZodObject<{
    type: z.ZodLiteral<"orgRole">;
    autoAppRoleId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    canHaveCliUsers: z.ZodBoolean;
}, {
    strict: true;
}, {
    type?: "orgRole";
    autoAppRoleId?: string;
    canHaveCliUsers?: boolean;
}>;
export declare const OrgRoleSchema: z.ZodIntersection<z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    orderIndex: z.ZodNumber;
}, {
    strict: true;
}, {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
}>, z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    defaultDescription: z.ZodString;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
}>, z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
    defaultDescription: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
}>]>>, z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    permissions: z.ZodUndefined;
    extendsRoleId: z.ZodUndefined;
    addPermissions: z.ZodUndefined;
    removePermissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
}>, z.ZodIntersection<z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
}>, z.ZodUnion<[z.ZodObject<{
    permissions: z.ZodArray<z.ZodEnum<["org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", "org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", ...("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[]]>>;
    extendsRoleId: z.ZodUndefined;
    addPermissions: z.ZodUndefined;
    removePermissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    permissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
}>, z.ZodObject<{
    extendsRoleId: z.ZodString;
    addPermissions: z.ZodArray<z.ZodEnum<["org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", "org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", ...("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[]]>>;
    removePermissions: z.ZodArray<z.ZodEnum<["org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", "org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", ...("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[]]>>;
    permissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
    removePermissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
}>]>>]>>, z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
    type: z.ZodLiteral<"orgRole">;
    autoAppRoleId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    canHaveCliUsers: z.ZodBoolean;
}, {
    strict: true;
}, {
    type?: "orgRole";
    autoAppRoleId?: string;
    canHaveCliUsers?: boolean;
}>, z.ZodUnion<[z.ZodObject<{
    canManageAllOrgRoles: z.ZodLiteral<true>;
    canManageOrgRoleIds: z.ZodUndefined;
}, {
    strict: true;
}, {
    canManageAllOrgRoles?: true;
    canManageOrgRoleIds?: undefined;
}>, z.ZodObject<{
    canManageAllOrgRoles: z.ZodUndefined;
    canManageOrgRoleIds: z.ZodArray<z.ZodString>;
}, {
    strict: true;
}, {
    canManageAllOrgRoles?: undefined;
    canManageOrgRoleIds?: string[];
}>]>>, z.ZodUnion<[z.ZodObject<{
    canInviteAllOrgRoles: z.ZodLiteral<true>;
    canInviteOrgRoleIds: z.ZodUndefined;
}, {
    strict: true;
}, {
    canInviteAllOrgRoles?: true;
    canInviteOrgRoleIds?: undefined;
}>, z.ZodObject<{
    canInviteAllOrgRoles: z.ZodUndefined;
    canInviteOrgRoleIds: z.ZodArray<z.ZodString>;
}, {
    strict: true;
}, {
    canInviteAllOrgRoles?: undefined;
    canInviteOrgRoleIds?: string[];
}>]>>>;
export type OrgRole = z.infer<typeof OrgRoleSchema>;
export declare const AppRoleBaseSchema: z.ZodObject<{
    type: z.ZodLiteral<"appRole">;
    defaultAllApps: z.ZodBoolean;
    canHaveCliUsers: z.ZodBoolean;
    canManageAppRoleIds: z.ZodArray<z.ZodString>;
    canInviteAppRoleIds: z.ZodArray<z.ZodString>;
    hasFullEnvironmentPermissions: z.ZodBoolean;
}, {
    strict: true;
}, {
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
}>;
export declare const AppRoleSchema: z.ZodIntersection<z.ZodObject<{
    type: z.ZodLiteral<"appRole">;
    defaultAllApps: z.ZodBoolean;
    canHaveCliUsers: z.ZodBoolean;
    canManageAppRoleIds: z.ZodArray<z.ZodString>;
    canInviteAppRoleIds: z.ZodArray<z.ZodString>;
    hasFullEnvironmentPermissions: z.ZodBoolean;
}, {
    strict: true;
}, {
    type?: "appRole";
    canHaveCliUsers?: boolean;
    defaultAllApps?: boolean;
    canManageAppRoleIds?: string[];
    canInviteAppRoleIds?: string[];
    hasFullEnvironmentPermissions?: boolean;
}>, z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    orderIndex: z.ZodNumber;
}, {
    strict: true;
}, {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
}>, z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    defaultDescription: z.ZodString;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
}>, z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
    defaultDescription: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
}>]>>, z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    permissions: z.ZodUndefined;
    extendsRoleId: z.ZodUndefined;
    addPermissions: z.ZodUndefined;
    removePermissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    permissions?: undefined;
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
}>, z.ZodIntersection<z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
}>, z.ZodUnion<[z.ZodObject<{
    permissions: z.ZodArray<z.ZodEnum<["app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", "app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", ...("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[]]>>;
    extendsRoleId: z.ZodUndefined;
    addPermissions: z.ZodUndefined;
    removePermissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    extendsRoleId?: undefined;
    addPermissions?: undefined;
    removePermissions?: undefined;
}>, z.ZodObject<{
    extendsRoleId: z.ZodString;
    addPermissions: z.ZodArray<z.ZodEnum<["app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", "app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", ...("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[]]>>;
    removePermissions: z.ZodArray<z.ZodEnum<["app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", "app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", ...("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[]]>>;
    permissions: z.ZodUndefined;
}, {
    strict: true;
}, {
    permissions?: undefined;
    extendsRoleId?: string;
    addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
}>]>>]>>>;
export type AppRole = z.infer<typeof AppRoleSchema>;
export declare const EnvironmentRoleSettingsSchema: z.ZodObject<{
    autoCommit: z.ZodBoolean;
}, {
    strict: true;
}, {
    autoCommit?: boolean;
}>, EnvironmentRoleBaseSchema: z.ZodObject<{
    type: z.ZodLiteral<"environmentRole">;
    hasLocalKeys: z.ZodBoolean;
    hasServers: z.ZodBoolean;
    defaultAllApps: z.ZodBoolean;
    defaultAllBlocks: z.ZodBoolean;
    orderIndex: z.ZodNumber;
    settings: z.ZodObject<{
        autoCommit: z.ZodBoolean;
    }, {
        strict: true;
    }, {
        autoCommit?: boolean;
    }>;
    importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    type?: "environmentRole";
    importId?: string;
    orderIndex?: number;
    settings?: {
        autoCommit?: boolean;
    };
    defaultAllApps?: boolean;
    hasLocalKeys?: boolean;
    hasServers?: boolean;
    defaultAllBlocks?: boolean;
}>;
export declare const EnvironmentRoleSchema: z.ZodIntersection<z.ZodObject<{
    type: z.ZodLiteral<"environmentRole">;
    hasLocalKeys: z.ZodBoolean;
    hasServers: z.ZodBoolean;
    defaultAllApps: z.ZodBoolean;
    defaultAllBlocks: z.ZodBoolean;
    orderIndex: z.ZodNumber;
    settings: z.ZodObject<{
        autoCommit: z.ZodBoolean;
    }, {
        strict: true;
    }, {
        autoCommit?: boolean;
    }>;
    importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    type?: "environmentRole";
    importId?: string;
    orderIndex?: number;
    settings?: {
        autoCommit?: boolean;
    };
    defaultAllApps?: boolean;
    hasLocalKeys?: boolean;
    hasServers?: boolean;
    defaultAllBlocks?: boolean;
}>, z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    orderIndex: z.ZodNumber;
}, {
    strict: true;
}, {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    orderIndex?: number;
    name?: string;
    description?: string;
}>, z.ZodUnion<[z.ZodObject<{
    isDefault: z.ZodLiteral<true>;
    defaultName: z.ZodString;
    defaultDescription: z.ZodString;
}, {
    strict: true;
}, {
    isDefault?: true;
    defaultName?: string;
    defaultDescription?: string;
}>, z.ZodObject<{
    isDefault: z.ZodLiteral<false>;
    defaultName: z.ZodUndefined;
    defaultDescription: z.ZodUndefined;
}, {
    strict: true;
}, {
    isDefault?: false;
    defaultName?: undefined;
    defaultDescription?: undefined;
}>]>>>;
export type EnvironmentRole = z.infer<typeof EnvironmentRoleSchema>;
export declare const AppRoleEnvironmentRoleSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"appRoleEnvironmentRole">;
    appRoleId: z.ZodString;
    permissions: z.ZodArray<z.ZodEnum<["write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", "write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", ...("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[]]>>;
    environmentRoleId: z.ZodString;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    type?: "appRoleEnvironmentRole";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
    appRoleId?: string;
    environmentRoleId?: string;
}>;
export type AppRoleEnvironmentRole = z.infer<typeof AppRoleEnvironmentRoleSchema>;
export type LabeledEnvironmentRole = Pick<EnvironmentRole, "id" | "name">;
//# sourceMappingURL=roles.d.ts.map