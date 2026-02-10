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
exports.getEnvParentPermissions = exports.getConnectedAppPermissionsUnionForBlock = exports.getConnectedAppPermissionsIntersectionForBlock = exports.getAppRoleForUserGroup = exports.getAppRoleForUserOrInvitee = exports.getUserAppRolesByAppId = exports.getAppRoleEnvironmentRolePermissions = exports.getEnvironmentPermissions = exports.getAppPermissions = exports.getOrgPermissions = void 0;
const types_1 = require("../../types");
const R = __importStar(require("ramda"));
const memoize_1 = __importDefault(require("../../lib/utils/memoize"));
const app_blocks_1 = require("./app_blocks");
const indexed_graph_1 = require("./indexed_graph");
const base_1 = require("./base");
const app_users_1 = require("./app_users");
const allEnvironmentReadPermissions = Object.keys(types_1.Rbac.environmentReadPermissions), allEnvironmentWritePermissions = Object.keys(types_1.Rbac.environmentWritePermissions), allEnvironmentPermissions = Object.keys(types_1.Rbac.environmentPermissions);
const getAppRoleEnvironmentRolePermissions = (graph, appRoleId, environmentRoleId) => {
    const appRole = graph[appRoleId], environmentRole = graph[environmentRoleId];
    if (!appRole ||
        appRole.type != "appRole" ||
        !environmentRole ||
        environmentRole.type != "environmentRole") {
        return [];
    }
    if (appRole.hasFullEnvironmentPermissions) {
        return types_1.Rbac.ENVIRONMENT_FULL_PERMISSIONS;
    }
    if (appRole.isDefault && environmentRole.isDefault) {
        return types_1.Rbac.ENVIRONMENT_PERMISSIONS_BY_DEFAULT_ROLE[appRole.defaultName][environmentRole.defaultName];
    }
    else {
        const appRoleEnvironmentRole = (0, indexed_graph_1.getAppRoleEnvironmentRolesByComposite)(graph)[appRoleId + "|" + environmentRoleId];
        return [...appRoleEnvironmentRole.permissions, "read_inherits"];
    }
}, getUserAppRolesByAppId = (graph, userId) => (0, base_1.graphTypes)(graph)
    .apps.map(({ id: appId }) => {
    const appRole = (0, exports.getAppRoleForUserOrInvitee)(graph, appId, userId);
    return appRole ? { [appId]: appRole } : undefined;
})
    .filter(Boolean)
    .reduce(R.merge, {});
