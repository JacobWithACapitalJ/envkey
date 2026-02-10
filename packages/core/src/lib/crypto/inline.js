"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPublicKeySignature = exports.signPublicKey = exports.encryptPrivateKeyWithPassphrase = exports.decryptSymmetricWithPassphrase = exports.decryptSymmetricWithKey = exports.encryptSymmetricWithKey = exports.encryptPrivateKey = exports.decryptPrivateKeyWithPassphrase = exports.decryptPrivateKey = exports.verifyDetached = exports.verifyJson = exports.verify = exports.signDetached = exports.signJson = exports.sign = exports.decryptWithKey = exports.decryptWithPassphrase = exports.decrypt = exports.encryptWithKey = exports.encryptSymmetricWithPassphrase = exports.encryptJson = exports.encrypt = exports.encryptionKeypair = exports.signingKeypair = void 0;
const sjcl_1 = require("sjcl");
const tweetnacl_1 = require("tweetnacl");
const tweetnacl_util_1 = require("tweetnacl-util");
const NONCE_LENGTH = 24, KDF_SALT_LENGTH = 24, KDF_ITERATIONS = 300000, deriveKey = function (passphrase, salt) {
    return sjcl_1.codec.base64.fromBits(sjcl_1.misc.pbkdf2(passphrase, sjcl_1.codec.base64.toBits(salt), KDF_ITERATIONS));
};
const signingKeypair = () => {
    const { publicKey, secretKey } = tweetnacl_1.sign.keyPair();
    return {
        publicKey: (0, tweetnacl_util_1.encodeBase64)(publicKey),
        secretKey: (0, tweetnacl_util_1.encodeBase64)(secretKey),
    };
}, encryptionKeypair = () => {
    const { publicKey, secretKey } = tweetnacl_1.box.keyPair();
    return {
        publicKey: (0, tweetnacl_util_1.encodeBase64)(publicKey),
        secretKey: (0, tweetnacl_util_1.encodeBase64)(secretKey),
    };
}, encrypt = function (params) {
    const { pubkey, privkey, data } = params, nonce = (0, tweetnacl_1.randomBytes)(NONCE_LENGTH);
    return {
        nonce: (0, tweetnacl_util_1.encodeBase64)(nonce),
        data: (0, tweetnacl_util_1.encodeBase64)((0, tweetnacl_1.box)((0, tweetnacl_util_1.decodeUTF8)(data), nonce, (0, tweetnacl_util_1.decodeBase64)(pubkey.keys.encryptionKey), (0, tweetnacl_util_1.decodeBase64)(privkey.keys.encryptionKey))),
    };
}, encryptJson = function (params) {
    return (0, exports.encrypt)(Object.assign(Object.assign({}, params), { data: JSON.stringify(params.data) }));
}, encryptSymmetricWithPassphrase = function (params) {
    const { passphrase, data } = params, salt = (0, tweetnacl_util_1.encodeBase64)((0, tweetnacl_1.randomBytes)(KDF_SALT_LENGTH)), key = (0, tweetnacl_util_1.decodeBase64)(deriveKey(passphrase, salt));
    return Object.assign(Object.assign({}, (0, exports.encryptWithKey)({ data, key })), { salt });
}, encryptWithKey = function (params) {
    const nonce = (0, tweetnacl_1.randomBytes)(NONCE_LENGTH);
    return {
        nonce: (0, tweetnacl_util_1.encodeBase64)(nonce),
        data: (0, tweetnacl_util_1.encodeBase64)((0, tweetnacl_1.secretbox)((0, tweetnacl_util_1.decodeUTF8)(params.data), nonce, params.key)),
    };
}, decrypt = function (params) {
    const { encrypted, pubkey, privkey } = params, res = tweetnacl_1.box.open((0, tweetnacl_util_1.decodeBase64)(encrypted.data), (0, tweetnacl_util_1.decodeBase64)(encrypted.nonce), (0, tweetnacl_util_1.decodeBase64)(pubkey.keys.encryptionKey), (0, tweetnacl_util_1.decodeBase64)(privkey.keys.encryptionKey));
    return res ? (0, tweetnacl_util_1.encodeUTF8)(res) : null;
}, decryptWithPassphrase = function (params) {
    const { encrypted, passphrase } = params, key = deriveKey(passphrase, encrypted.salt);
    return tweetnacl_1.secretbox.open((0, tweetnacl_util_1.decodeBase64)(encrypted.data), (0, tweetnacl_util_1.decodeBase64)(encrypted.nonce), (0, tweetnacl_util_1.decodeBase64)(key));
}, decryptWithKey = function (params) {
    const { encrypted, encryptionKey } = params, key = (0, tweetnacl_util_1.decodeBase64)(sjcl_1.codec.base64.fromBits(sjcl_1.hash.sha256.hash(encryptionKey))); // need to do some extra conversions due to sjcl using its own BitArray vs. Uint8Array in NaCl
    return tweetnacl_1.secretbox.open((0, tweetnacl_util_1.decodeBase64)(encrypted.data), (0, tweetnacl_util_1.decodeBase64)(encrypted.nonce), key);
}, sign = function (params) {
    const { data, privkey } = params;
    return (0, tweetnacl_1.sign)((0, tweetnacl_util_1.decodeUTF8)(data), (0, tweetnacl_util_1.decodeBase64)(privkey.keys.signingKey));
}, signJson = function (params) {
    const signed = (0, exports.sign)(Object.assign(Object.assign({}, params), { data: JSON.stringify(params.data) }));
    return (0, tweetnacl_util_1.encodeBase64)(signed);
}, signDetached = function (params) {
    const { data, privkey } = params;
    return tweetnacl_1.sign.detached((0, tweetnacl_util_1.decodeUTF8)(data), (0, tweetnacl_util_1.decodeBase64)(privkey.keys.signingKey));
}, verify = function (params) {
    const { signed, pubkey } = params;
    return tweetnacl_1.sign.open((0, tweetnacl_util_1.decodeBase64)(signed), (0, tweetnacl_util_1.decodeBase64)(pubkey.keys.signingKey));
}, verifyJson = function (params) {
    const res = (0, exports.verify)(params);
    if (!res)
        return null;
    return JSON.parse((0, tweetnacl_util_1.encodeUTF8)(res));
}, verifyDetached = function (params) {
    const { signed, signature, pubkey } = params;
    return tweetnacl_1.sign.detached.verify((0, tweetnacl_util_1.decodeUTF8)(signed), (0, tweetnacl_util_1.decodeBase64)(signature), (0, tweetnacl_util_1.decodeBase64)(pubkey.keys.signingKey));
}, decryptPrivateKey = function (params) {
    const decrypted = (0, exports.decryptWithKey)({
        encrypted: params.encryptedPrivkey,
        encryptionKey: params.encryptionKey,
    });
    if (!decrypted) {
        return null;
    }
    return JSON.parse((0, tweetnacl_util_1.encodeUTF8)(decrypted));
}, decryptPrivateKeyWithPassphrase = function (params) {
    const decrypted = (0, exports.decryptWithPassphrase)({
        encrypted: params.encryptedPrivkey,
        passphrase: params.passphrase,
    });
    if (!decrypted) {
        return null;
    }
    return JSON.parse((0, tweetnacl_util_1.encodeUTF8)(decrypted));
}, encryptPrivateKey = function (params) {
    return (0, exports.encryptWithKey)({
        key: (0, tweetnacl_util_1.decodeBase64)(sjcl_1.codec.base64.fromBits(sjcl_1.hash.sha256.hash(params.encryptionKey))), // need to do some extra conversions due to sjcl using its own BitArray vs. Uint8Array in NaCl
        data: JSON.stringify(params.privkey),
    });
}, encryptSymmetricWithKey = function (params) {
    return (0, exports.encryptWithKey)({
        key: (0, tweetnacl_util_1.decodeBase64)(sjcl_1.codec.base64.fromBits(sjcl_1.hash.sha256.hash(params.encryptionKey))), // need to do some extra conversions due to sjcl using its own BitArray vs. Uint8Array in NaCl
        data: params.data,
    });
}, decryptSymmetricWithKey = function (params) {
    const decrypted = (0, exports.decryptWithKey)(params);
    return decrypted ? (0, tweetnacl_util_1.encodeUTF8)(decrypted) : null;
}, decryptSymmetricWithPassphrase = function (params) {
    const decrypted = (0, exports.decryptWithPassphrase)(params);
    return decrypted ? (0, tweetnacl_util_1.encodeUTF8)(decrypted) : null;
}, encryptPrivateKeyWithPassphrase = function (params) {
    return (0, exports.encryptSymmetricWithPassphrase)({
        passphrase: params.passphrase,
        data: JSON.stringify(params.privkey),
    });
}, signPublicKey = function (params) {
    const { pubkey, privkey } = params, signature = (0, exports.signDetached)({
        data: JSON.stringify(pubkey.keys),
        privkey,
    });
    return Object.assign(Object.assign({}, pubkey), { signature: (0, tweetnacl_util_1.encodeBase64)(signature) });
}, verifyPublicKeySignature = function (params) {
    const { signedPubkey, signerPubkey } = params;
    return (0, exports.verifyDetached)({
        signed: JSON.stringify(signedPubkey.keys),
        pubkey: signerPubkey,
        signature: signedPubkey.signature,
    });
};
exports.signingKeypair = signingKeypair, exports.encryptionKeypair = encryptionKeypair, exports.encrypt = encrypt, exports.encryptJson = encryptJson, exports.encryptSymmetricWithPassphrase = encryptSymmetricWithPassphrase, exports.encryptWithKey = encryptWithKey, exports.decrypt = decrypt, exports.decryptWithPassphrase = decryptWithPassphrase, exports.decryptWithKey = decryptWithKey, exports.sign = sign, exports.signJson = signJson, exports.signDetached = signDetached, exports.verify = verify, exports.verifyJson = verifyJson, exports.verifyDetached = verifyDetached, exports.decryptPrivateKey = decryptPrivateKey, exports.decryptPrivateKeyWithPassphrase = decryptPrivateKeyWithPassphrase, exports.encryptPrivateKey = encryptPrivateKey, exports.encryptSymmetricWithKey = encryptSymmetricWithKey, exports.decryptSymmetricWithKey = decryptSymmetricWithKey, exports.decryptSymmetricWithPassphrase = decryptSymmetricWithPassphrase, exports.encryptPrivateKeyWithPassphrase = encryptPrivateKeyWithPassphrase, exports.signPublicKey = signPublicKey, exports.verifyPublicKeySignature = verifyPublicKeySignature;
//# sourceMappingURL=inline.js.map