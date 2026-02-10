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
exports.canReadAnyEnvParentVersions = exports.canReadLocalsVersions = exports.canReadLocals = exports.canUpdateLocals = exports.canDeleteEnvironment = exports.canCreateSubEnvironment = exports.canCreateBaseEnvironment = exports.canReadVersions = exports.canReadAllEnvInherits = exports.canReadEnvInherits = exports.canReadSubEnvsMeta = exports.canReadSubEnvs = exports.canUpdateSubEnvs = exports.canReadEnvMeta = exports.canReadEnv = exports.canUpdateEnv = void 0;
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const R = __importStar(require("ramda"));
const memoize_1 = __importDefault(require("../../../utils/memoize"));
const __1 = require("..");
const canUpdateEnv = (graph, currentUserId, environmentId) => (0, _1.getEnvironmentPermissions)(graph, environmentId, currentUserId).has("write"), canReadEnv = (graph, currentUserId, environmentId) => (0, _1.getEnvironmentPermissions)(graph, environmentId, currentUserId).has("read"), canReadEnvMeta = (graph, currentUserId, environmentId) => (0, _1.getEnvironmentPermissions)(graph, environmentId, currentUserId).has("read_meta"), canUpdateSubEnvs = (graph, currentUserId, parentEnvironmentId) => (0, _1.getEnvironmentPermissions)(graph, parentEnvironmentId, currentUserId).has("write_branches"), canReadSubEnvs = (graph, currentUserId, parentEnvironmentId) => (0, _1.getEnvironmentPermissions)(graph, parentEnvironmentId, currentUserId).has("read_branches"), canReadSubEnvsMeta = (graph, currentUserId, parentEnvironmentId) => (0, _1.getEnvironmentPermissions)(graph, parentEnvironmentId, currentUserId).has("read_branches_meta"), canReadEnvInherits = (graph, currentUserId, environmentId) => (0, _1.getEnvironmentPermissions)(graph, environmentId, currentUserId).has("read_inherits"), canReadAllEnvInherits = (graph, currentUserId, envParentId) => {
    var _a;
    const environments = (_a = (0, _1.getEnvironmentsByEnvParentId)(graph)[envParentId]) !== null && _a !== void 0 ? _a : [];
    for (let environment of environments) {
        if (!(0, _1.getEnvironmentPermissions)(graph, environment.id, currentUserId).has("read_inherits")) {
            return false;
        }
    }
    return true;
}, canReadVersions = (graph, currentUserId, environmentId) => (0, _1.getEnvironmentPermissions)(graph, environmentId, currentUserId).has("read_history"), canCreateBaseEnvironment = (graph, currentUserId, envParentId, environmentRoleId) => {
    var _a;
    if (!canCreateOrDeleteBaseEnvironments(graph, currentUserId, envParentId)) {
        return false;
    }
    const environments = (_a = (0, _1.getEnvironmentsByEnvParentId)(graph)[envParentId]) !== null && _a !== void 0 ? _a : [];
    if (environments.find((environment) => environment.environmentRoleId == environmentRoleId)) {
        return false;
    }
    return true;
}, canCreateSubEnvironment = (graph, currentUserId, parentEnvironmentId) => {
    const parentEnvironment = (0, helpers_1.presence)(graph[parentEnvironmentId], "environment");
    if (!parentEnvironment) {
        return false;
    }
    if (parentEnvironment.isSub) {
        return false;
    }
    return (0, _1.getEnvironmentPermissions)(graph, parentEnvironmentId, currentUserId).has("write_branches");
}, canDeleteEnvironment = (graph, currentUserId, environmentId) => {
    const environment = (0, helpers_1.presence)(graph[environmentId], "environment");
    if (!environment ||
        !(0, exports.canReadAllEnvInherits)(graph, currentUserId, environment.envParentId)) {
        return false;
    }
    if (environment.isSub) {
        return (0, _1.getEnvironmentPermissions)(graph, environment.parentEnvironmentId, currentUserId).has("write_branches");
    }
    else {
        return canCreateOrDeleteBaseEnvironments(graph, currentUserId, environment.envParentId);
    }
}, canUpdateLocals = (graph, currentUserId, envParentId, localsUserId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, , currentOrgPermissions] = currentUserRes;
    const envParent = (0, helpers_1.presence)(graph[envParentId], "app") ||
        (0, helpers_1.presence)(graph[envParentId], "block");
    if (!envParent) {
        return false;
    }
    // ensure locals user can read their own locals
    if (!(0, exports.canReadLocals)(graph, localsUserId, envParentId, localsUserId)) {
        return false;
    }
    if (currentUserId == localsUserId) {
        return true;
    }
    const currentUserCanWriteOrgBlock = envParent.type == "block" &&
        currentOrgPermissions.has("blocks_write_envs_all");
    const currentUserEnvParentPermissions = (0, _1.getEnvParentPermissions)(graph, envParentId, currentUserId);
    return (currentUserCanWriteOrgBlock ||
        currentUserEnvParentPermissions.has("app_write_user_locals"));
}, canReadLocals = (graph, currentUserId, envParentId, localsUserId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, , currentOrgPermissions] = currentUserRes;
    const envParent = (0, helpers_1.presence)(graph[envParentId], "app") ||
        (0, helpers_1.presence)(graph[envParentId], "block");
    if (!envParent) {
        return false;
    }
    const currentUserCanReadOrgBlock = envParent.type == "block" && currentOrgPermissions.has("blocks_read_all");
    const envParentPermissions = (0, _1.getEnvParentPermissions)(graph, envParentId, currentUserId);
    if (currentUserId == localsUserId) {
        return (currentUserCanReadOrgBlock ||
            envParentPermissions.has("app_read_own_locals"));
    }
    return (currentUserCanReadOrgBlock ||
        envParentPermissions.has("app_read_user_locals"));
}, canReadLocalsVersions = (graph, currentUserId, envParentId, localsUserId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, , currentOrgPermissions] = currentUserRes;
    const envParent = (0, helpers_1.presence)(graph[envParentId], "app") ||
        (0, helpers_1.presence)(graph[envParentId], "block");
    if (!envParent) {
        return false;
    }
    // ensure locals user can read their own locals
    if (!(0, exports.canReadLocals)(graph, localsUserId, envParentId, localsUserId)) {
        return false;
    }
    const currentUserCanReadOrgBlock = envParent.type == "block" && currentOrgPermissions.has("blocks_read_all");
    const envParentPermissions = (0, _1.getEnvParentPermissions)(graph, envParentId, currentUserId);
    if (currentUserId == localsUserId) {
        return (currentUserCanReadOrgBlock ||
            envParentPermissions.has("app_read_own_locals"));
    }
    return (currentUserCanReadOrgBlock ||
        envParentPermissions.has("app_read_user_locals_history"));
};
exports.canUpdateEnv = canUpdateEnv, exports.canReadEnv = canReadEnv, exports.canReadEnvMeta = canReadEnvMeta, exports.canUpdateSubEnvs = canUpdateSubEnvs, exports.canReadSubEnvs = canReadSubEnvs, exports.canReadSubEnvsMeta = canReadSubEnvsMeta, exports.canReadEnvInherits = canReadEnvInherits, exports.canReadAllEnvInherits = canReadAllEnvInherits, exports.canReadVersions = canReadVersions, exports.canCreateBaseEnvironment = canCreateBaseEnvironment, exports.canCreateSubEnvironment = canCreateSubEnvironment, exports.canDeleteEnvironment = canDeleteEnvironment, exports.canUpdateLocals = canUpdateLocals, exports.canReadLocals = canReadLocals, exports.canReadLocalsVersions = canReadLocalsVersions, exports.canReadAnyEnvParentVersions = (0, memoize_1.default)((graph, currentUserId, envParentId) => R.any(Boolean, (0, __1.getVisibleBaseEnvironmentAndLocalIds)(graph, currentUserId, envParentId).map((environmentOrLocalId) => {
    const split = environmentOrLocalId.split("|");
    if (split.length == 2) {
        const [, localsUserId] = split;
        return (0, exports.canReadLocalsVersions)(graph, currentUserId, envParentId, localsUserId);
    }
    else {
        return (0, exports.canReadVersions)(graph, currentUserId, environmentOrLocalId);
    }
})));
const canCreateOrDeleteBaseEnvironments = (graph, currentUserId, envParentId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, , currentOrgPermissions] = currentUserRes;
    const envParent = (0, helpers_1.presence)(graph[envParentId], "app") ||
        (0, helpers_1.presence)(graph[envParentId], "block");
    if (!envParent) {
        return false;
    }
    if (envParent.type == "block") {
        return currentOrgPermissions.has("blocks_manage_environments");
    }
    return (0, helpers_1.hasAllAppPermissions)(graph, currentUserId, envParentId, [
        "app_manage_environments",
    ]);
};
//# sourceMappingURL=envs.js.map