exports.getOrgPermissions = (0, memoize_1.default)((graph, orgRoleId) => {
    const orgRole = graph[orgRoleId];
    if (!orgRole || orgRole.type != "orgRole") {
        return new Set();
    }
    if (orgRole.isDefault) {
        return new Set(types_1.Rbac.ORG_PERMISSIONS_BY_DEFAULT_ROLE[orgRole.defaultName]);
    }
    else if (orgRole.extendsRoleId) {
        return new Set(R.union(orgRole.addPermissions, R.difference(Array.from((0, exports.getOrgPermissions)(graph, orgRole.extendsRoleId)), orgRole.removePermissions)));
    }
    else if (orgRole.extendsRoleId === undefined) {
        return new Set(orgRole.permissions);
    }
    return new Set();
}), exports.getAppPermissions = (0, memoize_1.default)((graph, appRoleId) => {
    const appRole = graph[appRoleId];
    if (!appRole || appRole.type != "appRole") {
        return new Set();
    }
    if (appRole.isDefault) {
        return new Set(types_1.Rbac.APP_PERMISSIONS_BY_DEFAULT_ROLE[appRole.defaultName]);
    }
    else if (appRole.extendsRoleId) {
        return new Set(R.union(appRole.addPermissions, R.difference(Array.from((0, exports.getAppPermissions)(graph, appRole.extendsRoleId)), appRole.removePermissions)));
    }
    else if (appRole.extendsRoleId === undefined) {
        return new Set(appRole.permissions);
    }
    return new Set();
}), exports.getEnvironmentPermissions = (0, memoize_1.default)((graph, environmentId, userId, accessParams) => {
    // const start = process.hrtime.bigint(),
    //   elapsedNs = (msg: string) =>
    //     console.log(
    //       "environment permissions",
    //       msg,
    //       "-",
    //       process.hrtime.bigint() - start,
    //       "ns elapsed"
    //     );
    const environment = graph[environmentId];
    if (!environment) {
        return new Set();
    }
    let orgRoleId, permissions = [];
    if (userId) {
        const user = graph[userId];
        orgRoleId = user.orgRoleId;
    }
    else {
        orgRoleId = accessParams.orgRoleId;
    }
    const envParent = graph[environment.envParentId], orgPermissions = (0, exports.getOrgPermissions)(graph, orgRoleId);
    if (envParent.type == "app") {
        const appRole = (0, exports.getAppRoleForUserOrInvitee)(graph, envParent.id, userId, accessParams);
        if (!appRole) {
            return new Set();
        }
        permissions = (0, exports.getAppRoleEnvironmentRolePermissions)(graph, appRole.id, environment.environmentRoleId);
        // elapsedNs("got app environment permissions");
    }
    else if (envParent.type == "block") {
        if (orgPermissions.has("blocks_write_envs_all")) {
            permissions = allEnvironmentPermissions;
        }
        else {
            if (orgPermissions.has("blocks_read_all")) {
                permissions = allEnvironmentReadPermissions;
            }
            else if (orgPermissions.has("blocks_write_envs_permitted")) {
                const connectedApps = (0, app_blocks_1.getConnectedAppsForBlock)(graph, envParent.id);
                if (connectedApps.length > 0) {
                    const environmentsByEnvParentId = (0, indexed_graph_1.getEnvironmentsByEnvParentId)(graph);
                    permissions = permissions.concat(connectedApps.reduce((agg, app) => {
                        var _a;
                        const matchEnvironment = R.find(({ environmentRoleId, isSub }) => !isSub &&
                            environmentRoleId == environment.environmentRoleId, (_a = environmentsByEnvParentId[app.id]) !== null && _a !== void 0 ? _a : []);
                        if (!matchEnvironment) {
                            return agg;
                        }
                        const appPermissions = Array.from((0, exports.getEnvironmentPermissions)(graph, matchEnvironment.id, userId, accessParams));
                        const res = [
                            ...R.intersection(R.intersection(agg, allEnvironmentWritePermissions), R.intersection(appPermissions, allEnvironmentWritePermissions)),
                            ...R.union(R.intersection(agg, allEnvironmentReadPermissions), R.intersection(appPermissions, allEnvironmentReadPermissions)),
                        ];
                        return res;
                    }, 
                    /* R.intersection will filter out any write permissions not granted on all connected app environments
                    (read permissions use union - i.e. if you can read *any* connected app environment, you can read
                    block environment) */
                    allEnvironmentWritePermissions));
                }
            }
        }
        // elapsedNs("got block environment permissions");
    }
    // for sub-environments filter out permissions granted by the role if
    // corresponding _subenvs scoped permission is missing
    const permissionSet = new Set(permissions);
    if (environment.isSub) {
        if (permissionSet.has("write") &&
            !permissionSet.has("write_branches")) {
            permissionSet.delete("write");
        }
        if (permissionSet.has("read") && !permissionSet.has("read_branches")) {
            permissionSet.delete("read");
        }
        if (permissionSet.has("read_meta") &&
            !permissionSet.has("read_branches_meta")) {
            permissionSet.delete("read_meta");
        }
        if (permissionSet.has("read_inherits") &&
            !permissionSet.has("read_branches_inherits")) {
            permissionSet.delete("read_inherits");
        }
        if (permissionSet.has("read_history") &&
            !permissionSet.has("read_branches_history")) {
            permissionSet.delete("read_history");
        }
    }
    const res = new Set();
    // map subenv-specific permissions to generic environment permissions
    for (let permission of permissionSet) {
        let v;
        if (environment.isSub) {
            if (permission == "read_branches")
                v = "read";
            if (permission == "read_branches_history")
                v = "read_history";
            if (permission == "write_branches")
                v = "write";
            if (permission == "read_branches_inherits")
                v = "read_inherits";
            if (permission == "read_branches_meta")
                v = "read_meta";
        }
        if (!v) {
            v = permission;
        }
        res.add(v);
    }
    // elapsedNs("got res");
    return res;
}), exports.getAppRoleEnvironmentRolePermissions = getAppRoleEnvironmentRolePermissions, exports.getUserAppRolesByAppId = getUserAppRolesByAppId, exports.getAppRoleForUserOrInvitee = (0, memoize_1.default)((graph, appId, userId, accessParams) => {
    let orgRoleId;
    if (userId) {
        const user = graph[userId];
        if (!user) {
            return undefined;
        }
        ({ orgRoleId } = user);
    }
    else {
        orgRoleId = accessParams.orgRoleId;
    }
    const orgRole = graph[orgRoleId];
    let appRoleId;
    if (orgRole.autoAppRoleId) {
        appRoleId = orgRole.autoAppRoleId;
    }
    else if (userId) {
        const appUserGrant = (0, indexed_graph_1.getAppUserGrantsByComposite)(graph)[userId + "|" + appId];
        if (appUserGrant && !appUserGrant.deletedAt) {
            appRoleId = appUserGrant.appRoleId;
        }
        else {
            const appUserGroupAssoc = (0, app_users_1.getAppUserGroupAssoc)(graph, appId, userId);
            if (appUserGroupAssoc && !appUserGroupAssoc.deletedAt) {
                appRoleId = appUserGroupAssoc.appRoleId;
            }
        }
    }
    else if (accessParams && accessParams.appUserGrants) {
        const inviteAppUserGrant = R.find(R.propEq("appId", appId), accessParams.appUserGrants);
        if (inviteAppUserGrant) {
            appRoleId = inviteAppUserGrant.appRoleId;
        }
    }
    else if (accessParams && accessParams.userGroupIds) {
        for (let userGroupId of accessParams.userGroupIds) {
            let currentAppRole;
            const appUserGroup = (0, indexed_graph_1.getAppUserGroupsByComposite)(graph)[appId + "|" + userGroupId];
            if (appUserGroup) {
                const appRole = graph[appUserGroup.appRoleId];
                if (!currentAppRole ||
                    appRole.orderIndex < currentAppRole.orderIndex) {
                    currentAppRole = appRole;
                    appRoleId = appUserGroup.appRoleId;
                }
            }
        }
    }
    if (!appRoleId) {
        return undefined;
    }
    return graph[appRoleId];
}), exports.getAppRoleForUserGroup = (0, memoize_1.default)((graph, appId, userGroupId) => {
    var _a;
    const appUserGroup = (0, indexed_graph_1.getAppUserGroupsByComposite)(graph)[appId + "|" + userGroupId];
    if (appUserGroup) {
        return graph[appUserGroup.appRoleId];
    }
    // groups this app belongs to
    const appGroupIds = ((_a = (0, indexed_graph_1.getGroupMembershipsByObjectId)(graph)[appId]) !== null && _a !== void 0 ? _a : []).map(R.prop("groupId"));
    const appGroupUserGroupsByComposite = (0, indexed_graph_1.getAppGroupUserGroupsByComposite)(graph);
    for (let appGroupId of appGroupIds) {
        const appGroupUserGroup = appGroupUserGroupsByComposite[appGroupId + "|" + userGroupId];
        if (appGroupUserGroup) {
            return graph[appGroupUserGroup.appRoleId];
        }
    }
    return undefined;
}), exports.getConnectedAppPermissionsIntersectionForBlock = (0, memoize_1.default)((graph, blockId, userId, accessParams) => {
    const connectedApps = (0, app_blocks_1.getConnectedAppsForBlock)(graph, blockId);
    let intersection;
    for (let { id: appId } of connectedApps) {
        const appRole = (0, exports.getAppRoleForUserOrInvitee)(graph, appId, userId, accessParams), permissions = appRole
            ? Array.from((0, exports.getAppPermissions)(graph, appRole.id))
            : [];
        if (intersection) {
            intersection = R.intersection(intersection, permissions);
        }
        else {
            intersection = permissions;
        }
    }
    return new Set(intersection);
}), exports.getConnectedAppPermissionsUnionForBlock = (0, memoize_1.default)((graph, blockId, userId, accessParams) => {
    const connectedApps = (0, app_blocks_1.getConnectedAppsForBlock)(graph, blockId);
    let union = [];
    for (let { id: appId } of connectedApps) {
        const appRole = (0, exports.getAppRoleForUserOrInvitee)(graph, appId, userId, accessParams);
        if (appRole) {
            union = union.concat(Array.from((0, exports.getAppPermissions)(graph, appRole.id)));
        }
    }
    return new Set(union);
}), exports.getEnvParentPermissions = (0, memoize_1.default)((graph, envParentId, userId, accessParams) => {
    const envParent = graph[envParentId];
    if (!envParent) {
        return new Set();
    }
    if (envParent.type == "app") {
        let appRole;
        appRole = (0, exports.getAppRoleForUserOrInvitee)(graph, envParentId, userId, accessParams);
        return appRole ? (0, exports.getAppPermissions)(graph, appRole.id) : new Set();
    }
    else {
        return (0, exports.getConnectedAppPermissionsIntersectionForBlock)(graph, envParentId, userId, accessParams);
    }
});
//# sourceMappingURL=permissions.js.map