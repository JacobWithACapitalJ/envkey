import Api from "../api";
import * as z from "zod";
export declare namespace Blob {
    export type EncryptedKeyBase = z.infer<typeof EncryptedKeyBaseSchema>;
    export const EncryptedKeyBaseSchema: z.ZodObject<{
        data: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
        encryptedById: z.ZodString;
    } & {
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        encryptedById?: string;
    }>;
    export type UserEncryptedKey = z.infer<typeof UserEncryptedKeySchema>;
    export const UserEncryptedKeySchema: z.ZodObject<{
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
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "userEncryptedKey";
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        environmentId?: string;
        envParentId?: string;
        encryptedById?: string;
        envType?: "env" | "inheritanceOverrides" | "subEnv" | "localOverrides";
        inheritsEnvironmentId?: string;
        blobType?: "env" | "changeset";
        envPart?: "env" | "meta" | "inherits";
    }>;
    export type GeneratedEnvkeyEncryptedKey = z.infer<typeof GeneratedEnvkeyEncryptedKeySchema>;
    export const GeneratedEnvkeyEncryptedKeySchema: z.ZodObject<{
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
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "generatedEnvkeyEncryptedKey";
        data?: {
            data?: string;
            nonce?: string;
        };
        userId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
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
    export type EncryptedBlob = z.infer<typeof EncryptedBlobSchema>;
    export const EncryptedBlobSchema: z.ZodObject<{
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
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        type?: "encryptedBlob";
        data?: {
            data?: string;
            nonce?: string;
        };
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
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
    export type GeneratedEnvkeySet = z.infer<typeof GeneratedEnvkeySetSchema>;
    const GeneratedEnvkeySetSchema: z.ZodObject<{
        env: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        localOverrides: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        subEnv: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        inheritanceOverrides: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        env?: true;
        inheritanceOverrides?: string[];
        subEnv?: true;
        localOverrides?: true;
    }>;
    export type UserEnvSet = z.infer<typeof UserEnvSetSchema>;
    export const UserEnvSetSchema: z.ZodObject<{
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
    }>;
    export type LocalsSet = z.infer<typeof LocalsSetSchema>;
    const LocalsSetSchema: z.ZodObject<{
        env: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        meta: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
        changesets: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        env?: true;
        meta?: true;
        changesets?: true;
    }>;
    export type EnvParentsSet = z.infer<typeof EnvParentsSetSchema>;
    const EnvParentsSetSchema: z.ZodRecord<z.ZodObject<{
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
    }>>;
    export type KeySet = z.infer<typeof KeySetSchema>;
    export const KeySetSchema: z.ZodObject<{
        type: z.ZodLiteral<"keySet">;
        users: z.ZodUnion<[z.ZodRecord<z.ZodRecord<z.ZodRecord<z.ZodObject<{
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
        }>>>>, z.ZodUndefined]>;
        keyableParents: z.ZodUnion<[z.ZodRecord<z.ZodRecord<z.ZodObject<{
            env: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
            localOverrides: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
            subEnv: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
            inheritanceOverrides: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            env?: true;
            inheritanceOverrides?: string[];
            subEnv?: true;
            localOverrides?: true;
        }>>>, z.ZodUndefined]>;
        blockKeyableParents: z.ZodUnion<[z.ZodRecord<z.ZodRecord<z.ZodRecord<z.ZodObject<{
            env: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
            localOverrides: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
            subEnv: z.ZodUnion<[z.ZodLiteral<true>, z.ZodUndefined]>;
            inheritanceOverrides: z.ZodUnion<[z.ZodArray<z.ZodString>, z.ZodUndefined]>;
        }, {
            strict: true;
        }, {
            env?: true;
            inheritanceOverrides?: string[];
            subEnv?: true;
            localOverrides?: true;
        }>>>>, z.ZodUndefined]>;
        newDevice: z.ZodUnion<[z.ZodRecord<z.ZodObject<{
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
        type?: "keySet";
        users?: Record<string, Record<string, Record<string, {
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
        }>>>;
        keyableParents?: Record<string, Record<string, {
            env?: true;
            inheritanceOverrides?: string[];
            subEnv?: true;
            localOverrides?: true;
        }>>;
        blockKeyableParents?: Record<string, Record<string, Record<string, {
            env?: true;
            inheritanceOverrides?: string[];
            subEnv?: true;
            localOverrides?: true;
        }>>>;
        newDevice?: Record<string, {
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
    }>;
    export type BlobSet = z.infer<typeof BlobSetSchema>;
    export const BlobSetSchema: z.ZodRecord<z.ZodObject<{
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
    }>>;
    export type UserEncryptedKeyPkeyParams = {
        orgId: string;
        userId: string;
        deviceId: string;
    };
    export type SkeyParams = (({
        blobType: "env";
    } & {
        envParentId: string;
        environmentId: string;
    }) & ({
        envType: "env" | "subEnv";
        envPart: "env" | "meta" | "inherits";
    } | {
        envType: "localOverrides";
        envPart: "env" | "meta";
    } | {
        envType: "inheritanceOverrides";
        inheritsEnvironmentId: string;
        envPart: "env";
    })) | {
        blobType: "changeset";
        envParentId: string;
        environmentId: string;
        id?: string;
    };
    export type ScopeParams = ({
        blobType: "env";
    } & ({
        envParentId?: undefined;
    } | ({
        envParentId: string;
    } & ({
        environmentId?: undefined;
    } | {
        environmentId: string;
        envPart?: "env";
    })))) | ({
        envParentId: string;
        blobType: "changeset";
        environmentId?: string;
    } & Api.Net.FetchChangesetOptions) | {
        blobType?: undefined;
    };
    export type UserEncryptedKeyParams = UserEncryptedKeyPkeyParams & SkeyParams;
    export type UserEncryptedKeyPkeyWithScopeParams = UserEncryptedKeyPkeyParams & ScopeParams;
    export type EncryptedBlobPkeyParams = {
        orgId: string;
    };
    export type EncryptedBlobParams = EncryptedBlobPkeyParams & SkeyParams;
    export type EncryptedBlobPkeyWithScopeParams = EncryptedBlobPkeyParams & ScopeParams;
    export type UserEncryptedKeysByEnvironmentIdOrComposite = Record<string, Blob.UserEncryptedKey>;
    export type UserEncryptedChangesetKeysByEnvironmentId = Record<string, Blob.UserEncryptedKey>;
    export type UserEncryptedBlobsByComposite = Record<string, Blob.EncryptedBlob>;
    export type UserEncryptedBlobsByEnvironmentId = Record<string, Blob.EncryptedBlob[]>;
    export {};
}
//# sourceMappingURL=index.d.ts.map