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
exports.updateObjectProducers = exports.updateFirewallProducers = exports.updateSettingsProducers = exports.renameObjectProducers = exports.removeObjectProducers = exports.reorderStatusProducers = exports.objectStatusProducers = exports.statusProducers = void 0;
const R = __importStar(require("ramda"));
const object_1 = require("@envkey/core/lib/utils/object");
const statusProducers = (statusKey, errorKey) => ({
    stateProducer: (draft) => {
        draft[statusKey] = true;
        delete draft[errorKey];
    },
    failureStateProducer: (draft, { payload }) => {
        draft[errorKey] = payload;
    },
    endStateProducer: (draft) => {
        delete draft[statusKey];
    },
}), objectStatusProducers = (statusKey, errorKey) => ({
    stateProducer: (draft, { type, payload: { id } }) => {
        draft[statusKey][id] = true;
        delete draft[errorKey][id];
    },
    failureStateProducer: (draft, { meta: { rootAction: { payload: { id }, }, }, payload, }) => {
        draft[errorKey][id] = payload;
    },
    endStateProducer: (draft, { meta: { rootAction: { payload: { id }, }, }, }) => {
        delete draft[statusKey][id];
    },
}), reorderStatusProducers = (reorderType) => ({
    stateProducer: (draft, { payload }) => {
        const id = (("appId" in payload && payload.appId) ||
            ("appGroupId" in payload && payload.appGroupId) ||
            ("blockGroupId" in payload && payload.blockGroupId));
        draft.isReorderingAssociations = R.assocPath([id, reorderType], true, draft.isReorderingAssociations);
        draft.reorderAssociationsErrors = (0, object_1.stripEmptyRecursive)(R.dissocPath([id, reorderType], draft.reorderAssociationsErrors));
    },
    failureStateProducer: (draft, { meta: { rootAction: { payload: rootPayload }, }, payload, }) => {
        const id = (("appId" in rootPayload && rootPayload.appId) ||
            ("appGroupId" in rootPayload && rootPayload.appGroupId) ||
            ("blockGroupId" in rootPayload && rootPayload.blockGroupId));
        draft.reorderAssociationsErrors = R.assocPath([id, reorderType], payload, draft.reorderAssociationsErrors);
    },
    endStateProducer: (draft, { meta: { rootAction: { payload: rootPayload }, }, }) => {
        const id = (("appId" in rootPayload && rootPayload.appId) ||
            ("appGroupId" in rootPayload && rootPayload.appGroupId) ||
            ("blockGroupId" in rootPayload && rootPayload.blockGroupId));
        draft.isReorderingAssociations = (0, object_1.stripEmptyRecursive)(R.dissocPath([id, reorderType], draft.isReorderingAssociations));
    },
});
exports.statusProducers = statusProducers, exports.objectStatusProducers = objectStatusProducers, exports.reorderStatusProducers = reorderStatusProducers, exports.removeObjectProducers = (0, exports.objectStatusProducers)("isRemoving", "removeErrors"), exports.renameObjectProducers = (0, exports.objectStatusProducers)("isRenaming", "renameErrors"), exports.updateSettingsProducers = (0, exports.objectStatusProducers)("isUpdatingSettings", "updateSettingsErrors"), exports.updateFirewallProducers = (0, exports.objectStatusProducers)("isUpdatingFirewall", "updateFirewallErrors"), exports.updateObjectProducers = (0, exports.objectStatusProducers)("isUpdating", "updateErrors");
//# sourceMappingURL=status.js.map