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
exports.getConnectedActiveGeneratedEnvkeys = exports.getAllConnectedKeyableParents = exports.getOrphanedRecoveryKeyIds = exports.getOrphanedLocalKeyIds = exports.getOrphanedLocalKeyIdsForUser = void 0;
const R = __importStar(require("ramda"));
const base_1 = require("./base");
const permissions_1 = require("./permissions");
const indexed_graph_1 = require("./indexed_graph");
const memoize_1 = __importDefault(require("../../lib/utils/memoize"));
const app_blocks_1 = require("./app_blocks");
const getOrphanedLocalKeyIdsForUser = (graph, userId) => {
    const localKeys = ((0, base_1.graphTypes)(graph).localKeys || []).filter(R.propEq("userId", userId));
    return localKeys
        .filter(({ environmentId }) => !(0, permissions_1.getEnvironmentPermissions)(graph, environmentId, userId).has("read"))
        .map(R.prop("id"));
}, getOrphanedLocalKeyIds = (graph) => {
    var _a;
    const localKeys = (_a = (0, base_1.graphTypes)(graph).localKeys) !== null && _a !== void 0 ? _a : [];
    return localKeys
        .filter(({ environmentId, userId }) => !(0, permissions_1.getEnvironmentPermissions)(graph, environmentId, userId).has("read"))
        .map(R.prop("id"));
}, getOrphanedRecoveryKeyIds = (graph) => {
    const recoveryKeys = (0, indexed_graph_1.getActiveRecoveryKeys)(graph);
    return recoveryKeys
        .filter(({ userId }) => {
        const { orgRoleId } = graph[userId];
        return !(0, permissions_1.getOrgPermissions)(graph, orgRoleId).has("org_generate_recovery_key");
    })
        .map(R.prop("id"));
};
exports.getOrphanedLocalKeyIdsForUser = getOrphanedLocalKeyIdsForUser, exports.getOrphanedLocalKeyIds = getOrphanedLocalKeyIds, exports.getOrphanedRecoveryKeyIds = getOrphanedRecoveryKeyIds, exports.getAllConnectedKeyableParents = (0, memoize_1.default)((graph, environmentId) => {
    var _a, _b, _c, _d;
    const parents = [];
    parents.push(...((_a = (0, indexed_graph_1.getLocalKeysByEnvironmentId)(graph)[environmentId]) !== null && _a !== void 0 ? _a : []));
    parents.push(...((_b = (0, indexed_graph_1.getServersByEnvironmentId)(graph)[environmentId]) !== null && _b !== void 0 ? _b : []));
    for (let environment of (0, app_blocks_1.getConnectedEnvironments)(graph, environmentId)) {
        parents.push(...((_c = (0, indexed_graph_1.getLocalKeysByEnvironmentId)(graph)[environment.id]) !== null && _c !== void 0 ? _c : []));
        parents.push(...((_d = (0, indexed_graph_1.getServersByEnvironmentId)(graph)[environment.id]) !== null && _d !== void 0 ? _d : []));
    }
    return parents;
}), exports.getConnectedActiveGeneratedEnvkeys = (0, memoize_1.default)((graph, environmentId) => (0, exports.getAllConnectedKeyableParents)(graph, environmentId)
    .map(({ id }) => (0, indexed_graph_1.getActiveGeneratedEnvkeysByKeyableParentId)(graph)[id])
    .filter(Boolean));
//# sourceMappingURL=keyable_parents.js.map