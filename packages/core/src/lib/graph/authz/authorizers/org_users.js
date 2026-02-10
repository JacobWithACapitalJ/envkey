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
exports.canManageOrgUser = exports.canListOrgUsers = exports.canRemoveFromOrg = exports.canUpdateUserRole = exports.canRenameUser = void 0;
const R = __importStar(require("ramda"));
const helpers_1 = require("./helpers");
const __1 = require("../..");
const canRenameUser = (graph, currentUserId, targetUserId) => (0, exports.canManageOrgUser)(graph, currentUserId, targetUserId);
exports.canRenameUser = canRenameUser;
const canUpdateUserRole = (graph, currentUserId, targetUserId, newOrgRoleId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [_, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const targetUserRes = (0, helpers_1.authorizeUser)(graph, targetUserId);
    if (!targetUserRes) {
        return false;
    }
    const [user] = targetUserRes;
    if (!(0, helpers_1.presence)(graph[newOrgRoleId], "orgRole")) {
        return false;
    }
    const managePermission = user.type == "orgUser"
        ? "org_manage_users"
        : "org_manage_cli_users";
    if (!(currentOrgPermissions.has(managePermission) &&
        (currentOrgRole.canManageAllOrgRoles ||
            currentOrgRole.canManageOrgRoleIds.includes(user.orgRoleId)) &&
        (currentOrgRole.canManageAllOrgRoles ||
            currentOrgRole.canManageOrgRoleIds.includes(newOrgRoleId) ||
            currentOrgRole.canInviteAllOrgRoles ||
            currentOrgRole.canInviteOrgRoleIds.includes(newOrgRoleId)))) {
        return false;
    }
    // cannot remove the last remaining human owner
    if (user.type == "orgUser" && (user.isCreator || user.inviteAcceptedAt)) {
        const oldOrgRole = graph[user.orgRoleId];
        if (oldOrgRole.isDefault && oldOrgRole.defaultName == "Org Owner") {
            const numOwners = (0, __1.getActiveOrgUsers)(graph).filter(R.propEq("orgRoleId", oldOrgRole.id)).length;
            if (numOwners == 1) {
                return false;
            }
        }
    }
    return true;
};
exports.canUpdateUserRole = canUpdateUserRole;
const canRemoveFromOrg = (graph, currentUserId, targetUserId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [_, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const targetUserRes = (0, helpers_1.authorizeUser)(graph, targetUserId, [
        "orgUser",
    ]);
    if (!targetUserRes) {
        return false;
    }
    const [user] = targetUserRes;
    // cannot remove the last remaining owner
    if (user.type == "orgUser" && (user.isCreator || user.inviteAcceptedAt)) {
        const oldOrgRole = graph[user.orgRoleId];
        if (oldOrgRole.isDefault && oldOrgRole.defaultName == "Org Owner") {
            const numOwners = (0, __1.getActiveOrgUsers)(graph).filter(R.propEq("orgRoleId", oldOrgRole.id)).length;
            if (numOwners == 1) {
                return false;
            }
        }
    }
    // unless last remaining owner, can always remove self from org (i.e. delete account)
    if (currentUserId == targetUserId) {
        return true;
    }
    return (0, exports.canManageOrgUser)(graph, currentUserId, targetUserId);
};
exports.canRemoveFromOrg = canRemoveFromOrg;
const canListOrgUsers = (graph, currentUserId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_users");
exports.canListOrgUsers = canListOrgUsers;
const canManageOrgUser = (graph, currentUserId, orgUserId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const orgUserRes = (0, helpers_1.authorizeUser)(graph, orgUserId, [
        "orgUser",
    ]);
    if (!orgUserRes) {
        return false;
    }
    const [orgUser] = orgUserRes;
    if (currentOrgPermissions.has("org_manage_users") &&
        (currentOrgRole.canManageAllOrgRoles ||
            currentOrgRole.canManageOrgRoleIds.includes(orgUser.orgRoleId))) {
        return true;
    }
    let inviterCanManage = currentOrgPermissions.has("org_invite_users_to_permitted_apps") &&
        orgUser.invitedById == currentUserId &&
        !orgUser.inviteAcceptedAt &&
        (currentOrgRole.canInviteAllOrgRoles ||
            currentOrgRole.canInviteOrgRoleIds.includes(orgUser.orgRoleId));
    if (inviterCanManage) {
        const { apps } = (0, __1.graphTypes)(graph);
        for (let app of apps) {
            const targetAppRole = (0, helpers_1.presence)((0, __1.getAppRoleForUserOrInvitee)(graph, app.id, orgUser.id), "appRole"), currentAppRole = (0, helpers_1.presence)((0, __1.getAppRoleForUserOrInvitee)(graph, app.id, currentUserId), "appRole");
            if (!targetAppRole) {
                continue;
            }
            if (!currentAppRole ||
                !(0, helpers_1.hasAllAppPermissions)(graph, currentUserId, app.id, [
                    "app_manage_users",
                ])) {
                inviterCanManage = false;
                break;
            }
            if (inviterCanManage &&
                !currentAppRole.canInviteAppRoleIds.includes(targetAppRole.id)) {
                inviterCanManage = false;
                break;
            }
        }
    }
    return inviterCanManage;
};
exports.canManageOrgUser = canManageOrgUser;
//# sourceMappingURL=org_users.js.map