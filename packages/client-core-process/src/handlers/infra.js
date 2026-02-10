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
const handler_1 = require("../handler");
const types_1 = require("@envkey/core/types");
const bootstrap_deployments_1 = require("@envkey/infra/bootstrap-deployments");
const infra_1 = require("@envkey/core/lib/infra");
const logger_1 = require("@envkey/core/lib/utils/logger");
const stack_constants_1 = require("@envkey/infra/stack-constants");
const aws_helpers_1 = require("@envkey/infra/aws-helpers");
const artifact_helpers_1 = require("@envkey/infra/artifact-helpers");
const status_1 = require("../lib/status");
const semver = __importStar(require("semver"));
const R = __importStar(require("ramda"));
const MAX_RELEASE_NOTES = 10;
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.DEPLOY_SELF_HOSTED,
    stateProducer: (draft, action) => {
        delete draft.deploySelfHostedError;
        draft.isDeployingSelfHosted = true;
    },
    successStateProducer: (draft, { payload }) => {
        draft.pendingSelfHostedDeployments.push(payload);
    },
    failureStateProducer: (draft, { payload }) => {
        draft.deploySelfHostedError = payload;
    },
    endStateProducer: (draft, action) => {
        delete draft.isDeployingSelfHosted;
        delete draft.deploySelfHostedStatus;
    },
    handler: async (state, { payload }, { context, dispatchSuccess, dispatchFailure }) => {
        const subdomain = (0, infra_1.generateSubdomain)();
        const deploymentTag = (0, infra_1.generateDeploymentTag)();
        const bootstrapParams = Object.assign(Object.assign({}, payload), { subdomain,
            deploymentTag, updateStatus: (status) => {
                (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.SET_DEPLOY_SELF_HOSTED_STATUS,
                    payload: { status },
                }, context);
            } });
        try {
            await (0, aws_helpers_1.preDeployValidations)(payload);
            const [awsAccountId] = await Promise.all([
                (0, aws_helpers_1.getAwsAccountId)(payload.profile),
                (0, bootstrap_deployments_1.bootstrapSelfHostedDeployment)(bootstrapParams),
            ]);
            const codebuildLink = (0, stack_constants_1.getCodebuildInstallLink)(deploymentTag, payload.primaryRegion, awsAccountId);
            return dispatchSuccess(Object.assign(Object.assign({}, payload), { type: "pendingSelfHostedDeployment", hostUrl: `${subdomain}.${payload.domain}`, addedAt: Date.now(), subdomain, domain: payload.domain, deploymentTag,
                codebuildLink, internalMode: payload.internalMode }), context);
        }
        catch (err) {
            (0, logger_1.log)("failed bootstrapping self-hosted", { err, bootstrapParams });
            return dispatchFailure({
                type: "error",
                error: true,
                errorStatus: 500,
                errorReason: err.message,
            }, context);
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_DEPLOY_SELF_HOSTED_STATUS,
    stateProducer: (draft, { payload: { status } }) => {
        draft.deploySelfHostedStatus = status;
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CHECK_SELF_HOSTED_UPGRADES_AVAILABLE,
    stateProducer: (draft, action) => {
        delete draft.checkSelfHostedUpgradesAvailableError;
        draft.isCheckingSelfHostedUpgradesAvailable = true;
    },
    successStateProducer: (draft, { payload }) => {
        draft.selfHostedUpgradesAvailable = payload;
    },
    failureStateProducer: (draft, { payload }) => {
        draft.checkSelfHostedUpgradesAvailableError = payload;
    },
    endStateProducer: (draft, action) => {
        delete draft.isCheckingSelfHostedUpgradesAvailable;
    },
    handler: async (state, { payload }, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        let apiVersionsAvailable;
        let infraVersionsAvailable;
        const fromApiVersion = payload.lowestCurrentApiVersion;
        const fromInfraVersion = payload.lowestCurrentInfraVersion;
        try {
            // Note that this will only work for public releases
            [apiVersionsAvailable, infraVersionsAvailable] = await Promise.all([
                (0, artifact_helpers_1.listVersionsGT)({
                    tagPrefix: "apienterprise",
                    currentVersionNumber: fromApiVersion,
                    bucket: stack_constants_1.ENVKEY_RELEASES_BUCKET,
                }),
                (0, artifact_helpers_1.listVersionsGT)({
                    tagPrefix: "infra",
                    currentVersionNumber: fromInfraVersion,
                    bucket: stack_constants_1.ENVKEY_RELEASES_BUCKET,
                }),
            ]);
            (0, logger_1.log)("api versions available:", apiVersionsAvailable);
            (0, logger_1.log)("infra versions available:", infraVersionsAvailable);
        }
        catch (err) {
            return dispatchFailure(err, context);
        }
        if (apiVersionsAvailable.length == 0 &&
            infraVersionsAvailable.length == 0) {
            (0, logger_1.log)("No new self-hosted upgrades available.");
            return dispatchSuccess(state.selfHostedUpgradesAvailable, context);
        }
        const available = R.clone(state.selfHostedUpgradesAvailable);
        const releaseNotesPromises = [];
        for (let [project, availableUpgradesKey, versions, fromVersion] of [
            ["apienterprise", "api", apiVersionsAvailable, fromApiVersion],
            ["infra", "infra", infraVersionsAvailable, fromInfraVersion],
        ]) {
            if (versions.length == 0) {
                continue;
            }
            // these are in descending order, so latest versions are at 0 index
            const latest = versions[0];
            if (!available[availableUpgradesKey]) {
                available[availableUpgradesKey] = { latest, releaseNotes: {} };
            }
            available[availableUpgradesKey].latest = latest;
            (0, logger_1.log)(`Self-hosted ${project} upgrade available. Lowest current version: ${fromVersion}. Latest version: ${latest}. Fetching release notes for up to ${MAX_RELEASE_NOTES} most recent versions.`);
            if (latest && semver.gt(latest, fromVersion)) {
                (0, logger_1.log)(`queuing release note promises: ${project}`);
                for (let version of versions) {
                    if ((_a = available[availableUpgradesKey]) === null || _a === void 0 ? void 0 : _a.releaseNotes[version]) {
                        continue;
                    }
                    releaseNotesPromises.push((0, artifact_helpers_1.readReleaseNotesFromS3)({
                        project,
                        version,
                        bucket: stack_constants_1.ENVKEY_RELEASES_BUCKET,
                    }).then((notes) => [availableUpgradesKey, version, notes]));
                }
            }
        }
        (0, logger_1.log)("Fetching release notes..");
        try {
            const notesRes = await Promise.all(releaseNotesPromises);
            return dispatchSuccess(notesRes.reduce((agg, [availableUpgradesKey, version, notes]) => R.assocPath([availableUpgradesKey, "releaseNotes", version], notes, agg), available), context);
        }
        catch (err) {
            (0, logger_1.log)("Error fetching release notes:", { err });
            return dispatchFailure(err, context);
        }
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SKIP_SELF_HOSTED_UPGRADE_FOR_NOW,
    procStateProducer: (draft) => {
        draft.skippedSelfHostedUpgradeAt = Date.now();
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_PENDING_SELF_HOSTED_DEPLOYMENT,
    procStateProducer: (draft, { payload }) => {
        draft.pendingSelfHostedDeployments =
            draft.pendingSelfHostedDeployments.filter(({ deploymentTag }) => deploymentTag != payload.deploymentTag);
    },
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.UPGRADE_SELF_HOSTED, loggableType: "orgAction", authenticated: true, graphAction: true, successStateProducer: (draft) => {
        delete draft.skippedSelfHostedUpgradeAt;
        draft.selfHostedUpgradesAvailable = {};
    } }, (0, status_1.statusProducers)("isDispatchingSelfHostedUpgrade", "upgradeSelfHostedError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.SELF_HOSTED_RESYNC_FAILOVER, loggableType: "orgAction", authenticated: true, graphAction: true }, (0, status_1.statusProducers)("isResyncingFailover", "resyncFailoverError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.UPGRADE_SELF_HOSTED_FORCE_CLEAR, loggableType: "orgAction", authenticated: true, graphAction: true }, (0, status_1.statusProducers)("isDispatchingUpgradeForceClear", "upgradeForceClearError")));
//# sourceMappingURL=infra.js.map