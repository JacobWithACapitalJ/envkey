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
exports.upgradeCryptoIfNeeded = void 0;
const R = __importStar(require("ramda"));
const envs_1 = require("../lib/envs");
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const pick_1 = require("@envkey/core/lib/utils/pick");
const client_1 = require("@envkey/core/lib/client");
const trust_1 = require("../lib/trust");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const g = __importStar(require("@envkey/core/lib/graph"));
const logger_1 = require("@envkey/core/lib/utils/logger");
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CREATE_SESSION,
    stateProducer: (draft) => {
        draft.isCreatingSession = true;
        delete draft.createSessionError;
        delete draft.trustedRoot;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        draft.trustedSessionPubkeys = {};
        delete draft.fetchSessionError;
    },
    endStateProducer: (draft) => {
        delete draft.isCreatingSession;
        delete draft.verifyingEmail;
        delete draft.emailVerificationCode;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.createSessionError = payload;
    },
    successHandler: async (state, action, res, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        // this will init / re-init locals if needed to fix rare changesets key mismatch bug from July 2022
        await (0, envs_1.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
    },
    handler: async (initialState, action, { context: contextParams, dispatchSuccess, dispatchFailure }) => {
        var _a;
        let state = initialState;
        const { payload } = action;
        let auth = state.orgUserAccounts[payload.accountId];
        if (!auth) {
            throw new Error("Invalid account");
        }
        if (auth.provider == "email" && !payload.emailVerificationToken) {
            throw new Error("emailVerificationToken required");
        }
        else if (auth.provider != "email" && !payload.externalAuthSessionId) {
            throw new Error("externalAuthSessionId required");
        }
        const context = Object.assign(Object.assign({}, contextParams), { hostUrl: auth.hostUrl, accountIdOrCliKey: payload.accountId });
        const signature = tweetnacl_util_1.default.encodeBase64(tweetnacl_1.default.sign.detached(tweetnacl_util_1.default.decodeUTF8(JSON.stringify(R.props(["userId", "orgId", "deviceId", "provider"], auth))), tweetnacl_util_1.default.decodeBase64(auth.privkey.keys.signingKey))), apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.CREATE_SESSION,
            payload: Object.assign(Object.assign(Object.assign({}, (0, pick_1.pick)(["orgId", "userId", "deviceId"], auth)), { signature }), (auth.provider == "email"
                ? {
                    provider: auth.provider,
                    emailVerificationToken: payload.emailVerificationToken,
                }
                : {
                    provider: auth.provider,
                    externalAuthSessionId: payload.externalAuthSessionId,
                })),
        }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
        if (!apiRes.success) {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        state = apiRes.state;
        const timestamp = apiRes.resultAction.payload.timestamp;
        try {
            const verifyRes = await (0, trust_1.verifyCurrentUser)(state, context);
            if (!verifyRes.success) {
                (0, logger_1.log)("Couldn't verify current user");
                throw new Error("Couldn't verify current user");
            }
            state = verifyRes.state;
            const fetchLoadedRes = await (0, envs_1.fetchLoadedEnvs)(state, context);
            if (fetchLoadedRes && !fetchLoadedRes.success) {
                (0, logger_1.log)("Error fetching latest loaded environments");
                throw new Error("Error fetching latest loaded environments");
            }
            if (fetchLoadedRes) {
                state = fetchLoadedRes.state;
            }
            const fetchPendingRes = await (0, envs_1.fetchPendingEnvs)((_a = fetchLoadedRes === null || fetchLoadedRes === void 0 ? void 0 : fetchLoadedRes.state) !== null && _a !== void 0 ? _a : verifyRes.state, context);
            if (fetchPendingRes && !fetchPendingRes.success) {
                (0, logger_1.log)("Error fetching latest pending environments");
                throw new Error("Error fetching latest pending environments");
            }
            if (fetchPendingRes) {
                state = fetchPendingRes.state;
            }
            const upgradeCryptoRes = await (0, exports.upgradeCryptoIfNeeded)(state, auth.userId, context);
            if (upgradeCryptoRes && !upgradeCryptoRes.success) {
                throw new Error("Error upgrading to latest crypto version");
            }
        }
        catch (error) {
            (0, logger_1.log)("CREATE_SESSION_ERROR", { error });
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: `CreateSessionError: ${error.name}}`,
                    message: error.message,
                },
            }, context);
        }
        return dispatchSuccess({ timestamp }, context);
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_SESSION,
    loggableType: "authAction",
    successStateProducer: (draft, { meta, payload }) => {
        var _a;
        const accountId = payload.userId, orgAccount = draft.orgUserAccounts[accountId], org = payload.graph[payload.orgId];
        draft.orgUserAccounts[accountId] = Object.assign(Object.assign(Object.assign({}, orgAccount), (0, pick_1.pick)([
            "token",
            "email",
            "firstName",
            "lastName",
            "uid",
            "provider",
            "userId",
            "deviceId",
        ], payload)), { externalAuthProviderId: (_a = draft.completedExternalAuth) === null || _a === void 0 ? void 0 : _a.externalAuthProviderId, lastAuthAt: payload.timestamp, orgName: org.name, requiresPassphrase: org.settings.crypto.requiresPassphrase, requiresLockout: org.settings.crypto.requiresLockout, lockoutMs: org.settings.crypto.lockoutMs });
        if (payload.type == "tokenSession") {
            draft.signedTrustedRoot = payload.signedTrustedRoot;
        }
        draft.graph = payload.graph;
        draft.graphUpdatedAt = payload.graphUpdatedAt;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.QUEUE_REFRESH_SESSION,
    stateProducer: (draft, action) => {
        draft.refreshSessionQueued = action.payload;
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.REFRESH_SESSION,
    stateProducer: (draft) => {
        draft.isRefreshingSession = true;
        delete draft.refreshSessionQueued;
    },
    endStateProducer: (draft) => {
        delete draft.isRefreshingSession;
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        let state = initialState;
        const res = await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.GET_SESSION,
            payload: {
                omitGraphUpdatedAt: (_a = action.payload) === null || _a === void 0 ? void 0 : _a.omitGraphUpdatedAt,
            },
        }, context);
        if (!res.success) {
            return dispatchFailure(res.resultAction.payload, context);
        }
        if (res.resultAction
            .payload.type == "notModified") {
            return dispatchSuccess({ notModified: true }, context);
        }
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.CLEAR_ORPHANED_BLOBS,
        }, context);
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        // this will init / re-init locals if needed to fix rare changesets key mismatch bug from July 2022
        await (0, envs_1.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
        if (state.refreshSessionQueued) {
            const queued = state.refreshSessionQueued;
            setTimeout(() => {
                (0, handler_1.dispatch)(queued, context);
            }, 500);
        }
        return dispatchSuccess({ timestamp: res.resultAction.payload.timestamp }, context);
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.GET_SESSION,
    stateProducer: (draft) => {
        draft.isFetchingSession = true;
        delete draft.fetchSessionNotModified;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.fetchSessionError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.isFetchingSession;
    },
    successStateProducer: (draft, action) => {
        var _a;
        delete draft.fetchSessionError;
        draft.fetchSessionNotModified = (_a = action.payload.notModified) !== null && _a !== void 0 ? _a : false;
    },
    handler: async (initialState, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b, _c, _d;
        if ((_a = action.payload) === null || _a === void 0 ? void 0 : _a.noop) {
            return dispatchSuccess({ timestamp: Date.now(), notModified: true }, context);
        }
        let state = initialState;
        let auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "GetSessionError",
                    message: "Action requires authentication",
                },
            }, context);
        }
        const apiRes = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.GET_SESSION,
            payload: {
                graphUpdatedAt: R.isEmpty(state.graph) || ((_b = action.payload) === null || _b === void 0 ? void 0 : _b.omitGraphUpdatedAt)
                    ? undefined
                    : state.graphUpdatedAt,
            },
        }, Object.assign(Object.assign({}, context), { rootClientAction: action }));
        if (!apiRes.success) {
            return dispatchFailure(apiRes.resultAction.payload, context);
        }
        state = apiRes.state;
        if (apiRes.resultAction
            .payload.type == "notModified") {
            return dispatchSuccess({ notModified: true }, context);
        }
        const timestamp = apiRes.resultAction.payload.timestamp;
        try {
            const verifyRes = await (0, trust_1.verifyCurrentUser)(apiRes.state, context);
            if (!verifyRes.success) {
                (0, logger_1.log)("Couldn't verify current user");
                throw new Error("Couldn't verify current user");
            }
            state = verifyRes.state;
            const fetchLoadedRes = await (0, envs_1.fetchLoadedEnvs)(verifyRes.state, context, (_c = action.payload) === null || _c === void 0 ? void 0 : _c.skipWaitForReencryption);
            if (fetchLoadedRes && !fetchLoadedRes.success) {
                (0, logger_1.log)("Error fetching latest environments with pending changes");
                throw new Error("Error fetching latest environments with pending changes");
            }
            if (fetchLoadedRes) {
                state = fetchLoadedRes.state;
            }
            const fetchPendingRes = await (0, envs_1.fetchPendingEnvs)((_d = fetchLoadedRes === null || fetchLoadedRes === void 0 ? void 0 : fetchLoadedRes.state) !== null && _d !== void 0 ? _d : verifyRes.state, context);
            if (fetchPendingRes && !fetchPendingRes.success) {
                (0, logger_1.log)("Error fetching latest pending environments");
                throw new Error("Error fetching latest pending environments");
            }
            if (fetchPendingRes) {
                state = fetchPendingRes.state;
            }
            const upgradeCryptoRes = await (0, exports.upgradeCryptoIfNeeded)(state, auth.userId, context);
            if (upgradeCryptoRes && !upgradeCryptoRes.success) {
                throw new Error("Error upgrading to latest crypto version");
            }
        }
        catch (error) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: `GetSessionError: ${error.name}`,
                    message: error.message,
                },
            }, context);
        }
        return dispatchSuccess({ timestamp }, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SELECT_DEFAULT_ACCOUNT,
    stateProducer: (draft, { payload: { accountId } }) => (Object.assign(Object.assign(Object.assign(Object.assign({}, draft), types_1.Client.defaultAccountState), types_1.Client.defaultClientState), { defaultAccountId: accountId })),
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.SIGN_OUT,
    successStateProducer: (draft, { meta: { rootAction: { payload: { accountId }, }, }, }) => {
        var _a;
        return (Object.assign(Object.assign(Object.assign(Object.assign({}, draft), R.omit(["pendingEnvUpdates", "pendingEnvsUpdatedAt", "pendingInvites"], types_1.Client.defaultAccountState)), types_1.Client.defaultClientState), { orgUserAccounts: Object.assign(Object.assign({}, draft.orgUserAccounts), { [accountId]: R.omit(["token"], (_a = draft.orgUserAccounts[accountId]) !== null && _a !== void 0 ? _a : {}) }) }));
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        const { payload: { accountId }, } = action;
        // clear server token
        // if it fails we still just sign out on the client-side
        try {
            await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.CLEAR_TOKEN,
                payload: {},
            }, Object.assign(Object.assign({}, context), { rootClientAction: action, accountIdOrCliKey: accountId }));
        }
        catch (err) { }
        return dispatchSuccess(null, context);
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.SIGN_IN_PENDING_SELF_HOSTED,
    stateProducer: (draft, { meta, payload: { index, initToken } }) => {
        let orgId, userId, deviceId, token;
        const throwInvalidTokenErr = () => {
            (0, logger_1.log)("Invalid self-hosted init token");
        };
        let parsed;
        try {
            parsed = JSON.parse(tweetnacl_util_1.default.encodeUTF8(tweetnacl_util_1.default.decodeBase64(initToken)));
        }
        catch (err) {
            return throwInvalidTokenErr();
        }
        if (parsed.length != 4 || !R.all((s) => typeof s == "string", parsed)) {
            return throwInvalidTokenErr();
        }
        [orgId, userId, deviceId, token] = parsed;
        const pendingAuth = draft.pendingSelfHostedDeployments[index];
        const now = Date.now();
        draft.orgUserAccounts[userId] = Object.assign(Object.assign({}, R.omit([
            "type",
            "subdomain",
            "domain",
            "codebuildLink",
            "registerAction",
            "customDomain",
            "verifiedSenderEmail",
            "notifySmsWhenDone",
        ], pendingAuth)), { type: "clientUserAuth", orgId,
            userId,
            deviceId,
            token, addedAt: now, lastAuthAt: now });
        delete draft.authenticatePendingSelfHostedAccountError;
        draft.authenticatingPendingSelfHostedAccountId = userId;
    },
    failureStateProducer: (draft, { meta, payload }) => {
        draft.authenticatePendingSelfHostedAccountError = payload;
    },
    successStateProducer: (draft, { meta, payload }) => {
        const index = meta.rootAction.payload.index;
        draft.pendingSelfHostedDeployments.splice(index, 1);
    },
    endStateProducer: (draft, { meta, payload }) => {
        delete draft.authenticatingPendingSelfHostedAccountId;
    },
    handler: async (state, { payload: { index, initToken } }, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        if (!state.authenticatingPendingSelfHostedAccountId) {
            throw new Error("state.authenticatingPendingSelfHostedAccountId not set");
        }
        const dispatchContext = Object.assign(Object.assign({}, context), { accountIdOrCliKey: state.authenticatingPendingSelfHostedAccountId });
        const res = await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.GET_SESSION }, dispatchContext);
        return res.success
            ? dispatchSuccess(null, dispatchContext)
            : dispatchFailure((_a = res.resultAction) === null || _a === void 0 ? void 0 : _a.payload, dispatchContext);
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.GET_SESSION,
    loggableType: "fetchMetaAction",
    authenticated: true,
    failureStateProducer: (draft, { meta, payload }) => {
        const accountId = meta.accountIdOrCliKey;
        if (!accountId) {
            return;
        }
        // Now dealt with in handler for all authenticated actions
        // if (
        //   typeof payload.error == "object" &&
        //   "code" in payload.error &&
        //   payload.error.code == 401
        // ) {
        //   return {
        //     ...draft,
        //     ...R.omit(
        //       ["pendingEnvUpdates", "pendingEnvsUpdatedAt", "pendingInvites"],
        //       Client.defaultAccountState
        //     ),
        //     ...Client.defaultClientState,
        //     orgUserAccounts: {
        //       ...draft.orgUserAccounts,
        //       [accountId]: R.omit(
        //         ["token"],
        //         draft.orgUserAccounts[accountId] ?? {}
        //       ),
        //     },
        //   } as Client.State;
        // }
    },
    successStateProducer: (draft, { meta, payload }) => {
        if (payload.type == "notModified") {
            return draft;
        }
        const accountId = meta.accountIdOrCliKey, orgAccount = draft.orgUserAccounts[accountId], org = payload.graph[payload.orgId];
        draft.orgUserAccounts[accountId] = Object.assign(Object.assign(Object.assign({}, orgAccount), (0, pick_1.pick)([
            "token",
            "email",
            "firstName",
            "lastName",
            "uid",
            "provider",
            "userId",
            "deviceId",
        ], payload)), { lastAuthAt: payload.timestamp, orgName: org.name, requiresPassphrase: org.settings.crypto.requiresPassphrase, requiresLockout: org.settings.crypto.requiresLockout, lockoutMs: org.settings.crypto.lockoutMs });
        draft.signedTrustedRoot = payload.signedTrustedRoot;
        draft.graph = payload.graph;
        draft.graphUpdatedAt = payload.graphUpdatedAt;
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CLEAR_TOKEN,
    loggableType: "authAction",
    authenticated: true,
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CLEAR_USER_TOKENS,
    loggableType: "authAction",
    authenticated: true,
    stateProducer: (draft, { payload: { userId } }) => {
        draft.isClearingUserTokens[userId] = true;
    },
    endStateProducer: (draft, { meta: { rootAction: { payload: { userId }, }, }, }) => {
        delete draft.isClearingUserTokens[userId];
    },
    successStateProducer: (draft, { meta: { accountIdOrCliKey, rootAction: { payload: { userId }, }, }, }) => {
        // if user just cleared their own tokens, sign them out
        const auth = (0, client_1.getAuth)(draft, accountIdOrCliKey);
        if (auth.userId == userId) {
            return Object.assign(Object.assign(Object.assign(Object.assign({}, draft), R.omit(["pendingEnvUpdates", "pendingEnvsUpdatedAt", "pendingInvites"], types_1.Client.defaultAccountState)), types_1.Client.defaultClientState), { orgUserAccounts: Object.assign(Object.assign({}, draft.orgUserAccounts), { [accountIdOrCliKey]: R.omit(["token"], draft.orgUserAccounts[accountIdOrCliKey]) }) });
        }
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CLEAR_ORG_TOKENS,
    loggableType: "authAction",
    authenticated: true,
    stateProducer: (draft) => {
        draft.isClearingOrgTokens = true;
    },
    endStateProducer: (draft) => {
        delete draft.isClearingOrgTokens;
    },
    successStateProducer: (draft, { meta: { accountIdOrCliKey } }) => {
        // since all org tokens were just cleared, sign out user
        return Object.assign(Object.assign(Object.assign(Object.assign({}, draft), R.omit(["pendingEnvUpdates", "pendingEnvsUpdatedAt", "pendingInvites"], types_1.Client.defaultAccountState)), types_1.Client.defaultClientState), { orgUserAccounts: Object.assign(Object.assign({}, draft.orgUserAccounts), { [accountIdOrCliKey]: R.omit(["token"], draft.orgUserAccounts[accountIdOrCliKey]) }) });
    },
});
const upgradeCryptoIfNeeded = async (state, currentUserId, context) => {
    const { org, environments } = g.graphTypes(state.graph);
    if (!org["upgradedCrypto-2.1.0"]) {
        const environmentIds = environments
            .filter((environment) => !environment["upgradedCrypto-2.1.0"] &&
            g.authz.canUpdateEnv(state.graph, currentUserId, environment.id))
            .map(R.prop("id"));
        const fetchRes = await (0, envs_1.fetchRequiredEnvs)(state, new Set(environmentIds), new Set(), context);
        if (fetchRes && !fetchRes.success) {
            return fetchRes;
        }
        return (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.COMMIT_ENVS,
            payload: {
                pendingEnvironmentIds: environmentIds,
                upgradeCrypto: true,
            },
        }, context);
    }
};
exports.upgradeCryptoIfNeeded = upgradeCryptoIfNeeded;
//# sourceMappingURL=sessions.js.map