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
exports.getListableOrgUsers = exports.getOrgRolesAssignableToUser = exports.getRemoveableUsers = exports.getRoleUpdateableUsers = exports.getRenameableUsers = void 0;
const __1 = require("../..");
const authz = __importStar(require("../authorizers"));
const memoize_1 = __importDefault(require("../../../utils/memoize"));
exports.getRenameableUsers = (0, memoize_1.default)((graph, currentUserId) => (0, __1.graphTypes)(graph).orgUsers.filter(({ id, deactivatedAt }) => !deactivatedAt && authz.canRenameUser(graph, currentUserId, id))), exports.getRoleUpdateableUsers = (0, memoize_1.default)((graph, currentUserId) => (0, __1.graphTypes)(graph).orgUsers.filter(({ id, deactivatedAt }) => !deactivatedAt &&
    (0, exports.getOrgRolesAssignableToUser)(graph, currentUserId, id).length > 0)), exports.getRemoveableUsers = (0, memoize_1.default)((graph, currentUserId) => (0, __1.graphTypes)(graph).orgUsers.filter(({ id, deactivatedAt }) => !deactivatedAt && authz.canRemoveFromOrg(graph, currentUserId, id))), exports.getOrgRolesAssignableToUser = (0, memoize_1.default)((graph, currentUserId, targetUserId) => (0, __1.graphTypes)(graph).orgRoles.filter(({ id: orgRoleId }) => authz.canUpdateUserRole(graph, currentUserId, targetUserId, orgRoleId))), exports.getListableOrgUsers = (0, memoize_1.default)((graph, currentUserId) => authz.canListOrgUsers(graph, currentUserId)
    ? (0, __1.graphTypes)(graph).orgUsers.filter(({ deactivatedAt }) => !deactivatedAt)
    : []);
//# sourceMappingURL=org_users.js.map