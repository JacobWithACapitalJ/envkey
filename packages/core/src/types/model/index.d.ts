import Client from "../client";
import { Blob } from "../blob";
import { TimestampsSchema } from "../timestamps";
import * as z from "zod";
export declare namespace Model {
    const KeyableSchema: z.ZodObject<{
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        pubkeyId: z.ZodString;
        pubkeyUpdatedAt: z.ZodNumber;
    }, {
        strict: true;
    }, {
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
    }>;
    type Timestamps = z.infer<typeof TimestampsSchema>;
    const OrgSettingsSchema: z.ZodObject<{
        crypto: z.ZodObject<{
            requiresPassphrase: z.ZodBoolean;
            requiresLockout: z.ZodBoolean;
            lockoutMs: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            requiresPassphrase?: boolean;
            requiresLockout?: boolean;
            lockoutMs?: number;
        }>;
        auth: z.ZodObject<{
            inviteExpirationMs: z.ZodNumber;
            deviceGrantExpirationMs: z.ZodNumber;
            tokenExpirationMs: z.ZodNumber;
        }, {
            strict: true;
        }, {
            inviteExpirationMs?: number;
            deviceGrantExpirationMs?: number;
            tokenExpirationMs?: number;
        }>;
        envs: z.ZodObject<{
            autoCommitLocals: z.ZodBoolean;
            autoCaps: z.ZodBoolean;
        }, {
            strict: true;
        }, {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        }>;
    }, {
        strict: true;
    }, {
        crypto?: {
            requiresPassphrase?: boolean;
            requiresLockout?: boolean;
            lockoutMs?: number;
        };
        auth?: {
            inviteExpirationMs?: number;
            deviceGrantExpirationMs?: number;
            tokenExpirationMs?: number;
        };
        envs?: {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        };
    }>;
    type OrgSettings = z.infer<typeof OrgSettingsSchema>;
    const OrgSchema: z.ZodObject<{
        type: z.ZodLiteral<"org">;
        id: z.ZodString;
        name: z.ZodString;
        creatorId: z.ZodString;
        rbacUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        graphUpdatedAt: z.ZodNumber;
        settings: z.ZodObject<{
            crypto: z.ZodObject<{
                requiresPassphrase: z.ZodBoolean;
                requiresLockout: z.ZodBoolean;
                lockoutMs: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
            }, {
                strict: true;
            }, {
                requiresPassphrase?: boolean;
                requiresLockout?: boolean;
                lockoutMs?: number;
            }>;
            auth: z.ZodObject<{
                inviteExpirationMs: z.ZodNumber;
                deviceGrantExpirationMs: z.ZodNumber;
                tokenExpirationMs: z.ZodNumber;
            }, {
                strict: true;
            }, {
                inviteExpirationMs?: number;
                deviceGrantExpirationMs?: number;
                tokenExpirationMs?: number;
            }>;
            envs: z.ZodObject<{
                autoCommitLocals: z.ZodBoolean;
                autoCaps: z.ZodBoolean;
            }, {
                strict: true;
            }, {
                autoCommitLocals?: boolean;
                autoCaps?: boolean;
            }>;
        }, {
            strict: true;
        }, {
            crypto?: {
                requiresPassphrase?: boolean;
                requiresLockout?: boolean;
                lockoutMs?: number;
            };
            auth?: {
                inviteExpirationMs?: number;
                deviceGrantExpirationMs?: number;
                tokenExpirationMs?: number;
            };
            envs?: {
                autoCommitLocals?: boolean;
                autoCaps?: boolean;
            };
        }>;
        billingSettings: z.ZodUnion<[z.ZodObject<{
            name: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
            email: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
            address: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
            vat: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            email?: string;
            name?: string;
            address?: string;
            vat?: string;
        }>, z.ZodUndefined]>;
        serverEnvkeyCount: z.ZodNumber;
        activeUserOrInviteCount: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        deviceLikeCount: z.ZodNumber;
        localIpsAllowed: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        environmentRoleIpsAllowed: z.ZodUnion<[z.ZodRecord<z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>>, z.ZodUndefined]>;
        selfHostedVersions: z.ZodUnion<[z.ZodObject<{
            api: z.ZodString;
            infra: z.ZodString;
        }, {
            strict: true;
        }, {
            api?: string;
            infra?: string;
        }>, z.ZodUndefined]>;
        selfHostedUpgradeStatus: z.ZodUnion<[z.ZodObject<{
            version: z.ZodString;
            startedAt: z.ZodNumber;
        }, {
            strict: true;
        }, {
            version?: string;
            startedAt?: number;
        }>, z.ZodUndefined]>;
        "upgradedCrypto-2.1.0": z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        reinitializedLocals: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        customLicense: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        optimizeEmptyEnvs: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        orgSettingsImported: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "org";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        creatorId?: string;
        rbacUpdatedAt?: number;
        graphUpdatedAt?: number;
        settings?: {
            crypto?: {
                requiresPassphrase?: boolean;
                requiresLockout?: boolean;
                lockoutMs?: number;
            };
            auth?: {
                inviteExpirationMs?: number;
                deviceGrantExpirationMs?: number;
                tokenExpirationMs?: number;
            };
            envs?: {
                autoCommitLocals?: boolean;
                autoCaps?: boolean;
            };
        };
        billingSettings?: {
            email?: string;
            name?: string;
            address?: string;
            vat?: string;
        };
        serverEnvkeyCount?: number;
        activeUserOrInviteCount?: number;
        deviceLikeCount?: number;
        localIpsAllowed?: string[];
        environmentRoleIpsAllowed?: Record<string, string[]>;
        selfHostedVersions?: {
            api?: string;
            infra?: string;
        };
        selfHostedUpgradeStatus?: {
            version?: string;
            startedAt?: number;
        };
        "upgradedCrypto-2.1.0"?: boolean;
        reinitializedLocals?: boolean;
        customLicense?: boolean;
        optimizeEmptyEnvs?: boolean;
        orgSettingsImported?: boolean;
    }>;
    type Org = z.infer<typeof OrgSchema> & {
        billingId?: string;
        ssoEnabled?: boolean;
        teamsEnabled?: boolean;
    };
    const OrgStatsSchema: z.ZodObject<{
        apiCallsThisHour: z.ZodNumber;
        apiCallsThisMonth: z.ZodNumber;
        dataTransferBytesThisHour: z.ZodNumber;
        dataTransferBytesThisDay: z.ZodNumber;
        dataTransferBytesThisMonth: z.ZodNumber;
        blobStorageBytes: z.ZodNumber;
        activeSocketConnections: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        apiCallsThisHour?: number;
        apiCallsThisMonth?: number;
        dataTransferBytesThisHour?: number;
        dataTransferBytesThisDay?: number;
        dataTransferBytesThisMonth?: number;
        blobStorageBytes?: number;
        activeSocketConnections?: number;
    }>;
    type OrgStats = z.infer<typeof OrgStatsSchema>;
    const OrgUserDeviceSchema: z.ZodIntersection<z.ZodObject<{
        type: z.ZodLiteral<"orgUserDevice">;
        id: z.ZodString;
        name: z.ZodString;
        userId: z.ZodString;
        isRoot: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        revokedRootAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        approvedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        deactivatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        pubkeyId: z.ZodString;
        pubkeyUpdatedAt: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        type?: "orgUserDevice";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        userId?: string;
        id?: string;
        deactivatedAt?: number;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        isRoot?: true;
        revokedRootAt?: number;
        approvedAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
    }>, z.ZodUnion<[z.ZodObject<{
        approvedByType: z.ZodLiteral<"creator">;
    }, {
        strict: true;
    }, {
        approvedByType?: "creator";
    }>, z.ZodObject<{
        approvedByType: z.ZodLiteral<"invite">;
        inviteId: z.ZodString;
    }, {
        strict: true;
    }, {
        approvedByType?: "invite";
        inviteId?: string;
    }>, z.ZodObject<{
        approvedByType: z.ZodLiteral<"deviceGrant">;
        deviceGrantId: z.ZodString;
    }, {
        strict: true;
    }, {
        approvedByType?: "deviceGrant";
        deviceGrantId?: string;
    }>, z.ZodObject<{
        approvedByType: z.ZodLiteral<"recoveryKey">;
        recoveryKeyId: z.ZodString;
    }, {
        strict: true;
    }, {
        approvedByType?: "recoveryKey";
        recoveryKeyId?: string;
    }>]>>;
    type OrgUserDevice = z.infer<typeof OrgUserDeviceSchema>;
    type DeviceGrant = z.infer<typeof DeviceGrantSchema>;
    const DeviceGrantSchema: z.ZodObject<{
        type: z.ZodLiteral<"deviceGrant">;
        id: z.ZodString;
        deviceId: z.ZodString;
        granteeId: z.ZodString;
        grantedByUserId: z.ZodString;
        grantedByDeviceId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        signedById: z.ZodString;
        acceptedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        expiresAt: z.ZodNumber;
    } & {
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        pubkeyId: z.ZodString;
        pubkeyUpdatedAt: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        type?: "deviceGrant";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        deviceId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        expiresAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        acceptedAt?: number;
        granteeId?: string;
        grantedByUserId?: string;
        grantedByDeviceId?: string;
    }>;
    type OrgUser = z.infer<typeof OrgUserSchema>;
    const OrgUserSchema: z.ZodObject<{
        type: z.ZodLiteral<"orgUser">;
        id: z.ZodString;
        uid: z.ZodString;
        email: z.ZodString;
        provider: z.ZodEnum<["email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", ...("email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted")[]]>;
        externalAuthProviderId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        firstName: z.ZodString;
        lastName: z.ZodString;
        invitedById: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        isCreator: z.ZodBoolean;
        inviteAcceptedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        orgRoleId: z.ZodString;
        deactivatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        orgRoleUpdatedAt: z.ZodNumber;
        scim: z.ZodUnion<[z.ZodObject<{
            providerId: z.ZodString;
            candidateId: z.ZodString;
        }, {
            strict: true;
        }, {
            providerId?: string;
            candidateId?: string;
        }>, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "orgUser";
        email?: string;
        id?: string;
        uid?: string;
        provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
        externalAuthProviderId?: string;
        firstName?: string;
        lastName?: string;
        invitedById?: string;
        isCreator?: boolean;
        inviteAcceptedAt?: number;
        orgRoleId?: string;
        deactivatedAt?: number;
        orgRoleUpdatedAt?: number;
        scim?: {
            providerId?: string;
            candidateId?: string;
        };
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
    }>;
    type ScimUserCandidate = z.infer<typeof ScimUserCandidateSchema>;
    const ScimUserCandidateSchema: z.ZodObject<{
        type: z.ZodLiteral<"scimUserCandidate">;
        id: z.ZodString;
        orgId: z.ZodString;
        providerId: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        scimUserName: z.ZodString;
        scimDisplayName: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        scimExternalId: z.ZodString;
        active: z.ZodBoolean;
        orgUserId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "scimUserCandidate";
        email?: string;
        providerId?: string;
        orgId?: string;
        id?: string;
        firstName?: string;
        lastName?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        active?: boolean;
        orgUserId?: string;
        scimUserName?: string;
        scimDisplayName?: string;
        scimExternalId?: string;
    }>;
    type CliUser = z.infer<typeof CliUserSchema>;
    const CliUserSchema: z.ZodObject<{
        type: z.ZodLiteral<"cliUser">;
        id: z.ZodString;
        orgRoleId: z.ZodString;
        name: z.ZodString;
        creatorId: z.ZodString;
        creatorDeviceId: z.ZodString;
        isRoot: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        revokedRootAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        signedById: z.ZodString;
        deactivatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        orgRoleUpdatedAt: z.ZodNumber;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        pubkeyId: z.ZodString;
        pubkeyUpdatedAt: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        type?: "cliUser";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        id?: string;
        orgRoleId?: string;
        deactivatedAt?: number;
        orgRoleUpdatedAt?: number;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        creatorId?: string;
        isRoot?: true;
        revokedRootAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
    }>;
    type SamlIdpSettings = z.infer<typeof SamlIdpSettingsSchema>;
    const SamlIdpKnownServiceSchema: z.ZodEnum<["google" | "okta" | "azure_ad" | "other", ...("google" | "okta" | "azure_ad" | "other")[]]>;
    const SamlIdpSettingsSchema: z.ZodObject<{
        identityProviderEntityId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        identityProviderLoginUrl: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        identityProviderX509Certs: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        identityProviderX509CertsSha1: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        identityProviderX509CertsSha256: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        identityProviderKnownService: z.ZodEnum<["google" | "okta" | "azure_ad" | "other", ...("google" | "okta" | "azure_ad" | "other")[]]>;
    }, {
        strict: true;
    }, {
        identityProviderKnownService?: "google" | "okta" | "azure_ad" | "other";
        identityProviderEntityId?: string;
        identityProviderLoginUrl?: string;
        identityProviderX509Certs?: string[];
        identityProviderX509CertsSha1?: string[];
        identityProviderX509CertsSha256?: string[];
    }>;
    type SamlProviderEditableSettings = z.infer<typeof SamlProviderEditableSettingsSchema>;
    type SamlMinimalIdpSettings = {
        identityProviderEntityId: string;
        identityProviderLoginUrl: string;
        identityProviderX509Certs: string[];
    };
    const SamlProviderEditableSettingsSchema: z.ZodObject<{
        serviceProviderNameIdFormat: z.ZodEnum<["urn:oasis:names:tc:SAML:2.0:nameid-format:persistent", "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"]>;
        serviceProviderAttributeMappings: z.ZodObject<{
            firstName: z.ZodUnion<[z.ZodLiteral<string>, z.ZodString]>;
            lastName: z.ZodUnion<[z.ZodLiteral<string>, z.ZodString]>;
            emailAddress: z.ZodUnion<[z.ZodLiteral<string>, z.ZodString]>;
        }, {
            strict: true;
        }, {
            firstName?: string;
            lastName?: string;
            emailAddress?: string;
        }>;
    }, {
        strict: true;
    }, {
        serviceProviderNameIdFormat?: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" | "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent";
        serviceProviderAttributeMappings?: {
            firstName?: string;
            lastName?: string;
            emailAddress?: string;
        };
    }>;
    type SamlProviderSettings = z.infer<typeof SamlProviderSettingsSchema>;
    const SamlProviderSettingsSchema: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"samlProviderSettings">;
        orgId: z.ZodString;
        externalAuthProviderId: z.ZodString;
        serviceProviderEntityId: z.ZodString;
        serviceProviderAcsUrl: z.ZodString;
        serviceProviderX509Cert: z.ZodString;
        serviceProviderX509CertSha1: z.ZodString;
        serviceProviderX509CertSha256: z.ZodString;
    } & {
        serviceProviderNameIdFormat: z.ZodEnum<["urn:oasis:names:tc:SAML:2.0:nameid-format:persistent", "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"]>;
        serviceProviderAttributeMappings: z.ZodObject<{
            firstName: z.ZodUnion<[z.ZodLiteral<string>, z.ZodString]>;
            lastName: z.ZodUnion<[z.ZodLiteral<string>, z.ZodString]>;
            emailAddress: z.ZodUnion<[z.ZodLiteral<string>, z.ZodString]>;
        }, {
            strict: true;
        }, {
            firstName?: string;
            lastName?: string;
            emailAddress?: string;
        }>;
    } & {
        identityProviderEntityId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        identityProviderLoginUrl: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        identityProviderX509Certs: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        identityProviderX509CertsSha1: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        identityProviderX509CertsSha256: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        identityProviderKnownService: z.ZodEnum<["google" | "okta" | "azure_ad" | "other", ...("google" | "okta" | "azure_ad" | "other")[]]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        type?: "samlProviderSettings";
        orgId?: string;
        id?: string;
        externalAuthProviderId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        identityProviderKnownService?: "google" | "okta" | "azure_ad" | "other";
        identityProviderEntityId?: string;
        identityProviderLoginUrl?: string;
        identityProviderX509Certs?: string[];
        identityProviderX509CertsSha1?: string[];
        identityProviderX509CertsSha256?: string[];
        serviceProviderNameIdFormat?: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" | "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent";
        serviceProviderAttributeMappings?: {
            firstName?: string;
            lastName?: string;
            emailAddress?: string;
        };
        serviceProviderEntityId?: string;
        serviceProviderAcsUrl?: string;
        serviceProviderX509Cert?: string;
        serviceProviderX509CertSha1?: string;
        serviceProviderX509CertSha256?: string;
    }>;
    type ExternalAuthProvider = z.infer<typeof ExternalAuthProviderSchema>;
    const ExternalAuthProviderSchema: z.ZodIntersection<z.ZodObject<{
        type: z.ZodLiteral<"externalAuthProvider">;
        id: z.ZodString;
        orgId: z.ZodString;
        nickname: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        authMethod: z.ZodEnum<["oauth_cloud", "oauth_hosted", "saml"]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "externalAuthProvider";
        orgId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        nickname?: string;
        authMethod?: "oauth_cloud" | "oauth_hosted" | "saml";
    }>, z.ZodUnion<[z.ZodObject<{
        provider: z.ZodEnum<["github_hosted" | "gitlab_hosted", "github_hosted" | "gitlab_hosted", ...("github_hosted" | "gitlab_hosted")[]]>;
    }, {
        strict: true;
    }, {
        provider?: "github_hosted" | "gitlab_hosted";
    }>, z.ZodObject<{
        provider: z.ZodLiteral<"saml">;
        samlSettingsId: z.ZodString;
    }, {
        strict: true;
    }, {
        provider?: "saml";
        samlSettingsId?: string;
    }>]>>;
    type ScimProvisioningProvider = z.infer<typeof ScimProvisioningProviderSchema>;
    const ScimProvisioningProviderSchema: z.ZodObject<{
        type: z.ZodLiteral<"scimProvisioningProvider">;
        id: z.ZodString;
        orgId: z.ZodString;
        nickname: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        authScheme: z.ZodEnum<["bearer", "bearer", ..."bearer"[]]>;
        endpointBaseUrl: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "scimProvisioningProvider";
        orgId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        nickname?: string;
        authScheme?: "bearer";
        endpointBaseUrl?: string;
    }>;
    type Invite = z.infer<typeof InviteSchema>;
    const InviteSchema: z.ZodObject<{
        type: z.ZodLiteral<"invite">;
        id: z.ZodString;
        inviteeId: z.ZodString;
        invitedByUserId: z.ZodString;
        invitedByDeviceId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        signedById: z.ZodString;
        acceptedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        expiresAt: z.ZodNumber;
        v1Invite: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    } & {
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        pubkeyId: z.ZodString;
        pubkeyUpdatedAt: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        type?: "invite";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        expiresAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        inviteeId?: string;
        invitedByUserId?: string;
        invitedByDeviceId?: string;
        signedById?: string;
        acceptedAt?: number;
        v1Invite?: boolean;
    }>;
    type ExternalAuthUser = z.infer<typeof ExternalAuthUserSchema>;
    const ExternalAuthUserSchema: z.ZodObject<{
        uid: z.ZodString;
        email: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        username: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        firstName: z.ZodString;
        lastName: z.ZodString;
    }, {
        strict: true;
    }, {
        email?: string;
        uid?: string;
        firstName?: string;
        lastName?: string;
        username?: string;
    }>;
    type EnvParentSettings = z.infer<typeof EnvParentSettingsSchema>;
    const EnvParentSettingsSchema: z.ZodObject<{
        autoCaps: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        autoCommitLocals: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        autoCommitLocals?: boolean;
        autoCaps?: boolean;
    }>;
    type EnvParentFields = z.infer<typeof EnvParentFieldsSchema>;
    const EnvParentFieldsSchema: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        envsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsUpdatedAtByUserId: z.ZodRecord<z.ZodNumber>;
        localsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsEncryptedBy: z.ZodRecord<z.ZodString>;
        localsReencryptionRequiredAt: z.ZodRecord<z.ZodNumber>;
        envsOrLocalsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsRequireReinit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        envsUpdatedAt?: number;
        localsUpdatedAtByUserId?: Record<string, number>;
        localsUpdatedAt?: number;
        localsEncryptedBy?: Record<string, string>;
        localsReencryptionRequiredAt?: Record<string, number>;
        envsOrLocalsUpdatedAt?: number;
        localsRequireReinit?: boolean;
    }>;
    type AppSettings = EnvParentSettings;
    const AppSettingsSchema: z.ZodObject<{
        autoCaps: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        autoCommitLocals: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        autoCommitLocals?: boolean;
        autoCaps?: boolean;
    }>;
    type App = z.infer<typeof AppSchema>;
    const AppSchema: z.ZodObject<{
        type: z.ZodLiteral<"app">;
        settings: z.ZodObject<{
            autoCaps: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
            autoCommitLocals: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        }>;
        environmentRoleIpsMergeStrategies: z.ZodUnion<[z.ZodRecord<z.ZodUnion<[z.ZodEnum<["extend", "override"]>, z.ZodUndefined]>>, z.ZodUndefined]>;
        environmentRoleIpsAllowed: z.ZodUnion<[z.ZodRecord<z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>>, z.ZodUndefined]>;
    } & {
        id: z.ZodString;
        name: z.ZodString;
        envsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsUpdatedAtByUserId: z.ZodRecord<z.ZodNumber>;
        localsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsEncryptedBy: z.ZodRecord<z.ZodString>;
        localsReencryptionRequiredAt: z.ZodRecord<z.ZodNumber>;
        envsOrLocalsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsRequireReinit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, {
        type?: "app";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        settings?: {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        };
        environmentRoleIpsAllowed?: Record<string, string[]>;
        environmentRoleIpsMergeStrategies?: Record<string, "extend" | "override">;
        envsUpdatedAt?: number;
        localsUpdatedAtByUserId?: Record<string, number>;
        localsUpdatedAt?: number;
        localsEncryptedBy?: Record<string, string>;
        localsReencryptionRequiredAt?: Record<string, number>;
        envsOrLocalsUpdatedAt?: number;
        localsRequireReinit?: boolean;
    }>;
    type BlockSettings = EnvParentSettings;
    const BlockSettingsSchema: z.ZodObject<{
        autoCaps: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        autoCommitLocals: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        autoCommitLocals?: boolean;
        autoCaps?: boolean;
    }>;
    type Block = z.infer<typeof BlockSchema>;
    const BlockSchema: z.ZodObject<{
        type: z.ZodLiteral<"block">;
        settings: z.ZodObject<{
            autoCaps: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
            autoCommitLocals: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        }>;
    } & {
        id: z.ZodString;
        name: z.ZodString;
        envsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsUpdatedAtByUserId: z.ZodRecord<z.ZodNumber>;
        localsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsEncryptedBy: z.ZodRecord<z.ZodString>;
        localsReencryptionRequiredAt: z.ZodRecord<z.ZodNumber>;
        envsOrLocalsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsRequireReinit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, {
        type?: "block";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        settings?: {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        };
        envsUpdatedAt?: number;
        localsUpdatedAtByUserId?: Record<string, number>;
        localsUpdatedAt?: number;
        localsEncryptedBy?: Record<string, string>;
        localsReencryptionRequiredAt?: Record<string, number>;
        envsOrLocalsUpdatedAt?: number;
        localsRequireReinit?: boolean;
    }>;
    type EnvParent = z.infer<typeof EnvParentSchema>;
    const EnvParentSchema: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"app">;
        settings: z.ZodObject<{
            autoCaps: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
            autoCommitLocals: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        }>;
        environmentRoleIpsMergeStrategies: z.ZodUnion<[z.ZodRecord<z.ZodUnion<[z.ZodEnum<["extend", "override"]>, z.ZodUndefined]>>, z.ZodUndefined]>;
        environmentRoleIpsAllowed: z.ZodUnion<[z.ZodRecord<z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>>, z.ZodUndefined]>;
    } & {
        id: z.ZodString;
        name: z.ZodString;
        envsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsUpdatedAtByUserId: z.ZodRecord<z.ZodNumber>;
        localsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsEncryptedBy: z.ZodRecord<z.ZodString>;
        localsReencryptionRequiredAt: z.ZodRecord<z.ZodNumber>;
        envsOrLocalsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsRequireReinit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, {
        type?: "app";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        settings?: {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        };
        environmentRoleIpsAllowed?: Record<string, string[]>;
        environmentRoleIpsMergeStrategies?: Record<string, "extend" | "override">;
        envsUpdatedAt?: number;
        localsUpdatedAtByUserId?: Record<string, number>;
        localsUpdatedAt?: number;
        localsEncryptedBy?: Record<string, string>;
        localsReencryptionRequiredAt?: Record<string, number>;
        envsOrLocalsUpdatedAt?: number;
        localsRequireReinit?: boolean;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"block">;
        settings: z.ZodObject<{
            autoCaps: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
            autoCommitLocals: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        }>;
    } & {
        id: z.ZodString;
        name: z.ZodString;
        envsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsUpdatedAtByUserId: z.ZodRecord<z.ZodNumber>;
        localsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsEncryptedBy: z.ZodRecord<z.ZodString>;
        localsReencryptionRequiredAt: z.ZodRecord<z.ZodNumber>;
        envsOrLocalsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        localsRequireReinit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, {
        type?: "block";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        settings?: {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        };
        envsUpdatedAt?: number;
        localsUpdatedAtByUserId?: Record<string, number>;
        localsUpdatedAt?: number;
        localsEncryptedBy?: Record<string, string>;
        localsReencryptionRequiredAt?: Record<string, number>;
        envsOrLocalsUpdatedAt?: number;
        localsRequireReinit?: boolean;
    }>]>;
    type AppUserGrant = z.infer<typeof AppUserGrantSchema>;
    const AppUserGrantSchema: z.ZodObject<{
        type: z.ZodLiteral<"appUserGrant">;
        id: z.ZodString;
        userId: z.ZodString;
        appId: z.ZodString;
        appRoleId: z.ZodString;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "appUserGrant";
        userId?: string;
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appId?: string;
        appRoleId?: string;
    }>;
    type Server = z.infer<typeof ServerSchema>;
    const ServerSchema: z.ZodObject<{
        type: z.ZodLiteral<"server">;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        name: z.ZodString;
        id: z.ZodString;
        appId: z.ZodString;
        environmentId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, {
        type?: "server";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        appId?: string;
        environmentId?: string;
    }>;
    type LocalKey = z.infer<typeof LocalKeySchema>;
    const LocalKeySchema: z.ZodObject<{
        type: z.ZodLiteral<"localKey">;
        userId: z.ZodString;
        deviceId: z.ZodString;
        autoGenerated: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        isV1UpgradeKey: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        name: z.ZodString;
        id: z.ZodString;
        appId: z.ZodString;
        environmentId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, {
        type?: "localKey";
        userId?: string;
        deviceId?: string;
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        appId?: string;
        environmentId?: string;
        autoGenerated?: true;
        isV1UpgradeKey?: true;
    }>;
    type KeyableParent = z.infer<typeof KeyableParentSchema>;
    const KeyableParentSchema: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"server">;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        name: z.ZodString;
        id: z.ZodString;
        appId: z.ZodString;
        environmentId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, {
        type?: "server";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        appId?: string;
        environmentId?: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"localKey">;
        userId: z.ZodString;
        deviceId: z.ZodString;
        autoGenerated: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        isV1UpgradeKey: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        name: z.ZodString;
        id: z.ZodString;
        appId: z.ZodString;
        environmentId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, {
        type?: "localKey";
        userId?: string;
        deviceId?: string;
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        appId?: string;
        environmentId?: string;
        autoGenerated?: true;
        isV1UpgradeKey?: true;
    }>]>;
    type AppBlock = z.infer<typeof AppBlockSchema>;
    const AppBlockSchema: z.ZodObject<{
        type: z.ZodLiteral<"appBlock">;
        id: z.ZodString;
        appId: z.ZodString;
        blockId: z.ZodString;
        orderIndex: z.ZodNumber;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "appBlock";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        appId?: string;
        blockId?: string;
    }>;
    type Environment = z.infer<typeof EnvironmentSchema>;
    type EnvironmentSettings = z.infer<typeof EnvironmentSettingsSchema>;
    const EnvironmentBaseSchema: z.ZodObject<{
        type: z.ZodLiteral<"environment">;
        id: z.ZodString;
        envParentId: z.ZodString;
        environmentRoleId: z.ZodString;
        envUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        encryptedById: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        reencryptionRequiredAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        "upgradedCrypto-2.1.0": z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        requiresReinit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "environment";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        "upgradedCrypto-2.1.0"?: boolean;
        environmentRoleId?: string;
        envParentId?: string;
        envUpdatedAt?: number;
        encryptedById?: string;
        reencryptionRequiredAt?: number;
        requiresReinit?: boolean;
    }>;
    const EnvironmentSettingsSchema: z.ZodObject<{
        autoCommit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        autoCommit?: boolean;
    }>;
    const EnvironmentSchema: z.ZodIntersection<z.ZodObject<{
        type: z.ZodLiteral<"environment">;
        id: z.ZodString;
        envParentId: z.ZodString;
        environmentRoleId: z.ZodString;
        envUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        encryptedById: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        reencryptionRequiredAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        "upgradedCrypto-2.1.0": z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        requiresReinit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "environment";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        "upgradedCrypto-2.1.0"?: boolean;
        environmentRoleId?: string;
        envParentId?: string;
        envUpdatedAt?: number;
        encryptedById?: string;
        reencryptionRequiredAt?: number;
        requiresReinit?: boolean;
    }>, z.ZodUnion<[z.ZodObject<{
        isSub: z.ZodLiteral<false>;
        settings: z.ZodObject<{
            autoCommit: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            autoCommit?: boolean;
        }>;
    }, {
        strict: true;
    }, {
        settings?: {
            autoCommit?: boolean;
        };
        isSub?: false;
    }>, z.ZodObject<{
        isSub: z.ZodLiteral<true>;
        parentEnvironmentId: z.ZodString;
        subName: z.ZodString;
    }, {
        strict: true;
    }, {
        isSub?: true;
        parentEnvironmentId?: string;
        subName?: string;
    }>]>>;
    type RecoveryKey = z.infer<typeof RecoveryKeySchema>;
    const RecoveryKeySchema: z.ZodObject<{
        type: z.ZodLiteral<"recoveryKey">;
        id: z.ZodString;
        userId: z.ZodString;
        creatorDeviceId: z.ZodString;
        signedById: z.ZodString;
        redeemedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        pubkeyId: z.ZodString;
        pubkeyUpdatedAt: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        type?: "recoveryKey";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        userId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
        redeemedAt?: number;
    }>;
    type VariableGroup = z.infer<typeof VariableGroupSchema>;
    const VariableGroupSchema: z.ZodObject<{
        type: z.ZodLiteral<"variableGroup">;
        id: z.ZodString;
        envParentId: z.ZodString;
        name: z.ZodString;
        subEnvironmentId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "variableGroup";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        envParentId?: string;
        subEnvironmentId?: string;
    }>;
    type IncludedAppRole = z.infer<typeof IncludedAppRoleSchema>;
    const IncludedAppRoleSchema: z.ZodObject<{
        type: z.ZodLiteral<"includedAppRole">;
        id: z.ZodString;
        appId: z.ZodString;
        appRoleId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "includedAppRole";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appId?: string;
        appRoleId?: string;
    }>;
    type Group = z.infer<typeof GroupSchema>;
    const GroupSchema: z.ZodObject<{
        type: z.ZodLiteral<"group">;
        objectType: z.ZodEnum<["orgUser", "app", "block"]>;
        id: z.ZodString;
        name: z.ZodString;
        membershipsUpdatedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "group";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        objectType?: "orgUser" | "app" | "block";
        membershipsUpdatedAt?: number;
    }>;
    type GroupMembership = z.infer<typeof GroupMembershipSchema>;
    const GroupMembershipSchema: z.ZodObject<{
        type: z.ZodLiteral<"groupMembership">;
        id: z.ZodString;
        groupId: z.ZodString;
        objectId: z.ZodString;
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "groupMembership";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        groupId?: string;
        objectId?: string;
    }>;
    type AppUserGroup = z.infer<typeof AppUserGroupSchema>;
    const AppUserGroupSchema: z.ZodObject<{
        type: z.ZodLiteral<"appUserGroup">;
        id: z.ZodString;
        appId: z.ZodString;
        userGroupId: z.ZodString;
        appRoleId: z.ZodString;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "appUserGroup";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appId?: string;
        appRoleId?: string;
        userGroupId?: string;
    }>;
    type AppGroupUserGroup = z.infer<typeof AppGroupUserGroupSchema>;
    const AppGroupUserGroupSchema: z.ZodObject<{
        type: z.ZodLiteral<"appGroupUserGroup">;
        id: z.ZodString;
        appGroupId: z.ZodString;
        userGroupId: z.ZodString;
        appRoleId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "appGroupUserGroup";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appRoleId?: string;
        userGroupId?: string;
        appGroupId?: string;
    }>;
    type AppGroupUser = z.infer<typeof AppGroupUserSchema>;
    const AppGroupUserSchema: z.ZodObject<{
        type: z.ZodLiteral<"appGroupUser">;
        id: z.ZodString;
        appGroupId: z.ZodString;
        userId: z.ZodString;
        appRoleId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "appGroupUser";
        userId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appRoleId?: string;
        appGroupId?: string;
    }>;
    type AppBlockGroup = z.infer<typeof AppBlockGroupSchema>;
    const AppBlockGroupSchema: z.ZodObject<{
        type: z.ZodLiteral<"appBlockGroup">;
        id: z.ZodString;
        blockGroupId: z.ZodString;
        appId: z.ZodString;
        orderIndex: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "appBlockGroup";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        appId?: string;
        blockGroupId?: string;
    }>;
    type AppGroupBlock = z.infer<typeof AppGroupBlockSchema>;
    const AppGroupBlockSchema: z.ZodObject<{
        type: z.ZodLiteral<"appGroupBlock">;
        id: z.ZodString;
        appGroupId: z.ZodString;
        blockId: z.ZodString;
        orderIndex: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "appGroupBlock";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        blockId?: string;
        appGroupId?: string;
    }>;
    type AppGroupBlockGroup = z.infer<typeof AppGroupBlockGroupSchema>;
    const AppGroupBlockGroupSchema: z.ZodObject<{
        type: z.ZodLiteral<"appGroupBlockGroup">;
        id: z.ZodString;
        appGroupId: z.ZodString;
        blockGroupId: z.ZodString;
        orderIndex: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "appGroupBlockGroup";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        appGroupId?: string;
        blockGroupId?: string;
    }>;
    type GeneratedEnvkey = z.infer<typeof GeneratedEnvkeySchema>;
    const GeneratedEnvkeySchema: z.ZodObject<{
        type: z.ZodLiteral<"generatedEnvkey">;
        id: z.ZodString;
        appId: z.ZodString;
        environmentId: z.ZodString;
        keyableParentId: z.ZodString;
        keyableParentType: z.ZodEnum<["server", "localKey"]>;
        envkeyShort: z.ZodString;
        envkeyIdPartHash: z.ZodString;
        creatorId: z.ZodString;
        creatorDeviceId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        signedById: z.ZodString;
        blobsUpdatedAt: z.ZodNumber;
    } & {
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        pubkeyId: z.ZodString;
        pubkeyUpdatedAt: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        type?: "generatedEnvkey";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        creatorId?: string;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
        appId?: string;
        environmentId?: string;
        keyableParentId?: string;
        keyableParentType?: "server" | "localKey";
        envkeyShort?: string;
        envkeyIdPartHash?: string;
        blobsUpdatedAt?: number;
    }>;
    type AccessParams = z.infer<typeof AccessParamsSchema>;
    const AccessParamsSchema: z.ZodObject<{
        orgRoleId: z.ZodString;
        appUserGrants: z.ZodUnion<[z.ZodArray<z.ZodObject<{
            appId: z.ZodString;
            appRoleId: z.ZodString;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            appId?: string;
            appRoleId?: string;
        }>>, z.ZodUndefined]>;
        userGroupIds: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        orgRoleId?: string;
        appUserGrants?: {
            appId?: string;
            appRoleId?: string;
        }[];
        userGroupIds?: string[];
    }>;
    const GeneratedEnvkeyFieldsSchema: <T extends z.ZodObject<any, {
        strict: true;
    }, {
        [x: string]: any;
        [x: number]: any;
        [x: symbol]: any;
    }>>(zodSchema: T) => z.ZodObject<{
        env: z.ZodUnion<[T, z.ZodUndefined]>;
        inheritanceOverrides: z.ZodUnion<[z.ZodRecord<T>, z.ZodUndefined]>;
        localOverrides: z.ZodUnion<[T, z.ZodUndefined]>;
        subEnv: z.ZodUnion<[T, z.ZodUndefined]>;
    }, {
        strict: true;
    }, { [k_2 in keyof ({ [k in "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)]?: {
        env: (z.ZodUndefined | T)["_type"];
        inheritanceOverrides: Record<string, T["_type"]>;
        localOverrides: (z.ZodUndefined | T)["_type"];
        subEnv: (z.ZodUndefined | T)["_type"];
    }[k]; } & { [k_1 in Exclude<"env", "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)> | Exclude<"inheritanceOverrides", "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)> | Exclude<"subEnv", "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)> | Exclude<"localOverrides", "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)>]: {
        env: (z.ZodUndefined | T)["_type"];
        inheritanceOverrides: Record<string, T["_type"]>;
        localOverrides: (z.ZodUndefined | T)["_type"];
        subEnv: (z.ZodUndefined | T)["_type"];
    }[k_1]; })]: ({ [k_3 in "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)]?: {
        env: (z.ZodUndefined | T)["_type"];
        inheritanceOverrides: Record<string, T["_type"]>;
        localOverrides: (z.ZodUndefined | T)["_type"];
        subEnv: (z.ZodUndefined | T)["_type"];
    }[k_3]; } & { [k_4 in Exclude<"env", "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)> | Exclude<"inheritanceOverrides", "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)> | Exclude<"subEnv", "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)> | Exclude<"localOverrides", "inheritanceOverrides" | (undefined extends (z.ZodUndefined | T)["_type"] ? "env" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "subEnv" : never) | (undefined extends (z.ZodUndefined | T)["_type"] ? "localOverrides" : never)>]: {
        env: (z.ZodUndefined | T)["_type"];
        inheritanceOverrides: Record<string, T["_type"]>;
        localOverrides: (z.ZodUndefined | T)["_type"];
        subEnv: (z.ZodUndefined | T)["_type"];
    }[k_4]; })[k_2]; }>;
    type GeneratedEnvkeyFields<T = Blob.GeneratedEnvkeyEncryptedKey> = {
        env?: T;
        inheritanceOverrides?: {
            [environmentId: string]: T;
        };
        localOverrides?: T;
        subEnv?: T;
    };
    type PubkeyRevocationRequest = z.infer<typeof PubkeyRevocationRequestSchema>;
    const PubkeyRevocationRequestSchema: z.ZodObject<{
        type: z.ZodLiteral<"pubkeyRevocationRequest">;
        id: z.ZodString;
        targetId: z.ZodString;
        creatorId: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "pubkeyRevocationRequest";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        creatorId?: string;
        targetId?: string;
    }>;
    type RootPubkeyReplacement = z.infer<typeof RootPubkeyReplacementSchema>;
    const RootPubkeyReplacementSchema: z.ZodObject<{
        type: z.ZodLiteral<"rootPubkeyReplacement">;
        id: z.ZodString;
        requestId: z.ZodString;
        creatorId: z.ZodString;
        replacingPubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        signedReplacingTrustChain: z.ZodObject<{
            data: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
        }>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "rootPubkeyReplacement";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        creatorId?: string;
        requestId?: string;
        replacingPubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        signedReplacingTrustChain?: {
            data?: string;
        };
    }>;
    type GroupAssoc = AppUserGroup | AppGroupUserGroup | AppGroupUser | AppBlockGroup | AppGroupBlock | AppGroupBlockGroup;
    type EnvkeyObject = Client.Graph.UserGraphObject | ExternalAuthProvider;
    type InviteStatus = "creator" | "accepted" | "pending" | "pending-v1-upgrade" | "expired" | "failed";
    type VantaConnectedAccount = z.infer<typeof VantaConnectedAccountSchema>;
    const VantaConnectedAccountSchema: z.ZodObject<{
        type: z.ZodLiteral<"vantaConnectedAccount">;
        id: z.ZodString;
        lastSyncAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        status: z.ZodEnum<["active", "error"]>;
        error: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "vantaConnectedAccount";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        status?: "active" | "error";
        lastSyncAt?: number;
        error?: string;
    }>;
}
//# sourceMappingURL=index.d.ts.map