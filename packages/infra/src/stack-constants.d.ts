import { Infra } from "@envkey/core/types";
export declare const API_ZIP_FILE: string;
export declare const API_PROJECT_NAME: string;
export declare const RELEASE_ASSET_REGION = "us-east-1";
export declare const ENVKEY_RELEASES_BUCKET: string;
export declare const envkeyReleasesS3Creds: Infra.OptionalAwsCreds;
export declare const PARAM_API_VERSION_NUMBER = "ApiVersionNumber";
export declare const PARAM_INFRA_VERSION_NUMBER = "InfraVersionNumber";
export declare const githubLatestVersionFiles: Record<Infra.ProjectType, string>;
export declare const githubApiMinInfraVersionFile = "public/app/api-version-to-minimum-infra-version.json";
export declare const apiToMinInfraMap: Record<string, string>;
export declare const installerFile = "installer.zip";
export declare const failoverFile = "failover.zip";
export declare const updaterFile = "updater.zip";
export declare const installerBuildspec = "installer-buildspec.yml";
export declare const updaterBuildspec = "updater-inception-buildspec.yml";
export declare enum CfStack {
    ENVKEY_VPC = "envkey-vpc",
    ENVKEY_VPC_NETWORKING = "envkey-vpc-networking",
    ENVKEY_DB = "envkey-db",
    ENVKEY_FAILOVER_BUCKET = "envkey-failover-bucket",
    ENVKEY_FAILOVER_SINGLE_REGION = "envkey-failover-single-region",
    ENVKEY_FAILOVER_MULTI_REGION = "envkey-failover-multi-region",
    ENVKEY_FAILOVER_LAMBDA = "envkey-failover-lambda",
    ENVKEY_INTERNET_LOAD_BALANCERS = "envkey-internet-load-balancers",
    ENVKEY_INTERNAL_LOAD_BALANCERS = "envkey-internal-load-balancers",
    ENVKEY_LISTENER_RULES = "envkey-listener-rules",
    ENVKEY_FARGATE_API = "envkey-fargate-api",
    ENVKEY_SECONDARY_BUCKET = "envkey-secondary-bucket",
    ENVKEY_SECONDARY_LAMBDA = "envkey-secondary-lambda",
    ENVKEY_SECONDARY_INTERNET = "envkey-secondary-internet",
    ENVKEY_PRIVATE_LINK = "envkey-private-link",
    ENVKEY_PRIVATE_LINK_DNS_VERIFICATION = "envkey-private-link-dns-verification",
    ENVKEY_ALERTS = "envkey-alerts",
    ENVKEY_DNS = "envkey-dns",
    ENVKEY_WAF_API = "envkey-waf-api",
    ENVKEY_WAF_FAILOVER = "envkey-waf-failover",
    ENVKEY_WAF_SECONDARY = "envkey-waf-secondary",
    ENVKEY_CLOUD_BILLING = "envkey-cloud-billing",
    ENVKEY_CLOUD_OUTGOING_PROXY = "envkey-cloud-outgoing",
    ENVKEY_CLOUD_INTEGRATION_VANTA = "envkey-cloud-integration-vanta",
    ENVKEY_CLOUD_ERROR_REPORTING = "envkey-cloud-error-reporting",
    ENVKEY_CLOUD_REPLICATION = "envkey-cloud-replication",
    ENVKEY_CLOUD_BG_LOGS = "envkey-cloud-bg-logs"
}
export declare const CAPABILITIES: string[];
export declare const getFargateStackName: (deploymentTag: string) => string;
export type DbVpcParams = {
    vpc: string;
    privateSubnets: string;
    dbSecurityGroup: string;
    fargateContainerSecurityGroup: string;
    dbCredentials: string;
    dbHost: string;
    privateRouteTable: string;
};
export declare const parseDbVpcParams: (jsonParams: string) => DbVpcParams;
export declare const regionLabels: {
    "us-east-1": string;
    "us-east-2": string;
    "us-west-1": string;
    "us-west-2": string;
    "ca-central-1": string;
    "sa-east-1": string;
    "ap-southeast-2": string;
    "eu-west-1": string;
    "eu-central-1": string;
    "eu-north-1": string;
    "ap-southeast-1": string;
    "eu-west-2": string;
    "eu-west-3": string;
    "ap-south-1": string;
    "ap-northeast-1": string;
    "ap-northeast-2": string;
};
export type Region = keyof typeof regionLabels;
export declare const regions: Region[];
export declare const defaultFailoverRegions: Record<Region, Region>;
export declare const parameterStoreDeploymentKey = "/envkey/deployment_tags";
export declare const codebuildProjectNames: {
    initialInstall: (deploymentTag: string) => string;
    updater: (deploymentTag: string) => string;
};
export declare const getSnsAlertTopicName: (deploymentTag: string) => string;
export declare const getSnsAlertTopicArn: (deploymentTag: string, primaryRegion: string, awsAccountId: string) => string;
export declare const getSourcesBucketName: (deploymentTag: string) => string;
export declare const getFailoverBucketName: (deploymentTag: string) => string;
export declare const getSecondaryFailoverBucketName: (deploymentTag: string) => string;
export declare const getEcrRepoName: (deploymentTag: string) => string;
export declare const getCodebuildRoleName: (deploymentTag: string) => string;
export declare const getCodebuildInstallLink: (deploymentTag: string, primaryRegion: string, awsAccountId: string) => string;
export declare const getCodebuildUpdateLink: (deploymentTag: string, primaryRegion: string, awsAccountId: string) => string;
export declare const getS3CredsSecretName: (deploymentTag: string) => string;
//# sourceMappingURL=stack-constants.d.ts.map