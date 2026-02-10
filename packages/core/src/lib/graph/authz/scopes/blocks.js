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
exports.getLocalsReadableBlockCollaborators = exports.getBlockCollaborators = exports.getDisconnectableAppsForBlock = exports.getDisconnectableBlocksForApp = exports.getConnectableAppsForBlock = exports.getConnectableBlocksForApp = exports.getDeletableBlocks = exports.getSettingsUpdatableBlocks = exports.getRenameableBlocks = void 0;
const _1 = require("../../.");
const authz = __importStar(require("../authorizers"));
const R = __importStar(require("ramda"));
const memoize_1 = __importDefault(require("../../../utils/memoize"));
const permissions_1 = require("../../permissions");
exports.getRenameableBlocks = (0, memoize_1.default)((graph, currentUserId) => (0, _1.graphTypes)(graph).blocks.filter(({ id }) => authz.canRenameBlock(graph, currentUserId, id))), exports.getSettingsUpdatableBlocks = (0, memoize_1.default)((graph, currentUserId) => (0, _1.graphTypes)(graph).blocks.filter(({ id }) => authz.canUpdateBlockSettings(graph, currentUserId, id))), exports.getDeletableBlocks = (0, memoize_1.default)((graph, currentUserId) => (0, _1.graphTypes)(graph).blocks.filter(({ id }) => authz.canDeleteBlock(graph, currentUserId, id))), exports.getConnectableBlocksForApp = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).blocks.filter(({ id }) => authz.canConnectBlock(graph, currentUserId, appId, id))), exports.getConnectableAppsForBlock = (0, memoize_1.default)((graph, currentUserId, blockId) => (0, _1.graphTypes)(graph).apps.filter(({ id }) => {
    const res = authz.canConnectBlock(graph, currentUserId, id, blockId);
    return res;
})), exports.getDisconnectableBlocksForApp = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).blocks.filter(({ id }) => authz.canDisconnectBlock(graph, currentUserId, {
    blockId: id,
    appId,
}))), exports.getDisconnectableAppsForBlock = (0, memoize_1.default)((graph, currentUserId, blockId) => (0, _1.graphTypes)(graph).apps.filter(({ id }) => authz.canDisconnectBlock(graph, currentUserId, {
    appId: id,
    blockId,
}))), exports.getBlockCollaborators = (0, memoize_1.default)((graph, currentUserId, blockId, userType) => {
    if (!authz.canListBlockCollaborators(graph, currentUserId, blockId, userType)) {
        return [];
    }
    const users = (0, _1.graphTypes)(graph)[(userType + "s")];
    let collaborators = users.filter((user) => {
        return (authz.hasOrgPermission(graph, user.id, "blocks_read_all") ||
            (0, permissions_1.getConnectedAppPermissionsUnionForBlock)(graph, blockId, user.id)
                .size > 0);
    });
    collaborators = R.sortBy((user) => {
        if (authz.hasOrgPermission(graph, user.id, "blocks_read_all")) {
            const orgRole = graph[user.orgRoleId];
            return orgRole.orderIndex;
        }
        return user.type == "cliUser" ? user.name : user.lastName;
    }, collaborators);
    return collaborators;
}), exports.getLocalsReadableBlockCollaborators = (0, memoize_1.default)((graph, currentUserId, blockId, userType) => R.sortBy((user) => user.type == "cliUser"
    ? user.name
    : `${user.lastName} ${user.firstName}`, (0, exports.getBlockCollaborators)(graph, currentUserId, blockId, userType).filter((user) => authz.canReadLocals(graph, currentUserId, blockId, user.id))));
//# sourceMappingURL=blocks.js.map