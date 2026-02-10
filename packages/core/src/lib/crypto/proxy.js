"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPublicKeySignature = exports.signPublicKey = exports.encryptPrivateKeyWithPassphrase = exports.encryptPrivateKey = exports.encryptSymmetricWithPassphrase = exports.encryptSymmetricWithKey = exports.decryptPrivateKeyWithPassphrase = exports.decryptSymmetricWithPassphrase = exports.decryptSymmetricWithKey = exports.decryptPrivateKey = exports.verifyJson = exports.signJson = exports.decrypt = exports.decryptJson = exports.encryptJson = exports.encrypt = exports.ephemeralEncryptionKeypair = exports.generateKeys = void 0;
const start_1 = require("../../worker/start");
const generateKeys = async function (params = {}) {
    const { passphrase, encryptionKey } = params;
    const proxy = await (0, start_1.getProxy)(), [{ publicKey: encryptionPubkey, secretKey: encryptionPrivkey }, { publicKey: signingPubkey, secretKey: signingPrivkey },] = await Promise.all([
        proxy.encryptionKeypair(),
        proxy.signingKeypair(),
    ]), pubkey = {
        keys: {
            signingKey: signingPubkey,
            encryptionKey: encryptionPubkey,
        },
    }, privkey = {
        keys: {
            signingKey: signingPrivkey,
            encryptionKey: encryptionPrivkey,
        },
    };
    let encryptedPrivkey;
    if (passphrase || encryptionKey) {
        encryptedPrivkey = passphrase
            ? await (0, exports.encryptPrivateKeyWithPassphrase)({ privkey, passphrase })
            : await (0, exports.encryptPrivateKey)({
                privkey,
                encryptionKey: encryptionKey,
            });
    }
    return { pubkey, privkey, encryptedPrivkey };
}, ephemeralEncryptionKeypair = async function () {
    const proxy = await (0, start_1.getProxy)(), { publicKey, secretKey } = await proxy.encryptionKeypair();
    return {
        pubkey: {
            keys: {
                encryptionKey: publicKey,
                signingKey: "",
            },
        },
        privkey: {
            keys: {
                encryptionKey: secretKey,
                signingKey: "",
            },
        },
    };
}, encrypt = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    return proxy.encrypt(params);
}, encryptJson = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    return proxy.encryptJson(params);
}, decryptJson = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    const decrypted = await proxy.decrypt(params);
    if (decrypted === null)
        throw new Error("Decryption authentication failed");
    return JSON.parse(decrypted);
}, decrypt = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    const decrypted = await proxy.decrypt(params);
    if (decrypted === null)
        throw new Error("Decryption authentication failed");
    return decrypted;
}, signJson = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    return proxy.signJson(params);
}, verifyJson = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    const verified = await proxy.verifyJson(params);
    if (verified === null)
        throw new Error("Signature invalid");
    return verified;
}, decryptPrivateKey = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    const decrypted = await proxy.decryptPrivateKey(params);
    if (decrypted === null)
        throw new Error("Private key decryption failed");
    return decrypted;
}, decryptSymmetricWithKey = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    const decrypted = await proxy.decryptSymmetricWithKey(params);
    if (decrypted === null)
        throw new Error("Decryption failed");
    return decrypted;
}, decryptSymmetricWithPassphrase = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    const decrypted = await proxy.decryptSymmetricWithPassphrase(params);
    if (decrypted === null)
        throw new Error("Decryption failed");
    return decrypted;
}, decryptPrivateKeyWithPassphrase = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    const decrypted = await proxy.decryptPrivateKeyWithPassphrase(params);
    if (decrypted === null)
        throw new Error("Private key decryption failed");
    return decrypted;
}, encryptSymmetricWithKey = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    return proxy.encryptSymmetricWithKey(params);
}, encryptSymmetricWithPassphrase = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    return proxy.encryptSymmetricWithPassphrase(params);
}, encryptPrivateKey = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    return proxy.encryptPrivateKey(params);
}, encryptPrivateKeyWithPassphrase = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    return proxy.encryptPrivateKeyWithPassphrase(params);
}, signPublicKey = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    return proxy.signPublicKey(params);
}, verifyPublicKeySignature = async function (params) {
    const proxy = await (0, start_1.getProxy)();
    if (!params.signedPubkey.signature)
        throw new Error("Pubkey is not signed");
    return proxy.verifyPublicKeySignature(params);
};
exports.generateKeys = generateKeys, exports.ephemeralEncryptionKeypair = ephemeralEncryptionKeypair, exports.encrypt = encrypt, exports.encryptJson = encryptJson, exports.decryptJson = decryptJson, exports.decrypt = decrypt, exports.signJson = signJson, exports.verifyJson = verifyJson, exports.decryptPrivateKey = decryptPrivateKey, exports.decryptSymmetricWithKey = decryptSymmetricWithKey, exports.decryptSymmetricWithPassphrase = decryptSymmetricWithPassphrase, exports.decryptPrivateKeyWithPassphrase = decryptPrivateKeyWithPassphrase, exports.encryptSymmetricWithKey = encryptSymmetricWithKey, exports.encryptSymmetricWithPassphrase = encryptSymmetricWithPassphrase, exports.encryptPrivateKey = encryptPrivateKey, exports.encryptPrivateKeyWithPassphrase = encryptPrivateKeyWithPassphrase, exports.signPublicKey = signPublicKey, exports.verifyPublicKeySignature = verifyPublicKeySignature;
//# sourceMappingURL=proxy.js.map