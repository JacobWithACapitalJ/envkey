"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdaterProject = exports.createInstallerProject = exports.createCodebuildRoleIfNeeded = exports.bootstrapSelfHostedDeployment = void 0;
// Run from CLI by an end user (via core process register action),
// to startup the big deploy which runs out of CodeBuild using the latest versions of everything.
const stack_constants_1 = require("./stack-constants");
const aws_sdk_1 = require("aws-sdk");
const codebuild_1 = __importDefault(require("aws-sdk/clients/codebuild"));
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const iam_1 = __importDefault(require("aws-sdk/clients/iam"));
const aws_helpers_1 = require("./aws-helpers");
const artifact_helpers_1 = require("./artifact-helpers");
const secretsmanager_1 = __importDefault(require("aws-sdk/clients/secretsmanager"));
const bootstrapSelfHostedDeployment = async (params) => {
    var _a, _b;
    if (params.failoverRegion && params.failoverRegion == params.primaryRegion) {
        throw new Error("Failover region can't be the same as primary region");
    }
    const credentials = new aws_sdk_1.SharedIniFileCredentials({
        profile: params.profile,
    });
    const codebuild = new codebuild_1.default({
        region: params.primaryRegion,
        credentials,
    });
    const sns = new aws_sdk_1.SNS({ region: params.primaryRegion, credentials });
    const s3 = new s3_1.default({
        region: params.primaryRegion,
        credentials,
    });
    const secrets = new secretsmanager_1.default({
        region: params.primaryRegion,
        credentials,
    });
    const iam = new iam_1.default({
        credentials,
    });
    const sourcesBucketName = (0, stack_constants_1.getSourcesBucketName)(params.deploymentTag);
    const snsAlertTopicName = (0, stack_constants_1.getSnsAlertTopicName)(params.deploymentTag);
    const overrideBucket = "overrideReleaseBucket" in params && params.overrideReleaseBucket
        ? params.overrideReleaseBucket
        : undefined;
    const bucket = overrideBucket || stack_constants_1.ENVKEY_RELEASES_BUCKET;
    const creds = "creds" in params ? params.creds : undefined;
    params.updateStatus("Determining latest API and Infrastructure versions...");
    const apiVersionNumber = (_a = params.apiVersionNumber) !== null && _a !== void 0 ? _a : (await (0, artifact_helpers_1.getLatestReleaseVersion)({
        project: "apienterprise",
        creds,
        bucket,
    }));
    const infraVersionNumber = (_b = params.infraVersionNumber) !== null && _b !== void 0 ? _b : (await (0, artifact_helpers_1.getLatestReleaseVersion)({
        project: "infra",
        creds,
        bucket,
    }));
    params.updateStatus("EnvKey API version: " +
        apiVersionNumber +
        "\n" +
        "EnvKey Infrastructure version: " +
        infraVersionNumber);
    await (0, aws_helpers_1.putDeployTag)({
        profile: params.profile,
        primaryRegion: params.primaryRegion,
        deploymentTag: params.deploymentTag,
    });
    let s3CredsSecretArn;
    if (creds) {
        ({ ARN: s3CredsSecretArn } = await secrets
            .createSecret({
            SecretString: JSON.stringify(creds),
            Name: (0, stack_constants_1.getS3CredsSecretName)(params.deploymentTag),
        })
            .promise());
    }
    const codebuildPersistCreds = s3CredsSecretArn
        ? {
            // pre-release aws creds are the only one that'd be used for self-hosted, and this
            // would indicate a developer is testing a self-hosted version
            s3CredsSecretArn,
        }
        : {};
    const extraCodebuildEnvVars = overrideBucket
        ? [
            {
                name: "ENVKEY_RELEASES_BUCKET",
                value: overrideBucket,
            },
        ]
        : [];
    const topic = await sns
        .createTopic({
        Name: snsAlertTopicName,
    })
        .promise();
    await sns
        .subscribe({
        Endpoint: params.infraAlertsEmail,
        Protocol: "email",
        TopicArn: topic.TopicArn,
    })
        .promise();
    params.updateStatus("Setting up an EnvKey build project role...");
    const codebuildRole = await (0, exports.createCodebuildRoleIfNeeded)({
        iam,
        deploymentTag: params.deploymentTag,
    });
    params.updateStatus("Creating source S3 bucket...");
    await (0, aws_helpers_1.createBucketIfNeeded)(s3)(sourcesBucketName);
    params.updateStatus("Copying installer into your source bucket...");
    const installerZip = await (0, artifact_helpers_1.getReleaseAsset)({
        releaseTag: `infra-v${infraVersionNumber}`,
        assetName: stack_constants_1.installerFile,
        creds,
        bucket,
    });
    await s3
        .putObject({
        Bucket: sourcesBucketName,
        Key: stack_constants_1.installerFile,
        Body: installerZip,
    })
        .promise();
    params.updateStatus("Creating EnvKey build projects...");
    const updaterZip = await (0, artifact_helpers_1.getReleaseAsset)({
        releaseTag: `infra-v${infraVersionNumber}`,
        assetName: stack_constants_1.updaterFile,
        creds,
        bucket,
    });
    await s3
        .putObject({
        Bucket: sourcesBucketName,
        Key: stack_constants_1.updaterFile,
        Body: updaterZip,
    })
        .promise();
    await Promise.all([
        // installer
        await (0, exports.createInstallerProject)(Object.assign({ codebuild, domain: params.domain, primaryRegion: params.primaryRegion, failoverRegion: params.failoverRegion, verifiedSenderEmail: params.verifiedSenderEmail, deploymentTag: params.deploymentTag, subdomain: params.subdomain, snsTopicArn: topic.TopicArn, apiVersionNumber,
            infraVersionNumber, failoverVersionNumber: params.failoverVersionNumber, isCustomDomain: params.customDomain ? "1" : "", notifySmsWhenDone: params.notifySmsWhenDone, registerAction: params.registerAction, serviceRole: codebuildRole.Arn, extraCodebuildEnvVars, internalMode: params.internalMode, authorizedAccounts: params.authorizedAccounts, deployWaf: params.deployWaf }, codebuildPersistCreds)),
        // updater
        await (0, exports.createUpdaterProject)(Object.assign({ codebuild, deploymentTag: params.deploymentTag, serviceRole: codebuildRole.Arn, snsTopicArn: topic.TopicArn, extraCodebuildEnvVars }, codebuildPersistCreds)),
    ]);
    params.updateStatus("Kicking off EnvKey install...");
    await codebuild
        .startBuild({
        projectName: stack_constants_1.codebuildProjectNames.initialInstall(params.deploymentTag),
    })
        .promise();
};
exports.bootstrapSelfHostedDeployment = bootstrapSelfHostedDeployment;
const createCodebuildRoleIfNeeded = async (params) => {
    const { iam, deploymentTag } = params;
    const codebuildRoleName = (0, stack_constants_1.getCodebuildRoleName)(deploymentTag);
    try {
        const { Role } = await iam
            .getRole({ RoleName: codebuildRoleName })
            .promise();
        if (Role) {
            return Role;
        }
    }
    catch (ignored) { }
    const codebuildRole = await iam
        .createRole({
        AssumeRolePolicyDocument: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: {
                        Service: ["codebuild.amazonaws.com"],
                    },
                    Action: ["sts:AssumeRole"],
                },
            ],
        }),
        Path: "/",
        RoleName: codebuildRoleName,
    })
        .promise();
    // Important: policy takes a few seconds to attach, despite the promise returning!
    await iam
        .attachRolePolicy({
        RoleName: codebuildRoleName,
        PolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
    })
        .promise();
    return codebuildRole.Role;
};
exports.createCodebuildRoleIfNeeded = createCodebuildRoleIfNeeded;
const createInstallerProject = async (params) => {
    var _a, _b, _c;
    const { codebuild, deploymentTag, serviceRole } = params;
    const sourcesBucketName = (0, stack_constants_1.getSourcesBucketName)(deploymentTag);
    const environmentVariables = [
        { name: "PRIMARY_REGION", value: params.primaryRegion },
        { name: "DOMAIN", value: params.domain },
        {
            name: "SENDER_EMAIL",
            value: params.verifiedSenderEmail,
        },
        { name: "DEPLOYMENT_TAG", value: deploymentTag },
        { name: "SUBDOMAIN", value: params.subdomain },
        { name: "SNS_TOPIC_ARN", value: params.snsTopicArn },
        { name: "API_VERSION_NUMBER", value: params.apiVersionNumber },
        { name: "INFRA_VERSION_NUMBER", value: params.infraVersionNumber },
        {
            name: "FAILOVER_VERSION_NUMBER",
            value: params.failoverVersionNumber || "",
        },
        {
            name: "USE_CUSTOM_DOMAIN",
            value: params.isCustomDomain || "",
        },
        {
            name: "FAILOVER_REGION",
            value: (_a = params.failoverRegion) !== null && _a !== void 0 ? _a : "",
        },
        {
            name: "INTERNAL_MODE",
            value: params.internalMode ? "1" : "",
        },
        {
            name: "DEPLOY_WAF",
            value: params.deployWaf ? "1" : "",
        },
        {
            name: "AUTHORIZED_ACCOUNTS_JSON",
            value: params.internalMode
                ? JSON.stringify(params.authorizedAccounts)
                : "",
        },
        // optionals
        {
            name: "NOTIFY_SMS_WHEN_DONE",
            value: (_b = params.notifySmsWhenDone) !== null && _b !== void 0 ? _b : "",
        },
        {
            name: "REGISTER_ACTION",
            value: params.registerAction ? JSON.stringify(params.registerAction) : "",
        },
    ];
    if ((_c = params.extraCodebuildEnvVars) === null || _c === void 0 ? void 0 : _c.length) {
        environmentVariables.push(...params.extraCodebuildEnvVars);
    }
    if ("s3CredsSecretArn" in params && params.s3CredsSecretArn) {
        environmentVariables.push({
            name: "ENVKEY_RELEASES_S3_CREDS_JSON",
            // the docs are confusing for this; it's just the secret arn
            value: params.s3CredsSecretArn,
            type: "SECRETS_MANAGER",
        });
    }
    await codebuild
        .createProject({
        name: stack_constants_1.codebuildProjectNames.initialInstall(deploymentTag),
        artifacts: { type: "NO_ARTIFACTS" },
        environment: {
            privilegedMode: true, // for docker
            computeType: "BUILD_GENERAL1_SMALL",
            image: "aws/codebuild/standard:4.0",
            imagePullCredentialsType: "CODEBUILD",
            type: "LINUX_CONTAINER",
            environmentVariables,
        },
        serviceRole,
        source: {
            type: "S3",
            location: `${sourcesBucketName}/${stack_constants_1.installerFile}`,
            buildspec: stack_constants_1.installerBuildspec,
        },
        timeoutInMinutes: 90,
    })
        .promise();
};
exports.createInstallerProject = createInstallerProject;
const createUpdaterProject = async (params) => {
    var _a;
    const { codebuild, deploymentTag, snsTopicArn, serviceRole } = params;
    const sourcesBucketName = (0, stack_constants_1.getSourcesBucketName)(deploymentTag);
    const environmentVariables = [
        { name: "DEPLOYMENT_TAG", value: deploymentTag },
        {
            name: "SNS_TOPIC_ARN",
            value: snsTopicArn,
        },
        // the next three be updated later when an actual api update is needed
        { name: "API_VERSION_NUMBER", value: "" },
        { name: "INFRA_VERSION_NUMBER_TO", value: "" },
        // Allows testing deployments or overriding deployments by deploying using a specific version
        // of the Infra which is different than its published latest infra-version.txt on main.
        { name: "RUN_FROM_INFRA_VERSION_NUMBER_OVERRIDE", value: "" },
    ];
    if ((_a = params.extraCodebuildEnvVars) === null || _a === void 0 ? void 0 : _a.length) {
        environmentVariables.push(...params.extraCodebuildEnvVars);
    }
    if ("s3CredsSecretArn" in params && params.s3CredsSecretArn) {
        environmentVariables.push({
            name: "ENVKEY_RELEASES_S3_CREDS_JSON",
            // the docs are confusing for this; it's just the secret arn
            value: params.s3CredsSecretArn,
            type: "SECRETS_MANAGER",
        });
    }
    await codebuild
        .createProject({
        name: stack_constants_1.codebuildProjectNames.updater(deploymentTag),
        artifacts: { type: "NO_ARTIFACTS" },
        environment: {
            privilegedMode: true, // for docker
            computeType: "BUILD_GENERAL1_SMALL",
            image: "aws/codebuild/standard:4.0",
            imagePullCredentialsType: "CODEBUILD",
            type: "LINUX_CONTAINER",
            environmentVariables,
        },
        serviceRole,
        source: {
            type: "S3",
            location: `${sourcesBucketName}/${stack_constants_1.updaterFile}`,
            buildspec: stack_constants_1.updaterBuildspec,
        },
        timeoutInMinutes: 60,
    })
        .promise();
};
exports.createUpdaterProject = createUpdaterProject;
//# sourceMappingURL=bootstrap-deployments.js.map