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
exports.getInheritableEnvironments = exports.getEnvParentsPassingEnvTest = exports.getAppsPassingEnvTest = exports.getCanCreateSubEnvironmentForEnvironments = exports.getCanCreateBaseEnvironmentWithRoles = exports.getCanCreateSubEnvironmentsForEnvParents = exports.getEnvParentsWithDeletableSubEnvironments = exports.getDeletableSubEnvironmentsForEnvParent = exports.getEnvsReadableForParentId = exports.getEnvsUpdatableSubEnvironments = exports.getVisibleBaseEnvironmentAndLocalIds = exports.getVisibleBaseEnvironments = exports.getEnvsUpdatableBaseEnvironments = void 0;
const memoize_1 = __importDefault(require("./../../../utils/memoize"));
const g = __importStar(require("../../."));
const authorizers_1 = require("../authorizers");
const R = __importStar(require("ramda"));
exports.getEnvsUpdatableBaseEnvironments = (0, memoize_1.default)((graph, currentUserId, envParentId) => {
    var _a;
    return ((_a = g.getEnvironmentsByEnvParentId(graph)[envParentId]) !== null && _a !== void 0 ? _a : []).filter((environment) => !environment.isSub &&
        g.authz.canUpdateEnv(graph, currentUserId, environment.id));
}), exports.getVisibleBaseEnvironments = (0, memoize_1.default)((graph, currentUserId, envParentId) => {
    var _a;
    return ((_a = g.getEnvironmentsByEnvParentId(graph)[envParentId]) !== null && _a !== void 0 ? _a : []).filter((environment) => !environment.isSub &&
        (g.authz.canReadEnv(graph, currentUserId, environment.id) ||
            g.authz.canReadEnvMeta(graph, currentUserId, environment.id)));
}), exports.getVisibleBaseEnvironmentAndLocalIds = (0, memoize_1.default)((graph, currentUserId, envParentId, localsUserId) => {
    var _a;
    if (localsUserId) {
        if (g.authz.canReadLocals(graph, currentUserId, envParentId, localsUserId)) {
            return [envParentId + "|" + localsUserId];
        }
    }
    else {
        return ((_a = g.getEnvironmentsByEnvParentId(graph)[envParentId]) !== null && _a !== void 0 ? _a : [])
            .filter((environment) => !environment.isSub &&
            (g.authz.canReadEnv(graph, currentUserId, environment.id) ||
                g.authz.canReadEnvMeta(graph, currentUserId, environment.id)))
            .map(R.prop("id"));
    }
    return [];
}), exports.getEnvsUpdatableSubEnvironments = (0, memoize_1.default)((graph, currentUserId, parentEnvironmentId) => {
    var _a;
    return ((_a = g.getSubEnvironmentsByParentEnvironmentId(graph)[parentEnvironmentId]) !== null && _a !== void 0 ? _a : []).filter((environment) => environment.isSub &&
        g.authz.canUpdateEnv(graph, currentUserId, environment.id));
}), exports.getEnvsReadableForParentId = (0, memoize_1.default)((graph, currentUserId, envParentId) => {
    var _a;
    return ((_a = g.getEnvironmentsByEnvParentId(graph)[envParentId]) !== null && _a !== void 0 ? _a : []).filter((environment) => (0, authorizers_1.canReadEnv)(graph, currentUserId, environment.id));
}), exports.getDeletableSubEnvironmentsForEnvParent = (0, memoize_1.default)((graph, currentUserId, envParentId) => {
    var _a;
    return ((_a = g.getEnvironmentsByEnvParentId(graph)[envParentId]) !== null && _a !== void 0 ? _a : []).filter((environment) => environment.isSub &&
        (0, authorizers_1.canDeleteEnvironment)(graph, currentUserId, environment.id));
}), exports.getEnvParentsWithDeletableSubEnvironments = (0, memoize_1.default)((graph, currentUserId) => {
    const { apps, blocks } = g.graphTypes(graph);
    const envParents = [...apps, ...blocks];
    return envParents.filter((ep) => (0, exports.getDeletableSubEnvironmentsForEnvParent)(graph, currentUserId, ep.id)
        .length);
}), exports.getCanCreateSubEnvironmentsForEnvParents = (0, memoize_1.default)((graph, currentUserId) => {
    const { apps, blocks } = g.graphTypes(graph);
    const envParents = [...apps, ...blocks];
    return envParents.filter((ep) => (0, exports.getCanCreateSubEnvironmentForEnvironments)(graph, currentUserId, ep.id)
        .length);
}), exports.getCanCreateBaseEnvironmentWithRoles = (0, memoize_1.default)((graph, currentUserId, envParentId) => g
    .graphTypes(graph)
    .environmentRoles.filter(({ id: environmentRoleId }) => g.authz.canCreateBaseEnvironment(graph, currentUserId, envParentId, environmentRoleId))), exports.getCanCreateSubEnvironmentForEnvironments = (0, memoize_1.default)((graph, currentUserId, envParentId) => {
    var _a;
    return ((_a = g.getEnvironmentsByEnvParentId(graph)[envParentId]) !== null && _a !== void 0 ? _a : []).filter((environment) => !environment.isSub &&
        g.authz.canCreateSubEnvironment(graph, currentUserId, environment.id));
}), exports.getAppsPassingEnvTest = (0, memoize_1.default)((graph, currentUserId, test) => g.graphTypes(graph).apps.filter((app) => {
    var _a;
    const appEnvs = (_a = g.getEnvironmentsByEnvParentId(graph)[app.id]) !== null && _a !== void 0 ? _a : [];
    return (appEnvs.filter((environment) => test(graph, currentUserId, environment.id)).length > 0);
})), exports.getEnvParentsPassingEnvTest = (0, memoize_1.default)((graph, currentUserId, test) => {
    const { apps, blocks } = g.graphTypes(graph);
    const passingEnvParents = [...apps, ...blocks].filter((app) => {
        var _a;
        const appEnvs = (_a = g.getEnvironmentsByEnvParentId(graph)[app.id]) !== null && _a !== void 0 ? _a : [];
        const hasAtLeastOneEnvAvailable = appEnvs.filter((environment) => test(graph, currentUserId, environment.id)).length > 0;
        return hasAtLeastOneEnvAvailable;
    });
    return passingEnvParents;
}), exports.getInheritableEnvironments = (0, memoize_1.default)((graph, currentUserId, environmentId, inheritingEnvironmentIds) => {
    var _a;
    if (!g.authz.canReadEnv(graph, currentUserId, environmentId)) {
        return [];
    }
    const environment = graph[environmentId];
    const environments = ((_a = g.getEnvironmentsByEnvParentId(graph)[environment.envParentId]) !== null && _a !== void 0 ? _a : []).filter((candidate) => candidate.id != environmentId &&
        !inheritingEnvironmentIds.has(candidate.id) &&
        !candidate.isSub &&
        !(environment.isSub && environment.parentEnvironmentId == candidate.id) &&
        g.authz.canReadEnv(graph, currentUserId, candidate.id));
    return environments;
});
//# sourceMappingURL=envs.js.map