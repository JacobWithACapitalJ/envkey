"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForStateCondition = exports.newAccountStateProducer = exports.getState = void 0;
const types_1 = require("@envkey/core/types");
const object_1 = require("@envkey/core/lib/utils/object");
const wait_1 = require("@envkey/core/lib/utils/wait");
const logger_1 = require("@envkey/core/lib/utils/logger");
function getState(storeOrState, context) {
    const procState = "getState" in storeOrState ? storeOrState.getState() : storeOrState, clientState = procState.clientStates[context.clientId], accountState = context.accountIdOrCliKey
        ? procState.accountStates[context.accountIdOrCliKey]
        : undefined;
    const res = Object.assign(Object.assign(Object.assign({}, (0, object_1.pick)(types_1.Client.CLIENT_PROC_STATE_KEYS, procState)), (clientState
        ? (0, object_1.pick)(types_1.Client.CLIENT_STATE_KEYS, clientState)
        : types_1.Client.defaultClientState)), (accountState
        ? (0, object_1.pick)(types_1.Client.ACCOUNT_STATE_KEYS, accountState)
        : types_1.Client.defaultAccountState));
    return res;
}
exports.getState = getState;
const newAccountStateProducer = (draft, { meta, payload }) => {
    var _a;
    const accountId = payload.userId;
    if (Object.keys(draft.orgUserAccounts).length == 0) {
        draft.defaultAccountId = accountId;
    }
    draft.graph = payload.graph;
    draft.graphUpdatedAt = payload.graphUpdatedAt;
    const org = draft.graph[payload.orgId];
    draft.orgUserAccounts[accountId] = Object.assign(Object.assign(Object.assign({ type: "clientUserAuth" }, (0, object_1.pick)([
        "token",
        "userId",
        "orgId",
        "email",
        "firstName",
        "lastName",
        "provider",
        "uid",
        "deviceId",
    ], payload)), { privkey: meta.dispatchContext.privkey, orgName: org.name, externalAuthProviderId: (_a = draft.completedExternalAuth) === null || _a === void 0 ? void 0 : _a.externalAuthProviderId, deviceName: meta.rootAction.payload.device.name, hostUrl: meta.dispatchContext.hostUrl, addedAt: payload.timestamp, lastAuthAt: payload.timestamp, requiresPassphrase: org.settings.crypto.requiresPassphrase, requiresLockout: org.settings.crypto.requiresLockout, lockoutMs: org.settings.crypto.lockoutMs }), (payload.hostType == "cloud"
        ? {
            hostType: "cloud",
            deploymentTag: undefined,
        }
        : {
            hostType: "self-hosted",
            deploymentTag: payload.deploymentTag,
        }));
};
exports.newAccountStateProducer = newAccountStateProducer;
const waitForStateCondition = async (store, context, conditionFn, timeout = 60000) => {
    let state = getState(store, context);
    let total = 0;
    while (!conditionFn(state)) {
        await (0, wait_1.wait)(50);
        total += 50;
        if (timeout && total > timeout) {
            (0, logger_1.log)("waitForStateCondition timeout", { timeout, total });
            (0, logger_1.log)("conditionFn: " + conditionFn.toString());
            console.trace();
            throw new Error("Timeout waiting for state condition");
        }
        state = getState(store, context);
    }
};
exports.waitForStateCondition = waitForStateCondition;
//# sourceMappingURL=index.js.map