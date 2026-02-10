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
exports.mergeAccessScopes = exports.getOrgAccessSet = void 0;
const object_1 = require("../../lib/utils/object");
const permissions_1 = require("./permissions");
const app_blocks_1 = require("./app_blocks");
const scoped_1 = require("./scoped");
const lodash_set_1 = __importDefault(require("lodash.set"));
const R = __importStar(require("ramda"));
const getOrgAccessSet = (graph, scope) => {
    // const now = Date.now();
    let res = {};
    const { scopeUsers, scopeDevices, scopeApps, scopeEnvironments, scopeGeneratedEnvkeys, } = (0, scoped_1.getScoped)(graph, scope);
    for (let user of scopeUsers) {
        if (user.deletedAt || user.deactivatedAt) {
            continue;
        }
        const orgPermissions = (0, permissions_1.getOrgPermissions)(graph, user.orgRoleId);
        (0, lodash_set_1.default)(res, ["orgPermissions", "users", user.id], (0, object_1.setToObject)(orgPermissions));
        for (let { id: appId, deletedAt } of scopeApps) {
            if (deletedAt) {
                continue;
            }
            const appPermissions = (0, permissions_1.getEnvParentPermissions)(graph, appId, user.id);
            (0, lodash_set_1.default)(res, ["appPermissions", appId, "users", user.id], (0, object_1.setToObject)(appPermissions));
        }
        for (let { id: environmentId, deletedAt } of scopeEnvironments) {
            if (deletedAt) {
                continue;
            }
            const environmentPermissions = (0, permissions_1.getEnvironmentPermissions)(graph, environmentId, user.id);
            // logWithElapsed("got user environment permissions", now);
            (0, lodash_set_1.default)(res, ["environments", environmentId, "users", user.id], (0, object_1.setToObject)(environmentPermissions));
        }
    }
    // logWithElapsed("users", now);
    for (let { userId, id: deviceId, deletedAt, deactivatedAt } of scopeDevices) {
        if (deletedAt || deactivatedAt) {
            continue;
        }
        const orgUser = graph[userId];
        if (orgUser.deletedAt || orgUser.deactivatedAt) {
            continue;
        }
        const orgPermissions = (0, permissions_1.getOrgPermissions)(graph, orgUser.orgRoleId);
        (0, lodash_set_1.default)(res, ["orgPermissions", "devices", deviceId], (0, object_1.setToObject)(orgPermissions));
        for (let { id: appId, deletedAt } of scopeApps) {
            if (deletedAt) {
                continue;
            }
            const appPermissions = (0, permissions_1.getEnvParentPermissions)(graph, appId, userId);
            (0, lodash_set_1.default)(res, ["appPermissions", appId, "devices", deviceId], (0, object_1.setToObject)(appPermissions));
        }
        for (let { id: environmentId, deletedAt } of scopeEnvironments) {
            if (deletedAt) {
                continue;
            }
            const environmentPermissions = (0, permissions_1.getEnvironmentPermissions)(graph, environmentId, userId);
            (0, lodash_set_1.default)(res, ["environments", environmentId, "devices", deviceId], (0, object_1.setToObject)(environmentPermissions));
        }
    }
    // logWithElapsed("devices", now);
    for (let { id: generatedEnvkeyId, appId, keyableParentId, keyableParentType, deletedAt, } of scopeGeneratedEnvkeys) {
        if (deletedAt) {
            continue;
        }
        const keyableParent = graph[keyableParentId], environment = graph[keyableParent.environmentId];
        (0, lodash_set_1.default)(res, [
            "environments",
            environment.id,
            keyableParentType + "s",
            keyableParentId,
        ], generatedEnvkeyId);
        if (environment.isSub) {
            (0, lodash_set_1.default)(res, [
                "environments",
                environment.parentEnvironmentId,
                keyableParentType + "s",
                keyableParentId,
            ], generatedEnvkeyId);
        }
        const connectedBlockEnvironments = (0, app_blocks_1.getConnectedBlockEnvironmentsForApp)(graph, appId, undefined, environment.id);
        for (let blockEnvironment of connectedBlockEnvironments) {
            if (blockEnvironment.deletedAt) {
                continue;
            }
            if (scope != "all" &&
                scope.envParentIds &&
                scope.envParentIds != "all" &&
                !scope.envParentIds.has(blockEnvironment.envParentId)) {
                continue;
            }
            if (scope != "all" &&
                scope.environmentIds &&
                scope.environmentIds != "all" &&
                !scope.environmentIds.has(blockEnvironment.id)) {
                continue;
            }
            (0, lodash_set_1.default)(res, [
                "environments",
                blockEnvironment.id,
                keyableParentType + "s",
                keyableParentId,
            ], generatedEnvkeyId);
            if (blockEnvironment.isSub) {
                (0, lodash_set_1.default)(res, [
                    "environments",
                    blockEnvironment.parentEnvironmentId,
                    keyableParentType + "s",
                    keyableParentId,
                ], generatedEnvkeyId);
            }
        }
    }
    // logWithElapsed("envkeys", now);
    return res;
};
exports.getOrgAccessSet = getOrgAccessSet;
const mergeAccessScopes = (...sets) => {
    if (sets.some((scope) => scope == "all")) {
        return "all";
    }
    return sets.map(object_1.stripUndefinedRecursive).reduce(R.mergeWith((scope1, scope2) => {
        if (scope1 == "all" || scope2 == "all") {
            return "all";
        }
        else {
            return new Set(Array.from(scope1).concat(Array.from(scope2)));
        }
    }));
};
exports.mergeAccessScopes = mergeAccessScopes;
//# sourceMappingURL=org_access.js.map