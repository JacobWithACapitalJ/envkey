"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeGetParameter = exports.listDeploymentTags = exports.deleteDeployTag = exports.putDeployTag = exports.dangerouslyDeleteSecretsWithConfirm = exports.listCodebuildProjects = exports.dangerouslyDeleteS3BucketsWithConfirm = exports.getLatestBuild = exports.waitForBuild = exports.stackResult = exports.processTemplatesReturningFolder = exports.validateSenderEmail = exports.getAwsCertArnForDomain = exports.validateDomain = exports.getTagFilters = exports.getTagFinder = exports.getAwsAccountId = exports.createBucketIfNeeded = exports.stackExists = exports.preDeployValidations = void 0;
const aws_sdk_1 = require("aws-sdk");
const stack_constants_1 = require("./stack-constants");
const iam_1 = __importDefault(require("aws-sdk/clients/iam"));
const route53domains_1 = __importDefault(require("aws-sdk/clients/route53domains"));
const acm_1 = __importDefault(require("aws-sdk/clients/acm"));
const ses_1 = __importDefault(require("aws-sdk/clients/ses"));
const ssm_1 = __importDefault(require("aws-sdk/clients/ssm"));
const child_process_1 = require("child_process");
const lib_1 = require("./lib");
const { 
// only available on aws
CODEBUILD_BUILD_ARN, } = process.env;
const preDeployValidations = async (params) => {
    const { profile, primaryRegion, failoverRegion, domain, customDomain, verifiedSenderEmail, } = params;
    if (failoverRegion && failoverRegion == primaryRegion) {
        throw new Error("Failover region can't be the same as primary region");
    }
    const awsAccountId = await (0, exports.getAwsAccountId)(profile);
    console.log(`Using region ${primaryRegion} and failover region ${failoverRegion}.`);
    await (0, exports.validateSenderEmail)(profile, primaryRegion, verifiedSenderEmail);
    console.log(`Validated sender email allowed:\n  ${verifiedSenderEmail}`);
    if (customDomain) {
        console.log("Skipping domain validation and user must setup DNS later");
    }
    else {
        await (0, exports.validateDomain)(profile, domain);
        console.log(`Validated domain:\n  ${domain}`);
    }
    const certificateArn = await (0, exports.getAwsCertArnForDomain)(profile, primaryRegion, domain);
    console.log(`Using primary region certificate:\n  ${certificateArn}`);
    const failoverRegionCertificateArn = failoverRegion
        ? await (0, exports.getAwsCertArnForDomain)(profile, failoverRegion, domain)
        : undefined;
    if (failoverRegionCertificateArn) {
        console.log(`Using failover region certificate:\n  ${failoverRegionCertificateArn}`);
    }
    return { awsAccountId, certificateArn, failoverRegionCertificateArn };
};
exports.preDeployValidations = preDeployValidations;
const stackExists = async (client, name) => {
    try {
        const { Stacks } = await client
            .describeStacks({
            StackName: name,
        })
            .promise();
        if (!Stacks) {
            throw new Error("Error checking stack: " + name);
        }
        return Stacks[0].StackStatus == "CREATE_COMPLETE";
    }
    catch (err) {
        if (err.message.includes("does not exist")) {
            return false;
        }
        throw err;
    }
};
exports.stackExists = stackExists;
const createBucketIfNeeded = (s3Instance) => async (name) => {
    if (!(await doesBucketExist(s3Instance, name))) {
        await s3Instance
            .createBucket({
            Bucket: name,
            ACL: "private",
        })
            .promise();
    }
    await s3Instance
        .putPublicAccessBlock({
        Bucket: name,
        PublicAccessBlockConfiguration: {
            /* required */ BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true,
        },
    })
        .promise();
};
exports.createBucketIfNeeded = createBucketIfNeeded;
const doesBucketExist = async (s3, bucketName) => {
    try {
        await s3
            .headBucket({
            Bucket: bucketName,
        })
            .promise();
        return true;
    }
    catch (error) {
        if (error.statusCode === 404) {
            return false;
        }
        throw error;
    }
};
const getAwsAccountId = async (profile) => {
    if (CODEBUILD_BUILD_ARN) {
        console.log("Using codebuild ARN for accountId", CODEBUILD_BUILD_ARN);
        // cannot use getUser when running as a role in codebuild, and
        // codebuild does not document exposing the account ID in its own var.
        // arn format:
        //    `arn:aws:codebuild:region-ID:account-ID:build/codebuild-demo-project:b1e6661e-e4f2-4156-9ab9-82a19EXAMPLE`
        const arnParts = CODEBUILD_BUILD_ARN.split(":");
        return arnParts[4];
    }
    const credentials = profile
        ? new aws_sdk_1.SharedIniFileCredentials({
            profile,
        })
        : undefined;
    const user = await new iam_1.default({ credentials }).getUser().promise();
    const awsAccountId = user.User.Arn.split("arn:aws:iam::")[1].split(/:user|:root/)[0];
    return awsAccountId;
};
exports.getAwsAccountId = getAwsAccountId;
const getTagFinder = (deploymentTag) => (tag) => tag.Key == "envkey-deployment" && tag.Value == deploymentTag;
exports.getTagFinder = getTagFinder;
const getTagFilters = (deploymentTag) => [
    { Name: "tag:envkey-deployment", Values: [deploymentTag] },
];
exports.getTagFilters = getTagFilters;
const validateDomain = async (profile, domain) => {
    const credentials = profile
        ? new aws_sdk_1.SharedIniFileCredentials({
            profile,
        })
        : undefined;
    // only certain regions allow querying this endpint, but the domains are considered global
    const allDomains = await new route53domains_1.default({
        credentials,
        region: "us-east-1",
    })
        .listDomains()
        .promise();
    const d = allDomains.Domains.find((d) => domain.includes(d.DomainName));
    if (!d) {
        throw new Error(`AWS Route53 domain was not found for ${domain}. Did you mean to use an existing custom domain instead?`);
    }
};
exports.validateDomain = validateDomain;
const getAwsCertArnForDomain = async (profile, region, domain) => {
    var _a, _b, _c, _d;
    const credentials = profile
        ? new aws_sdk_1.SharedIniFileCredentials({
            profile,
        })
        : undefined;
    const allCerts = await new acm_1.default({ credentials, region })
        .listCertificates()
        .promise();
    const cert = (_a = allCerts === null || allCerts === void 0 ? void 0 : allCerts.CertificateSummaryList) === null || _a === void 0 ? void 0 : _a.find((c) => [`*.${domain}`, domain].includes(c.DomainName));
    if (!cert || !cert.CertificateArn) {
        throw new Error(`AWS ACM is missing a certificate for ${domain} in region ${region}. Check the region for the certificate, if it was already created. Found ${(_c = (_b = allCerts === null || allCerts === void 0 ? void 0 : allCerts.CertificateSummaryList) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0} certs. ${(_d = allCerts === null || allCerts === void 0 ? void 0 : allCerts.CertificateSummaryList) === null || _d === void 0 ? void 0 : _d.map((c) => c.DomainName)}`);
    }
    return cert.CertificateArn;
};
exports.getAwsCertArnForDomain = getAwsCertArnForDomain;
const validateSenderEmail = async (profile, region, senderEmail) => {
    const senderDomain = senderEmail.split("@")[1];
    if (!senderDomain) {
        throw new Error("Unexpected email format!");
    }
    const credentials = profile
        ? new aws_sdk_1.SharedIniFileCredentials({
            profile,
        })
        : undefined;
    const ses = new ses_1.default({ credentials, region });
    const { Identities: identities } = await ses
        .listIdentities({
        MaxItems: 1000,
    })
        .promise();
    const blurb = `The address ${senderEmail} must be verified with SES to continue. Email addresses are case sensitive.`;
    if (!identities || !identities.length) {
        throw new Error(`No verified SES email sender identities were found for ${region}. ${blurb}`);
    }
    const identity = identities.find((emailOrDomain) => {
        const identityIsDomain = !emailOrDomain.includes("@");
        if (identityIsDomain) {
            return emailOrDomain === senderDomain;
        }
        return emailOrDomain === senderEmail;
    });
    if (!identity) {
        throw new Error(`${blurb} Found ${identities.length} other verified sender identities in ${region}: ${identities.join(", ")}`);
    }
    // They added the email or domain.
    // Is it verified?
    const { VerificationAttributes: { [identity]: identityVerification }, } = await ses
        .getIdentityVerificationAttributes({
        Identities: [identity],
    })
        .promise();
    if (identityVerification.VerificationStatus !== "Success") {
        throw new Error(`Found SES sender identity, but it is not yet verified by AWS.`);
    }
    // ok
};
exports.validateSenderEmail = validateSenderEmail;
// extracts cloudformation templates to a folder `templates` within `containingFolder`, overwriting
// templates if they existed
const processTemplatesReturningFolder = async (containingFolder, zipFileName) => {
    const extractToFolder = `${containingFolder}/templates`;
    console.log("  Extracting templates to:", extractToFolder);
    (0, child_process_1.execSync)(`rm -rf ${extractToFolder}`);
    (0, child_process_1.execSync)(`mkdir -p ${extractToFolder}`);
    (0, child_process_1.execSync)(`unzip ${containingFolder}/${zipFileName} -d ${extractToFolder}`, {
        cwd: process.cwd(),
    });
    return extractToFolder;
};
exports.processTemplatesReturningFolder = processTemplatesReturningFolder;
const stackResult = async (client, name, allowRollbackOk) => {
    while (true) {
        const response = await client
            .describeStacks({
            StackName: name,
        })
            .promise();
        const { Stacks } = response;
        if (!Stacks) {
            console.log("Error fetching stack results", response);
            throw new Error("Error fetching stack status: " + name);
        }
        const status = Stacks[0].StackStatus;
        switch (status) {
            case "CREATE_COMPLETE":
            case "UPDATE_COMPLETE":
            case "DELETE_COMPLETE":
            case "ROLLBACK_COMPLETE":
            case "IMPORT_COMPLETE":
            case "IMPORT_ROLLBACK_COMPLETE":
                console.log("Stack task complete:\n ", status, name);
                const outputs = Stacks[0].Outputs, res = {};
                if (outputs) {
                    for (let { OutputKey, OutputValue } of outputs) {
                        res[OutputKey] = OutputValue;
                    }
                }
                return res;
            case "CREATE_IN_PROGRESS":
            case "UPDATE_IN_PROGRESS":
            case "UPDATE_ROLLBACK_COMPLETE":
            case "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS":
            case "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS":
            case "DELETE_IN_PROGRESS":
            // failures will trigger rollback straight away, rather than an error state
            case allowRollbackOk ? "ROLLBACK_IN_PROGRESS" : "__Not_Allowed":
            case "IMPORT_IN_PROGRESS":
            case "IMPORT_ROLLBACK_IN_PROGRESS":
                console.log(" ", status, name);
                await new Promise((resolve) => setTimeout(resolve, 10000));
                break;
            default:
                console.log("Error status:", response);
                throw new Error("Error creating stack: " + name);
        }
    }
};
exports.stackResult = stackResult;
const waitForBuild = async (codeBuild, buildId) => {
    while (true) {
        const { builds } = await codeBuild
            .batchGetBuilds({ ids: [buildId] })
            .promise();
        if (!builds) {
            throw new Error(`Failed waiting for build ${buildId}!`);
        }
        if (!builds[0]) {
            throw new Error(`Build ${buildId} not found!`);
        }
        const status = builds[0].buildStatus;
        switch (status) {
            case "IN_PROGRESS":
                console.log(" ", status, "build", buildId);
                await new Promise((resolve) => setTimeout(resolve, 10000));
                break;
            case "SUCCEEDED":
                console.log(" ", status, "build", buildId);
                return;
            default:
                throw new Error(`Build ${buildId} reached bad status ${status}`);
        }
    }
};
exports.waitForBuild = waitForBuild;
const getLatestBuild = async (codebuild, codebuildProjectName) => {
    const { ids } = await codebuild
        .listBuildsForProject({
        projectName: codebuildProjectName,
        sortOrder: "DESCENDING",
    })
        .promise();
    const buildId = ids === null || ids === void 0 ? void 0 : ids[0];
    if (!buildId) {
        return null;
    }
    const { builds } = await codebuild
        .batchGetBuilds({ ids: [buildId] })
        .promise();
    const build = builds === null || builds === void 0 ? void 0 : builds[0];
    if (!build) {
        return null;
    }
    const { id, buildStatus, buildNumber, environment } = build;
    const environmentVariables = environment
        .environmentVariables;
    return { id, buildStatus, buildNumber, environmentVariables };
};
exports.getLatestBuild = getLatestBuild;
const dangerouslyDeleteS3BucketsWithConfirm = async (params) => {
    const { s3, all, filterIgnore, filterInclude, dryRun, force } = params;
    const { Buckets: allBuckets } = await s3.listBuckets().promise();
    let filteredBuckets = (allBuckets === null || allBuckets === void 0 ? void 0 : allBuckets.filter((b) => { var _a; return (_a = b.Name) === null || _a === void 0 ? void 0 : _a.includes("envkey-"); })) || [];
    if (filterIgnore) {
        filteredBuckets = filteredBuckets.filter((b) => { var _a; return !((_a = b.Name) === null || _a === void 0 ? void 0 : _a.includes(filterIgnore)); });
    }
    else if (filterInclude) {
        filteredBuckets = filteredBuckets.filter((b) => { var _a; return (_a = b.Name) === null || _a === void 0 ? void 0 : _a.includes(filterInclude); });
    }
    if (!filteredBuckets.length) {
        console.log("  No buckets found");
        return;
    }
    console.log("  Buckets found:", filteredBuckets.length);
    if (dryRun) {
        console.log(" ", filteredBuckets.map((b) => b.Name).join("\n  "));
        return;
    }
    if (all && !force) {
        console.log(filteredBuckets.map((b) => b.Name));
        const res = await (0, lib_1.waitForEnterKeyPromise)(`\n  Delete all ${filteredBuckets.length} envkey buckets!? Enter number of buckets:  `);
        if (res !== filteredBuckets.length.toString()) {
            console.log("Aborted!");
            return;
        }
    }
    for (const bucket of filteredBuckets) {
        console.log("");
        const name = bucket.Name;
        if (!force) {
            const res = await (0, lib_1.waitForEnterKeyPromise)(`\n  Delete bucket ${name} ?? [n/y]  `);
            if (res !== "y") {
                console.log("  Skipping bucket", name);
                continue;
            }
        }
        try {
            let marker;
            let objects = [];
            while (true) {
                const { Contents, Marker } = await s3
                    .listObjects({
                    Bucket: name,
                    MaxKeys: 100,
                })
                    .promise();
                marker = Marker;
                if (Contents) {
                    objects.push(...Contents);
                }
                if (!(Contents === null || Contents === void 0 ? void 0 : Contents.length) || !Marker) {
                    break;
                }
            }
            console.log("  Emptying bucket:", name);
            console.log("    Items:", objects === null || objects === void 0 ? void 0 : objects.length);
            if (objects === null || objects === void 0 ? void 0 : objects.length) {
                for (const o of objects) {
                    const { Versions } = await s3
                        .listObjectVersions({ Bucket: name, Prefix: o.Key })
                        .promise();
                    if (Versions === null || Versions === void 0 ? void 0 : Versions.length) {
                        for (const v of Versions) {
                            try {
                                console.log("    Deleting version", o.Key, v.VersionId);
                                await s3
                                    .deleteObject({
                                    Bucket: name,
                                    Key: o.Key,
                                    VersionId: v.VersionId,
                                })
                                    .promise();
                            }
                            catch (err) {
                                console.error("    ", err.message);
                            }
                        }
                        continue;
                    }
                    await s3.deleteObject({ Bucket: name, Key: o.Key }).promise();
                }
            }
        }
        catch (err) {
            console.error(err.message);
            console.error("  Delete objects problem.");
            console.log("  Will try to delete bucket, still:", name);
        }
        console.log("  Deleting bucket:", name);
        await s3.deleteBucket({ Bucket: name }).promise();
        console.log("  Deleted bucket successfully:", name);
    }
};
exports.dangerouslyDeleteS3BucketsWithConfirm = dangerouslyDeleteS3BucketsWithConfirm;
const listCodebuildProjects = async (codeBuild, deploymentTag) => {
    const tagProjects = [];
    let nextToken;
    while (true) {
        const { projects, nextToken: nt } = await codeBuild
            .listProjects(nextToken ? { nextToken } : {})
            .promise();
        nextToken = nt;
        if (projects === null || projects === void 0 ? void 0 : projects.length) {
            tagProjects.push(...projects.filter((projectName) => projectName.includes("envkey") &&
                projectName.includes(deploymentTag)));
        }
        if (!nextToken || !(projects === null || projects === void 0 ? void 0 : projects.length)) {
            break;
        }
    }
    return tagProjects;
};
exports.listCodebuildProjects = listCodebuildProjects;
const dangerouslyDeleteSecretsWithConfirm = async (params) => {
    const { secretsManager, all, force, filterIgnore, filterInclude, dryRun } = params;
    const { SecretList } = await secretsManager
        .listSecrets({
        MaxResults: 100,
        Filters: [
            {
                Key: "name",
                Values: ["envkey-"],
            },
        ],
    })
        .promise();
    let secrets = SecretList || [];
    if (filterIgnore) {
        secrets = secrets.filter((b) => { var _a; return !((_a = b.Name) === null || _a === void 0 ? void 0 : _a.includes(filterIgnore)); });
    }
    else if (filterInclude) {
        secrets = secrets.filter((b) => { var _a; return (_a = b.Name) === null || _a === void 0 ? void 0 : _a.includes(filterInclude); });
    }
    if (!secrets.length) {
        console.log("No secrets found");
        return;
    }
    console.log("Secrets found:", secrets.length);
    if (dryRun) {
        console.log(" ", secrets.map((b) => b.Name).join("\n  "));
        return;
    }
    if (all && !force) {
        console.log(secrets.map((s) => s.Name));
        const res = await (0, lib_1.waitForEnterKeyPromise)(`\nDelete all ${secrets.length} envkey secrets!? Enter number of secrets:  `);
        if (res !== secrets.length.toString()) {
            console.log("Aborted!");
            return;
        }
    }
    for (const secret of secrets) {
        console.log("");
        const name = secret.Name;
        if (!all) {
            const res = await (0, lib_1.waitForEnterKeyPromise)(`\nDelete secret ${name}? [n/y]  `);
            if (res !== "y") {
                console.log("Skipping secret", name);
                continue;
            }
        }
        console.log("  Deleting secret:", name);
        await secretsManager
            .deleteSecret({ RecoveryWindowInDays: 7, SecretId: name })
            .promise();
        console.log("  Deleted secret successfully:", name);
    }
};
exports.dangerouslyDeleteSecretsWithConfirm = dangerouslyDeleteSecretsWithConfirm;
const putDeployTag = async (params) => {
    const credentials = params.profile
        ? new aws_sdk_1.SharedIniFileCredentials({
            profile: params.profile,
        })
        : undefined;
    const ssm = new ssm_1.default({ region: params.primaryRegion, credentials });
    const tags = [...(await (0, exports.listDeploymentTags)(params)), params.deploymentTag];
    await ssm
        .putParameter({
        Name: stack_constants_1.parameterStoreDeploymentKey,
        Value: tags.join(","),
        Type: "StringList",
        Overwrite: true,
    })
        .promise();
    return (0, exports.listDeploymentTags)(params);
};
exports.putDeployTag = putDeployTag;
const deleteDeployTag = async (params) => {
    const credentials = params.profile
        ? new aws_sdk_1.SharedIniFileCredentials({
            profile: params.profile,
        })
        : undefined;
    const ssm = new ssm_1.default({ region: params.primaryRegion, credentials });
    const existing = await (0, exports.listDeploymentTags)(params);
    const tags = existing.filter((t) => t !== params.deploymentTag).join(",");
    if (!tags.length) {
        await ssm
            .deleteParameter({
            Name: stack_constants_1.parameterStoreDeploymentKey,
        })
            .promise();
    }
    else {
        await ssm
            .putParameter({
            Name: stack_constants_1.parameterStoreDeploymentKey,
            Value: tags,
            Type: "StringList",
            Overwrite: true,
        })
            .promise();
    }
    return (0, exports.listDeploymentTags)(params);
};
exports.deleteDeployTag = deleteDeployTag;
const listDeploymentTags = async (params) => {
    const credentials = params.profile
        ? new aws_sdk_1.SharedIniFileCredentials({
            profile: params.profile,
        })
        : undefined;
    const ssm = new ssm_1.default({ region: params.primaryRegion, credentials });
    const existing = await (0, exports.safeGetParameter)(ssm, stack_constants_1.parameterStoreDeploymentKey);
    if (existing) {
        return existing.split(",");
    }
    return [];
};
exports.listDeploymentTags = listDeploymentTags;
const safeGetParameter = async (ssm, paramName) => {
    var _a, _b;
    try {
        const param = (_b = (_a = (await ssm.getParameter({ Name: paramName }).promise())) === null || _a === void 0 ? void 0 : _a.Parameter) === null || _b === void 0 ? void 0 : _b.Value;
        return param;
    }
    catch (err) {
        if (err.code !== "ParameterNotFound") {
            // this is how parameter store tells us the parameter does not exist
            throw err;
        }
    }
    return undefined;
};
exports.safeGetParameter = safeGetParameter;
//# sourceMappingURL=aws-helpers.js.map