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
exports.getDeviceIsImmediatelyDeletable = exports.getUserIsImmediatelyDeletable = exports.getSignedByNonLocalKeyableIds = exports.getSignedByKeyableIds = exports.getEncryptedByLocalIds = exports.getEncryptedByEnvironmentIds = exports.getKeyablesByPubkeyId = void 0;
const R = __importStar(require("ramda"));
const base_1 = require("./base");
const indexed_graph_1 = require("./indexed_graph");
const memoize_1 = __importDefault(require("../../lib/utils/memoize"));
exports.getKeyablesByPubkeyId = (0, memoize_1.default)((graph) => {
    const byPubkeyId = {};
    const objects = (0, base_1.graphObjects)(graph);
    for (let obj of objects) {
        if ("pubkeyId" in obj) {
            byPubkeyId[obj.pubkeyId] = obj;
        }
    }
    return byPubkeyId;
});
exports.getEncryptedByEnvironmentIds = (0, memoize_1.default)((graph, encryptedById) => {
    const environmentIds = [];
    const { environments } = (0, base_1.graphTypes)(graph);
    for (let environment of environments) {
        if (environment.encryptedById === encryptedById) {
            environmentIds.push(environment.id);
        }
    }
    return environmentIds;
});
exports.getEncryptedByLocalIds = (0, memoize_1.default)((graph, encryptedById) => {
    const localIds = [];
    const { apps, blocks } = (0, base_1.graphTypes)(graph);
    for (let envParent of [...apps, ...blocks]) {
        for (let localsUserId in envParent.localsEncryptedBy) {
            if (envParent.localsEncryptedBy[localsUserId] === encryptedById) {
                localIds.push(envParent.id + "|" + localsUserId);
            }
        }
    }
    return localIds;
});
exports.getSignedByKeyableIds = (0, memoize_1.default)((graph, signedById) => {
    const keyableIds = [];
    for (let obj of (0, base_1.graphObjects)(graph)) {
        if ("signedById" in obj && obj.signedById === signedById) {
            keyableIds.push(obj.id);
        }
    }
    return keyableIds;
});
exports.getSignedByNonLocalKeyableIds = (0, memoize_1.default)((graph, signedById) => {
    const keyableIds = [];
    for (let obj of (0, base_1.graphObjects)(graph)) {
        if ("signedById" in obj &&
            obj.signedById === signedById &&
            !(obj.type == "generatedEnvkey" && obj.keyableParentType == "localKey")) {
            keyableIds.push(obj.id);
        }
    }
    return keyableIds;
});
const getUserIsImmediatelyDeletable = (graph, userId) => {
    var _a;
    const user = graph[userId];
    if (user.type == "orgUser" && !user.isCreator && !user.inviteAcceptedAt) {
        return true;
    }
    const targetIds = user.type == "cliUser"
        ? [user.id]
        : ((_a = (0, indexed_graph_1.getOrgUserDevicesByUserId)(graph)[user.id]) !== null && _a !== void 0 ? _a : []).map(R.prop("id"));
    return targetIds.every((targetId) => (0, exports.getDeviceIsImmediatelyDeletable)(graph, targetId, true));
};
exports.getUserIsImmediatelyDeletable = getUserIsImmediatelyDeletable;
const getDeviceIsImmediatelyDeletable = (graph, deviceId, excludeLocalKeys) => {
    const encryptedByEnvironmentIds = (0, exports.getEncryptedByEnvironmentIds)(graph, deviceId);
    const encryptedByLocalIds = (0, exports.getEncryptedByLocalIds)(graph, deviceId);
    const signedByKeyableIds = (excludeLocalKeys ? exports.getSignedByNonLocalKeyableIds : exports.getSignedByKeyableIds)(graph, deviceId);
    const encryptedOrSignedIds = [
        ...encryptedByEnvironmentIds,
        ...encryptedByLocalIds,
        ...signedByKeyableIds,
    ];
    return encryptedOrSignedIds.length === 0;
};
exports.getDeviceIsImmediatelyDeletable = getDeviceIsImmediatelyDeletable;
//# sourceMappingURL=trust.js.map