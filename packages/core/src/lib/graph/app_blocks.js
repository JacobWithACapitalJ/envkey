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
exports.getConnectedAppEnvironmentsForBlock = exports.getConnectedEnvironments = exports.getAllConnectedAppEnvironmentsForBlock = exports.getConnectedBlockEnvironmentsForApp = exports.getEnvParentWithConnectedIds = exports.getBlockSortVal = exports.getConnectedBlocksForApp = exports.getConnectedAppsForBlock = exports.getAppBlockGroupMembership = exports.getAppBlockGroupAssoc = void 0;
const R = __importStar(require("ramda"));
const memoize_1 = __importDefault(require("../../lib/utils/memoize"));
const indexed_graph_1 = require("./indexed_graph");
const base_1 = require("./base");
const array_1 = require("../utils/array");
const getBlockSortVal = (graph, appId, blockId) => {
    const assoc = (0, exports.getAppBlockGroupAssoc)(graph, appId, blockId), blockGroupMembership = assoc
        ? (0, exports.getAppBlockGroupMembership)(graph, appId, blockId)
        : undefined, appBlock = (0, indexed_graph_1.getAppBlocksByComposite)(graph)[appId + "|" + blockId];
    // we want to sort from most general attachment (group to group)
    // to most specific attachment (app to block). more specific connections
    // override more general.
    // we want to look for connections in REVERSE of the sort order so that
    // in cases of duplicate connections, the most specific takes precedence
    let res;
    if (appBlock) {
        const padsize = 15 - appBlock.orderIndex.toString().length, zeroPadding = R.repeat("0", padsize);
        res = ["4", ...zeroPadding, appBlock.orderIndex.toString()];
    }
    else if (assoc) {
        const padsize = blockGroupMembership
            ? 15 -
                (assoc.orderIndex.toString().length +
                    blockGroupMembership.orderIndex.toString().length)
            : 15 - assoc.orderIndex.toString().length, zeroPadding = R.repeat("0", padsize);
        switch (assoc.type) {
            case "appBlockGroup":
                res = [
                    "3",
                    ...zeroPadding,
                    assoc.orderIndex.toString(),
                    blockGroupMembership.orderIndex.toString(),
                ];
                break;
            case "appGroupBlock":
                res = ["2", ...zeroPadding, assoc.orderIndex.toString()];
                break;
            case "appGroupBlockGroup":
                res = [
                    "1",
                    ...zeroPadding,
                    assoc.orderIndex.toString(),
                    blockGroupMembership.orderIndex.toString(),
                ];
                break;
        }
    }
    if (!res) {
        return -1;
    }
    return parseInt(res.join(""));
};
exports.getAppBlockGroupAssoc = (0, memoize_1.default)((graph, appId, blockId) => {
    // we want to sort from most general attachment (group to group)
    // to most specific attachment (app to block). more specific connections
    // override more general.
    // we want to look for connections in REVERSE of the sort order so that
    // in cases of duplicate connections, the most specific takes precedence
    const blockGroupIds = ((0, indexed_graph_1.getGroupMembershipsByObjectId)(graph)[blockId] || []).map(R.prop("groupId")), appGroupIds = ((0, indexed_graph_1.getGroupMembershipsByObjectId)(graph)[appId] || []).map(R.prop("groupId"));
    const appBlockGroup = blockGroupIds
        .map((blockGroupId) => (0, indexed_graph_1.getAppBlockGroupsByComposite)(graph)[appId + "|" + blockGroupId])
        .filter(Boolean)[0];
    if (appBlockGroup) {
        return appBlockGroup;
    }
    const appGroupBlock = appGroupIds
        .map((appGroupId) => (0, indexed_graph_1.getAppGroupBlocksByComposite)(graph)[appGroupId + "|" + blockId])
        .filter(Boolean)[0];
    if (appGroupBlock) {
        return appGroupBlock;
    }
    const appGroupBlockGroup = R.flatten(blockGroupIds.map((blockGroupId) => appGroupIds.map((appGroupId) => (0, indexed_graph_1.getAppGroupBlockGroupsByComposite)(graph)[appGroupId + "|" + blockGroupId]))).filter(Boolean)[0];
    if (appGroupBlockGroup) {
        return appGroupBlockGroup;
    }
}), exports.getAppBlockGroupMembership = (0, memoize_1.default)((graph, appId, blockId) => {
    var _a;
    const assoc = (0, exports.getAppBlockGroupAssoc)(graph, appId, blockId);
    if (assoc && "blockGroupId" in assoc) {
        const membership = (_a = (0, indexed_graph_1.getGroupMembershipsByObjectId)(graph)[blockId]) === null || _a === void 0 ? void 0 : _a.filter(R.propEq("groupId", assoc.blockGroupId))[0];
        if (membership &&
            graph[membership.groupId].objectType == "block") {
            return membership;
        }
    }
}), exports.getConnectedAppsForBlock = (0, memoize_1.default)((graph, blockId) => {
    const apps = (0, base_1.graphTypes)(graph).apps;
    return apps.filter(({ id: id }) => {
        var _a;
        return (_a = (0, indexed_graph_1.getAppBlocksByComposite)(graph)[id + "|" + blockId]) !== null && _a !== void 0 ? _a : (0, exports.getAppBlockGroupAssoc)(graph, id, blockId);
    });
}), exports.getConnectedBlocksForApp = (0, memoize_1.default)((graph, appId) => {
    const blocks = (0, base_1.graphTypes)(graph).blocks, connected = R.sortBy(({ id: id }) => (0, exports.getBlockSortVal)(graph, appId, id), blocks.filter(({ id: id }) => {
        var _a;
        return (_a = (0, indexed_graph_1.getAppBlocksByComposite)(graph)[appId + "|" + id]) !== null && _a !== void 0 ? _a : (0, exports.getAppBlockGroupAssoc)(graph, appId, id);
    }));
    return connected;
}), exports.getBlockSortVal = getBlockSortVal, exports.getEnvParentWithConnectedIds = (0, memoize_1.default)((graph, envParentId) => {
    const envParent = graph[envParentId];
    if (envParent.type == "app") {
        return [
            envParentId,
            ...(0, exports.getConnectedBlocksForApp)(graph, envParentId).map(R.prop("id")),
        ];
    }
    else {
        return [envParentId];
    }
}), exports.getConnectedBlockEnvironmentsForApp = (0, memoize_1.default)((graph, appId, blockId, environmentId, environmentRoleId) => {
    let appEnvironments = (0, indexed_graph_1.getEnvironmentsByEnvParentId)(graph)[appId] || [];
    if (environmentId || environmentRoleId) {
        appEnvironments = appEnvironments.filter((appEnvironment) => (environmentId && appEnvironment.id == environmentId) ||
            (environmentRoleId &&
                appEnvironment.environmentRoleId == environmentRoleId));
    }
    const blockIds = blockId
        ? [blockId]
        : (0, exports.getConnectedBlocksForApp)(graph, appId).map(R.prop("id")), indexByBlockId = {};
    blockIds.forEach((id, i) => (indexByBlockId[id] = i));
    let blockEnvironments = R.flatten(blockIds.map((connectedBlockId) => (0, indexed_graph_1.getEnvironmentsByEnvParentId)(graph)[connectedBlockId] || []));
    const blockEnvironmentsByComposite = (0, array_1.groupBy)(indexed_graph_1.environmentCompositeId, blockEnvironments);
    let connectedBlockEnvironments = [];
    for (let appEnvironment of appEnvironments) {
        let connected = blockEnvironmentsByComposite[(0, indexed_graph_1.environmentCompositeId)(appEnvironment)];
        if (appEnvironment.isSub && !connected) {
            const parentEnvironment = graph[appEnvironment.parentEnvironmentId];
            connected =
                blockEnvironmentsByComposite[(0, indexed_graph_1.environmentCompositeId)(parentEnvironment)];
        }
        if (connected) {
            connectedBlockEnvironments.push(...connected);
        }
    }
    const res = R.sortBy(({ envParentId }) => indexByBlockId[envParentId], connectedBlockEnvironments);
    return res;
}), exports.getAllConnectedAppEnvironmentsForBlock = (0, memoize_1.default)((graph, blockId, blockEnvironmentIds) => {
    const connectedApps = (0, exports.getConnectedAppsForBlock)(graph, blockId);
    let blockEnvironments = (0, indexed_graph_1.getEnvironmentsByEnvParentId)(graph)[blockId] || [];
    if (blockEnvironmentIds) {
        blockEnvironments = blockEnvironments.filter(({ id }) => blockEnvironmentIds.has(id));
    }
    const blockEnvironmentComposites = blockEnvironments.map(indexed_graph_1.environmentCompositeId);
    return R.flatten(connectedApps.map((app) => Object.values(R.pick(blockEnvironmentComposites, (0, array_1.groupBy)(indexed_graph_1.environmentCompositeId, (0, indexed_graph_1.getEnvironmentsByEnvParentId)(graph)[app.id] || [])))));
}), exports.getConnectedEnvironments = (0, memoize_1.default)((graph, environmentId) => {
    var _a;
    const environment = graph[environmentId], envParent = graph[environment.envParentId];
    let connectedEnvironments = [];
    if (envParent.type == "block") {
        connectedEnvironments = connectedEnvironments.concat((0, exports.getConnectedAppEnvironmentsForBlock)(graph, envParent.id, environmentId));
    }
    connectedEnvironments = [
        ...connectedEnvironments,
        ...((_a = (0, indexed_graph_1.getSubEnvironmentsByParentEnvironmentId)(graph)[environmentId]) !== null && _a !== void 0 ? _a : []),
        ...R.flatten(connectedEnvironments.map((connectedEnvironment) => {
            var _a;
            return connectedEnvironment.isSub
                ? []
                : (_a = (0, indexed_graph_1.getSubEnvironmentsByParentEnvironmentId)(graph)[connectedEnvironment.id]) !== null && _a !== void 0 ? _a : [];
        })),
    ];
    return connectedEnvironments;
}), exports.getConnectedAppEnvironmentsForBlock = (0, memoize_1.default)((graph, blockId, environmentId, appId) => {
    const environmentsByEnvParentId = (0, indexed_graph_1.getEnvironmentsByEnvParentId)(graph), blockEnvironments = environmentId
        ? [graph[environmentId]]
        : environmentsByEnvParentId[blockId] || [], blockEnvironmentsByComposite = (0, array_1.indexBy)(indexed_graph_1.environmentCompositeId, blockEnvironments);
    let connectedApps = (0, exports.getConnectedAppsForBlock)(graph, blockId);
    if (appId) {
        connectedApps = connectedApps.filter(R.propEq("id", appId));
    }
    const connectedAppIds = connectedApps.map(R.prop("id"));
    return R.flatten(connectedAppIds.map((appId) => (environmentsByEnvParentId[appId] || []).filter((appEnvironment) => blockEnvironmentsByComposite[(0, indexed_graph_1.environmentCompositeId)(appEnvironment)])));
});
//# sourceMappingURL=app_blocks.js.map