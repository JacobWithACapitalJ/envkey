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
exports.getRevokableInvites = exports.getInvitableOrgRoles = void 0;
const _1 = require("../../.");
const authz = __importStar(require("../authorizers"));
const memoize_1 = __importDefault(require("./../../../utils/memoize"));
exports.getInvitableOrgRoles = (0, memoize_1.default)((graph, currentUserId) => (0, _1.graphTypes)(graph).orgRoles.filter(({ id: orgRoleId }) => authz.canInvite(graph, currentUserId, { orgRoleId }))), exports.getRevokableInvites = (0, memoize_1.default)((graph, currentUserId, now) => (0, _1.graphTypes)(graph).invites.filter(({ id: inviteId }) => authz.canRevokeInvite(graph, currentUserId, inviteId, now)));
//# sourceMappingURL=invites.js.map