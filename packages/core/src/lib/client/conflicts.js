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
exports.hasPendingConflicts = exports.getNumPendingConflicts = exports.getAllPendingConflicts = exports.getEnvironmentPendingConflicts = void 0;
const memoize_1 = __importDefault(require("../utils/memoize"));
const versions_1 = require("./versions");
const R = __importStar(require("ramda"));
const graph_1 = require("../graph");
const envs_1 = require("./envs");
const patch_1 = require("../utils/patch");
exports.getEnvironmentPendingConflicts = (0, memoize_1.default)((state, environmentId) => {
    var _a;
    let envParentId;
    const environment = state.graph[environmentId];
    if (environment) {
        envParentId = environment.envParentId;
    }
    else {
        // local overrides
        [envParentId] = environmentId.split("|");
    }
    if (!state.graph[envParentId]) {
        return [];
    }
    const envWithMeta = (0, envs_1.getEnvWithMeta)(state, {
        envParentId,
        environmentId,
    });
    const pendingEnvWithMeta = (0, envs_1.getPendingEnvWithMeta)(state, {
        envParentId,
        environmentId,
    });
    const earliestPendingAt = (0, envs_1.getEarliestEnvUpdatePendingAt)(state, environmentId);
    if (!earliestPendingAt) {
        return [];
    }
    const pendingActions = (_a = (0, envs_1.getPendingActionsByEnvironmentId)(state)[environmentId]) !== null && _a !== void 0 ? _a : [];
    const pendingEntryKeys = pendingActions.reduce((agg, { meta: { entryKeys } }) => R.union(agg, entryKeys), []);
    const changesets = (0, versions_1.getChangesets)(state, {
        envParentId,
        environmentId,
        entryKeys: pendingEntryKeys,
        createdAfter: earliestPendingAt,
    });
    // get the *latest* potentially conflicting updates for each key
    const resByKey = {};
    for (let changeset of changesets) {
        for (let action of changeset.actions) {
            const overlappingEntryKeys = R.intersection(action.meta.entryKeys, pendingEntryKeys);
            // don't count actions that have an equivalent outcome as conflicts
            for (let entryKey of overlappingEntryKeys) {
                const envWithMetaToUpdate = R.clone(envWithMeta);
                (0, patch_1.forceApplyPatch)(envWithMetaToUpdate, action.payload.diffs);
                if (!R.equals(envWithMetaToUpdate.variables[entryKey], pendingEnvWithMeta.variables[entryKey])) {
                    resByKey[entryKey] = { entryKey, changeset, action };
                }
            }
        }
    }
    return Object.values(resByKey);
}), exports.getAllPendingConflicts = (0, memoize_1.default)((state, envParentIdsArg, environmentIdsArg) => {
    const localsUserFilter = (localsUserId) => {
        const localsUser = state.graph[localsUserId];
        return localsUser && !localsUser.deactivatedAt;
    };
    const allConflicts = {};
    const sortEnvironments = R.sortWith([
        R.ascend(R.prop("isSub")),
        R.ascend((environment) => {
            const name = (0, graph_1.getEnvironmentName)(state.graph, environment.id);
            const i = ["Development", "Staging", "Production"].indexOf(name);
            return i == -1 ? name : i;
        }),
    ]);
    let toCheckEnvironmentIds;
    if (environmentIdsArg) {
        toCheckEnvironmentIds = environmentIdsArg;
    }
    else if (envParentIdsArg) {
        // environments
        toCheckEnvironmentIds = R.flatten(envParentIdsArg.map((envParentIdArg) => {
            var _a;
            return sortEnvironments((_a = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[envParentIdArg]) !== null && _a !== void 0 ? _a : []);
        })).map(R.prop("id"));
        // locals
        toCheckEnvironmentIds = toCheckEnvironmentIds.concat(R.flatten(envParentIdsArg.map((envParentIdArg) => {
            const envParent = state.graph[envParentIdArg];
            return R.sortBy((localsUserId) => (0, graph_1.getEnvironmentName)(state.graph, [envParent.id, localsUserId].join("|")), Object.keys(envParent.localsUpdatedAtByUserId).filter(localsUserFilter));
        })));
    }
    else {
        const { environments, apps, blocks } = (0, graph_1.graphTypes)(state.graph);
        // all environments
        toCheckEnvironmentIds = sortEnvironments(environments).map(R.prop("id"));
        // all locals
        for (let { id: envParentId, localsUpdatedAtByUserId } of [
            ...apps,
            ...blocks,
        ]) {
            toCheckEnvironmentIds = toCheckEnvironmentIds.concat(R.sortBy((localsUserId) => (0, graph_1.getEnvironmentName)(state.graph, [envParentId, localsUserId].join("|")), Object.keys(localsUpdatedAtByUserId).filter(localsUserFilter)));
        }
    }
    for (let environmentId of toCheckEnvironmentIds) {
        const environmentConflicts = (0, exports.getEnvironmentPendingConflicts)(state, environmentId);
        if (environmentConflicts.length > 0) {
            const environment = state.graph[environmentId];
            if (!allConflicts[environment.envParentId]) {
                allConflicts[environment.envParentId] = {};
            }
            allConflicts[environment.envParentId][environmentId] =
                environmentConflicts;
        }
    }
    return allConflicts;
});
exports.getNumPendingConflicts = (0, memoize_1.default)((state, envParentIds, environmentIds) => {
    const allPendingConflicts = (0, exports.getAllPendingConflicts)(state, envParentIds, environmentIds);
    return R.flatten(R.values(allPendingConflicts).map(R.values)).length;
});
const hasPendingConflicts = (state, envParentIds, environmentIds) => (0, exports.getNumPendingConflicts)(state, envParentIds, environmentIds) > 0;
exports.hasPendingConflicts = hasPendingConflicts;
//# sourceMappingURL=conflicts.js.map