import { Graph, Rbac, Model } from "../../types";
export declare const getOrgPermissions: ((graph: Graph.Graph, orgRoleId: string) => Set<Rbac.OrgPermission>) & import("memoizee").Memoized<(graph: Graph.Graph, orgRoleId: string) => Set<Rbac.OrgPermission>>, getAppPermissions: ((graph: Graph.Graph, appRoleId: string) => Set<Rbac.AppPermission>) & import("memoizee").Memoized<(graph: Graph.Graph, appRoleId: string) => Set<Rbac.AppPermission>>, getEnvironmentPermissions: ((graph: Graph.Graph, environmentId: string, userId?: string, accessParams?: Model.AccessParams) => Set<Rbac.EnvironmentPermission>) & import("memoizee").Memoized<(graph: Graph.Graph, environmentId: string, userId?: string, accessParams?: Model.AccessParams) => Set<Rbac.EnvironmentPermission>>, getAppRoleEnvironmentRolePermissions: (graph: Graph.Graph, appRoleId: string, environmentRoleId: string) => Rbac.EnvironmentPermission[], getUserAppRolesByAppId: (graph: Graph.Graph, userId: string) => {
    [appId: string]: {
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
    }))));
}, getAppRoleForUserOrInvitee: ((graph: Graph.Graph, appId: string, userId?: string, accessParams?: Model.AccessParams) => {
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
}))))) & import("memoizee").Memoized<(graph: Graph.Graph, appId: string, userId?: string, accessParams?: Model.AccessParams) => {
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
}))))>, getAppRoleForUserGroup: ((graph: Graph.Graph, appId: string, userGroupId: string) => {
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
}))))) & import("memoizee").Memoized<(graph: Graph.Graph, appId: string, userGroupId: string) => {
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
}))))>, getConnectedAppPermissionsIntersectionForBlock: ((graph: Graph.Graph, blockId: string, userId?: string, accessParams?: Model.AccessParams) => Set<"app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall">) & import("memoizee").Memoized<(graph: Graph.Graph, blockId: string, userId?: string, accessParams?: Model.AccessParams) => Set<"app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall">>, getConnectedAppPermissionsUnionForBlock: ((graph: Graph.Graph, blockId: string, userId?: string, accessParams?: Model.AccessParams) => Set<"app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall">) & import("memoizee").Memoized<(graph: Graph.Graph, blockId: string, userId?: string, accessParams?: Model.AccessParams) => Set<"app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall">>, getEnvParentPermissions: ((graph: Graph.Graph, envParentId: string, userId?: string, accessParams?: Model.AccessParams) => Set<Rbac.AppPermission>) & import("memoizee").Memoized<(graph: Graph.Graph, envParentId: string, userId?: string, accessParams?: Model.AccessParams) => Set<Rbac.AppPermission>>;
//# sourceMappingURL=permissions.d.ts.map