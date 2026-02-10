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
exports.Model = void 0;
const crypto_1 = require("../crypto");
const auth_1 = require("../auth");
const trust_1 = require("../trust");
const timestamps_1 = require("../timestamps");
const Billing = __importStar(require("../billing"));
const z = __importStar(require("zod"));
const utils = __importStar(require("../utils"));
const R = __importStar(require("ramda"));
var Model;
(function (Model) {
    Model.KeyableSchema = z.object({
        pubkey: crypto_1.Crypto.PubkeySchema,
        pubkeyId: z.string(),
        pubkeyUpdatedAt: z.number(),
    });
    Model.OrgSettingsSchema = z.object({
        crypto: z.object({
            requiresPassphrase: z.boolean(),
            requiresLockout: z.boolean(),
            lockoutMs: z.number().optional(),
        }),
        auth: z.object({
            inviteExpirationMs: z.number(),
            deviceGrantExpirationMs: z.number(),
            tokenExpirationMs: z.number(),
        }),
        envs: z.object({
            autoCommitLocals: z.boolean(),
            autoCaps: z.boolean(),
        }),
    });
    Model.OrgSchema = z
        .object({
        type: z.literal("org"),
        id: z.string(),
        name: z.string(),
        creatorId: z.string(),
        rbacUpdatedAt: z.number().optional(),
        graphUpdatedAt: z.number(),
        settings: Model.OrgSettingsSchema,
        billingSettings: Billing.BillingSettingsSchema.optional(),
        serverEnvkeyCount: z.number(),
        activeUserOrInviteCount: z.number().optional(), // optional for backward compatibility
        deviceLikeCount: z.number(),
        // Self-Hosted - client only
        localIpsAllowed: z.array(z.string()).optional(),
        environmentRoleIpsAllowed: z
            .record(z.array(z.string()).optional())
            .optional(),
        selfHostedVersions: z
            .object({
            api: z.string(),
            infra: z.string(),
        })
            .optional(),
        // Self-Hosted
        selfHostedUpgradeStatus: z
            .object({
            version: z.string(),
            startedAt: z.number(),
        })
            .optional(),
        "upgradedCrypto-2.1.0": z.boolean().optional(),
        reinitializedLocals: z.boolean().optional(),
        customLicense: z.boolean().optional(),
        optimizeEmptyEnvs: z.boolean().optional(),
        orgSettingsImported: z.boolean().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.OrgStatsSchema = z.object({
        apiCallsThisHour: z.number(),
        apiCallsThisMonth: z.number(),
        dataTransferBytesThisHour: z.number(),
        dataTransferBytesThisDay: z.number(),
        dataTransferBytesThisMonth: z.number(),
        blobStorageBytes: z.number(),
        activeSocketConnections: z.number().optional(),
    });
    Model.OrgUserDeviceSchema = utils.intersection(z
        .object({
        type: z.literal("orgUserDevice"),
        id: z.string(),
        name: z.string(),
        userId: z.string(),
        isRoot: z.literal(true).optional(),
        revokedRootAt: z.number().optional(),
        approvedAt: z.number().optional(),
        deactivatedAt: z.number().optional(),
    })
        .merge(Model.KeyableSchema)
        .merge(timestamps_1.TimestampsSchema), z.union([
        z.object({
            approvedByType: z.literal("creator"),
        }),
        z.object({
            approvedByType: z.literal("invite"),
            inviteId: z.string(),
        }),
        z.object({
            approvedByType: z.literal("deviceGrant"),
            deviceGrantId: z.string(),
        }),
        z.object({
            approvedByType: z.literal("recoveryKey"),
            recoveryKeyId: z.string(),
        }),
    ]));
    Model.DeviceGrantSchema = z
        .object({
        type: z.literal("deviceGrant"),
        id: z.string(),
        deviceId: z.string(),
        granteeId: z.string(),
        grantedByUserId: z.string(),
        grantedByDeviceId: z.string().optional(),
        signedById: z.string(),
        acceptedAt: z.number().optional(),
        expiresAt: z.number(),
    })
        .merge(Model.KeyableSchema)
        .merge(timestamps_1.TimestampsSchema);
    Model.OrgUserSchema = z
        .object({
        type: z.literal("orgUser"),
        id: z.string(),
        uid: z.string(),
        email: z.string().email(),
        provider: auth_1.Auth.AuthProviderTypeSchema,
        externalAuthProviderId: z.string().optional(),
        firstName: z.string(),
        lastName: z.string(),
        invitedById: z.string().optional(),
        isCreator: z.boolean(),
        inviteAcceptedAt: z.number().optional(),
        orgRoleId: z.string(),
        // Means they are marked for deletion
        deactivatedAt: z.number().optional(),
        orgRoleUpdatedAt: z.number(),
        scim: z
            .object({ providerId: z.string(), candidateId: z.string() })
            .optional(),
        importId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.ScimUserCandidateSchema = z
        .object({
        type: z.literal("scimUserCandidate"),
        id: z.string(),
        orgId: z.string(),
        providerId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        scimUserName: z.string(),
        scimDisplayName: z.string().optional(),
        scimExternalId: z.string(),
        active: z.boolean(),
        orgUserId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.CliUserSchema = z
        .object({
        type: z.literal("cliUser"),
        id: z.string(),
        orgRoleId: z.string(),
        name: z.string(),
        creatorId: z.string(),
        creatorDeviceId: z.string(),
        isRoot: z.literal(true).optional(),
        revokedRootAt: z.number().optional(),
        signedById: z.string(),
        deactivatedAt: z.number().optional(),
        orgRoleUpdatedAt: z.number(),
        importId: z.string().optional(),
    })
        .merge(Model.KeyableSchema)
        .merge(timestamps_1.TimestampsSchema);
    Model.SamlIdpKnownServiceSchema = z.enum(Object.keys(auth_1.Auth.SAML_KNOWN_IDENTITY_PROVIDERS));
    Model.SamlIdpSettingsSchema = z.object({
        // Other party is the Identity Provider
        identityProviderEntityId: z.string().optional(),
        identityProviderLoginUrl: z.string().optional(),
        identityProviderX509Certs: z.array(z.string()).optional(),
        identityProviderX509CertsSha1: z.array(z.string()).optional(),
        identityProviderX509CertsSha256: z.array(z.string()).optional(),
        identityProviderKnownService: Model.SamlIdpKnownServiceSchema,
    });
    Model.SamlProviderEditableSettingsSchema = z.object({
        serviceProviderNameIdFormat: z.enum([
            // Object.values won't work for some reason
            auth_1.Auth.SAML_NAME_ID_FORMATS.persistent,
            auth_1.Auth.SAML_NAME_ID_FORMATS.email,
        ]),
        // the value is the mapping string that comes from the saml assert response
        serviceProviderAttributeMappings: z.object(Object.assign({}, R.mapObjIndexed((v) => z.union([z.literal(v), z.string()]), auth_1.Auth.SAML_ATTRIBUTE_DEFAULT_MAPPINGS))),
    });
    Model.SamlProviderSettingsSchema = z
        .object({
        id: z.string(),
        type: z.literal("samlProviderSettings"),
        orgId: z.string(),
        externalAuthProviderId: z.string(),
        serviceProviderEntityId: z.string(),
        serviceProviderAcsUrl: z.string(),
        serviceProviderX509Cert: z.string(),
        serviceProviderX509CertSha1: z.string(),
        serviceProviderX509CertSha256: z.string(),
    })
        .merge(Model.SamlProviderEditableSettingsSchema)
        .merge(Model.SamlIdpSettingsSchema)
        .merge(timestamps_1.TimestampsSchema);
    Model.ExternalAuthProviderSchema = utils.intersection(z
        .object({
        type: z.literal("externalAuthProvider"),
        id: z.string(),
        orgId: z.string(),
        nickname: z.string().optional(),
        authMethod: auth_1.Auth.ExternalAuthMethodSchema,
    })
        .merge(timestamps_1.TimestampsSchema), z.union([
        z.object({
            provider: auth_1.Auth.HostedOauthProviderTypeSchema,
        }),
        z.object({
            provider: z.literal("saml"),
            samlSettingsId: z.string(),
        }),
    ]));
    Model.ScimProvisioningProviderSchema = z
        .object({
        type: z.literal("scimProvisioningProvider"),
        id: z.string(),
        orgId: z.string(),
        nickname: z.string().optional(),
        authScheme: auth_1.Auth.ProvisioningProviderAuthSchemeTypeSchema,
        endpointBaseUrl: z.string(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.InviteSchema = z
        .object({
        type: z.literal("invite"),
        id: z.string(),
        inviteeId: z.string(),
        invitedByUserId: z.string(),
        invitedByDeviceId: z.string().optional(),
        signedById: z.string(),
        acceptedAt: z.number().optional(),
        expiresAt: z.number(),
        v1Invite: z.boolean().optional(),
    })
        .merge(Model.KeyableSchema)
        .merge(timestamps_1.TimestampsSchema);
    Model.ExternalAuthUserSchema = z.object({
        uid: z.string(),
        email: z.string().email().optional(),
        username: z.string().optional(),
        firstName: z.string(),
        lastName: z.string(),
    });
    Model.EnvParentSettingsSchema = z.object({
        autoCaps: z.boolean().optional(),
        autoCommitLocals: z.boolean().optional(),
    });
    Model.EnvParentFieldsSchema = z
        .object({
        id: z.string(),
        name: z.string(),
        envsUpdatedAt: z.number().optional(),
        localsUpdatedAtByUserId: z.record(z.number()),
        localsUpdatedAt: z.number().optional(),
        localsEncryptedBy: z.record(z.string()),
        localsReencryptionRequiredAt: z.record(z.number()),
        envsOrLocalsUpdatedAt: z.number().optional(),
        localsRequireReinit: z.boolean().optional(),
        importId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.AppSettingsSchema = Model.EnvParentSettingsSchema;
    Model.AppSchema = z
        .object({
        type: z.literal("app"),
        settings: Model.AppSettingsSchema,
        environmentRoleIpsMergeStrategies: z
            .record(z.enum(["extend", "override"]).optional())
            .optional(),
        environmentRoleIpsAllowed: z
            .record(z.array(z.string()).optional())
            .optional(),
    })
        .merge(Model.EnvParentFieldsSchema);
    Model.BlockSettingsSchema = Model.EnvParentSettingsSchema;
    Model.BlockSchema = z
        .object({
        type: z.literal("block"),
        settings: Model.BlockSettingsSchema,
    })
        .merge(Model.EnvParentFieldsSchema);
    Model.EnvParentSchema = z.union([Model.AppSchema, Model.BlockSchema]);
    Model.AppUserGrantSchema = z
        .object({
        type: z.literal("appUserGrant"),
        id: z.string(),
        userId: z.string(),
        appId: z.string(),
        appRoleId: z.string(),
        importId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    const KeyableParentFieldsSchema = z
        .object({
        name: z.string(),
        id: z.string(),
        appId: z.string(),
        environmentId: z.string(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.ServerSchema = z
        .object({
        type: z.literal("server"),
        importId: z.string().optional(),
    })
        .merge(KeyableParentFieldsSchema);
    Model.LocalKeySchema = z
        .object({
        type: z.literal("localKey"),
        userId: z.string(),
        deviceId: z.string(),
        autoGenerated: z.literal(true).optional(),
        importId: z.string().optional(),
        isV1UpgradeKey: z.literal(true).optional(),
    })
        .merge(KeyableParentFieldsSchema);
    Model.KeyableParentSchema = z.union([Model.ServerSchema, Model.LocalKeySchema]);
    Model.AppBlockSchema = z
        .object({
        type: z.literal("appBlock"),
        id: z.string(),
        appId: z.string(),
        blockId: z.string(),
        orderIndex: z.number(),
        importId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.EnvironmentBaseSchema = z
        .object({
        type: z.literal("environment"),
        id: z.string(),
        envParentId: z.string(),
        environmentRoleId: z.string(),
        envUpdatedAt: z.number().optional(),
        encryptedById: z.string().optional(),
        reencryptionRequiredAt: z.number().optional(),
        "upgradedCrypto-2.1.0": z.boolean().optional(),
        requiresReinit: z.boolean().optional(),
        importId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.EnvironmentSettingsSchema = z.object({
        autoCommit: z.boolean().optional(),
    });
    Model.EnvironmentSchema = utils.intersection(Model.EnvironmentBaseSchema, z.union([
        z.object({
            isSub: z.literal(false),
            settings: Model.EnvironmentSettingsSchema,
        }),
        z.object({
            isSub: z.literal(true),
            parentEnvironmentId: z.string(),
            subName: z.string(),
        }),
    ]));
    Model.RecoveryKeySchema = z
        .object({
        type: z.literal("recoveryKey"),
        id: z.string(),
        userId: z.string(),
        creatorDeviceId: z.string(),
        signedById: z.string(),
        redeemedAt: z.number().optional(),
    })
        .merge(Model.KeyableSchema)
        .merge(timestamps_1.TimestampsSchema);
    Model.VariableGroupSchema = z
        .object({
        type: z.literal("variableGroup"),
        id: z.string(),
        envParentId: z.string(),
        name: z.string(),
        subEnvironmentId: z.string(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.IncludedAppRoleSchema = z
        .object({
        type: z.literal("includedAppRole"),
        id: z.string(),
        appId: z.string(),
        appRoleId: z.string(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.GroupSchema = z
        .object({
        type: z.literal("group"),
        objectType: z.enum(["orgUser", "app", "block"]),
        id: z.string(),
        name: z.string(),
        membershipsUpdatedAt: z.number().optional(),
        importId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.GroupMembershipSchema = z
        .object({
        type: z.literal("groupMembership"),
        id: z.string(),
        groupId: z.string(),
        objectId: z.string(),
        orderIndex: z.number().optional(),
        importId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.AppUserGroupSchema = z
        .object({
        type: z.literal("appUserGroup"),
        id: z.string(),
        appId: z.string(),
        userGroupId: z.string(),
        appRoleId: z.string(),
        importId: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.AppGroupUserGroupSchema = z
        .object({
        type: z.literal("appGroupUserGroup"),
        id: z.string(),
        appGroupId: z.string(),
        userGroupId: z.string(),
        appRoleId: z.string(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.AppGroupUserSchema = z
        .object({
        type: z.literal("appGroupUser"),
        id: z.string(),
        appGroupId: z.string(),
        userId: z.string(),
        appRoleId: z.string(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.AppBlockGroupSchema = z
        .object({
        type: z.literal("appBlockGroup"),
        id: z.string(),
        blockGroupId: z.string(),
        appId: z.string(),
        orderIndex: z.number(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.AppGroupBlockSchema = z
        .object({
        type: z.literal("appGroupBlock"),
        id: z.string(),
        appGroupId: z.string(),
        blockId: z.string(),
        orderIndex: z.number(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.AppGroupBlockGroupSchema = z
        .object({
        type: z.literal("appGroupBlockGroup"),
        id: z.string(),
        appGroupId: z.string(),
        blockGroupId: z.string(),
        orderIndex: z.number(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.GeneratedEnvkeySchema = z
        .object({
        type: z.literal("generatedEnvkey"),
        id: z.string(),
        appId: z.string(),
        environmentId: z.string(),
        keyableParentId: z.string(),
        keyableParentType: z.enum(["server", "localKey"]),
        envkeyShort: z.string(),
        envkeyIdPartHash: z.string(),
        creatorId: z.string(),
        creatorDeviceId: z.string().optional(),
        signedById: z.string(),
        blobsUpdatedAt: z.number(),
    })
        .merge(Model.KeyableSchema)
        .merge(timestamps_1.TimestampsSchema);
    Model.AccessParamsSchema = z.object({
        orgRoleId: z.string(),
        appUserGrants: z
            .array(Model.AppUserGrantSchema.pick({ appId: true, appRoleId: true }))
            .optional(),
        userGroupIds: z.array(z.string()).optional(),
    });
    Model.GeneratedEnvkeyFieldsSchema = (zodSchema) => z.object({
        env: zodSchema.optional(),
        inheritanceOverrides: z.record(zodSchema).optional(),
        localOverrides: zodSchema.optional(),
        subEnv: zodSchema.optional(),
    });
    Model.PubkeyRevocationRequestSchema = z
        .object({
        type: z.literal("pubkeyRevocationRequest"),
        id: z.string(),
        targetId: z.string(),
        creatorId: z.string(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.RootPubkeyReplacementSchema = z
        .object({
        type: z.literal("rootPubkeyReplacement"),
        id: z.string(),
        requestId: z.string(),
        creatorId: z.string(),
        replacingPubkey: crypto_1.Crypto.PubkeySchema,
        signedReplacingTrustChain: trust_1.Trust.SignedTrustChainSchema,
    })
        .merge(timestamps_1.TimestampsSchema);
    Model.VantaConnectedAccountSchema = z
        .object({
        type: z.literal("vantaConnectedAccount"),
        id: z.string(),
        lastSyncAt: z.number().optional(),
        status: z.enum(["active", "error"]),
        error: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
})(Model || (exports.Model = Model = {}));
//# sourceMappingURL=index.js.map