import { Crypto } from "../../types";
export declare const signingKeypair: () => {
    publicKey: string;
    secretKey: string;
}, encryptionKeypair: () => {
    publicKey: string;
    secretKey: string;
}, encrypt: (params: {
    data: string;
} & Crypto.Keypair) => Crypto.EncryptedData, encryptJson: (params: {
    data: object;
} & Crypto.Keypair) => Crypto.EncryptedData, encryptSymmetricWithPassphrase: (params: {
    data: string;
    passphrase: string;
}) => Crypto.PassphraseEncryptedData, encryptWithKey: (params: {
    data: string;
    key: Uint8Array;
}) => Crypto.EncryptedData, decrypt: (params: {
    encrypted: Crypto.EncryptedData;
} & Crypto.Keypair) => string | null, decryptWithPassphrase: (params: {
    encrypted: Crypto.PassphraseEncryptedData;
    passphrase: string;
}) => Uint8Array, decryptWithKey: (params: {
    encrypted: Crypto.EncryptedData;
    encryptionKey: string;
}) => Uint8Array, sign: (params: {
    data: string;
    privkey: Crypto.Privkey;
}) => Uint8Array, signJson: (params: {
    data: object;
    privkey: Crypto.Privkey;
}) => string, signDetached: (params: {
    data: string;
    privkey: Crypto.Privkey;
}) => Uint8Array, verify: (params: {
    signed: string;
    pubkey: Crypto.Pubkey;
}) => Uint8Array | null, verifyJson: (params: {
    signed: string;
    pubkey: Crypto.Pubkey;
}) => object | null, verifyDetached: (params: {
    signed: string;
    signature: string;
    pubkey: Crypto.Pubkey;
}) => boolean, decryptPrivateKey: (params: {
    encryptedPrivkey: Crypto.EncryptedData;
    encryptionKey: string;
}) => Crypto.Privkey | null, decryptPrivateKeyWithPassphrase: (params: {
    encryptedPrivkey: Crypto.PassphraseEncryptedData;
    passphrase: string;
}) => Crypto.Privkey | null, encryptPrivateKey: (params: {
    privkey: Crypto.Privkey;
    encryptionKey: string;
}) => Crypto.EncryptedData, encryptSymmetricWithKey: (params: {
    data: string;
    encryptionKey: string;
}) => Crypto.EncryptedData, decryptSymmetricWithKey: (params: {
    encrypted: Crypto.EncryptedData;
    encryptionKey: string;
}) => string, decryptSymmetricWithPassphrase: (params: {
    encrypted: Crypto.PassphraseEncryptedData;
    passphrase: string;
}) => string, encryptPrivateKeyWithPassphrase: (params: {
    privkey: Crypto.Privkey;
    passphrase: string;
}) => Crypto.PassphraseEncryptedData, signPublicKey: (params: {
    privkey: Crypto.Privkey;
    pubkey: Crypto.Pubkey;
}) => Crypto.Pubkey, verifyPublicKeySignature: (params: {
    signedPubkey: Crypto.Pubkey;
    signerPubkey: Crypto.Pubkey;
}) => boolean;
//# sourceMappingURL=inline.d.ts.map