import Api from "../api";
import { Rbac, Billing, Model } from "..";
import * as z from "zod";
export declare namespace Auth {
    export const CLOUD_OAUTH_PROVIDERS: {
        github: string;
        gitlab: string;
        google: string;
    }, HOSTED_OAUTH_PROVIDERS: {
        github_hosted: string;
        gitlab_hosted: string;
    }, OAUTH_PROVIDERS: {
        github_hosted: string;
        gitlab_hosted: string;
        github: string;
        gitlab: string;
        google: string;
    }, SSO_PROVIDERS: {
        saml: string;
    }, EXTERNAL_AUTH_PROVIDERS: {
        saml: string;
        github_hosted: string;
        gitlab_hosted: string;
        github: string;
        gitlab: string;
        google: string;
    }, AUTH_PROVIDERS: {
        saml: string;
        github_hosted: string;
        gitlab_hosted: string;
        github: string;
        gitlab: string;
        google: string;
        email: string;
    }, PROVIDER_AUTH_METHODS: {
        readonly email: "email";
        readonly github: "oauth_cloud";
        readonly gitlab: "oauth_cloud";
        readonly google: "oauth_cloud";
        readonly gitlab_hosted: "oauth_hosted";
        readonly github_hosted: "oauth_hosted";
        readonly saml: "saml";
    }, SAML_NAME_ID_FORMATS: {
        readonly email: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";
        readonly persistent: "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent";
    }, SAML_ATTRIBUTE_DEFAULT_MAPPINGS: {
        readonly emailAddress: "email_address";
        readonly firstName: "first_name";
        readonly lastName: "last_name";
    }, SAML_KNOWN_IDENTITY_PROVIDERS: {
        readonly okta: "Okta";
        readonly google: "Google";
        readonly azure_ad: "Azure AD";
        readonly other: "Other";
    }, PROVISIONING_PROVIDER_AUTH_SCHEMES: {
        readonly bearer: "bearer";
    }, PROVISIONING_PROVIDER_AUTH_FRIENDLY_NAMES: Record<ProvisioningAuthScheme, string>, AUTH_TYPE_ACTION_NAMES: {
        readonly sign_up: "create an organization";
        readonly sign_in: "sign in";
        readonly invite_users: "send an invitation";
        readonly accept_invite: "accept an invitation";
        readonly accept_device_grant: "accept a device invitation";
        readonly redeem_recovery_key: "redeem a recovery key";
    };
    export type SamlMappable = keyof typeof SAML_ATTRIBUTE_DEFAULT_MAPPINGS;
    export type SamlKnownIDP = keyof typeof SAML_KNOWN_IDENTITY_PROVIDERS;
    export type AuthType = keyof typeof AUTH_TYPE_ACTION_NAMES;
    export const AuthTypeSchema: z.ZodEnum<["sign_up" | "sign_in" | "invite_users" | "accept_invite" | "accept_device_grant" | "redeem_recovery_key", ...("sign_up" | "sign_in" | "invite_users" | "accept_invite" | "accept_device_grant" | "redeem_recovery_key")[]]>;
    export type ProvisioningAuthScheme = keyof typeof PROVISIONING_PROVIDER_AUTH_SCHEMES;
    export const ExternalAuthMethodSchema: z.ZodEnum<["oauth_cloud", "oauth_hosted", "saml"]>;
    export type ExternalAuthMethod = z.infer<typeof ExternalAuthMethodSchema>;
    export const AuthMethodSchema: z.ZodUnion<[z.ZodLiteral<"email">, z.ZodEnum<["oauth_cloud", "oauth_hosted", "saml"]>]>;
    export type AuthMethod = z.infer<typeof AuthMethodSchema>;
    export const CloudOauthProviderTypeSchema: z.ZodEnum<["github" | "gitlab" | "google", "github" | "gitlab" | "google", ...("github" | "gitlab" | "google")[]]>;
    export type CloudOauthProviderType = z.infer<typeof CloudOauthProviderTypeSchema>;
    export const HostedOauthProviderTypeSchema: z.ZodEnum<["github_hosted" | "gitlab_hosted", "github_hosted" | "gitlab_hosted", ...("github_hosted" | "gitlab_hosted")[]]>;
    export type HostedOauthProviderType = z.infer<typeof HostedOauthProviderTypeSchema>;
    export const OauthProviderTypeSchema: z.ZodEnum<["github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", ...("github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted")[]]>;
    export type OauthProviderType = z.infer<typeof OauthProviderTypeSchema>;
    export const ExternalAuthProviderTypeSchema: z.ZodEnum<["saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", ...("saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted")[]]>;
    export type ExternalAuthProviderType = z.infer<typeof ExternalAuthProviderTypeSchema>;
    export const AuthProviderTypeSchema: z.ZodEnum<["email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", ...("email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted")[]]>;
    export type AuthProviderType = z.infer<typeof AuthProviderTypeSchema>;
    export const InviteExternalAuthUsersTypeSchema: z.ZodEnum<["initial", "re-authenticate"]>;
    export type InviteExternalAuthUsersTyp = z.infer<typeof InviteExternalAuthUsersTypeSchema>;
    export const ProvisioningProviderAuthSchemeTypeSchema: z.ZodEnum<["bearer", "bearer", ..."bearer"[]]>;
    export const BearerTokenAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"bearerTokenAuthParams">;
        providerId: z.ZodString;
        secret: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        type?: "bearerTokenAuthParams";
        providerId?: string;
        secret?: string;
    }>;
    export type BearerTokenAuthParams = z.infer<typeof BearerTokenAuthParamsSchema>;
    export const TokenAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"tokenAuthParams">;
        token: z.ZodString;
        userId: z.ZodString;
        orgId: z.ZodString;
        deviceId: z.ZodString;
        signature: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "tokenAuthParams";
        signature?: string;
        token?: string;
        userId?: string;
        orgId?: string;
        deviceId?: string;
    }>;
    export type TokenAuthParams = z.infer<typeof TokenAuthParamsSchema>;
    export const CliAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"cliAuthParams">;
        userId: z.ZodString;
        orgId: z.ZodString;
        signature: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "cliAuthParams";
        signature?: string;
        userId?: string;
        orgId?: string;
    }>;
    export type CliAuthParams = z.infer<typeof CliAuthParamsSchema>;
    export const LoadInviteAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"loadInviteAuthParams">;
        identityHash: z.ZodString;
        emailToken: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "loadInviteAuthParams";
        identityHash?: string;
        emailToken?: string;
    }>;
    export type LoadInviteAuthParams = z.infer<typeof LoadInviteAuthParamsSchema>;
    export const LoadDeviceGrantAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"loadDeviceGrantAuthParams">;
        identityHash: z.ZodString;
        emailToken: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "loadDeviceGrantAuthParams";
        identityHash?: string;
        emailToken?: string;
    }>;
    export type LoadDeviceGrantAuthParams = z.infer<typeof LoadDeviceGrantAuthParamsSchema>;
    export const LoadRecoveryKeyAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"loadRecoveryKeyAuthParams">;
        identityHash: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "loadRecoveryKeyAuthParams";
        identityHash?: string;
    }>;
    export type LoadRecoveryKeyAuthParams = z.infer<typeof LoadRecoveryKeyAuthParamsSchema>;
    export const AcceptInviteAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"acceptInviteAuthParams">;
        identityHash: z.ZodString;
        emailToken: z.ZodString;
        signature: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "acceptInviteAuthParams";
        signature?: string;
        identityHash?: string;
        emailToken?: string;
    }>;
    export type AcceptInviteAuthParams = z.infer<typeof AcceptInviteAuthParamsSchema>;
    export const AcceptDeviceGrantAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"acceptDeviceGrantAuthParams">;
        identityHash: z.ZodString;
        signature: z.ZodString;
        emailToken: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "acceptDeviceGrantAuthParams";
        signature?: string;
        identityHash?: string;
        emailToken?: string;
    }>;
    export type AcceptDeviceGrantAuthParams = z.infer<typeof AcceptDeviceGrantAuthParamsSchema>;
    export const RedeemRecoveryKeyAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"redeemRecoveryKeyAuthParams">;
        identityHash: z.ZodString;
        signature: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "redeemRecoveryKeyAuthParams";
        signature?: string;
        identityHash?: string;
    }>;
    export type RedeemRecoveryKeyAuthParams = z.infer<typeof RedeemRecoveryKeyAuthParamsSchema>;
    export const FetchEnvkeySocketAuthParamsSchema: z.ZodObject<{
        type: z.ZodLiteral<"fetchEnvkeySocketAuthParams">;
        envkeyIdPart: z.ZodString;
        connectionId: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "fetchEnvkeySocketAuthParams";
        envkeyIdPart?: string;
        connectionId?: string;
    }>;
    export type FetchEnvkeySocketAuthParams = z.infer<typeof FetchEnvkeySocketAuthParamsSchema>;
    export const AuthParamsSchema: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"tokenAuthParams">;
        token: z.ZodString;
        userId: z.ZodString;
        orgId: z.ZodString;
        deviceId: z.ZodString;
        signature: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "tokenAuthParams";
        signature?: string;
        token?: string;
        userId?: string;
        orgId?: string;
        deviceId?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"bearerTokenAuthParams">;
        providerId: z.ZodString;
        secret: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        type?: "bearerTokenAuthParams";
        providerId?: string;
        secret?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"cliAuthParams">;
        userId: z.ZodString;
        orgId: z.ZodString;
        signature: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "cliAuthParams";
        signature?: string;
        userId?: string;
        orgId?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"loadInviteAuthParams">;
        identityHash: z.ZodString;
        emailToken: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "loadInviteAuthParams";
        identityHash?: string;
        emailToken?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"loadDeviceGrantAuthParams">;
        identityHash: z.ZodString;
        emailToken: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "loadDeviceGrantAuthParams";
        identityHash?: string;
        emailToken?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"loadRecoveryKeyAuthParams">;
        identityHash: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "loadRecoveryKeyAuthParams";
        identityHash?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"acceptInviteAuthParams">;
        identityHash: z.ZodString;
        emailToken: z.ZodString;
        signature: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "acceptInviteAuthParams";
        signature?: string;
        identityHash?: string;
        emailToken?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"acceptDeviceGrantAuthParams">;
        identityHash: z.ZodString;
        signature: z.ZodString;
        emailToken: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "acceptDeviceGrantAuthParams";
        signature?: string;
        identityHash?: string;
        emailToken?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"redeemRecoveryKeyAuthParams">;
        identityHash: z.ZodString;
        signature: z.ZodString;
    }, {
        strict: true;
    }, {
        type?: "redeemRecoveryKeyAuthParams";
        signature?: string;
        identityHash?: string;
    }>]>;
    export type ApiAuthParams = z.infer<typeof AuthParamsSchema>;
    export type DefaultAuthParams = TokenAuthParams | CliAuthParams;
    type UserAuthContextBase = {
        user: Api.Db.OrgUser;
        org: Api.Db.Org;
        orgStats?: Model.OrgStats;
        license: Billing.License;
        orgRole: Api.Db.OrgRole;
        orgPermissions: Set<Rbac.OrgPermission>;
    };
    export type ProvisioningBearerAuthContext = {
        type: "provisioningBearerAuthContext";
        provisioningProvider: Api.Db.ScimProvisioningProvider;
        org: Api.Db.Org;
        orgStats?: Model.OrgStats;
        license: Billing.License;
    };
    export type TokenAuthContext = UserAuthContextBase & {
        type: "tokenAuthContext";
        authToken: Api.Db.AuthToken;
        orgUserDevice: Api.Db.OrgUserDevice;
    };
    export type InviteAuthContext = UserAuthContextBase & {
        type: "inviteAuthContext";
        invite: Api.Db.Invite;
    };
    export type DeviceGrantAuthContext = UserAuthContextBase & {
        type: "deviceGrantAuthContext";
        deviceGrant: Api.Db.DeviceGrant;
    };
    export type RecoveryKeyAuthContext = UserAuthContextBase & {
        type: "recoveryKeyAuthContext";
        recoveryKey: Api.Db.RecoveryKey;
    };
    export type CliUserAuthContext = {
        type: "cliUserAuthContext";
        org: Api.Db.Org;
        orgStats?: Model.OrgStats;
        license: Billing.License;
        user: Api.Db.CliUser;
        orgRole: Api.Db.OrgRole;
        orgPermissions: Set<Rbac.OrgPermission>;
    };
    export type DefaultAuthContext = TokenAuthContext | CliUserAuthContext;
    export type UserAuthContext = TokenAuthContext | InviteAuthContext | DeviceGrantAuthContext | CliUserAuthContext | RecoveryKeyAuthContext;
    export type AuthContext = UserAuthContext | ProvisioningBearerAuthContext;
    export type EnvkeySocketAuthContext = {
        type: "envkeySocketAuthContext";
        generatedEnvkey: Api.Db.GeneratedEnvkey;
        connectionId: string;
    };
    export {};
}
//# sourceMappingURL=index.d.ts.map