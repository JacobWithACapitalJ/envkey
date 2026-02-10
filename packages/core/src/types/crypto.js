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
exports.Crypto = void 0;
const z = __importStar(require("zod"));
var Crypto;
(function (Crypto) {
    const CompoundKeySchema = z.object({
        keys: z.object({
            signingKey: z.string(),
            encryptionKey: z.string(),
        }),
    });
    Crypto.PubkeySchema = z
        .object({
        signature: z.string().optional(),
    })
        .merge(CompoundKeySchema);
    Crypto.PrivkeySchema = CompoundKeySchema;
    Crypto.EncryptedDataSchema = z.object({
        data: z.string(),
        nonce: z.string(),
    });
    Crypto.SignedDataSchema = z.object({ data: z.string() });
    Crypto.PassphraseEncryptedDataSchema = z
        .object({
        salt: z.string(),
    })
        .merge(Crypto.EncryptedDataSchema);
    Crypto.KeypairSchema = z.object({
        pubkey: Crypto.PubkeySchema,
        privkey: Crypto.PrivkeySchema,
    });
    Crypto.EncryptedKeypairSchema = z.object({
        pubkey: Crypto.PubkeySchema,
        encryptedPrivkey: Crypto.EncryptedDataSchema,
    });
    Crypto.PassphraseEncryptedKeypairSchema = z.object({
        pubkey: Crypto.PubkeySchema,
        encryptedPrivkey: Crypto.PassphraseEncryptedDataSchema,
    });
    Crypto.DecryptParamsSchema = z
        .object({
        encrypted: Crypto.EncryptedDataSchema,
    })
        .merge(Crypto.KeypairSchema);
})(Crypto || (exports.Crypto = Crypto = {}));
//# sourceMappingURL=crypto.js.map