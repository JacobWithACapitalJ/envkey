"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAnyConnectedBlockPermissions = exports.hasConnectedBlockPermission = exports.hasAllConnectedBlockPermissions = exports.hasAnyAppPermissions = exports.hasAppPermission = exports.hasAllAppPermissions = exports.presence = exports.hasAnyOrgPermissions = exports.hasOrgPermission = exports.hasAllOrgPermissions = exports.authorizeUser = void 0;
const permissions_1 = require("../../permissions");
const authorizeUser = (graph, userId, allowedUserTypes = ["orgUser", "cliUser"]) => {
    const user = graph[userId];
    if (!user || !allowedUserTypes.includes(user.type)) {
        return false;
    }
    if (user.deactivatedAt || user.deletedAt) {
        return false;
    }
    const orgRole = graph[user.orgRoleId];
    if (!orgRole || orgRole.type != "orgRole") {
        return false;
    }
    return [user, orgRole, (0, permissions_1.getOrgPermissions)(graph, user.orgRoleId)];
}, hasAllOrgPermissions = (graph, currentUserId, permissions, allowedUserTypes = ["orgUser", "cliUser"]) => {
    const authRes = (0, exports.authorizeUser)(graph, currentUserId, allowedUserTypes);
    if (!authRes) {
        return false;
    }
    const [, , orgPermissions] = authRes;
    for (let permission of permissions) {
        if (!orgPermissions.has(permission)) {
            return false;
        }
    }
    return true;
}, hasOrgPermission = (graph, currentUserId, permission) => (0, exports.hasAllOrgPermissions)(graph, currentUserId, [permission]), hasAnyOrgPermissions = (graph, currentUserId, permissions, allowedUserTypes = ["orgUser", "cliUser"]) => {
    const authRes = (0, exports.authorizeUser)(graph, currentUserId, allowedUserTypes);
    if (!authRes) {
        return false;
    }
    const [, , orgPermissions] = authRes;
    for (let permission of permissions) {
        if (orgPermissions.has(permission)) {
            return true;
        }
    }
    return false;
}, presence = (obj, type, allowDeactivated = false, allowDeleted = false) => {
    if (!obj ||
        obj.type != type ||
        (obj.deletedAt && !allowDeleted) ||
        (obj.deactivatedAt && !allowDeactivated)) {
        return false;
    }
    return obj;
}, hasAllAppPermissions = (graph, currentUserId, appId, permissions) => hasAllEnvParentPermissions(graph, currentUserId, "app", appId, permissions), hasAppPermission = (graph, currentUserId, appId, permission) => (0, exports.hasAllAppPermissions)(graph, currentUserId, appId, [permission]), hasAnyAppPermissions = (graph, currentUserId, appId, permissions) => hasAnyEnvParentPermissions(graph, currentUserId, "app", appId, permissions), hasAllConnectedBlockPermissions = (graph, currentUserId, blockId, permissions) => hasAllEnvParentPermissions(graph, currentUserId, "block", blockId, permissions), hasConnectedBlockPermission = (graph, currentUserId, blockId, permission) => (0, exports.hasAllConnectedBlockPermissions)(graph, currentUserId, blockId, [
    permission,
]), hasAnyConnectedBlockPermissions = (graph, currentUserId, blockId, permissions) => hasAnyEnvParentPermissions(graph, currentUserId, "block", blockId, permissions);
exports.authorizeUser = authorizeUser, exports.hasAllOrgPermissions = hasAllOrgPermissions, exports.hasOrgPermission = hasOrgPermission, exports.hasAnyOrgPermissions = hasAnyOrgPermissions, exports.presence = presence, exports.hasAllAppPermissions = hasAllAppPermissions, exports.hasAppPermission = hasAppPermission, exports.hasAnyAppPermissions = hasAnyAppPermissions, exports.hasAllConnectedBlockPermissions = hasAllConnectedBlockPermissions, exports.hasConnectedBlockPermission = hasConnectedBlockPermission, exports.hasAnyConnectedBlockPermissions = hasAnyConnectedBlockPermissions;
const hasAllEnvParentPermissions = (graph, currentUserId, envParentType, envParentId, permissions) => {
    if (!(0, exports.presence)(graph[envParentId], envParentType)) {
        return false;
    }
    const envParentPermissions = (0, permissions_1.getEnvParentPermissions)(graph, envParentId, currentUserId);
    for (let permission of permissions) {
        if (!envParentPermissions.has(permission)) {
            return false;
        }
    }
    return true;
}, hasAnyEnvParentPermissions = (graph, currentUserId, envParentType, envParentId, permissions) => {
    if (!(0, exports.presence)(graph[envParentId], envParentType)) {
        return false;
    }
    const envParentPermissions = (0, permissions_1.getEnvParentPermissions)(graph, envParentId, currentUserId);
    for (let permission of permissions) {
        if (envParentPermissions.has(permission)) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=helpers.js.map