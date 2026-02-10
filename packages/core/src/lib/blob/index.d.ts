import { Blob, Api, Graph } from "../../types";
export declare const userEncryptedKeyPkey: (params: Blob.UserEncryptedKeyPkeyParams) => string, getSkeyOrScope: (params: Blob.ScopeParams | Blob.SkeyParams) => string, getScope: (params: Blob.ScopeParams) => string, getSkey: (params: Blob.SkeyParams) => string, encryptedBlobPkey: (params: Blob.EncryptedBlobPkeyParams) => string, keySetDifference: (set1: Blob.KeySet, set2: Blob.KeySet) => Blob.KeySet, keySetIntersection: (set1: Blob.KeySet, set2: Blob.KeySet) => Blob.KeySet, keySetIsSubset: (maybeSubset: Blob.KeySet, maybeSuperset: Blob.KeySet) => boolean, keySetEmpty: (keySet: Blob.KeySet) => boolean, mergeKeySets: (res1: Blob.KeySet, res2: Blob.KeySet) => Blob.KeySet, getBlobParamsEnvParentIds: (blobs: Api.Net.EnvParams["blobs"]) => Set<string>, getBlobParamsEnvironmentAndLocalIds: (blobs: Api.Net.EnvParams["blobs"]) => Set<string>, getGeneratedEnvkeyEncryptedKeyOrBlobComposite: ({ blockId, environmentId, envType, inheritsEnvironmentId, }: Blob.GeneratedEnvkeyEncryptedKey | Blob.EncryptedBlob) => string, getUserEncryptedKeyOrBlobComposite: ({ environmentId, envPart, inheritsEnvironmentId, }: {
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
} | {
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
} | (Pick<{
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
} | {
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
}, "envPart"> & {
    environmentId: string;
    inheritsEnvironmentId?: string;
})) => string, parseUserEncryptedKeyOrBlobComposite: (composite: string) => Required<Pick<{
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
} | {
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
}, "envPart">> & {
    environmentId: string;
    inheritsEnvironmentId?: string;
}, filterKeySetByBlobPaths: (graph: Graph.Graph, keySet: Blob.KeySet, blobPaths: Set<string>) => {
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
}, getUpdatedEnvironmentIdsForKeySet: (keySet: Blob.KeySet) => string[], getUpdatedEnvironmentIdsForBlobSet: (blobSet: Blob.BlobSet) => string[];
export declare const isValidEmptyVal: (json: string) => boolean;
//# sourceMappingURL=index.d.ts.map