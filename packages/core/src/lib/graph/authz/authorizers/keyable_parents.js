"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canRevokeKey = exports.canGenerateKey = exports.canDeleteLocalKey = exports.canCreateLocalKey = exports.canDeleteServer = exports.canCreateServer = void 0;
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const canCreateServer = (graph, currentUserId, environmentId) => {
    const environment = (0, helpers_1.presence)(graph[environmentId], "environment");
    if (!environment) {
        return false;
    }
    const app = (0, helpers_1.presence)(graph[environment.envParentId], "app");
    if (!app) {
        return false;
    }
    const environmentRole = graph[environment.environmentRoleId];
    if (!environmentRole.hasServers) {
        return false;
    }
    const environmentPermissions = (0, _1.getEnvironmentPermissions)(graph, environment.id, currentUserId);
    return (environmentPermissions.has("read") &&
        (0, helpers_1.hasAllAppPermissions)(graph, currentUserId, app.id, ["app_manage_servers"]));
}, canDeleteServer = (graph, currentUserId, serverId) => {
    const server = (0, helpers_1.presence)(graph[serverId], "server");
    if (!server) {
        return false;
    }
    const environment = (0, helpers_1.presence)(graph[server.environmentId], "environment");
    if (!environment) {
        return false;
    }
    const environmentPermissions = (0, _1.getEnvironmentPermissions)(graph, environment.id, currentUserId);
    return (environmentPermissions.has("read") &&
        (0, helpers_1.hasAllAppPermissions)(graph, currentUserId, server.appId, [
            "app_manage_servers",
        ]));
}, canCreateLocalKey = (graph, currentUserId, environmentId) => {
    const environment = (0, helpers_1.presence)(graph[environmentId], "environment");
    if (!environment) {
        return false;
    }
    const app = (0, helpers_1.presence)(graph[environment.envParentId], "app");
    if (!app) {
        return false;
    }
    const environmentRole = graph[environment.environmentRoleId];
    if (!environmentRole.hasLocalKeys) {
        return false;
    }
    const environmentPermissions = (0, _1.getEnvironmentPermissions)(graph, environment.id, currentUserId);
    return (environmentPermissions.has("read") &&
        (0, helpers_1.hasAllAppPermissions)(graph, currentUserId, app.id, [
            "app_manage_local_keys",
        ]));
}, canDeleteLocalKey = (graph, currentUserId, localKeyId) => {
    const localKey = (0, helpers_1.presence)(graph[localKeyId], "localKey");
    if (!localKey) {
        return false;
    }
    if (localKey.userId != currentUserId) {
        return false;
    }
    return (0, helpers_1.hasAllAppPermissions)(graph, currentUserId, localKey.appId, [
        "app_manage_local_keys",
    ]);
}, canGenerateKey = (graph, currentUserId, keyableParentId) => canGenerateOrRevokeKey(graph, currentUserId, keyableParentId), canRevokeKey = (graph, currentUserId, params) => {
    let generatedEnvkey;
    if ("generatedEnvkeyId" in params) {
        generatedEnvkey = (0, helpers_1.presence)(graph[params.generatedEnvkeyId], "generatedEnvkey");
    }
    else {
        generatedEnvkey = (0, _1.getActiveGeneratedEnvkeysByKeyableParentId)(graph)[params.keyableParentId];
    }
    if (!generatedEnvkey) {
        return false;
    }
    return canGenerateOrRevokeKey(graph, currentUserId, generatedEnvkey.keyableParentId);
};
exports.canCreateServer = canCreateServer, exports.canDeleteServer = canDeleteServer, exports.canCreateLocalKey = canCreateLocalKey, exports.canDeleteLocalKey = canDeleteLocalKey, exports.canGenerateKey = canGenerateKey, exports.canRevokeKey = canRevokeKey;
const canGenerateOrRevokeKey = (graph, currentUserId, keyableParentId) => {
    const keyableParent = (0, helpers_1.presence)(graph[keyableParentId], "server") ||
        (0, helpers_1.presence)(graph[keyableParentId], "localKey");
    if (!keyableParent) {
        return false;
    }
    const app = (0, helpers_1.presence)(graph[keyableParent.appId], "app");
    if (!app) {
        return false;
    }
    const environment = (0, helpers_1.presence)(graph[keyableParent.environmentId], "environment");
    if (!environment) {
        return false;
    }
    const environmentPermissions = (0, _1.getEnvironmentPermissions)(graph, environment.id, currentUserId);
    return (environmentPermissions.has("read") &&
        ((keyableParent.type == "server" &&
            (0, helpers_1.hasAllAppPermissions)(graph, currentUserId, app.id, [
                "app_manage_servers",
            ])) ||
            (keyableParent.type == "localKey" &&
                (0, helpers_1.hasAllAppPermissions)(graph, currentUserId, app.id, [
                    "app_manage_local_keys",
                ]))));
};
//# sourceMappingURL=keyable_parents.js.map