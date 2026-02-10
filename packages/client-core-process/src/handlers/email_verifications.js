"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../handler");
const types_1 = require("@envkey/core/types");
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_EMAIL_VERIFICATION,
    loggableType: "hostAction",
    stateProducer: (draft, { payload }) => {
        draft.isVerifyingEmail = true;
        draft.verifyingEmail = payload.email;
        delete draft.verifyEmailError;
        delete draft.verifyEmailCodeError;
        delete draft.isVerifyingEmailCode;
        delete draft.emailVerificationCode;
    },
    endStateProducer: (draft) => {
        delete draft.isVerifyingEmail;
    },
    failureStateProducer: (draft, { meta, payload }) => {
        const userId = meta.accountIdOrCliKey; // sign_in
        if (userId && payload.type === "signInWrongProviderError") {
            const expectedProvider = payload.providers[0];
            draft.orgUserAccounts[userId] = Object.assign(Object.assign({}, draft.orgUserAccounts[userId]), { provider: expectedProvider.provider, externalAuthProviderId: expectedProvider.externalAuthProviderId });
        }
        draft.verifyEmailError = payload;
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CHECK_EMAIL_TOKEN_VALID,
    loggableType: "hostAction",
    stateProducer: (draft, { payload }) => {
        draft.isVerifyingEmailCode = true;
        delete draft.verifyEmailCodeError;
    },
    endStateProducer: (draft) => {
        delete draft.isVerifyingEmailCode;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.verifyEmailCodeError = payload;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_EMAIL_VERIFICATION,
    stateProducer: (draft) => {
        delete draft.verifyEmailError;
        delete draft.verifyEmailCodeError;
        delete draft.verifyingEmail;
        delete draft.emailVerificationCode;
        delete draft.isVerifyingEmail;
        delete draft.isVerifyingEmailCode;
    },
});
//# sourceMappingURL=email_verifications.js.map