"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canManageBlockGroups = exports.canManageAppGroups = exports.canManageUserGroups = void 0;
const helpers_1 = require("./helpers");
const canManageUserGroups = (graph, currentUserId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_teams");
exports.canManageUserGroups = canManageUserGroups;
const canManageAppGroups = (graph, currentUserId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_app_groups");
exports.canManageAppGroups = canManageAppGroups;
const canManageBlockGroups = (graph, currentUserId) => (0, helpers_1.hasOrgPermission)(graph, currentUserId, "org_manage_block_groups");
exports.canManageBlockGroups = canManageBlockGroups;
//# sourceMappingURL=groups.js.map