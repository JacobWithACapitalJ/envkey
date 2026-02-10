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
const env_1 = require("@envkey/client-shared/src/env");
const updates_1 = require("./../lib/envs/updates");
const trust_1 = require("../lib/trust");
const state_1 = require("../lib/state");
const pick_1 = require("@envkey/core/lib/utils/pick");
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const utils_1 = require("@envkey/core/lib/crypto/utils");
const client_1 = require("@envkey/core/lib/client");
const graph_1 = require("@envkey/core/lib/graph");
const envs_1 = require("../lib/envs");
const trust_2 = require("../lib/trust");
const status_1 = require("../lib/status");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const bs58_1 = require("bs58");
const envs_2 = require("../lib/envs");
const logger_1 = require("@envkey/core/lib/utils/logger");
const status_2 = require("@envkey/client-core-process/lib/envs/status");
const proc_status_worker_1 = require("@envkey/client-core-process/proc_status_worker");
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.INVITE_USERS,
    serialAction: true,
    stateProducer: (draft, { payload, meta: { tempId } }) => {
        draft.generatingInvites[tempId] = payload;
        draft.generateInviteErrors = {};
    },
    failureStateProducer: (draft, { meta: { tempId, rootAction }, payload }) => {
        draft.generateInviteErrors[tempId] = {
            error: payload,
            payload: rootAction.payload,
        };
        (0, updates_1.clearNonPendingEnvsProducer)(draft);
    },
    successStateProducer: (draft, { payload }) => {
        draft.generatedInvites = [...draft.generatedInvites, ...payload];
        draft.pendingInvites = [];
        // non pending envs are cleared in successHandler, not here
    },
    endStateProducer: (draft, { meta: { tempId } }) => {
        delete draft.generatingInvites[tempId];
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        const { payload } = action;
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const fetchRes = await (0, envs_1.fetchEnvsForUserOrAccessParams)(state, payload.map(({ appUserGrants, user: { orgRoleId } }) => ({
            accessParams: { appUserGrants, orgRoleId },
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
            const inviteRes = await Promise.all(payload.map((clientParams) => inviteUser(stateWithFetched, clientParams, auth, context))), res = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.BULK_GRAPH_ACTION,
                payload: inviteRes.map(([payload]) => {
                    return {
                        type: types_1.Api.ActionType.CREATE_INVITE,
                        payload,
                        meta: {
                            loggableType: "orgAction",
                            graphUpdatedAt: stateWithFetched === null || stateWithFetched === void 0 ? void 0 : stateWithFetched.graphUpdatedAt,
                        },
                    };
                }),
            }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
            if (res.success && res.retriedWithUpdatedGraph) {
                return res;
            }
            if (res.success) {
                const { orgUsers } = (0, graph_1.graphTypes)(res.state.graph), orgUsersByUid = R.indexBy(R.prop("uid"), orgUsers);
                return dispatchSuccess(inviteRes.map(([payload, encryptionKey]) => (Object.assign(Object.assign({}, (0, pick_1.pick)(["appUserGrants", "identityHash"], payload)), { user: Object.assign(Object.assign({}, payload.user), { id: orgUsersByUid[payload.user.uid].id }), encryptionKey }))), context);
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
    successHandler: async (state, action, res, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await (0, envs_2.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
        await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.CLEAR_CACHED }, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_GENERATED_INVITES,
    stateProducer: (draft) => {
        draft.generatedInvites = [];
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_INVITE,
    stateProducer: (draft) => {
        delete draft.loadedInviteIdentityHash;
        delete draft.loadedInvitePrivkey;
        delete draft.loadedInvite;
        delete draft.loadInviteError;
        delete draft.loadedInviteEmailToken;
        delete draft.loadedInviteOrgId;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.ADD_PENDING_INVITE,
    stateProducer: (draft, { payload }) => {
        draft.pendingInvites.push(payload);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.UPDATE_PENDING_INVITE,
    stateProducer: (draft, { payload }) => {
        draft.pendingInvites[payload.index] = payload.pending;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.REMOVE_PENDING_INVITE,
    stateProducer: (draft, { payload }) => {
        draft.pendingInvites.splice(payload, 1);
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.LOAD_INVITE,
    stateProducer: (draft, { payload }) => {
        draft.isLoadingInvite = true;
        delete draft.loadedInviteIdentityHash;
        delete draft.loadedInvitePrivkey;
        delete draft.loadedInvite;
        delete draft.loadInviteError;
        delete draft.loadedInviteEmailToken;
        delete draft.loadedInviteOrgId;
        if (payload.isV1Upgrade) {
            draft.v1UpgradeStatus = "upgrading";
        }
    },
    endStateProducer: (draft) => {
        delete draft.isLoadingInvite;
    },
    failureStateProducer: (draft, { payload, meta }) => {
        draft.loadInviteError = payload;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        delete draft.signedTrustedRoot;
        delete draft.trustedRoot;
        draft.trustedSessionPubkeys = {};
        delete draft.loadedInvite;
        if (meta.rootAction.payload.isV1Upgrade) {
            draft.v1UpgradeStatus = "error";
        }
    },
    successStateProducer: (draft, action) => {
        (0, envs_1.decryptedEnvsStateProducer)(draft, action);
        draft.loadedInviteIdentityHash = action.payload.loadedInviteIdentityHash;
        draft.loadedInvitePrivkey = action.payload.loadedInvitePrivkey;
        draft.loadedInviteEmailToken = action.payload.loadedInviteEmailToken;
        draft.loadedInviteHostUrl = action.payload.loadedInviteHostUrl;
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b, _c, _d, _e, _f;
        let state = initialState;
        const { payload } = action;
        const [identityHash, encryptionKey] = payload.encryptionToken.split("_");
        const isUpgradeToken = !payload.emailToken.startsWith("i_");
        const hostUrl = isUpgradeToken
            ? (0, env_1.getDefaultApiHostUrl)()
            : tweetnacl_util_1.default.encodeUTF8((0, bs58_1.decode)(payload.emailToken.split("_")[2])), apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.LOAD_INVITE,
            payload: {},
        }, Object.assign(Object.assign({}, context), { hostUrl, rootClientAction: action, auth: {
                type: "loadInviteAuthParams",
                identityHash,
                // this email token may include a hostname as a third segment after underscore
                emailToken: payload.emailToken,
            } }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        if (!apiRes.success) {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        const apiPayload = apiRes.resultAction.payload;
        if (apiPayload.type == "requiresExternalAuthError") {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        // decrypt invite privkey, verify invite
        const invitedBy = apiPayload.graph[apiPayload.invite.invitedByUserId], invitee = apiPayload.graph[apiPayload.invite.inviteeId], invitedByDevice = invitedBy.type == "orgUser"
            ? apiPayload.graph[apiPayload.invite.invitedByDeviceId]
            : undefined, serverIdentityHash = getIdentityHash({
            invitedBy: {
                type: invitedBy.type == "cliUser" ? "cliUser" : "orgUser",
                id: apiPayload.invite.invitedByUserId,
                pubkey: invitedBy.type == "cliUser"
                    ? invitedBy.pubkey
                    : invitedByDevice.pubkey,
                email: invitedBy.type == "orgUser" ? invitedBy.email : undefined,
            },
            invitee: { email: invitee.email },
            host: hostUrl,
            encryptionKey,
        });
        if (identityHash !== serverIdentityHash) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "InviteIntegrityError",
                    message: "Invite integrity check failed",
                },
            }, context);
        }
        const apiSuccessContext = Object.assign(Object.assign({}, context), { hostUrl, accountIdOrCliKey: apiPayload.invite.inviteeId });
        let invitePrivkey;
        try {
            invitePrivkey = await (0, proxy_1.decryptPrivateKey)({
                encryptedPrivkey: apiPayload.invite.encryptedPrivkey,
                encryptionKey,
            });
        }
        catch (err) {
            (0, logger_1.log)("Invite decryption error", { err });
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "InviteDecryptionError",
                    message: "Invite keypair decryption failed",
                },
            }, context);
        }
        try {
            const [_, verifyTrustedRes] = await Promise.all([
                (0, trust_2.verifyKeypair)(apiPayload.invite.pubkey, invitePrivkey).catch((err) => {
                    (0, logger_1.log)("Error verifying keypair", { err });
                    throw err;
                }),
                (0, trust_2.verifySignedTrustedRootPubkey)(apiRes.state, apiPayload.invite.pubkey, apiSuccessContext).catch((err) => {
                    (0, logger_1.log)("Error verifying signed trusted root pubkey", { err });
                    throw err;
                }),
            ]);
            state = verifyTrustedRes.state;
        }
        catch (err) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "InviteVerificationError",
                    message: "Invite verification failed",
                },
            }, context);
        }
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
        try {
            const [decryptedEnvs, decryptedChangesets] = await Promise.all([
                (0, envs_1.decryptEnvs)(state, (_c = apiPayload.envs.keys) !== null && _c !== void 0 ? _c : {}, (_d = apiPayload.envs.blobs) !== null && _d !== void 0 ? _d : {}, invitePrivkey, apiSuccessContext, true).catch((err) => {
                    (0, logger_1.log)("Error decrypting envs", { err });
                    throw err;
                }),
                (0, envs_1.decryptChangesets)(state, (_e = apiPayload.changesets.keys) !== null && _e !== void 0 ? _e : {}, (_f = apiPayload.changesets.blobs) !== null && _f !== void 0 ? _f : {}, invitePrivkey, apiSuccessContext, true).catch((err) => {
                    (0, logger_1.log)("Error decrypting changesets", { err });
                    throw err;
                }),
            ]);
            await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
                payload: undefined,
            }, context);
            return dispatchSuccess({
                envs: decryptedEnvs,
                changesets: decryptedChangesets,
                loadedInviteIdentityHash: identityHash,
                loadedInvitePrivkey: invitePrivkey,
                loadedInviteEmailToken: payload.emailToken,
                loadedInviteHostUrl: hostUrl,
                timestamp: apiRes.resultAction.payload.timestamp,
            }, apiSuccessContext);
        }
        catch (err) {
            (0, logger_1.log)("Error decrypting envs/changesets", { err });
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "InviteEnvsDecryptionError",
                    message: "Invite envs decryption failed",
                },
            }, context);
        }
    },
    successHandler: async (state, action, payload, context) => {
        (0, status_2.updateLocalSocketEnvActionStatusIfNeeded)(state, context);
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.LOAD_INVITE,
    authenticated: true,
    skipProcessRootPubkeyReplacements: true,
    skipReencryptPermitted: true,
    loggableType: "fetchMetaAction",
    loggableType2: "authAction",
    successAccountIdFn: (payload) => payload.type == "loadedInvite" ? payload.invite.inviteeId : undefined,
    successStateProducer: (draft, { payload }) => {
        if (payload.type == "loadedInvite") {
            draft.graph = payload.graph;
            draft.graphUpdatedAt = payload.graphUpdatedAt;
            draft.signedTrustedRoot = payload.signedTrustedRoot;
            draft.loadedInvite = payload.invite;
            draft.loadedInviteOrgId = payload.orgId;
        }
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.ACCEPT_INVITE,
    verifyCurrentUser: true,
    stateProducer: (draft) => {
        draft.isAcceptingInvite = true;
    },
    successStateProducer: (draft, { payload, meta }) => {
        draft.didAcceptInvite = true;
        if (meta.rootAction.payload.isV1Upgrade) {
            draft.v1UpgradeStatus = "finished";
            draft.v1UpgradeAcceptedInvite = true;
        }
    },
    endStateProducer: (draft) => {
        delete draft.isAcceptingInvite;
        delete draft.loadedInvite;
        delete draft.loadedInviteIdentityHash;
        delete draft.loadedInvitePrivkey;
        delete draft.loadedInviteOrgId;
        delete draft.loadedInviteEmailToken;
        delete draft.loadedInviteHostUrl;
    },
    failureStateProducer: (draft, { payload, meta }) => {
        draft.acceptInviteError = payload;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        delete draft.trustedRoot;
        delete draft.signedTrustedRoot;
        draft.trustedSessionPubkeys = {};
        if (meta.rootAction.payload.isV1Upgrade) {
            draft.v1UpgradeStatus = "error";
        }
    },
    successHandler: async (state, action, payload, context) => {
        if (state.v1UpgradeStatus && state.v1UpgradeAcceptedInvite) {
            (0, proc_status_worker_1.sendMainToWorkerMessage)({
                type: "v1UpgradeStatus",
                v1UpgradeStatus: state.v1UpgradeStatus,
            });
        }
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        const { payload } = action;
        if (!(state.loadedInvite &&
            state.loadedInviteIdentityHash &&
            state.loadedInvitePrivkey &&
            state.loadedInviteOrgId &&
            state.loadedInviteHostUrl &&
            state.loadedInviteEmailToken) ||
            state.loadInviteError) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "InviteNotLoaded",
                    message: "Invite not loaded",
                },
            }, context);
        }
        const org = state.graph[state.loadedInviteOrgId];
        const apiSuccessContext = Object.assign(Object.assign({}, context), { hostUrl: state.loadedInviteHostUrl, accountIdOrCliKey: state.loadedInvite.inviteeId }), { pubkey, privkey } = await (0, proxy_1.generateKeys)(), signedPubkey = await (0, proxy_1.signPublicKey)({
            privkey: state.loadedInvitePrivkey,
            pubkey,
        }), trustedRoot = state.trustedRoot;
        const [envParams, signedTrustedRoot] = await Promise.all([
            (0, envs_1.encryptedKeyParamsForDeviceOrInvitee)({
                state,
                privkey,
                pubkey: signedPubkey,
                userId: state.loadedInvite.inviteeId,
                context,
            }),
            (0, proxy_1.signJson)({ data: trustedRoot, privkey }),
        ]);
        const authProps = {
            type: "acceptInviteAuthParams",
            identityHash: state.loadedInviteIdentityHash,
            emailToken: state.loadedInviteEmailToken,
        }, apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.ACCEPT_INVITE,
            payload: Object.assign(Object.assign({}, envParams), { device: {
                    name: payload.deviceName,
                    signedTrustedRoot: { data: signedTrustedRoot },
                    pubkey: signedPubkey,
                } }),
        }, Object.assign(Object.assign({}, apiSuccessContext), { rootClientAction: action, dispatchContext: {
                privkey,
                hostUrl: state.loadedInviteHostUrl,
            }, auth: Object.assign(Object.assign({}, authProps), { signature: tweetnacl_util_1.default.encodeBase64(tweetnacl_1.default.sign.detached(tweetnacl_util_1.default.decodeUTF8(JSON.stringify(R.props(["identityHash", "emailToken"], authProps))), tweetnacl_util_1.default.decodeBase64(state.loadedInvitePrivkey.keys.signingKey))) }) }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        if (apiRes.success) {
            await (0, trust_1.verifyCurrentUser)(apiRes.state, apiSuccessContext);
            if (action.payload.isV1Upgrade) {
                await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.RESET_V1_UPGRADE, payload: {} }, apiSuccessContext);
            }
            return dispatchSuccess(null, context);
        }
        else {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.ACCEPT_INVITE,
    loggableType: "orgAction",
    loggableType2: "authAction",
    authenticated: true,
    graphAction: true,
    skipReencryptPermitted: true,
    successAccountIdFn: (payload) => payload.userId,
    successStateProducer: state_1.newAccountStateProducer,
    refreshActionCreator: (requestAction) => {
        return {
            type: types_1.Client.ActionType.LOAD_INVITE,
            payload: requestAction.payload,
        };
    },
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REVOKE_INVITE, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
const inviteUser = async (initialState, clientParams, auth, context) => {
    if (!auth.privkey) {
        throw new Error("Action requires decrypted privkey");
    }
    let state = initialState;
    let currentUserPubkey;
    if (auth.type == "clientUserAuth") {
        currentUserPubkey = state.graph[auth.deviceId]
            .pubkey;
    }
    else {
        currentUserPubkey = state.graph[auth.userId].pubkey;
    }
    const encryptionKey = (0, utils_1.secureRandomAlphanumeric)(22), trustedRoot = state.trustedRoot, { pubkey: invitePubkey, privkey: invitePrivkey, encryptedPrivkey: encryptedInvitePrivkey, } = await (0, proxy_1.generateKeys)({ encryptionKey }), [signedInvitePubkey, signedTrustedRoot] = await Promise.all([
        (0, proxy_1.signPublicKey)({
            privkey: auth.privkey,
            pubkey: invitePubkey,
        }),
        (0, proxy_1.signJson)({
            data: trustedRoot,
            privkey: invitePrivkey,
        }),
    ]), identityHash = getIdentityHash({
        invitedBy: {
            type: auth.type == "clientUserAuth" ? "orgUser" : "cliUser",
            id: auth.userId,
            pubkey: currentUserPubkey,
            email: "email" in auth ? auth.email : undefined,
        },
        invitee: {
            email: clientParams.user.email,
        },
        host: auth.hostUrl,
        encryptionKey,
    }), accessParams = {
        orgRoleId: clientParams.user.orgRoleId,
        appUserGrants: clientParams.appUserGrants,
        userGroupIds: clientParams.userGroupIds,
    }, envParams = await (0, envs_1.encryptedKeyParamsForDeviceOrInvitee)({
        state,
        privkey: auth.privkey,
        pubkey: invitePubkey,
        accessParams,
        context,
    });
    return [
        Object.assign(Object.assign({}, envParams), { identityHash, pubkey: signedInvitePubkey, encryptedPrivkey: encryptedInvitePrivkey, signedTrustedRoot: { data: signedTrustedRoot }, user: clientParams.user, scim: clientParams.scim, appUserGrants: clientParams.appUserGrants, userGroupIds: clientParams.userGroupIds, v1Token: clientParams.v1Token }),
        encryptionKey,
    ];
}, getIdentityHash = (params) => {
    const json = JSON.stringify(params), hash = (0, utils_1.sha256)(json);
    return hash;
};
//# sourceMappingURL=invites.js.map