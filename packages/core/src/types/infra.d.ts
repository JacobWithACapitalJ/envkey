import { Api } from ".";
export declare namespace Infra {
    type ProjectType = "apicommunity" | "apienterprise" | "apicloud" | "desktop" | "infra" | "failover" | "cli" | "envkeysource";
    type RequiredAwsCreds = {
        accessKeyId: string;
        secretAccessKey: string;
    };
    type OptionalAwsCreds = {
        accessKeyId: string;
        secretAccessKey: string;
    } | undefined;
    type DeploySelfHostedParams = {
        profile: string;
        domain: string;
        primaryRegion: string;
        verifiedSenderEmail: string;
        infraAlertsEmail: string;
        customDomain: boolean;
        registerAction: Api.Action.RequestActions["Register"];
        notifyEmailWhenDone?: string;
        notifySmsWhenDone?: string;
        apiVersionNumber?: string;
        infraVersionNumber?: string;
        failoverVersionNumber?: string;
        creds?: OptionalAwsCreds;
        overrideReleaseBucket?: string;
        failoverRegion?: string;
        deployWaf?: boolean;
        internalMode?: boolean;
        authorizedAccounts?: string[];
    };
}
//# sourceMappingURL=infra.d.ts.map