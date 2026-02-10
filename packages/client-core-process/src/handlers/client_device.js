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
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const os_1 = __importDefault(require("os"));
const key_store_1 = require("@envkey/core/lib/client_store/key_store");
const R = __importStar(require("ramda"));
const utils_1 = require("@envkey/core/lib/crypto/utils");
const logger_1 = require("@envkey/core/lib/utils/logger");
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.INIT_DEVICE,
    procStateProducer: (draft) => {
        if (!draft.defaultDeviceName) {
            draft.defaultDeviceName = os_1.default.hostname();
        }
        draft.deviceKeyUpdatedAt = Date.now();
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.DISCONNECT_CLIENT,
    skipLocalSocketUpdate: true,
    procStateProducer: (draft, { meta: { clientId, accountIdOrCliKey } }) => {
        delete draft.clientStates[clientId];
        if (accountIdOrCliKey) {
            const hash = (0, utils_1.sha256)(accountIdOrCliKey);
            if (draft.cliKeyAccounts[hash]) {
                delete draft.cliKeyAccounts[hash];
            }
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_CLIENT_STATE,
    skipLocalSocketUpdate: true,
    procStateProducer: (draft, { meta: { clientId } }) => {
        draft.clientStates[clientId] = types_1.Client.defaultClientState;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_DEVICE_PASSPHRASE,
    procStateProducer: (draft, { payload: { passphrase } }) => {
        draft.requiresPassphrase = Boolean(passphrase) || undefined;
    },
    handler: async (state, { payload: { passphrase } }, context) => {
        await (0, key_store_1.initDeviceKey)(passphrase);
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.INIT_DEVICE,
        }, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_DEVICE_PASSPHRASE,
    procStateProducer: (draft) => {
        const accountsRequiringPassphrase = Object.values(draft.orgUserAccounts).filter(R.prop("requiresPassphrase"));
        if (accountsRequiringPassphrase.length > 0) {
            (0, logger_1.log)("Cannot remove passphrase because user belongs to orgs that require one.");
            return;
        }
        delete draft.requiresPassphrase;
        delete draft.lockoutMs;
    },
    handler: async (state, action, context) => {
        const accountsRequiringPassphrase = Object.values(state.orgUserAccounts).filter(R.prop("requiresPassphrase"));
        if (accountsRequiringPassphrase.length > 0) {
            throw new Error("Cannot remove passphrase because user belongs to orgs that require one.");
        }
        await (0, key_store_1.initDeviceKey)();
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.INIT_DEVICE,
        }, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_DEFAULT_DEVICE_NAME,
    procStateProducer: (draft, { payload: { name } }) => {
        draft.defaultDeviceName = name;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_DEVICE_LOCKOUT,
    procStateProducer: (draft, { payload: { lockoutMs } }) => {
        const accountsRequiringLockout = Object.values(draft.orgUserAccounts).filter(R.prop("requiresLockout")), lowestMaxLockout = R.apply(Math.min, accountsRequiringLockout
            .filter(R.prop("lockoutMs"))
            .map((acct) => acct.lockoutMs));
        if (lockoutMs > lowestMaxLockout) {
            (0, logger_1.log)("Cannot set a lockout higher than the lowest required by any org.");
            return;
        }
        draft.lockoutMs = lockoutMs;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_DEVICE_LOCKOUT,
    procStateProducer: (draft) => {
        const accountsRequiringLockout = Object.values(draft.orgUserAccounts).filter(R.prop("requiresLockout"));
        if (accountsRequiringLockout.length > 0) {
            (0, logger_1.log)("Cannot remove lockout because user belongs to orgs that require one.");
            return;
        }
        draft.lockoutMs = undefined;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.UNLOCK_DEVICE,
    procStateProducer: (draft) => {
        draft.unlockedAt = Date.now();
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.MERGE_PERSISTED,
    procStateProducer: (draft, { payload }) => {
        for (let k of types_1.Client.STATE_PERSISTENCE_KEYS) {
            if (k in payload) {
                draft[k] = payload[k];
                // initialize newly added state keys that weren't set in stored state
                if (k == "accountStates") {
                    for (let accountId in payload.accountStates) {
                        const accountState = payload.accountStates[accountId];
                        if (accountState) {
                            if (typeof accountState.pendingInvites == "undefined") {
                                draft.accountStates[accountId].pendingInvites = [];
                            }
                        }
                    }
                }
            }
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.FETCHED_CLIENT_STATE,
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_UI_LAST_SELECTED_ACCOUNT_ID,
    procStateProducer: (draft, { payload }) => {
        draft.uiLastSelectedAccountId = payload.selectedAccountId;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_UI_LAST_SELECTED_URL,
    procStateProducer: (draft, { payload }) => {
        draft.uiLastSelectedUrl = payload.url;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_CACHED,
    stateProducer: updates_1.clearNonPendingEnvsProducer,
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.ACCOUNT_ACTIVE,
});
//# sourceMappingURL=client_device.js.map