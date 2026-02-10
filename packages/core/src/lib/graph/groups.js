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
exports.getOrgAccessScopeForGroupMembers = exports.getOrgAccessScopeForGroupMembership = void 0;
const memoize_1 = __importDefault(require("../../lib/utils/memoize"));
const indexed_graph_1 = require("./indexed_graph");
const app_blocks_1 = require("./app_blocks");
const R = __importStar(require("ramda"));
const org_access_1 = require("./org_access");
exports.getOrgAccessScopeForGroupMembership = (0, memoize_1.default)((graph, groupId, objectId) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const group = graph[groupId];
    if (group.objectType == "orgUser") {
        // find all apps this group is connected to
        const appUserGroups = (_a = (0, indexed_graph_1.getAppUserGroupsByGroupId)(graph)[groupId]) !== null && _a !== void 0 ? _a : [];
        const appGroupUserGroups = (_b = (0, indexed_graph_1.getAppGroupUserGroupsByUserGroupId)(graph)[groupId]) !== null && _b !== void 0 ? _b : [];
        const appIds = new Set();
        const blockIds = new Set();
        const envParentIds = new Set();
        for (let { appId } of appUserGroups) {
            appIds.add(appId);
            envParentIds.add(appId);
        }
        for (let { appGroupId } of appGroupUserGroups) {
            const memberships = (_c = (0, indexed_graph_1.getGroupMembershipsByGroupId)(graph)[appGroupId]) !== null && _c !== void 0 ? _c : [];
            for (let { objectId: appId } of memberships) {
                appIds.add(appId);
                envParentIds.add(appId);
            }
        }
        // through connected apps, find all blocks this group is connected to
        for (let appId of appIds) {
            const connectedBlocks = (0, app_blocks_1.getConnectedBlocksForApp)(graph, appId);
            for (let { id } of connectedBlocks) {
                blockIds.add(id);
                envParentIds.add(id);
            }
        }
        return {
            envParentIds,
            userIds: new Set([objectId].filter(Boolean)),
        };
    }
    else if (group.objectType == "app") {
        const userIds = new Set();
        const envParentIds = new Set([objectId].filter(Boolean));
        const appGroupUsers = (_d = (0, indexed_graph_1.getAppGroupUsersByAppGroupId)(graph)[groupId]) !== null && _d !== void 0 ? _d : [];
        const appGroupUserGroups = (_e = (0, indexed_graph_1.getAppGroupUserGroupsByAppGroupId)(graph)[groupId]) !== null && _e !== void 0 ? _e : [];
        const appGroupBlocks = (_f = (0, indexed_graph_1.getAppGroupBlocksByAppGroupId)(graph)[groupId]) !== null && _f !== void 0 ? _f : [];
        const appGroupBlockGroups = (_g = (0, indexed_graph_1.getAppGroupBlockGroupsByAppGroupId)(graph)[groupId]) !== null && _g !== void 0 ? _g : [];
        for (let { userId } of appGroupUsers) {
            userIds.add(userId);
        }
        for (let { userGroupId } of appGroupUserGroups) {
            const memberships = (_h = (0, indexed_graph_1.getGroupMembershipsByGroupId)(graph)[userGroupId]) !== null && _h !== void 0 ? _h : [];
            for (let { objectId: userId } of memberships) {
                userIds.add(userId);
            }
        }
        for (let { blockId } of appGroupBlocks) {
            envParentIds.add(blockId);
        }
        for (let { blockGroupId } of appGroupBlockGroups) {
            const memberships = (_j = (0, indexed_graph_1.getGroupMembershipsByGroupId)(graph)[blockGroupId]) !== null && _j !== void 0 ? _j : [];
            for (let { objectId: blockId } of memberships) {
                envParentIds.add(blockId);
            }
        }
        return {
            userIds,
            envParentIds,
            keyableParentIds: "all",
        };
    }
    else if (group.objectType == "block") {
        const envParentIds = new Set([objectId].filter(Boolean));
        const appBlockGroups = (_k = (0, indexed_graph_1.getAppBlockGroupsByBlockGroupId)(graph)[groupId]) !== null && _k !== void 0 ? _k : [];
        const appGroupBlockGroups = (_l = (0, indexed_graph_1.getAppGroupBlockGroupsByBlockGroupId)(graph)[groupId]) !== null && _l !== void 0 ? _l : [];
        for (let { appId } of appBlockGroups) {
            envParentIds.add(appId);
        }
        for (let { appGroupId } of appGroupBlockGroups) {
            const memberships = (_m = (0, indexed_graph_1.getGroupMembershipsByGroupId)(graph)[appGroupId]) !== null && _m !== void 0 ? _m : [];
            for (let { objectId: appId } of memberships) {
                envParentIds.add(appId);
            }
        }
        return {
            envParentIds,
            userIds: "all",
            keyableParentIds: "all",
        };
    }
    throw new Error("Invalid group object type");
});
exports.getOrgAccessScopeForGroupMembers = (0, memoize_1.default)((graph, groupId, includeConnectedBlocks) => {
    var _a;
    const group = graph[groupId];
    const memberships = (_a = (0, indexed_graph_1.getGroupMembershipsByGroupId)(graph)[groupId]) !== null && _a !== void 0 ? _a : [];
    const objectIds = memberships.map(R.prop("objectId"));
    const objectIdsSet = new Set(objectIds);
    let scope;
    if (group.objectType == "orgUser") {
        scope = {
            userIds: objectIdsSet,
        };
    }
    else if (group.objectType == "app" && includeConnectedBlocks) {
        scope = {
            envParentIds: new Set([
                ...objectIds,
                ...R.flatten(objectIds.map((appId) => (0, app_blocks_1.getConnectedBlocksForApp)(graph, appId).map(R.prop("id")))),
            ]),
        };
    }
    else {
        scope = {
            envParentIds: objectIdsSet,
        };
    }
    if (!scope) {
        throw new Error("Invalid group object type");
    }
    return (0, org_access_1.mergeAccessScopes)(scope, (0, exports.getOrgAccessScopeForGroupMembership)(graph, groupId));
});
//# sourceMappingURL=groups.js.map