"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canRevokeInvite = exports.canInviteAny = exports.canInviteToApp = exports.canInvite = void 0;
const groups_1 = require("./groups");
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const scopes_1 = require("../scopes");
const canInvite = (graph, currentUserId, params) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [_, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const targetOrgRole = (0, helpers_1.presence)(graph[params.orgRoleId], "orgRole");
    if (!targetOrgRole) {
        return false;
    }
    if (!(currentOrgPermissions.has("org_manage_users") ||
        currentOrgPermissions.has("org_invite_users_to_permitted_apps")) ||
        !(currentOrgRole.canInviteAllOrgRoles ||
            currentOrgRole.canInviteOrgRoleIds.includes(params.orgRoleId))) {
        return false;
    }
    if (params.appUserGrants && params.appUserGrants.length) {
        if (targetOrgRole.autoAppRoleId) {
            return false;
        }
        for (let { appId, appRoleId } of params.appUserGrants) {
            const currentUserAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, appId, currentUserId), "appRole");
            if (!currentUserAppRole ||
                !(0, helpers_1.hasAllAppPermissions)(graph, currentUserId, appId, [
                    "app_manage_users",
                ]) ||
                !currentUserAppRole.canInviteAppRoleIds.includes(appRoleId)) {
                return false;
            }
        }
    }
    if (params.userGroupIds) {
        if (targetOrgRole.autoAppRoleId) {
            return false;
        }
        if (!(0, groups_1.canManageUserGroups)(graph, currentUserId)) {
            return false;
        }
        for (let groupId of params.userGroupIds) {
            const group = (0, helpers_1.presence)(graph[groupId], "group");
            if (!group || group.objectType != "orgUser") {
                return false;
            }
        }
    }
    return true;
}, canInviteToApp = (graph, currentUserId, appId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_users") ||
    ((0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_invite_users_to_permitted_apps") &&
        (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, "app_manage_users")), canInviteAny = (graph, currentUserId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_users") ||
    ((0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_invite_users_to_permitted_apps") &&
        (0, scopes_1.getAppsWithAllPermissions)(graph, currentUserId, ["app_manage_users"])
            .length > 0), canRevokeInvite = (graph, currentUserId, inviteId, now) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [_, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const invite = (0, helpers_1.presence)(graph[inviteId], "invite");
    if (!invite || invite.acceptedAt || now >= invite.expiresAt) {
        return false;
    }
    const inviteeId = invite.inviteeId, targetOrgUser = (0, helpers_1.presence)(graph[inviteeId], "orgUser");
    if (!targetOrgUser) {
        return false;
    }
    if (!(currentOrgRole.canManageAllOrgRoles ||
        currentOrgRole.canManageOrgRoleIds.includes(targetOrgUser.orgRoleId) ||
        (invite.invitedByUserId == currentUserId &&
            (currentOrgRole.canInviteAllOrgRoles ||
                currentOrgRole.canInviteOrgRoleIds.includes(targetOrgUser.orgRoleId))))) {
        return false;
    }
    if (currentOrgPermissions.has("org_manage_users")) {
        return true;
    }
    else if (currentOrgPermissions.has("org_invite_users_to_permitted_apps") &&
        invite.invitedByUserId == currentUserId) {
        // ensure user has invite permissions for each of the target user's apps
        const currentUserAppRoles = (0, _1.getUserAppRolesByAppId)(graph, currentUserId), targetAppUserRoles = (0, _1.getUserAppRolesByAppId)(graph, currentUserId);
        for (let appId in targetAppUserRoles) {
            const currentUserAppRole = (0, helpers_1.presence)(currentUserAppRoles[appId], "appRole");
            if (!currentUserAppRole) {
                return false;
            }
            const targetUserAppRole = targetAppUserRoles[appId];
            if (!((0, helpers_1.hasAllAppPermissions)(graph, currentUserId, appId, [
                "app_manage_users",
            ]) &&
                (currentUserAppRole.canManageAppRoleIds.includes(targetUserAppRole.id) ||
                    (invite.invitedByUserId == currentUserId &&
                        currentUserAppRole.canInviteAppRoleIds.includes(targetUserAppRole.id))))) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
};
exports.canInvite = canInvite, exports.canInviteToApp = canInviteToApp, exports.canInviteAny = canInviteAny, exports.canRevokeInvite = canRevokeInvite;
//# sourceMappingURL=invites.js.map