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
Object.defineProperty(exports, "__esModule", { value: true });
exports.canReadBlockVersions = exports.canListBlockCollaborators = exports.canReorderBlocks = exports.canDisconnectBlock = exports.canConnectBlock = exports.canDeleteBlock = exports.canUpdateBlockSettings = exports.canRenameBlock = exports.canCreateBlock = void 0;
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const __1 = require("..");
const R = __importStar(require("ramda"));
const canCreateBlock = (graph, currentUserId) => (0, helpers_1.hasAllOrgPermissions)(graph, currentUserId, ["blocks_create"]), canRenameBlock = (graph, currentUserId, blockId) => {
    if (!(0, helpers_1.presence)(graph[blockId], "block")) {
        return false;
    }
    return ((0, helpers_1.hasAllOrgPermissions)(graph, currentUserId, ["blocks_rename"]) ||
        (0, helpers_1.hasAllConnectedBlockPermissions)(graph, currentUserId, blockId, [
            "app_rename",
        ]));
}, canUpdateBlockSettings = (graph, currentUserId, blockId) => (0, helpers_1.hasAllOrgPermissions)(graph, currentUserId, ["blocks_manage_settings"]) &&
    Boolean((0, helpers_1.presence)(graph[blockId], "block")), canDeleteBlock = (graph, currentUserId, blockId) => (0, helpers_1.hasAllOrgPermissions)(graph, currentUserId, ["blocks_delete"]) &&
    Boolean((0, helpers_1.presence)(graph[blockId], "block")), canConnectBlock = (graph, currentUserId, appId, blockId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, , currentOrgPermissions] = currentUserRes;
    const app = (0, helpers_1.presence)(graph[appId], "app");
    if (!app) {
        return false;
    }
    const block = (0, helpers_1.presence)(graph[blockId], "block");
    if (!block) {
        return false;
    }
    const appBlockComposite = app.id + "|" + block.id, existingAppBlock = (0, _1.getAppBlocksByComposite)(graph)[appBlockComposite];
    if (existingAppBlock) {
        return false;
    }
    if (!currentOrgPermissions.has("blocks_manage_connections_permitted") ||
        !(0, helpers_1.hasAllAppPermissions)(graph, currentUserId, appId, ["app_manage_blocks"])) {
        return false;
    }
    // ensure user has write access to all overlapping block environments
    const blockEnvironments = (0, _1.getConnectedBlockEnvironmentsForApp)(graph, app.id, block.id);
    return R.all(Boolean, blockEnvironments.map(({ id: environmentId }) => (0, _1.getEnvironmentPermissions)(graph, environmentId, currentUserId).has("write")));
}, canDisconnectBlock = (graph, currentUserId, params) => {
    var _a;
    const appBlockId = "appBlockId" in params
        ? params.appBlockId
        : (_a = (0, _1.getAppBlocksByComposite)(graph)[params.appId + "|" + params.blockId]) === null || _a === void 0 ? void 0 : _a.id;
    if (!appBlockId) {
        return false;
    }
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, , currentOrgPermissions] = currentUserRes;
    const existingAppBlock = (0, helpers_1.presence)(graph[appBlockId], "appBlock");
    if (!existingAppBlock) {
        return false;
    }
    const { appId, blockId } = existingAppBlock;
    const app = (0, helpers_1.presence)(graph[appId], "app");
    if (!app) {
        return false;
    }
    const block = (0, helpers_1.presence)(graph[blockId], "block");
    if (!block) {
        return false;
    }
    if (!currentOrgPermissions.has("blocks_manage_connections_permitted") ||
        !(0, helpers_1.hasAllAppPermissions)(graph, currentUserId, appId, ["app_manage_blocks"])) {
        return false;
    }
    return true;
}, canReorderBlocks = (graph, currentUserId, appId, order) => {
    var _a;
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, , currentOrgPermissions] = currentUserRes;
    const app = (0, helpers_1.presence)(graph[appId], "app");
    if (!app) {
        return false;
    }
    if (!currentOrgPermissions.has("blocks_manage_connections_permitted") ||
        !(0, helpers_1.hasAllAppPermissions)(graph, currentUserId, appId, ["app_manage_blocks"])) {
        return false;
    }
    const blockIds = ((_a = (0, _1.getAppBlocksByAppId)(graph)[app.id]) !== null && _a !== void 0 ? _a : []).map(R.prop("blockId"));
    if (blockIds.length < 2) {
        return false;
    }
    if (order &&
        !R.equals(R.sortBy(R.identity, Object.keys(order)), R.sortBy(R.identity, blockIds))) {
        return false;
    }
    return true;
}, canListBlockCollaborators = (graph, currentUserId, blockId, userType) => {
    const orgManagePermission = {
        orgUser: "org_manage_users",
        cliUser: "org_manage_cli_users",
    }[userType];
    const appManagePermission = {
        orgUser: "app_manage_users",
        cliUser: "app_manage_cli_users",
    }[userType];
    return ((0, helpers_1.hasOrgPermission)(graph, currentUserId, orgManagePermission) ||
        (0, _1.getEnvParentPermissions)(graph, blockId, currentUserId).has(appManagePermission));
}, canReadBlockVersions = (graph, currentUserId, blockId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "blocks_read_all") ||
    (0, __1.canReadAnyEnvParentVersions)(graph, currentUserId, blockId);
exports.canCreateBlock = canCreateBlock, exports.canRenameBlock = canRenameBlock, exports.canUpdateBlockSettings = canUpdateBlockSettings, exports.canDeleteBlock = canDeleteBlock, exports.canConnectBlock = canConnectBlock, exports.canDisconnectBlock = canDisconnectBlock, exports.canReorderBlocks = canReorderBlocks, exports.canListBlockCollaborators = canListBlockCollaborators, exports.canReadBlockVersions = canReadBlockVersions;
//# sourceMappingURL=blocks.js.map