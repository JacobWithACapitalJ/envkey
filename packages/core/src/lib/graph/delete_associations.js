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
exports.getDeleteKeyableParentAssociations = exports.getDeleteEnvironmentAssociations = exports.getDeleteGroupAssociations = exports.getDeleteBlockAssociations = exports.getDeleteAppAssociations = void 0;
const R = __importStar(require("ramda"));
const _1 = require(".");
const indexed_graph_1 = require("./indexed_graph");
const getDeleteAppAssociations = (graph, appId) => {
    var _a, _b, _c, _d;
    const app = graph[appId], byType = (0, _1.graphTypes)(graph), appUserGrants = byType.appUserGrants.filter(R.propEq("appId", app.id)), includedAppRoles = (0, _1.getIncludedAppRolesByAppId)(graph)[app.id], localKeys = byType.localKeys.filter(R.propEq("appId", app.id)), servers = byType.servers.filter(R.propEq("appId", app.id)), generatedEnvkeys = (_a = (0, _1.getActiveGeneratedEnvkeysByAppId)(graph)[app.id]) !== null && _a !== void 0 ? _a : [], appBlocks = ((_b = (0, _1.getAppBlocksByAppId)(graph)[app.id]) !== null && _b !== void 0 ? _b : []), groupMemberships = (_c = (0, _1.getGroupMembershipsByObjectId)(graph)[app.id]) !== null && _c !== void 0 ? _c : [], appUserGroups = byType.appUserGroups.filter(R.propEq("appId", app.id)), appBlockGroups = byType.appBlockGroups.filter(R.propEq("appId", app.id)), environments = (_d = (0, _1.getEnvironmentsByEnvParentId)(graph)[app.id]) !== null && _d !== void 0 ? _d : [];
    return [
        ...appUserGrants,
        ...appBlocks,
        ...generatedEnvkeys,
        ...localKeys,
        ...servers,
        ...includedAppRoles,
        ...groupMemberships,
        ...appUserGroups,
        ...appBlockGroups,
        ...environments,
    ];
}, getDeleteBlockAssociations = (graph, blockId) => {
    var _a, _b;
    const byType = (0, _1.graphTypes)(graph), appBlocks = ((_a = (0, indexed_graph_1.getAppBlocksByBlockId)(graph)[blockId]) !== null && _a !== void 0 ? _a : []), groupMemberships = (0, _1.getGroupMembershipsByObjectId)(graph)[blockId] || [], appGroupBlocks = byType.appGroupBlocks.filter(R.propEq("blockId", blockId)), environments = (_b = (0, _1.getEnvironmentsByEnvParentId)(graph)[blockId]) !== null && _b !== void 0 ? _b : [];
    return [
        ...appBlocks,
        ...groupMemberships,
        ...appGroupBlocks,
        ...environments,
    ];
}, getDeleteGroupAssociations = (graph, groupId) => {
    const byType = (0, _1.graphTypes)(graph), groupMemberships = byType.groupMemberships.filter(R.propEq("groupId", groupId)), appUserGroups = byType.appUserGroups.filter(R.propEq("userGroupId", groupId)), appGroupUserGroups = byType.appGroupUserGroups.filter(({ appGroupId, userGroupId }) => appGroupId == groupId || userGroupId == groupId), appGroupUsers = byType.appGroupUsers.filter(R.propEq("appGroupId", groupId)), appBlockGroups = byType.appBlockGroups.filter(R.propEq("blockGroupId", groupId)), appGroupBlocks = byType.appGroupBlocks.filter(R.propEq("appGroupId", groupId)), appGroupBlockGroups = byType.appGroupBlockGroups.filter(({ appGroupId, blockGroupId }) => appGroupId == groupId || blockGroupId == groupId);
    return [
        ...groupMemberships,
        ...appUserGroups,
        ...appGroupUserGroups,
        ...appGroupUsers,
        ...appBlockGroups,
        ...appGroupBlocks,
        ...appGroupBlockGroups,
    ];
}, getDeleteEnvironmentAssociations = (graph, environmentId) => {
    var _a;
    const byType = (0, _1.graphTypes)(graph), localKeys = byType.localKeys.filter(R.propEq("environmentId", environmentId)), servers = byType.servers.filter(R.propEq("environmentId", environmentId)), keyableParentAssociations = R.flatten([...localKeys, ...servers].map(({ id }) => (0, exports.getDeleteKeyableParentAssociations)(graph, id))), subEnvironments = (_a = (0, indexed_graph_1.getSubEnvironmentsByParentEnvironmentId)(graph)[environmentId]) !== null && _a !== void 0 ? _a : [], subEnvironmentAssociations = R.flatten(subEnvironments.map(({ id }) => (0, exports.getDeleteEnvironmentAssociations)(graph, id)));
    return [
        ...localKeys,
        ...servers,
        ...keyableParentAssociations,
        ...subEnvironments,
        ...subEnvironmentAssociations,
    ];
}, getDeleteKeyableParentAssociations = (graph, keyableParentId) => {
    const generatedEnvkey = (0, _1.getActiveGeneratedEnvkeysByKeyableParentId)(graph)[keyableParentId];
    return generatedEnvkey ? [generatedEnvkey] : [];
};
exports.getDeleteAppAssociations = getDeleteAppAssociations, exports.getDeleteBlockAssociations = getDeleteBlockAssociations, exports.getDeleteGroupAssociations = getDeleteGroupAssociations, exports.getDeleteEnvironmentAssociations = getDeleteEnvironmentAssociations, exports.getDeleteKeyableParentAssociations = getDeleteKeyableParentAssociations;
//# sourceMappingURL=delete_associations.js.map