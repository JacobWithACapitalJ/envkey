"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENVIRONMENT_PERMISSIONS_BY_DEFAULT_ROLE = exports.APP_PERMISSIONS_BY_DEFAULT_ROLE = exports.ORG_PERMISSIONS_BY_DEFAULT_ROLE = exports.ENVIRONMENT_META_ONLY_PERMISSIONS = exports.ENVIRONMENT_FULL_PERMISSIONS = exports.ENVIRONMENT_DEVOPS_PERMISSIONS = exports.ENVIRONMENT_READ_WRITE_PERMISSIONS = exports.SUB_ENV_WRITE_PERMISSIONS = exports.ENV_WRITE_PERMISSIONS = exports.SUB_ENV_READ_PERMISSIONS = exports.ENV_READ_PERMISSIONS = exports.DEFAULT_APP_ADMIN_PERMISSIONS = exports.DEFAULT_APP_DEVOPS_PERMISSIONS = exports.DEFAULT_APP_DEVELOPER_PERMISSIONS = exports.DEFAULT_ORG_OWNER_PERMISSIONS = exports.DEFAULT_ORG_ADMIN_PERMISSIONS = exports.DEFAULT_ORG_BASIC_USER_PERMISSIONS = exports.EnvironmentWritePermissionsSchema = exports.EnvironmentReadPermissionsSchema = exports.EnvironmentPermissionsSchema = exports.EnvironmentPermissionSchema = exports.EnvironmentReadPermissionSchema = exports.EnvironmentWritePermissionSchema = exports.AppPermissionSchema = exports.OrgPermissionSchema = exports.environmentPermissions = exports.environmentReadPermissions = exports.environmentWritePermissions = exports.appPermissions = exports.orgPermissions = void 0;
const z = __importStar(require("zod"));
exports.orgPermissions = {
    org_rename: {
        description: "rename org",
    },
    org_manage_settings: {
        description: "read and update org settings",
    },
    org_manage_auth_settings: {
        description: "read and update authentication settings",
    },
    org_manage_billing: {
        description: "manage billing",
    },
    org_manage_users: {
        description: "add, update, and remove user access",
    },
    org_manage_user_devices: {
        description: "add or remove device access",
    },
    org_invite_users_to_permitted_apps: {
        description: "invite users to permitted apps",
    },
    org_approve_devices_for_permitted: {
        description: "approve device access for permitted apps",
    },
    org_manage_cli_users: {
        description: "add, update, and remove CLI key access",
    },
    org_create_cli_users_for_permitted_apps: {
        description: "create CLI keys for permitted apps",
    },
    org_manage_app_roles: {
        description: "create, update, and remove app roles",
    },
    org_manage_org_roles: {
        description: "create, update, and remove org roles",
    },
    org_manage_environment_roles: {
        description: "create, update, and remove environment roles",
    },
    org_manage_teams: {
        description: "create, update, and remove teams",
    },
    org_manage_app_groups: {
        description: "create, update, and remove app groups",
    },
    org_manage_block_groups: {
        description: "create, update, and remove block groups",
    },
    org_read_logs: {
        description: "read org logs",
    },
    org_manage_firewall: {
        description: "manage org permitted networks",
    },
    org_generate_recovery_key: {
        description: "generate recovery key",
    },
    org_clear_tokens: {
        description: "clear access tokens",
    },
    org_archive_import_export: {
        description: "import or export .envkey-archive files",
    },
    org_manage_integrations: {
        description: "manage integrations for the org",
    },
    org_delete: {
        description: "delete organization",
    },
    apps_create: {
        description: "create apps",
    },
    apps_delete: { description: "delete apps" },
    apps_read_permitted: { description: "view permitted apps" },
    blocks_create: { description: "create blocks" },
    blocks_read_all: { description: "view any block" },
    blocks_rename: { description: "rename any block" },
    blocks_manage_settings: { description: "manage any block's settings" },
    blocks_write_envs_all: { description: "update environments for any block" },
    blocks_write_envs_permitted: {
        description: "update permitted environments for permitted blocks",
    },
    blocks_manage_connections_permitted: {
        description: "connect and disconnect blocks from permitted apps",
    },
    blocks_manage_environments: {
        description: "add and remove block environments",
    },
    blocks_delete: { description: "delete any block" },
    self_hosted_upgrade: {
        description: "upgrade self-hosted EnvKey installation",
    },
    self_hosted_manage_host: {
        description: "manage self-hosted EnvKey installation",
    },
    self_hosted_read_host_logs: {
        description: "read host-level logs for a self-hosted EnvKey installation",
    },
}, exports.appPermissions = {
    app_read: { description: "view app" },
    app_rename: { description: "rename app" },
    app_manage_settings: { description: "update app settings" },
    app_manage_users: {
        description: "add, update, or remove user access",
    },
    app_approve_user_devices: { description: "approve device access" },
    app_manage_cli_users: {
        description: "add, update, or remove CLI key access",
    },
    app_read_own_locals: { description: "read their own local environment" },
    app_read_user_locals: { description: "read all users' local environments" },
    app_read_user_locals_history: {
        description: "read version history for all users' local environments",
    },
    app_write_user_locals: {
        description: "update all users' local environments",
    },
    app_manage_blocks: { description: "connect and disconnect blocks" },
    app_manage_environments: { description: "add and remove environments" },
    app_manage_servers: { description: "create and remove servers" },
    app_manage_local_keys: { description: "create and remove local keys" },
    app_read_logs: { description: "read app logs" },
    app_manage_included_roles: {
        description: "add or remove permitted app roles",
    },
    app_manage_firewall: {
        description: "manage app permitted networks",
    },
}, exports.environmentWritePermissions = {
    write: { description: "update environment" },
    write_branches: { description: "update branches" },
}, exports.environmentReadPermissions = {
    read: { description: "read environment" },
    read_inherits: { description: "read environment inheritance metadata" },
    read_meta: { description: "read environment metadata" },
    read_history: { description: "read environment version history" },
    read_branches: { description: "read branches" },
    read_branches_inherits: {
        description: "read branch inheritance metadata",
    },
    read_branches_meta: { description: "read branches' metadata" },
    read_branches_history: {
        description: "read branch version history",
    },
}, exports.environmentPermissions = Object.assign(Object.assign({}, exports.environmentWritePermissions), exports.environmentReadPermissions);
exports.OrgPermissionSchema = z.enum(Object.keys(exports.orgPermissions));
exports.AppPermissionSchema = z.enum(Object.keys(exports.appPermissions));
exports.EnvironmentWritePermissionSchema = z.enum(Object.keys(exports.environmentWritePermissions));
exports.EnvironmentReadPermissionSchema = z.enum(Object.keys(exports.environmentReadPermissions));
exports.EnvironmentPermissionSchema = z.enum(Object.keys(exports.environmentPermissions));
exports.EnvironmentPermissionsSchema = z.record(z.array(exports.EnvironmentPermissionSchema));
exports.EnvironmentReadPermissionsSchema = z.record(z.array(exports.EnvironmentReadPermissionSchema));
exports.EnvironmentWritePermissionsSchema = z.record(z.array(exports.EnvironmentWritePermissionSchema));
exports.DEFAULT_ORG_BASIC_USER_PERMISSIONS = [
    "apps_read_permitted",
    "org_invite_users_to_permitted_apps",
    "org_create_cli_users_for_permitted_apps",
    "org_approve_devices_for_permitted",
    "blocks_write_envs_permitted",
    "blocks_manage_connections_permitted",
    "org_generate_recovery_key",
], exports.DEFAULT_ORG_ADMIN_PERMISSIONS = [
    ...exports.DEFAULT_ORG_BASIC_USER_PERMISSIONS,
    "apps_create",
    "apps_delete",
    "blocks_create",
    "blocks_read_all",
    "blocks_rename",
    "blocks_manage_settings",
    "blocks_write_envs_all",
    "blocks_delete",
    "blocks_manage_environments",
    "org_manage_users",
    "org_manage_user_devices",
    "org_manage_cli_users",
    "org_read_logs",
    "org_manage_app_roles",
    "org_manage_teams",
    "org_manage_app_groups",
    "org_manage_block_groups",
    "org_manage_environment_roles",
], exports.DEFAULT_ORG_OWNER_PERMISSIONS = Object.keys(exports.orgPermissions), exports.DEFAULT_APP_DEVELOPER_PERMISSIONS = [
    "app_read",
    "app_manage_local_keys",
    "app_read_own_locals",
], exports.DEFAULT_APP_DEVOPS_PERMISSIONS = [
    ...exports.DEFAULT_APP_DEVELOPER_PERMISSIONS,
    "app_manage_blocks",
    "app_manage_servers",
], exports.DEFAULT_APP_ADMIN_PERMISSIONS = Object.keys(exports.appPermissions), exports.ENV_READ_PERMISSIONS = [
    "read",
    "read_inherits",
    "read_meta",
    "read_history",
], exports.SUB_ENV_READ_PERMISSIONS = [
    "read_branches",
    "read_branches_inherits",
    "read_branches_meta",
    "read_branches_history",
], exports.ENV_WRITE_PERMISSIONS = ["write"], exports.SUB_ENV_WRITE_PERMISSIONS = ["write_branches"], exports.ENVIRONMENT_READ_WRITE_PERMISSIONS = Array.from(new Set([
    ...exports.ENV_READ_PERMISSIONS,
    ...exports.ENV_WRITE_PERMISSIONS,
    ...exports.SUB_ENV_READ_PERMISSIONS,
])), exports.ENVIRONMENT_DEVOPS_PERMISSIONS = Array.from(new Set([
    ...exports.ENVIRONMENT_READ_WRITE_PERMISSIONS,
    ...exports.SUB_ENV_WRITE_PERMISSIONS,
])), exports.ENVIRONMENT_FULL_PERMISSIONS = Array.from(new Set([...exports.ENVIRONMENT_DEVOPS_PERMISSIONS])), exports.ENVIRONMENT_META_ONLY_PERMISSIONS = [
    "read_inherits",
    "read_meta",
    "read_branches_inherits",
    "read_branches_meta",
], exports.ORG_PERMISSIONS_BY_DEFAULT_ROLE = {
    "Basic User": exports.DEFAULT_ORG_BASIC_USER_PERMISSIONS,
    "Org Admin": exports.DEFAULT_ORG_ADMIN_PERMISSIONS,
    "Org Owner": exports.DEFAULT_ORG_OWNER_PERMISSIONS,
}, exports.APP_PERMISSIONS_BY_DEFAULT_ROLE = {
    Developer: exports.DEFAULT_APP_DEVELOPER_PERMISSIONS,
    DevOps: exports.DEFAULT_APP_DEVOPS_PERMISSIONS,
    Admin: exports.DEFAULT_APP_ADMIN_PERMISSIONS,
    "Org Admin": exports.DEFAULT_APP_ADMIN_PERMISSIONS,
    "Org Owner": exports.DEFAULT_APP_ADMIN_PERMISSIONS,
}, exports.ENVIRONMENT_PERMISSIONS_BY_DEFAULT_ROLE = {
    Developer: {
        Development: exports.ENVIRONMENT_READ_WRITE_PERMISSIONS,
        Staging: exports.ENVIRONMENT_READ_WRITE_PERMISSIONS,
        Production: exports.ENVIRONMENT_META_ONLY_PERMISSIONS,
    },
    DevOps: {
        Development: exports.ENVIRONMENT_DEVOPS_PERMISSIONS,
        Staging: exports.ENVIRONMENT_DEVOPS_PERMISSIONS,
        Production: exports.ENVIRONMENT_DEVOPS_PERMISSIONS,
    },
};
//# sourceMappingURL=permissions.js.map