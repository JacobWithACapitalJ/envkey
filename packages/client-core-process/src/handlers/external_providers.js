"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../handler");
const types_1 = require("@envkey/core/types");
const status_1 = require("../lib/status");
const wait_1 = require("@envkey/core/lib/utils/wait");
const logger_1 = require("@envkey/core/lib/utils/logger");
const bs58_1 = require("bs58");
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const open_1 = require("@envkey/client-core-process/lib/open");
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CREATE_ORG_SAML_PROVIDER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isCreatingSamlProvider", "createSamlError")), { successStateProducer: (draft, { payload }) => { } }));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.UPDATE_ORG_SAML_SETTINGS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isUpdatingSamlSettings", "updatingSamlSettingsError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_EXTERNAL_AUTH_PROVIDER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isDeletingAuthProvider", "deleteAuthProviderError")));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.GET_EXTERNAL_AUTH_PROVIDERS,
    loggableType: "authAction",
    authenticated: true,
    stateProducer: (draft) => {
        draft.isFetchingAuthProviders = true;
        delete draft.fetchAuthProvidersError;
    },
    failureStateProducer: (draft, { payload }) => {
        delete draft.isFetchingAuthProviders;
        draft.fetchAuthProvidersError = payload;
    },
    successStateProducer: (draft, { payload }) => {
        var _a;
        delete draft.isFetchingAuthProviders;
        draft.externalAuthProviders = payload.providers;
        draft.samlSettingsByProviderId = (_a = payload.samlSettingsByProviderId) !== null && _a !== void 0 ? _a : {};
    },
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.GET_EXTERNAL_AUTH_SESSION, loggableType: "hostAction" }, (0, status_1.statusProducers)("isFetchingExternalAuthSession", "fetchExternalAuthSessionError")));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_EXTERNAL_AUTH_SESSION,
    loggableType: "hostAction",
    stateProducer: (draft) => {
        draft.creatingExternalAuthSession = true;
        delete draft.pendingExternalAuthSession;
        delete draft.startingExternalAuthSessionError;
        delete draft.externalAuthSessionCreationError;
        delete draft.authorizingExternallyErrorMessage;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.externalAuthSessionCreationError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.creatingExternalAuthSession;
    },
    successStateProducer: (draft, { payload }) => {
        const { id, authUrl } = payload;
        draft.pendingExternalAuthSession = { id, authUrl };
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_PENDING_EXTERNAL_AUTH_SESSION,
    stateProducer: (draft) => {
        delete draft.isAuthorizingExternallyForSessionId;
        delete draft.pendingExternalAuthSession;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_EXTERNAL_AUTH_SESSION_RESULT,
    stateProducer: (draft, { payload }) => {
        delete draft.isAuthorizingExternallyForSessionId;
        delete draft.pendingExternalAuthSession;
        if ("authorizingExternallyErrorMessage" in payload) {
            draft.authorizingExternallyErrorMessage =
                payload.authorizingExternallyErrorMessage;
        }
        else {
            const { externalAuthSessionId, externalAuthProviderId, orgId, userId, authType, } = payload;
            draft.completedExternalAuth = {
                externalAuthSessionId,
                externalAuthProviderId,
                orgId,
                userId,
                authType,
            };
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.WAIT_FOR_EXTERNAL_AUTH,
    stateProducer: (draft, { payload }) => {
        draft.isAuthorizingExternallyForSessionId = payload.externalAuthSessionId;
        draft.completedExternalAuth = undefined;
        delete draft.startingExternalAuthSessionError;
        delete draft.externalAuthSessionCreationError;
        delete draft.authorizingExternallyErrorMessage;
    },
    handler: async (state, { payload }, context) => {
        var _a, _b, _c, _d, _e;
        const { externalAuthSessionId, externalAuthProviderId, authType } = payload;
        let successPayload;
        let loadResSuccessContext;
        let awaitingLogin = true;
        let iterationsLeft = 1200;
        let orgId;
        let userId;
        while (awaitingLogin) {
            iterationsLeft--;
            if (iterationsLeft <= 0) {
                (0, logger_1.log)("External login timed out", { payload });
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.SET_EXTERNAL_AUTH_SESSION_RESULT,
                    payload: {
                        authorizingExternallyErrorMessage: `External login timed out for session ${externalAuthSessionId}`,
                    },
                }, context);
                if (externalAuthSessionId ===
                    res.state.isAuthorizingExternallyForSessionId) {
                    // still the same session
                    await (0, handler_1.dispatch)({
                        type: types_1.Client.ActionType.CLEAR_PENDING_EXTERNAL_AUTH_SESSION,
                    }, context);
                }
                return;
            }
            const loadRes = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.GET_EXTERNAL_AUTH_SESSION,
                payload: {
                    id: externalAuthSessionId,
                },
            }, context);
            const wasDeleted = "payload" in loadRes.resultAction &&
                "errorStatus" in ((_a = loadRes.resultAction) === null || _a === void 0 ? void 0 : _a.payload) &&
                ((_c = (_b = loadRes.resultAction) === null || _b === void 0 ? void 0 : _b.payload) === null || _c === void 0 ? void 0 : _c.errorStatus) === 404;
            const newSessionSpawned = externalAuthSessionId !==
                loadRes.state.isAuthorizingExternallyForSessionId;
            if (wasDeleted || newSessionSpawned) {
                (0, logger_1.log)("External auth session cancelled", {
                    thisLoop: payload,
                    otherSession: loadRes.state.isAuthorizingExternallyForSessionId,
                });
                return;
            }
            const resultActionPayload = loadRes.resultAction
                .payload;
            const failure = loadRes
                .resultAction;
            const stillWaitingExternally = resultActionPayload.type === "requiresExternalAuthError";
            if (stillWaitingExternally) {
                await (0, wait_1.wait)(1000);
                continue;
            }
            if (resultActionPayload.type !== "externalAuthSession") {
                await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.SET_EXTERNAL_AUTH_SESSION_RESULT,
                    payload: {
                        authorizingExternallyErrorMessage: (_e = (_d = resultActionPayload.errorStatus) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : failure.type,
                    },
                }, context);
                return;
            }
            // user successfully auth'd elsewhere
            ({ userId, orgId } = resultActionPayload.session);
            (0, logger_1.log)("External auth for session completed", {
                externalAuthSessionId,
                userId,
                orgId,
            });
            loadResSuccessContext = Object.assign(Object.assign({}, context), { accountIdOrCliKey: userId });
            awaitingLogin = false; // success
        }
        successPayload = {
            authType,
            externalAuthProviderId,
            externalAuthSessionId,
            orgId: orgId,
            userId: userId,
        };
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.SET_EXTERNAL_AUTH_SESSION_RESULT,
            payload: successPayload,
        }, loadResSuccessContext);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.WAIT_FOR_INVITE_EXTERNAL_AUTH,
    stateProducer: (draft, { payload }) => {
        draft.isAuthorizingExternallyForSessionId = payload.externalAuthSessionId;
        draft.completedExternalAuth = undefined;
        draft.authorizingExternallyErrorMessage = undefined;
    },
    handler: async (state, { payload }, context) => {
        const { externalAuthSessionId, authType, orgId, externalAuthProviderId, emailToken, encryptionToken, loadActionType, } = payload;
        const loadActionPayload = {
            emailToken,
            encryptionToken,
        };
        let successPayload;
        let loadResSuccessContext;
        let userId;
        let sentById;
        let awaitingLogin = true;
        let iterationsLeft = 1200;
        while (awaitingLogin) {
            iterationsLeft--;
            if (iterationsLeft <= 0) {
                (0, logger_1.log)("External login timed out", { payload });
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.SET_EXTERNAL_AUTH_SESSION_RESULT,
                    payload: {
                        authorizingExternallyErrorMessage: `External login timed out for session ${externalAuthSessionId}`,
                    },
                }, context);
                if (externalAuthSessionId ===
                    res.state.isAuthorizingExternallyForSessionId) {
                    // still the same session
                    await (0, handler_1.dispatch)({
                        type: types_1.Client.ActionType.CLEAR_PENDING_EXTERNAL_AUTH_SESSION,
                    }, context);
                }
                return;
            }
            const loadRes = await (0, handler_1.dispatch)({
                type: loadActionType,
                payload: loadActionPayload,
            }, context);
            if (externalAuthSessionId !==
                loadRes.state.isAuthorizingExternallyForSessionId) {
                (0, logger_1.log)("External auth session cancelled", {
                    thisLoop: payload,
                    otherSession: loadRes.state.isAuthorizingExternallyForSessionId,
                });
                return;
            }
            if (!loadRes.success) {
                const resultAction = loadRes.resultAction;
                const stillWaitingExternally = resultAction.payload.type === "requiresExternalAuthError";
                if (stillWaitingExternally) {
                    await (0, wait_1.wait)(1000);
                    continue;
                }
                await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.SET_EXTERNAL_AUTH_SESSION_RESULT,
                    payload: {
                        authorizingExternallyErrorMessage: ("errorReason" in
                            resultAction.payload
                            ? resultAction.payload.errorReason
                            : resultAction.payload.type),
                    },
                }, context);
                return;
            }
            const loadedInviteOrDeviceGrant = (payload.loadActionType === types_1.Client.ActionType.LOAD_INVITE
                ? loadRes.state.loadedInvite
                : loadRes.state.loadedDeviceGrant);
            userId =
                "inviteeId" in loadedInviteOrDeviceGrant
                    ? loadedInviteOrDeviceGrant.inviteeId
                    : loadedInviteOrDeviceGrant.granteeId;
            sentById =
                "invitedByUserId" in loadedInviteOrDeviceGrant
                    ? loadedInviteOrDeviceGrant.invitedByUserId
                    : loadedInviteOrDeviceGrant.grantedByUserId;
            (0, logger_1.log)("External auth for session completed", {
                externalAuthSessionId,
                userId,
            });
            loadResSuccessContext = Object.assign(Object.assign({}, context), { accountIdOrCliKey: userId });
            awaitingLogin = false; // success
        }
        successPayload = {
            authType,
            orgId,
            externalAuthSessionId,
            externalAuthProviderId,
            userId: userId,
            sentById: sentById,
        };
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.SET_EXTERNAL_AUTH_SESSION_RESULT,
            payload: successPayload,
        }, loadResSuccessContext);
    },
});
// returns quickly but triggers WaitForInviteExternalAuth in background
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CREATE_EXTERNAL_AUTH_SESSION_FOR_LOGIN,
    stateProducer: (draft) => {
        draft.startingExternalAuthSession = true;
        delete draft.startingExternalAuthSessionError;
        delete draft.externalAuthSessionCreationError;
        delete draft.authorizingExternallyErrorMessage;
    },
    failureStateProducer: (draft, { meta, payload }) => {
        if (payload.type === "requiresEmailAuthError") {
            draft.orgUserAccounts[meta.rootAction.payload.userId] = Object.assign(Object.assign({}, draft.orgUserAccounts[meta.rootAction.payload.userId]), { provider: "email", externalAuthProviderId: undefined });
        }
        else if (payload.type === "signInWrongProviderError") {
            draft.orgUserAccounts[meta.rootAction.payload.userId] = Object.assign(Object.assign({}, draft.orgUserAccounts[meta.rootAction.payload.userId]), { provider: payload.providers[0].provider, externalAuthProviderId: payload.providers[0].externalAuthProviderId });
        }
        draft.startingExternalAuthSessionError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.startingExternalAuthSession;
    },
    handler: async (state, { payload }, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        const { waitOpenMs, authMethod, externalAuthProviderId, orgId, userId, provider, } = payload;
        let externalAuthSessionId;
        const sessionPayload = {
            authType: "sign_in",
            authMethod,
            provider,
            orgId,
            userId,
            externalAuthProviderId,
        };
        const res = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.CREATE_EXTERNAL_AUTH_SESSION,
            payload: sessionPayload,
        }, context);
        if (!res.success) {
            return dispatchFailure(res.resultAction
                .payload, context);
        }
        const authResPayload = (_a = res.resultAction) === null || _a === void 0 ? void 0 : _a.payload;
        if (authResPayload.type !== "pendingExternalAuthSession") {
            // most likely, saml provider was deleted and user fell back to email auth
            return dispatchFailure(authResPayload, context);
        }
        (0, logger_1.log)("Successfully created a pending external auth session", authResPayload);
        externalAuthSessionId = authResPayload.id;
        const backgroundWork = () => {
            // User's web browser will open and ask them to log in.
            (0, open_1.openExternalUrl)(authResPayload.authUrl);
            // BACKGROUND
            // Check for successful external auth, or time out.
            (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.WAIT_FOR_EXTERNAL_AUTH,
                payload: {
                    authMethod,
                    provider,
                    authType: "sign_in",
                    externalAuthProviderId,
                    externalAuthSessionId: externalAuthSessionId,
                },
            }, context);
        };
        setTimeout(backgroundWork, waitOpenMs);
        return dispatchSuccess(null, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_EXTERNAL_AUTH,
    stateProducer: (draft) => {
        delete draft.completedExternalAuth;
        delete draft.startingExternalAuthSession;
        delete draft.startingExternalAuthSessionInvite;
        delete draft.startingExternalAuthSessionError;
        delete draft.startingExternalAuthSessionInviteError;
        delete draft.externalAuthSessionCreationError;
        delete draft.authorizingExternallyErrorMessage;
        delete draft.isAuthorizingExternallyForSessionId;
        delete draft.pendingExternalAuthSession;
    },
});
// returns quickly but triggers WaitForInviteExternalAuth in background
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CREATE_EXTERNAL_AUTH_SESSION_FOR_INVITE,
    stateProducer: (draft) => {
        draft.startingExternalAuthSessionInvite = true;
        delete draft.startingExternalAuthSessionInviteError;
        delete draft.completedExternalAuth;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.startingExternalAuthSessionInviteError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.startingExternalAuthSessionInvite;
    },
    handler: async (state, { payload }, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        const { authMethod, authObjectId, authType, emailToken, encryptionToken, externalAuthProviderId, loadActionType, orgId, provider, } = payload;
        let externalAuthSessionId;
        const encodedHostUrl = emailToken.split("_")[2];
        if (!encodedHostUrl) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "InvalidInviteToken",
                    message: "Invalid invite token",
                },
            }, context);
        }
        const hostUrl = tweetnacl_util_1.default.encodeUTF8((0, bs58_1.decode)(encodedHostUrl));
        const reqContext = Object.assign(Object.assign({}, context), { hostUrl });
        const sessionPayload = {
            authType,
            authMethod,
            provider,
            orgId,
            authObjectId,
            externalAuthProviderId,
        };
        const res = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.CREATE_EXTERNAL_AUTH_SESSION,
            payload: sessionPayload,
        }, reqContext);
        if (!res.success) {
            return dispatchFailure(res.resultAction
                .payload, reqContext);
        }
        const authResPayload = (_a = res.resultAction) === null || _a === void 0 ? void 0 : _a.payload;
        if (authResPayload.type !== "pendingExternalAuthSession") {
            // somehow the saml provider was deleted before this user accepted their invitation
            return dispatchFailure(authResPayload, reqContext);
        }
        (0, logger_1.log)("Successfully created a pending external auth session", authResPayload);
        externalAuthSessionId = authResPayload.id;
        // User's web browser will open and ask them to log in.
        (0, open_1.openExternalUrl)(authResPayload.authUrl);
        // BACKGROUND
        // Check for successful external auth, or time out.
        (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.WAIT_FOR_INVITE_EXTERNAL_AUTH,
            payload: {
                authType,
                emailToken,
                encryptionToken,
                externalAuthProviderId,
                externalAuthSessionId: externalAuthSessionId,
                loadActionType,
                orgId,
            },
        }, reqContext);
        return dispatchSuccess(null, reqContext);
    },
});
//# sourceMappingURL=external_providers.js.map