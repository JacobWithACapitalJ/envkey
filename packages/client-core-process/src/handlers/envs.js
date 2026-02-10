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
const index_1 = require("./../lib/state/index");
const object_1 = require("@envkey/core/lib/utils/object");
const immer_1 = __importDefault(require("immer"));
const R = __importStar(require("ramda"));
const async = __importStar(require("@envkey/core/lib/async"));
const client_1 = require("@envkey/core/lib/client");
const blob_1 = require("@envkey/core/lib/blob");
const graph_1 = require("@envkey/core/lib/graph");
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const envs_1 = require("../lib/envs");
const status_1 = require("../lib/status");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const redux_store_1 = require("@envkey/client-core-process/redux_store");
const lodash_unset_1 = __importDefault(require("lodash.unset"));
const status_2 = require("@envkey/client-core-process/lib/envs/status");
(0, envs_1.envUpdateAction)({
    actionType: types_1.Client.ActionType.CREATE_ENTRY,
    updateFn: (state, envWithMeta, { payload }) => (0, immer_1.default)(envWithMeta, (draft) => {
        draft.variables[payload.entryKey] = payload.val;
    }),
});
(0, envs_1.envUpdateAction)({
    actionType: types_1.Client.ActionType.UPDATE_ENTRY,
    updateFn: (state, envWithMeta, { payload }) => (0, immer_1.default)(envWithMeta, (draft) => {
        draft.variables[payload.newEntryKey] = draft.variables[payload.entryKey];
        delete draft.variables[payload.entryKey];
    }),
});
(0, envs_1.envUpdateAction)({
    actionType: types_1.Client.ActionType.REMOVE_ENTRY,
    updateFn: (state, envWithMeta, { payload }) => (0, immer_1.default)(envWithMeta, (draft) => {
        delete draft.variables[payload.entryKey];
    }),
});
(0, envs_1.envUpdateAction)({
    actionType: types_1.Client.ActionType.UPDATE_ENTRY_VAL,
    updateFn: (state, envWithMeta, { payload }) => {
        // ensure we can't set a circular inheritance value. infinite loops are bad mm'kay
        if (payload.update.inheritsEnvironmentId) {
            const inheriting = (0, client_1.getPendingInheritingEnvironmentIds)(state, payload);
            if (inheriting.has(payload.update.inheritsEnvironmentId)) {
                return envWithMeta;
            }
        }
        const res = (0, immer_1.default)(envWithMeta, (draft) => {
            draft.variables[payload.entryKey] = payload.update;
        });
        return res;
    },
});
(0, envs_1.envUpdateAction)({
    actionType: types_1.Client.ActionType.REVERT_ENVIRONMENT,
    updateFn: (state, envWithMeta, { payload }) => (0, client_1.getEnvWithMetaForVersion)(state, payload),
});
(0, envs_1.envUpdateAction)({
    actionType: types_1.Client.ActionType.IMPORT_ENVIRONMENT,
    updateFn: (state, envWithMeta, { payload }) => (0, immer_1.default)(envWithMeta, (draft) => {
        for (let k in payload.parsed) {
            let val = payload.parsed[k];
            let inheritsEnvironmentId;
            if (val) {
                const inheritsMatch = val.match(/^inherits:([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i);
                if (inheritsMatch) {
                    inheritsEnvironmentId = inheritsMatch[1];
                    const inheriting = (0, client_1.getPendingInheritingEnvironmentIds)(state, Object.assign(Object.assign({}, payload), { entryKey: k }));
                    if (inheriting.has(inheritsEnvironmentId)) {
                        continue;
                    }
                    val = undefined;
                    const environment = state.graph[inheritsEnvironmentId];
                    if (!environment ||
                        environment.type !== "environment" ||
                        environment.envParentId !== payload.envParentId) {
                        continue;
                    }
                }
            }
            if (inheritsEnvironmentId) {
                draft.variables[k] = { inheritsEnvironmentId };
            }
            else if (typeof val == "undefined") {
                draft.variables[k] = { isUndefined: true };
            }
            else {
                draft.variables[k] = val === "" ? { val, isEmpty: true } : { val };
            }
        }
    }),
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CREATE_ENTRY_ROW,
    handler: async (state, { payload: { vals, envParentId, entryKey } }, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await Promise.all(R.toPairs(vals).map(([environmentId, update]) => {
            let canUpdate;
            const environment = state.graph[environmentId];
            if (environment) {
                const permissions = (0, graph_1.getEnvironmentPermissions)(state.graph, environmentId, auth.userId);
                canUpdate = permissions.has("write");
            }
            else {
                const [envParentId, localsUserId] = environmentId.split("|");
                canUpdate = graph_1.authz.canUpdateLocals(state.graph, auth.userId, envParentId, localsUserId);
            }
            if (!canUpdate) {
                throw new Error("User must have write permissions for all environments to update an entry");
            }
            return (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.CREATE_ENTRY,
                payload: {
                    envParentId,
                    entryKey,
                    environmentId,
                    val: update !== null && update !== void 0 ? update : { isUndefined: true },
                },
            }, context);
        }));
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.UPDATE_ENTRY_ROW,
    handler: async (state, { payload: { envParentId, entryKey, newEntryKey } }, context) => {
        var _a;
        const environments = ((_a = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[envParentId]) !== null && _a !== void 0 ? _a : []).filter((environment) => !environment.isSub), auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await Promise.all(environments
            .map((environment) => {
            const permissions = (0, graph_1.getEnvironmentPermissions)(state.graph, environment.id, auth.userId);
            if (!permissions.has("write")) {
                throw new Error("User must have write permissions for all environments to update an entry");
            }
            const envWithMeta = (0, client_1.getPendingEnvWithMeta)(state, {
                envParentId,
                environmentId: environment.id,
            });
            if (!envWithMeta || !(entryKey in envWithMeta.variables)) {
                return;
            }
            return (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.UPDATE_ENTRY,
                payload: {
                    envParentId,
                    environmentId: environment.id,
                    entryKey,
                    newEntryKey,
                },
            }, context);
        })
            .filter(Boolean));
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.REMOVE_ENTRY_ROW,
    handler: async (state, { payload: { envParentId, entryKey } }, context) => {
        const environments = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[envParentId] || [], auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await Promise.all(environments.map((environment) => {
            const permissions = (0, graph_1.getEnvironmentPermissions)(state.graph, environment.id, auth.userId);
            if (!permissions.has("write")) {
                throw new Error("User must have write permissions for all environments to remove an entry");
            }
            return (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.REMOVE_ENTRY,
                payload: {
                    envParentId,
                    entryKey,
                    environmentId: environment.id,
                },
            }, context);
        }));
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_ENVS,
    stateProducer: (draft, { payload }) => {
        let pendingIds;
        if (payload.pendingEnvironmentIds) {
            pendingIds = new Set(R.intersection(payload.pendingEnvironmentIds, (0, client_1.getPendingEnvironmentIds)(draft)));
        }
        else {
            pendingIds = new Set((0, client_1.getPendingEnvironmentIds)(draft));
        }
        const filterImportDiffs = ({ path }) => {
            return !R.any((entryKey) => Boolean(path.match(new RegExp(`\/${entryKey}(\/|$)`))), payload.entryKeys);
        };
        draft.pendingEnvUpdates = draft.pendingEnvUpdates
            .map((action) => payload.entryKeys && action.type == types_1.Client.ActionType.IMPORT_ENVIRONMENT
            ? Object.assign(Object.assign({}, action), { payload: Object.assign(Object.assign({}, action.payload), { diffs: action.payload.diffs.filter(filterImportDiffs) }), meta: Object.assign(Object.assign({}, action.meta), { entryKeys: R.difference(action.meta.entryKeys, payload.entryKeys) }) }) : action)
            .filter((action) => {
            const { meta } = action;
            if (action.payload.diffs.length == 0 || meta.entryKeys.length == 0) {
                return false;
            }
            if (!pendingIds.has(meta.environmentId)) {
                return true;
            }
            if (payload.entryKeys) {
                if (R.intersection(payload.entryKeys, meta.entryKeys).length == 0) {
                    return true;
                }
            }
            return false;
        });
        // this is slow with many pending actions -- removing for now
        // clearVoidedPendingEnvUpdatesProducer(draft);
        // recalculate reverse diffs
        (0, envs_1.recalcReverseDiffsProducer)(draft);
        draft.pendingEnvsUpdatedAt = Date.now();
    },
});
// clientAction<
//   Client.AsyncClientActionParams<Client.Action.ClientActions["RevertToVersion"]>
// >({
//   type: "asyncClientAction",
//   actionType: Client.ActionType.REVERT_TO_VERSION,
//   handler: async (
//     state,
//     { payload },
//     { dispatchSuccess, dispatchFailure }
//   ) => {}
// });
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.COMMIT_ENVS,
    serialAction: true,
    stateProducer: (draft, { payload }) => {
        let pendingIds;
        if (payload.pendingEnvironmentIds) {
            pendingIds =
                payload.initEnvs || payload.upgradeCrypto
                    ? payload.pendingEnvironmentIds
                    : R.intersection(payload.pendingEnvironmentIds, (0, client_1.getPendingEnvironmentIds)(draft));
        }
        else {
            pendingIds = (0, client_1.getPendingEnvironmentIds)(draft);
        }
        for (let environmentId of pendingIds) {
            draft.isUpdatingEnvs[environmentId] = true;
            delete draft.updateEnvsErrors[environmentId];
        }
    },
    successStateProducer: (draft, { meta: { dispatchContext } }) => {
        draft.pendingEnvUpdates = R.without(dispatchContext.pendingEnvUpdates, draft.pendingEnvUpdates);
        for (let environmentId of dispatchContext.pendingEnvironmentIds) {
            let envParentId;
            const environment = draft.graph[environmentId];
            if (environment) {
                envParentId = environment.envParentId;
            }
            else {
                [envParentId] = environmentId.split("|");
            }
            const envParent = draft.graph[envParentId];
            if (!envParent) {
                continue;
            }
            draft.envsFetchedAt[envParentId] = envParent.envsOrLocalsUpdatedAt;
        }
        draft.envs = Object.assign(Object.assign({}, draft.envs), dispatchContext.envs);
        draft.changesets = Object.assign(Object.assign({}, draft.changesets), dispatchContext.changesets);
        draft.pendingEnvsUpdatedAt = Date.now();
    },
    failureStateProducer: (draft, { meta: { dispatchContext }, payload }) => {
        for (let environmentId of dispatchContext.pendingEnvironmentIds) {
            draft.updateEnvsErrors[environmentId] = payload;
        }
    },
    endStateProducer: (draft, { meta: { dispatchContext } }) => {
        for (let environmentId of dispatchContext.pendingEnvironmentIds) {
            delete draft.isUpdatingEnvs[environmentId];
        }
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b;
        const { payload } = action;
        let state = initialState;
        const currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!currentAuth || !currentAuth.privkey) {
            throw new Error("Authentication and decrypted privkey required");
        }
        const privkey = currentAuth.privkey;
        const message = payload.message;
        let pendingEnvironmentIds;
        if (payload.pendingEnvironmentIds) {
            pendingEnvironmentIds =
                payload.initEnvs || payload.upgradeCrypto
                    ? payload.pendingEnvironmentIds
                    : R.intersection(payload.pendingEnvironmentIds, (0, client_1.getPendingEnvironmentIds)(state));
        }
        else {
            pendingEnvironmentIds = (0, client_1.getPendingEnvironmentIds)(state);
        }
        const pendingEnvironmentIdsSet = new Set(pendingEnvironmentIds);
        const pendingEnvUpdates = payload.initEnvs || payload.upgradeCrypto
            ? []
            : R.clone(state.pendingEnvUpdates).filter(({ meta }) => pendingEnvironmentIdsSet.has(meta.environmentId));
        const needsFetchEnvParentIds = new Set();
        for (let pendingEnvironmentId of pendingEnvironmentIds) {
            let envParentId;
            const pendingEnvironment = state.graph[pendingEnvironmentId];
            if (pendingEnvironment) {
                envParentId = pendingEnvironment.envParentId;
            }
            else {
                envParentId = pendingEnvironmentId.split("|")[0];
            }
            if ((0, client_1.envsNeedFetch)(state, envParentId)) {
                needsFetchEnvParentIds.add(envParentId);
            }
        }
        const fetchRes = await (0, envs_1.fetchRequiredEnvs)(state, needsFetchEnvParentIds, new Set(), context);
        if (fetchRes) {
            if (!fetchRes.success) {
                return dispatchFailure(fetchRes.resultAction
                    .payload, Object.assign(Object.assign({}, context), { dispatchContext: {
                        pendingEnvironmentIds,
                        pendingEnvUpdates,
                        envs: {},
                        changesets: {},
                    } }));
            }
            state = fetchRes.state;
        }
        const { keys, blobs, environmentKeysByComposite, changesetKeysByEnvironmentId, } = await (0, envs_1.envParamsForEnvironments)({
            state,
            environmentIds: pendingEnvironmentIds,
            context,
            pending: payload.initEnvs || payload.upgradeCrypto ? undefined : true,
            initEnvs: payload.initEnvs,
            message,
        });
        let encryptedByTrustChain;
        const hasKeyables = Object.keys((_a = keys.keyableParents) !== null && _a !== void 0 ? _a : {}).length +
            Object.keys((_b = keys.blockKeyableParents) !== null && _b !== void 0 ? _b : {}).length >
            0;
        if (hasKeyables) {
            const trustChain = (0, client_1.getTrustChain)(state, currentAuth.type == "clientUserAuth"
                ? currentAuth.deviceId
                : currentAuth.userId);
            encryptedByTrustChain = await (0, proxy_1.signJson)({
                data: trustChain,
                privkey,
            });
        }
        const apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.UPDATE_ENVS,
            payload: {
                keys,
                blobs,
                encryptedByTrustChain: encryptedByTrustChain
                    ? { data: encryptedByTrustChain }
                    : undefined,
                upgradeCrypto: payload.upgradeCrypto,
            },
        }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        const dispatchContext = {
            pendingEnvUpdates,
            pendingEnvironmentIds,
            envs: pendingEnvironmentIds.reduce((agg, environmentId) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const environment = state.graph[environmentId], envParentId = environment
                    ? environment.envParentId
                    : environmentId.split("|")[0];
                const envComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId,
                });
                const metaComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId,
                    envPart: "meta",
                });
                const inheritsComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId,
                    envPart: "inherits",
                });
                const res = Object.assign(Object.assign({}, agg), { [envComposite]: {
                        env: (0, client_1.getPendingKeyableEnv)(state, {
                            envParentId,
                            environmentId,
                        }),
                        key: environmentKeysByComposite[envComposite],
                    }, [metaComposite]: {
                        env: (0, client_1.getPendingEnvMeta)(state, {
                            envParentId,
                            environmentId,
                        }),
                        key: environmentKeysByComposite[metaComposite],
                    }, [inheritsComposite]: {
                        env: (0, client_1.getPendingInherits)(state, {
                            envParentId,
                            environmentId,
                        }),
                        key: environmentKeysByComposite[inheritsComposite],
                    } });
                if (environment && !environment.isSub) {
                    let inheritingEnvironmentIds = new Set(((_a = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[environment.envParentId]) !== null && _a !== void 0 ? _a : [])
                        .filter((sibling) => sibling.id != environment.id &&
                        !(sibling.isSub &&
                            sibling.parentEnvironmentId == environment.id))
                        .map(R.prop("id")));
                    for (let inheritingEnvironmentId of inheritingEnvironmentIds) {
                        const inheritingEnvironment = state.graph[inheritingEnvironmentId];
                        const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                            environmentId: inheritingEnvironmentId,
                            inheritsEnvironmentId: environment.id,
                        });
                        let overrides = (_b = (0, client_1.getInheritanceOverrides)(state, {
                            envParentId: environment.envParentId,
                            environmentId: inheritingEnvironmentId,
                            forInheritsEnvironmentId: environmentId,
                        }, true)[environmentId]) !== null && _b !== void 0 ? _b : {};
                        if (inheritingEnvironment.isSub) {
                            const parentOverrides = (_c = (0, client_1.getInheritanceOverrides)(state, {
                                envParentId: environment.envParentId,
                                environmentId: inheritingEnvironment.parentEnvironmentId,
                                forInheritsEnvironmentId: environmentId,
                            }, true)[environmentId]) !== null && _c !== void 0 ? _c : {};
                            overrides = Object.assign(Object.assign({}, parentOverrides), overrides);
                        }
                        let key = environmentKeysByComposite[composite];
                        res[composite] = { env: overrides, key };
                    }
                }
                if (environment) {
                    const siblingBaseEnvironmentIds = ((_d = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[environment.envParentId]) !== null && _d !== void 0 ? _d : [])
                        .filter((sibling) => !sibling.isSub &&
                        sibling.id != environment.id &&
                        !(environment.isSub &&
                            environment.parentEnvironmentId == sibling.id))
                        .map(R.prop("id"));
                    for (let siblingBaseEnvironmentId of siblingBaseEnvironmentIds) {
                        const siblingEnvironment = state.graph[siblingBaseEnvironmentId];
                        const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                            environmentId: environment.id,
                            inheritsEnvironmentId: siblingBaseEnvironmentId,
                        });
                        let overrides = (_e = (0, client_1.getInheritanceOverrides)(state, {
                            envParentId: environment.envParentId,
                            environmentId: environmentId,
                            forInheritsEnvironmentId: siblingBaseEnvironmentId,
                        }, true)[environmentId]) !== null && _e !== void 0 ? _e : {};
                        if (siblingEnvironment.isSub) {
                            const parentOverrides = (_f = (0, client_1.getInheritanceOverrides)(state, {
                                envParentId: environment.envParentId,
                                environmentId: siblingEnvironment.parentEnvironmentId,
                                forInheritsEnvironmentId: environmentId,
                            }, true)[environmentId]) !== null && _f !== void 0 ? _f : {};
                            overrides = Object.assign(Object.assign({}, parentOverrides), overrides);
                        }
                        let key = (_g = environmentKeysByComposite[composite]) !== null && _g !== void 0 ? _g : (_h = state.envs[composite]) === null || _h === void 0 ? void 0 : _h.key;
                        res[composite] = { env: overrides, key };
                    }
                }
                return res;
            }, {}),
            changesets: payload.upgradeCrypto
                ? {}
                : pendingEnvironmentIds.reduce((agg, environmentId) => {
                    var _a, _b;
                    return (Object.assign(Object.assign({}, agg), { [environmentId]: {
                            key: changesetKeysByEnvironmentId[environmentId],
                            changesets: (_b = (_a = state.changesets[environmentId]) === null || _a === void 0 ? void 0 : _a.changesets) !== null && _b !== void 0 ? _b : [],
                        } }));
                }, {}),
        };
        if (apiRes.success) {
            return dispatchSuccess(null, Object.assign(Object.assign({}, context), { dispatchContext }));
        }
        else {
            return dispatchFailure(apiRes.resultAction
                .payload, Object.assign(Object.assign({}, context), { dispatchContext }));
        }
    },
    successHandler: async (state, action, payload, context) => {
        const pendingIds = (0, client_1.getPendingEnvironmentIds)(state);
        // if there are newly pending environments that should be auto-committed, dispatch another COMMIT_ENVS action
        const autoCommitPendingIds = pendingIds.filter((environmentId) => (0, graph_1.getEnvironmentOrLocalsAutoCommitEnabled)(state.graph, environmentId));
        if (autoCommitPendingIds.length > 0) {
            await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.COMMIT_ENVS,
                payload: {
                    pendingEnvironmentIds: autoCommitPendingIds,
                    autoCommit: true,
                },
            }, context);
        }
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.UPDATE_ENVS,
    loggableType: "orgAction",
    loggableType2: "updateEnvsAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.FETCH_ENVS,
    stateProducer: (draft, { payload }) => {
        for (let envParentId in payload.byEnvParentId) {
            const { envs, changesets } = payload.byEnvParentId[envParentId];
            if (envs) {
                draft.isFetchingEnvs[envParentId] = true;
                delete draft.fetchEnvsErrors[envParentId];
            }
            if (changesets) {
                draft.isFetchingChangesets[envParentId] = true;
                delete draft.fetchChangesetsErrors[envParentId];
            }
        }
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        for (let envParentId in rootAction.payload.byEnvParentId) {
            const { envs, changesets } = rootAction.payload.byEnvParentId[envParentId];
            if (envs) {
                draft.fetchEnvsErrors[envParentId] = payload;
            }
            if (changesets) {
                draft.fetchChangesetsErrors[envParentId] = payload;
            }
        }
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        for (let envParentId in rootAction.payload.byEnvParentId) {
            const { envs, changesets } = rootAction.payload.byEnvParentId[envParentId];
            if (envs) {
                delete draft.isFetchingEnvs[envParentId];
            }
            if (changesets) {
                delete draft.isFetchingChangesets[envParentId];
            }
        }
    },
    successStateProducer: (draft, action) => {
        var _a, _b, _c;
        const start = Date.now();
        const { payload: { timestamp }, meta: { rootAction: { payload: { byEnvParentId }, }, }, } = action;
        const toClearEnvs = new Set(), toClearChangesets = new Set();
        for (let envParentId in byEnvParentId) {
            const { envs, changesets } = byEnvParentId[envParentId];
            const environments = (_a = (0, graph_1.getEnvironmentsByEnvParentId)(draft.graph)[envParentId]) !== null && _a !== void 0 ? _a : [], environmentIds = new Set(environments.map(R.prop("id")));
            if (envs && timestamp > ((_b = draft.envsFetchedAt[envParentId]) !== null && _b !== void 0 ? _b : 0)) {
                for (let composite in draft.envs) {
                    const { environmentId } = (0, blob_1.parseUserEncryptedKeyOrBlobComposite)(composite);
                    if (environmentIds.has(environmentId) ||
                        environmentId.startsWith(envParentId)) {
                        toClearEnvs.add(composite);
                    }
                }
            }
            if (changesets &&
                timestamp > ((_c = draft.changesetsFetchedAt[envParentId]) !== null && _c !== void 0 ? _c : 0)) {
                for (let environmentId in draft.changesets) {
                    if (environmentIds.has(environmentId) ||
                        environmentId.startsWith(envParentId)) {
                        toClearChangesets.add(environmentId);
                    }
                }
            }
        }
        for (let composite of toClearEnvs) {
            delete draft.envs[composite];
        }
        for (let environmentId of toClearChangesets) {
            delete draft.changesets[environmentId];
        }
        (0, envs_1.decryptedEnvsStateProducer)(draft, action, action.meta.rootAction);
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let state = initialState;
        const { payload } = action;
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || !auth.privkey) {
            throw new Error("Authentication and decrypted privkey required to decrypt envs");
        }
        (0, status_2.updateLocalSocketEnvActionStatusIfNeeded)(state, context);
        /*
         * if we're currently re-encrypting an environment belonging
         * to an env parent that we're about to fetch, then wait for
         * the re-encryption to finish before proceeding
         */
        if (!payload.skipWaitForReencryption) {
            await (0, index_1.waitForStateCondition)((_a = context.store) !== null && _a !== void 0 ? _a : (0, redux_store_1.getDefaultStore)(), context, (state) => {
                const reencryptingEnvironmentIds = Object.keys(state.isReencryptingEnvs);
                if (reencryptingEnvironmentIds.length == 0) {
                    return true;
                }
                const reencryptingEnvParentIds = new Set();
                for (let environmentId of reencryptingEnvironmentIds) {
                    let envParentId;
                    const environment = state.graph[environmentId];
                    if (environment) {
                        envParentId = environment.envParentId;
                    }
                    else {
                        envParentId = environmentId.split("|")[0];
                    }
                    reencryptingEnvParentIds.add(envParentId);
                }
                const fetchEnvParentIds = Object.keys(payload.byEnvParentId);
                return !fetchEnvParentIds.find((envParentId) => reencryptingEnvParentIds.has(envParentId));
            });
        }
        /*
         if we are just fetching envs (not changesets) and this is a refresh (not initial fetch),
         then include recent changesets alongside envs so we can notify the user
         about updates.
         to determine how many changesets to fetch, start from whichever is earliest:
         - envsFetchedAt for the included envParentIds
         - earliest pending action if there are any
        */
        let fetchParams = (0, immer_1.default)(payload, (draft) => {
            for (let envParentId in payload.byEnvParentId) {
                const { envs, changesets } = payload.byEnvParentId[envParentId];
                let createdAfter = state.graphUpdatedAt;
                if (envs && !changesets) {
                    const envsFetchedAt = state.envsFetchedAt[envParentId];
                    if (envsFetchedAt &&
                        (!createdAfter || envsFetchedAt < createdAfter)) {
                        createdAfter = envsFetchedAt;
                    }
                    const earliestPendingAt = (0, client_1.getEarliestEnvUpdatePendingAt)(state, envParentId);
                    if (earliestPendingAt &&
                        (!createdAfter || earliestPendingAt < createdAfter)) {
                        createdAfter = earliestPendingAt;
                    }
                    if (typeof createdAfter == "number") {
                        draft.byEnvParentId[envParentId].changesets = true;
                        draft.byEnvParentId[envParentId].changesetOptions = {
                            createdAfter,
                        };
                    }
                }
            }
        });
        // const start = Date.now();
        // log("Fetching envs");
        const apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.FETCH_ENVS,
            payload: R.omit(["skipWaitForReencryption"], fetchParams),
        }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        if (!apiRes.success) {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        const apiPayload = apiRes.resultAction.payload;
        state = apiRes.state;
        // log("FETCH_ENVS - get result, starting decryption");
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
            payload: {
                processed: 0,
                total: Object.keys((_b = apiPayload.envs[payload.keysOnly ? "keys" : "blobs"]) !== null && _b !== void 0 ? _b : {}).length +
                    Object.keys((_c = apiPayload.changesets[payload.keysOnly ? "keys" : "blobs"]) !== null && _c !== void 0 ? _c : {}).length,
                op: "decrypt",
                dataType: payload.keysOnly ? "keys" : "keys_and_blobs",
            },
        }, context);
        // log("FETCH_ENVS - set crypto status");
        const [decryptedEnvs, decryptedChangesets] = await Promise.all([
            (0, envs_1.decryptEnvs)(state, (_d = apiPayload.envs.keys) !== null && _d !== void 0 ? _d : {}, (_e = apiPayload.envs.blobs) !== null && _e !== void 0 ? _e : {}, auth.privkey, context, payload.keysOnly),
            (0, envs_1.decryptChangesets)(state, (_f = apiPayload.changesets.keys) !== null && _f !== void 0 ? _f : {}, (_g = apiPayload.changesets.blobs) !== null && _g !== void 0 ? _g : {}, auth.privkey, context, payload.keysOnly),
        ]);
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
            payload: undefined,
        }, context);
        // log("FETCH_ENVS - cleared crypto status");
        // log("FETCH_ENVS - decrypted");
        // log("FETCH_ENVS decrypted " + (Date.now() - start).toString());
        // if any changesets were created by deleted user devices / cli keys
        // fetch the deleted graph for the appropriate time period so we can reference
        // them in the versions list
        let earliestDeleted;
        let latestDeleted;
        for (let { changesets } of Object.values(decryptedChangesets)) {
            for (let { createdAt, createdById } of changesets) {
                if (!((_h = state.graph[createdById]) !== null && _h !== void 0 ? _h : state.deletedGraph[createdById])) {
                    if (!earliestDeleted || createdAt < earliestDeleted) {
                        earliestDeleted = createdAt;
                    }
                    if (!latestDeleted || createdAt > latestDeleted) {
                        latestDeleted = createdAt;
                    }
                }
            }
        }
        if (earliestDeleted && latestDeleted) {
            await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.FETCH_DELETED_GRAPH,
                payload: { startsAt: earliestDeleted, endsAt: latestDeleted },
            }, context);
        }
        // log("FETCH_ENVS - dispatching success");
        const res = dispatchSuccess({
            envs: decryptedEnvs,
            changesets: decryptedChangesets,
            timestamp: apiRes.resultAction
                .payload.timestamp,
        }, context);
        // log("FETCH_ENVS - dispatched success");
        return res;
    },
    successHandler: async (state, action, payload, context) => {
        (0, status_2.updateLocalSocketEnvActionStatusIfNeeded)(state, context);
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.FETCH_ENVS,
    loggableType: "fetchMetaAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_ENVIRONMENT,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    serialAction: true,
    stateProducer: (draft, { payload: { envParentId, environmentRoleId } }) => {
        const path = [envParentId, environmentRoleId];
        draft.isCreatingEnvironment = R.assocPath(path, true, draft.isCreatingEnvironment);
        draft.createEnvironmentErrors = (0, object_1.stripEmptyRecursive)(R.dissocPath(path, draft.createEnvironmentErrors));
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        const { envParentId, environmentRoleId } = rootAction.payload;
        draft.createEnvironmentErrors = R.assocPath([envParentId, environmentRoleId], payload, draft.createEnvironmentErrors);
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        const { envParentId, environmentRoleId } = rootAction.payload;
        draft.isCreatingEnvironment = (0, object_1.stripEmptyRecursive)(R.dissocPath([envParentId, environmentRoleId], draft.isCreatingEnvironment));
    },
    graphProposer: ({ payload }) => (graphDraft) => {
        const now = Date.now(), proposalId = [
            payload.envParentId,
            payload.environmentRoleId,
            payload.parentEnvironmentId,
            payload.subName,
        ]
            .filter(Boolean)
            .join("|");
        graphDraft[proposalId] = Object.assign(Object.assign({ type: "environment", id: proposalId }, payload), { createdAt: now, updatedAt: now });
    },
    encryptedKeysScopeFn: (graph, { payload }) => {
        const envParent = graph[payload.envParentId];
        const scopeEnvironments = envParent.type == "app"
            ? (0, graph_1.getConnectedBlockEnvironmentsForApp)(graph, envParent.id, undefined, undefined, payload.environmentRoleId)
            : [];
        return {
            userIds: "all",
            envParentIds: new Set(scopeEnvironments.map(R.prop("envParentId"))),
            keyableParentIds: "all",
        };
    },
    successHandler: async (state, action, res, context) => {
        const environment = R.last(R.sortBy(R.prop("createdAt"), (0, graph_1.graphTypes)(state.graph).environments));
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.COMMIT_ENVS,
            payload: {
                pendingEnvironmentIds: [environment.id],
                initEnvs: true,
            },
        }, context);
    },
});
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_ENVIRONMENT, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: ({ payload: { id } }) => (0, graph_1.getDeleteEnvironmentProducer)(id, Date.now()), encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const environment = graph[id];
        const envParent = graph[environment.envParentId];
        const scopeEnvironments = [
            environment,
            ...(envParent.type == "app"
                ? (0, graph_1.getConnectedBlockEnvironmentsForApp)(graph, envParent.id, undefined, environment.id)
                : []),
        ];
        return {
            userIds: "all",
            envParentIds: new Set(scopeEnvironments.map(R.prop("envParentId"))),
            keyableParentIds: "all",
        };
    } }));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.UPDATE_ENVIRONMENT_SETTINGS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.updateSettingsProducers));
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CLEAR_ORPHANED_BLOBS,
    successStateProducer: (draft, { payload }) => {
        // if graph has been updated in the meantime, do nothing
        // a new CLEAR_ORPHANED_BLOBS task will take over
        if (payload.graphUpdatedAt != draft.graphUpdatedAt) {
            return;
        }
        for (let path of payload.paths) {
            (0, lodash_unset_1.default)(draft, path);
        }
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        try {
            const paths = await async.clearOrphanedBlobPaths(state, auth.userId, auth.type == "clientUserAuth" ? auth.deviceId : "cli");
            return dispatchSuccess({ paths, graphUpdatedAt: state.graphUpdatedAt }, context);
        }
        catch (err) {
            return dispatchFailure(err, context);
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_MISSING_ENVS,
    stateProducer: (draft, { payload }) => {
        for (let composite in payload) {
            draft.envs[composite] = payload[composite];
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_CRYPTO_STATUS,
    stateProducer: (draft, { payload }) => {
        draft.cryptoStatus = payload;
    },
    handler: async (state, action, context) => {
        (0, status_2.updateLocalSocketEnvActionStatusIfNeeded)(state, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
    stateProducer: (draft, { payload }) => {
        if (draft.cryptoStatus) {
            draft.cryptoStatus.processed += payload;
        }
    },
    handler: async (state, action, context) => {
        (0, status_2.updateLocalSocketEnvActionStatusIfNeeded)(state, context);
    },
});
//# sourceMappingURL=envs.js.map