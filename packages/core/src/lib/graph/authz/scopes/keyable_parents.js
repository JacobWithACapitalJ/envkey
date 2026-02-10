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
exports.getAppsPassingKeyableTest = exports.getKeyRevokableLocalKeys = exports.getKeyRevokableServers = exports.getKeyGeneratableLocalKeys = exports.getKeyGeneratableServers = exports.getDeletableLocalKeys = exports.getDeletableServers = exports.getLocalKeyCreatableEnvironments = exports.getServerCreatableEnvironments = void 0;
const R = __importStar(require("ramda"));
const _1 = require("../../.");
const authz = __importStar(require("../authorizers"));
const memoize_1 = __importDefault(require("./../../../utils/memoize"));
const getAppsPassingKeyableTest = (graph, currentUserId, test) => {
    const allKeys = [
        ...(0, _1.graphTypes)(graph).localKeys,
        ...(0, _1.graphTypes)(graph).servers,
    ];
    return (0, _1.graphTypes)(graph).apps.filter((app) => {
        const appKeys = allKeys.filter(R.propEq("appId", app.id));
        return appKeys.filter((k) => test(graph, currentUserId, k.id)).length;
    });
};
exports.getServerCreatableEnvironments = (0, memoize_1.default)((graph, currentUserId, appId) => {
    var _a;
    return ((_a = (0, _1.getEnvironmentsByEnvParentId)(graph)[appId]) !== null && _a !== void 0 ? _a : []).filter(({ id: environmentId }) => authz.canCreateServer(graph, currentUserId, environmentId));
}), exports.getLocalKeyCreatableEnvironments = (0, memoize_1.default)((graph, currentUserId, appId) => {
    var _a;
    return ((_a = (0, _1.getEnvironmentsByEnvParentId)(graph)[appId]) !== null && _a !== void 0 ? _a : []).filter(({ id: environmentId }) => authz.canCreateLocalKey(graph, currentUserId, environmentId));
}), exports.getDeletableServers = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).servers.filter((server) => server.appId == appId &&
    authz.canDeleteServer(graph, currentUserId, server.id))), exports.getDeletableLocalKeys = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).localKeys.filter((localKey) => localKey.appId == appId &&
    authz.canDeleteLocalKey(graph, currentUserId, localKey.id))), exports.getKeyGeneratableServers = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).servers.filter((server) => server.appId == appId &&
    authz.canGenerateKey(graph, currentUserId, server.id))), exports.getKeyGeneratableLocalKeys = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).localKeys.filter((localKey) => localKey.appId == appId &&
    authz.canGenerateKey(graph, currentUserId, localKey.id))), exports.getKeyRevokableServers = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).servers.filter((server) => server.appId == appId &&
    authz.canRevokeKey(graph, currentUserId, {
        keyableParentId: server.id,
    }))), exports.getKeyRevokableLocalKeys = (0, memoize_1.default)((graph, currentUserId, appId) => (0, _1.graphTypes)(graph).localKeys.filter((localKey) => localKey.appId == appId &&
    authz.canRevokeKey(graph, currentUserId, {
        keyableParentId: localKey.id,
    }))), exports.getAppsPassingKeyableTest = getAppsPassingKeyableTest;
//# sourceMappingURL=keyable_parents.js.map