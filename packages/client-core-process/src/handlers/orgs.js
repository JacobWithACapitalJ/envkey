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
const object_1 = require("@envkey/core/lib/utils/object");
const client_1 = require("@envkey/core/lib/client");
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const status_1 = require("../lib/status");
const logger_1 = require("@envkey/core/lib/utils/logger");
const envs_1 = require("../lib/envs");
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.UPDATE_USER_ROLES,
    serialAction: true,
    stateProducer: (draft, { payload, meta }) => {
        for (let { id, orgRoleId } of payload) {
            draft.isUpdatingUserRole[id] = orgRoleId;
            delete draft.updateUserRoleErrors[id];
        }
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        for (let { id } of rootAction.payload) {
            draft.updateUserRoleErrors[id] = {
                payload: rootAction.payload,
                error: payload,
            };
        }
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        for (let { id } of rootAction.payload) {
            delete draft.isUpdatingUserRole[id];
        }
    },
    bulkApiDispatcher: true,
    apiActionCreator: async (payload) => ({
        action: {
            type: types_1.Api.ActionType.UPDATE_USER_ROLE,
            payload: (0, object_1.pick)(["id", "orgRoleId"], payload),
        },
    }),
    successHandler: async (state, action, res, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await (0, envs_1.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
        await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.CLEAR_CACHED }, context);
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.UPDATE_USER_ROLE,
    bulkDispatchOnly: true,
    graphProposer: ({ payload }) => (graphDraft) => {
        graphDraft[payload.id].orgRoleId =
            payload.orgRoleId;
    },
    encryptedKeysScopeFn: (graph, { payload: { id } }) => ({
        userIds: new Set([id]),
        envParentIds: "all",
        keyableParentIds: "all",
    }),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.RENAME_ORG,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    serialAction: true,
    stateProducer: (draft, { meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        draft.isRenaming[auth.orgId] = true;
        delete draft.renameErrors[auth.orgId];
    },
    failureStateProducer: (draft, { payload, meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        draft.renameErrors[auth.orgId] = payload;
    },
    successStateProducer: (draft, { meta }) => {
        const accountId = meta.accountIdOrCliKey, rootActionPayload = meta.rootAction.payload, name = rootActionPayload.name;
        const authDraft = (0, client_1.getAuth)(draft, accountId);
        if (authDraft && authDraft.type == "clientUserAuth") {
            authDraft.orgName = name;
        }
    },
    endStateProducer: (draft, { meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        delete draft.isRenaming[auth.orgId];
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.UPDATE_ORG_SETTINGS,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    serialAction: true,
    stateProducer: (draft, { meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        draft.isUpdatingSettings[auth.orgId] = true;
        delete draft.updateSettingsErrors[auth.orgId];
    },
    successStateProducer: (draft, { meta }) => {
        const accountId = meta.accountIdOrCliKey, rootActionPayload = meta.rootAction.payload, cryptoSettings = rootActionPayload.crypto;
        if (cryptoSettings) {
            const authDraft = (0, client_1.getAuth)(draft, accountId);
            if (authDraft && authDraft.type == "clientUserAuth") {
                if (typeof cryptoSettings.requiresPassphrase == "boolean") {
                    authDraft.requiresPassphrase = cryptoSettings.requiresPassphrase;
                }
                if (typeof cryptoSettings.requiresLockout == "boolean") {
                    authDraft.requiresLockout = cryptoSettings.requiresLockout;
                    if (!cryptoSettings.requiresLockout) {
                        delete authDraft.lockoutMs;
                    }
                }
                if (typeof cryptoSettings.lockoutMs == "number") {
                    authDraft.lockoutMs = cryptoSettings.lockoutMs;
                }
            }
        }
    },
    failureStateProducer: (draft, { payload, meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        draft.updateSettingsErrors[auth.orgId] = payload;
    },
    endStateProducer: (draft, { meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        delete draft.isUpdatingSettings[auth.orgId];
    },
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RENAME_USER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.renameObjectProducers));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.SET_ORG_ALLOWED_IPS,
    loggableType: "orgAction",
    loggableType2: "updateFirewallAction",
    authenticated: true,
    graphAction: true,
    serialAction: true,
    stateProducer: (draft, { meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        draft.isUpdatingFirewall[auth.orgId] = true;
        delete draft.updateFirewallErrors[auth.orgId];
    },
    failureStateProducer: (draft, { payload, meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        draft.updateFirewallErrors[auth.orgId] = payload;
    },
    endStateProducer: (draft, { meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        delete draft.isUpdatingFirewall[auth.orgId];
    },
});
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REMOVE_FROM_ORG, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { successStateProducer: (draft, { meta: { accountIdOrCliKey, rootAction: { payload: { id }, }, }, }) => {
        const auth = (0, client_1.getAuth)(draft, accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        if (id in draft.orgUserAccounts) {
            let defaultAccountId = draft.defaultAccountId === id ? undefined : draft.defaultAccountId;
            const orgUserAccounts = R.omit([id], draft.orgUserAccounts), remainingAccounts = Object.values(orgUserAccounts);
            if (remainingAccounts.length == 1) {
                defaultAccountId = remainingAccounts[0].userId;
            }
            if (id == auth.userId) {
                return Object.assign(Object.assign(Object.assign(Object.assign({}, draft), types_1.Client.defaultAccountState), types_1.Client.defaultClientState), { orgUserAccounts,
                    defaultAccountId });
            }
            else {
                return Object.assign(Object.assign({}, draft), { orgUserAccounts,
                    defaultAccountId });
            }
        }
    } }));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.DELETE_ORG,
    loggableType: "authAction",
    loggableType2: "orgAction",
    authenticated: true,
    graphAction: true,
    serialAction: true,
    stateProducer: (draft, { meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        draft.isRemoving[auth.orgId] = true;
        delete draft.removeErrors[auth.orgId];
    },
    successStateProducer: (draft, { meta: { accountIdOrCliKey } }) => (Object.assign(Object.assign(Object.assign(Object.assign({}, draft), types_1.Client.defaultAccountState), types_1.Client.defaultClientState), { orgUserAccounts: R.omit([accountIdOrCliKey], draft.orgUserAccounts) })),
    failureStateProducer: (draft, { payload, meta }) => {
        const auth = (0, client_1.getAuth)(draft, meta.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            (0, logger_1.log)("Action requires authentication");
            return;
        }
        draft.removeErrors[auth.orgId] = payload;
        delete draft.isRemoving[auth.orgId];
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_THROTTLE_ERROR,
    stateProducer: (draft) => {
        delete draft.throttleError;
    },
});
//# sourceMappingURL=orgs.js.map