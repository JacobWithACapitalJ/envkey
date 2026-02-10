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
exports.getAppUserGroupAssoc = void 0;
const R = __importStar(require("ramda"));
const memoize_1 = __importDefault(require("../../lib/utils/memoize"));
const indexed_graph_1 = require("./indexed_graph");
const getSortByAppRoleFn = (graph) => (o) => {
    const appRole = graph[o.appRoleId];
    return appRole.orderIndex;
};
exports.getAppUserGroupAssoc = (0, memoize_1.default)((graph, appId, userId) => {
    const userGroupIds = ((0, indexed_graph_1.getGroupMembershipsByObjectId)(graph)[userId] || []).map(R.prop("groupId")), appUserGroup = R.sortBy(getSortByAppRoleFn(graph), userGroupIds
        .map((userGroupId) => (0, indexed_graph_1.getAppUserGroupsByComposite)(graph)[appId + "|" + userGroupId])
        .filter(Boolean))[0];
    if (appUserGroup) {
        return appUserGroup;
    }
    const appGroupIds = ((0, indexed_graph_1.getGroupMembershipsByObjectId)(graph)[appId] || []).map(R.prop("groupId")), appGroupUser = R.sortBy(getSortByAppRoleFn(graph), appGroupIds
        .map((appGroupId) => (0, indexed_graph_1.getAppGroupUsersByComposite)(graph)[appGroupId + "|" + userId])
        .filter(Boolean))[0];
    if (appGroupUser) {
        return appGroupUser;
    }
    const appGroupUserGroup = R.sortBy(getSortByAppRoleFn(graph), R.flatten(userGroupIds.map((userGroupId) => appGroupIds.map((appGroupId) => (0, indexed_graph_1.getAppGroupUserGroupsByComposite)(graph)[appGroupId + "|" + userGroupId]))).filter(Boolean))[0];
    if (appGroupUserGroup) {
        return appGroupUserGroup;
    }
});
//# sourceMappingURL=app_users.js.map