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
const updates_1 = require("./../lib/envs/updates");
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const utils_1 = require("@envkey/core/lib/crypto/utils");
const client_1 = require("@envkey/core/lib/client");
const envs_1 = require("../lib/envs");
const trust_1 = require("../lib/trust");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const state_1 = require("../lib/state");
const status_1 = require("../lib/status");
const logger_1 = require("@envkey/core/lib/utils/logger");
const bs58_1 = require("bs58");
const status_2 = require("@envkey/client-core-process/lib/envs/status");
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.APPROVE_DEVICES,
    serialAction: true,
    stateProducer: (draft, { payload, meta: { tempId } }) => {
        draft.generatingDeviceGrants[tempId] = payload;
        draft.generateDeviceGrantErrors = {};
    },
    failureStateProducer: (draft, { meta: { tempId, rootAction }, payload }) => {
        draft.generateDeviceGrantErrors[tempId] = {
            error: payload,
            payload: rootAction.payload,
        };
    },
    successStateProducer: (draft, { payload }) => {
        draft.generatedDeviceGrants = [...draft.generatedDeviceGrants, ...payload];
    },
    endStateProducer: (draft, { meta: { tempId } }) => {
        delete draft.generatingDeviceGrants[tempId];
        (0, updates_1.clearNonPendingEnvsProducer)(draft);
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        const { payload } = action;
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const trustedRoot = state.trustedRoot, fetchRes = await (0, envs_1.fetchEnvsForUserOrAccessParams)(state, payload.map(({ granteeId }) => ({
            userId: granteeId,
        })), context);
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
            const deviceGrantRes = await Promise.all(payload.map((clientParams) => approveDevice(stateWithFetched, clientParams, trustedRoot, auth, context))), res = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.BULK_GRAPH_ACTION,
                payload: deviceGrantRes.map(([payload]) => ({
                    type: types_1.Api.ActionType.CREATE_DEVICE_GRANT,
                    payload,
                    meta: {
                        loggableType: "orgAction",
                        graphUpdatedAt: stateWithFetched === null || stateWithFetched === void 0 ? void 0 : stateWithFetched.graphUpdatedAt,
                    },
                })),
            }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
            if (res.success) {
                return dispatchSuccess(deviceGrantRes.map(([payload, encryptionKey]) => ({
                    identityHash: payload.identityHash,
                    encryptionKey,
                    granteeId: payload.granteeId,
                    createdAt: res.state.graphUpdatedAt,
                })), context);
            }
            else {
                return dispatchFailure((_a = res.resultAction) === null || _a === void 0 ? void 0 : _a.payload, context);
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
    actionType: types_1.Client.ActionType.CLEAR_GENERATED_DEVICE_GRANTS,
    stateProducer: (draft) => {
        draft.generatedDeviceGrants = [];
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_DEVICE_GRANT,
    stateProducer: (draft) => {
        delete draft.loadedDeviceGrantIdentityHash;
        delete draft.loadedDeviceGrantPrivkey;
        delete draft.loadedDeviceGrant;
        delete draft.loadDeviceGrantError;
        delete draft.loadedDeviceGrantEmailToken;
        delete draft.loadedDeviceGrantOrgId;
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.LOAD_DEVICE_GRANT,
    stateProducer: (draft) => {
        draft.isLoadingDeviceGrant = true;
        delete draft.loadedDeviceGrantIdentityHash;
        delete draft.loadedDeviceGrantEmailToken;
        delete draft.loadedDeviceGrantPrivkey;
        delete draft.loadedDeviceGrant;
        delete draft.loadDeviceGrantError;
        delete draft.loadedDeviceGrantOrgId;
        delete draft.loadedDeviceGrantHostUrl;
    },
    endStateProducer: (draft) => {
        delete draft.isLoadingDeviceGrant;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.loadDeviceGrantError = payload;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        delete draft.signedTrustedRoot;
        delete draft.trustedRoot;
        draft.trustedSessionPubkeys = {};
        delete draft.loadedDeviceGrant;
    },
    successStateProducer: (draft, action) => {
        (0, envs_1.decryptedEnvsStateProducer)(draft, action);
        draft.loadedDeviceGrantIdentityHash =
            action.payload.loadedDeviceGrantIdentityHash;
        draft.loadedDeviceGrantPrivkey = action.payload.loadedDeviceGrantPrivkey;
        draft.loadedDeviceGrantEmailToken =
            action.payload.loadedDeviceGrantEmailToken;
        draft.loadedDeviceGrantHostUrl = action.payload.loadedDeviceGrantHostUrl;
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b, _c, _d, _e, _f;
        let state = initialState;
        const { type, payload } = action, [identityHash, encryptionKey] = payload.encryptionToken.split("_"), hostUrl = tweetnacl_util_1.default.encodeUTF8((0, bs58_1.decode)(payload.emailToken.split("_")[2])), apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.LOAD_DEVICE_GRANT,
            payload: {},
        }, Object.assign(Object.assign({}, context), { hostUrl, rootClientAction: action, auth: {
                type: "loadDeviceGrantAuthParams",
                identityHash,
                emailToken: payload.emailToken,
            } }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        if (!apiRes.success) {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        state = apiRes.state;
        const apiPayload = apiRes.resultAction.payload;
        if (apiPayload.type == "requiresExternalAuthError") {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        // decrypt deviceGrant privkey, verify deviceGrant
        const grantedBy = apiPayload.graph[apiPayload.deviceGrant.grantedByUserId], grantedByDevice = grantedBy.type == "orgUser"
            ? apiPayload.graph[apiPayload.deviceGrant.grantedByDeviceId]
            : undefined, grantee = apiPayload.graph[apiPayload.deviceGrant.granteeId], serverIdentityHash = getIdentityHash({
            deviceGrantedBy: {
                type: grantedBy.type == "cliUser" ? "cliUser" : "orgUser",
                id: apiPayload.deviceGrant.grantedByUserId,
                pubkey: grantedBy.type == "cliUser"
                    ? grantedBy.pubkey
                    : grantedByDevice.pubkey,
                email: grantedBy.type == "orgUser" ? grantedBy.email : undefined,
            },
            grantee: { email: grantee.email },
            host: hostUrl,
            encryptionKey,
        });
        if (identityHash !== serverIdentityHash) {
            (0, logger_1.log)("Identity hash mismatch", {
                identityHash,
                serverIdentityHash,
                hostUrl,
                emailToken: payload.emailToken,
            });
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "IdentityHashMismatchError",
                    message: "DeviceGrant integrity check failed",
                },
            }, context);
        }
        const apiSuccessContext = Object.assign(Object.assign({}, context), { hostUrl, accountIdOrCliKey: apiPayload.deviceGrant.granteeId });
        try {
            const deviceGrantPrivkey = await (0, proxy_1.decryptPrivateKey)({
                encryptedPrivkey: apiPayload.deviceGrant.encryptedPrivkey,
                encryptionKey,
            });
            const [_, verifyTrustedRes] = await Promise.all([
                (0, trust_1.verifyKeypair)(apiPayload.deviceGrant.pubkey, deviceGrantPrivkey),
                (0, trust_1.verifySignedTrustedRootPubkey)(state, apiPayload.deviceGrant.pubkey, apiSuccessContext),
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
                (0, envs_1.decryptEnvs)(state, (_c = apiPayload.envs.keys) !== null && _c !== void 0 ? _c : {}, (_d = apiPayload.envs.blobs) !== null && _d !== void 0 ? _d : {}, deviceGrantPrivkey, apiSuccessContext, true),
                (0, envs_1.decryptChangesets)(state, (_e = apiPayload.changesets.keys) !== null && _e !== void 0 ? _e : {}, (_f = apiPayload.changesets.blobs) !== null && _f !== void 0 ? _f : {}, deviceGrantPrivkey, apiSuccessContext, true),
            ]);
            await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
                payload: undefined,
            }, context);
            return dispatchSuccess({
                envs: decryptedEnvs,
                changesets: decryptedChangesets,
                loadedDeviceGrantIdentityHash: identityHash,
                loadedDeviceGrantPrivkey: deviceGrantPrivkey,
                loadedDeviceGrantEmailToken: payload.emailToken,
                loadedDeviceGrantHostUrl: hostUrl,
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
        (0, status_2.updateLocalSocketEnvActionStatusIfNeeded)(state, context);
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.LOAD_DEVICE_GRANT,
    skipProcessRootPubkeyReplacements: true,
    skipReencryptPermitted: true,
    authenticated: true,
    loggableType: "fetchMetaAction",
    loggableType2: "authAction",
    successAccountIdFn: (payload) => payload.type == "loadedDeviceGrant"
        ? payload.deviceGrant.granteeId
        : undefined,
    successStateProducer: (draft, { payload }) => {
        if (payload.type == "loadedDeviceGrant") {
            draft.graph = payload.graph;
            draft.graphUpdatedAt = payload.graphUpdatedAt;
            draft.signedTrustedRoot = payload.signedTrustedRoot;
            draft.loadedDeviceGrant = payload.deviceGrant;
            draft.loadedDeviceGrantOrgId = payload.orgId;
        }
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.ACCEPT_DEVICE_GRANT,
    verifyCurrentUser: true,
    stateProducer: (draft, action) => {
        draft.isAcceptingDeviceGrant = true;
    },
    successStateProducer: (draft) => {
        draft.didAcceptDeviceGrant = true;
    },
    endStateProducer: (draft) => {
        delete draft.isAcceptingDeviceGrant;
        delete draft.loadedDeviceGrant;
        delete draft.loadedDeviceGrantIdentityHash;
        delete draft.loadedDeviceGrantPrivkey;
        delete draft.loadedDeviceGrantOrgId;
        delete draft.loadedDeviceGrantEmailToken;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.acceptDeviceGrantError = payload;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        delete draft.trustedRoot;
        delete draft.signedTrustedRoot;
        draft.trustedSessionPubkeys = {};
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        const { type, payload } = action;
        if (!(state.loadedDeviceGrant &&
            state.loadedDeviceGrantIdentityHash &&
            state.loadedDeviceGrantEmailToken &&
            state.loadedDeviceGrantPrivkey &&
            state.loadedDeviceGrantOrgId &&
            state.loadedDeviceGrantHostUrl) ||
            state.loadDeviceGrantError) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "DeviceGrantNotLoaded",
                    message: "DeviceGrant not loaded",
                },
            }, context);
        }
        const apiSuccessContext = Object.assign(Object.assign({}, context), { accountIdOrCliKey: state.loadedDeviceGrant.granteeId, hostUrl: state.loadedDeviceGrantHostUrl });
        const { pubkey, privkey } = await (0, proxy_1.generateKeys)(), signedPubkey = await (0, proxy_1.signPublicKey)({
            privkey: state.loadedDeviceGrantPrivkey,
            pubkey,
        }), trustedRoot = state.trustedRoot, [envParams, signedTrustedRoot] = await Promise.all([
            (0, envs_1.encryptedKeyParamsForDeviceOrInvitee)({
                state,
                privkey,
                pubkey: signedPubkey,
                userId: state.loadedDeviceGrant.granteeId,
                context,
            }),
            (0, proxy_1.signJson)({ data: trustedRoot, privkey }),
        ]);
        const authProps = {
            type: "acceptDeviceGrantAuthParams",
            identityHash: state.loadedDeviceGrantIdentityHash,
            emailToken: state.loadedDeviceGrantEmailToken,
        }, apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.ACCEPT_DEVICE_GRANT,
            payload: Object.assign(Object.assign({}, envParams), { device: {
                    name: payload.deviceName,
                    signedTrustedRoot: { data: signedTrustedRoot },
                    pubkey: signedPubkey,
                } }),
        }, Object.assign(Object.assign({}, apiSuccessContext), { rootClientAction: action, dispatchContext: { privkey, hostUrl: state.loadedDeviceGrantHostUrl }, auth: Object.assign(Object.assign({}, authProps), { signature: tweetnacl_util_1.default.encodeBase64(tweetnacl_1.default.sign.detached(tweetnacl_util_1.default.decodeUTF8(JSON.stringify(R.props(["identityHash", "emailToken"], authProps))), tweetnacl_util_1.default.decodeBase64(state.loadedDeviceGrantPrivkey.keys.signingKey))) }) }));
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
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.FORGET_DEVICE,
    serialAction: true,
    successStateProducer: (draft, { meta: { rootAction: { payload: { accountId }, }, }, }) => {
        let defaultAccountId = draft.defaultAccountId === accountId ? undefined : draft.defaultAccountId;
        const orgUserAccounts = R.omit([accountId], draft.orgUserAccounts), remainingAccounts = Object.values(orgUserAccounts);
        if (remainingAccounts.length == 1) {
            defaultAccountId = remainingAccounts[0].userId;
        }
        return Object.assign(Object.assign(Object.assign(Object.assign({}, draft), types_1.Client.defaultAccountState), types_1.Client.defaultClientState), { orgUserAccounts,
            defaultAccountId });
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        const auth = (0, client_1.getAuth)(state, action.payload.accountId);
        if (auth && auth.token) {
            // try to revoke device from server
            // if we can't, still clear it from device
            try {
                await (0, handler_1.dispatch)({
                    type: types_1.Api.ActionType.FORGET_DEVICE,
                    payload: {},
                }, Object.assign(Object.assign({}, context), { rootClientAction: action, accountIdOrCliKey: action.payload.accountId }));
            }
            catch (err) { }
        }
        return dispatchSuccess(null, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_AUTH,
    stateProducer: (draft, { payload }) => {
        draft.orgUserAccounts[payload.userId] = payload;
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.ACCEPT_DEVICE_GRANT,
    loggableType: "orgAction",
    loggableType2: "authAction",
    authenticated: true,
    graphAction: true,
    skipReencryptPermitted: true,
    successAccountIdFn: (payload) => payload.userId,
    successStateProducer: state_1.newAccountStateProducer,
    refreshActionCreator: (requestAction) => {
        return {
            type: types_1.Client.ActionType.LOAD_DEVICE_GRANT,
            payload: requestAction.payload,
        };
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.FORGET_DEVICE,
    loggableType: "authAction",
    loggableType2: "orgAction",
    authenticated: true,
    skipReencryptPermitted: true,
    skipProcessRootPubkeyReplacements: true,
    skipProcessRevocationRequests: true,
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REVOKE_DEVICE, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REVOKE_DEVICE_GRANT, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
const approveDevice = async (state, clientParams, trustedRoot, auth, context) => {
    if (!auth.privkey) {
        throw new Error("Action requires decrypted privkey");
    }
    let currentUserPubkey;
    if (auth.type == "clientUserAuth") {
        currentUserPubkey = state.graph[auth.deviceId]
            .pubkey;
    }
    else {
        currentUserPubkey = state.graph[auth.userId].pubkey;
    }
    const encryptionKey = (0, utils_1.secureRandomAlphanumeric)(22), { pubkey: deviceGrantPubkey, privkey: deviceGrantPrivkey, encryptedPrivkey: encryptedDeviceGrantPrivkey, } = await (0, proxy_1.generateKeys)({ encryptionKey }), [signedDeviceGrantPubkey, signedTrustedRoot] = await Promise.all([
        (0, proxy_1.signPublicKey)({
            privkey: auth.privkey,
            pubkey: deviceGrantPubkey,
        }),
        (0, proxy_1.signJson)({
            data: trustedRoot,
            privkey: deviceGrantPrivkey,
        }),
    ]), granteeOrgUser = state.graph[clientParams.granteeId], identityHash = getIdentityHash({
        deviceGrantedBy: {
            type: auth.type == "clientUserAuth" ? "orgUser" : "cliUser",
            id: auth.userId,
            pubkey: currentUserPubkey,
            email: "email" in auth ? auth.email : undefined,
        },
        grantee: {
            email: granteeOrgUser.email,
        },
        host: auth.hostUrl,
        encryptionKey,
    }), envParams = await (0, envs_1.encryptedKeyParamsForDeviceOrInvitee)({
        state,
        privkey: auth.privkey,
        pubkey: deviceGrantPubkey,
        userId: clientParams.granteeId,
        context,
    });
    return [
        Object.assign(Object.assign({}, envParams), { identityHash, pubkey: signedDeviceGrantPubkey, encryptedPrivkey: encryptedDeviceGrantPrivkey, signedTrustedRoot: { data: signedTrustedRoot }, granteeId: clientParams.granteeId }),
        encryptionKey,
    ];
}, getIdentityHash = (params) => {
    return (0, utils_1.sha256)(JSON.stringify(params));
};
//# sourceMappingURL=devices.js.map