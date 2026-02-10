import { Blob } from "../blob";
import { PoolConnection, Pool } from "mysql2/promise";
import * as z from "zod";
export declare namespace Db {
    type SqlStatement = {
        qs: string;
        qargs: any[];
    };
    type DbKey = z.infer<typeof DbKeySchema>;
    const DbKeySchema: z.ZodObject<{
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>;
    type QueryParams = ({
        pkey: string | string[];
        scope?: undefined;
        pkeyScope?: undefined;
        pkeysWithScopes?: undefined;
    } | {
        scope: string | string[];
        pkey?: undefined;
        pkeyScope?: string;
        pkeysWithScopes?: undefined;
    } | {
        pkey: string | string[];
        scope: string | string[];
        pkeyScope?: undefined;
        pkeysWithScopes?: undefined;
    } | {
        pkey?: undefined;
        scope?: undefined;
        pkeyScope?: undefined;
        pkeysWithScopes: {
            pkey: string;
            scope: string | undefined;
        }[];
    }) & {
        limit?: number;
        offset?: number;
        deleted?: boolean | "any";
        createdBefore?: number;
        createdAfter?: number;
        deletedBefore?: number;
        deletedAfter?: number;
        deletedGraphQuery?: true;
        updatedAfter?: number;
        updatedBefore?: number;
        sortBy?: "skey" | "createdAt" | "updatedAt" | "deletedAt" | "orderIndex" | "orderIndex,createdAt";
        sortDesc?: true;
        omitData?: boolean;
        secondaryIndex?: string | string[] | null;
        tertiaryIndex?: string | string[] | null;
    } & DbReadOpts;
    type TxnQueryParams = Omit<QueryParams, "transactionConn"> & {
        transactionConnOrPool: PoolConnection | Pool;
    };
    type DbObject = z.infer<typeof DbObjectSchema>;
    const DbObjectSchema: z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>;
    type Scope = {
        pkey: string;
        pkeyPrefix?: true;
        scope?: string;
    };
    type ObjectTransactionItems = {
        softDeleteKeys?: DbKey[];
        hardDeleteKeys?: DbKey[];
        hardDeleteEncryptedKeyParams?: Blob.UserEncryptedKeyPkeyWithScopeParams[];
        hardDeleteEncryptedBlobParams?: Blob.EncryptedBlobPkeyWithScopeParams[];
        softDeleteScopes?: Scope[];
        hardDeleteScopes?: Scope[];
        hardDeleteSecondaryIndices?: string[];
        hardDeleteTertiaryIndices?: string[];
        hardDeleteSecondaryIndexScopes?: string[];
        hardDeleteTertiaryIndexScopes?: string[];
        puts?: DbObject[];
        updates?: [DbKey, DbObject][];
        orderUpdateScopes?: [Required<Omit<Scope, "pkeyPrefix">>, number][];
    };
    type SqlLockType = "FOR UPDATE";
    type DbReadOpts = {
        transactionConn: PoolConnection | undefined;
        lockType?: SqlLockType;
    };
    type Org = z.infer<typeof OrgSchema>;
    const OrgSchema: z.ZodObject<{
        replicatedAt: z.ZodNumber;
        signedLicense: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        selfHostedFailoverRegion: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        generatedAnyEnvkey: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        startedOrgImportAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        finishedOrgImportAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        envUpdateRequiresClientVersion: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        importedFromV1: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    } & {
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "org";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        replicatedAt?: number;
        signedLicense?: string;
        selfHostedFailoverRegion?: string;
        generatedAnyEnvkey?: boolean;
        startedOrgImportAt?: number;
        finishedOrgImportAt?: number;
        envUpdateRequiresClientVersion?: string;
        importedFromV1?: boolean;
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
    type OrgUserDevice = z.infer<typeof OrgUserDeviceSchema>;
    const OrgUserDeviceSchema: z.ZodIntersection<z.ZodObject<{
        signedTrustedRoot: z.ZodObject<{
            data: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
        }>;
        trustedRootUpdatedAt: z.ZodNumber;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        signedTrustedRoot?: {
            data?: string;
        };
        trustedRootUpdatedAt?: number;
    }>, z.ZodIntersection<z.ZodObject<{
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
    }>]>>>;
    type DeviceGrant = z.infer<typeof DeviceGrantSchema>;
    const DeviceGrantSchema: z.ZodObject<{
        identityHash: z.ZodString;
        signedTrustedRoot: z.ZodObject<{
            data: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
        }>;
        orgId: z.ZodString;
        encryptedPrivkey: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        deviceId: z.ZodString;
        externalAuthSessionId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        externalAuthSessionVerifiedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
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
    } & {
        type: z.ZodLiteral<"orgUser">;
        email: z.ZodString;
        id: z.ZodString;
        uid: z.ZodString;
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
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        encryptedPrivkey?: {
            data?: string;
            nonce?: string;
        };
        email?: string;
        orgId?: string;
        deviceId?: string;
        identityHash?: string;
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
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        expiresAt?: number;
        signedTrustedRoot?: {
            data?: string;
        };
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        externalAuthSessionId?: string;
        externalAuthSessionVerifiedAt?: number;
        signedById?: string;
        acceptedAt?: number;
        granteeId?: string;
        grantedByUserId?: string;
        grantedByDeviceId?: string;
        type: never;
    }>;
    type AuthToken = z.infer<typeof AuthTokenSchema>;
    const AuthTokenSchema: z.ZodObject<{
        type: z.ZodLiteral<"authToken">;
        token: z.ZodString;
        provider: z.ZodEnum<["email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", ...("email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted")[]]>;
        uid: z.ZodString;
        externalAuthProviderId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        orgId: z.ZodString;
        deviceId: z.ZodString;
        userId: z.ZodString;
        expiresAt: z.ZodNumber;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "authToken";
        data?: {
            data?: string;
            nonce?: string;
        };
        token?: string;
        userId?: string;
        orgId?: string;
        deviceId?: string;
        uid?: string;
        provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
        externalAuthProviderId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        expiresAt?: number;
    }>;
    type OrgUser = z.infer<typeof OrgUserSchema>;
    const OrgUserSchema: z.ZodObject<{
        deviceIds: z.ZodArray<z.ZodString>;
    } & {
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "orgUser";
        data?: {
            data?: string;
            nonce?: string;
        };
        email?: string;
        deviceIds?: string[];
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
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>;
    type CliUser = z.infer<typeof CliUserSchema>;
    const CliUserSchema: z.ZodObject<{
        encryptedPrivkey: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        signedTrustedRoot: z.ZodObject<{
            data: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
        }>;
        trustedRootUpdatedAt: z.ZodNumber;
    } & {
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "cliUser";
        data?: {
            data?: string;
            nonce?: string;
        };
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        encryptedPrivkey?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        orgRoleId?: string;
        deactivatedAt?: number;
        orgRoleUpdatedAt?: number;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        name?: string;
        creatorId?: string;
        signedTrustedRoot?: {
            data?: string;
        };
        trustedRootUpdatedAt?: number;
        isRoot?: true;
        revokedRootAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
    }>;
    type RecoveryKey = z.infer<typeof RecoveryKeySchema>;
    const RecoveryKeySchema: z.ZodObject<{
        identityHash: z.ZodString;
        signedTrustedRoot: z.ZodObject<{
            data: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
        }>;
        encryptedPrivkey: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        deviceId: z.ZodString;
        externalAuthSessionId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        externalAuthSessionVerifiedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        emailToken: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "recoveryKey";
        data?: {
            data?: string;
            nonce?: string;
        };
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        encryptedPrivkey?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        deviceId?: string;
        identityHash?: string;
        emailToken?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        signedTrustedRoot?: {
            data?: string;
        };
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        externalAuthSessionId?: string;
        externalAuthSessionVerifiedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
        redeemedAt?: number;
    }>;
    type RecoveryKeyPointer = z.infer<typeof RecoveryKeyPointerSchema>;
    const RecoveryKeyPointerSchema: z.ZodObject<{
        type: z.ZodLiteral<"recoveryKeyPointer">;
        skey: z.ZodLiteral<"recoveryKeyPointer">;
        recoveryKeyId: z.ZodString;
        orgId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "recoveryKeyPointer";
        data?: {
            data?: string;
            nonce?: string;
        };
        orgId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: "recoveryKeyPointer";
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        recoveryKeyId?: string;
    }>;
    type OrgUserIdByEmail = z.infer<typeof OrgUserIdByEmailSchema>;
    const OrgUserIdByEmailSchema: z.ZodObject<{
        type: z.ZodLiteral<"userIdByEmail">;
        email: z.ZodString;
        userId: z.ZodString;
        orgId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "userIdByEmail";
        data?: {
            data?: string;
            nonce?: string;
        };
        email?: string;
        userId?: string;
        orgId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>;
    type OrgUserIdByProviderUid = z.infer<typeof OrgUserIdByProviderUidSchema>;
    const OrgUserIdByProviderUidSchema: z.ZodObject<{
        type: z.ZodLiteral<"userIdByProviderUid">;
        skey: z.ZodString;
        providerUid: z.ZodString;
        userId: z.ZodString;
        orgId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "userIdByProviderUid";
        data?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        orgId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        providerUid?: string;
    }>;
    type HostedOauthProviderSettings = z.infer<typeof HostedOauthProviderSettingsSchema>;
    const HostedOauthProviderSettingsSchema: z.ZodObject<{
        endpoint: z.ZodString;
        clientId: z.ZodString;
        clientSecret: z.ZodString;
    }, {
        strict: true;
    }, {
        endpoint?: string;
        clientId?: string;
        clientSecret?: string;
    }>;
    type SamlProviderSettings = z.infer<typeof SamlProviderSettingsSchema>;
    const SamlProviderSettingsSchema: z.ZodObject<{
        serviceProviderRsaPrivkey: z.ZodString;
    } & {
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "samlProviderSettings";
        data?: {
            data?: string;
            nonce?: string;
        };
        orgId?: string;
        id?: string;
        externalAuthProviderId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
        serviceProviderRsaPrivkey?: string;
    }>;
    type ExternalAuthProvider = z.infer<typeof ExternalAuthProviderSchema>;
    const ExternalAuthProviderSchema: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
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
    }>]>>, z.ZodIntersection<z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>, z.ZodUnion<[z.ZodObject<{
        verifiedByExternalAuthSessionId: z.ZodString;
        verifiedByUserId: z.ZodString;
        provider: z.ZodEnum<["github_hosted" | "gitlab_hosted", "github_hosted" | "gitlab_hosted", ...("github_hosted" | "gitlab_hosted")[]]>;
        providerSettings: z.ZodObject<{
            endpoint: z.ZodString;
            clientId: z.ZodString;
            clientSecret: z.ZodString;
        }, {
            strict: true;
        }, {
            endpoint?: string;
            clientId?: string;
            clientSecret?: string;
        }>;
    }, {
        strict: true;
    }, {
        provider?: "github_hosted" | "gitlab_hosted";
        providerSettings?: {
            endpoint?: string;
            clientId?: string;
            clientSecret?: string;
        };
        verifiedByExternalAuthSessionId?: string;
        verifiedByUserId?: string;
    }>, z.ZodObject<{
        provider: z.ZodLiteral<"saml">;
        samlSettingsId: z.ZodString;
    }, {
        strict: true;
    }, {
        provider?: "saml";
        samlSettingsId?: string;
    }>]>>>;
    type ExternalAuthProviderPointer = z.infer<typeof ExternalAuthProviderPointerSchema>;
    const ExternalAuthProviderPointerSchema: z.ZodObject<{
        type: z.ZodLiteral<"externalAuthProviderPointer">;
        externalAuthProviderId: z.ZodString;
        orgId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "externalAuthProviderPointer";
        data?: {
            data?: string;
            nonce?: string;
        };
        orgId?: string;
        externalAuthProviderId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>;
    type ScimProvisioningProvider = z.infer<typeof ScimProvisioningProviderSchema>;
    const ScimProvisioningProviderSchema: z.ZodObject<{
        authSecretHash: z.ZodString;
    } & {
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "scimProvisioningProvider";
        data?: {
            data?: string;
            nonce?: string;
        };
        orgId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        authSecretHash?: string;
        nickname?: string;
        authScheme?: "bearer";
        endpointBaseUrl?: string;
    }>;
    type ScimProvisioningProviderPointer = z.infer<typeof ScimProvisioningProviderPointerSchema>;
    const ScimProvisioningProviderPointerSchema: z.ZodObject<{
        type: z.ZodLiteral<"scimProvisioningProviderPointer">;
        providerId: z.ZodString;
        orgId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "scimProvisioningProviderPointer";
        data?: {
            data?: string;
            nonce?: string;
        };
        providerId?: string;
        orgId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>;
    type EmailVerification = z.infer<typeof EmailVerificationSchema>;
    const EmailVerificationSchema: z.ZodObject<{
        type: z.ZodLiteral<"emailVerification">;
        token: z.ZodString;
        email: z.ZodString;
        userId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        verifiedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        expiresAt: z.ZodNumber;
        authType: z.ZodIntersection<z.ZodEnum<["sign_up" | "sign_in" | "invite_users" | "accept_invite" | "accept_device_grant" | "redeem_recovery_key", ...("sign_up" | "sign_in" | "invite_users" | "accept_invite" | "accept_device_grant" | "redeem_recovery_key")[]]>, z.ZodEnum<["sign_in", "sign_up"]>>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "emailVerification";
        data?: {
            data?: string;
            nonce?: string;
        };
        email?: string;
        token?: string;
        userId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        expiresAt?: number;
        authType?: "sign_up" | "sign_in";
        verifiedAt?: number;
    }>;
    type ScimUserCandidate = z.infer<typeof ScimUserCandidateSchema>;
    const ScimUserCandidateSchema: z.ZodIntersection<z.ZodObject<{
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
    }>, z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>>;
    type ExternalAuthSession = z.infer<typeof ExternalAuthSessionSchema>;
    const ExternalAuthSessionSchema: z.ZodIntersection<z.ZodObject<{
        type: z.ZodLiteral<"externalAuthSession">;
        id: z.ZodString;
        authType: z.ZodEnum<["sign_up" | "sign_in" | "invite_users" | "accept_invite" | "accept_device_grant" | "redeem_recovery_key", ...("sign_up" | "sign_in" | "invite_users" | "accept_invite" | "accept_device_grant" | "redeem_recovery_key")[]]>;
        authMethod: z.ZodUnion<[z.ZodLiteral<"email">, z.ZodEnum<["oauth_cloud", "oauth_hosted", "saml"]>]>;
        provider: z.ZodEnum<["email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted", ...("email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted")[]]>;
        orgId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        userId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        domain: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        verifiedEmail: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        verifiedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        suggestFirstName: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        suggestLastName: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        externalUid: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        externalAuthProviderId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        authObjectId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        accessToken: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        errorAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        error: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "externalAuthSession";
        data?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        orgId?: string;
        id?: string;
        provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
        externalAuthProviderId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        authMethod?: "email" | "oauth_cloud" | "oauth_hosted" | "saml";
        error?: string;
        domain?: string;
        authType?: "sign_up" | "sign_in" | "invite_users" | "accept_invite" | "accept_device_grant" | "redeem_recovery_key";
        authObjectId?: string;
        verifiedAt?: number;
        verifiedEmail?: string;
        suggestFirstName?: string;
        suggestLastName?: string;
        externalUid?: string;
        accessToken?: string;
        errorAt?: number;
    }>, z.ZodUnion<[z.ZodIntersection<z.ZodObject<{
        authType: z.ZodLiteral<"sign_up">;
    }, {
        strict: true;
    }, {
        authType?: "sign_up";
    }>, z.ZodUnion<[z.ZodObject<{
        authMethod: z.ZodLiteral<"oauth_cloud">;
        provider: z.ZodEnum<["github" | "gitlab" | "google", "github" | "gitlab" | "google", ...("github" | "gitlab" | "google")[]]>;
    }, {
        strict: true;
    }, {
        provider?: "github" | "gitlab" | "google";
        authMethod?: "oauth_cloud";
    }>, z.ZodObject<{
        authMethod: z.ZodLiteral<"oauth_hosted">;
        provider: z.ZodEnum<["github_hosted" | "gitlab_hosted", "github_hosted" | "gitlab_hosted", ...("github_hosted" | "gitlab_hosted")[]]>;
        providerSettings: z.ZodObject<{
            endpoint: z.ZodString;
            clientId: z.ZodString;
            clientSecret: z.ZodString;
        }, {
            strict: true;
        }, {
            endpoint?: string;
            clientId?: string;
            clientSecret?: string;
        }>;
    }, {
        strict: true;
    }, {
        provider?: "github_hosted" | "gitlab_hosted";
        authMethod?: "oauth_hosted";
        providerSettings?: {
            endpoint?: string;
            clientId?: string;
            clientSecret?: string;
        };
    }>, z.ZodObject<{
        authMethod: z.ZodLiteral<"saml">;
        provider: z.ZodLiteral<"saml">;
        authObjectId: z.ZodString;
    }, {
        strict: true;
    }, {
        provider?: "saml";
        authMethod?: "saml";
        authObjectId?: string;
    }>]>>, z.ZodIntersection<z.ZodObject<{
        authType: z.ZodLiteral<"invite_users">;
    }, {
        strict: true;
    }, {
        authType?: "invite_users";
    }>, z.ZodUnion<[z.ZodObject<{
        authMethod: z.ZodLiteral<"oauth_cloud">;
    }, {
        strict: true;
    }, {
        authMethod?: "oauth_cloud";
    }>, z.ZodIntersection<z.ZodObject<{
        authMethod: z.ZodLiteral<"oauth_hosted">;
        provider: z.ZodEnum<["github_hosted" | "gitlab_hosted", "github_hosted" | "gitlab_hosted", ...("github_hosted" | "gitlab_hosted")[]]>;
    }, {
        strict: true;
    }, {
        provider?: "github_hosted" | "gitlab_hosted";
        authMethod?: "oauth_hosted";
    }>, z.ZodUnion<[z.ZodObject<{
        inviteExternalAuthUsersType: z.ZodLiteral<"initial">;
        providerSettings: z.ZodObject<{
            endpoint: z.ZodString;
            clientId: z.ZodString;
            clientSecret: z.ZodString;
        }, {
            strict: true;
        }, {
            endpoint?: string;
            clientId?: string;
            clientSecret?: string;
        }>;
    }, {
        strict: true;
    }, {
        providerSettings?: {
            endpoint?: string;
            clientId?: string;
            clientSecret?: string;
        };
        inviteExternalAuthUsersType?: "initial";
    }>, z.ZodObject<{
        inviteExternalAuthUsersType: z.ZodLiteral<"re-authenticate">;
        externalAuthProviderId: z.ZodString;
    }, {
        strict: true;
    }, {
        externalAuthProviderId?: string;
        inviteExternalAuthUsersType?: "re-authenticate";
    }>]>>]>>, z.ZodIntersection<z.ZodUnion<[z.ZodObject<{
        authType: z.ZodEnum<["accept_invite", "accept_device_grant", "redeem_recovery_key"]>;
        authObjectId: z.ZodString;
    }, {
        strict: true;
    }, {
        authType?: "accept_invite" | "accept_device_grant" | "redeem_recovery_key";
        authObjectId?: string;
    }>, z.ZodObject<{
        authType: z.ZodLiteral<"sign_in">;
    }, {
        strict: true;
    }, {
        authType?: "sign_in";
    }>]>, z.ZodUnion<[z.ZodObject<{
        authMethod: z.ZodEnum<["oauth_hosted", "saml"]>;
        externalAuthProviderId: z.ZodString;
    }, {
        strict: true;
    }, {
        externalAuthProviderId?: string;
        authMethod?: "oauth_hosted" | "saml";
    }>, z.ZodObject<{
        authMethod: z.ZodLiteral<"oauth_cloud">;
    }, {
        strict: true;
    }, {
        authMethod?: "oauth_cloud";
    }>]>>]>>;
    type Invite = z.infer<typeof InviteSchema>;
    const InviteSchema: z.ZodObject<{
        identityHash: z.ZodString;
        signedTrustedRoot: z.ZodObject<{
            data: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
        }>;
        encryptedPrivkey: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        deviceId: z.ZodString;
        externalAuthSessionId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        externalAuthSessionVerifiedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        v1TokenHash: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
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
    } & {
        type: z.ZodLiteral<"orgUser">;
        email: z.ZodString;
        id: z.ZodString;
        uid: z.ZodString;
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
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        encryptedPrivkey?: {
            data?: string;
            nonce?: string;
        };
        email?: string;
        deviceId?: string;
        identityHash?: string;
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
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        expiresAt?: number;
        signedTrustedRoot?: {
            data?: string;
        };
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        externalAuthSessionId?: string;
        externalAuthSessionVerifiedAt?: number;
        v1TokenHash?: string;
        inviteeId?: string;
        invitedByUserId?: string;
        invitedByDeviceId?: string;
        signedById?: string;
        acceptedAt?: number;
        v1Invite?: boolean;
        type: never;
    }>;
    type InvitePointer = z.infer<typeof InvitePointerSchema>;
    const InvitePointerSchema: z.ZodObject<{
        type: z.ZodLiteral<"invitePointer">;
        inviteId: z.ZodString;
        orgId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "invitePointer";
        data?: {
            data?: string;
            nonce?: string;
        };
        orgId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        inviteId?: string;
    }>;
    type DeviceGrantPointer = z.infer<typeof DeviceGrantPointerSchema>;
    const DeviceGrantPointerSchema: z.ZodObject<{
        type: z.ZodLiteral<"deviceGrantPointer">;
        deviceGrantId: z.ZodString;
        orgId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "deviceGrantPointer";
        data?: {
            data?: string;
            nonce?: string;
        };
        orgId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        deviceGrantId?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "app";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "block";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    type EnvParent = App | Block;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "appUserGrant";
        data?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        appId?: string;
        appRoleId?: string;
    }>;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "appBlock";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        appId?: string;
        blockId?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "groupMembership";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        groupId?: string;
        objectId?: string;
    }>;
    type CliUserPointer = z.infer<typeof CliUserPointerSchema>;
    const CliUserPointerSchema: z.ZodObject<{
        type: z.ZodLiteral<"cliUserPointer">;
        skey: z.ZodLiteral<"cliUserPointer">;
        orgId: z.ZodString;
        userId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "cliUserPointer";
        data?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        orgId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: "cliUserPointer";
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "group";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        name?: string;
        objectType?: "orgUser" | "app" | "block";
        membershipsUpdatedAt?: number;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "appUserGroup";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "appGroupUserGroup";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "appGroupUser";
        data?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "appBlockGroup";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "appGroupBlock";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "appGroupBlockGroup";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        appGroupId?: string;
        blockGroupId?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "server";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "localKey";
        data?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        deviceId?: string;
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        name?: string;
        appId?: string;
        environmentId?: string;
        autoGenerated?: true;
        isV1UpgradeKey?: true;
    }>;
    type KeyableParent = Server | LocalKey;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "includedAppRole";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        appId?: string;
        appRoleId?: string;
    }>;
    type Environment = z.infer<typeof EnvironmentSchema>;
    const EnvironmentSchema: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
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
    }>]>>, z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>>;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "variableGroup";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        name?: string;
        envParentId?: string;
        subEnvironmentId?: string;
    }>;
    type GeneratedEnvkey = z.infer<typeof GeneratedEnvkeySchema>;
    const GeneratedEnvkeySchema: z.ZodObject<{
        encryptedPrivkey: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        envkeyIdPart: z.ZodString;
        signedTrustedRoot: z.ZodObject<{
            data: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
        }>;
        trustedRootUpdatedAt: z.ZodNumber;
        userId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        deviceId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        allowedIps: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        v1Payload: z.ZodUnion<[z.ZodObject<{
            encryptedV2Key: z.ZodString;
            encryptedPrivkey: z.ZodString;
            pubkey: z.ZodString;
            signedTrustedPubkeys: z.ZodString;
            signedById: z.ZodString;
            signedByPubkey: z.ZodString;
            signedByTrustedPubkeys: z.ZodString;
        }, {
            strict: true;
        }, {
            pubkey?: string;
            encryptedPrivkey?: string;
            signedById?: string;
            encryptedV2Key?: string;
            signedTrustedPubkeys?: string;
            signedByPubkey?: string;
            signedByTrustedPubkeys?: string;
        }>, z.ZodUndefined]>;
    } & {
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "generatedEnvkey";
        data?: {
            data?: string;
            nonce?: string;
        };
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        encryptedPrivkey?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        deviceId?: string;
        envkeyIdPart?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        creatorId?: string;
        signedTrustedRoot?: {
            data?: string;
        };
        trustedRootUpdatedAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
        allowedIps?: string[];
        v1Payload?: {
            pubkey?: string;
            encryptedPrivkey?: string;
            signedById?: string;
            encryptedV2Key?: string;
            signedTrustedPubkeys?: string;
            signedByPubkey?: string;
            signedByTrustedPubkeys?: string;
        };
        appId?: string;
        environmentId?: string;
        keyableParentId?: string;
        keyableParentType?: "server" | "localKey";
        envkeyShort?: string;
        envkeyIdPartHash?: string;
        blobsUpdatedAt?: number;
    }>;
    type OrgRole = z.infer<typeof OrgRoleSchema>;
    const OrgRoleSchema: z.ZodIntersection<z.ZodIntersection<z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        orderIndex: z.ZodNumber;
    }, {
        strict: true;
    }, {
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        name?: string;
        description?: string;
    }>, z.ZodUnion<[z.ZodObject<{
        isDefault: z.ZodLiteral<true>;
        defaultName: z.ZodString;
        defaultDescription: z.ZodString;
    }, {
        strict: true;
    }, {
        isDefault?: true;
        defaultName?: string;
        defaultDescription?: string;
    }>, z.ZodObject<{
        isDefault: z.ZodLiteral<false>;
        defaultName: z.ZodUndefined;
        defaultDescription: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        isDefault?: false;
        defaultName?: undefined;
        defaultDescription?: undefined;
    }>]>>, z.ZodUnion<[z.ZodObject<{
        isDefault: z.ZodLiteral<true>;
        defaultName: z.ZodString;
        permissions: z.ZodUndefined;
        extendsRoleId: z.ZodUndefined;
        addPermissions: z.ZodUndefined;
        removePermissions: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        isDefault?: true;
        defaultName?: string;
        permissions?: undefined;
        extendsRoleId?: undefined;
        addPermissions?: undefined;
        removePermissions?: undefined;
    }>, z.ZodIntersection<z.ZodObject<{
        isDefault: z.ZodLiteral<false>;
        defaultName: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        isDefault?: false;
        defaultName?: undefined;
    }>, z.ZodUnion<[z.ZodObject<{
        permissions: z.ZodArray<z.ZodEnum<["org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", "org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", ...("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[]]>>;
        extendsRoleId: z.ZodUndefined;
        addPermissions: z.ZodUndefined;
        removePermissions: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        permissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
        extendsRoleId?: undefined;
        addPermissions?: undefined;
        removePermissions?: undefined;
    }>, z.ZodObject<{
        extendsRoleId: z.ZodString;
        addPermissions: z.ZodArray<z.ZodEnum<["org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", "org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", ...("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[]]>>;
        removePermissions: z.ZodArray<z.ZodEnum<["org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", "org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", ...("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[]]>>;
        permissions: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        permissions?: undefined;
        extendsRoleId?: string;
        addPermissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
        removePermissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
    }>]>>]>>, z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        type: z.ZodLiteral<"orgRole">;
        autoAppRoleId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        canHaveCliUsers: z.ZodBoolean;
    }, {
        strict: true;
    }, {
        type?: "orgRole";
        autoAppRoleId?: string;
        canHaveCliUsers?: boolean;
    }>, z.ZodUnion<[z.ZodObject<{
        canManageAllOrgRoles: z.ZodLiteral<true>;
        canManageOrgRoleIds: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        canManageAllOrgRoles?: true;
        canManageOrgRoleIds?: undefined;
    }>, z.ZodObject<{
        canManageAllOrgRoles: z.ZodUndefined;
        canManageOrgRoleIds: z.ZodArray<z.ZodString>;
    }, {
        strict: true;
    }, {
        canManageAllOrgRoles?: undefined;
        canManageOrgRoleIds?: string[];
    }>]>>, z.ZodUnion<[z.ZodObject<{
        canInviteAllOrgRoles: z.ZodLiteral<true>;
        canInviteOrgRoleIds: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        canInviteAllOrgRoles?: true;
        canInviteOrgRoleIds?: undefined;
    }>, z.ZodObject<{
        canInviteAllOrgRoles: z.ZodUndefined;
        canInviteOrgRoleIds: z.ZodArray<z.ZodString>;
    }, {
        strict: true;
    }, {
        canInviteAllOrgRoles?: undefined;
        canInviteOrgRoleIds?: string[];
    }>]>>>, z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>>;
    type AppRole = z.infer<typeof AppRoleSchema>;
    const AppRoleSchema: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        type: z.ZodLiteral<"appRole">;
        defaultAllApps: z.ZodBoolean;
        canHaveCliUsers: z.ZodBoolean;
        canManageAppRoleIds: z.ZodArray<z.ZodString>;
        canInviteAppRoleIds: z.ZodArray<z.ZodString>;
        hasFullEnvironmentPermissions: z.ZodBoolean;
    }, {
        strict: true;
    }, {
        type?: "appRole";
        canHaveCliUsers?: boolean;
        defaultAllApps?: boolean;
        canManageAppRoleIds?: string[];
        canInviteAppRoleIds?: string[];
        hasFullEnvironmentPermissions?: boolean;
    }>, z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        orderIndex: z.ZodNumber;
    }, {
        strict: true;
    }, {
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        name?: string;
        description?: string;
    }>, z.ZodUnion<[z.ZodObject<{
        isDefault: z.ZodLiteral<true>;
        defaultName: z.ZodString;
        defaultDescription: z.ZodString;
    }, {
        strict: true;
    }, {
        isDefault?: true;
        defaultName?: string;
        defaultDescription?: string;
    }>, z.ZodObject<{
        isDefault: z.ZodLiteral<false>;
        defaultName: z.ZodUndefined;
        defaultDescription: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        isDefault?: false;
        defaultName?: undefined;
        defaultDescription?: undefined;
    }>]>>, z.ZodUnion<[z.ZodObject<{
        isDefault: z.ZodLiteral<true>;
        defaultName: z.ZodString;
        permissions: z.ZodUndefined;
        extendsRoleId: z.ZodUndefined;
        addPermissions: z.ZodUndefined;
        removePermissions: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        isDefault?: true;
        defaultName?: string;
        permissions?: undefined;
        extendsRoleId?: undefined;
        addPermissions?: undefined;
        removePermissions?: undefined;
    }>, z.ZodIntersection<z.ZodObject<{
        isDefault: z.ZodLiteral<false>;
        defaultName: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        isDefault?: false;
        defaultName?: undefined;
    }>, z.ZodUnion<[z.ZodObject<{
        permissions: z.ZodArray<z.ZodEnum<["app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", "app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", ...("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[]]>>;
        extendsRoleId: z.ZodUndefined;
        addPermissions: z.ZodUndefined;
        removePermissions: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
        extendsRoleId?: undefined;
        addPermissions?: undefined;
        removePermissions?: undefined;
    }>, z.ZodObject<{
        extendsRoleId: z.ZodString;
        addPermissions: z.ZodArray<z.ZodEnum<["app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", "app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", ...("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[]]>>;
        removePermissions: z.ZodArray<z.ZodEnum<["app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", "app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", ...("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[]]>>;
        permissions: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        permissions?: undefined;
        extendsRoleId?: string;
        addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
        removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    }>]>>]>>>, z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>>;
    type EnvironmentRole = z.infer<typeof EnvironmentRoleSchema>;
    const EnvironmentRoleSchema: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        type: z.ZodLiteral<"environmentRole">;
        hasLocalKeys: z.ZodBoolean;
        hasServers: z.ZodBoolean;
        defaultAllApps: z.ZodBoolean;
        defaultAllBlocks: z.ZodBoolean;
        orderIndex: z.ZodNumber;
        settings: z.ZodObject<{
            autoCommit: z.ZodBoolean;
        }, {
            strict: true;
        }, {
            autoCommit?: boolean;
        }>;
        importId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        type?: "environmentRole";
        importId?: string;
        orderIndex?: number;
        settings?: {
            autoCommit?: boolean;
        };
        defaultAllApps?: boolean;
        hasLocalKeys?: boolean;
        hasServers?: boolean;
        defaultAllBlocks?: boolean;
    }>, z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        orderIndex: z.ZodNumber;
    }, {
        strict: true;
    }, {
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        name?: string;
        description?: string;
    }>, z.ZodUnion<[z.ZodObject<{
        isDefault: z.ZodLiteral<true>;
        defaultName: z.ZodString;
        defaultDescription: z.ZodString;
    }, {
        strict: true;
    }, {
        isDefault?: true;
        defaultName?: string;
        defaultDescription?: string;
    }>, z.ZodObject<{
        isDefault: z.ZodLiteral<false>;
        defaultName: z.ZodUndefined;
        defaultDescription: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        isDefault?: false;
        defaultName?: undefined;
        defaultDescription?: undefined;
    }>]>>>, z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>>;
    type AppRoleEnvironmentRole = z.infer<typeof AppRoleEnvironmentRoleSchema>;
    const AppRoleEnvironmentRoleSchema: z.ZodIntersection<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"appRoleEnvironmentRole">;
        appRoleId: z.ZodString;
        permissions: z.ZodArray<z.ZodEnum<["write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", "write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", ...("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[]]>>;
        environmentRoleId: z.ZodString;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        type?: "appRoleEnvironmentRole";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
        appRoleId?: string;
        environmentRoleId?: string;
    }>, z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>>;
    type LoggedAction = z.infer<typeof LoggedActionSchema>;
    const LoggedActionSchema: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        type: z.ZodLiteral<"loggedAction">;
        id: z.ZodString;
        transactionId: z.ZodString;
        actionType: z.ZodString;
        ip: z.ZodString;
        clientName: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        clientVersion: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        responseBytes: z.ZodNumber;
        responseType: z.ZodString;
        error: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        errorReason: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        errorStatus: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        failover: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        summary: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "loggedAction";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        error?: true;
        clientName?: string;
        clientVersion?: string;
        transactionId?: string;
        actionType?: string;
        ip?: string;
        responseBytes?: number;
        responseType?: string;
        errorReason?: string;
        errorStatus?: number;
        failover?: boolean;
        summary?: string;
    }>, z.ZodUnion<[z.ZodObject<{
        loggableType: z.ZodLiteral<"hostAction">;
        loggableType2: z.ZodUnion<[z.ZodUnion<[z.ZodEnum<["hostAction"]>, z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>]>, z.ZodUndefined]>;
        loggableType3: z.ZodUnion<[z.ZodUnion<[z.ZodEnum<["hostAction"]>, z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>]>, z.ZodUndefined]>;
        loggableType4: z.ZodUnion<[z.ZodUnion<[z.ZodEnum<["hostAction"]>, z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>]>, z.ZodUndefined]>;
        orgId: z.ZodUndefined;
        actorId: z.ZodUndefined;
        deviceId: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        orgId?: undefined;
        deviceId?: undefined;
        loggableType?: "hostAction";
        loggableType2?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction" | "hostAction";
        loggableType3?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction" | "hostAction";
        loggableType4?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction" | "hostAction";
        actorId?: undefined;
    }>, z.ZodObject<{
        loggableType: z.ZodLiteral<"authAction">;
        loggableType2: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        loggableType3: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        loggableType4: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        actionType: z.ZodString;
        orgId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        actorId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        deviceId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        orgId?: string;
        deviceId?: string;
        loggableType?: "authAction";
        loggableType2?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        actionType?: string;
        loggableType3?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        loggableType4?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        actorId?: string;
    }>, z.ZodObject<{
        loggableType: z.ZodLiteral<"scimAction">;
        loggableType2: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        loggableType3: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        loggableType4: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        actionType: z.ZodString;
        orgId: z.ZodString;
        actorId: z.ZodString;
        deviceId: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        orgId?: string;
        deviceId?: undefined;
        loggableType?: "scimAction";
        loggableType2?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        actionType?: string;
        loggableType3?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        loggableType4?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        actorId?: string;
    }>, z.ZodObject<{
        loggableType: z.ZodLiteral<"orgAction">;
        loggableType2: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        loggableType3: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        loggableType4: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        actionType: z.ZodString;
        orgId: z.ZodString;
        actorId: z.ZodString;
        deviceId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        accessUpdated: z.ZodUnion<[z.ZodObject<{
            granted: z.ZodUnion<[z.ZodObject<{
                org: z.ZodUnion<[z.ZodObject<{
                    users: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>>, z.ZodUndefined]>;
                    devices: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>>, z.ZodUndefined]>;
                }, {
                    strict: true;
                }, {
                    users?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                    devices?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                }>, z.ZodUndefined]>;
                apps: z.ZodUnion<[z.ZodRecord<z.ZodObject<{
                    users: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>>, z.ZodUndefined]>;
                    devices: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>>, z.ZodUndefined]>;
                }, {
                    strict: true;
                }, {
                    users?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                    devices?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                }>>, z.ZodUndefined]>;
                environments: z.ZodUnion<[z.ZodRecord<z.ZodObject<{
                    servers: z.ZodUnion<[z.ZodRecord<z.ZodString>, z.ZodUndefined]>;
                    localKeys: z.ZodUnion<[z.ZodRecord<z.ZodString>, z.ZodUndefined]>;
                    users: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>>, z.ZodUndefined]>;
                    devices: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>>, z.ZodUndefined]>;
                }, {
                    strict: true;
                }, {
                    users?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    devices?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    servers?: Record<string, string>;
                    localKeys?: Record<string, string>;
                }>>, z.ZodUndefined]>;
            }, {
                strict: true;
            }, {
                org?: {
                    users?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                    devices?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                };
                apps?: Record<string, {
                    users?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                    devices?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                }>;
                environments?: Record<string, {
                    users?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    devices?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    servers?: Record<string, string>;
                    localKeys?: Record<string, string>;
                }>;
            }>, z.ZodUndefined]>;
            removed: z.ZodUnion<[z.ZodObject<{
                org: z.ZodUnion<[z.ZodObject<{
                    users: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>>, z.ZodUndefined]>;
                    devices: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>>, z.ZodUndefined]>;
                }, {
                    strict: true;
                }, {
                    users?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                    devices?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                }>, z.ZodUndefined]>;
                apps: z.ZodUnion<[z.ZodRecord<z.ZodObject<{
                    users: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>>, z.ZodUndefined]>;
                    devices: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>>, z.ZodUndefined]>;
                }, {
                    strict: true;
                }, {
                    users?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                    devices?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                }>>, z.ZodUndefined]>;
                environments: z.ZodUnion<[z.ZodRecord<z.ZodObject<{
                    servers: z.ZodUnion<[z.ZodRecord<z.ZodString>, z.ZodUndefined]>;
                    localKeys: z.ZodUnion<[z.ZodRecord<z.ZodString>, z.ZodUndefined]>;
                    users: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>>, z.ZodUndefined]>;
                    devices: z.ZodUnion<[z.ZodRecord<z.ZodObject<Record<"write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>>, {
                        strict: true;
                    }, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>>, z.ZodUndefined]>;
                }, {
                    strict: true;
                }, {
                    users?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    devices?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    servers?: Record<string, string>;
                    localKeys?: Record<string, string>;
                }>>, z.ZodUndefined]>;
            }, {
                strict: true;
            }, {
                org?: {
                    users?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                    devices?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                };
                apps?: Record<string, {
                    users?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                    devices?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                }>;
                environments?: Record<string, {
                    users?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    devices?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    servers?: Record<string, string>;
                    localKeys?: Record<string, string>;
                }>;
            }>, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            granted?: {
                org?: {
                    users?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                    devices?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                };
                apps?: Record<string, {
                    users?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                    devices?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                }>;
                environments?: Record<string, {
                    users?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    devices?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    servers?: Record<string, string>;
                    localKeys?: Record<string, string>;
                }>;
            };
            removed?: {
                org?: {
                    users?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                    devices?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                };
                apps?: Record<string, {
                    users?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                    devices?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                }>;
                environments?: Record<string, {
                    users?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    devices?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    servers?: Record<string, string>;
                    localKeys?: Record<string, string>;
                }>;
            };
        }>, z.ZodUndefined]>;
        blobsUpdated: z.ZodUnion<[z.ZodRecord<z.ZodObject<{
            environments: z.ZodUnion<[z.ZodRecord<z.ZodObject<{
                env: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
                meta: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
                inherits: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
                inheritanceOverrides: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
                changesets: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
            }, {
                strict: true;
            }, {
                env?: true;
                meta?: true;
                inherits?: true;
                inheritanceOverrides?: string[];
                changesets?: true;
            }>>, z.ZodUndefined]>;
            locals: z.ZodUnion<[z.ZodRecord<z.ZodObject<{
                env: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
                meta: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
                changesets: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
            }, {
                strict: true;
            }, {
                env?: true;
                meta?: true;
                changesets?: true;
            }>>, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            environments?: Record<string, {
                env?: true;
                meta?: true;
                inherits?: true;
                inheritanceOverrides?: string[];
                changesets?: true;
            }>;
            locals?: Record<string, {
                env?: true;
                meta?: true;
                changesets?: true;
            }>;
        }>>, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        orgId?: string;
        deviceId?: string;
        loggableType?: "orgAction";
        loggableType2?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        actionType?: string;
        loggableType3?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        loggableType4?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        actorId?: string;
        accessUpdated?: {
            granted?: {
                org?: {
                    users?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                    devices?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                };
                apps?: Record<string, {
                    users?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                    devices?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                }>;
                environments?: Record<string, {
                    users?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    devices?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    servers?: Record<string, string>;
                    localKeys?: Record<string, string>;
                }>;
            };
            removed?: {
                org?: {
                    users?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                    devices?: Record<string, {
                        org_rename?: true;
                        org_manage_settings?: true;
                        org_manage_auth_settings?: true;
                        org_manage_billing?: true;
                        org_manage_users?: true;
                        org_manage_user_devices?: true;
                        org_invite_users_to_permitted_apps?: true;
                        org_approve_devices_for_permitted?: true;
                        org_manage_cli_users?: true;
                        org_create_cli_users_for_permitted_apps?: true;
                        org_manage_app_roles?: true;
                        org_manage_org_roles?: true;
                        org_manage_environment_roles?: true;
                        org_manage_teams?: true;
                        org_manage_app_groups?: true;
                        org_manage_block_groups?: true;
                        org_read_logs?: true;
                        org_manage_firewall?: true;
                        org_generate_recovery_key?: true;
                        org_clear_tokens?: true;
                        org_archive_import_export?: true;
                        org_manage_integrations?: true;
                        org_delete?: true;
                        apps_create?: true;
                        apps_delete?: true;
                        apps_read_permitted?: true;
                        blocks_create?: true;
                        blocks_read_all?: true;
                        blocks_rename?: true;
                        blocks_manage_settings?: true;
                        blocks_write_envs_all?: true;
                        blocks_write_envs_permitted?: true;
                        blocks_manage_connections_permitted?: true;
                        blocks_manage_environments?: true;
                        blocks_delete?: true;
                        self_hosted_upgrade?: true;
                        self_hosted_manage_host?: true;
                        self_hosted_read_host_logs?: true;
                    }>;
                };
                apps?: Record<string, {
                    users?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                    devices?: Record<string, {
                        app_read?: true;
                        app_rename?: true;
                        app_manage_settings?: true;
                        app_manage_users?: true;
                        app_approve_user_devices?: true;
                        app_manage_cli_users?: true;
                        app_read_own_locals?: true;
                        app_read_user_locals?: true;
                        app_read_user_locals_history?: true;
                        app_write_user_locals?: true;
                        app_manage_blocks?: true;
                        app_manage_environments?: true;
                        app_manage_servers?: true;
                        app_manage_local_keys?: true;
                        app_read_logs?: true;
                        app_manage_included_roles?: true;
                        app_manage_firewall?: true;
                    }>;
                }>;
                environments?: Record<string, {
                    users?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    devices?: Record<string, {
                        write?: true;
                        write_branches?: true;
                        read?: true;
                        read_inherits?: true;
                        read_meta?: true;
                        read_history?: true;
                        read_branches?: true;
                        read_branches_inherits?: true;
                        read_branches_meta?: true;
                        read_branches_history?: true;
                    }>;
                    servers?: Record<string, string>;
                    localKeys?: Record<string, string>;
                }>;
            };
        };
        blobsUpdated?: Record<string, {
            environments?: Record<string, {
                env?: true;
                meta?: true;
                inherits?: true;
                inheritanceOverrides?: string[];
                changesets?: true;
            }>;
            locals?: Record<string, {
                env?: true;
                meta?: true;
                changesets?: true;
            }>;
        }>;
    }>, z.ZodIntersection<z.ZodObject<{
        loggableType: z.ZodEnum<["fetchMetaAction", "fetchLogsAction"]>;
        loggableType2: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        loggableType3: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        loggableType4: z.ZodUnion<[z.ZodEnum<["authAction", "fetchMetaAction", "fetchEnvsAction", "fetchEnvkeyAction", "checkEnvkeyAction", "fetchLogsAction", "orgAction", "updateEnvsAction", "reencryptEnvsAction", "scimAction", "updateFirewallAction", "billingAction", "billingWebhookAction"]>, z.ZodUndefined]>;
        orgId: z.ZodString;
        actorId: z.ZodString;
        deviceId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        environmentReadPermissions: z.ZodUnion<[z.ZodRecord<z.ZodArray<z.ZodEnum<["read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history", ...("read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[]]>>>, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        orgId?: string;
        deviceId?: string;
        loggableType?: "fetchMetaAction" | "fetchLogsAction";
        loggableType2?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        loggableType3?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        loggableType4?: "authAction" | "orgAction" | "fetchMetaAction" | "fetchEnvsAction" | "fetchEnvkeyAction" | "checkEnvkeyAction" | "fetchLogsAction" | "updateEnvsAction" | "reencryptEnvsAction" | "scimAction" | "updateFirewallAction" | "billingAction" | "billingWebhookAction";
        actorId?: string;
        environmentReadPermissions?: Record<string, ("read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[]>;
    }>, z.ZodUnion<[z.ZodObject<{
        actionType: z.ZodEnum<[import("./action_type").default.GET_SESSION, import("./action_type").default.FETCH_ENVS, import("./action_type").default.FETCH_LOGS, import("./action_type").default.FETCH_DELETED_GRAPH]>;
    }, {
        strict: true;
    }, {
        actionType?: import("./action_type").default.GET_SESSION | import("./action_type").default.FETCH_ENVS | import("./action_type").default.FETCH_LOGS | import("./action_type").default.FETCH_DELETED_GRAPH;
    }>, z.ZodObject<{
        actionType: z.ZodLiteral<import("./action_type").default.LOAD_INVITE>;
        inviteId: z.ZodString;
    }, {
        strict: true;
    }, {
        inviteId?: string;
        actionType?: import("./action_type").default.LOAD_INVITE;
    }>, z.ZodObject<{
        actionType: z.ZodLiteral<import("./action_type").default.LOAD_DEVICE_GRANT>;
        deviceGrantId: z.ZodString;
    }, {
        strict: true;
    }, {
        deviceGrantId?: string;
        actionType?: import("./action_type").default.LOAD_DEVICE_GRANT;
    }>, z.ZodObject<{
        actionType: z.ZodLiteral<import("./action_type").default.LOAD_RECOVERY_KEY>;
        recoveryKeyId: z.ZodString;
    }, {
        strict: true;
    }, {
        recoveryKeyId?: string;
        actionType?: import("./action_type").default.LOAD_RECOVERY_KEY;
    }>]>>, z.ZodObject<{
        loggableType: z.ZodEnum<["fetchEnvkeyAction", "checkEnvkeyAction"]>;
        loggableType2: z.ZodUnion<[z.ZodLiteral<"authAction">, z.ZodUndefined]>;
        loggableType3: z.ZodUndefined;
        loggableType4: z.ZodUndefined;
        actionType: z.ZodUnion<[z.ZodLiteral<import("./action_type").default.FETCH_ENVKEY>, z.ZodLiteral<import("./action_type").default.CHECK_ENVKEY>]>;
        orgId: z.ZodString;
        actorId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        deviceId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        generatedEnvkeyId: z.ZodString;
        fetchServiceVersion: z.ZodNumber;
        isFailoverRequest: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        orgId?: string;
        deviceId?: string;
        loggableType?: "fetchEnvkeyAction" | "checkEnvkeyAction";
        loggableType2?: "authAction";
        generatedEnvkeyId?: string;
        actionType?: import("./action_type").default.FETCH_ENVKEY | import("./action_type").default.CHECK_ENVKEY;
        loggableType3?: undefined;
        loggableType4?: undefined;
        actorId?: string;
        fetchServiceVersion?: number;
        isFailoverRequest?: true;
    }>, z.ZodObject<{
        loggableType: z.ZodLiteral<"billingWebhookAction">;
        loggableType2: z.ZodLiteral<"billingAction">;
        loggableType3: z.ZodUndefined;
        loggableType4: z.ZodUndefined;
        actionType: z.ZodString;
        orgId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        actorId: z.ZodUndefined;
        deviceId: z.ZodUndefined;
    }, {
        strict: true;
    }, {
        orgId?: string;
        deviceId?: undefined;
        loggableType?: "billingWebhookAction";
        loggableType2?: "billingAction";
        actionType?: string;
        loggableType3?: undefined;
        loggableType4?: undefined;
        actorId?: undefined;
    }>]>>, z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
    }>>;
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
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        excludeFromDeletedGraph: z.ZodLiteral<true>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        strict: true;
    }>, {
        type?: "pubkeyRevocationRequest";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        creatorId?: string;
        targetId?: string;
    }>;
    type RootPubkeyReplacement = z.infer<typeof RootPubkeyReplacementSchema>;
    const RootPubkeyReplacementSchema: z.ZodIntersection<z.ZodObject<{
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
    }>, z.ZodObject<{
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        replacingPubkeyId: z.ZodString;
        processedAtById: z.ZodRecord<z.ZodUnion<[z.ZodLiteral<false>, z.ZodNumber]>>;
        excludeFromDeletedGraph: z.ZodLiteral<true>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        replacingPubkeyId?: string;
        processedAtById?: Record<string, number | false>;
    }>>;
    type UserEncryptedKey = z.infer<typeof UserEncryptedKeySchema>;
    const UserEncryptedKeySchema: z.ZodObject<{
        data: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        encryptedById: z.ZodString;
    } & {
        type: z.ZodLiteral<"userEncryptedKey">;
        envParentId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        environmentId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        inheritsEnvironmentId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        blobType: z.ZodEnum<["env", "changeset"]>;
        envType: z.ZodUnion<[z.ZodEnum<["env", "inheritanceOverrides", "subEnv", "localOverrides"]>, z.ZodUndefined]>;
        envPart: z.ZodUnion<[z.ZodEnum<["env", "meta", "inherits"]>, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "userEncryptedKey";
        data?: {
            data?: string;
            nonce?: string;
        } & {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        environmentId?: string;
        envParentId?: string;
        encryptedById?: string;
        envType?: "env" | "inheritanceOverrides" | "subEnv" | "localOverrides";
        inheritsEnvironmentId?: string;
        blobType?: "env" | "changeset";
        envPart?: "env" | "meta" | "inherits";
    }>;
    type GeneratedEnvkeyEncryptedKey = z.infer<typeof GeneratedEnvkeyEncryptedKeySchema>;
    const GeneratedEnvkeyEncryptedKeySchema: z.ZodObject<{
        data: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        encryptedById: z.ZodString;
    } & {
        type: z.ZodLiteral<"generatedEnvkeyEncryptedKey">;
        encryptedByPubkey: z.ZodObject<{
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
        encryptedByTrustChain: z.ZodObject<{
            data: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
        }>;
        envParentId: z.ZodString;
        environmentId: z.ZodString;
        keyableParentId: z.ZodString;
        generatedEnvkeyId: z.ZodString;
        envType: z.ZodEnum<["env", "inheritanceOverrides", "subEnv", "localOverrides"]>;
        inheritsEnvironmentId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        userId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        blockId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "generatedEnvkeyEncryptedKey";
        data?: {
            data?: string;
            nonce?: string;
        } & {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        environmentId?: string;
        keyableParentId?: string;
        blockId?: string;
        envParentId?: string;
        encryptedById?: string;
        encryptedByPubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        encryptedByTrustChain?: {
            data?: string;
        };
        generatedEnvkeyId?: string;
        envType?: "env" | "inheritanceOverrides" | "subEnv" | "localOverrides";
        inheritsEnvironmentId?: string;
    }>;
    type EncryptedBlob = z.infer<typeof EncryptedBlobSchema>;
    const EncryptedBlobSchema: z.ZodObject<{
        type: z.ZodLiteral<"encryptedBlob">;
        encryptedById: z.ZodString;
        data: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        changesetId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        createdById: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        envParentId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        blockId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        environmentId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        inheritsEnvironmentId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        blobType: z.ZodEnum<["env", "changeset"]>;
        envType: z.ZodUnion<[z.ZodEnum<["env", "inheritanceOverrides", "subEnv", "localOverrides"]>, z.ZodUndefined]>;
        envPart: z.ZodUnion<[z.ZodEnum<["env", "meta", "inherits"]>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "encryptedBlob";
        data?: {
            data?: string;
            nonce?: string;
        } & {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        environmentId?: string;
        blockId?: string;
        envParentId?: string;
        encryptedById?: string;
        createdById?: string;
        envType?: "env" | "inheritanceOverrides" | "subEnv" | "localOverrides";
        inheritsEnvironmentId?: string;
        blobType?: "env" | "changeset";
        envPart?: "env" | "meta" | "inherits";
        changesetId?: string;
    }>;
    type Customer = z.infer<typeof CustomerSchema>;
    const CustomerSchema: z.ZodObject<{
        type: z.ZodLiteral<"customer">;
        id: z.ZodString;
        billingEmail: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        stripeId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "customer";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        billingEmail?: string;
        stripeId?: string;
    }>;
    type Product = z.infer<typeof ProductSchema>;
    const ProductSchema: z.ZodObject<{
        type: z.ZodLiteral<"product">;
        id: z.ZodString;
        plan: z.ZodEnum<["cloud_basics", "cloud_pro", "business_cloud", "enterprise"]>;
        name: z.ZodString;
        maxUsers: z.ZodNumber;
        maxEnvkeyWatchers: z.ZodNumber;
        adjustableQuantity: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        ssoEnabled: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        teamsEnabled: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        customRbacEnabled: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        isCloudBasics: z.ZodBoolean;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        stripeId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "product";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        name?: string;
        plan?: "enterprise" | "cloud_basics" | "cloud_pro" | "business_cloud";
        maxUsers?: number;
        maxEnvkeyWatchers?: number;
        adjustableQuantity?: boolean;
        ssoEnabled?: boolean;
        teamsEnabled?: boolean;
        customRbacEnabled?: boolean;
        isCloudBasics?: boolean;
        stripeId?: string;
    }>;
    type Price = z.infer<typeof PriceSchema>;
    const PriceSchema: z.ZodObject<{
        type: z.ZodLiteral<"price">;
        id: z.ZodString;
        name: z.ZodString;
        productId: z.ZodString;
        interval: z.ZodEnum<["month", "year"]>;
        amount: z.ZodNumber;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        stripeId: z.ZodString;
        stripeProductId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "price";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        name?: string;
        productId?: string;
        interval?: "month" | "year";
        amount?: number;
        stripeId?: string;
        stripeProductId?: string;
    }>;
    type Subscription = z.infer<typeof SubscriptionSchema>;
    const SubscriptionSchema: z.ZodObject<{
        type: z.ZodLiteral<"subscription">;
        id: z.ZodString;
        productId: z.ZodString;
        priceId: z.ZodString;
        quantity: z.ZodNumber;
        status: z.ZodEnum<["trialing", "incomplete", "incomplete_expired", "active", "past_due", "canceled", "unpaid"]>;
        canceledAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        currentPeriodStartsAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        currentPeriodEndsAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        hasPromotionCode: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        amountOff: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        percentOff: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        stripeId: z.ZodString;
        stripeProductId: z.ZodString;
        stripePriceId: z.ZodString;
        promotionCode: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "subscription";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        productId?: string;
        priceId?: string;
        quantity?: number;
        status?: "trialing" | "incomplete" | "incomplete_expired" | "active" | "past_due" | "canceled" | "unpaid";
        canceledAt?: number;
        currentPeriodStartsAt?: number;
        currentPeriodEndsAt?: number;
        hasPromotionCode?: boolean;
        amountOff?: number;
        percentOff?: number;
        stripeId?: string;
        promotionCode?: string;
        stripeProductId?: string;
        stripePriceId?: string;
    }>;
    type SubscriptionPointer = z.infer<typeof SubscriptionPointerSchema>;
    const SubscriptionPointerSchema: z.ZodObject<{
        type: z.ZodLiteral<"subscriptionPointer">;
        subscriptionId: z.ZodString;
        productId: z.ZodString;
        priceId: z.ZodString;
        orgId: z.ZodString;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "subscriptionPointer";
        data?: {
            data?: string;
            nonce?: string;
        };
        orgId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        productId?: string;
        priceId?: string;
        subscriptionId?: string;
    }>;
    type Invoice = z.infer<typeof InvoiceSchema>;
    const InvoiceSchema: z.ZodObject<{
        type: z.ZodLiteral<"invoice">;
        id: z.ZodString;
        productId: z.ZodString;
        productName: z.ZodString;
        priceId: z.ZodString;
        subscriptionId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        stripeId: z.ZodString;
        stripeChargeId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        amountDue: z.ZodNumber;
        numActiveUsers: z.ZodNumber;
        maxUsers: z.ZodNumber;
        attemptCount: z.ZodNumber;
        attempted: z.ZodBoolean;
        status: z.ZodUnion<[z.ZodEnum<["deleted", "draft", "open", "paid", "uncollectible", "void"]>, z.ZodUndefined]>;
        nextPaymentAttempt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        paid: z.ZodBoolean;
        periodStart: z.ZodNumber;
        periodEnd: z.ZodNumber;
        periodString: z.ZodString;
        refNumber: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        subtotal: z.ZodNumber;
        total: z.ZodNumber;
        tax: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        amountRefunded: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        html: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "invoice";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        paid?: boolean;
        maxUsers?: number;
        productId?: string;
        priceId?: string;
        status?: "void" | "paid" | "deleted" | "draft" | "open" | "uncollectible";
        productName?: string;
        subscriptionId?: string;
        stripeId?: string;
        stripeChargeId?: string;
        amountDue?: number;
        numActiveUsers?: number;
        attemptCount?: number;
        attempted?: boolean;
        nextPaymentAttempt?: number;
        periodStart?: number;
        periodEnd?: number;
        periodString?: string;
        refNumber?: string;
        subtotal?: number;
        total?: number;
        tax?: number;
        amountRefunded?: number;
        html?: string;
    }>;
    type PaymentSource = z.infer<typeof PaymentSourceSchema>;
    const PaymentSourceSchema: z.ZodObject<{
        type: z.ZodLiteral<"paymentSource">;
        id: z.ZodString;
        paymentType: z.ZodLiteral<"card">;
        brand: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        last4: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        expMonth: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        expYear: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "paymentSource";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        paymentType?: "card";
        brand?: string;
        last4?: string;
        expMonth?: number;
        expYear?: number;
    }>;
    type VantaExternalAuthSession = z.infer<typeof VantaExternalAuthSessionSchema>;
    const VantaExternalAuthSessionSchema: z.ZodObject<{
        type: z.ZodLiteral<"vantaExternalAuthSession">;
        id: z.ZodString;
        orgId: z.ZodString;
        userId: z.ZodString;
        verifiedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        errorAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        error: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    } & {
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        tertiaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "vantaExternalAuthSession";
        data?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        orgId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: string;
        devIndex?: string;
        error?: string;
        verifiedAt?: number;
        errorAt?: number;
    }>;
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
    } & {
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        accessTokenExpiresAt: z.ZodNumber;
        tertiaryIndex: z.ZodEnum<["syncing", "idle"]>;
    } & {
        data: z.ZodUnion<[z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>, z.ZodUndefined]>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        orderIndex: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
        excludeFromDeletedGraph: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        pkey: z.ZodString;
        skey: z.ZodString;
        secondaryIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        devIndex: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        strict: true;
    }>>, {
        type?: "vantaConnectedAccount";
        data?: {
            data?: string;
            nonce?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        excludeFromDeletedGraph?: true;
        pkey?: string;
        skey?: string;
        secondaryIndex?: string;
        tertiaryIndex?: "syncing" | "idle";
        devIndex?: string;
        status?: "active" | "error";
        lastSyncAt?: number;
        error?: string;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpiresAt?: number;
    }>;
}
//# sourceMappingURL=db.d.ts.map