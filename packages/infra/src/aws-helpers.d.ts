import S3 from "aws-sdk/clients/s3";
import EC2 from "aws-sdk/clients/ec2";
import { SecretsManager } from "aws-sdk";
import SSM from "aws-sdk/clients/ssm";
import CF from "aws-sdk/clients/cloudformation";
import CodeBuild from "aws-sdk/clients/codebuild";
export declare const preDeployValidations: (params: {
    profile?: string;
    primaryRegion: string;
    failoverRegion?: string;
    domain: string;
    customDomain: boolean;
    verifiedSenderEmail: string;
}) => Promise<{
    awsAccountId: string;
    certificateArn: string;
    failoverRegionCertificateArn: string;
}>;
export declare const stackExists: (client: CF, name: string) => Promise<boolean>;
export declare const createBucketIfNeeded: (s3Instance: S3) => (name: string) => Promise<void>;
export declare const getAwsAccountId: (profile?: string) => Promise<string>;
export declare const getTagFinder: (deploymentTag: string) => (tag: EC2.Tag) => boolean;
export declare const getTagFilters: (deploymentTag: string) => {
    Name: string;
    Values: string[];
}[];
export declare const validateDomain: (profile: string | undefined, domain: string) => Promise<void>;
export declare const getAwsCertArnForDomain: (profile: string | undefined, region: string, domain: string) => Promise<string>;
export declare const validateSenderEmail: (profile: string | undefined, region: string, senderEmail: string) => Promise<void>;
export declare const processTemplatesReturningFolder: (containingFolder: string, zipFileName: string) => Promise<string>;
export declare const stackResult: (client: CF, name: string, allowRollbackOk?: boolean) => Promise<Record<string, string>>;
export declare const waitForBuild: (codeBuild: CodeBuild, buildId: string) => Promise<void>;
export declare const getLatestBuild: (codebuild: CodeBuild, codebuildProjectName: string) => Promise<Pick<CodeBuild.Build, "id" | "buildNumber" | "buildStatus"> & {
    environmentVariables: CodeBuild.EnvironmentVariables;
}>;
export declare const dangerouslyDeleteS3BucketsWithConfirm: (params: {
    s3: S3;
    all: boolean;
    filterIgnore?: string;
    filterInclude?: string;
    dryRun?: boolean;
    force?: boolean;
}) => Promise<void>;
export declare const listCodebuildProjects: (codeBuild: CodeBuild, deploymentTag: string) => Promise<string[]>;
export declare const dangerouslyDeleteSecretsWithConfirm: (params: {
    secretsManager: SecretsManager;
    all: boolean;
    force?: boolean;
    filterIgnore?: string;
    filterInclude?: string;
    dryRun?: boolean;
}) => Promise<void>;
export declare const putDeployTag: (params: {
    profile: string | undefined;
    primaryRegion: string;
    deploymentTag: string;
}) => Promise<string[]>;
export declare const deleteDeployTag: (params: {
    profile: string | undefined;
    primaryRegion: string;
    deploymentTag: string;
}) => Promise<string[]>;
export declare const listDeploymentTags: (params: {
    profile: string | undefined;
    primaryRegion: string;
}) => Promise<string[]>;
export declare const safeGetParameter: (ssm: SSM, paramName: string) => Promise<string | undefined>;
//# sourceMappingURL=aws-helpers.d.ts.map