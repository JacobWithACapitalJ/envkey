"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocalSocketImportStatusIfNeeded = exports.updateLocalSocketEnvActionStatusIfNeeded = void 0;
const object_1 = require("@envkey/core/lib/utils/object");
const updateLocalSocketEnvActionStatusIfNeeded = (state, context) => {
    var _a;
    (_a = context.localSocketUpdate) === null || _a === void 0 ? void 0 : _a.call(context, {
        type: "envActionStatus",
        status: (0, object_1.pick)([
            "cryptoStatus",
            "isFetchingEnvs",
            "isFetchingChangesets",
            "isLoadingInvite",
            "isLoadingDeviceGrant",
            "isLoadingRecoveryKey",
            "isProcessingApi",
        ], state),
    });
};
exports.updateLocalSocketEnvActionStatusIfNeeded = updateLocalSocketEnvActionStatusIfNeeded;
const updateLocalSocketImportStatusIfNeeded = (state, context) => {
    var _a;
    const msg = {
        type: "importStatus",
        status: (0, object_1.pick)([
            "importOrgStatus",
            "isImportingOrg",
            "importOrgError",
            "v1UpgradeStatus",
            "v1UpgradeError",
            "v1UpgradeLoaded",
            "v1ClientAliveAt",
            "importOrgServerErrors",
            "importOrgLocalKeyErrors",
        ], state),
    };
    (_a = context.localSocketUpdate) === null || _a === void 0 ? void 0 : _a.call(context, msg);
};
exports.updateLocalSocketImportStatusIfNeeded = updateLocalSocketImportStatusIfNeeded;
//# sourceMappingURL=status.js.map