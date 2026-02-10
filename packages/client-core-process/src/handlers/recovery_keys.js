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
const state_1 = require("../lib/state");
const utils_1 = require("@envkey/core/lib/crypto/utils");
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const client_1 = require("@envkey/core/lib/client");
const envs_1 = require("../lib/envs");
const trust_1 = require("../lib/trust");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const phrase_1 = require("@envkey/core/lib/crypto/phrase");
const status_1 = require("@envkey/client-core-process/lib/envs/status");
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CREATE_RECOVERY_KEY,
    serialAction: true,
    stateProducer: (draft) => {
        draft.isGeneratingRecoveryKey = true;
        delete draft.generateRecoveryKeyError;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.generateRecoveryKeyError = payload;
    },
    successStateProducer: (draft, { payload }) => {
        draft.generatedRecoveryKey = payload;
    },
    endStateProducer: (draft) => {
        delete draft.isGeneratingRecoveryKey;
        (0, envs_1.clearNonPendingEnvsProducer)(draft);
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const fetchRes = await (0, envs_1.fetchEnvsForUserOrAccessParams)(state, [{ userId: auth.userId }], context);
        let stateWithFetched;
        if (fetchRes) {
            if (fetchRes.success) {
                stateWithFetched = fetchRes.state;
            }
            else {
                return dispatchFailure(fetchRes.resultAction.payload, context);
            }
        }
        else {
            stateWithFetched = state;
        }
        try {
            const [apiParams, encryptionKey] = await createRecoveryKey(stateWithFetched, auth, context);
            const apiRes = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.CREATE_RECOVERY_KEY,
                payload: apiParams,
            }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
            if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
                return apiRes;
            }
            if (apiRes.success) {
                return dispatchSuccess({ encryptionKey }, context);
            }
            else {
                return dispatchFailure(apiRes.resultAction.payload, context);
            }
        }
        catch (err) {
            return dispatchFailure({
                type: "clientError",
                error: { name: err.name, message: err.message },
            }, context);
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_GENERATED_RECOVERY_KEY,
    stateProducer: (draft) => {
        delete draft.generatedRecoveryKey;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_RECOVERY_KEY,
    stateProducer: (draft) => {
        delete draft.loadedRecoveryKeyIdentityHash;
        delete draft.loadedRecoveryPrivkey;
        delete draft.loadedRecoveryKey;
        delete draft.loadRecoveryKeyError;
        delete draft.loadedRecoveryKeyEmailToken;
        delete draft.loadedRecoveryKeyOrgId;
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.LOAD_RECOVERY_KEY,
    stateProducer: (draft) => {
        draft.isLoadingRecoveryKey = true;
        delete draft.loadedRecoveryKey;
        delete draft.loadRecoveryKeyError;
        delete draft.loadedRecoveryPrivkey;
        delete draft.loadedRecoveryKeyEmailToken;
        delete draft.loadedRecoveryKeyIdentityHash;
        delete draft.loadedRecoveryKeyHostUrl;
        delete draft.loadedRecoveryKeyOrgId;
    },
    endStateProducer: (draft) => {
        delete draft.isLoadingRecoveryKey;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.loadRecoveryKeyError = payload;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        delete draft.signedTrustedRoot;
        delete draft.trustedRoot;
        draft.trustedSessionPubkeys = {};
        delete draft.loadedRecoveryKey;
    },
    successStateProducer: (draft, action) => {
        (0, envs_1.decryptedEnvsStateProducer)(draft, action);
        draft.loadedRecoveryPrivkey = action.payload.loadedRecoveryPrivkey;
        draft.loadedRecoveryPrivkey = action.payload.loadedRecoveryPrivkey;
        draft.loadedRecoveryKeyEmailToken =
            action.payload.loadedRecoveryKeyEmailToken;
        draft.loadedRecoveryKeyIdentityHash =
            action.payload.loadedRecoveryKeyIdentityHash;
        draft.loadedRecoveryKeyHostUrl = action.payload.loadedRecoveryKeyHostUrl;
        draft.loadedRecoveryKeyOrgId = action.payload.loadedRecoveryKeyOrgId;
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b, _c, _d, _e, _f;
        const { payload: { encryptionKey, hostUrl, emailToken }, } = action;
        let state = initialState;
        const identityHash = getIdentityHash({ hostUrl, encryptionKey }), apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.LOAD_RECOVERY_KEY,
            payload: { emailToken },
        }, Object.assign(Object.assign({}, context), { hostUrl, rootClientAction: action, auth: {
                type: "loadRecoveryKeyAuthParams",
                identityHash,
            } }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        if (!apiRes.success) {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        state = apiRes.state;
        const apiPayload = apiRes.resultAction.payload;
        const apiSuccessContext = Object.assign(Object.assign({}, context), { hostUrl, accountIdOrCliKey: apiPayload.type == "loadedRecoveryKey"
                ? apiPayload.recoveryKey.userId
                : undefined });
        try {
            if (apiPayload.type != "loadedRecoveryKey") {
                return dispatchFailure(apiPayload, context);
            }
            const recoveryPrivkey = await (0, proxy_1.decryptPrivateKey)({
                encryptedPrivkey: apiPayload.recoveryKey.encryptedPrivkey,
                encryptionKey,
            });
            const [_, verifyTrustedRes] = await Promise.all([
                (0, trust_1.verifyKeypair)(apiPayload.recoveryKey.pubkey, recoveryPrivkey),
                (0, trust_1.verifySignedTrustedRootPubkey)(apiRes.state, apiPayload.recoveryKey.pubkey, apiSuccessContext),
            ]);
            state = verifyTrustedRes.state;
            const replacementsRes = await (0, trust_1.processRootPubkeyReplacementsIfNeeded)(state, apiSuccessContext);
            if (replacementsRes && !replacementsRes.success) {
                throw new Error("couldn't process root pubkey replacements");
            }
            else if (replacementsRes) {
                state = replacementsRes.state;
            }
            await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
                payload: {
                    processed: 0,
                    total: Object.keys((_a = apiPayload.envs.keys) !== null && _a !== void 0 ? _a : {}).length +
                        Object.keys((_b = apiPayload.changesets.keys) !== null && _b !== void 0 ? _b : {}).length,
                    op: "decrypt",
                    dataType: "keys",
                },
            }, context);
            const [decryptedEnvs, decryptedChangesets] = await Promise.all([
                (0, envs_1.decryptEnvs)(state, (_c = apiPayload.envs.keys) !== null && _c !== void 0 ? _c : {}, (_d = apiPayload.envs.blobs) !== null && _d !== void 0 ? _d : {}, recoveryPrivkey, apiSuccessContext, true),
                (0, envs_1.decryptChangesets)(state, (_e = apiPayload.changesets.keys) !== null && _e !== void 0 ? _e : {}, (_f = apiPayload.changesets.blobs) !== null && _f !== void 0 ? _f : {}, recoveryPrivkey, apiSuccessContext, true),
            ]);
            await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
                payload: undefined,
            }, context);
            return dispatchSuccess({
                envs: decryptedEnvs,
                changesets: decryptedChangesets,
                loadedRecoveryPrivkey: recoveryPrivkey,
                loadedRecoveryKeyIdentityHash: identityHash,
                loadedRecoveryKeyEmailToken: emailToken,
                loadedRecoveryKeyOrgId: apiPayload.orgId,
                loadedRecoveryKeyHostUrl: hostUrl,
                timestamp: apiRes.resultAction.payload.timestamp,
            }, apiSuccessContext);
        }
        catch (err) {
            return dispatchFailure({
                type: "clientError",
                error: { name: err.name, message: err.message },
            }, apiSuccessContext);
        }
    },
    successHandler: async (state, action, payload, context) => {
        (0, status_1.updateLocalSocketEnvActionStatusIfNeeded)(state, context);
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.REDEEM_RECOVERY_KEY,
    verifyCurrentUser: true,
    stateProducer: (draft) => {
        draft.isRedeemingRecoveryKey = true;
    },
    successStateProducer: (draft) => {
        draft.didRedeemRecoveryKey = true;
    },
    endStateProducer: (draft) => {
        delete draft.isRedeemingRecoveryKey;
        delete draft.loadedRecoveryKey;
        delete draft.loadedRecoveryPrivkey;
        delete draft.loadedRecoveryKeyEmailToken;
        delete draft.loadedRecoveryKeyIdentityHash;
        delete draft.loadedRecoveryKeyHostUrl;
        delete draft.loadedRecoveryKeyOrgId;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.redeemRecoveryKeyError = payload;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        delete draft.trustedRoot;
        delete draft.signedTrustedRoot;
        draft.trustedSessionPubkeys = {};
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        const { type, payload } = action;
        if (!state.loadedRecoveryKeyHostUrl) {
            throw new Error("Action requires state.loadedRecoveryKeyHostUrl");
        }
        if (!(state.loadedRecoveryKey &&
            state.loadedRecoveryPrivkey &&
            state.loadedRecoveryKeyOrgId &&
            state.loadedRecoveryKeyIdentityHash) ||
            state.loadRecoveryKeyError) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "RecoveryKeyNotLoaded",
                    message: "RecoveryKey not loaded",
                },
            }, context);
        }
        const apiSuccessContext = Object.assign(Object.assign({}, context), { accountIdOrCliKey: state.loadedRecoveryKey.userId, hostUrl: state.loadedRecoveryKeyHostUrl }), { pubkey, privkey } = await (0, proxy_1.generateKeys)(), signedPubkey = await (0, proxy_1.signPublicKey)({
            privkey: state.loadedRecoveryPrivkey,
            pubkey,
        }), { pubkey: creatorPubkey } = state.graph[state.loadedRecoveryKey.creatorDeviceId], creatorPubkeyId = (0, client_1.getPubkeyHash)(creatorPubkey), updateTrustedRes = await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.ADD_TRUSTED_SESSION_PUBKEY,
            payload: {
                id: (0, utils_1.sha256)(JSON.stringify([state.loadedRecoveryKey.deviceId, signedPubkey])),
                trusted: [
                    "orgUserDevice",
                    signedPubkey,
                    state.loadedRecoveryKey.pubkey,
                    creatorPubkeyId,
                ],
            },
        }, apiSuccessContext), trustedPubkeys = updateTrustedRes.state.trustedRoot, [envParams, signedTrustedRoot] = await Promise.all([
            (0, envs_1.encryptedKeyParamsForDeviceOrInvitee)({
                state,
                privkey,
                pubkey: signedPubkey,
                userId: state.loadedRecoveryKey.userId,
                context,
            }),
            (0, proxy_1.signJson)({ data: trustedPubkeys, privkey }),
        ]), authProps = {
            type: "redeemRecoveryKeyAuthParams",
            identityHash: state.loadedRecoveryKeyIdentityHash,
        }, apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.REDEEM_RECOVERY_KEY,
            payload: Object.assign(Object.assign({}, envParams), { device: {
                    name: payload.deviceName,
                    signedTrustedRoot: { data: signedTrustedRoot },
                    pubkey: signedPubkey,
                }, emailToken: state.loadedRecoveryKeyEmailToken }),
        }, Object.assign(Object.assign({}, apiSuccessContext), { rootClientAction: action, auth: Object.assign(Object.assign({}, authProps), { signature: tweetnacl_util_1.default.encodeBase64(tweetnacl_1.default.sign.detached(tweetnacl_util_1.default.decodeUTF8(JSON.stringify(R.props(["identityHash"], authProps))), tweetnacl_util_1.default.decodeBase64(state.loadedRecoveryPrivkey.keys.signingKey))) }), dispatchContext: { privkey, hostUrl: state.loadedRecoveryKeyHostUrl } }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        if (apiRes.success) {
            return dispatchSuccess(null, apiSuccessContext);
        }
        else {
            return dispatchFailure(apiRes.resultAction.payload, apiSuccessContext);
        }
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_RECOVERY_KEY,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.LOAD_RECOVERY_KEY,
    skipProcessRootPubkeyReplacements: true,
    skipReencryptPermitted: true,
    authenticated: true,
    loggableType: "fetchMetaAction",
    loggableType2: "authAction",
    successAccountIdFn: (payload) => payload.type == "loadedRecoveryKey"
        ? payload.recoveryKey.userId
        : undefined,
    successStateProducer: (draft, { payload }) => {
        if (payload.type == "loadedRecoveryKey") {
            draft.graph = payload.graph;
            draft.graphUpdatedAt = payload.graphUpdatedAt;
            draft.signedTrustedRoot = payload.signedTrustedRoot;
            draft.loadedRecoveryKey = payload.recoveryKey;
        }
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.REDEEM_RECOVERY_KEY,
    loggableType: "orgAction",
    loggableType2: "authAction",
    authenticated: true,
    graphAction: true,
    skipReencryptPermitted: true,
    successAccountIdFn: (payload) => payload.userId,
    successStateProducer: state_1.newAccountStateProducer,
    refreshActionCreator: (requestAction) => {
        return {
            type: types_1.Client.ActionType.LOAD_RECOVERY_KEY,
            payload: requestAction.payload,
        };
    },
});
const createRecoveryKey = async (state, auth, context) => {
    if (!auth.privkey) {
        throw new Error("Action requires decrypted privkey");
    }
    const encryptionKey = (0, phrase_1.secureRandomPhrase)().join(" "), trustedRoot = state.trustedRoot, { pubkey, privkey, encryptedPrivkey } = await (0, proxy_1.generateKeys)({
        encryptionKey,
    }), [signedPubkey, signedTrustedRoot] = await Promise.all([
        (0, proxy_1.signPublicKey)({
            privkey: auth.privkey,
            pubkey,
        }),
        (0, proxy_1.signJson)({
            data: trustedRoot,
            privkey,
        }),
    ]), envParams = await (0, envs_1.encryptedKeyParamsForDeviceOrInvitee)({
        state,
        privkey: auth.privkey,
        pubkey: pubkey,
        userId: auth.userId,
        context,
    });
    return [
        Object.assign(Object.assign({}, envParams), { recoveryKey: {
                identityHash: getIdentityHash({
                    hostUrl: auth.hostUrl,
                    encryptionKey,
                }),
                pubkey: signedPubkey,
                encryptedPrivkey: encryptedPrivkey,
            }, signedTrustedRoot: { data: signedTrustedRoot } }),
        encryptionKey,
    ];
};
const getIdentityHash = (params) => {
    return (0, utils_1.sha256)(JSON.stringify(params));
};
//# sourceMappingURL=recovery_keys.js.map