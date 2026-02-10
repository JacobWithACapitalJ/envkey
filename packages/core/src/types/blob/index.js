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
exports.Blob = void 0;
const crypto_1 = require("../crypto");
const trust_1 = require("../trust");
const timestamps_1 = require("../timestamps");
const z = __importStar(require("zod"));
var Blob;
(function (Blob) {
    const BlobTypeSchema = z.enum(["env", "changeset"]);
    const EnvTypeSchema = z.enum([
        "env",
        "inheritanceOverrides",
        "subEnv",
        "localOverrides",
    ]);
    const EnvPartSchema = z.enum(["env", "meta", "inherits"]);
    Blob.EncryptedKeyBaseSchema = z
        .object({
        data: crypto_1.Crypto.EncryptedDataSchema,
        encryptedById: z.string(),
    })
        .merge(timestamps_1.TimestampsSchema);
    Blob.UserEncryptedKeySchema = Blob.EncryptedKeyBaseSchema.extend({
        type: z.literal("userEncryptedKey"),
        envParentId: z.string().optional(),
        environmentId: z.string().optional(),
        inheritsEnvironmentId: z.string().optional(),
        blobType: BlobTypeSchema,
        envType: EnvTypeSchema.optional(),
        envPart: EnvPartSchema.optional(),
    });
    Blob.GeneratedEnvkeyEncryptedKeySchema = Blob.EncryptedKeyBaseSchema.extend({
        type: z.literal("generatedEnvkeyEncryptedKey"),
        encryptedByPubkey: crypto_1.Crypto.PubkeySchema,
        encryptedByTrustChain: trust_1.Trust.SignedTrustChainSchema,
        envParentId: z.string(),
        environmentId: z.string(),
        keyableParentId: z.string(),
        generatedEnvkeyId: z.string(),
        envType: EnvTypeSchema,
        inheritsEnvironmentId: z.string().optional(),
        userId: z.string().optional(),
        blockId: z.string().optional(),
        orderIndex: z.number().optional(),
    });
    Blob.EncryptedBlobSchema = z
        .object({
        type: z.literal("encryptedBlob"),
        encryptedById: z.string(),
        data: crypto_1.Crypto.EncryptedDataSchema,
        changesetId: z.string().optional(),
        createdById: z.string().optional(),
        envParentId: z.string().optional(),
        blockId: z.string().optional(),
        environmentId: z.string().optional(),
        inheritsEnvironmentId: z.string().optional(),
        blobType: BlobTypeSchema,
        envType: EnvTypeSchema.optional(),
        envPart: EnvPartSchema.optional(),
    })
        .merge(timestamps_1.TimestampsSchema);
    const GeneratedEnvkeySetSchema = z.object({
        env: z.literal(true).optional(),
        localOverrides: z.literal(true).optional(),
        subEnv: z.literal(true).optional(),
        inheritanceOverrides: z.array(z.string()).optional(),
    });
    Blob.UserEnvSetSchema = z.object({
        env: z.literal(true).optional(),
        meta: z.literal(true).optional(),
        inherits: z.literal(true).optional(),
        inheritanceOverrides: z.array(z.string()).optional(),
        changesets: z.literal(true).optional(),
    });
    const LocalsSetSchema = Blob.UserEnvSetSchema.pick({
        env: true,
        meta: true,
        changesets: true,
    });
    const EnvParentsSetSchema = z.record(z.object({
        environments: z.record(Blob.UserEnvSetSchema).optional(),
        locals: z.record(LocalsSetSchema).optional(),
    }));
    Blob.KeySetSchema = z.object({
        type: z.literal("keySet"),
        users: z.record(z.record(EnvParentsSetSchema)).optional(),
        keyableParents: z.record(z.record(GeneratedEnvkeySetSchema)).optional(),
        blockKeyableParents: z
            .record(z.record(z.record(GeneratedEnvkeySetSchema)))
            .optional(),
        newDevice: EnvParentsSetSchema.optional(),
    });
    Blob.BlobSetSchema = EnvParentsSetSchema;
})(Blob || (exports.Blob = Blob = {}));
//# sourceMappingURL=index.js.map