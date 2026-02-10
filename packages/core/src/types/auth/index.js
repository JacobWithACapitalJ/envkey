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
exports.Auth = void 0;
const z = __importStar(require("zod"));
var Auth;
(function (Auth) {
    Auth.CLOUD_OAUTH_PROVIDERS = {
        github: "GitHub",
        gitlab: "GitLab",
        google: "Google",
    }, Auth.HOSTED_OAUTH_PROVIDERS = {
        github_hosted: "GitHub Business",
        gitlab_hosted: "GitLab Self-hosted",
    }, Auth.OAUTH_PROVIDERS = Object.assign(Object.assign({}, Auth.CLOUD_OAUTH_PROVIDERS), Auth.HOSTED_OAUTH_PROVIDERS), Auth.SSO_PROVIDERS = {
        saml: "SAML",
    }, Auth.EXTERNAL_AUTH_PROVIDERS = Object.assign(Object.assign({}, Auth.OAUTH_PROVIDERS), Auth.SSO_PROVIDERS), Auth.AUTH_PROVIDERS = Object.assign({ email: "Email" }, Auth.EXTERNAL_AUTH_PROVIDERS), Auth.PROVIDER_AUTH_METHODS = {
        email: "email",
        github: "oauth_cloud",
        gitlab: "oauth_cloud",
        google: "oauth_cloud",
        gitlab_hosted: "oauth_hosted",
        github_hosted: "oauth_hosted",
        saml: "saml",
    }, Auth.SAML_NAME_ID_FORMATS = {
        email: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        persistent: "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
    }, Auth.SAML_ATTRIBUTE_DEFAULT_MAPPINGS = {
        emailAddress: "email_address",
        firstName: "first_name",
        lastName: "last_name",
    }, Auth.SAML_KNOWN_IDENTITY_PROVIDERS = {
        okta: "Okta",
        google: "Google",
        azure_ad: "Azure AD",
        other: "Other",
    }, Auth.PROVISIONING_PROVIDER_AUTH_SCHEMES = {
        bearer: "bearer",
        // "oauth2", "http-basic-auth"
    }, Auth.PROVISIONING_PROVIDER_AUTH_FRIENDLY_NAMES = {
        bearer: "Long-lived Auth Header Bearer Token",
    }, Auth.AUTH_TYPE_ACTION_NAMES = {
        sign_up: "create an organization",
        sign_in: "sign in",
        invite_users: "send an invitation",
        accept_invite: "accept an invitation",
        accept_device_grant: "accept a device invitation",
        redeem_recovery_key: "redeem a recovery key",
    };
    Auth.AuthTypeSchema = z.enum(Object.keys(Auth.AUTH_TYPE_ACTION_NAMES));
    Auth.ExternalAuthMethodSchema = z.enum([
        "oauth_cloud",
        "oauth_hosted",
        "saml",
    ]);
    Auth.AuthMethodSchema = z.union([
        z.literal("email"),
        Auth.ExternalAuthMethodSchema,
    ]);
    Auth.CloudOauthProviderTypeSchema = z.enum(Object.keys(Auth.CLOUD_OAUTH_PROVIDERS));
    Auth.HostedOauthProviderTypeSchema = z.enum(Object.keys(Auth.HOSTED_OAUTH_PROVIDERS));
    Auth.OauthProviderTypeSchema = z.enum(Object.keys(Auth.OAUTH_PROVIDERS));
    Auth.ExternalAuthProviderTypeSchema = z.enum(Object.keys(Auth.EXTERNAL_AUTH_PROVIDERS));
    Auth.AuthProviderTypeSchema = z.enum(Object.keys(Auth.AUTH_PROVIDERS));
    Auth.InviteExternalAuthUsersTypeSchema = z.enum([
        "initial",
        "re-authenticate",
    ]);
    Auth.ProvisioningProviderAuthSchemeTypeSchema = z.enum(Object.keys(Auth.PROVISIONING_PROVIDER_AUTH_SCHEMES));
    Auth.BearerTokenAuthParamsSchema = z.object({
        type: z.literal("bearerTokenAuthParams"),
        providerId: z.string(),
        secret: z.string().optional(),
    });
    Auth.TokenAuthParamsSchema = z.object({
        type: z.literal("tokenAuthParams"),
        token: z.string(),
        userId: z.string(),
        orgId: z.string(),
        deviceId: z.string(),
        signature: z.string(),
    });
    Auth.CliAuthParamsSchema = z.object({
        type: z.literal("cliAuthParams"),
        userId: z.string(),
        orgId: z.string(),
        signature: z.string(),
    });
    Auth.LoadInviteAuthParamsSchema = z.object({
        type: z.literal("loadInviteAuthParams"),
        identityHash: z.string(),
        emailToken: z.string(),
    });
    Auth.LoadDeviceGrantAuthParamsSchema = z.object({
        type: z.literal("loadDeviceGrantAuthParams"),
        identityHash: z.string(),
        emailToken: z.string(),
    });
    Auth.LoadRecoveryKeyAuthParamsSchema = z.object({
        type: z.literal("loadRecoveryKeyAuthParams"),
        identityHash: z.string(),
    });
    Auth.AcceptInviteAuthParamsSchema = z.object({
        type: z.literal("acceptInviteAuthParams"),
        identityHash: z.string(),
        emailToken: z.string(),
        signature: z.string(),
    });
    Auth.AcceptDeviceGrantAuthParamsSchema = z.object({
        type: z.literal("acceptDeviceGrantAuthParams"),
        identityHash: z.string(),
        signature: z.string(),
        emailToken: z.string(),
    });
    Auth.RedeemRecoveryKeyAuthParamsSchema = z.object({
        type: z.literal("redeemRecoveryKeyAuthParams"),
        identityHash: z.string(),
        signature: z.string(),
    });
    Auth.FetchEnvkeySocketAuthParamsSchema = z.object({
        type: z.literal("fetchEnvkeySocketAuthParams"),
        envkeyIdPart: z.string(),
        connectionId: z.string(),
    });
    Auth.AuthParamsSchema = z.union([
        Auth.TokenAuthParamsSchema,
        Auth.BearerTokenAuthParamsSchema,
        Auth.CliAuthParamsSchema,
        Auth.LoadInviteAuthParamsSchema,
        Auth.LoadDeviceGrantAuthParamsSchema,
        Auth.LoadRecoveryKeyAuthParamsSchema,
        Auth.AcceptInviteAuthParamsSchema,
        Auth.AcceptDeviceGrantAuthParamsSchema,
        Auth.RedeemRecoveryKeyAuthParamsSchema,
    ]);
})(Auth || (exports.Auth = Auth = {}));
//# sourceMappingURL=index.js.map