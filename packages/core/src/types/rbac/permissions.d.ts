import * as z from "zod";
export declare const orgPermissions: {
    org_rename: {
        description: string;
    };
    org_manage_settings: {
        description: string;
    };
    org_manage_auth_settings: {
        description: string;
    };
    org_manage_billing: {
        description: string;
    };
    org_manage_users: {
        description: string;
    };
    org_manage_user_devices: {
        description: string;
    };
    org_invite_users_to_permitted_apps: {
        description: string;
    };
    org_approve_devices_for_permitted: {
        description: string;
    };
    org_manage_cli_users: {
        description: string;
    };
    org_create_cli_users_for_permitted_apps: {
        description: string;
    };
    org_manage_app_roles: {
        description: string;
    };
    org_manage_org_roles: {
        description: string;
    };
    org_manage_environment_roles: {
        description: string;
    };
    org_manage_teams: {
        description: string;
    };
    org_manage_app_groups: {
        description: string;
    };
    org_manage_block_groups: {
        description: string;
    };
    org_read_logs: {
        description: string;
    };
    org_manage_firewall: {
        description: string;
    };
    org_generate_recovery_key: {
        description: string;
    };
    org_clear_tokens: {
        description: string;
    };
    org_archive_import_export: {
        description: string;
    };
    org_manage_integrations: {
        description: string;
    };
    org_delete: {
        description: string;
    };
    apps_create: {
        description: string;
    };
    apps_delete: {
        description: string;
    };
    apps_read_permitted: {
        description: string;
    };
    blocks_create: {
        description: string;
    };
    blocks_read_all: {
        description: string;
    };
    blocks_rename: {
        description: string;
    };
    blocks_manage_settings: {
        description: string;
    };
    blocks_write_envs_all: {
        description: string;
    };
    blocks_write_envs_permitted: {
        description: string;
    };
    blocks_manage_connections_permitted: {
        description: string;
    };
    blocks_manage_environments: {
        description: string;
    };
    blocks_delete: {
        description: string;
    };
    self_hosted_upgrade: {
        description: string;
    };
    self_hosted_manage_host: {
        description: string;
    };
    self_hosted_read_host_logs: {
        description: string;
    };
}, appPermissions: {
    app_read: {
        description: string;
    };
    app_rename: {
        description: string;
    };
    app_manage_settings: {
        description: string;
    };
    app_manage_users: {
        description: string;
    };
    app_approve_user_devices: {
        description: string;
    };
    app_manage_cli_users: {
        description: string;
    };
    app_read_own_locals: {
        description: string;
    };
    app_read_user_locals: {
        description: string;
    };
    app_read_user_locals_history: {
        description: string;
    };
    app_write_user_locals: {
        description: string;
    };
    app_manage_blocks: {
        description: string;
    };
    app_manage_environments: {
        description: string;
    };
    app_manage_servers: {
        description: string;
    };
    app_manage_local_keys: {
        description: string;
    };
    app_read_logs: {
        description: string;
    };
    app_manage_included_roles: {
        description: string;
    };
    app_manage_firewall: {
        description: string;
    };
}, environmentWritePermissions: {
    write: {
        description: string;
    };
    write_branches: {
        description: string;
    };
}, environmentReadPermissions: {
    read: {
        description: string;
    };
    read_inherits: {
        description: string;
    };
    read_meta: {
        description: string;
    };
    read_history: {
        description: string;
    };
    read_branches: {
        description: string;
    };
    read_branches_inherits: {
        description: string;
    };
    read_branches_meta: {
        description: string;
    };
    read_branches_history: {
        description: string;
    };
}, environmentPermissions: {
    read: {
        description: string;
    };
    read_inherits: {
        description: string;
    };
    read_meta: {
        description: string;
    };
    read_history: {
        description: string;
    };
    read_branches: {
        description: string;
    };
    read_branches_inherits: {
        description: string;
    };
    read_branches_meta: {
        description: string;
    };
    read_branches_history: {
        description: string;
    };
    write: {
        description: string;
    };
    write_branches: {
        description: string;
    };
};
export declare const OrgPermissionSchema: z.ZodEnum<["org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", "org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", ...("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[]]>;
export type OrgPermission = z.infer<typeof OrgPermissionSchema>;
export declare const AppPermissionSchema: z.ZodEnum<["app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", "app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", ...("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[]]>;
export type AppPermission = z.infer<typeof AppPermissionSchema>;
export declare const EnvironmentWritePermissionSchema: z.ZodEnum<["write" | "write_branches", "write" | "write_branches", ...("write" | "write_branches")[]]>;
export type EnvironmentWritePermission = z.infer<typeof EnvironmentWritePermissionSchema>;
export declare const EnvironmentReadPermissionSchema: z.ZodEnum<["read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", ...("read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[]]>;
export type EnvironmentReadPermission = z.infer<typeof EnvironmentReadPermissionSchema>;
export declare const EnvironmentPermissionSchema: z.ZodEnum<["write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", "write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", ...("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[]]>;
export type EnvironmentPermission = z.infer<typeof EnvironmentPermissionSchema>;
export declare const EnvironmentPermissionsSchema: z.ZodRecord<z.ZodArray<z.ZodEnum<["write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", "write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", ...("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[]]>>>;
export type EnvironmentPermissions = z.infer<typeof EnvironmentPermissionsSchema>;
export declare const EnvironmentReadPermissionsSchema: z.ZodRecord<z.ZodArray<z.ZodEnum<["read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", ...("read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[]]>>>;
export type EnvironmentReadPermissions = z.infer<typeof EnvironmentReadPermissionsSchema>;
export declare const EnvironmentWritePermissionsSchema: z.ZodRecord<z.ZodArray<z.ZodEnum<["write" | "write_branches", "write" | "write_branches", ...("write" | "write_branches")[]]>>>;
export type EnvironmentWritePermissions = z.infer<typeof EnvironmentWritePermissionsSchema>;
export declare const DEFAULT_ORG_BASIC_USER_PERMISSIONS: OrgPermission[], DEFAULT_ORG_ADMIN_PERMISSIONS: OrgPermission[], DEFAULT_ORG_OWNER_PERMISSIONS: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[], DEFAULT_APP_DEVELOPER_PERMISSIONS: AppPermission[], DEFAULT_APP_DEVOPS_PERMISSIONS: AppPermission[], DEFAULT_APP_ADMIN_PERMISSIONS: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[], ENV_READ_PERMISSIONS: EnvironmentPermission[], SUB_ENV_READ_PERMISSIONS: EnvironmentPermission[], ENV_WRITE_PERMISSIONS: EnvironmentPermission[], SUB_ENV_WRITE_PERMISSIONS: EnvironmentPermission[], ENVIRONMENT_READ_WRITE_PERMISSIONS: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[], ENVIRONMENT_DEVOPS_PERMISSIONS: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[], ENVIRONMENT_FULL_PERMISSIONS: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[], ENVIRONMENT_META_ONLY_PERMISSIONS: EnvironmentPermission[], ORG_PERMISSIONS_BY_DEFAULT_ROLE: {
    [name: string]: OrgPermission[];
}, APP_PERMISSIONS_BY_DEFAULT_ROLE: {
    [name: string]: AppPermission[];
}, ENVIRONMENT_PERMISSIONS_BY_DEFAULT_ROLE: {
    [name: string]: {
        [name: string]: EnvironmentPermission[];
    };
};
//# sourceMappingURL=permissions.d.ts.map