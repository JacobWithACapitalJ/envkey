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
exports.getCurrentEncryptedKeys = void 0;
const R = __importStar(require("ramda"));
const base_1 = require("./base");
const indexed_graph_1 = require("./indexed_graph");
const permissions_1 = require("./permissions");
const devices_1 = require("./devices");
const app_blocks_1 = require("./app_blocks");
const memoize_1 = __importDefault(require("../utils/memoize"));
const scoped_1 = require("./scoped");
const lodash_set_1 = __importDefault(require("lodash.set"));
exports.getCurrentEncryptedKeys = (0, memoize_1.default)((graph, scope, now, skipFilterActive = false) => {
    // const start = Date.now();
    var _a, _b, _c;
    let keys = { type: "keySet" };
    const active = skipFilterActive ? graph : (0, base_1.getActiveGraph)(graph);
    const activeByType = (0, base_1.graphTypes)(skipFilterActive ? graph : active);
    // log("activeByType " + (Date.now() - start).toString());
    const allUsers = [...activeByType.orgUsers, ...activeByType.cliUsers];
    // log("allUsers " + (Date.now() - start).toString());
    let { scopeUsers, scopeApps, scopeBlocks, scopeEnvironments, scopeGeneratedEnvkeys, } = (0, scoped_1.getScoped)(active, scope);
    scopeUsers = scopeUsers.filter(({ deactivatedAt }) => !deactivatedAt);
    const scopeEnvParents = [...scopeApps, ...scopeBlocks];
    // log("getScoped " + (Date.now() - start).toString());
    const deviceIdsByUserId = {};
    const addUserPath = (userId, path, val = true) => {
        let deviceIds = deviceIdsByUserId[userId];
        if (!deviceIds) {
            deviceIds = (0, devices_1.getDeviceIdsForUser)(active, userId, now);
            if (scope != "all" && scope.deviceIds && scope.deviceIds != "all") {
                deviceIds = deviceIds.filter((id) => scope.deviceIds.has(id));
            }
            deviceIdsByUserId[userId] = deviceIds;
        }
        deviceIds.forEach((deviceId) => (0, lodash_set_1.default)(keys, ["users", userId, deviceId, ...path], val));
    };
    for (let { id: userId } of scopeUsers) {
        // environments
        for (let environment of scopeEnvironments) {
            if (environment.envUpdatedAt) {
                const addEnvironmentPath = (k, val = true) => addUserPath(userId, [environment.envParentId, "environments", environment.id, k], val);
                const permissions = (0, permissions_1.getEnvironmentPermissions)(active, environment.id, userId);
                if (permissions.has("read")) {
                    addEnvironmentPath("env");
                    const siblingBaseEnvironmentIds = ((_a = (0, indexed_graph_1.getEnvironmentsByEnvParentId)(active)[environment.envParentId]) !== null && _a !== void 0 ? _a : [])
                        .filter((sibling) => {
                        return (sibling.id != environment.id &&
                            !sibling.isSub &&
                            !(environment.isSub &&
                                environment.parentEnvironmentId == sibling.id) &&
                            sibling.envUpdatedAt);
                    })
                        .map(R.prop("id"));
                    if (siblingBaseEnvironmentIds.length > 0) {
                        addEnvironmentPath("inheritanceOverrides", siblingBaseEnvironmentIds);
                    }
                }
                if (permissions.has("read_meta")) {
                    addEnvironmentPath("meta");
                }
                if (permissions.has("read_inherits")) {
                    addEnvironmentPath("inherits");
                }
                if (permissions.has("read_history")) {
                    addEnvironmentPath("changesets");
                }
            }
        }
    }
    // log("users " + (Date.now() - start).toString());
    // keyable parents
    for (let generatedEnvkey of scopeGeneratedEnvkeys) {
        const keyableParent = active[generatedEnvkey.keyableParentId];
        const appProps = [];
        const environment = active[keyableParent.environmentId];
        if (environment.isSub) {
            const parentEnvironment = active[environment.parentEnvironmentId];
            if (parentEnvironment.envUpdatedAt) {
                appProps.push("env");
            }
            if (environment.envUpdatedAt) {
                appProps.push("subEnv");
            }
        }
        else {
            if (environment.envUpdatedAt) {
                appProps.push("env");
            }
        }
        if (keyableParent.type == "localKey") {
            const app = active[keyableParent.appId];
            if (app.localsUpdatedAtByUserId[keyableParent.userId]) {
                appProps.push("localOverrides");
            }
        }
        for (let prop of appProps) {
            (0, lodash_set_1.default)(keys, ["keyableParents", keyableParent.id, generatedEnvkey.id, prop], true);
        }
        // inheritance overrides
        const siblingBaseEnvironmentIds = ((_b = (0, indexed_graph_1.getEnvironmentsByEnvParentId)(active)[environment.envParentId]) !== null && _b !== void 0 ? _b : [])
            .filter((sibling) => sibling.id != environment.id &&
            !sibling.isSub &&
            !(environment.isSub && environment.parentEnvironmentId == sibling.id) &&
            sibling.envUpdatedAt)
            .map(R.prop("id"));
        if (siblingBaseEnvironmentIds.length > 0) {
            if (environment.isSub) {
                const parentEnvironment = active[environment.parentEnvironmentId];
                if (parentEnvironment.envUpdatedAt || environment.envUpdatedAt) {
                    (0, lodash_set_1.default)(keys, [
                        "keyableParents",
                        keyableParent.id,
                        generatedEnvkey.id,
                        "inheritanceOverrides",
                    ], siblingBaseEnvironmentIds);
                }
            }
            else {
                if (environment.envUpdatedAt) {
                    (0, lodash_set_1.default)(keys, [
                        "keyableParents",
                        keyableParent.id,
                        generatedEnvkey.id,
                        "inheritanceOverrides",
                    ], siblingBaseEnvironmentIds);
                }
            }
        }
        const connectedBlocks = (0, app_blocks_1.getConnectedBlocksForApp)(active, keyableParent.appId);
        for (let { id: blockId, localsUpdatedAtByUserId } of connectedBlocks) {
            if (scope != "all" &&
                scope.envParentIds &&
                scope.envParentIds != "all" &&
                !scope.envParentIds.has(blockId)) {
                continue;
            }
            const blockProps = [];
            const [blockEnvironment] = (0, app_blocks_1.getConnectedBlockEnvironmentsForApp)(active, keyableParent.appId, blockId, keyableParent.environmentId);
            if (blockEnvironment) {
                if (blockEnvironment.isSub) {
                    const parentEnvironment = active[blockEnvironment.parentEnvironmentId];
                    if (parentEnvironment.envUpdatedAt) {
                        blockProps.push("env");
                    }
                    if (blockEnvironment.envUpdatedAt) {
                        blockProps.push("subEnv");
                    }
                }
                else {
                    if (blockEnvironment.envUpdatedAt) {
                        blockProps.push("env");
                    }
                }
            }
            if (keyableParent.type == "localKey" &&
                localsUpdatedAtByUserId[keyableParent.userId]) {
                blockProps.push("localOverrides");
            }
            for (let prop of blockProps) {
                (0, lodash_set_1.default)(keys, [
                    "blockKeyableParents",
                    blockId,
                    keyableParent.id,
                    generatedEnvkey.id,
                    prop,
                ], true);
            }
            // inheritance overrides
            if (blockEnvironment) {
                const siblingBaseEnvironmentIds = ((_c = (0, indexed_graph_1.getEnvironmentsByEnvParentId)(active)[blockEnvironment.envParentId]) !== null && _c !== void 0 ? _c : [])
                    .filter((sibling) => sibling.id != blockEnvironment.id &&
                    !sibling.isSub &&
                    !(blockEnvironment.isSub &&
                        blockEnvironment.parentEnvironmentId == sibling.id) &&
                    sibling.envUpdatedAt)
                    .map(R.prop("id"));
                if (siblingBaseEnvironmentIds.length > 0) {
                    if (blockEnvironment.isSub) {
                        const parentEnvironment = active[blockEnvironment.parentEnvironmentId];
                        if (parentEnvironment.envUpdatedAt ||
                            blockEnvironment.envUpdatedAt) {
                            (0, lodash_set_1.default)(keys, [
                                "blockKeyableParents",
                                blockId,
                                keyableParent.id,
                                generatedEnvkey.id,
                                "inheritanceOverrides",
                            ], siblingBaseEnvironmentIds);
                        }
                    }
                    else {
                        if (blockEnvironment.envUpdatedAt) {
                            (0, lodash_set_1.default)(keys, [
                                "blockKeyableParents",
                                blockId,
                                keyableParent.id,
                                generatedEnvkey.id,
                                "inheritanceOverrides",
                            ], siblingBaseEnvironmentIds);
                        }
                    }
                }
            }
        }
    }
    // log("keyable parents " + (Date.now() - start).toString());
    for (let envParent of scopeEnvParents) {
        if (R.isEmpty(envParent.localsUpdatedAtByUserId)) {
            continue;
        }
        const addLocalsPath = (userId, localsUserId, k) => addUserPath(userId, [envParent.id, "locals", localsUserId, k]);
        const addLocals = (userId, localsUserId) => {
            addLocalsPath(userId, localsUserId, "env");
            addLocalsPath(userId, localsUserId, "meta");
            addLocalsPath(userId, localsUserId, "changesets");
        };
        const maybeAddLocals = (userId, localsUserId) => {
            const user = active[userId];
            const orgPermissions = (0, permissions_1.getOrgPermissions)(active, user.orgRoleId);
            if (envParent.type == "block" &&
                orgPermissions.has("blocks_read_all")) {
                addLocals(userId, localsUserId);
                return;
            }
            const envParentPermissions = (0, permissions_1.getEnvParentPermissions)(active, envParent.id, userId);
            if (envParentPermissions.has("app_read_user_locals") ||
                (userId == localsUserId &&
                    envParentPermissions.has("app_read_own_locals"))) {
                addLocals(userId, localsUserId);
            }
        };
        for (let { id: localsUserId } of scopeUsers) {
            if (!envParent.localsUpdatedAtByUserId[localsUserId]) {
                continue;
            }
            for (let { id: userId } of allUsers) {
                maybeAddLocals(userId, localsUserId);
            }
        }
        if (scope != "all" && scope.userIds && scope.userIds != "all") {
            for (let { id: localsUserId } of allUsers) {
                if (!envParent.localsUpdatedAtByUserId[localsUserId]) {
                    continue;
                }
                for (let { id: userId } of scopeUsers) {
                    maybeAddLocals(userId, localsUserId);
                }
            }
        }
    }
    // log("env parents " + (Date.now() - start).toString());
    return keys;
});
//# sourceMappingURL=current_encrypted_keys.js.map