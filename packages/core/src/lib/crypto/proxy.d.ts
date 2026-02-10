import { Crypto } from "../../types";
export declare const generateKeys: (params?: {
    passphrase?: string;
    encryptionKey?: string;
}) => Promise<{
    pubkey: Crypto.Pubkey;
    privkey: Crypto.Privkey;
    encryptedPrivkey?: Crypto.EncryptedData | Crypto.PassphraseEncryptedData;
}>, ephemeralEncryptionKeypair: () => Promise<Crypto.Keypair>, encrypt: (params: {
    data: string;
} & Crypto.Keypair) => Promise<Crypto.EncryptedData>, encryptJson: (params: {
    data: object;
} & Crypto.Keypair) => Promise<Crypto.EncryptedData>, decryptJson: (params: {
    encrypted: Crypto.EncryptedData;
} & Crypto.Keypair) => Promise<object>, decrypt: (params: {
    encrypted: Crypto.EncryptedData;
} & Crypto.Keypair) => Promise<string>, signJson: (params: {
    data: object;
    privkey: Crypto.Privkey;
}) => Promise<string>, verifyJson: (params: {
    signed: string;
    pubkey: Crypto.Pubkey;
}) => Promise<object>, decryptPrivateKey: (params: {
    encryptedPrivkey: Crypto.EncryptedData;
    encryptionKey: string;
}) => Promise<Crypto.Privkey>, decryptSymmetricWithKey: (params: {
    encrypted: Crypto.EncryptedData;
    encryptionKey: string;
}) => Promise<string>, decryptSymmetricWithPassphrase: (params: {
    encrypted: Crypto.PassphraseEncryptedData;
    passphrase: string;
}) => Promise<string>, decryptPrivateKeyWithPassphrase: (params: {
    encryptedPrivkey: Crypto.PassphraseEncryptedData;
    passphrase: string;
}) => Promise<Crypto.Privkey>, encryptSymmetricWithKey: (params: {
    data: string;
    encryptionKey: string;
}) => Promise<Crypto.EncryptedData>, encryptSymmetricWithPassphrase: (params: {
    data: string;
    passphrase: string;
}) => Promise<Crypto.PassphraseEncryptedData>, encryptPrivateKey: (params: {
    privkey: Crypto.Privkey;
    encryptionKey: string;
}) => Promise<Crypto.EncryptedData>, encryptPrivateKeyWithPassphrase: (params: {
    privkey: Crypto.Privkey;
    passphrase: string;
}) => Promise<Crypto.PassphraseEncryptedData>, signPublicKey: (params: {
    privkey: Crypto.Privkey;
    pubkey: Crypto.Pubkey;
}) => Promise<Crypto.Pubkey>, verifyPublicKeySignature: (params: {
    signedPubkey: Crypto.Pubkey;
    signerPubkey: Crypto.Pubkey;
}) => Promise<boolean>;
//# sourceMappingURL=proxy.d.ts.map