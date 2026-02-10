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
exports.Db = void 0;
const crypto_1 = require("../crypto");
const auth_1 = require("../auth");
const model_1 = require("../model");
const blob_1 = require("../blob");
const logs_1 = require("../logs");
const Rbac = __importStar(require("../rbac"));
const Billing = __importStar(require("../billing"));
const timestamps_1 = require("../timestamps");
const z = __importStar(require("zod"));
const utils = __importStar(require("../utils"));
var Db;
(function (Db) {
    Db.DbKeySchema = z.object({
        pkey: z.string(),
        skey: z.string(),
        secondaryIndex: z.string().optional(),
        tertiaryIndex: z.string().optional(),
        devIndex: z.string().optional(), // used in development only
    });
    Db.DbObjectSchema = z
        .object({
        orderIndex: z.number().optional(),
        data: z
            .object({ data: z.string(), nonce: z.string().optional() })
            .optional(),
        excludeFromDeletedGraph: z.literal(true).optional(),
    })
        .merge(timestamps_1.TimestampsSchema)
        .merge(Db.DbKeySchema);
    Db.OrgSchema = z
        .object({
        replicatedAt: z.number(),
        signedLicense: z.string().optional(),
        selfHostedFailoverRegion: z.string().optional(),
        generatedAnyEnvkey: z.boolean().optional(),
        startedOrgImportAt: z.number().optional(),
        finishedOrgImportAt: z.number().optional(),
        envUpdateRequiresClientVersion: z.string().optional(),
        importedFromV1: z.boolean().optional(),
    })
        .merge(model_1.Model.OrgSchema)
        .merge(Db.DbObjectSchema);
    Db.OrgUserDeviceSchema = utils.intersection(z
        .object({
        signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        trustedRootUpdatedAt: z.number(),
    })
        .merge(Db.DbObjectSchema), model_1.Model.OrgUserDeviceSchema);
    Db.DeviceGrantSchema = z
        .object({
        identityHash: z.string(),
        signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        orgId: z.string(),
        encryptedPrivkey: crypto_1.Crypto.EncryptedDataSchema,
        deviceId: z.string(),
        externalAuthSessionId: z.string().optional(),
        externalAuthSessionVerifiedAt: z.number().optional(),
    })
        .merge(model_1.Model.DeviceGrantSchema)
        .merge(model_1.Model.OrgUserSchema.pick({
        provider: true,
        uid: true,
        externalAuthProviderId: true,
    }))
        .merge(Db.DbObjectSchema);
    Db.AuthTokenSchema = z
        .object({
        type: z.literal("authToken"),
        token: z.string(),
        provider: auth_1.Auth.AuthProviderTypeSchema,
        uid: z.string(),
        externalAuthProviderId: z.string().optional(),
        orgId: z.string(),
        deviceId: z.string(),
        userId: z.string(),
        expiresAt: z.number(),
    })
        .merge(Db.DbObjectSchema);
    Db.OrgUserSchema = z
        .object({
        deviceIds: z.array(z.string()),
    })
        .merge(model_1.Model.OrgUserSchema)
        .merge(Db.DbObjectSchema);
    Db.CliUserSchema = z
        .object({
        encryptedPrivkey: crypto_1.Crypto.EncryptedDataSchema,
        signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        trustedRootUpdatedAt: z.number(),
    })
        .merge(model_1.Model.CliUserSchema)
        .merge(Db.DbObjectSchema);
    Db.RecoveryKeySchema = z
        .object({
        identityHash: z.string(),
        signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        encryptedPrivkey: crypto_1.Crypto.EncryptedDataSchema,
        deviceId: z.string(),
        externalAuthSessionId: z.string().optional(),
        externalAuthSessionVerifiedAt: z.number().optional(),
        emailToken: z.string().optional(),
    })
        .merge(model_1.Model.RecoveryKeySchema)
        .merge(Db.DbObjectSchema);
    Db.RecoveryKeyPointerSchema = z
        .object({
        type: z.literal("recoveryKeyPointer"),
        skey: z.literal("recoveryKeyPointer"),
        recoveryKeyId: z.string(),
        orgId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.OrgUserIdByEmailSchema = z
        .object({
        type: z.literal("userIdByEmail"),
        email: z.string().email(),
        userId: z.string(),
        orgId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.OrgUserIdByProviderUidSchema = z
        .object({
        type: z.literal("userIdByProviderUid"),
        skey: z.string(),
        providerUid: z.string(),
        userId: z.string(),
        orgId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.HostedOauthProviderSettingsSchema = z.object({
        endpoint: z.string(),
        clientId: z.string(),
        clientSecret: z.string(),
    });
    Db.SamlProviderSettingsSchema = z
        .object({
        serviceProviderRsaPrivkey: z.string(),
    })
        .merge(model_1.Model.SamlProviderSettingsSchema)
        .merge(Db.DbObjectSchema);
    Db.ExternalAuthProviderSchema = utils.intersection(model_1.Model.ExternalAuthProviderSchema, utils.intersection(Db.DbObjectSchema, z.union([
        z.object({
            verifiedByExternalAuthSessionId: z.string(),
            verifiedByUserId: z.string(),
            provider: auth_1.Auth.HostedOauthProviderTypeSchema,
            providerSettings: Db.HostedOauthProviderSettingsSchema,
        }),
        z.object({
            provider: z.literal("saml"),
            samlSettingsId: z.string(),
        }),
    ])));
    Db.ExternalAuthProviderPointerSchema = z
        .object({
        type: z.literal("externalAuthProviderPointer"),
        externalAuthProviderId: z.string(),
        orgId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.ScimProvisioningProviderSchema = z
        .object({ authSecretHash: z.string() })
        .merge(model_1.Model.ScimProvisioningProviderSchema)
        .merge(Db.DbObjectSchema);
    Db.ScimProvisioningProviderPointerSchema = z
        .object({
        type: z.literal("scimProvisioningProviderPointer"),
        providerId: z.string(),
        orgId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.EmailVerificationSchema = z
        .object({
        type: z.literal("emailVerification"),
        token: z.string(),
        email: z.string().email(),
        userId: z.string().optional(),
        verifiedAt: z.number().optional(),
        expiresAt: z.number(),
        authType: z.intersection(auth_1.Auth.AuthTypeSchema, z.enum(["sign_in", "sign_up"])),
    })
        .merge(Db.DbObjectSchema);
    Db.ScimUserCandidateSchema = utils.intersection(model_1.Model.ScimUserCandidateSchema, Db.DbObjectSchema);
    Db.ExternalAuthSessionSchema = utils.intersection(z
        .object({
        type: z.literal("externalAuthSession"),
        id: z.string(),
        authType: auth_1.Auth.AuthTypeSchema,
        authMethod: auth_1.Auth.AuthMethodSchema,
        provider: auth_1.Auth.AuthProviderTypeSchema,
        orgId: z.string().optional(),
        userId: z.string().optional(),
        domain: z.string().optional(),
        verifiedEmail: z.string().optional(),
        verifiedAt: z.number().optional(),
        suggestFirstName: z.string().optional(),
        suggestLastName: z.string().optional(),
        externalUid: z.string().optional(),
        externalAuthProviderId: z.string().optional(),
        // invite id
        authObjectId: z.string().optional(),
        accessToken: z.string().optional(),
        errorAt: z.number().optional(),
        error: z.string().optional(),
    })
        .merge(Db.DbObjectSchema), z.union([
        utils.intersection(z.object({
            authType: z.literal("sign_up"),
        }), z.union([
            z.object({
                authMethod: z.literal("oauth_cloud"),
                provider: auth_1.Auth.CloudOauthProviderTypeSchema,
            }),
            z.object({
                authMethod: z.literal("oauth_hosted"),
                provider: auth_1.Auth.HostedOauthProviderTypeSchema,
                providerSettings: Db.HostedOauthProviderSettingsSchema,
            }),
            z.object({
                authMethod: z.literal("saml"),
                provider: z.literal("saml"),
                authObjectId: z.string(),
            }),
        ])),
        utils.intersection(z.object({
            authType: z.literal("invite_users"),
        }), z.union([
            z.object({
                authMethod: z.literal("oauth_cloud"),
            }),
            utils.intersection(z.object({
                authMethod: z.literal("oauth_hosted"),
                provider: auth_1.Auth.HostedOauthProviderTypeSchema,
            }), z.union([
                z.object({
                    inviteExternalAuthUsersType: z.literal("initial"),
                    providerSettings: Db.HostedOauthProviderSettingsSchema,
                }),
                z.object({
                    inviteExternalAuthUsersType: z.literal("re-authenticate"),
                    externalAuthProviderId: z.string(),
                }),
            ])),
        ])),
        utils.intersection(z.union([
            z.object({
                authType: z.enum([
                    "accept_invite",
                    "accept_device_grant",
                    "redeem_recovery_key",
                ]),
                authObjectId: z.string(),
            }),
            z.object({
                authType: z.literal("sign_in"),
            }),
        ]), z.union([
            z.object({
                authMethod: z.enum(["oauth_hosted", "saml"]),
                externalAuthProviderId: z.string(),
            }),
            z.object({
                authMethod: z.literal("oauth_cloud"),
            }),
        ])),
    ]));
    Db.InviteSchema = z
        .object({
        identityHash: z.string(),
        signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        encryptedPrivkey: crypto_1.Crypto.EncryptedDataSchema,
        deviceId: z.string(),
        externalAuthSessionId: z.string().optional(),
        externalAuthSessionVerifiedAt: z.number().optional(),
        v1TokenHash: z.string().optional(),
    })
        .merge(model_1.Model.InviteSchema)
        .merge(model_1.Model.OrgUserSchema.pick({
        provider: true,
        uid: true,
        externalAuthProviderId: true,
    }))
        .merge(Db.DbObjectSchema);
    Db.InvitePointerSchema = z
        .object({
        type: z.literal("invitePointer"),
        inviteId: z.string(),
        orgId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.DeviceGrantPointerSchema = z
        .object({
        type: z.literal("deviceGrantPointer"),
        deviceGrantId: z.string(),
        orgId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.AppSchema = model_1.Model.AppSchema.merge(Db.DbObjectSchema);
    Db.BlockSchema = model_1.Model.BlockSchema.merge(Db.DbObjectSchema);
    Db.AppUserGrantSchema = model_1.Model.AppUserGrantSchema.merge(Db.DbObjectSchema);
    Db.AppBlockSchema = model_1.Model.AppBlockSchema.merge(Db.DbObjectSchema);
    Db.GroupMembershipSchema = model_1.Model.GroupMembershipSchema.merge(Db.DbObjectSchema);
    Db.CliUserPointerSchema = z
        .object({
        type: z.literal("cliUserPointer"),
        skey: z.literal("cliUserPointer"),
        orgId: z.string(),
        userId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.GroupSchema = model_1.Model.GroupSchema.merge(Db.DbObjectSchema);
    Db.AppUserGroupSchema = model_1.Model.AppUserGroupSchema.merge(Db.DbObjectSchema);
    Db.AppGroupUserGroupSchema = model_1.Model.AppGroupUserGroupSchema.merge(Db.DbObjectSchema);
    Db.AppGroupUserSchema = model_1.Model.AppGroupUserSchema.merge(Db.DbObjectSchema);
    Db.AppBlockGroupSchema = model_1.Model.AppBlockGroupSchema.merge(Db.DbObjectSchema);
    Db.AppGroupBlockSchema = model_1.Model.AppGroupBlockSchema.merge(Db.DbObjectSchema);
    Db.AppGroupBlockGroupSchema = model_1.Model.AppGroupBlockGroupSchema.merge(Db.DbObjectSchema);
    Db.ServerSchema = model_1.Model.ServerSchema.merge(Db.DbObjectSchema);
    Db.LocalKeySchema = model_1.Model.LocalKeySchema.merge(Db.DbObjectSchema);
    Db.IncludedAppRoleSchema = model_1.Model.IncludedAppRoleSchema.merge(Db.DbObjectSchema);
    Db.EnvironmentSchema = utils.intersection(model_1.Model.EnvironmentSchema, Db.DbObjectSchema);
    Db.VariableGroupSchema = model_1.Model.VariableGroupSchema.merge(Db.DbObjectSchema);
    Db.GeneratedEnvkeySchema = z
        .object({
        encryptedPrivkey: crypto_1.Crypto.EncryptedDataSchema,
        envkeyIdPart: z.string(),
        signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        trustedRootUpdatedAt: z.number(),
        userId: z.string().optional(),
        deviceId: z.string().optional(),
        allowedIps: z.array(z.string()).optional(),
        v1Payload: z
            .object({
            encryptedV2Key: z.string(),
            encryptedPrivkey: z.string(),
            pubkey: z.string(),
            signedTrustedPubkeys: z.string(),
            signedById: z.string(),
            signedByPubkey: z.string(),
            signedByTrustedPubkeys: z.string(),
        })
            .optional(),
    })
        .merge(model_1.Model.GeneratedEnvkeySchema)
        .merge(Db.DbObjectSchema);
    Db.OrgRoleSchema = utils.intersection(Rbac.OrgRoleSchema, Db.DbObjectSchema);
    Db.AppRoleSchema = utils.intersection(Rbac.AppRoleSchema, Db.DbObjectSchema);
    Db.EnvironmentRoleSchema = utils.intersection(Rbac.EnvironmentRoleSchema, Db.DbObjectSchema);
    Db.AppRoleEnvironmentRoleSchema = utils.intersection(Rbac.AppRoleEnvironmentRoleSchema, Db.DbObjectSchema);
    Db.LoggedActionSchema = utils.intersection(logs_1.Logs.LoggedActionSchema, Db.DbObjectSchema);
    Db.PubkeyRevocationRequestSchema = model_1.Model.PubkeyRevocationRequestSchema.merge(Db.DbObjectSchema).merge(z.object({
        excludeFromDeletedGraph: z.literal(true),
    }));
    Db.RootPubkeyReplacementSchema = utils.intersection(model_1.Model.RootPubkeyReplacementSchema, Db.DbObjectSchema.merge(z.object({
        replacingPubkeyId: z.string(),
        processedAtById: z.record(z.union([z.literal(false), z.number()])),
        excludeFromDeletedGraph: z.literal(true),
    })));
    Db.UserEncryptedKeySchema = blob_1.Blob.UserEncryptedKeySchema.merge(Db.DbObjectSchema);
    Db.GeneratedEnvkeyEncryptedKeySchema = blob_1.Blob.GeneratedEnvkeyEncryptedKeySchema.merge(Db.DbObjectSchema);
    Db.EncryptedBlobSchema = blob_1.Blob.EncryptedBlobSchema.merge(Db.DbObjectSchema);
    Db.CustomerSchema = Billing.CustomerSchema.merge(z.object({
        stripeId: z.string(),
    })).merge(Db.DbObjectSchema);
    Db.ProductSchema = Billing.ProductSchema.merge(z.object({
        stripeId: z.string(),
    })).merge(Db.DbObjectSchema);
    Db.PriceSchema = Billing.PriceSchema.merge(z.object({
        stripeId: z.string(),
        stripeProductId: z.string(),
    })).merge(Db.DbObjectSchema);
    Db.SubscriptionSchema = Billing.SubscriptionSchema.merge(z.object({
        stripeId: z.string(),
        stripeProductId: z.string(),
        stripePriceId: z.string(),
        promotionCode: z.string().optional(),
    })).merge(Db.DbObjectSchema);
    Db.SubscriptionPointerSchema = z
        .object({
        type: z.literal("subscriptionPointer"),
        subscriptionId: z.string(),
        productId: z.string(),
        priceId: z.string(),
        orgId: z.string(),
    })
        .merge(Db.DbObjectSchema);
    Db.InvoiceSchema = Billing.InvoiceSchema.merge(Db.DbObjectSchema);
    Db.PaymentSourceSchema = Billing.PaymentSourceSchema.merge(Db.DbObjectSchema);
    Db.VantaExternalAuthSessionSchema = z
        .object({
        type: z.literal("vantaExternalAuthSession"),
        id: z.string(),
        orgId: z.string(),
        userId: z.string(),
        verifiedAt: z.number().optional(),
        errorAt: z.number().optional(),
        error: z.string().optional(),
    })
        .merge(Db.DbObjectSchema);
    Db.VantaConnectedAccountSchema = model_1.Model.VantaConnectedAccountSchema.merge(z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        accessTokenExpiresAt: z.number(),
        tertiaryIndex: z.enum(["syncing", "idle"]),
    })).merge(Db.DbObjectSchema.omit({ tertiaryIndex: true }));
})(Db || (exports.Db = Db = {}));
//# sourceMappingURL=db.js.map