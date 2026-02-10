import CodeBuild from "aws-sdk/clients/codebuild";
import IAM from "aws-sdk/clients/iam";
import { Infra } from "@envkey/core/types";
export declare const bootstrapSelfHostedDeployment: (params: Infra.DeploySelfHostedParams & {
    deploymentTag: string;
    subdomain: string;
    updateStatus: (status: string) => void;
}) => Promise<void>;
export declare const createCodebuildRoleIfNeeded: (params: {
    iam: IAM;
    deploymentTag: string;
}) => Promise<IAM.Role>;
export declare const createInstallerProject: (params: {
    codebuild: CodeBuild;
    deploymentTag: string;
    primaryRegion: string;
    failoverRegion?: string;
    deployWaf?: boolean;
    domain: string;
    subdomain: string;
    snsTopicArn: string;
    verifiedSenderEmail: string;
    isCustomDomain: "1" | "";
    apiVersionNumber: string;
    infraVersionNumber: string;
    failoverVersionNumber?: string;
    serviceRole: string;
    extraCodebuildEnvVars?: {
        name: string;
        value: string;
    }[];
    notifySmsWhenDone?: string;
    registerAction?: Record<string, any>;
    s3CredsSecretArn?: string;
    internalMode?: boolean;
    authorizedAccounts?: string[];
}) => Promise<void>;
export declare const createUpdaterProject: (params: {
    codebuild: CodeBuild;
    deploymentTag: string;
    snsTopicArn: string;
    serviceRole: string;
    extraCodebuildEnvVars?: {
        name: string;
        value: string;
    }[];
    s3CredsSecretArn?: string;
}) => Promise<void>;
//# sourceMappingURL=bootstrap-deployments.d.ts.map