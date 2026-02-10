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
const state_1 = require("../lib/state");
const R = __importStar(require("ramda"));
const client_1 = require("@envkey/core/lib/client");
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const envs_1 = require("../lib/envs");
const trust_1 = require("../lib/trust");
const graph_1 = require("@envkey/core/lib/graph");
const logger_1 = require("@envkey/core/lib/utils/logger");
const blob_1 = require("@envkey/core/lib/blob");
const wait_1 = require("@envkey/core/lib/utils/wait");
const state_2 = require("@envkey/client-core-process/lib/state");
const redux_store_1 = require("@envkey/client-core-process/redux_store");
const DEFAULT_REENCRYPTION_MIN_DELAY = 500;
const DEFAULT_REENCRYPTION_JITTER = 500;
const DEFAULT_REENCRYPTION_BATCH_SIZE = 5;
const REENCRYPTION_MAX_FETCH_ENVS_ATTEMPTS = 5;
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.ADD_TRUSTED_SESSION_PUBKEY,
    stateProducer: (draft, { payload }) => {
        draft.trustedSessionPubkeys[payload.id] = payload.trusted;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_TRUSTED_SESSION_PUBKEY,
    stateProducer: (draft, { payload }) => {
        const trustedPairs = R.toPairs(draft.trustedSessionPubkeys);
        let clearingIds = [payload.id];
        while (clearingIds.length > 0) {
            const willClear = [];
            for (let clearingId of clearingIds) {
                delete draft.trustedSessionPubkeys[clearingId];
                for (let [trustedId, trusted] of trustedPairs) {
                    if (trusted[trusted.length - 1] === clearingId) {
                        willClear.push(trustedId);
                    }
                }
            }
            clearingIds = willClear;
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_TRUSTED_ROOT_PUBKEY,
    stateProducer: (draft, { payload }) => {
        if (!draft.trustedRoot[payload.id]) {
            draft.trustedRoot[payload.id] = payload.trusted;
        }
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.PROCESS_ROOT_PUBKEY_REPLACEMENTS,
    stateProducer: (draft) => {
        draft.isProcessingRootPubkeyReplacements = true;
        delete draft.processRootPubkeyReplacementsError;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.processRootPubkeyReplacementsError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.isProcessingRootPubkeyReplacements;
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        let state = initialState;
        if (!state.trustedRoot) {
            throw new Error("trustedRoot undefined");
        }
        const { rootPubkeyReplacements } = (0, graph_1.graphTypes)(state.graph);
        if (rootPubkeyReplacements.length === 0) {
            return dispatchSuccess(null, context);
        }
        for (let replacement of rootPubkeyReplacements) {
            await (0, trust_1.verifyRootPubkeyReplacement)(state, replacement);
            const res = await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.SET_TRUSTED_ROOT_PUBKEY,
                payload: {
                    id: (0, client_1.getPubkeyHash)(replacement.replacingPubkey),
                    trusted: ["root", replacement.replacingPubkey],
                },
            }, context);
            state = res.state;
        }
        if (!state.trustedRoot) {
            throw new Error("trustedPubkeys undefined");
        }
        if (action.payload.commitTrusted) {
            const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
            if (!auth) {
                throw new Error("Authentication required for this request");
            }
            if (!auth.privkey) {
                throw new Error("privkey either undefined or encrypted");
            }
            const signedTrustedRoot = await (0, proxy_1.signJson)({
                data: state.trustedRoot,
                privkey: auth.privkey,
            });
            const res = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.UPDATE_TRUSTED_ROOT_PUBKEY,
                payload: {
                    signedTrustedRoot: { data: signedTrustedRoot },
                    replacementIds: rootPubkeyReplacements.map(R.prop("id")),
                },
            }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
            if (!res.success) {
                return dispatchFailure(res.resultAction
                    .payload, context);
            }
        }
        return dispatchSuccess(null, context);
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.PROCESS_REVOCATION_REQUESTS,
    stateProducer: (draft) => {
        draft.isProcessingRevocationRequests = true;
        delete draft.processRevocationRequestError;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.processRevocationRequestError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.isProcessingRevocationRequests;
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        let state = initialState;
        const currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!currentAuth || !currentAuth.privkey) {
            throw new Error("Authentication and decrypted privkey required");
        }
        const currentAuthId = currentAuth.type == "clientUserAuth"
            ? currentAuth.deviceId
            : currentAuth.userId;
        const privkey = currentAuth.privkey;
        const { pubkeyRevocationRequests, apps, blocks, environments } = (0, graph_1.graphTypes)(state.graph);
        const byRequestId = {};
        let signedPubkeys = {};
        let replacingRoot = false;
        const cryptoPromises = [];
        for (let request of pubkeyRevocationRequests) {
            byRequestId[request.id] = request.targetId;
            const { isRoot } = state.graph[request.targetId];
            if (isRoot) {
                replacingRoot = true;
            }
        }
        for (let request of pubkeyRevocationRequests) {
            const signedByKeyableIds = (0, graph_1.getSignedByKeyableIds)(state.graph, request.targetId);
            for (let keyableId of signedByKeyableIds) {
                const { pubkey } = state.graph[keyableId];
                cryptoPromises.push((0, proxy_1.signPublicKey)({
                    privkey,
                    pubkey,
                }).then((signedPubkey) => {
                    signedPubkeys[keyableId] = signedPubkey;
                }));
            }
        }
        await Promise.all(cryptoPromises);
        // when replacing root, the replacement trust chain should end at the *previous* root, and the encrypted by trust chain should end at the *new* root
        const replacingRootTrustChain = replacingRoot
            ? await (0, proxy_1.signJson)({
                data: (0, client_1.getTrustChain)(state, currentAuth.type == "clientUserAuth"
                    ? currentAuth.deviceId
                    : currentAuth.userId),
                privkey,
            })
            : undefined;
        if (replacingRoot) {
            const { pubkey: currentUserPubkey, pubkeyId: currentUserPubkeyId } = state
                .graph[currentAuthId];
            await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.SET_TRUSTED_ROOT_PUBKEY,
                payload: {
                    id: currentUserPubkeyId,
                    trusted: ["root", currentUserPubkey],
                },
            }, context);
            const res = await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.CLEAR_TRUSTED_SESSION_PUBKEY,
                payload: { id: currentUserPubkeyId },
            }, context);
            if (res.success) {
                state = res.state;
            }
            else {
                return dispatchFailure(res.resultAction
                    .payload, context);
            }
            if (!state.trustedRoot) {
                throw new Error("trustedPubkeys undefined");
            }
        }
        const signedTrustedRoot = replacingRoot && state.trustedRoot
            ? await (0, proxy_1.signJson)({
                data: state.trustedRoot,
                privkey: currentAuth.privkey,
            })
            : undefined;
        const apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.REVOKE_TRUSTED_PUBKEYS,
            payload: {
                byRequestId,
                signedPubkeys,
                replacingRootTrustChain: replacingRootTrustChain
                    ? { data: replacingRootTrustChain }
                    : undefined,
                signedTrustedRoot: signedTrustedRoot
                    ? { data: signedTrustedRoot }
                    : undefined,
            },
        }, context);
        if (apiRes.success) {
            return dispatchSuccess(null, context);
        }
        else {
            return dispatchFailure(apiRes.resultAction
                .payload, context);
        }
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.REENCRYPT_PERMITTED_LOOP,
    stateProducer: (draft) => {
        draft.isReencrypting = true;
    },
    endStateProducer: (draft) => {
        delete draft.isReencrypting;
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b, _c, _d, _e, _f, _g;
        let state = initialState;
        const currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!currentAuth || !currentAuth.privkey) {
            throw new Error("Authentication and decrypted privkey required");
        }
        while (true) {
            let allReencryptIds = (0, graph_1.getEnvironmentsQueuedForReencryptionIds)(state.graph, currentAuth.userId);
            if (allReencryptIds.length == 0) {
                return dispatchSuccess(null, context);
            }
            // add some delay jitter to allow room for other actions
            const minDelay = parseInt(`${(_a = process.env.REENCRYPTION_MIN_DELAY) !== null && _a !== void 0 ? _a : DEFAULT_REENCRYPTION_MIN_DELAY}`);
            const jitter = parseInt(`${(_b = process.env.REENCRYPTION_JITTER) !== null && _b !== void 0 ? _b : DEFAULT_REENCRYPTION_JITTER}`);
            await (0, wait_1.wait)(minDelay + Math.floor(Math.random() * jitter));
            state = (0, state_2.getState)((_c = context.store) !== null && _c !== void 0 ? _c : (0, redux_store_1.getDefaultStore)(), context);
            allReencryptIds = (0, graph_1.getEnvironmentsQueuedForReencryptionIds)(state.graph, currentAuth.userId);
            if (allReencryptIds.length == 0) {
                return dispatchSuccess(null, context);
            }
            const batchSize = parseInt(`${(_d = process.env.REENCRYPTION_BATCH_SIZE) !== null && _d !== void 0 ? _d : DEFAULT_REENCRYPTION_BATCH_SIZE}`);
            const numBatches = Math.max(1, allReencryptIds.length / batchSize);
            const randomBatchNum = Math.floor(Math.random() * numBatches);
            const batchEnvironmentIds = allReencryptIds.slice(randomBatchNum * batchSize, batchSize);
            let envParentIds = new Set();
            for (let environmentId of batchEnvironmentIds) {
                let envParentId;
                const environment = state.graph[environmentId];
                if (environment) {
                    envParentId = environment.envParentId;
                }
                else {
                    envParentId = environmentId.split("|")[0];
                }
                envParentIds.add(envParentId);
            }
            /*
             * if we're currently either fetching the env parent
             * or updating envs for an environment we're about to
             * re-encrypt first wait for the fetch and/or update to finish
             */
            await (0, state_1.waitForStateCondition)((_e = context.store) !== null && _e !== void 0 ? _e : (0, redux_store_1.getDefaultStore)(), context, (state) => {
                return !Object.keys(state.isFetchingEnvs).find((isFetchingEnvParentId) => envParentIds.has(isFetchingEnvParentId));
            });
            const res = await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.REENCRYPT_ENVS,
                payload: { environmentIds: batchEnvironmentIds },
            }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
            if (res.success) {
                state = res.state;
                if (res.retriedWithUpdatedGraph) {
                    return res;
                }
            }
            else {
                (0, logger_1.log)("REENCRYPT_ENVS failed", (_f = res.resultAction) === null || _f === void 0 ? void 0 : _f.payload);
                return dispatchFailure((_g = res.resultAction) === null || _g === void 0 ? void 0 : _g.payload, context);
            }
        }
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.REENCRYPT_ENVS,
    serialAction: true,
    stateProducer: (draft, { payload: { environmentIds } }) => {
        for (let environmentId of environmentIds) {
            draft.isReencryptingEnvs[environmentId] = true;
            delete draft.reencryptEnvsErrors[environmentId];
        }
    },
    successStateProducer: (draft, { meta: { dispatchContext, rootAction: { payload: { environmentIds }, }, }, }) => {
        for (let environmentId of environmentIds) {
            let envParentId;
            const environment = draft.graph[environmentId];
            if (environment) {
                envParentId = environment.envParentId;
            }
            else {
                [envParentId] = environmentId.split("|");
            }
            const envParent = draft.graph[envParentId];
            draft.envsFetchedAt[envParentId] = envParent.envsOrLocalsUpdatedAt;
        }
        draft.envs = Object.assign(Object.assign({}, draft.envs), dispatchContext.envs);
        draft.changesets = Object.assign(Object.assign({}, draft.changesets), dispatchContext.changesets);
    },
    failureStateProducer: (draft, { meta: { rootAction: { payload: { environmentIds }, }, }, payload, }) => {
        for (let environmentId of environmentIds) {
            draft.reencryptEnvsErrors[environmentId] = payload;
        }
    },
    endStateProducer: (draft, { meta: { rootAction: { payload: { environmentIds }, }, }, }) => {
        for (let environmentId of environmentIds) {
            delete draft.isReencryptingEnvs[environmentId];
        }
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b;
        let state = initialState;
        const { payload: { environmentIds: reencryptEnvironmentIds }, } = action;
        const currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!currentAuth || !currentAuth.privkey) {
            throw new Error("Authentication and decrypted privkey required");
        }
        const envParentIds = new Set();
        for (let reencryptEnvironmentId of reencryptEnvironmentIds) {
            let envParentId;
            const environment = state.graph[reencryptEnvironmentId];
            if (environment) {
                envParentId = environment.envParentId;
            }
            else {
                envParentId = reencryptEnvironmentId.split("|")[0];
            }
            envParentIds.add(envParentId);
        }
        const fetchOutdatedEnvs = async () => {
            const requiredEnvIds = new Set();
            const requiredChangesetIds = new Set();
            for (let envParentId of envParentIds) {
                if ((0, client_1.envsNeedFetch)(state, envParentId)) {
                    requiredEnvIds.add(envParentId);
                }
                if ((0, client_1.changesetsNeedFetch)(state, envParentId)) {
                    requiredChangesetIds.add(envParentId);
                }
            }
            if (requiredEnvIds.size > 0 || requiredChangesetIds.size > 0) {
                const fetchRequiredEnvsRes = await (0, envs_1.fetchRequiredEnvs)(state, requiredEnvIds, requiredChangesetIds, Object.assign(Object.assign({}, context), { skipProcessRevocationRequests: true }), true);
                if (fetchRequiredEnvsRes) {
                    if (!fetchRequiredEnvsRes.success) {
                        return dispatchFailure(fetchRequiredEnvsRes.resultAction
                            .payload, Object.assign({}, context));
                    }
                    state = fetchRequiredEnvsRes.state;
                }
            }
        };
        await fetchOutdatedEnvs();
        let keys;
        let blobs;
        let environmentKeysByComposite;
        let changesetKeysByEnvironmentId;
        const setEnvParams = async () => {
            ({
                keys,
                blobs,
                environmentKeysByComposite,
                changesetKeysByEnvironmentId,
            } = await (0, envs_1.envParamsForEnvironments)({
                state,
                environmentIds: reencryptEnvironmentIds,
                rotateKeys: true,
                reencryptChangesets: true,
                context,
            }));
        };
        let numRetries = 0;
        while (!(keys &&
            blobs &&
            environmentKeysByComposite &&
            changesetKeysByEnvironmentId)) {
            try {
                await setEnvParams();
                break;
            }
            catch (err) {
                if (err.message.includes("latest envs not fetched") ||
                    err.message.includes("latest changesets not fetched")) {
                    await fetchOutdatedEnvs();
                    numRetries++;
                    if (numRetries >= REENCRYPTION_MAX_FETCH_ENVS_ATTEMPTS) {
                        break;
                    }
                }
                else {
                    return dispatchFailure({
                        type: "clientError",
                        error: { name: "ReencryptEnvsError", message: err.message },
                    }, Object.assign({}, context));
                }
            }
        }
        if (!(keys &&
            blobs &&
            environmentKeysByComposite &&
            changesetKeysByEnvironmentId)) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "ReencryptEnvsError",
                    message: `Could not fetch latest envs and changesets for re-encryption after ${numRetries} attempts`,
                },
            }, Object.assign({}, context));
        }
        if (R.isEmpty(keys) && R.isEmpty(blobs)) {
            return dispatchSuccess(null, Object.assign(Object.assign({}, context), { dispatchContext: { envs: {}, changesets: {} } }));
        }
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
                privkey: currentAuth.privkey,
            });
        }
        const apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.REENCRYPT_ENVS,
            payload: {
                keys,
                blobs,
                encryptedByTrustChain: encryptedByTrustChain
                    ? { data: encryptedByTrustChain }
                    : undefined,
            },
        }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        const envs = reencryptEnvironmentIds.reduce((agg, environmentId) => {
            var _a, _b;
            const environment = state.graph[environmentId];
            const envComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                environmentId,
            });
            const envState = state.envs[envComposite];
            const metaComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                environmentId,
                envPart: "meta",
            });
            const metaState = state.envs[metaComposite];
            let inheritsComposite;
            let inheritsState;
            if (environment) {
                inheritsComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId,
                    envPart: "inherits",
                });
                inheritsState = state.envs[inheritsComposite];
            }
            const res = Object.assign(Object.assign(Object.assign(Object.assign({}, agg), (metaState
                ? {
                    [metaComposite]: {
                        env: metaState.env,
                        key: environmentKeysByComposite[metaComposite],
                    },
                }
                : {})), (envState
                ? {
                    [envComposite]: {
                        env: envState.env,
                        key: environmentKeysByComposite[envComposite],
                    },
                }
                : {})), (inheritsComposite && inheritsState
                ? {
                    [inheritsComposite]: {
                        env: inheritsState.env,
                        key: environmentKeysByComposite[inheritsComposite],
                    },
                }
                : {}));
            if (environment && !environment.isSub) {
                const inheritingEnvironmentIds = new Set(((_a = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[environment.envParentId]) !== null && _a !== void 0 ? _a : [])
                    .filter((sibling) => sibling.id != environment.id &&
                    !(sibling.isSub && sibling.parentEnvironmentId == environment.id))
                    .map(R.prop("id")));
                for (let inheritingEnvironmentId of inheritingEnvironmentIds) {
                    const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                        environmentId: inheritingEnvironmentId,
                        inheritsEnvironmentId: environment.id,
                    });
                    if (state.envs[composite]) {
                        const key = environmentKeysByComposite[composite];
                        res[composite] = { env: state.envs[composite].env, key };
                    }
                    else {
                        (0, logger_1.log)("Missing inheritanceOverrides composite", {
                            composite,
                            envParent: (0, graph_1.getObjectName)(state.graph, environment.envParentId),
                            environment: (0, graph_1.getEnvironmentName)(state.graph, environment.id),
                            inheritingEnvironment: (0, graph_1.getEnvironmentName)(state.graph, inheritingEnvironmentId),
                        });
                        throw new Error("Missing inheritanceOverrides composite");
                    }
                }
            }
            if (environment) {
                const siblingBaseEnvironmentIds = ((_b = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[environment.envParentId]) !== null && _b !== void 0 ? _b : [])
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
                    if (state.envs[composite]) {
                        const key = environmentKeysByComposite[composite];
                        res[composite] = { env: state.envs[composite].env, key };
                    }
                    else {
                        (0, logger_1.log)("Missing inheritanceOverrides composite", {
                            composite,
                            envParent: (0, graph_1.getObjectName)(state.graph, environment.envParentId),
                            environment: (0, graph_1.getEnvironmentName)(state.graph, environment.id),
                            inheritingEnvironment: (0, graph_1.getEnvironmentName)(state.graph, siblingEnvironment.id),
                        });
                        throw new Error("Missing inheritanceOverrides composite");
                    }
                }
            }
            return res;
        }, {});
        const changesets = reencryptEnvironmentIds.reduce((agg, environmentId) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, agg), { [environmentId]: {
                    key: changesetKeysByEnvironmentId[environmentId],
                    changesets: (_b = (_a = state.changesets[environmentId]) === null || _a === void 0 ? void 0 : _a.changesets) !== null && _b !== void 0 ? _b : [],
                } }));
        }, {});
        const dispatchContext = {
            envs,
            changesets,
        };
        if (apiRes.success) {
            return dispatchSuccess(null, Object.assign(Object.assign({}, context), { dispatchContext }));
        }
        else {
            return dispatchFailure(apiRes.resultAction
                .payload, Object.assign(Object.assign({}, context), { dispatchContext }));
        }
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.UPDATE_TRUSTED_ROOT_PUBKEY,
    loggableType: "authAction",
    authenticated: true,
    successStateProducer: (draft, { meta, payload }) => {
        for (let replacementId of meta.rootAction.payload.replacementIds) {
            delete draft.graph[replacementId];
        }
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.REVOKE_TRUSTED_PUBKEYS,
    loggableType: "orgAction",
    loggableType2: "authAction",
    authenticated: true,
    graphAction: true,
    skipReencryptPermitted: true,
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.REENCRYPT_ENVS,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    skipReencryptPermitted: true,
    skipProcessRootPubkeyReplacements: true,
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.VERIFIED_SIGNED_TRUSTED_ROOT_PUBKEY,
    stateProducer: (draft, { payload }) => {
        draft.trustedRoot = payload;
        delete draft.signedTrustedRoot;
    },
});
//# sourceMappingURL=crypto.js.map