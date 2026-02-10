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
exports.clearNonPendingEnvsProducer = exports.initEnvironmentsIfNeeded = exports.recalcReverseDiffsProducer = exports.clearVoidedPendingEnvUpdatesProducer = exports.clearOverwrittenActionsProducer = exports.envUpdateAction = void 0;
const object_1 = require("@envkey/core/lib/utils/object");
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const graph_1 = require("@envkey/core/lib/graph");
const client_1 = require("@envkey/core/lib/client");
const handler_1 = require("../../handler");
const rfc6902_1 = require("rfc6902");
const logger_1 = require("@envkey/core/lib/utils/logger");
const blob_1 = require("@envkey/core/lib/blob");
const envUpdateAction = (params) => {
    const { actionType, updateFn } = params;
    (0, handler_1.clientAction)({
        // since auto-commit is disabled, this can be a simple clientAction
        // type: "asyncClientAction",
        type: "clientAction",
        actionType,
        stateProducer: (draft, action) => {
            var _a;
            const environmentId = action.payload.environmentId;
            let envParentId;
            const environment = draft.graph[environmentId];
            if (environment) {
                envParentId = environment.envParentId;
            }
            else {
                [envParentId] = environmentId.split("|");
            }
            let envWithMeta = (0, client_1.getPendingEnvWithMeta)(draft, R.pick(["envParentId", "environmentId"], action.payload));
            let updated = updateFn(draft, envWithMeta, action);
            updated = Object.assign(Object.assign({}, updated), { inherits: (0, client_1.getEnvInheritsForVariables)(updated.variables) });
            let diffs = (0, rfc6902_1.createPatch)(envWithMeta, updated);
            // don't queue update if nothing changed
            if (diffs.length == 0) {
                return;
            }
            // only include entryKeys that changed in meta.entryKeys
            const entryKeys = [];
            for (let { path } of diffs) {
                const k = (_a = path.match(/variables\/(.+?)(\/|$)/)) === null || _a === void 0 ? void 0 : _a[1];
                if (k) {
                    entryKeys.push(k);
                }
            }
            (0, exports.clearOverwrittenActionsProducer)(draft, {
                type: action.type,
                environmentId: action.payload.environmentId,
                entryKeys,
            });
            // after clearing any actions that were overwritten, recalc diffs again
            envWithMeta = (0, client_1.getPendingEnvWithMeta)(draft, R.pick(["envParentId", "environmentId"], action.payload));
            updated = updateFn(draft, envWithMeta, action);
            updated = Object.assign(Object.assign({}, updated), { inherits: (0, client_1.getEnvInheritsForVariables)(updated.variables) });
            diffs = (0, rfc6902_1.createPatch)(envWithMeta, updated);
            const reverse = (0, rfc6902_1.createPatch)(updated, envWithMeta);
            const revert = action.type == types_1.Client.ActionType.REVERT_ENVIRONMENT
                ? action
                    .payload.version
                : undefined, pendingAction = {
                type: actionType,
                payload: { diffs, reverse, revert },
                meta: Object.assign(Object.assign({}, (0, object_1.pick)(["envParentId", "environmentId"], action.payload)), { entryKeys, pendingAt: Date.now() }),
            };
            draft.pendingEnvUpdates.push(pendingAction);
            (0, exports.clearVoidedPendingEnvUpdatesProducer)(draft);
            (0, exports.recalcReverseDiffsProducer)(draft);
            draft.pendingEnvsUpdatedAt = Date.now();
        },
        // auto-commit is disabled for now, so handler isn't needed
        // handler: async (
        //   state,
        //   { payload: { environmentId } },
        //   { context, dispatchSuccess, dispatchFailure }
        // ) => {
        //   const autoCommit = getEnvironmentOrLocalsAutoCommitEnabled(
        //     state.graph,
        //     environmentId
        //   );
        //   if (autoCommit && Object.keys(state.isUpdatingEnvs).length == 0) {
        //     const res = await dispatch(
        //       {
        //         type: Client.ActionType.COMMIT_ENVS,
        //         payload: {
        //           pendingEnvironmentIds: [environmentId],
        //           autoCommit: true,
        //         },
        //       },
        //       context
        //     );
        //     if (!res.success) {
        //       return dispatchFailure((res.resultAction as any)?.payload, context);
        //     }
        //   }
        //   return dispatchSuccess(null, context);
        // },
    });
}, 
// this function can mutate newPending action in addition to draft
clearOverwrittenActionsProducer = (draft, newPending) => {
    draft.pendingEnvUpdates = draft.pendingEnvUpdates.filter((pending) => {
        if (pending.meta.environmentId != newPending.environmentId ||
            newPending.type == types_1.Client.ActionType.CREATE_ENTRY ||
            pending.type == types_1.Client.ActionType.CREATE_ENTRY) {
            return true;
        }
        const newPendingEntryKeys = new Set(newPending.entryKeys);
        if (pending.meta.entryKeys.every((k) => newPendingEntryKeys.has(k))) {
            return false;
        }
        return true;
    });
}, clearVoidedPendingEnvUpdatesProducer = (draft) => {
    var _a;
    if (draft.pendingEnvUpdates.length == 0) {
        return;
    }
    // if there are multiple pending updates and they combine to
    // produce no diff for an environment, clear them all out
    const environmentIds = (0, client_1.getPendingEnvironmentIds)(draft);
    const clearEnvironmentIds = new Set();
    for (let environmentId of environmentIds) {
        const environment = draft.graph[environmentId];
        const envParentId = (_a = environment === null || environment === void 0 ? void 0 : environment.envParentId) !== null && _a !== void 0 ? _a : environmentId.split("|")[0];
        const current = (0, client_1.getEnvWithMeta)(draft, { envParentId, environmentId });
        const pending = (0, client_1.getPendingEnvWithMeta)(draft, {
            envParentId,
            environmentId,
        }, Date.now());
        const eq = R.equals(current, pending);
        if (eq) {
            clearEnvironmentIds.add(environmentId);
        }
    }
    if (clearEnvironmentIds.size > 0) {
        draft.pendingEnvUpdates = draft.pendingEnvUpdates.filter(({ meta }) => !clearEnvironmentIds.has(meta.environmentId));
    }
    // the logic below would also clear out actions that made
    // no change from the previous version, but it's *very* slow
    // when there are a lot of pending updates
    // const byDistinctMetaJson = R.groupBy(
    //   (action) => stableStringify(action.meta),
    //   draft.pendingEnvUpdates
    // );
    // for (let metaJson in byDistinctMetaJson) {
    //   const meta = JSON.parse(
    //     metaJson
    //   ) as Client.Action.ReplayableEnvUpdateAction["meta"];
    //   const current = getEnvWithMeta(draft, meta);
    //   const pending = getEnvWithMeta(draft, meta, true);
    //   const diff = createPatch(current, pending);
    //   if (!(diff && diff.length > 0)) {
    //     draft.pendingEnvUpdates = R.without(
    //       byDistinctMetaJson[metaJson],
    //       draft.pendingEnvUpdates
    //     );
    //   }
    // }
    // // clear pending updates that don't produce a diff from previous version
    // while (true) {
    //   let removedAction = false;
    //   draft.pendingEnvUpdates = draft.pendingEnvUpdates.filter((action, i) => {
    //     const envWithMeta = getEnvWithMeta(draft, action.meta);
    //     const previousActions = draft.pendingEnvUpdates
    //       .slice(0, i)
    //       .filter(
    //         ({ meta: { environmentId } }) =>
    //           environmentId === action.meta.environmentId
    //       );
    //     const previousEnvWithMeta =
    //         previousActions.length > 0
    //           ? getEnvWithMetaForActions(previousActions, envWithMeta)
    //           : envWithMeta,
    //       nextEnvWithMeta = getEnvWithMetaForActions(
    //         [action],
    //         previousEnvWithMeta
    //       ),
    //       diff = createPatch(previousEnvWithMeta, nextEnvWithMeta);
    //     const keep = Boolean(diff && diff.length > 0);
    //     if (!keep) {
    //       removedAction = true;
    //     }
    //     return keep;
    //   });
    //   if (!removedAction) {
    //     return;
    //   }
    // }
}, recalcReverseDiffsProducer = (draft) => {
    draft.pendingEnvUpdates = draft.pendingEnvUpdates.map((action, i) => {
        const envWithMeta = (0, client_1.getEnvWithMeta)(draft, action.meta);
        const previousActions = draft.pendingEnvUpdates
            .slice(0, i)
            .filter(({ meta: { environmentId } }) => environmentId === action.meta.environmentId);
        const previousEnvWithMeta = previousActions.length > 0
            ? (0, client_1.getEnvWithMetaForActions)(previousActions, envWithMeta)
            : envWithMeta, nextEnvWithMeta = (0, client_1.getEnvWithMetaForActions)([action], previousEnvWithMeta), reverse = (0, rfc6902_1.createPatch)(nextEnvWithMeta, previousEnvWithMeta);
        return Object.assign(Object.assign({}, action), { payload: Object.assign(Object.assign({}, action.payload), { reverse }) });
    });
}, initEnvironmentsIfNeeded = async (state, currentUserId, context) => {
    // Abort if we're already fetching/updating envs or changesets
    // to avoid state condition deadlock
    if (Object.keys(state.isFetchingEnvs).length > 0 ||
        Object.keys(state.isFetchingChangesets).length > 0 ||
        Object.keys(state.isUpdatingEnvs).length > 0) {
        return;
    }
    const envParentIds = [
        ...(0, graph_1.graphTypes)(state.graph).apps,
        ...(0, graph_1.graphTypes)(state.graph).blocks,
    ].map(R.prop("id"));
    const { orgUsers, cliUsers } = (0, graph_1.graphTypes)(state.graph);
    const userIds = [...orgUsers, ...cliUsers].map(R.prop("id"));
    const localIds = R.flatten(envParentIds.map((envParentId) => {
        const envParent = state.graph[envParentId];
        return userIds
            .filter((userId) => graph_1.authz.canReadLocals(state.graph, userId, envParentId, userId) &&
            graph_1.authz.canUpdateLocals(state.graph, currentUserId, envParentId, userId) &&
            (!envParent.localsUpdatedAtByUserId[userId] ||
                envParent.localsRequireReinit))
            .map((userId) => `${envParentId}|${userId}`);
    }));
    const environmentIds = (0, graph_1.graphTypes)(state.graph)
        .environments.filter((environment) => graph_1.authz.canUpdateEnv(state.graph, currentUserId, environment.id) &&
        (!environment.envUpdatedAt || environment.requiresReinit))
        .map(R.prop("id"));
    if (localIds.length > 0 || environmentIds.length > 0) {
        (0, logger_1.log)("Init Environments", {
            localIds,
            environmentIds,
        });
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.COMMIT_ENVS,
            payload: {
                pendingEnvironmentIds: [...localIds, ...environmentIds],
                initEnvs: true,
            },
        }, context);
    }
};
exports.envUpdateAction = envUpdateAction, 
// this function can mutate newPending action in addition to draft
exports.clearOverwrittenActionsProducer = clearOverwrittenActionsProducer, exports.clearVoidedPendingEnvUpdatesProducer = clearVoidedPendingEnvUpdatesProducer, exports.recalcReverseDiffsProducer = recalcReverseDiffsProducer, exports.initEnvironmentsIfNeeded = initEnvironmentsIfNeeded;
const clearNonPendingEnvsProducer = (draft) => {
    // clear cached envs/changesets unless there are
    // env update actions pending for that app/block
    const pendingUpdate = (0, client_1.getPendingUpdateDetails)(draft);
    for (let composite in draft.envs) {
        const { environmentId } = (0, blob_1.parseUserEncryptedKeyOrBlobComposite)(composite);
        let envParentId;
        const environment = draft.graph[environmentId];
        if (environment) {
            envParentId = environment.envParentId;
        }
        else {
            [envParentId] = environmentId.split("|");
        }
        if (!pendingUpdate.apps.has(envParentId) &&
            !pendingUpdate.blocks.has(envParentId)) {
            delete draft.envs[composite];
            delete draft.envsFetchedAt[envParentId];
        }
    }
    for (let environmentId in draft.changesets) {
        let envParentId;
        const environment = draft.graph[environmentId];
        if (environment) {
            envParentId = environment.envParentId;
        }
        else {
            [envParentId] = environmentId.split("|");
        }
        if (!pendingUpdate.apps.has(envParentId) &&
            !pendingUpdate.blocks.has(envParentId)) {
            delete draft.changesets[environmentId];
            delete draft.changesetsFetchedAt[envParentId];
        }
    }
};
exports.clearNonPendingEnvsProducer = clearNonPendingEnvsProducer;
//# sourceMappingURL=updates.js.map