"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canManageCliUser = exports.canListCliUsers = exports.canDeleteCliUser = exports.canRenameCliUser = exports.canCreateAnyCliUser = exports.canCreateCliUserForApp = exports.canCreateCliUser = void 0;
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const scopes_1 = require("../scopes");
const canCreateCliUser = (graph, currentUserId, params) => {
    // don't allow cli users to create other cli users, only org users
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId, ["orgUser"]);
    if (!currentUserRes) {
        return false;
    }
    const [, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const targetOrgRole = (0, helpers_1.presence)(graph[params.orgRoleId], "orgRole"), targetAppUserGrants = params.appUserGrants;
    if (!targetOrgRole ||
        !targetOrgRole.canHaveCliUsers ||
        !(currentOrgPermissions.has("org_manage_cli_users") ||
            (currentOrgPermissions.has("org_create_cli_users_for_permitted_apps") &&
                targetAppUserGrants &&
                targetAppUserGrants.length > 0)) ||
        !(currentOrgRole.canInviteAllOrgRoles ||
            currentOrgRole.canInviteOrgRoleIds.includes(targetOrgRole.id))) {
        return false;
    }
    if (targetAppUserGrants && targetAppUserGrants.length > 0) {
        for (let targetAppUserGrant of targetAppUserGrants) {
            const currentUserAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, targetAppUserGrant.appId, currentUserId), "appRole"), targetAppRole = (0, helpers_1.presence)(graph[targetAppUserGrant.appRoleId], "appRole");
            if (!currentUserAppRole ||
                !(0, helpers_1.hasAllAppPermissions)(graph, currentUserId, targetAppUserGrant.appId, ["app_manage_cli_users"]) ||
                !targetAppRole ||
                !targetAppRole.canHaveCliUsers ||
                !currentUserAppRole.canInviteAppRoleIds.includes(targetAppRole.id)) {
                return false;
            }
        }
    }
    return true;
}, canCreateCliUserForApp = (graph, currentUserId, appId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_cli_users") ||
    ((0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_create_cli_users_for_permitted_apps") &&
        (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, "app_manage_cli_users")), canCreateAnyCliUser = (graph, currentUserId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_cli_users") ||
    ((0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_create_cli_users_for_permitted_apps") &&
        (0, scopes_1.getAppsWithAllPermissions)(graph, currentUserId, ["app_manage_cli_users"])
            .length > 0), canRenameCliUser = (graph, currentUserId, cliUserId) => (0, exports.canManageCliUser)(graph, currentUserId, cliUserId), canDeleteCliUser = (graph, currentUserId, cliUserId) => (0, exports.canManageCliUser)(graph, currentUserId, cliUserId), canListCliUsers = (graph, currentUserId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_cli_users"), canManageCliUser = (graph, currentUserId, cliUserId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const cliUserRes = (0, helpers_1.authorizeUser)(graph, cliUserId, [
        "cliUser",
    ]);
    if (!cliUserRes) {
        return false;
    }
    const [cliUser] = cliUserRes;
    if (currentOrgPermissions.has("org_manage_cli_users") &&
        // for cli users, unlike human users, any role that can be invited/created can also be managed
        (currentOrgRole.canInviteAllOrgRoles ||
            currentOrgRole.canInviteOrgRoleIds.includes(cliUser.orgRoleId) ||
            currentOrgRole.canManageAllOrgRoles ||
            currentOrgRole.canManageOrgRoleIds.includes(cliUser.orgRoleId))) {
        return true;
    }
    let creatorCanManage = currentOrgPermissions.has("org_create_cli_users_for_permitted_apps") &&
        cliUser.creatorId == currentUserId &&
        (currentOrgRole.canInviteAllOrgRoles ||
            currentOrgRole.canInviteOrgRoleIds.includes(cliUser.orgRoleId));
    if (creatorCanManage) {
        const { apps } = (0, _1.graphTypes)(graph);
        for (let app of apps) {
            const targetAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, app.id, cliUser.id), "appRole"), currentAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, app.id, currentUserId), "appRole");
            if (!targetAppRole) {
                continue;
            }
            if (!currentAppRole ||
                !(0, helpers_1.hasAllAppPermissions)(graph, currentUserId, app.id, [
                    "app_manage_cli_users",
                ])) {
                creatorCanManage = false;
                break;
            }
            if (!currentAppRole.canManageAppRoleIds.includes(targetAppRole.id)) {
            }
            else if (creatorCanManage &&
                !currentAppRole.canInviteAppRoleIds.includes(targetAppRole.id)) {
                creatorCanManage = false;
                break;
            }
        }
    }
    return creatorCanManage;
};
exports.canCreateCliUser = canCreateCliUser, exports.canCreateCliUserForApp = canCreateCliUserForApp, exports.canCreateAnyCliUser = canCreateAnyCliUser, exports.canRenameCliUser = canRenameCliUser, exports.canDeleteCliUser = canDeleteCliUser, exports.canListCliUsers = canListCliUsers, exports.canManageCliUser = canManageCliUser;
//# sourceMappingURL=cli_users.js.map