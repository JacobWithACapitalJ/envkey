"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../../handler");
const types_1 = require("@envkey/core/types");
const vanta_1 = require("@envkey/core/types/integrations/vanta");
const status_1 = require("../../lib/status");
const client_1 = require("@envkey/core/lib/client");
const wait_1 = require("@envkey/core/lib/utils/wait");
const logger_1 = require("@envkey/core/lib/utils/logger");
const querystring_1 = __importDefault(require("querystring"));
const open_1 = require("@envkey/client-core-process/lib/open");
const graph_1 = require("@envkey/core/lib/graph");
const VANTA_EXTERNAL_AUTH_URL = "https://app.vanta.com/oauth/authorize";
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType
        .INTEGRATIONS_VANTA_CREATE_EXTERNAL_AUTH_SESSION_FOR_CONNECTION,
    stateProducer: (draft) => {
        draft.vantaConnectingAccount = true;
        draft.vantaStartingExternalAuthSession = true;
        delete draft.vantaStartingExternalAuthSessionError;
        delete draft.vantaExternalAuthSessionCreationError;
        delete draft.vantaAuthorizingExternallyErrorMessage;
    },
    failureStateProducer: (draft, { meta, payload }) => {
        draft.vantaStartingExternalAuthSessionError = payload;
        delete draft.vantaConnectingAccount;
    },
    endStateProducer: (draft) => {
        delete draft.vantaStartingExternalAuthSession;
    },
    handler: async (state, { payload }, { context, dispatchSuccess, dispatchFailure }) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const { waitOpenMs } = payload;
        let externalAuthSessionId;
        const res = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.INTEGRATIONS_VANTA_CREATE_EXTERNAL_AUTH_SESSION,
            payload: {},
        }, context);
        if (!res.success) {
            return dispatchFailure(res.resultAction
                .payload, context);
        }
        const authResPayload = res.resultAction
            .payload;
        (0, logger_1.log)("Successfully created a pending external auth session", authResPayload);
        externalAuthSessionId = authResPayload.id;
        const authUrl = res.state.vantaPendingExternalAuthSession.authUrl;
        const backgroundWork = () => {
            // User's web browser will open and ask them to log in.
            (0, open_1.openExternalUrl)(authUrl);
            // BACKGROUND
            // Check for successful external auth, or time out.
            (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.INTEGRATIONS_VANTA_WAIT_FOR_EXTERNAL_AUTH,
                payload: {
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
    actionType: types_1.Client.ActionType.INTEGRATIONS_VANTA_WAIT_FOR_EXTERNAL_AUTH,
    stateProducer: (draft, { payload }) => {
        draft.vantaIsAuthorizingExternallyForSessionId =
            payload.externalAuthSessionId;
        draft.vantaCompletedExternalAuth = undefined;
        delete draft.vantaStartingExternalAuthSessionError;
        delete draft.vantaExternalAuthSessionCreationError;
        delete draft.vantaAuthorizingExternallyErrorMessage;
    },
    handler: async (state, { payload }, context) => {
        var _a, _b, _c, _d, _e;
        const { externalAuthSessionId } = payload;
        let awaitingLogin = true;
        let iterationsLeft = 120;
        while (awaitingLogin) {
            iterationsLeft--;
            if (iterationsLeft <= 0) {
                (0, logger_1.log)("External login timed out", { payload });
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType
                        .INTEGRATIONS_VANTA_SET_EXTERNAL_AUTH_SESSION_RESULT,
                    payload: {
                        errorMessage: `External login timed out for session ${externalAuthSessionId}`,
                    },
                }, context);
                if (externalAuthSessionId ===
                    res.state.vantaIsAuthorizingExternallyForSessionId) {
                    // still the same session
                    await (0, handler_1.dispatch)({
                        type: types_1.Client.ActionType
                            .INTEGRATIONS_VANTA_CLEAR_PENDING_EXTERNAL_AUTH_SESSION,
                    }, context);
                }
                return;
            }
            const loadRes = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.INTEGRATIONS_VANTA_GET_EXTERNAL_AUTH_SESSION,
                payload: {
                    id: externalAuthSessionId,
                },
            }, context);
            const wasDeleted = "payload" in loadRes.resultAction &&
                "errorStatus" in ((_a = loadRes.resultAction) === null || _a === void 0 ? void 0 : _a.payload) &&
                ((_c = (_b = loadRes.resultAction) === null || _b === void 0 ? void 0 : _b.payload) === null || _c === void 0 ? void 0 : _c.errorStatus) === 404;
            const newSessionSpawned = externalAuthSessionId !==
                loadRes.state.vantaIsAuthorizingExternallyForSessionId;
            if (wasDeleted || newSessionSpawned) {
                (0, logger_1.log)("Vanta auth session cancelled", {
                    thisLoop: payload,
                    otherSession: loadRes.state.vantaIsAuthorizingExternallyForSessionId,
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
            if (resultActionPayload.type !== "vantaExternalAuthSession") {
                await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType
                        .INTEGRATIONS_VANTA_SET_EXTERNAL_AUTH_SESSION_RESULT,
                    payload: {
                        errorMessage: (_e = (_d = resultActionPayload.errorStatus) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : failure.type,
                    },
                }, context);
                return;
            }
            (0, logger_1.log)("External auth for vanta completed", {
                externalAuthSessionId,
            });
            awaitingLogin = false; // success
        }
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.GET_SESSION,
            payload: {},
        }, context);
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType
                .INTEGRATIONS_VANTA_SET_EXTERNAL_AUTH_SESSION_RESULT,
            payload: { externalAuthSessionId },
        }, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.INTEGRATIONS_VANTA_CLEAR_PENDING_EXTERNAL_AUTH_SESSION,
    stateProducer: (draft) => {
        delete draft.vantaIsAuthorizingExternallyForSessionId;
        delete draft.vantaPendingExternalAuthSession;
        delete draft.vantaConnectingAccount;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.INTEGRATIONS_VANTA_SET_EXTERNAL_AUTH_SESSION_RESULT,
    stateProducer: (draft, { payload }) => {
        delete draft.vantaIsAuthorizingExternallyForSessionId;
        delete draft.vantaPendingExternalAuthSession;
        delete draft.vantaConnectingAccount;
        if ("errorMessage" in payload) {
            draft.vantaAuthorizingExternallyErrorMessage = payload.errorMessage;
        }
        else {
            const { externalAuthSessionId } = payload;
            draft.vantaCompletedExternalAuth = {
                externalAuthSessionId,
            };
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.INTEGRATIONS_VANTA_RESET_EXTERNAL_AUTH,
    stateProducer: (draft) => {
        delete draft.vantaCompletedExternalAuth;
        delete draft.vantaStartingExternalAuthSessionError;
        delete draft.vantaExternalAuthSessionCreationError;
        delete draft.vantaAuthorizingExternallyErrorMessage;
        delete draft.vantaConnectingAccount;
        delete draft.vantaIsAuthorizingExternallyForSessionId;
        delete draft.vantaPendingExternalAuthSession;
    },
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.INTEGRATIONS_VANTA_GET_EXTERNAL_AUTH_SESSION, authenticated: true, loggableType: "authAction" }, (0, status_1.statusProducers)("vantaIsFetchingExternalAuthSession", "vantaFetchExternalAuthSessionError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.INTEGRATIONS_VANTA_REMOVE_CONNECTION, authenticated: true, graphAction: true, serialAction: true, loggableType: "orgAction" }, (0, status_1.statusProducers)("vantaIsRemovingConnection", "vantaRemovingConnectionError")));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.INTEGRATIONS_VANTA_CREATE_EXTERNAL_AUTH_SESSION,
    authenticated: true,
    loggableType: "authAction",
    stateProducer: (draft) => {
        draft.vantaCreatingExternalAuthSession = true;
        delete draft.vantaPendingExternalAuthSession;
        delete draft.vantaStartingExternalAuthSessionError;
        delete draft.vantaExternalAuthSessionCreationError;
        delete draft.vantaAuthorizingExternallyErrorMessage;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.vantaExternalAuthSessionCreationError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.vantaCreatingExternalAuthSession;
    },
    successStateProducer: (draft, { payload, meta: { accountIdOrCliKey } }) => {
        const auth = (0, client_1.getAuth)(draft, accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        const { id } = payload;
        const org = (0, graph_1.getOrg)(draft.graph);
        const queryParams = {
            client_id: vanta_1.VANTA_CLIENT_ID,
            scope: "connectors.self:write-resource connectors.self:read-resource",
            redirect_uri: vanta_1.VANTA_REDIRECT_URI,
            source_id: `${org.name} → ${auth.orgId}`,
            response_type: "code",
            state: id,
        };
        (0, logger_1.log)("vanta params", queryParams);
        const qs = querystring_1.default.stringify(queryParams);
        const authUrl = VANTA_EXTERNAL_AUTH_URL + "?" + qs;
        draft.vantaPendingExternalAuthSession = { id, authUrl };
    },
});
//# sourceMappingURL=vanta.js.map