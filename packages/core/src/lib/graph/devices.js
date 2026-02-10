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
exports.getPubkeysByDeviceIdForUser = exports.getDeviceIdsForUser = void 0;
const R = __importStar(require("ramda"));
const memoize_1 = __importDefault(require("../../lib/utils/memoize"));
const indexed_graph_1 = require("./indexed_graph");
exports.getDeviceIdsForUser = (0, memoize_1.default)((graph, userId, now) => {
    var _a;
    const cliUser = graph[userId];
    if (cliUser && cliUser.type == "cliUser") {
        return cliUser.deactivatedAt ? [] : ["cli"];
    }
    const orgUserDevicesByUserId = (0, indexed_graph_1.getOrgUserDevicesByUserId)(graph), activeInvitesByInviteeId = (0, indexed_graph_1.getActiveInvitesByInviteeId)(graph, now), activeDeviceGrantsByGranteeId = (0, indexed_graph_1.getActiveDeviceGrantsByGranteeId)(graph, now);
    const res = [
        ...((_a = orgUserDevicesByUserId[userId]) !== null && _a !== void 0 ? _a : [])
            .filter(({ deactivatedAt }) => !deactivatedAt)
            .map(R.prop("id")),
        ...(activeInvitesByInviteeId[userId] || []).map(R.prop("id")),
        ...(activeDeviceGrantsByGranteeId[userId] || []).map(R.prop("id")),
    ], activeRecoveryKey = (0, indexed_graph_1.getActiveRecoveryKeysByUserId)(graph)[userId];
    if (activeRecoveryKey) {
        res.push(activeRecoveryKey.id);
    }
    return res;
}), exports.getPubkeysByDeviceIdForUser = (0, memoize_1.default)((graph, userId, now) => {
    var _a;
    const cliUser = graph[userId];
    if (cliUser && cliUser.type == "cliUser") {
        return {
            ["cli"]: cliUser.pubkey,
        };
    }
    const orgUserDevicesByUserId = (0, indexed_graph_1.getOrgUserDevicesByUserId)(graph), activeInvitesByInviteeId = (0, indexed_graph_1.getActiveInvitesByInviteeId)(graph, now), activeDeviceGrantsByGranteeId = (0, indexed_graph_1.getActiveDeviceGrantsByGranteeId)(graph, now);
    const res = R.mergeAll([
        ...((_a = orgUserDevicesByUserId[userId]) !== null && _a !== void 0 ? _a : [])
            .filter(({ deactivatedAt }) => !deactivatedAt)
            .map(({ id, pubkey }) => ({
            [id]: pubkey,
        })),
        ...(activeInvitesByInviteeId[userId] || []).map(({ id, pubkey }) => ({
            [id]: pubkey,
        })),
        ...(activeDeviceGrantsByGranteeId[userId] || []).map(({ id, pubkey }) => ({
            [id]: pubkey,
        })),
    ]), activeRecoveryKey = (0, indexed_graph_1.getActiveRecoveryKeysByUserId)(graph)[userId];
    if (activeRecoveryKey) {
        res[activeRecoveryKey.id] = activeRecoveryKey.pubkey;
    }
    return res;
});
//# sourceMappingURL=devices.js.map