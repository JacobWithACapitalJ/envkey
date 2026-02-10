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
exports.getVersionForChangeset = exports.getChangesetForVersion = exports.getLatestVersionNumber = exports.getChangesetCommitNumber = exports.getChangesets = exports.getEnvWithMetaForActions = exports.getEntryKeysForAllVersions = exports.getEntryKeysForVersion = exports.getEnvWithMetaForVersion = void 0;
const envs_1 = require("./envs");
const pick_1 = require("../utils/pick");
const patch_1 = require("../utils/patch");
const memoize_1 = __importDefault(require("../utils/memoize"));
const R = __importStar(require("ramda"));
// import { log } from "../utils/logger";
const getEntryKeysForVersion = (state, params) => getEntryKeysForChangesetActions(getActionsForVersion(state, params)), getEntryKeysForAllVersions = (state, params) => getEntryKeysForChangesetActions((0, exports.getChangesets)(state, params).flatMap(R.prop("actions"))), getEnvWithMetaForActions = (actions, envWithMeta, reverseDiffs) => {
    let res = envWithMeta
        ? R.clone(envWithMeta)
        : { inherits: {}, variables: {} };
    for (let { payload: { diffs, reverse }, } of actions) {
        (0, patch_1.forceApplyPatch)(res, reverseDiffs ? reverse : diffs);
    }
    return res;
}, getChangesetCommitNumber = (state, params, changeset) => {
    const changesets = (0, exports.getChangesets)(state, params);
    const index = changesets.findIndex((c) => c.createdAt === changeset.createdAt &&
        c.encryptedById === c.encryptedById);
    if (index === -1) {
        throw new Error("Changeset commit not found!");
    }
    return params.reverse ? index * -1 : index + 1;
}, getChangesetForVersion = (state, params) => {
    const changesets = (0, exports.getChangesets)(state, params);
    let i = params.reverse ? 0 : 1;
    for (let changeset of changesets) {
        for (let action of changeset.actions) {
            if (i === Math.abs(params.version)) {
                return changeset;
            }
            i += 1;
        }
    }
    // not found
}, getVersionForChangeset = (state, params, changesetNumber) => {
    const changesets = (0, exports.getChangesets)(state, params);
    let changesetCounter = params.reverse ? 0 : 1;
    let versionCounter = changesetCounter;
    for (let c of changesets) {
        if (changesetCounter === changesetNumber) {
            return (versionCounter + c.actions.length) * (params.reverse ? -1 : 1);
        }
        changesetCounter++;
        versionCounter += c.actions.length;
    }
    throw new Error("Invalid changeset commit number!");
};
exports.getEnvWithMetaForVersion = (0, memoize_1.default)((state, params) => {
    if (params.reverse && params.version > 0) {
        throw new Error("When 'reverse' flag is passed, version must be 0 or a negative integer representing the number of versions *back* from the current value.");
    }
    const actions = getActionsForVersion(state, params), envWithMetaForActions = (0, exports.getEnvWithMetaForActions)(actions, params.reverse ? (0, envs_1.getEnvWithMeta)(state, params) : undefined, params.reverse);
    if (params.entryKeys) {
        // scope to params.entryKeys
        const envWithMeta = (0, envs_1.getPendingEnvWithMeta)(state, params);
        return {
            inherits: (R.filter((keys) => keys.length > 0, R.mergeDeepWith(R.union, R.mapObjIndexed(R.without(params.entryKeys), envWithMeta.inherits), R.mapObjIndexed(R.intersection(params.entryKeys), envWithMetaForActions.inherits)))),
            variables: Object.assign(Object.assign({}, R.omit(params.entryKeys, envWithMeta.variables)), (0, pick_1.pick)(params.entryKeys, envWithMetaForActions.variables)),
        };
    }
    else {
        return envWithMetaForActions;
    }
}), exports.getEntryKeysForVersion = getEntryKeysForVersion, exports.getEntryKeysForAllVersions = getEntryKeysForAllVersions, exports.getEnvWithMetaForActions = getEnvWithMetaForActions, exports.getChangesets = (0, memoize_1.default)((state, params) => {
    var _a;
    const { changesets } = (_a = state.changesets[params.environmentId]) !== null && _a !== void 0 ? _a : {};
    if (!changesets) {
        return [];
    }
    const comparator = params.reverse
        ? R.descend(R.prop("createdAt"))
        : R.ascend(R.prop("createdAt"));
    return R.sort(comparator, changesets
        .map((changeset) => {
        const actions = typeof params.createdAfter == "undefined" ||
            changeset.createdAt > params.createdAfter
            ? changeset.actions.filter(getActionsFilterFn(params))
            : [];
        return Object.assign(Object.assign({}, changeset), { actions: params.reverse ? R.reverse(actions) : actions });
    })
        .filter(({ actions }) => actions.length > 0));
}), exports.getChangesetCommitNumber = getChangesetCommitNumber, exports.getLatestVersionNumber = (0, memoize_1.default)((state, params) => params.reverse
    ? 0
    : (0, exports.getChangesets)(state, params).reduce((accumulator, current) => accumulator + current.actions.length, 0)), exports.getChangesetForVersion = getChangesetForVersion, exports.getVersionForChangeset = getVersionForChangeset;
const getActionsFilterFn = (params) => (action) => params.envParentId == action.meta.envParentId &&
    action.meta.environmentId == params.environmentId &&
    (!params.entryKeys ||
        R.intersection(params.entryKeys, action.meta.entryKeys).length > 0), getActionsForVersion = (state, params) => {
    const { envParentId, environmentId, entryKeys, version } = params;
    let changesets = (0, exports.getChangesets)(state, params);
    if (!changesets) {
        throw new Error("changesets not found.");
    }
    const actions = R.flatten(changesets.map(R.prop("actions")))
        .filter(getActionsFilterFn({ envParentId, environmentId, entryKeys }))
        .slice(0, Math.abs(version));
    if (actions.length == 0) {
        return [];
    }
    return actions;
}, getEntryKeysForChangesetActions = (actions) => R.uniq(R.flatten(actions.map(R.path(["meta", "entryKeys"]))));
//# sourceMappingURL=versions.js.map