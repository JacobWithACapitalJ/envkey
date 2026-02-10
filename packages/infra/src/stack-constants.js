"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3CredsSecretName = exports.getCodebuildUpdateLink = exports.getCodebuildInstallLink = exports.getCodebuildRoleName = exports.getEcrRepoName = exports.getSecondaryFailoverBucketName = exports.getFailoverBucketName = exports.getSourcesBucketName = exports.getSnsAlertTopicArn = exports.getSnsAlertTopicName = exports.codebuildProjectNames = exports.parameterStoreDeploymentKey = exports.defaultFailoverRegions = exports.regions = exports.regionLabels = exports.parseDbVpcParams = exports.getFargateStackName = exports.CAPABILITIES = exports.CfStack = exports.updaterBuildspec = exports.installerBuildspec = exports.updaterFile = exports.failoverFile = exports.installerFile = exports.apiToMinInfraMap = exports.githubApiMinInfraVersionFile = exports.githubLatestVersionFiles = exports.PARAM_INFRA_VERSION_NUMBER = exports.PARAM_API_VERSION_NUMBER = exports.envkeyReleasesS3Creds = exports.ENVKEY_RELEASES_BUCKET = exports.RELEASE_ASSET_REGION = exports.API_PROJECT_NAME = exports.API_ZIP_FILE = void 0;
exports.API_ZIP_FILE = process.env.ENVKEY_OVERRIDE_API_ZIP_FILE || "api.enterprise.zip"; // Will be set in CLI or CodeBuild, but not on API.
exports.API_PROJECT_NAME = process.env.ENVKEY_OVERRIDE_API_PROJECT_NAME ||
    "apienterprise";
// our release artifact buckets will always be in that region, at least for now
exports.RELEASE_ASSET_REGION = "us-east-1";
// the buckets can be overriden for cloud
exports.ENVKEY_RELEASES_BUCKET = process.env.ENVKEY_RELEASES_BUCKET || "envkey-releases";
// the following creds can be overriden for cloud or development, when pulling updates from a private bucket
exports.envkeyReleasesS3Creds = process.env
    .ENVKEY_RELEASES_S3_CREDS_JSON
    ? JSON.parse(process.env.ENVKEY_RELEASES_S3_CREDS_JSON)
    : undefined;
