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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppConnectedUserGroups = exports.getLocalsReadableAppCollaborators = exports.getAppCollaborators = exports.getAccessRemoveableUserGroupsForApp = exports.getAccessRemoveableUsersForApp = exports.getAccessRemoveableApps = exports.getAccessGrantableAppRoles = exports.getAccessGrantableAppRolesForOrgRole = exports.getAccessGrantableAppsForUserGroup = exports.getAccessGrantableAppRolesForUserGroup = exports.getAccessGrantableAppRolesForUser = exports.getAccessGrantableCliUsersForApp = exports.getAccessGrantableOrgUsersForApp = exports.getAccessGrantableUserGroupsForApp = exports.getAccessGrantableUsersForApp = exports.getAccessGrantableApps = exports.getDeletableApps = exports.getSettingsUpdatableApps = exports.getRenameableApps = exports.getAppsWithAnyPermissions = exports.getAppsWithAllPermissions = void 0;
const invites_1 = require("./../../invites");
const _1 = require("../../.");
const helpers_1 = require("../authorizers/helpers");
const authz = __importStar(require("../authorizers"));
const R = __importStar(require("ramda"));
const memoize_1 = __importDefault(require("../../../utils/memoize"));
exports.getAppsWithAllPermissions = (0, memoize_1.default)((graph, currentUserId, appPermissions) => (0, _1.graphTypes)(graph).apps.filter(({ id }) => (0, helpers_1.hasAllAppPermissions)(graph, currentUserId, id, appPermissions))), exports.getAppsWithAnyPermissions = (0, memoize_1.default)((graph, currentUserId, appPermissions) => (0, _1.graphTypes)(graph).apps.filter(({ id }) => (0, helpers_1.hasAnyAppPermissions)(graph, currentUserId, id, appPermissions))), exports.getRenameableApps = (0, memoize_1.default)((graph, currentUserId) => (0, _1.graphTypes)(graph).apps.filter(({ id }) => authz.canRenameApp(graph, currentUserId, id))), exports.getSettingsUpdatableApps = (0, memoize_1.default)((graph, currentUserId) => (0, _1.graphTypes)(graph).apps.filter(({ id }) => authz.canUpdateAppSettings(graph, currentUserId, id))), exports.getDeletableApps = (0, memoize_1.default)((graph, currentUserId) => (0, _1.graphTypes)(graph).apps.filter(({ id }) => authz.canDeleteApp(graph, currentUserId, id))), exports.getAccessGrantableApps = (0, memoize_1.default)((graph, currentUserId) => (0, exports.getAppsWithAnyPermissions)(graph, currentUserId, [
    "app_manage_users",
    "app_manage_cli_users",
])), exports.getAccessGrantableUsersForApp = (0, memoize_1.default)((graph, currentUserId, appId) => {
    const { orgUsers, cliUsers } = (0, _1.graphTypes)(graph);
    return [...orgUsers, ...cliUsers].filter(({ id: userId }) => (0, exports.getAccessGrantableAppRolesForUser)(graph, currentUserId, appId, userId)
        .length > 0);
}), exports.getAccessGrantableUserGroupsForApp = (0, memoize_1.default)((graph, currentUserId, appId) => {
    const { groups } = (0, _1.graphTypes)(graph);
    return groups.filter(({ objectType, id }) => objectType == "orgUser" &&
        (0, exports.getAccessGrantableAppRolesForUserGroup)(graph, currentUserId, appId, id).length > 0);
}), exports.getAccessGrantableOrgUsersForApp = (0, memoize_1.default)((graph, currentUserId, appId, now) => (0, exports.getAccessGrantableUsersForApp)(graph, currentUserId, appId).filter((user) => user.type == "orgUser" &&
    !["expired", "failed"].includes((0, invites_1.getInviteStatus)(graph, user.id, now)))), exports.getAccessGrantableCliUsersForApp = (0, memoize_1.default)((graph, currentUserId, appId) => (0, exports.getAccessGrantableUsersForApp)(graph, currentUserId, appId).filter(R.propEq("type", "cliUser"))), exports.getAccessGrantableAppRolesForUser = (0, memoize_1.default)((graph, currentUserId, appId, userId) => (0, _1.graphTypes)(graph).appRoles.filter(({ id: appRoleId }) => authz.canGrantAppRoleToUser(graph, currentUserId, {
    appId,
    userId,
    appRoleId,
}))), exports.getAccessGrantableAppRolesForUserGroup = (0, memoize_1.default)((graph, currentUserId, appId, userGroupId) => (0, _1.graphTypes)(graph).appRoles.filter(({ id: appRoleId }) => authz.canGrantAppRoleToUserGroup(graph, currentUserId, {
    appId,
    userGroupId,
    appRoleId,
}))), exports.getAccessGrantableAppsForUserGroup = (0, memoize_1.default)((graph, currentUserId, userGroupId) => (0, _1.graphTypes)(graph).apps.filter(({ id: appId }) => (0, exports.getAccessGrantableAppRolesForUserGroup)(graph, currentUserId, appId, userGroupId).length > 0)), exports.getAccessGrantableAppRolesForOrgRole = (0, memoize_1.default)((graph, currentUserId, appId, orgRoleId) => (0, _1.graphTypes)(graph).appRoles.filter(({ id: appRoleId }) => authz.canGrantAppRoleToOrgRole(graph, currentUserId, {
    appId,
    orgRoleId,
    appRoleId,
}))), exports.getAccessGrantableAppRoles = (0, memoize_1.default)((graph, currentUserId, appId) => R.uniqBy(R.prop("id"), (0, _1.graphTypes)(graph).orgRoles.flatMap(({ id: orgRoleId }) => (0, exports.getAccessGrantableAppRolesForOrgRole)(graph, currentUserId, appId, orgRoleId)))), exports.getAccessRemoveableApps = (0, memoize_1.default)((graph, currentUserId) => (0, _1.graphTypes)(graph).apps.filter(({ id }) => authz.canRemoveAppAccess(graph, currentUserId, id))), exports.getAccessRemoveableUsersForApp = (0, memoize_1.default)((graph, currentUserId, appId) => {
    const { orgUsers, cliUsers } = (0, _1.graphTypes)(graph);
    return [...orgUsers, ...cliUsers].filter(({ id: userId }) => authz.canRemoveAppUserAccess(graph, currentUserId, {
        appId,
        userId,
    }));
}), exports.getAccessRemoveableUserGroupsForApp = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).groups.filter(({ objectType, id }) => objectType == "orgUser" &&
    authz.canRemoveAppUserGroupAccess(graph, currentUserId, {
        appId,
        userGroupId: id,
    }))), exports.getAppCollaborators = (0, memoize_1.default)((graph, currentUserId, appId, userType) => {
    if (!authz.canListAppCollaborators(graph, currentUserId, appId, userType)) {
        return [];
    }
    const users = (0, _1.graphTypes)(graph)[(userType + "s")];
    let collaborators = users.filter((user) => Boolean((0, _1.getAppRoleForUserOrInvitee)(graph, appId, user.id)));
    return collaborators;
}), exports.getLocalsReadableAppCollaborators = (0, memoize_1.default)((graph, currentUserId, appId, userType) => R.sortBy((user) => user.type == "cliUser"
    ? user.name
    : `${user.lastName} ${user.firstName}`, (0, exports.getAppCollaborators)(graph, currentUserId, appId, userType).filter((user) => authz.canReadLocals(graph, currentUserId, appId, user.id)))), exports.getAppConnectedUserGroups = (0, memoize_1.default)((graph, currentUserId, appId) => {
    var _a, _b;
    if (!authz.canListAppCollaborators(graph, currentUserId, appId, "orgUser")) {
        return [];
    }
    // user groups connected directly to app
    const directlyConnected = ((_a = (0, _1.getAppUserGroupsByAppId)(graph)[appId]) !== null && _a !== void 0 ? _a : []).map(({ userGroupId }) => graph[userGroupId]);
    const directlyConnectedIds = new Set(directlyConnected.map(R.prop("id")));
    // groups this app belongs to
    const appGroupIds = ((_b = (0, _1.getGroupMembershipsByObjectId)(graph)[appId]) !== null && _b !== void 0 ? _b : []).map(R.prop("groupId"));
    const indirectlyConnected = appGroupIds
        .flatMap((appGroupId) => {
        var _a;
        return ((_a = (0, _1.getAppGroupUserGroupsByAppGroupId)(graph)[appGroupId]) !== null && _a !== void 0 ? _a : []).map(({ userGroupId }) => graph[userGroupId]);
    })
        // filter out those already in direct connections, since those take precedence
        .filter(({ id }) => !directlyConnectedIds.has(id));
    return indirectlyConnected.concat(directlyConnected);
});
//# sourceMappingURL=apps.js.map