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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Net = void 0;
const crypto_1 = require("../crypto");
const model_1 = require("../model");
const blob_1 = require("../blob");
const Rbac = __importStar(require("../rbac"));
const auth_1 = require("../auth");
const logs_1 = require("../logs");
const client_1 = __importDefault(require("../client"));
const trust_1 = require("../trust");
const Billing = __importStar(require("../billing"));
const action_type_1 = __importDefault(require("./action_type"));
const db_1 = require("./db");
const v1_upgrade_1 = require("./v1_upgrade");
const z = __importStar(require("zod"));
const utils = __importStar(require("../utils"));
var Net;
(function (Net) {
    const CreateExternalAuthSessionSchema = utils.intersection(z.object({
        authType: z.enum([
            auth_1.Auth.AuthTypeSchema.Values.accept_device_grant,
            auth_1.Auth.AuthTypeSchema.Values.accept_invite,
            auth_1.Auth.AuthTypeSchema.Values.redeem_recovery_key,
            auth_1.Auth.AuthTypeSchema.Values.sign_in,
            auth_1.Auth.AuthTypeSchema.Values.sign_up,
        ]),
        authMethod: auth_1.Auth.ExternalAuthMethodSchema,
        provider: auth_1.Auth.ExternalAuthProviderTypeSchema,
        orgId: z.string(),
    }), z.union([
        utils.intersection(z.object({ authType: z.literal(auth_1.Auth.AuthTypeSchema.Values.sign_up) }), z.union([
            z.object({
                authMethod: z.literal(auth_1.Auth.ExternalAuthMethodSchema.Values.oauth_hosted),
                provider: auth_1.Auth.HostedOauthProviderTypeSchema,
                providerSettings: db_1.Db.HostedOauthProviderSettingsSchema,
            }),
            z.object({
                authMethod: z.literal("oauth_cloud"),
                provider: auth_1.Auth.CloudOauthProviderTypeSchema,
            }),
        ])),
        utils.intersection(z.union([
            z.object({
                authType: z.enum([
                    auth_1.Auth.AuthTypeSchema.Values.accept_invite,
                    auth_1.Auth.AuthTypeSchema.Values.accept_device_grant,
                    auth_1.Auth.AuthTypeSchema.Values.redeem_recovery_key,
                ]),
                // authObjectId can be an invitation ID
                authObjectId: z.string(),
            }),
            z.object({
                authType: z.literal(auth_1.Auth.AuthTypeSchema.Values.sign_in),
                userId: z.string(),
                externalAuthProviderId: z.string(),
            }),
        ]), z.union([
            z.object({
                authMethod: z.enum([
                    auth_1.Auth.ExternalAuthMethodSchema.Values.oauth_hosted,
                    auth_1.Auth.ExternalAuthMethodSchema.Values.saml,
                ]),
                externalAuthProviderId: z.string(),
            }),
            z.object({
                authMethod: z.literal(auth_1.Auth.ExternalAuthMethodSchema.Values.oauth_cloud),
            }),
            z.object({
                authMethod: z.literal("saml"),
                provider: z.literal("saml"),
                externalAuthProviderId: z.string(),
            }),
        ])),
    ]));
    const CreateExternalAuthInviteSessionSchema = utils.intersection(z.object({
        authType: z.enum([
            auth_1.Auth.AuthTypeSchema.Values.accept_device_grant,
            auth_1.Auth.AuthTypeSchema.Values.accept_invite,
            auth_1.Auth.AuthTypeSchema.Values.redeem_recovery_key,
            auth_1.Auth.AuthTypeSchema.Values.sign_in,
            auth_1.Auth.AuthTypeSchema.Values.sign_up,
        ]),
        inviteExternalAuthUsersType: z.enum(["initial", "re-authenticate"]),
        provider: auth_1.Auth.ExternalAuthProviderTypeSchema,
    }), z.union([
        utils.intersection(z.object({
            authMethod: z.literal(auth_1.Auth.ExternalAuthMethodSchema.Values.oauth_hosted),
            provider: auth_1.Auth.HostedOauthProviderTypeSchema,
        }), z.union([
            z.object({
                inviteExternalAuthUsersType: z.literal("initial"),
                providerSettings: db_1.Db.HostedOauthProviderSettingsSchema,
            }),
            z.object({
                inviteExternalAuthUsersType: z.literal("re-authenticate"),
                externalAuthProviderId: z.string(),
            }),
        ])),
        z.object({
            authMethod: z.literal(auth_1.Auth.ExternalAuthMethodSchema.Values.oauth_cloud),
        }),
    ]));
    Net.OauthCallbackQuerySchema = z.object({
        state: z.string(),
        code: z.string(),
        error: z.string().optional(),
        error_description: z.string().optional(),
    });
    Net.OauthCallbackSchema = z
        .object({
        provider: auth_1.Auth.OauthProviderTypeSchema,
    })
        .merge(Net.OauthCallbackQuerySchema);
    Net.SamlAcsCallbackBodyParams = z.object({
        externalAuthProviderId: z.string(),
        samlResponse: z.string(),
        relayState: z.string(),
    });
    Net.DeviceParamsSchema = z.object({
        signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        name: z.string(),
        pubkey: crypto_1.Crypto.PubkeySchema,
    });
    Net.IdParamsSchema = z.object({
        id: z.string(),
    });
    Net.UserEnvUpdateSchema = z.object({
        env: crypto_1.Crypto.EncryptedDataSchema.optional(),
        meta: crypto_1.Crypto.EncryptedDataSchema.optional(),
        inherits: crypto_1.Crypto.EncryptedDataSchema.optional(),
        inheritanceOverrides: z.record(crypto_1.Crypto.EncryptedDataSchema).optional(),
        changesets: crypto_1.Crypto.EncryptedDataSchema.optional(),
        changesetsById: z
            .record(z.object({
            data: crypto_1.Crypto.EncryptedDataSchema,
            createdAt: z.number().optional(),
            createdById: z.string().optional(),
        }))
            .optional(),
    });
    Net.LocalsUpdateSchema = z.object({
        env: crypto_1.Crypto.EncryptedDataSchema.optional(),
        meta: crypto_1.Crypto.EncryptedDataSchema.optional(),
        changesets: crypto_1.Crypto.EncryptedDataSchema.optional(),
        changesetsById: z
            .record(z.object({
            data: crypto_1.Crypto.EncryptedDataSchema,
            createdAt: z.number().optional(),
            createdById: z.string().optional(),
        }))
            .optional(),
    });
    Net.EnvParentsEnvUpdateSchema = z.record(z.object({
        environments: z.record(Net.UserEnvUpdateSchema).optional(),
        locals: z.record(Net.LocalsUpdateSchema).optional(),
    }));
    Net.GeneratedEnvkeyEncryptedKeyParamsSchema = model_1.Model.GeneratedEnvkeyFieldsSchema(blob_1.Blob.GeneratedEnvkeyEncryptedKeySchema.pick({
        data: true,
    }));
    Net.EnvParamsSchema = z.object({
        keys: z.object({
            users: z.record(z.record(Net.EnvParentsEnvUpdateSchema)).optional(),
            keyableParents: z
                .record(z.record(Net.GeneratedEnvkeyEncryptedKeyParamsSchema))
                .optional(),
            blockKeyableParents: z
                .record(z.record(z.record(Net.GeneratedEnvkeyEncryptedKeyParamsSchema)))
                .optional(),
            newDevice: Net.EnvParentsEnvUpdateSchema.optional(),
        }),
        blobs: Net.EnvParentsEnvUpdateSchema,
        encryptedByTrustChain: crypto_1.Crypto.SignedDataSchema.optional(),
    });
    Net.FetchChangesetOptionsSchema = z.object({
        createdAfter: z.number().optional(),
    });
    const FetchEnvsParamsSchema = z.object({
        byEnvParentId: z.record(z.object({
            envs: z.literal(true).optional(),
            changesets: z.literal(true).optional(),
            changesetOptions: Net.FetchChangesetOptionsSchema.optional(),
        })),
        keysOnly: z.boolean().optional(),
    });
    Net.OrderIndexByIdSchema = z.record(z.number());
    const registerSchema = utils.intersection(z.object({
        user: model_1.Model.OrgUserSchema.pick({
            email: true,
            firstName: true,
            lastName: true,
        }),
        device: Net.DeviceParamsSchema,
        org: model_1.Model.OrgSchema.pick({
            name: true,
            settings: true,
        }),
        test: z.boolean().optional(),
    }), z.union([
        utils.intersection(z.object({
            hostType: z.literal("cloud"),
            v1Upgrade: v1_upgrade_1.V1Upgrade.UpgradeSchema.optional(),
        }), z.union([
            z.object({
                provider: z.literal("email"),
                emailVerificationToken: z.string(),
            }),
            z.object({
                provider: auth_1.Auth.ExternalAuthProviderTypeSchema,
                externalAuthSessionId: z.string(),
            }),
        ])),
        z.object({
            hostType: z.literal("self-hosted"),
            provider: z.literal("email"),
            emailVerificationToken: z.string().optional(), // for local self-hosted (development only)
            domain: z.string(),
            selfHostedFailoverRegion: z.string().optional(),
        }),
        z.object({
            hostType: z.literal("community"),
            provider: z.literal("email"),
            emailVerificationToken: z.string(),
            communityAuth: z.string(),
        }),
    ]));
    Net.SCHEMA_URN_ERROR = "urn:ietf:params:scim:api:messages:2.0:Error";
    Net.SCHEMA_URN_USER = "urn:ietf:params:scim:schemas:core:2.0:User";
    Net.SCHEMA_URN_LIST = "urn:ietf:params:scim:api:messages:2.0:ListResponse";
    Net.ScimCreateUserSchema = z.object({
        externalId: z.string().optional(),
        userName: z.string().optional(),
        active: z.boolean().optional(),
        emails: z
            .array(z
            .object({
            primary: z.boolean().optional(),
            type: z.string().optional(),
            value: z.string().email(),
        })
            // display, other props
            .nonstrict())
            .optional(),
        displayName: z.string().optional(),
        name: z
            .object({
            formatted: z.string().optional(),
            familyName: z.string().optional(),
            givenName: z.string().optional(),
        })
            .nonstrict()
            .optional(),
    });
    Net.ScimPatchUserSchema = z.array(z.union([
        z
            .object({
            op: z.enum(["Replace", "replace"]),
            path: z.literal("active"),
            value: z.union([z.string(), z.boolean()]),
        })
            .nonstrict(),
        z
            .object({
            op: z.enum(["Replace", "replace"]),
            path: z.literal("userName"),
            value: z.string(),
        })
            .nonstrict(),
        z
            .object({
            op: z.enum(["Add", "Replace", "add", "replace"]),
            path: z.enum(["name.familyName", "name.givenName"]),
            value: z.string(),
        })
            .nonstrict(),
        z
            .object({
            op: z.enum(["Add", "Replace", "add", "replace"]),
            // email
            path: z.string(),
            value: z.string(),
        })
            .nonstrict(),
    ]));
    Net.ApiParamSchemas = {
        [action_type_1.default.REGISTER]: registerSchema,
        [action_type_1.default.INIT_SELF_HOSTED]: z.object({
            registerAction: z.object({
                type: z.literal(action_type_1.default.REGISTER),
                payload: registerSchema,
                meta: z.object({
                    loggableType: z.literal("authAction"),
                    loggableType2: z.literal("orgAction"),
                    client: client_1.default.ClientParamsSchema,
                }),
            }),
            initInstructions: z
                .union([
                z.object({
                    type: z.literal("dnsCnames"),
                    records: z.array(z.object({
                        fqdn: z.string(),
                        cname: z.string(),
                    })),
                }),
                z.object({
                    type: z.literal("dnsVerifyInternalService"),
                    serviceName: z.string(),
                    record: z.object({
                        fqdn: z.string(),
                        txt: z.string(),
                    }),
                }),
                z.object({
                    type: z.literal("internalServiceName"),
                    serviceName: z.string(),
                }),
            ])
                .optional(),
        }),
        [action_type_1.default.UPGRADE_SELF_HOSTED]: z.object({
            apiVersionNumber: z.string(),
            infraVersionNumber: z.string().optional(),
            usingUpdaterVersion: z.string().optional(),
        }),
        [action_type_1.default.UPGRADE_SELF_HOSTED_FORCE_CLEAR]: z.object({}),
        [action_type_1.default.CREATE_SESSION]: utils.intersection(z.object({
            orgId: z.string(),
            userId: z.string(),
            deviceId: z.string(),
            signature: z.string(),
        }), z.union([
            z.object({
                provider: z.literal("email"),
                emailVerificationToken: z.string(),
            }),
            z.object({
                provider: auth_1.Auth.ExternalAuthProviderTypeSchema,
                externalAuthSessionId: z.string(),
            }),
        ])),
        [action_type_1.default.CLEAR_TOKEN]: z.object({}),
        [action_type_1.default.FORGET_DEVICE]: z.object({}),
        [action_type_1.default.CLEAR_USER_TOKENS]: z.object({
            userId: z.string(),
        }),
        [action_type_1.default.CLEAR_ORG_TOKENS]: z.object({}),
        [action_type_1.default.GET_SESSION]: z.object({
            graphUpdatedAt: z.number().optional(),
        }),
        [action_type_1.default.FETCH_ORG_STATS]: z.object({}),
        [action_type_1.default.RENAME_ORG]: z.object({ name: z.string() }),
        [action_type_1.default.RENAME_USER]: z
            .object({ firstName: z.string(), lastName: z.string() })
            .merge(Net.IdParamsSchema),
        [action_type_1.default.DELETE_ORG]: z.object({}),
        [action_type_1.default.CREATE_EXTERNAL_AUTH_SESSION]: CreateExternalAuthSessionSchema,
        [action_type_1.default.CREATE_EXTERNAL_AUTH_INVITE_SESSION]: CreateExternalAuthInviteSessionSchema,
        [action_type_1.default.GET_EXTERNAL_AUTH_SESSION]: z.object({
            id: z.string(),
        }),
        [action_type_1.default.GET_EXTERNAL_AUTH_PROVIDERS]: z.object({
            provider: auth_1.Auth.ExternalAuthProviderTypeSchema,
        }),
        [action_type_1.default.DELETE_EXTERNAL_AUTH_PROVIDER]: Net.IdParamsSchema,
        [action_type_1.default.GET_EXTERNAL_AUTH_USERS]: z.object({
            provider: auth_1.Auth.OauthProviderTypeSchema,
            query: z.string().optional(),
            externalAuthOrgId: z.string().optional(),
        }),
        [action_type_1.default.GET_EXTERNAL_AUTH_ORGS]: z.object({
            provider: auth_1.Auth.OauthProviderTypeSchema,
        }),
        [action_type_1.default.CREATE_SCIM_PROVISIONING_PROVIDER]: model_1.Model.ScimProvisioningProviderSchema.pick({
            nickname: true,
            authScheme: true,
        }).merge(z.object({
            secret: z.string(),
        })),
        [action_type_1.default.UPDATE_SCIM_PROVISIONING_PROVIDER]: model_1.Model.ScimProvisioningProviderSchema.pick({
            id: true,
            nickname: true,
            authScheme: true,
        }).merge(z.object({
            secret: z.string().optional(),
        })),
        [action_type_1.default.DELETE_SCIM_PROVISIONING_PROVIDER]: Net.IdParamsSchema,
        [action_type_1.default.LIST_INVITABLE_SCIM_USERS]: z.object({
            id: z.string(),
            all: z.boolean().optional(),
        }),
        [action_type_1.default.CHECK_SCIM_PROVIDER]: Net.IdParamsSchema,
        // SCIM Request JSON. All may include additional ignored properties from
        // the SCIM spec, so be sure to add `.nonstrict()`
        [action_type_1.default.CREATE_SCIM_USER]: Net.ScimCreateUserSchema.nonstrict(),
        [action_type_1.default.DELETE_SCIM_USER]: z.object({
            id: z.string(),
            providerId: z.string(),
        }),
        [action_type_1.default.GET_SCIM_USER]: z.object({
            id: z.string(),
            providerId: z.string(),
        }),
        [action_type_1.default.LIST_SCIM_USERS]: z
            .object({
            providerId: z.string(),
            filter: z.string().optional(),
            // startIndex is a 1-based index
            startIndex: z.number().int().min(1).optional(),
            count: z.number().int().min(1).optional(),
            sortBy: z.string().optional(),
            sortOrder: z.string().optional(),
            // ignored query features
            attributes: z.string().optional(),
            excludedAttributes: z.string().optional(),
        })
            .nonstrict(),
        [action_type_1.default.UPDATE_SCIM_USER]: z
            .object({
            id: z.string(),
            providerId: z.string(),
            operations: Net.ScimPatchUserSchema.optional(),
            Operations: Net.ScimPatchUserSchema.optional(),
        })
            .merge(Net.ScimCreateUserSchema)
            .nonstrict(),
        [action_type_1.default.CREATE_EMAIL_VERIFICATION]: z
            .object({
            confirmEmailProvider: z.boolean().optional(),
            communityAuth: z.string().optional(),
        })
            .merge(db_1.Db.EmailVerificationSchema.pick({ authType: true, email: true })),
        [action_type_1.default.CHECK_EMAIL_TOKEN_VALID]: db_1.Db.EmailVerificationSchema.pick({
            email: true,
            token: true,
        }),
        [action_type_1.default.CREATE_INVITE]: z
            .object({
            signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
            user: model_1.Model.OrgUserSchema.pick({
                email: true,
                firstName: true,
                lastName: true,
                provider: true,
                uid: true,
                externalAuthProviderId: true,
                orgRoleId: true,
                importId: true,
            }),
            appUserGrants: z
                .array(model_1.Model.AppUserGrantSchema.pick({
                appId: true,
                appRoleId: true,
            }))
                .optional(),
            userGroupIds: z.array(z.string()).optional(),
            scim: z
                .object({ providerId: z.string(), candidateId: z.string() })
                .optional(),
            v1Token: z.string().optional(),
        })
            .merge(db_1.Db.InviteSchema.pick({
            identityHash: true,
            pubkey: true,
            encryptedPrivkey: true,
        }))
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.LOAD_INVITE]: z.object({}),
        [action_type_1.default.REVOKE_INVITE]: Net.IdParamsSchema,
        [action_type_1.default.ACCEPT_INVITE]: z
            .object({
            device: Net.DeviceParamsSchema,
        })
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.OAUTH_CALLBACK]: Net.OauthCallbackSchema,
        [action_type_1.default.SAML_ACS_CALLBACK]: Net.SamlAcsCallbackBodyParams,
        [action_type_1.default.CREATE_DEVICE_GRANT]: z
            .object({
            signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        })
            .merge(db_1.Db.DeviceGrantSchema.pick({
            identityHash: true,
            pubkey: true,
            encryptedPrivkey: true,
            granteeId: true,
        }))
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.LOAD_DEVICE_GRANT]: z.object({}),
        [action_type_1.default.REVOKE_DEVICE_GRANT]: Net.IdParamsSchema,
        [action_type_1.default.ACCEPT_DEVICE_GRANT]: z
            .object({
            device: Net.DeviceParamsSchema,
        })
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.REVOKE_DEVICE]: Net.IdParamsSchema,
        [action_type_1.default.UPDATE_ORG_SETTINGS]: model_1.Model.OrgSettingsSchema.merge(z.object({
            isImport: z.boolean().optional(),
        })),
        [action_type_1.default.CREATE_ORG_SAML_PROVIDER]: z.object({
            nickname: z.string(),
            identityProviderKnownService: model_1.Model.SamlIdpKnownServiceSchema.optional(),
        }),
        [action_type_1.default.UPDATE_ORG_SAML_SETTINGS]: z.object({
            id: z.string(),
            nickname: z.string().optional(),
            samlSettings: model_1.Model.SamlIdpSettingsSchema.merge(model_1.Model.SamlProviderEditableSettingsSchema)
                .partial()
                .optional(),
        }),
        [action_type_1.default.UPDATE_USER_ROLE]: z
            .object({
            id: z.string(),
            orgRoleId: z.string(),
        })
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.REMOVE_FROM_ORG]: Net.IdParamsSchema,
        [action_type_1.default.CREATE_CLI_USER]: z
            .object({
            cliKeyIdPart: z.string(),
            signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
            appUserGrants: z
                .array(model_1.Model.AppUserGrantSchema.pick({
                appId: true,
                appRoleId: true,
            }))
                .optional(),
        })
            .merge(db_1.Db.CliUserSchema.pick({
            name: true,
            pubkey: true,
            encryptedPrivkey: true,
            orgRoleId: true,
            importId: true,
        }))
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.RENAME_CLI_USER]: z
            .object({ name: z.string() })
            .merge(Net.IdParamsSchema),
        [action_type_1.default.DELETE_CLI_USER]: Net.IdParamsSchema,
        [action_type_1.default.AUTHENTICATE_CLI_KEY]: z.object({
            cliKeyIdPart: z.string(),
        }),
        [action_type_1.default.CREATE_RECOVERY_KEY]: z
            .object({
            signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        })
            .merge(z.object({
            recoveryKey: db_1.Db.RecoveryKeySchema.pick({
                identityHash: true,
                pubkey: true,
                encryptedPrivkey: true,
            }),
        }))
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.LOAD_RECOVERY_KEY]: z.object({
            emailToken: z.string().optional(),
        }),
        [action_type_1.default.REDEEM_RECOVERY_KEY]: z
            .object({
            device: Net.DeviceParamsSchema,
            emailToken: z.string().optional(),
        })
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.UPDATE_TRUSTED_ROOT_PUBKEY]: z.object({
            signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
            replacementIds: z.array(z.string()),
        }),
        [action_type_1.default.ENVKEY_FETCH_UPDATE_TRUSTED_ROOT_PUBKEY]: z.object({
            signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
            replacementIds: z.array(z.string()),
            envkeyIdPart: z.string(),
            orgId: z.string(),
            signature: z.string(),
        }),
        [action_type_1.default.CREATE_APP]: model_1.Model.AppSchema.pick({
            name: true,
            settings: true,
            importId: true,
        }),
        [action_type_1.default.RENAME_APP]: z
            .object({ name: z.string() })
            .merge(Net.IdParamsSchema),
        [action_type_1.default.UPDATE_APP_SETTINGS]: z
            .object({
            settings: model_1.Model.AppSettingsSchema,
        })
            .merge(Net.IdParamsSchema),
        [action_type_1.default.DELETE_APP]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.GRANT_APP_ACCESS]: model_1.Model.AppUserGrantSchema.pick({
            userId: true,
            appId: true,
            appRoleId: true,
            importId: true,
        }).merge(Net.EnvParamsSchema),
        [action_type_1.default.REMOVE_APP_ACCESS]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_BLOCK]: model_1.Model.BlockSchema.pick({
            name: true,
            settings: true,
            importId: true,
        }),
        [action_type_1.default.RENAME_BLOCK]: z
            .object({ name: z.string() })
            .merge(Net.IdParamsSchema),
        [action_type_1.default.UPDATE_BLOCK_SETTINGS]: z
            .object({
            settings: model_1.Model.BlockSettingsSchema,
        })
            .merge(Net.IdParamsSchema),
        [action_type_1.default.DELETE_BLOCK]: Net.IdParamsSchema,
        [action_type_1.default.CONNECT_BLOCK]: model_1.Model.AppBlockSchema.pick({
            appId: true,
            blockId: true,
            orderIndex: true,
            importId: true,
        }).merge(Net.EnvParamsSchema),
        [action_type_1.default.DISCONNECT_BLOCK]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.UPDATE_ENVS]: Net.EnvParamsSchema.merge(z.object({
            upgradeCrypto: z.boolean().optional(),
        })),
        [action_type_1.default.FETCH_ENVS]: FetchEnvsParamsSchema,
        [action_type_1.default.CREATE_VARIABLE_GROUP]: model_1.Model.VariableGroupSchema.pick({
            envParentId: true,
            subEnvironmentId: true,
            name: true,
        }),
        [action_type_1.default.DELETE_VARIABLE_GROUP]: Net.IdParamsSchema,
        [action_type_1.default.CREATE_SERVER]: model_1.Model.ServerSchema.pick({
            appId: true,
            name: true,
            environmentId: true,
            importId: true,
        }),
        [action_type_1.default.DELETE_SERVER]: Net.IdParamsSchema,
        [action_type_1.default.CREATE_LOCAL_KEY]: model_1.Model.LocalKeySchema.pick({
            appId: true,
            name: true,
            environmentId: true,
            autoGenerated: true,
            importId: true,
            isV1UpgradeKey: true,
        }).merge(z.object({
            userId: z.string().optional(),
        })),
        [action_type_1.default.DELETE_LOCAL_KEY]: Net.IdParamsSchema,
        [action_type_1.default.GENERATE_KEY]: z
            .object({
            envkeyIdPart: z.string(),
            signedTrustedRoot: crypto_1.Crypto.SignedDataSchema,
        })
            .merge(db_1.Db.GeneratedEnvkeySchema.pick({
            appId: true,
            keyableParentType: true,
            keyableParentId: true,
            pubkey: true,
            encryptedPrivkey: true,
            v1Payload: true,
        }))
            .merge(Net.EnvParamsSchema),
        [action_type_1.default.REVOKE_KEY]: Net.IdParamsSchema,
        [action_type_1.default.FETCH_LOGS]: logs_1.Logs.FetchLogParamsSchema,
        [action_type_1.default.RBAC_CREATE_ORG_ROLE]: utils.intersection(Rbac.RoleBaseSchema.pick({ name: true, description: true })
            .merge(Rbac.OrgRoleBaseSchema.omit({ type: true }))
            .merge(z.object({
            canBeManagedByOrgRoleIds: z.array(z.string()),
            canBeInvitedByOrgRoleIds: z.array(z.string()),
        })), utils.intersection(Rbac.WithPermissions(Rbac.OrgPermissionSchema), utils.intersection(Rbac.OrgRoleCanManageSchema, Rbac.OrgRoleCanInviteSchema))),
        [action_type_1.default.RBAC_DELETE_ORG_ROLE]: Net.IdParamsSchema,
        [action_type_1.default.RBAC_UPDATE_ORG_ROLE]: utils.intersection(Net.IdParamsSchema.merge(Rbac.RoleBaseSchema.pick({
            name: true,
            description: true,
        }).partial())
            .merge(z
            .object({
            canBeManagedByOrgRoleIds: z.array(z.string()),
            canBeInvitedByOrgRoleIds: z.array(z.string()),
        })
            .partial())
            .merge(Rbac.OrgRoleBaseSchema.pick({
            autoAppRoleId: true,
        }).partial())
            .merge(Net.EnvParamsSchema.partial()), utils.intersection(Rbac.WithOptionalPermissions(Rbac.OrgPermissionSchema), utils.intersection(Rbac.OrgRoleOptionalCanManageSchema, Rbac.OrgRoleOptionalCanInviteSchema))),
        [action_type_1.default.CREATE_ENVIRONMENT]: utils.intersection(model_1.Model.EnvironmentBaseSchema.pick({
            envParentId: true,
            environmentRoleId: true,
            importId: true,
        }).merge(Net.EnvParamsSchema.partial()), z.union([
            z.object({
                isSub: z.undefined(),
                parentEnvironmentId: z.undefined(),
                subName: z.undefined(),
            }),
            z.object({
                isSub: z.literal(true),
                parentEnvironmentId: z.string(),
                subName: z.string(),
            }),
        ])),
        [action_type_1.default.DELETE_ENVIRONMENT]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.UPDATE_ENVIRONMENT_SETTINGS]: Net.IdParamsSchema.merge(z.object({
            settings: model_1.Model.EnvironmentSettingsSchema,
        })),
        [action_type_1.default.RBAC_CREATE_ENVIRONMENT_ROLE]: Rbac.RoleBaseSchema.pick({
            name: true,
            description: true,
        })
            .merge(Rbac.EnvironmentRoleBaseSchema.omit({
            type: true,
            orderIndex: true,
        }))
            .merge(z.object({
            appRoleEnvironmentRoles: Rbac.EnvironmentPermissionsSchema,
        })),
        [action_type_1.default.RBAC_DELETE_ENVIRONMENT_ROLE]: Net.IdParamsSchema,
        [action_type_1.default.RBAC_UPDATE_ENVIRONMENT_ROLE]: Net.IdParamsSchema.merge(Rbac.RoleBaseSchema.pick({
            name: true,
            description: true,
        }).partial())
            .merge(z
            .object({
            appRoleEnvironmentRoles: Rbac.EnvironmentPermissionsSchema,
        })
            .partial())
            .merge(Rbac.EnvironmentRoleBaseSchema.omit({ type: true }).partial())
            .merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.RBAC_UPDATE_ENVIRONMENT_ROLE_SETTINGS]: Net.IdParamsSchema.merge(z.object({
            settings: Rbac.EnvironmentRoleSettingsSchema,
        })),
        [action_type_1.default.RBAC_REORDER_ENVIRONMENT_ROLES]: Net.OrderIndexByIdSchema,
        [action_type_1.default.RBAC_CREATE_APP_ROLE]: utils.intersection(Rbac.RoleBaseSchema.pick({
            name: true,
            description: true,
        })
            .merge(Rbac.AppRoleBaseSchema.omit({ type: true }))
            .merge(z.object({
            canBeManagedByAppRoleIds: z.array(z.string()),
            canBeInvitedByAppRoleIds: z.array(z.string()),
            appRoleEnvironmentRoles: Rbac.EnvironmentPermissionsSchema,
        })), Rbac.WithPermissions(Rbac.AppPermissionSchema)),
        [action_type_1.default.RBAC_DELETE_APP_ROLE]: Net.IdParamsSchema,
        [action_type_1.default.RBAC_UPDATE_APP_ROLE]: utils.intersection(Net.IdParamsSchema.merge(Rbac.RoleBaseSchema.pick({
            name: true,
            description: true,
        }).partial())
            .merge(Rbac.AppRoleBaseSchema.pick({
            defaultAllApps: true,
            canManageAppRoleIds: true,
            canInviteAppRoleIds: true,
            hasFullEnvironmentPermissions: true,
        }).partial())
            .merge(z
            .object({
            canBeManagedByAppRoleIds: z.array(z.string()),
            canBeInvitedByAppRoleIds: z.array(z.string()),
            appRoleEnvironmentRoles: Rbac.EnvironmentPermissionsSchema,
        })
            .partial())
            .merge(Net.EnvParamsSchema.partial()), Rbac.WithOptionalPermissions(Rbac.AppPermissionSchema)),
        [action_type_1.default.RBAC_CREATE_INCLUDED_APP_ROLE]: model_1.Model.IncludedAppRoleSchema.pick({
            appId: true,
            appRoleId: true,
        }).merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.DELETE_INCLUDED_APP_ROLE]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_GROUP]: model_1.Model.GroupSchema.pick({
            name: true,
            objectType: true,
            importId: true,
        }),
        [action_type_1.default.RENAME_GROUP]: model_1.Model.GroupSchema.pick({
            name: true,
        }).merge(Net.IdParamsSchema),
        [action_type_1.default.DELETE_GROUP]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_GROUP_MEMBERSHIP]: z
            .object({
            orderIndex: z.number().optional(),
        })
            .merge(model_1.Model.GroupMembershipSchema.pick({
            groupId: true,
            objectId: true,
            importId: true,
        }))
            .merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.DELETE_GROUP_MEMBERSHIP]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_APP_USER_GROUP]: model_1.Model.AppUserGroupSchema.pick({
            appId: true,
            userGroupId: true,
            appRoleId: true,
            importId: true,
        }).merge(Net.EnvParamsSchema),
        [action_type_1.default.DELETE_APP_USER_GROUP]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_APP_GROUP_USER_GROUP]: model_1.Model.AppGroupUserGroupSchema.pick({
            appGroupId: true,
            userGroupId: true,
            appRoleId: true,
        }).merge(Net.EnvParamsSchema),
        [action_type_1.default.DELETE_APP_GROUP_USER_GROUP]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_APP_GROUP_USER]: model_1.Model.AppGroupUserSchema.pick({
            appGroupId: true,
            userId: true,
            appRoleId: true,
        }).merge(Net.EnvParamsSchema),
        [action_type_1.default.DELETE_APP_GROUP_USER]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_APP_BLOCK_GROUP]: model_1.Model.AppBlockGroupSchema.pick({
            appId: true,
            blockGroupId: true,
            orderIndex: true,
        }).merge(Net.EnvParamsSchema),
        [action_type_1.default.DELETE_APP_BLOCK_GROUP]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_APP_GROUP_BLOCK]: model_1.Model.AppGroupBlockSchema.pick({
            appGroupId: true,
            blockId: true,
            orderIndex: true,
        }).merge(Net.EnvParamsSchema),
        [action_type_1.default.DELETE_APP_GROUP_BLOCK]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.CREATE_APP_GROUP_BLOCK_GROUP]: model_1.Model.AppGroupBlockGroupSchema.pick({
            appGroupId: true,
            blockGroupId: true,
            orderIndex: true,
        }).merge(Net.EnvParamsSchema),
        [action_type_1.default.DELETE_APP_GROUP_BLOCK_GROUP]: Net.IdParamsSchema.merge(Net.EnvParamsSchema.partial()),
        [action_type_1.default.REORDER_BLOCKS]: z.object({
            appId: z.string(),
            order: Net.OrderIndexByIdSchema,
        }),
        [action_type_1.default.REORDER_GROUP_MEMBERSHIPS]: z.object({
            blockGroupId: z.string(),
            order: Net.OrderIndexByIdSchema,
        }),
        [action_type_1.default.REORDER_APP_BLOCK_GROUPS]: z.object({
            appId: z.string(),
            order: Net.OrderIndexByIdSchema,
        }),
        [action_type_1.default.REORDER_APP_GROUP_BLOCKS]: z.object({
            appGroupId: z.string(),
            order: Net.OrderIndexByIdSchema,
        }),
        [action_type_1.default.REORDER_APP_GROUP_BLOCK_GROUPS]: z.object({
            appGroupId: z.string(),
            order: Net.OrderIndexByIdSchema,
        }),
        [action_type_1.default.REVOKE_TRUSTED_PUBKEYS]: z.object({
            byRequestId: z.record(z.string()),
            signedPubkeys: z.record(crypto_1.Crypto.PubkeySchema),
            replacingRootTrustChain: trust_1.Trust.SignedTrustChainSchema.optional(),
            signedTrustedRoot: trust_1.Trust.SignedTrustChainSchema.optional(),
        }),
        [action_type_1.default.FETCH_ENVKEY]: z.object({
            envkeyIdPart: z.string(),
        }),
        [action_type_1.default.CHECK_ENVKEY]: z.object({
            envkeyIdPart: z.string(),
        }),
        [action_type_1.default.FETCH_DELETED_GRAPH]: z.object({
            startsAt: z.number().optional(),
            endsAt: z.number().optional(),
        }),
        [action_type_1.default.UPDATE_LICENSE]: z.object({
            signedLicense: z.string(),
        }),
        [action_type_1.default.REENCRYPT_ENVS]: Net.EnvParamsSchema,
        [action_type_1.default.SELF_HOSTED_RESYNC_FAILOVER]: z.object({}),
        [action_type_1.default.SET_ORG_ALLOWED_IPS]: model_1.Model.OrgSchema.pick({
            localIpsAllowed: true,
            environmentRoleIpsAllowed: true,
        }),
        [action_type_1.default.SET_APP_ALLOWED_IPS]: model_1.Model.AppSchema.pick({
            environmentRoleIpsMergeStrategies: true,
            environmentRoleIpsAllowed: true,
        }).merge(Net.IdParamsSchema),
        [action_type_1.default.UNSUBSCRIBE_CLOUD_LIFECYCLE_EMAILS]: z.object({
            orgId: z.string(),
            orgUserId: z.string(),
            unsubscribeToken: z.string(),
        }),
        [action_type_1.default.STARTED_ORG_IMPORT]: z.union([
            z.object({
                isV1UpgradeIntoExistingOrg: z.literal(true),
                v1Upgrade: v1_upgrade_1.V1Upgrade.UpgradeSchema,
            }),
            z.object({
                isV1UpgradeIntoExistingOrg: z.literal(false).optional(),
            }),
        ]),
        [action_type_1.default.FINISHED_ORG_IMPORT]: z.object({}),
        [action_type_1.default.CLOUD_BILLING_SUBSCRIBE_PRODUCT]: z.object({
            productId: z.string(),
            priceId: z.string(),
            quantity: z.number(),
            promotionCode: z.string().optional(),
        }),
        [action_type_1.default.CLOUD_BILLING_UPDATE_SUBSCRIPTION_QUANTITY]: z.object({
            quantity: z.number(),
        }),
        [action_type_1.default.CLOUD_BILLING_CANCEL_SUBSCRIPTION]: z.object({}),
        [action_type_1.default.CLOUD_BILLING_UPDATE_SETTINGS]: Billing.BillingSettingsSchema,
        [action_type_1.default.CLOUD_BILLING_UPDATE_PAYMENT_METHOD]: z.object({
            token: z.string(),
        }),
        [action_type_1.default.CLOUD_BILLING_INVOICE_CREATED]: z
            .object({
            stripeSubscriptionId: z.string(),
            stripeCustomerId: z.string(),
        })
            .merge(Billing.InvoiceSchema.pick({
            stripeId: true,
            stripeChargeId: true,
            nextPaymentAttempt: true,
            periodStart: true,
            periodEnd: true,
            amountDue: true,
            attemptCount: true,
            attempted: true,
            status: true,
            paid: true,
            subtotal: true,
            total: true,
            tax: true,
            refNumber: true,
        })),
        [action_type_1.default.CLOUD_BILLING_PAYMENT_SUCCEEDED]: z
            .object({
            stripeSubscriptionId: z.string(),
            stripeCustomerId: z.string(),
        })
            .merge(Billing.InvoiceSchema.pick({
            stripeId: true,
            stripeChargeId: true,
            nextPaymentAttempt: true,
            amountDue: true,
            attemptCount: true,
            attempted: true,
            status: true,
            paid: true,
        })),
        [action_type_1.default.CLOUD_BILLING_PAYMENT_FAILED]: z
            .object({
            stripeSubscriptionId: z.string(),
            stripeCustomerId: z.string(),
        })
            .merge(Billing.InvoiceSchema.pick({
            stripeId: true,
            nextPaymentAttempt: true,
            attemptCount: true,
            attempted: true,
            status: true,
            paid: true,
        })),
        [action_type_1.default.CLOUD_BILLING_UPDATE_SUBSCRIPTION]: db_1.Db.SubscriptionSchema.pick({
            stripeId: true,
            status: true,
            canceledAt: true,
            currentPeriodStartsAt: true,
            currentPeriodEndsAt: true,
        }),
        [action_type_1.default.CLOUD_BILLING_CHECK_PROMOTION_CODE]: z.object({
            code: z.string(),
        }),
        [action_type_1.default.CLOUD_BILLING_FETCH_INVOICES]: z.object({}),
        [action_type_1.default.CLOUD_BILLING_LOAD_PRODUCTS]: z.object({}),
        [action_type_1.default.CLOUD_BILLING_CHECK_V1_PENDING_UPGRADE]: z.object({
            stripeCustomerId: z.string(),
        }),
        [action_type_1.default.INTEGRATIONS_VANTA_CREATE_EXTERNAL_AUTH_SESSION]: z.object({}),
        [action_type_1.default.INTEGRATIONS_VANTA_GET_EXTERNAL_AUTH_SESSION]: z.object({
            id: z.string(),
        }),
        [action_type_1.default.INTEGRATIONS_VANTA_OAUTH_CALLBACK]: Net.OauthCallbackQuerySchema,
        [action_type_1.default.INTEGRATIONS_VANTA_REMOVE_CONNECTION]: z.object({}),
        // BULK_GRAPH_ACTION schema isn't used anywhere as bulk actions are validated individually,
        // but it makes this object exhaustive so the compiler's happy
        [action_type_1.default.BULK_GRAPH_ACTION]: z.any(),
    };
    let additionalSchemas = {};
    Net.addSchemas = (schemas) => {
        additionalSchemas = Object.assign(Object.assign({}, additionalSchemas), schemas);
    };
    Net.getSchema = (t) => { var _a; return ((_a = Net.ApiParamSchemas[t]) !== null && _a !== void 0 ? _a : additionalSchemas); };
})(Net || (exports.Net = Net = {}));
//# sourceMappingURL=net.js.map