exports.PARAM_API_VERSION_NUMBER = "ApiVersionNumber";
exports.PARAM_INFRA_VERSION_NUMBER = "InfraVersionNumber";
exports.githubLatestVersionFiles = {
    apicommunity: `releases/apicommunity/apicommunity-version.txt`,
    apienterprise: `releases/apienterprise/apienterprise-version.txt`,
    apicloud: `releases/apicloud/apicloud-version.txt`,
    cli: `releases/cli/cli-version.txt`,
    desktop: `releases/desktop/desktop-version.txt`,
    infra: `releases/infra/infra-version.txt`,
    failover: `releases/failover/failover-version.txt`,
    envkeysource: `releases/envkeysource/envkeysource-version.txt`,
};
exports.githubApiMinInfraVersionFile = "public/app/api-version-to-minimum-infra-version.json";
exports.apiToMinInfraMap = (require("../../../api-version-to-minimum-infra-version.json"));
exports.installerFile = "installer.zip";
exports.failoverFile = "failover.zip";
exports.updaterFile = "updater.zip";
exports.installerBuildspec = "installer-buildspec.yml";
exports.updaterBuildspec = "updater-inception-buildspec.yml";
// Important: order matters as they will be destroyed in reverse order of below
var CfStack;
(function (CfStack) {
    CfStack["ENVKEY_VPC"] = "envkey-vpc";
    CfStack["ENVKEY_VPC_NETWORKING"] = "envkey-vpc-networking";
    CfStack["ENVKEY_DB"] = "envkey-db";
    CfStack["ENVKEY_FAILOVER_BUCKET"] = "envkey-failover-bucket";
    CfStack["ENVKEY_FAILOVER_SINGLE_REGION"] = "envkey-failover-single-region";
    CfStack["ENVKEY_FAILOVER_MULTI_REGION"] = "envkey-failover-multi-region";
    CfStack["ENVKEY_FAILOVER_LAMBDA"] = "envkey-failover-lambda";
    CfStack["ENVKEY_INTERNET_LOAD_BALANCERS"] = "envkey-internet-load-balancers";
    CfStack["ENVKEY_INTERNAL_LOAD_BALANCERS"] = "envkey-internal-load-balancers";
    CfStack["ENVKEY_LISTENER_RULES"] = "envkey-listener-rules";
    CfStack["ENVKEY_FARGATE_API"] = "envkey-fargate-api";
    CfStack["ENVKEY_SECONDARY_BUCKET"] = "envkey-secondary-bucket";
    CfStack["ENVKEY_SECONDARY_LAMBDA"] = "envkey-secondary-lambda";
    CfStack["ENVKEY_SECONDARY_INTERNET"] = "envkey-secondary-internet";
    CfStack["ENVKEY_PRIVATE_LINK"] = "envkey-private-link";
    CfStack["ENVKEY_PRIVATE_LINK_DNS_VERIFICATION"] = "envkey-private-link-dns-verification";
    CfStack["ENVKEY_ALERTS"] = "envkey-alerts";
    CfStack["ENVKEY_DNS"] = "envkey-dns";
    CfStack["ENVKEY_WAF_API"] = "envkey-waf-api";
    CfStack["ENVKEY_WAF_FAILOVER"] = "envkey-waf-failover";
    CfStack["ENVKEY_WAF_SECONDARY"] = "envkey-waf-secondary";
    CfStack["ENVKEY_CLOUD_BILLING"] = "envkey-cloud-billing";
    CfStack["ENVKEY_CLOUD_OUTGOING_PROXY"] = "envkey-cloud-outgoing";
    CfStack["ENVKEY_CLOUD_INTEGRATION_VANTA"] = "envkey-cloud-integration-vanta";
    CfStack["ENVKEY_CLOUD_ERROR_REPORTING"] = "envkey-cloud-error-reporting";
    CfStack["ENVKEY_CLOUD_REPLICATION"] = "envkey-cloud-replication";
    CfStack["ENVKEY_CLOUD_BG_LOGS"] = "envkey-cloud-bg-logs";
})(CfStack || (exports.CfStack = CfStack = {}));
exports.CAPABILITIES = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"];
const getFargateStackName = (deploymentTag) => [CfStack.ENVKEY_FARGATE_API, deploymentTag].join("-");
exports.getFargateStackName = getFargateStackName;
const parseDbVpcParams = (jsonParams) => {
    let dbVpcParams;
    try {
        dbVpcParams = JSON.parse(jsonParams);
    }
    catch (err) {
        console.log("DB and VPC params failed to parse", jsonParams, err);
        throw err;
    }
    for (let k of [
        "vpc",
        "privateSubnets",
        "dbSecurityGroup",
        "dbCredentials",
        "dbHost",
        "privateRouteTable",
    ]) {
        if (typeof dbVpcParams[k] !== "string" || !dbVpcParams[k]) {
            const err = new Error(`DB and VPC params invalid key: ${k}=${dbVpcParams[k]}`);
            console.log(err);
            throw err;
        }
    }
    return dbVpcParams;
};
exports.parseDbVpcParams = parseDbVpcParams;
const virginia = "us-east-1";
const ohio = "us-east-2";
const norcal = "us-west-1";
const oregon = "us-west-2";
const canadaCentral = "ca-central-1";
const saoPaolo = "sa-east-1";
const singapore = "ap-southeast-1";
const sydney = "ap-southeast-2";
const ireland = "eu-west-1";
const london = "eu-west-2";
const paris = "eu-west-3";
const frankfurt = "eu-central-1";
const stockholm = "eu-north-1";
const mumbai = "ap-south-1";
const tokyo = "ap-northeast-1";
const seoul = "ap-northeast-2";
exports.regionLabels = {
    [virginia]: "Virgina",
    [ohio]: "Ohio",
    [norcal]: "Northern California",
    [oregon]: "Oregon",
    [canadaCentral]: "Central Canada",
    [saoPaolo]: "São Paulo",
    [sydney]: "Sydney",
    [ireland]: "Ireland",
    [frankfurt]: "Frankfurt",
    [stockholm]: "Stockholm",
    [singapore]: "Singapore",
    [london]: "London",
    [paris]: "Paris",
    [mumbai]: "Mumbai",
    [tokyo]: "Tokyo",
    [seoul]: "Seoul",
};
exports.regions = [
    virginia,
    ohio,
    norcal,
    oregon,
    canadaCentral,
    saoPaolo,
    sydney,
    ireland,
    london,
    paris,
    frankfurt,
    stockholm,
    mumbai,
    singapore,
    tokyo,
    seoul,
];
exports.defaultFailoverRegions = {
    [virginia]: ohio,
    [ohio]: virginia,
    [norcal]: oregon,
    [oregon]: norcal,
    [canadaCentral]: oregon,
    [saoPaolo]: virginia,
    [singapore]: sydney,
    [sydney]: singapore,
    [ireland]: london,
    [london]: ireland,
    [paris]: london,
    [frankfurt]: paris,
    [stockholm]: london,
    [mumbai]: singapore,
    [tokyo]: seoul,
    [seoul]: tokyo,
};
exports.parameterStoreDeploymentKey = "/envkey/deployment_tags";
exports.codebuildProjectNames = {
    initialInstall: (deploymentTag) => `envkey-install-runner-${deploymentTag}`,
    updater: (deploymentTag) => `envkey-api-update-runner-${deploymentTag}`,
};
const getSnsAlertTopicName = (deploymentTag) => `envkey-app-alert-topic-${deploymentTag}`;
exports.getSnsAlertTopicName = getSnsAlertTopicName;
const getSnsAlertTopicArn = (deploymentTag, primaryRegion, awsAccountId) => `arn:aws:sns:${primaryRegion}:${awsAccountId}:${(0, exports.getSnsAlertTopicName)(deploymentTag)}`;
exports.getSnsAlertTopicArn = getSnsAlertTopicArn;
const getSourcesBucketName = (deploymentTag) => `envkey-sources-${deploymentTag}`;
exports.getSourcesBucketName = getSourcesBucketName;
const getFailoverBucketName = (deploymentTag) => `envkey-in-region-code-${deploymentTag}`;
exports.getFailoverBucketName = getFailoverBucketName;
const getSecondaryFailoverBucketName = (deploymentTag) => `envkey-secondary-code-${deploymentTag}`;
exports.getSecondaryFailoverBucketName = getSecondaryFailoverBucketName;
const getEcrRepoName = (deploymentTag) => `envkey-api-${deploymentTag}`;
exports.getEcrRepoName = getEcrRepoName;
const getCodebuildRoleName = (deploymentTag) => `envkey-codebuild-role-${deploymentTag}`;
exports.getCodebuildRoleName = getCodebuildRoleName;
const getCodebuildInstallLink = (deploymentTag, primaryRegion, awsAccountId) => `https://console.aws.amazon.com/codesuite/codebuild/${awsAccountId}/projects/${exports.codebuildProjectNames.initialInstall(deploymentTag)}/history?region=${primaryRegion}`;
exports.getCodebuildInstallLink = getCodebuildInstallLink;
const getCodebuildUpdateLink = (deploymentTag, primaryRegion, awsAccountId) => `https://console.aws.amazon.com/codesuite/codebuild/${awsAccountId}/projects/${exports.codebuildProjectNames.updater(deploymentTag)}/history?region=${primaryRegion}`;
exports.getCodebuildUpdateLink = getCodebuildUpdateLink;
// the secret value is json of type `OptionalAwsCreds`
const getS3CredsSecretName = (deploymentTag) => `envkey-s3-releases-creds-${deploymentTag}`;
exports.getS3CredsSecretName = getS3CredsSecretName;
//# sourceMappingURL=stack-constants.js.map