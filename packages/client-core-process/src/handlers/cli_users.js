"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("@envkey/client-shared/src/env");
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const client_1 = require("@envkey/core/lib/client");
const trust_1 = require("../lib/trust");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const utils_1 = require("@envkey/core/lib/crypto/utils");
const envs_1 = require("../lib/envs");
const status_1 = require("../lib/status");
const envs_2 = require("../lib/envs");
const logger_1 = require("@envkey/core/lib/utils/logger");
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CREATE_CLI_USER,
    serialAction: true,
    stateProducer: (draft, { payload, meta: { tempId } }) => {
        draft.generatingCliUsers[tempId] = payload;
        draft.generateCliUserErrors = {};
    },
    failureStateProducer: (draft, { meta: { tempId, rootAction }, payload }) => {
        draft.generateCliUserErrors[tempId] = {
            error: payload,
            payload: rootAction.payload,
        };
    },
    successStateProducer: (draft, { payload }) => {
        draft.generatedCliUsers.push(payload);
    },
    endStateProducer: (draft, { meta: { tempId } }) => {
        delete draft.generatingCliUsers[tempId];
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        const { payload } = action;
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const fetchRes = await (0, envs_1.fetchEnvsForUserOrAccessParams)(state, [
            {
                accessParams: payload,
            },
        ], context);
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
            const [apiParams, cliKey] = await createCliUser(stateWithFetched, payload, auth, context), apiRes = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.CREATE_CLI_USER,
                payload: apiParams,
            }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
            if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
                return apiRes;
            }
            if (apiRes.success) {
                return dispatchSuccess({
                    user: { name: payload.name, orgRoleId: payload.orgRoleId },
                    appUserGrants: payload.appUserGrants,
                    cliKey,
                }, context);
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
    actionType: types_1.Client.ActionType.CLEAR_GENERATED_CLI_USERS,
    stateProducer: (draft) => {
        draft.generatedCliUsers = [];
    },
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RENAME_CLI_USER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.renameObjectProducers));
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.AUTHENTICATE_CLI_KEY,
    verifyCurrentUser: true,
    stateProducer: (draft) => {
        draft.isAuthenticatingCliKey = true;
        delete draft.authenticateCliKeyError;
    },
    successStateProducer: (draft, { payload, meta: { rootAction: { payload: { cliKey }, }, }, }) => {
        draft.cliKeyAccounts[(0, utils_1.sha256)(cliKey)] = payload;
    },
    failureStateProducer: (draft, { payload }) => {
        delete draft.signedTrustedRoot;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        draft.authenticateCliKeyError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.isAuthenticatingCliKey;
    },
    successHandler: async (state, action, res, context) => {
        (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.CLEAR_ORPHANED_BLOBS,
        }, context);
    },
    handler: async (state, action, { context: initialContext, dispatchSuccess, dispatchFailure }) => {
        var _a, _b;
        const { payload } = action;
        const cliKeyParts = payload.cliKey.split("-"), cliKeyIdPart = cliKeyParts[0], encryptionKey = cliKeyParts[1], 
        // host may have dashes
        hostUrl = cliKeyParts[2] ? cliKeyParts.slice(2).join("-") : undefined, context = Object.assign(Object.assign({}, initialContext), { hostUrl, accountIdOrCliKey: payload.cliKey }), apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.AUTHENTICATE_CLI_KEY,
            payload: { cliKeyIdPart },
        }, Object.assign(Object.assign({}, context), { hostUrl, rootClientAction: action }));
        if (apiRes.success && apiRes.retriedWithUpdatedGraph) {
            return apiRes;
        }
        if (!apiRes.success) {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        const apiPayload = apiRes.resultAction.payload;
        try {
            const privkey = await (0, proxy_1.decryptPrivateKey)({
                encryptedPrivkey: apiPayload.encryptedPrivkey,
                encryptionKey,
            }), cliUser = apiPayload.graph[apiPayload.userId];
            await Promise.all([
                (0, trust_1.verifyKeypair)(cliUser.pubkey, privkey),
                (0, trust_1.verifySignedTrustedRootPubkey)(apiRes.state, cliUser.pubkey, context),
            ]);
            return dispatchSuccess(Object.assign({ type: "clientCliAuth", userId: cliUser.id, orgId: apiPayload.orgId, privkey, hostUrl: hostUrl !== null && hostUrl !== void 0 ? hostUrl : (0, env_1.getDefaultApiHostUrl)(), lastAuthAt: apiPayload.timestamp, addedAt: (_b = (_a = state.cliKeyAccounts[(0, utils_1.sha256)(payload.cliKey)]) === null || _a === void 0 ? void 0 : _a.addedAt) !== null && _b !== void 0 ? _b : apiPayload.timestamp }, (apiPayload.hostType == "cloud"
                ? {
                    hostType: "cloud",
                }
                : {
                    hostType: "self-hosted",
                    deploymentTag: apiPayload.deploymentTag,
                })), context);
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
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_CLI_USER,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_CLI_USER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { encryptedKeysScopeFn: (graph, { payload: { id } }) => ({
        userIds: new Set([id]),
        envParentIds: "all",
        keyableParentIds: "all",
    }) }));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.AUTHENTICATE_CLI_KEY,
    loggableType: "authAction",
    successStateProducer: (draft, { meta, payload }) => {
        draft.signedTrustedRoot = payload.signedTrustedRoot;
        draft.graph = payload.graph;
        draft.graphUpdatedAt = payload.graphUpdatedAt;
    },
});
const createCliUser = async (state, clientParams, auth, context) => {
    if (!auth.privkey) {
        throw new Error("Action requires decrypted privkey");
    }
    const cliKeyIdPart = (0, utils_1.secureRandomAlphanumeric)(22), encryptionKey = (0, utils_1.secureRandomAlphanumeric)(22), trustedRoot = state.trustedRoot, { pubkey, privkey, encryptedPrivkey } = await (0, proxy_1.generateKeys)({
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
    ]), accessParams = {
        orgRoleId: clientParams.orgRoleId,
        appUserGrants: clientParams.appUserGrants,
    }, envParams = await (0, envs_1.encryptedKeyParamsForDeviceOrInvitee)({
        state,
        privkey: auth.privkey,
        pubkey,
        userId: undefined,
        accessParams,
        context,
    });
    return [
        Object.assign(Object.assign({}, envParams), { pubkey: signedPubkey, encryptedPrivkey: encryptedPrivkey, signedTrustedRoot: { data: signedTrustedRoot }, cliKeyIdPart, appUserGrants: clientParams.appUserGrants, name: clientParams.name, orgRoleId: clientParams.orgRoleId, importId: clientParams.importId }),
        [
            cliKeyIdPart,
            encryptionKey,
            auth.hostType == "self-hosted" ? auth.hostUrl : undefined,
        ]
            .filter(Boolean)
            .join("-"),
    ];
};
//# sourceMappingURL=cli_users.js.map