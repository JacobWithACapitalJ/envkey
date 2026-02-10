"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../lib/state");
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const client_1 = require("@envkey/core/lib/client");
const pick_1 = require("@envkey/core/lib/utils/pick");
const env_1 = require("@envkey/client-shared/src/env");
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.REGISTER,
    stateProducer: (draft, action) => {
        draft.isRegistering = true;
        delete draft.registrationError;
        delete draft.deploySelfHostedError;
    },
    endStateProducer: (draft, action) => {
        delete draft.isRegistering;
    },
    failureStateProducer: (draft, action) => {
        draft.registrationError = action.payload;
        draft.graph = {};
        delete draft.graphUpdatedAt;
        delete draft.trustedRoot;
        delete draft.signedTrustedRoot;
        draft.trustedSessionPubkeys = {};
    },
    handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        const { payload } = action;
        const { privkey, pubkey } = await (0, proxy_1.generateKeys)();
        const pubkeyId = (0, client_1.getPubkeyHash)(pubkey);
        const trustedRoot = {
            [pubkeyId]: ["root", pubkey],
        };
        const registerBasePayload = Object.assign(Object.assign({}, (0, pick_1.pick)(["org", "user", "test"], payload)), { device: {
                name: payload.device.name,
                pubkey,
                signedTrustedRoot: {
                    data: await (0, proxy_1.signJson)({
                        data: trustedRoot,
                        privkey,
                    }),
                },
            } });
        let registerPayload;
        if (payload.hostType == "self-hosted") {
            registerPayload = Object.assign(Object.assign({}, registerBasePayload), { hostType: payload.hostType, provider: "email", domain: payload.domain, selfHostedFailoverRegion: payload.failoverRegion });
        }
        else if (payload.hostType == "community") {
            registerPayload = Object.assign(Object.assign({}, registerBasePayload), { hostType: payload.hostType, provider: "email", emailVerificationToken: payload.emailVerificationToken, communityAuth: payload.communityAuth });
        }
        else if (payload.provider == "email") {
            registerPayload = Object.assign(Object.assign({}, registerBasePayload), { hostType: payload.hostType, provider: "email", emailVerificationToken: payload.emailVerificationToken, v1Upgrade: payload.v1Upgrade });
        }
        else {
            registerPayload = Object.assign(Object.assign({}, registerBasePayload), { hostType: payload.hostType, provider: payload.provider, externalAuthSessionId: payload.externalAuthSessionId });
        }
        const apiRegisterAction = {
            type: types_1.Api.ActionType.REGISTER,
            payload: registerPayload,
            meta: {
                loggableType: "authAction",
                loggableType2: "orgAction",
                client: context.client,
            },
        };
        const dispatchContext = Object.assign(Object.assign({}, context), { rootClientAction: action, dispatchContext: {
                privkey,
                pubkey,
                trustedRoot,
                hostUrl: (_a = context.hostUrl) !== null && _a !== void 0 ? _a : (0, env_1.getDefaultApiHostUrl)(),
            } });
        // cloud OR dev-only local self-hosted setup registration
        if (payload.hostType === "cloud" ||
            payload.hostType == "community" ||
            payload.devOnlyLocalSelfHosted) {
            let failureAction;
            const apiRegisterRes = await (0, handler_1.dispatch)(apiRegisterAction, dispatchContext);
            if (apiRegisterRes.success) {
                const successPayload = apiRegisterRes.resultAction
                    .payload;
                return dispatchSuccess(successPayload, Object.assign(Object.assign({}, context), { accountIdOrCliKey: successPayload.userId }));
            }
            else {
                failureAction =
                    apiRegisterRes.resultAction;
                return dispatchFailure(failureAction.payload, context);
            }
        } // end CLOUD / COMMUNITY / DEV-ONLY LOCAL SELF-HOSTED
        // SELF-HOSTED
        // kick off deployment in the background
        // it will continually update client state with status,
        // then add entry to state.pendingSelfHostedDeployments when codebuild
        // project has successfully started
        (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.DEPLOY_SELF_HOSTED,
            payload: Object.assign(Object.assign(Object.assign({ hostType: "self-hosted" }, (0, pick_1.pick)([
                "profile",
                "primaryRegion",
                "domain",
                "customDomain",
                "verifiedSenderEmail",
                "notifySmsWhenDone",
                "apiVersionNumber",
                "infraVersionNumber",
                "failoverVersionNumber",
                "overrideReleaseBucket",
                "creds",
                "failoverRegion",
                "deployWaf",
                "internalMode",
                "authorizedAccounts",
                "infraAlertsEmail",
            ], payload)), { registerAction: apiRegisterAction, deviceName: payload.device.name, orgName: payload.org.name, privkey, provider: "email", uid: payload.user.email, requiresPassphrase: payload.org.settings.crypto.requiresPassphrase, requiresLockout: payload.org.settings.crypto.requiresLockout, lockoutMs: payload.org.settings.crypto.lockoutMs }), payload.user),
        }, context);
        return dispatchSuccess(null, context);
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.REGISTER,
    loggableType: "authAction",
    successAccountIdFn: (payload) => payload.userId,
    successStateProducer: (draft, action) => {
        (0, state_1.newAccountStateProducer)(draft, action);
        const { meta } = action;
        draft.trustedRoot = meta.dispatchContext.trustedRoot;
        draft.trustedSessionPubkeys = {};
        delete draft.verifyingEmail;
        delete draft.emailVerificationCode;
    },
});
//# sourceMappingURL=registrations.js.map