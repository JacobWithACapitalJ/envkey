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
exports.fetchPendingEnvs = exports.fetchLoadedEnvs = exports.fetchRequiredEnvs = exports.fetchEnvsForUserOrAccessParams = void 0;
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const graph_1 = require("@envkey/core/lib/graph");
const client_1 = require("@envkey/core/lib/client");
const handler_1 = require("../../handler");
const fetchEnvsForUserOrAccessParams = async (state, allParams, context) => {
    const toFetchEnvs = new Set(), toFetchChangesets = new Set(), byType = (0, graph_1.graphTypes)(state.graph), allEnvironments = byType.environments, allEnvParents = [...byType.apps, ...byType.blocks];
    for (let { userId, accessParams } of allParams) {
        let orgRoleId;
        if (userId) {
            ({ orgRoleId } = state.graph[userId]);
        }
        else if (accessParams) {
            ({ orgRoleId } = accessParams);
        }
        else {
            throw new Error("either userId or accessParams required");
        }
        const orgPermissions = (0, graph_1.getOrgPermissions)(state.graph, orgRoleId);
        for (let environment of allEnvironments) {
            const permissions = (0, graph_1.getEnvironmentPermissions)(state.graph, environment.id, userId, accessParams);
            if ((permissions.has("read") ||
                permissions.has("read_meta") ||
                permissions.has("read_inherits")) &&
                environment.envUpdatedAt) {
                toFetchEnvs.add(environment.envParentId);
            }
            if (permissions.has("read_history") && environment.envUpdatedAt) {
                toFetchChangesets.add(environment.envParentId);
            }
        }
        for (let envParent of allEnvParents) {
            const permissions = (0, graph_1.getEnvParentPermissions)(state.graph, envParent.id, userId, accessParams);
            if (((envParent.type == "block" &&
                orgPermissions.has("blocks_read_all")) ||
                permissions.has("app_read_user_locals")) &&
                envParent.localsUpdatedAt) {
                toFetchEnvs.add(envParent.id);
            }
            if (((envParent.type == "block" &&
                orgPermissions.has("blocks_read_all")) ||
                permissions.has("app_read_user_locals_history")) &&
                envParent.localsUpdatedAt) {
                toFetchChangesets.add(envParent.id);
            }
        }
    }
    return (0, exports.fetchRequiredEnvs)(state, toFetchEnvs, toFetchChangesets, context, undefined, true);
}, fetchRequiredEnvs = async (state, requiredEnvs, requiredChangesets, context, skipWaitForReencryption, keysOnly) => {
    const envParentIds = R.uniq(Array.from(requiredEnvs).concat(Array.from(requiredChangesets)));
    let shouldFetch = false;
    const toFetch = {};
    for (let envParentId of envParentIds) {
        if (requiredEnvs.has(envParentId) &&
            requiredChangesets.has(envParentId) &&
            (0, client_1.envsNeedFetch)(state, envParentId) &&
            (0, client_1.changesetsNeedFetch)(state, envParentId)) {
            shouldFetch = true;
            toFetch[envParentId] = { envs: true, changesets: true };
        }
        else if (requiredEnvs.has(envParentId) &&
            (0, client_1.envsNeedFetch)(state, envParentId)) {
            shouldFetch = true;
            toFetch[envParentId] = { envs: true };
        }
        else if (requiredChangesets.has(envParentId) &&
            (0, client_1.changesetsNeedFetch)(state, envParentId)) {
            shouldFetch = true;
            toFetch[envParentId] = { changesets: true };
        }
    }
    if (shouldFetch) {
        return (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.FETCH_ENVS,
            payload: {
                byEnvParentId: toFetch,
                skipWaitForReencryption,
                keysOnly,
            },
        }, context);
    }
    return undefined;
}, fetchLoadedEnvs = async (state, context, skipWaitForReencryption) => {
    const envParentIds = new Set(Object.keys(state.envsFetchedAt));
    if (envParentIds.size > 0) {
        // log("fetching loaded envs:", { envParentIds: Array.from(envParentIds) });
        return (0, exports.fetchRequiredEnvs)(state, envParentIds, new Set(), context, skipWaitForReencryption);
    }
    else {
        return undefined;
    }
}, fetchPendingEnvs = async (state, context, skipWaitForReencryption) => {
    const pendingEnvironmentIds = (0, client_1.getPendingEnvironmentIds)(state);
    if (pendingEnvironmentIds.length > 0) {
        const pendingEnvParentIds = new Set(pendingEnvironmentIds.map((environmentId) => {
            const environment = state.graph[environmentId];
            if (environment) {
                return environment.envParentId;
            }
            else {
                const [envParentId] = environmentId.split("|");
                return envParentId;
            }
        }));
        if (pendingEnvParentIds.size > 0) {
            // log("fetching envs with pending:", {
            //   envParentIds: Array.from(pendingEnvParentIds),
            // });
            return (0, exports.fetchRequiredEnvs)(state, pendingEnvParentIds, new Set(), context, skipWaitForReencryption);
        }
        return undefined;
    }
};
exports.fetchEnvsForUserOrAccessParams = fetchEnvsForUserOrAccessParams, exports.fetchRequiredEnvs = fetchRequiredEnvs, exports.fetchLoadedEnvs = fetchLoadedEnvs, exports.fetchPendingEnvs = fetchPendingEnvs;
//# sourceMappingURL=fetch.js.map