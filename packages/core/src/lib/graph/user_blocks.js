"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppConnectionsByBlockId = exports.getPermittedBlocksForUser = void 0;
const memoize_1 = __importDefault(require("../../lib/utils/memoize"));
const indexed_graph_1 = require("./indexed_graph");
const base_1 = require("./base");
const permissions_1 = require("./permissions");
const app_blocks_1 = require("./app_blocks");
exports.getPermittedBlocksForUser = (0, memoize_1.default)((graph, userId) => {
    const user = graph[userId];
    const currentOrgRole = graph[user.orgRoleId];
    const currentOrgPermissions = (0, permissions_1.getOrgPermissions)(graph, currentOrgRole.id);
    const { blocks } = (0, base_1.graphTypes)(graph);
    if (currentOrgPermissions.has("blocks_read_all")) {
        return blocks;
    }
    return blocks.filter(({ id: blockId }) => {
        var _a;
        const envParentPermissionsIntersection = (0, permissions_1.getEnvParentPermissions)(graph, blockId, userId);
        if (envParentPermissionsIntersection.size > 0) {
            return true;
        }
        const blockEnvironments = (_a = (0, indexed_graph_1.getEnvironmentsByEnvParentId)(graph)[blockId]) !== null && _a !== void 0 ? _a : [];
        for (let environment of blockEnvironments) {
            const permissions = (0, permissions_1.getEnvironmentPermissions)(graph, environment.id, userId);
            if (permissions.size > 0) {
                return true;
            }
        }
        return false;
    });
});
exports.getAppConnectionsByBlockId = (0, memoize_1.default)((graph, userId) => {
    const user = graph[userId];
    const currentOrgRole = graph[user.orgRoleId];
    const currentOrgPermissions = (0, permissions_1.getOrgPermissions)(graph, currentOrgRole.id);
    const canReadAllOrgBlocks = currentOrgPermissions.has("blocks_read_all");
    if (canReadAllOrgBlocks) {
        return {};
    }
    let { apps, blocks } = (0, base_1.graphTypes)(graph);
    const appConnectionsByBlockId = {};
    apps = apps.filter((app) => (0, permissions_1.getEnvParentPermissions)(graph, app.id, userId).size > 0);
    for (let block of blocks) {
        for (let app of apps) {
            const appBlock = (0, indexed_graph_1.getAppBlocksByComposite)(graph)[app.id + "|" + block.id];
            const appBlockAssoc = (0, app_blocks_1.getAppBlockGroupAssoc)(graph, app.id, block.id);
            if (appBlock || appBlockAssoc) {
                if (!appConnectionsByBlockId[block.id]) {
                    appConnectionsByBlockId[block.id] = [];
                }
                appConnectionsByBlockId[block.id].push(graph[app.id]);
            }
        }
    }
    return appConnectionsByBlockId;
});
//# sourceMappingURL=user_blocks.js.map