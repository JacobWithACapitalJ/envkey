"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canReadAppVersions = exports.canListAppCollaborators = exports.canRemoveAppUserGroupAccess = exports.canRemoveAppUserAccess = exports.canRemoveAppAccess = exports.canGrantAppRoleToUserGroup = exports.canGrantAppRoleToUser = exports.canGrantAppRoleToOrgRole = exports.canGrantAppAccess = exports.canDeleteApp = exports.canManageAppFirewall = exports.canUpdateAppSettings = exports.canRenameApp = exports.canCreateApp = void 0;
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const indexed_graph_1 = require("../../indexed_graph");
const __1 = require("..");
const permissions_1 = require("../../permissions");
const canCreateApp = (graph, currentUserId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "apps_create"), canRenameApp = (graph, currentUserId, appId) => (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, "app_rename"), canUpdateAppSettings = (graph, currentUserId, appId) => (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, "app_manage_settings"), canManageAppFirewall = (graph, currentUserId, appId) => (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, "app_manage_firewall"), canDeleteApp = (graph, currentUserId, appId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "apps_delete") &&
    Boolean((0, helpers_1.presence)(graph[appId], "app")), canGrantAppAccess = (graph, currentUserId, appId, userType) => {
    if (userType && userType == "orgUser") {
        return (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, "app_manage_users");
    }
    else if (userType && userType == "cliUser") {
        return (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, "app_manage_cli_users");
    }
    return (0, helpers_1.hasAnyAppPermissions)(graph, currentUserId, appId, [
        "app_manage_users",
        "app_manage_cli_users",
    ]);
}, canGrantAppRoleToOrgRole = (graph, currentUserId, params) => {
    if (!(0, exports.canGrantAppAccess)(graph, currentUserId, params.appId)) {
        return false;
    }
    const app = (0, helpers_1.presence)(graph[params.appId], "app");
    if (!app) {
        return false;
    }
    const targetAppRole = (0, helpers_1.presence)(graph[params.appRoleId], "appRole"), includedAppRole = (0, helpers_1.presence)((0, _1.getIncludedAppRolesByComposite)(graph)[[params.appRoleId, params.appId].join("|")], "includedAppRole"), currentAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, params.appId, currentUserId), "appRole");
    if (!targetAppRole || !currentAppRole || !includedAppRole) {
        return false;
    }
    const targetOrgRole = (0, helpers_1.presence)(graph[params.orgRoleId], "orgRole");
    if (!targetOrgRole || targetOrgRole.autoAppRoleId) {
        return false;
    }
    if (!targetAppRole.defaultAllApps) {
        const includedAppRole = (0, _1.getIncludedAppRolesByComposite)(graph)[[targetAppRole.id, app.id].join("|")];
        if (!includedAppRole) {
            return false;
        }
    }
    return currentAppRole.canManageAppRoleIds.includes(targetAppRole.id);
}, canGrantAppRoleToUser = (graph, currentUserId, params) => {
    const targetUserRes = (0, helpers_1.authorizeUser)(graph, params.userId);
    if (!targetUserRes) {
        return false;
    }
    const [targetUser] = targetUserRes;
    if (!(0, exports.canGrantAppRoleToOrgRole)(graph, currentUserId, {
        appId: params.appId,
        appRoleId: params.appRoleId,
        orgRoleId: targetUser.orgRoleId,
    })) {
        return false;
    }
    const currentAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, params.appId, currentUserId), "appRole");
    if (!currentAppRole) {
        return false;
    }
    const existingAppRole = (0, _1.getAppRoleForUserOrInvitee)(graph, params.appId, params.userId);
    if (existingAppRole && existingAppRole.id == params.appRoleId) {
        return false;
    }
    if (existingAppRole &&
        !currentAppRole.canManageAppRoleIds.includes(existingAppRole.id)) {
        return false;
    }
    return true;
}, canGrantAppRoleToUserGroup = (graph, currentUserId, params) => {
    const targetUserGroup = (0, helpers_1.presence)(graph[params.userGroupId], "group");
    if (!targetUserGroup || targetUserGroup.objectType != "orgUser") {
        return false;
    }
    const currentAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, params.appId, currentUserId), "appRole");
    if (!currentAppRole) {
        return false;
    }
    if (!(0, helpers_1.hasAppPermission)(graph, currentUserId, params.appId, "app_manage_users")) {
        return false;
    }
    if (!currentAppRole.canManageAppRoleIds.includes(params.appRoleId)) {
        return false;
    }
    const existingAppRole = (0, permissions_1.getAppRoleForUserGroup)(graph, params.appId, params.userGroupId);
    if ((existingAppRole === null || existingAppRole === void 0 ? void 0 : existingAppRole.id) == params.appRoleId) {
        return false;
    }
    if (existingAppRole &&
        !currentAppRole.canManageAppRoleIds.includes(existingAppRole.id)) {
        return false;
    }
    return true;
}, canRemoveAppAccess = (graph, currentUserId, appId) => (0, helpers_1.hasAnyAppPermissions)(graph, currentUserId, appId, [
    "app_manage_users",
    "app_manage_cli_users",
]), canRemoveAppUserAccess = (graph, currentUserId, params) => {
    var _a;
    const appUserGrantId = "appUserGrantId" in params
        ? params.appUserGrantId
        : (_a = (0, indexed_graph_1.getAppUserGrantsByComposite)(graph)[params.userId + "|" + params.appId]) === null || _a === void 0 ? void 0 : _a.id;
    if (!appUserGrantId) {
        return false;
    }
    const targetAppUserGrant = (0, helpers_1.presence)(graph[appUserGrantId], "appUserGrant");
    if (!targetAppUserGrant) {
        return false;
    }
    if (!(0, exports.canRemoveAppAccess)(graph, currentUserId, targetAppUserGrant.appId)) {
        return false;
    }
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId), targetUserRes = (0, helpers_1.authorizeUser)(graph, targetAppUserGrant.userId);
    if (!currentUserRes || !targetUserRes) {
        return false;
    }
    const [_, currentOrgRole, currentOrgPermissions] = currentUserRes, [targetUser, targetOrgRole] = targetUserRes, currentAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, targetAppUserGrant.appId, currentUserId), "appRole"), targetAppRole = (0, helpers_1.presence)(graph[targetAppUserGrant.appRoleId], "appRole");
    if (!currentAppRole || !targetAppRole || targetOrgRole.autoAppRoleId) {
        return false;
    }
    const isInviter = targetUser.type == "cliUser"
        ? targetUser.creatorId == currentUserId
        : targetUser.invitedById == currentUserId, hasInviterPermissions = isInviter &&
        currentOrgPermissions.has("org_invite_users_to_permitted_apps") &&
        (currentOrgRole.canInviteAllOrgRoles ||
            currentOrgRole.canInviteOrgRoleIds.includes(targetUser.orgRoleId)) &&
        (0, helpers_1.hasAppPermission)(graph, currentUserId, targetAppUserGrant.appId, "app_manage_users") &&
        currentAppRole.canInviteAppRoleIds.includes(targetAppRole.id), appManagePermission = targetUser.type == "cliUser"
        ? "app_manage_cli_users"
        : "app_manage_users";
    return (hasInviterPermissions ||
        ((0, helpers_1.hasAppPermission)(graph, currentUserId, targetAppUserGrant.appId, appManagePermission) &&
            currentAppRole.canManageAppRoleIds.includes(targetAppRole.id)));
}, canRemoveAppUserGroupAccess = (graph, currentUserId, params) => {
    var _a;
    const appUserGroupId = "appUserGroupId" in params
        ? params.appUserGroupId
        : (_a = (0, indexed_graph_1.getAppUserGroupsByComposite)(graph)[params.appId + "|" + params.userGroupId]) === null || _a === void 0 ? void 0 : _a.id;
    if (!appUserGroupId) {
        return false;
    }
    const targetAppUserGroup = (0, helpers_1.presence)(graph[appUserGroupId], "appUserGroup");
    if (!targetAppUserGroup) {
        return false;
    }
    const currentAppRole = (0, helpers_1.presence)((0, _1.getAppRoleForUserOrInvitee)(graph, targetAppUserGroup.appId, currentUserId), "appRole"), targetAppRole = (0, helpers_1.presence)(graph[targetAppUserGroup.appRoleId], "appRole");
    if (!currentAppRole || !targetAppRole) {
        return false;
    }
    return ((0, helpers_1.hasAppPermission)(graph, currentUserId, targetAppUserGroup.appId, "app_manage_users") && currentAppRole.canManageAppRoleIds.includes(targetAppRole.id));
}, canListAppCollaborators = (graph, currentUserId, appId, userType) => {
    const orgManagePermission = {
        orgUser: "org_manage_users",
        cliUser: "org_manage_cli_users",
    }[userType];
    const appManagePermission = {
        orgUser: "app_manage_users",
        cliUser: "app_manage_cli_users",
    }[userType];
    return ((0, helpers_1.hasOrgPermission)(graph, currentUserId, orgManagePermission) ||
        (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, appManagePermission));
}, canReadAppVersions = (graph, currentUserId, appId) => (0, helpers_1.hasAppPermission)(graph, currentUserId, appId, "app_read_user_locals_history") || (0, __1.canReadAnyEnvParentVersions)(graph, currentUserId, appId);
exports.canCreateApp = canCreateApp, exports.canRenameApp = canRenameApp, exports.canUpdateAppSettings = canUpdateAppSettings, exports.canManageAppFirewall = canManageAppFirewall, exports.canDeleteApp = canDeleteApp, exports.canGrantAppAccess = canGrantAppAccess, exports.canGrantAppRoleToOrgRole = canGrantAppRoleToOrgRole, exports.canGrantAppRoleToUser = canGrantAppRoleToUser, exports.canGrantAppRoleToUserGroup = canGrantAppRoleToUserGroup, exports.canRemoveAppAccess = canRemoveAppAccess, exports.canRemoveAppUserAccess = canRemoveAppUserAccess, exports.canRemoveAppUserGroupAccess = canRemoveAppUserGroupAccess, exports.canListAppCollaborators = canListAppCollaborators, exports.canReadAppVersions = canReadAppVersions;
//# sourceMappingURL=apps.js.map