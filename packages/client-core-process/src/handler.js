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
exports.dispatchStore = exports.clientReducer = exports.dispatch = exports.getActionParams = exports.clientAction = void 0;
const utils_1 = require("@envkey/core/lib/crypto/utils");
const blob_1 = require("@envkey/core/lib/client/blob");
const graph_1 = require("@envkey/core/lib/graph");
const blob_2 = require("@envkey/core/lib/blob");
const uuid_1 = require("uuid");
const actions_1 = require("./lib/actions");
const types_1 = require("@envkey/core/types");
const R = __importStar(require("ramda"));
const immer_1 = __importDefault(require("immer"));
const redux_store_1 = require("./redux_store");
const pick_1 = require("@envkey/core/lib/utils/pick");
const rfc6902_1 = require("rfc6902");
const logger_1 = require("@envkey/core/lib/utils/logger");
const wait_1 = require("@envkey/core/lib/utils/wait");
const state_1 = require("./lib/state");
const trust_1 = require("./lib/trust");
const envs_1 = require("./lib/envs");
const client_1 = require("@envkey/core/lib/client");
const env_1 = require("@envkey/client-shared/src/env");
const util_1 = require("util");
const OUTDATED_GRAPH_REFRESH_MAX_JITTER_MS = 200;
const actions = {};
const clientAction = (params) => {
    if (actions[params.actionType]) {
        throw new Error("A client action with this type was already defined");
    }
    actions[params.actionType] = params;
}, getActionParams = (type) => {
    const params = actions[type];
    if (!params) {
        throw new TypeError(`Unexpected Client Action when fetching Action Params! This probably means a configuration error has occurred.`);
    }
    return params;
}, dispatch = async (action, context) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const store = (_a = context.store) !== null && _a !== void 0 ? _a : (0, redux_store_1.getDefaultStore)(), actionParams = actions[action.type], tempId = (0, uuid_1.v4)();
    let accountState = (0, state_1.getState)(store, context);
    if (env_1.env.ENVKEY_CORE_DISPATCH_DEBUG_ENABLED === "1") {
        (0, logger_1.log)(`debug:dispatch(${(0, util_1.inspect)(action, { depth: 2 })})`);
    }
    if (!actionParams) {
        (0, logger_1.log)("WARNING: no actionParams for action - did you forget to add a clientAction<>?", action);
    }
    if (actionParams &&
        "serialAction" in actionParams &&
        actionParams.serialAction &&
        !context.skipWaitForSerialAction &&
        accountState.isDispatchingSerialAction) {
        await (0, state_1.waitForStateCondition)(store, context, (state) => !state.isDispatchingSerialAction);
    }
    if (action.type == types_1.Client.ActionType.REFRESH_SESSION &&
        accountState.isRefreshingSession) {
        if (!accountState.refreshSessionQueued ||
            (((_b = action.payload) === null || _b === void 0 ? void 0 : _b.omitGraphUpdatedAt) &&
                !((_c = accountState.refreshSessionQueued.payload) === null || _c === void 0 ? void 0 : _c.omitGraphUpdatedAt))) {
            await (0, exports.dispatch)({
                type: types_1.Client.ActionType.QUEUE_REFRESH_SESSION,
                payload: action,
            }, context);
        }
        return {
            success: true,
            resultAction: action,
            state: (0, state_1.getState)(store, context),
        };
    }
    const handleSuccess = getHandleSuccess(actionParams, action, store, tempId), handleFailure = getHandleFailure(actionParams, action, store, tempId);
    if (actionParams.type == "clientAction") {
        const clientAction = action;
        (0, exports.dispatchStore)(clientAction, context, tempId, store);
        accountState = (0, state_1.getState)(store, context);
        if (actionParams.handler) {
            await actionParams.handler(accountState, clientAction, context);
        }
        return {
            success: true,
            resultAction: clientAction,
            state: (0, state_1.getState)(store, context),
        };
    }
    else if (actionParams.type == "asyncClientAction") {
        const clientAction = action;
        (0, exports.dispatchStore)(clientAction, context, tempId, store);
        accountState = (0, state_1.getState)(store, context);
        const dispatchSuccess = async (successPayload, handlerOpts) => {
            try {
                const handleSuccessRes = await handleSuccess(clientAction, successPayload, handlerOpts);
                return handleSuccessRes;
            }
            catch (error) {
                return handleFailure(clientAction, error, handlerOpts);
            }
        }, dispatchFailure = async (failurePayload, handlerOpts) => {
            return handleFailure(clientAction, failurePayload, handlerOpts);
        };
        if (actionParams.apiActionCreator) {
            if (actionParams.bulkApiDispatcher) {
                let error;
                let apiActions;
                let stateWithFetched;
                const now = Date.now();
                try {
                    const clientParams = action.payload;
                    apiActions = await Promise.all(clientParams.map((params) => actionParams.apiActionCreator(params, accountState, context))).then((a) => a.map(R.prop("action")));
                    const fullKeySet = apiActions
                        .map((apiAction) => {
                        var _a;
                        const apiActionParams = actions[apiAction.type];
                        if (!apiActionParams ||
                            !("graphProposer" in apiActionParams) ||
                            !apiActionParams.graphProposer) {
                            return { type: "keySet" };
                        }
                        return (0, envs_1.keySetForGraphProposal)(accountState.graph, now, (graphDraft) => {
                            if (!apiActionParams ||
                                !("graphProposer" in apiActionParams) ||
                                !apiActionParams.graphProposer) {
                                return;
                            }
                            apiActionParams.graphProposer(apiAction, accountState, context)(graphDraft);
                        }, (_a = apiActionParams.encryptedKeysScopeFn) === null || _a === void 0 ? void 0 : _a.call(apiActionParams, accountState.graph, apiAction));
                    })
                        .reduce(R.mergeDeepRight, { type: "keySet" }), { requiredEnvs, requiredChangesets } = (0, envs_1.requiredEnvsForKeySet)(accountState.graph, fullKeySet), fetchRes = await (0, envs_1.fetchRequiredEnvs)(accountState, requiredEnvs, requiredChangesets, context, undefined, true);
                    if (fetchRes) {
                        if (fetchRes.success) {
                            stateWithFetched = fetchRes.state;
                        }
                        else {
                            error = fetchRes.resultAction
                                .payload;
                        }
                    }
                    else {
                        stateWithFetched = accountState;
                    }
                }
                catch (err) {
                    error = err;
                }
                if (!error && apiActions && stateWithFetched) {
                    try {
                        let promises = [];
                        for (let apiAction of apiActions) {
                            const apiActionParams = actions[apiAction.type];
                            if (!apiActionParams ||
                                !("graphProposer" in apiActionParams) ||
                                !apiActionParams.graphProposer) {
                                promises.push(Promise.resolve(apiAction));
                                continue;
                            }
                            const graphProducer = apiActionParams.graphProposer(apiAction, stateWithFetched, context), toSet = (0, envs_1.keySetForGraphProposal)(stateWithFetched.graph, now, graphProducer, (_d = apiActionParams.encryptedKeysScopeFn) === null || _d === void 0 ? void 0 : _d.call(apiActionParams, accountState.graph, apiAction));
                            promises.push((0, envs_1.encryptedKeyParamsForKeySet)({
                                state: Object.assign(Object.assign({}, stateWithFetched), { graph: (0, immer_1.default)(stateWithFetched.graph, graphProducer) }),
                                context,
                                toSet,
                            }).then((envParams) => {
                                const res = Object.assign(Object.assign({}, apiAction), { payload: Object.assign(Object.assign({}, apiAction.payload), envParams) });
                                return res;
                            }));
                        }
                        const withEnvs = await Promise.all(promises);
                        const res = await (0, exports.dispatch)({
                            type: types_1.Api.ActionType.BULK_GRAPH_ACTION,
                            payload: withEnvs.map((apiAction) => (Object.assign(Object.assign({}, apiAction), { meta: {
                                    loggableType: "orgAction",
                                    graphUpdatedAt: stateWithFetched.graphUpdatedAt,
                                } }))),
                        }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
                        if (res.success && res.retriedWithUpdatedGraph) {
                            return res;
                        }
                        if (res.success) {
                            const successPayload = actionParams.apiSuccessPayloadCreator
                                ? await actionParams.apiSuccessPayloadCreator(res)
                                : (_e = res.resultAction) === null || _e === void 0 ? void 0 : _e.payload;
                            return dispatchSuccess(successPayload, context);
                        }
                        else {
                            return dispatchFailure((_f = res.resultAction) === null || _f === void 0 ? void 0 : _f.payload, context);
                        }
                    }
                    catch (err) {
                        error = err;
                    }
                }
                if (error) {
                    const failurePayload = error instanceof Error
                        ? {
                            type: "clientError",
                            error: { name: error.name, message: error.message },
                        }
                        : error;
                    return dispatchFailure(failurePayload, context);
                }
            }
            else {
                const { action: apiAction, dispatchContext } = await actionParams.apiActionCreator(action.payload, accountState, context), apiRes = await (0, exports.dispatch)(apiAction, Object.assign(Object.assign(Object.assign({}, context), (dispatchContext ? { dispatchContext } : {})), { rootClientAction: action }));
                if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
                    return apiRes;
                }
                if (apiRes.success) {
                    const successPayload = actionParams.apiSuccessPayloadCreator
                        ? await actionParams.apiSuccessPayloadCreator(apiRes, dispatchContext)
                        : apiRes.resultAction.payload;
                    return dispatchSuccess(successPayload, context);
                }
                else {
                    const failureAction = apiRes.resultAction;
                    return dispatchFailure(failureAction.payload, context);
                }
            }
        }
        else if (actionParams.handler) {
            const handlerRes = await actionParams.handler(accountState, clientAction, {
                context,
                dispatchSuccess,
                dispatchFailure,
            });
            return handlerRes;
        }
        else {
            return {
                success: true,
                resultAction: clientAction,
                state: (0, state_1.getState)(store, context),
            };
        }
    }
    else if (actionParams.type == "apiRequestAction") {
        if (actionParams.bulkDispatchOnly) {
            throw new Error("Cannot be dispatched directly, only as part of BULK_GRAPH_ACTION");
        }
        if (!context) {
            throw new Error("clientContext required for apiRequestAction");
        }
        accountState = (0, state_1.getState)(store, context);
        let apiAuthParams = context.auth, accountIdOrCliKey = context.accountIdOrCliKey, accountAuth = (0, client_1.getAuth)(accountState, accountIdOrCliKey);
        const hostUrl = (_g = context.hostUrl) !== null && _g !== void 0 ? _g : accountAuth === null || accountAuth === void 0 ? void 0 : accountAuth.hostUrl;
        if (actionParams.authenticated && !apiAuthParams) {
            if (!accountAuth) {
                (0, logger_1.log)("CORE PROC HANDLER  - Action requires authentication err.", {
                    actionParams,
                    apiAuthParams,
                });
                throw new Error("Action requires authentication.");
            }
            apiAuthParams = (0, client_1.getApiAuthParams)(accountAuth);
        }
        const meta = Object.assign(Object.assign({}, (0, pick_1.pick)(["loggableType", "loggableType2", "loggableType3", "loggableType4"], actionParams)), { auth: apiAuthParams, client: context.client, graphUpdatedAt: actionParams.graphAction
                ? accountState.graphUpdatedAt
                : undefined });
        let payload = action.payload, requestAction = Object.assign(Object.assign({}, action), { payload,
            meta });
        (0, exports.dispatchStore)(requestAction, context, tempId, store);
        accountState = (0, state_1.getState)(store, context);
        requestAction.meta.graphUpdatedAt = accountState.graphUpdatedAt;
        let error;
        const now = Date.now();
        if (actionParams.graphProposer) {
            const graphProducer = actionParams.graphProposer(action, accountState, context), proposedGraph = (0, immer_1.default)(accountState.graph, graphProducer), toSet = (0, envs_1.keySetForGraphProposal)(accountState.graph, now, graphProducer, (_h = actionParams.encryptedKeysScopeFn) === null || _h === void 0 ? void 0 : _h.call(actionParams, accountState.graph, action));
            let stateWithFetched;
            const { requiredEnvs, requiredChangesets } = (0, envs_1.requiredEnvsForKeySet)(accountState.graph, toSet), fetchRes = await (0, envs_1.fetchRequiredEnvs)(accountState, requiredEnvs, requiredChangesets, context, undefined, true);
            if (fetchRes) {
                if (fetchRes.success) {
                    stateWithFetched = fetchRes.state;
                }
                else {
                    error = fetchRes.resultAction
                        .payload;
                }
            }
            else {
                stateWithFetched = accountState;
            }
            if (stateWithFetched && !error) {
                const envParams = await (0, envs_1.encryptedKeyParamsForKeySet)({
                    state: Object.assign(Object.assign({}, stateWithFetched), { graph: proposedGraph }),
                    context,
                    toSet,
                });
                payload = Object.assign(Object.assign({}, payload), envParams);
            }
        }
        requestAction = Object.assign(Object.assign({}, requestAction), { payload });
        if (!error) {
            let res;
            const sanitizedRequestAction = R.evolve({
                meta: R.omit(["clientContext", "dispatchContext", "hostUrl"]),
            }, requestAction);
            try {
                res = await (0, actions_1.postApiAction)(sanitizedRequestAction, hostUrl, context.ipTestOverride);
                const handleSuccessRes = await handleSuccess(requestAction, res, context);
                return handleSuccessRes;
            }
            catch (err) {
                error = err;
            }
        }
        if (error) {
            const nodeFetchErr = error;
            const graphOutdated = ((_j = nodeFetchErr.error) === null || _j === void 0 ? void 0 : _j.message) == "client graph outdated";
            if (((_k = nodeFetchErr.error) === null || _k === void 0 ? void 0 : _k.code) == 400 && graphOutdated) {
                const delay = Math.random() * OUTDATED_GRAPH_REFRESH_MAX_JITTER_MS;
                await (0, wait_1.wait)(delay);
                let refreshAction;
                if (actionParams.refreshActionCreator) {
                    refreshAction = actionParams.refreshActionCreator((_l = context.rootClientAction) !== null && _l !== void 0 ? _l : requestAction);
                }
                else if (accountAuth && accountAuth.type == "clientUserAuth") {
                    refreshAction = {
                        type: types_1.Client.ActionType.GET_SESSION,
                        payload: {
                            skipWaitForReencryption: action.type == types_1.Api.ActionType.REENCRYPT_ENVS || undefined,
                        },
                    };
                }
                else if (accountAuth && accountAuth.type == "clientCliAuth") {
                    refreshAction = {
                        type: types_1.Client.ActionType.AUTHENTICATE_CLI_KEY,
                        payload: { cliKey: context.accountIdOrCliKey },
                    };
                }
                if (!refreshAction) {
                    return handleFailure(requestAction, error, context);
                }
                const refreshRes = await (0, exports.dispatch)(refreshAction, context);
                if (!refreshRes.success) {
                    return handleFailure(requestAction, refreshRes.resultAction.payload, context);
                }
                if (action.type == types_1.Api.ActionType.UPDATE_ENVS ||
                    action.type == types_1.Api.ActionType.REENCRYPT_ENVS) {
                    const blobs = action.payload.blobs;
                    const envParentIds = (0, blob_2.getBlobParamsEnvParentIds)(blobs), environmentAndLocalIds = (0, blob_2.getBlobParamsEnvironmentAndLocalIds)(blobs);
                    try {
                        await (0, envs_1.fetchRequiredEnvs)(refreshRes.state, envParentIds, new Set(), context, action.type == types_1.Api.ActionType.REENCRYPT_ENVS || undefined);
                        // If there are conflicts after fetching outdated envs,
                        // the user must confirm before submitting env update.
                        // So for now just pass through outdated error.
                        if ((0, client_1.hasPendingConflicts)((0, state_1.getState)(store, context), undefined, Array.from(environmentAndLocalIds))) {
                            return handleFailure(requestAction, error, context);
                        }
                    }
                    catch (err) {
                        return handleFailure(requestAction, err, context);
                    }
                }
                let promise;
                if (context.rootClientAction) {
                    promise = (0, exports.dispatch)(context.rootClientAction, Object.assign(Object.assign({}, context), { skipWaitForSerialAction: true }));
                }
                else {
                    promise = (0, exports.dispatch)(action, Object.assign(Object.assign({}, context), { skipWaitForSerialAction: true }));
                }
                return promise.then((res) => (Object.assign(Object.assign({}, res), { retriedWithUpdatedGraph: true })));
            }
            return handleFailure(requestAction, error, context);
        }
    }
    (0, logger_1.log)("ActionParams type not handled", { actionParams, action });
    throw new Error("ActionParams type not handled");
}, clientReducer = () => {
    const reducers = R.flatten(Object.values(actions)
        .map((params) => {
        const reducers = [];
        for (let k of [
            "stateProducer",
            "successStateProducer",
            "failureStateProducer",
            "endStateProducer",
        ]) {
            if (params[k]) {
                const stateProducer = params[k];
                reducers.push((procState = types_1.Client.defaultProcState, action) => {
                    const isStartAction = action.type === params.actionType;
                    const isSuccessAction = action.type == params.actionType + "_SUCCESS";
                    const isFailureAction = action.type == params.actionType + "_FAILURE";
                    if ((k == "stateProducer" && isStartAction) ||
                        (k == "successStateProducer" && isSuccessAction) ||
                        (k == "failureStateProducer" && isFailureAction) ||
                        (k == "endStateProducer" &&
                            (isSuccessAction || isFailureAction))) {
                        const clientState = (0, state_1.getState)(procState, action.meta);
                        const updated = (0, immer_1.default)(clientState, (draft) => stateProducer(draft, action)), accountId = action.meta.accountIdOrCliKey;
                        const res = Object.assign(Object.assign(Object.assign({}, procState), (0, pick_1.pick)(types_1.Client.CLIENT_PROC_STATE_KEYS, updated)), { clientStates: Object.assign(Object.assign({}, procState.clientStates), { [action.meta.clientId]: (0, pick_1.pick)(types_1.Client.CLIENT_STATE_KEYS, updated) }), accountStates: accountId
                                ? Object.assign(Object.assign({}, procState.accountStates), { [accountId]: (0, pick_1.pick)(types_1.Client.ACCOUNT_STATE_KEYS, updated) }) : procState.accountStates });
                        return res;
                    }
                    return procState;
                });
            }
        }
        if ("procStateProducer" in params) {
            reducers.push((procState = types_1.Client.defaultProcState, action) => {
                if (action.type === params.actionType) {
                    return (0, immer_1.default)(procState, (draft) => params.procStateProducer(draft, action));
                }
                else {
                    return procState;
                }
            });
        }
        if (params.type == "apiRequestAction" && params.graphAction) {
            reducers.push((procState = types_1.Client.defaultProcState, action) => {
                var _a;
                if (action.type == params.actionType + "_SUCCESS" &&
                    action.meta.accountIdOrCliKey) {
                    const accountIdOrCliKey = action.meta.accountIdOrCliKey;
                    const payload = action
                        .payload, accountState = (0, state_1.getState)(procState, action.meta);
                    let updatedAccountState;
                    let graphUpdated = false;
                    if ("graph" in payload) {
                        graphUpdated = true;
                        updatedAccountState = Object.assign(Object.assign({}, accountState), { graph: payload.graph, graphUpdatedAt: payload.graphUpdatedAt });
                    }
                    else if ("diffs" in payload) {
                        graphUpdated = true;
                        const graphWithDiffs = (0, immer_1.default)(accountState.graph, (graphDraft) => {
                            (0, rfc6902_1.applyPatch)(graphDraft, payload.diffs);
                        });
                        updatedAccountState = Object.assign(Object.assign({}, accountState), { graph: graphWithDiffs, graphUpdatedAt: payload.graphUpdatedAt });
                    }
                    if (graphUpdated && updatedAccountState) {
                        const auth = (_a = procState.orgUserAccounts[accountIdOrCliKey]) !== null && _a !== void 0 ? _a : procState.cliKeyAccounts[(0, utils_1.sha256)(accountIdOrCliKey)];
                        if (auth) {
                            const { userId: currentUserId } = auth;
                            // clear out updates for any environments that no longer exist or that user is no longer permitted to write to
                            updatedAccountState = (0, immer_1.default)(updatedAccountState, (draft) => (0, blob_1.clearOrphanedEnvUpdatesProducer)(draft, currentUserId));
                        }
                    }
                    const res = updatedAccountState && accountIdOrCliKey
                        ? Object.assign(Object.assign({}, procState), { accountStates: Object.assign(Object.assign({}, procState.accountStates), { [accountIdOrCliKey]: updatedAccountState }) }) : procState;
                    return res;
                }
                return procState;
            });
        }
        if (params.type == "apiRequestAction") {
            reducers.push((procState = types_1.Client.defaultProcState, action) => {
                var _a, _b, _c;
                // store throttling error so we can notify user
                if (((_a = action.meta) === null || _a === void 0 ? void 0 : _a.clientId) &&
                    procState.clientStates[action.meta.clientId] &&
                    action.type == params.actionType + "_FAILURE") {
                    const resAction = action;
                    if ([413, 429].includes(resAction.payload.error.code)) {
                        return Object.assign(Object.assign({}, procState), { clientStates: Object.assign(Object.assign({}, procState.clientStates), { [action.meta.clientId]: Object.assign(Object.assign({}, procState.clientStates[action.meta.clientId]), { throttleError: resAction.payload }) }) });
                    }
                }
                // handle expired tokens
                if (R.path(["meta", "rootAction", "meta", "auth", "type"], action) == "tokenAuthParams" &&
                    action.type == params.actionType + "_FAILURE") {
                    const resAction = action;
                    const payload = resAction.payload;
                    if (typeof payload.error == "object" &&
                        "code" in payload.error &&
                        payload.error.code == 401) {
                        const accountId = action.meta.accountIdOrCliKey;
                        (0, logger_1.log)("reducer -- expired token", {
                            "action.type": action.type,
                            accountId,
                        });
                        return Object.assign(Object.assign({}, procState), { accountStates: Object.assign(Object.assign({}, procState.accountStates), { [accountId]: Object.assign(Object.assign({}, ((_b = procState.accountStates[accountId]) !== null && _b !== void 0 ? _b : {})), R.omit([
                                    "pendingEnvUpdates",
                                    "pendingEnvsUpdatedAt",
                                    "pendingInvites",
                                ], types_1.Client.defaultAccountState)) }), orgUserAccounts: Object.assign(Object.assign({}, procState.orgUserAccounts), { [accountId]: R.omit(["token"], (_c = procState.orgUserAccounts[accountId]) !== null && _c !== void 0 ? _c : {}) }) });
                    }
                }
                return procState;
            });
            // track all server requests for status updates
            reducers.push((procState = types_1.Client.defaultProcState, action) => {
                var _a;
                if (((_a = action.meta) === null || _a === void 0 ? void 0 : _a.clientId) &&
                    procState.clientStates[action.meta.clientId]) {
                    return Object.assign(Object.assign({}, procState), { clientStates: Object.assign(Object.assign({}, procState.clientStates), { [action.meta.clientId]: Object.assign(Object.assign({}, procState.clientStates[action.meta.clientId]), { isProcessingApi: action.type.endsWith("_SUCCESS") ||
                                    action.type.endsWith("_FAILURE")
                                    ? undefined
                                    : true }) }) });
                }
                return procState;
            });
        }
        if ("serialAction" in params && params.serialAction) {
            reducers.push((procState = types_1.Client.defaultProcState, action) => {
                const isStartAction = action.type === params.actionType;
                const isSuccessAction = action.type == params.actionType + "_SUCCESS";
                const isFailureAction = action.type == params.actionType + "_FAILURE";
                if (isStartAction || isSuccessAction || isFailureAction) {
                    const clientState = (0, state_1.getState)(procState, action.meta);
                    const updated = (0, immer_1.default)(clientState, (draft) => {
                        if (isStartAction) {
                            draft.isDispatchingSerialAction = true;
                        }
                        else if (isSuccessAction || isFailureAction) {
                            delete draft.isDispatchingSerialAction;
                        }
                    }), accountId = action.meta.accountIdOrCliKey;
                    const res = Object.assign(Object.assign({}, procState), { accountStates: accountId
                            ? Object.assign(Object.assign({}, procState.accountStates), { [accountId]: (0, pick_1.pick)(types_1.Client.ACCOUNT_STATE_KEYS, updated) }) : procState.accountStates });
                    return res;
                }
                return procState;
            });
        }
        reducers.push((procState = types_1.Client.defaultProcState, action) => {
            if (action.meta &&
                action.meta.accountIdOrCliKey &&
                action.meta.clientId &&
                action.meta.clientId != "core" &&
                procState.accountStates[action.meta.accountIdOrCliKey]) {
                return Object.assign(Object.assign({}, procState), { accountStates: Object.assign(Object.assign({}, procState.accountStates), { [action.meta.accountIdOrCliKey]: Object.assign(Object.assign({}, procState.accountStates[action.meta.accountIdOrCliKey]), { accountLastActiveAt: Date.now() }) }) });
            }
            return procState;
        });
        reducers.push((procState = types_1.Client.defaultProcState, action) => action.type.startsWith("envkey/") &&
            action.type != types_1.Client.ActionType.MERGE_PERSISTED
            ? Object.assign(Object.assign({}, procState), { lastActiveAt: Date.now() }) : procState);
        return reducers;
    })
        .filter(Boolean));
    return (state = types_1.Client.defaultProcState, action) => {
        let reduced = state;
        for (let reducer of reducers) {
            reduced = reducer(reduced, action);
        }
        return reduced;
    };
}, dispatchStore = (action, contextMeta, tempId, storeArg) => {
    const reduxAction = Object.assign(Object.assign({}, action), { meta: Object.assign(Object.assign(Object.assign({}, ("meta" in action ? action.meta : {})), (contextMeta !== null && contextMeta !== void 0 ? contextMeta : {})), { tempId }) });
    const store = storeArg !== null && storeArg !== void 0 ? storeArg : (0, redux_store_1.getDefaultStore)();
    let start;
    if (process.env.LOG_ALL_ACTIONS) {
        start = process.hrtime.bigint();
    }
    store.dispatch(reduxAction);
    if (process.env.LOG_ALL_ACTIONS && start) {
        const elapsedNs = process.hrtime.bigint() - start;
        const elapsedMs = Number(elapsedNs) / 1000000;
        (0, logger_1.log)("dispatched " +
            reduxAction.type +
            ` - ${elapsedMs.toFixed(3)}ms elapsed`);
    }
};
exports.clientAction = clientAction, exports.getActionParams = getActionParams, exports.dispatch = dispatch, exports.clientReducer = clientReducer, exports.dispatchStore = dispatchStore;
const getHandleSuccess = (actionParams, action, store, tempId) => async (rootAction, payload, apiSuccessContext) => {
    let successAccountId;
    if ("successAccountIdFn" in actionParams &&
        actionParams.successAccountIdFn) {
        successAccountId = actionParams.successAccountIdFn(payload);
    }
    const successAction = {
        type: action.type + "_SUCCESS",
        meta: { rootAction },
        payload,
    }, contextParams = successAccountId
        ? Object.assign(Object.assign({}, apiSuccessContext), { store, accountIdOrCliKey: successAccountId }) : apiSuccessContext;
    (0, exports.dispatchStore)(successAction, contextParams, tempId, store);
    let updatedState = (0, state_1.getState)(store, contextParams);
    // clear any newly revoked session keys
    if (updatedState.trustedRoot &&
        !R.isEmpty(updatedState.trustedSessionPubkeys)) {
        (0, trust_1.clearRevokedOrOutdatedSessionPubkeys)(updatedState, contextParams);
        updatedState = (0, state_1.getState)(store, contextParams);
    }
    if ("verifyCurrentUser" in actionParams && actionParams.verifyCurrentUser) {
        const res = await (0, trust_1.verifyCurrentUser)(updatedState, contextParams);
        if (res) {
            updatedState = (0, state_1.getState)(store, contextParams);
        }
        else {
            throw new Error("Couldn't verify current user");
        }
    }
    else {
        // process queued root pubkey replacements for successful api actions
        if (actionParams.type == "apiRequestAction" &&
            !actionParams.skipProcessRootPubkeyReplacements) {
            await (0, trust_1.processRootPubkeyReplacementsIfNeeded)(updatedState, contextParams, true);
            updatedState = (0, state_1.getState)(store, contextParams);
        }
        if (updatedState.trustedRoot && contextParams.accountIdOrCliKey) {
            // ensure current user's trust chain is still valid
            const auth = (0, client_1.getAuth)(updatedState, contextParams.accountIdOrCliKey);
            if (auth && auth.privkey) {
                const res = await (0, trust_1.verifyOrgKeyable)(updatedState, "deviceId" in auth ? auth.deviceId : auth.userId, contextParams);
                if (res) {
                    updatedState = (0, state_1.getState)(store, contextParams);
                }
                else {
                    throw new Error("Updated graph broke current user's trust chain");
                }
            }
        }
    }
    if ("successHandler" in actionParams && actionParams.successHandler) {
        await actionParams.successHandler(updatedState, rootAction, payload, contextParams);
        updatedState = (0, state_1.getState)(store, contextParams);
    }
    const auth = (0, client_1.getAuth)(updatedState, contextParams.accountIdOrCliKey);
    // clear any blobs orphaned by a graph action
    // runs in background on worker thread
    if (auth &&
        auth.privkey &&
        actionParams.type == "apiRequestAction" &&
        actionParams.graphAction) {
        (0, exports.dispatch)({
            type: types_1.Client.ActionType.CLEAR_ORPHANED_BLOBS,
        }, contextParams);
    }
    // reencrypt any environments that require it
    let toReencryptIds;
    if (auth) {
        toReencryptIds = (0, graph_1.getEnvironmentsQueuedForReencryptionIds)(updatedState.graph, auth.userId);
    }
    if (auth &&
        auth.privkey &&
        actionParams.type == "apiRequestAction" &&
        !actionParams.skipReencryptPermitted &&
        !updatedState.isReencrypting &&
        toReencryptIds &&
        toReencryptIds.length > 0) {
        (0, exports.dispatch)({
            type: types_1.Client.ActionType.REENCRYPT_PERMITTED_LOOP,
        }, contextParams);
        updatedState = (0, state_1.getState)(store, contextParams);
    }
    else if (auth &&
        auth.privkey &&
        actionParams.type == "apiRequestAction" &&
        !actionParams.skipProcessRevocationRequests &&
        !contextParams.skipProcessRevocationRequests &&
        !(toReencryptIds && toReencryptIds.length > 0)) {
        // trigger processing any queued revocation requests
        const revocationRes = await (0, trust_1.processRevocationRequestsIfNeeded)(updatedState, contextParams);
        if (revocationRes && !revocationRes.success) {
            return revocationRes;
        }
        updatedState = (0, state_1.getState)(store, contextParams);
    }
    return {
        success: true,
        resultAction: successAction,
        state: updatedState,
    };
};
const getHandleFailure = (actionParams, action, store, tempId) => async (rootAction, error, failureContext) => {
    const failurePayload = error instanceof Error
        ? {
            type: "clientError",
            error: { name: error.name, message: error.message },
        }
        : error, failureAction = {
        type: action.type + "_FAILURE",
        meta: { rootAction: rootAction },
        payload: failurePayload,
    };
    // log("", failurePayload);
    (0, exports.dispatchStore)(failureAction, failureContext, tempId, store);
    const updatedState = (0, state_1.getState)(store, failureContext);
    if ("failureHandler" in actionParams && actionParams.failureHandler) {
        await actionParams.failureHandler(updatedState, rootAction, failurePayload, failureContext);
    }
    return {
        success: false,
        resultAction: failureAction,
        state: updatedState,
    };
};
//# sourceMappingURL=handler.js.map