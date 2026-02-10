"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBearerSecret = void 0;
const handler_1 = require("@envkey/client-core-process/handler");
const types_1 = require("@envkey/core/types");
const status_1 = require("@envkey/client-core-process/lib/status");
const utils_1 = require("@envkey/core/lib/crypto/utils");
const generateBearerSecret = () => {
    const secret = ["ekb", (0, utils_1.secureRandomAlphanumeric)(22)].join("_");
    const hash = (0, utils_1.sha256)(secret);
    return { secret, hash };
};
exports.generateBearerSecret = generateBearerSecret;
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CREATE_SCIM_PROVISIONING_PROVIDER, loggableType: "orgAction", graphAction: true, authenticated: true, serialAction: true }, (0, status_1.statusProducers)("isCreatingProvisioningProvider", "createProvisioningProviderError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.UPDATE_SCIM_PROVISIONING_PROVIDER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isUpdatingProvisioningProvider", "updateProvisioningProviderError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_SCIM_PROVISIONING_PROVIDER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isDeletingProvisioningProvider", "deleteProvisioningProviderError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.LIST_INVITABLE_SCIM_USERS, loggableType: "authAction", loggableType2: "scimAction", authenticated: true }, (0, status_1.statusProducers)("isListingInvitableScimUsers", "listInvitableScimUsersError")));
//# sourceMappingURL=scim.js.map