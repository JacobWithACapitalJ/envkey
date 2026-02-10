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
const pick_1 = require("@envkey/core/lib/utils/pick");
const R = __importStar(require("ramda"));
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const utils_1 = require("@envkey/core/lib/crypto/utils");
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const client_1 = require("@envkey/core/lib/client");
const graph_1 = require("@envkey/core/lib/graph");
const status_1 = require("../lib/status");
const client_2 = require("@envkey/core/lib/client");
const getCreateKeyableParentHandler = (keyableParentType) => async (state, { payload }, { context, dispatchSuccess, dispatchFailure }) => {
    var _a, _b;
    const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
    if (!auth) {
        throw new Error("Authentication required.");
    }
    const apiPayload = R.omit(["skipGenerateKey", "v1EnvkeyIdPart", "v1EncryptionKey", "v1Payload"], payload);
    const apiRes = await (0, handler_1.dispatch)({
        type: keyableParentType == "server"
            ? types_1.Api.ActionType.CREATE_SERVER
            : types_1.Api.ActionType.CREATE_LOCAL_KEY,
        payload: apiPayload,
    }, context);
    if (apiRes.success) {
        if (payload.skipGenerateKey) {
            return dispatchSuccess(null, context);
        }
        const created = keyableParentType == "server"
            ? R.find(R.propEq("createdAt", apiRes.state.graphUpdatedAt), (_a = (0, graph_1.getServersByEnvironmentId)(apiRes.state.graph)[payload.environmentId]) !== null && _a !== void 0 ? _a : [])
            : R.find(R.propEq("createdAt", apiRes.state.graphUpdatedAt), (_b = (0, graph_1.getLocalKeysByEnvironmentId)(apiRes.state.graph)[payload.environmentId]) !== null && _b !== void 0 ? _b : []);
        const generateKeyRes = await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.GENERATE_KEY,
            payload: {
                appId: payload.appId,
                keyableParentType: created.type,
                keyableParentId: created.id,
                v1Payload: payload.v1Payload,
                v1EnvkeyIdPart: payload.v1EnvkeyIdPart,
                v1EncryptionKey: payload.v1EncryptionKey,
            },
        }, Object.assign(Object.assign({}, context), { skipWaitForSerialAction: true }));
        if (generateKeyRes.success) {
            return dispatchSuccess(null, context);
        }
        else {
            return dispatchFailure(generateKeyRes.resultAction
                .payload, context);
        }
    }
    else {
        return dispatchFailure(apiRes.resultAction
            .payload, context);
    }
};
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CREATE_SERVER,
    serialAction: true,
    stateProducer: (draft, { payload }) => {
        draft.isCreatingServer[payload.environmentId] = true;
        delete draft.createServerErrors[payload.environmentId];
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        const environmentId = rootAction.payload.environmentId;
        draft.createServerErrors[environmentId] = payload;
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        const environmentId = rootAction.payload.environmentId;
        delete draft.isCreatingServer[environmentId];
    },
    handler: getCreateKeyableParentHandler("server"),
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CREATE_LOCAL_KEY,
    serialAction: true,
    stateProducer: (draft, { payload }) => {
        draft.isCreatingLocalKey[payload.environmentId] = true;
        delete draft.createLocalKeyErrors[payload.environmentId];
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        const environmentId = rootAction.payload.environmentId;
        draft.createLocalKeyErrors[environmentId] = payload;
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        const environmentId = rootAction.payload.environmentId;
        delete draft.isCreatingLocalKey[environmentId];
    },
    handler: getCreateKeyableParentHandler("localKey"),
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.GENERATE_KEY,
    serialAction: true,
    stateProducer: (draft, { payload }) => {
        draft.isGeneratingKey[payload.keyableParentId] = true;
        delete draft.generateKeyErrors[payload.keyableParentId];
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        const keyableParentId = rootAction.payload.keyableParentId;
        draft.generateKeyErrors[keyableParentId] = payload;
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        const keyableParentId = rootAction.payload.keyableParentId;
        delete draft.isGeneratingKey[keyableParentId];
    },
    successStateProducer: (draft, { payload }) => {
        draft.generatedEnvkeys[payload.keyableParentId] = payload;
    },
    apiActionCreator: async (payload, state, context) => {
        const currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!currentAuth) {
            throw new Error("Action requires authentication");
        }
        const currentDeviceId = "deviceId" in currentAuth ? currentAuth.deviceId : currentAuth.userId, { pubkey, encryptedPrivkey, envkeyIdPart, signedTrustedRoot, encryptionKey, } = await generateKeyParams(state, context, payload.v1EnvkeyIdPart, payload.v1EncryptionKey), apiParams = Object.assign(Object.assign({}, (0, pick_1.pick)(["appId", "keyableParentId", "keyableParentType", "v1Payload"], payload)), { pubkey,
            encryptedPrivkey,
            envkeyIdPart,
            signedTrustedRoot }), { pubkey: currentUserPubkey } = state.graph[currentDeviceId], currentUserPubkeyId = (0, client_2.getPubkeyHash)(currentUserPubkey);
        (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.ADD_TRUSTED_SESSION_PUBKEY,
            payload: {
                id: (0, client_2.getPubkeyHash)(pubkey),
                trusted: [
                    "generatedEnvkey",
                    pubkey,
                    currentUserPubkeyId,
                ],
            },
        }, context);
        return {
            action: {
                type: types_1.Api.ActionType.GENERATE_KEY,
                payload: apiParams,
            },
            dispatchContext: {
                envkeyIdPart,
                encryptionKey,
                keyableParentId: payload.keyableParentId,
            },
        };
    },
    apiSuccessPayloadCreator: async (apiRes, dispatchContext) => dispatchContext,
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_GENERATED_ENVKEY,
    stateProducer: (draft, { payload: { keyableParentId } }) => {
        delete draft.generatedEnvkeys[keyableParentId];
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_ALL_GENERATED_ENVKEYS,
    stateProducer: (draft) => {
        draft.generatedEnvkeys = {};
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_SERVER,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_LOCAL_KEY,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CHECK_ENVKEY,
    loggableType: "checkEnvkeyAction",
    loggableType2: "authAction",
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.GENERATE_KEY,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    graphProposer: ({ payload }, state, context) => (graphDraft) => {
        const now = Date.now(), auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const proposalId = "generatedEnvkey";
        const keyableParent = graphDraft[payload.keyableParentId];
        graphDraft[proposalId] = Object.assign(Object.assign({ type: "generatedEnvkey", id: proposalId }, (0, pick_1.pick)(["appId", "keyableParentId", "keyableParentType", "pubkey"], payload)), { pubkeyId: (0, client_2.getPubkeyHash)(payload.pubkey), creatorId: auth.userId, creatorDeviceId: "deviceId" in auth ? auth.deviceId : undefined, signedById: "deviceId" in auth ? auth.deviceId : auth.userId, pubkeyUpdatedAt: now, envkeyShort: "", envkeyIdPartHash: "", environmentId: keyableParent.environmentId, createdAt: now, updatedAt: now, blobsUpdatedAt: now });
    },
    encryptedKeysScopeFn: (graph, { payload: { keyableParentId } }) => ({
        keyableParentIds: new Set([keyableParentId]),
    }),
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_SERVER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_LOCAL_KEY, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REVOKE_KEY, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
const generateKeyParams = async (state, context, v1EnvkeyIdPart, v1EncryptionKey) => {
    const currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
    if (!currentAuth || !currentAuth.privkey) {
        throw new Error("Action requires authentication and decrypted privkey");
    }
    if (!state.trustedRoot || R.isEmpty(state.trustedRoot)) {
        throw new Error("Requires trustedRoot");
    }
    const currentUserPrivkey = currentAuth.privkey;
    const envkeyIdPart = v1EnvkeyIdPart !== null && v1EnvkeyIdPart !== void 0 ? v1EnvkeyIdPart : "ek" + (0, utils_1.secureRandomAlphanumeric)(22), encryptionKey = v1EncryptionKey !== null && v1EncryptionKey !== void 0 ? v1EncryptionKey : (0, utils_1.secureRandomAlphanumeric)(22), { pubkey: generatedPubkey, privkey: generatedPrivkey, encryptedPrivkey: generatedEncryptedPrivkey, } = await (0, proxy_1.generateKeys)({
        encryptionKey,
    }), trustedRoot = state.trustedRoot;
    const [signedPubkey, signedTrustedRoot] = await Promise.all([
        (0, proxy_1.signPublicKey)({
            pubkey: generatedPubkey,
            privkey: currentUserPrivkey,
        }),
        (0, proxy_1.signJson)({
            data: trustedRoot,
            privkey: generatedPrivkey,
        }),
    ]);
    return {
        pubkey: signedPubkey,
        encryptedPrivkey: generatedEncryptedPrivkey,
        envkeyIdPart,
        signedTrustedRoot: { data: signedTrustedRoot },
        encryptionKey,
    };
};
//# sourceMappingURL=keyable_parents.js.map