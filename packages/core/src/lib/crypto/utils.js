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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.samlFingerprint = exports.validatePassphrase = exports.symmetricEncryptionKey = exports.secureRandomAlphanumeric = exports.sha256 = void 0;
const sjcl_1 = require("sjcl");
const tweetnacl_1 = require("tweetnacl");
const bs58_1 = require("bs58");
const zxcvbn_1 = __importDefault(require("zxcvbn"));
const crypto = __importStar(require("crypto"));
const sha256 = (s) => sjcl_1.codec.hex.fromBits(sjcl_1.hash.sha256.hash(s)), secureRandomAlphanumeric = function (len) {
    const bytes = (0, tweetnacl_1.randomBytes)(Math.ceil(len * 0.75));
    return (0, bs58_1.encode)(Buffer.from(bytes)).slice(0, len);
}, symmetricEncryptionKey = () => (0, exports.secureRandomAlphanumeric)(22), validatePassphrase = (val, inputs = []) => {
    if (val.length < 10) {
        return "Must be at least 10 characters.";
    }
    const { score, feedback: { suggestions, warning }, } = (0, zxcvbn_1.default)(val.substr(0, 20), [
        "envkey",
        "passphrase",
        "password",
        ...inputs,
    ]), valid = score && score > 3;
    if (valid) {
        return true;
    }
    else {
        const type = ["horrendously weak", "quite weak", "weak", "mediocre"][score];
        let msg = "Oops, that doesn't appear to be a strong passphrase. It is estimated to be " +
            type +
            " at best.";
        if (warning) {
            msg += " " + warning + ".";
        }
        if (suggestions && suggestions.length) {
            msg += " " + suggestions.join(" ");
        }
        return msg;
    }
}, 
// Outputs a hash of the cert only, separated every two chars by a colon for readability.
// This is the standard way SAML providers display cert fingerprints.
samlFingerprint = (pem, algo, safe) => {
    const matchedCert = pem.match(/-----BEGIN CERTIFICATE-----\s*([\s\S]+?)\s*-----END CERTIFICATE-----/i);
    if (!matchedCert || matchedCert.length < 2) {
        if (safe) {
            return "Invalid certificate";
        }
        throw new TypeError(`Certificate is invalid format - should be PEM: -----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----, but got:\n${pem}`);
    }
    const certOnly = Buffer.from(matchedCert[1], "base64");
    const hashed = crypto.createHash(algo).update(certOnly).digest("hex");
    const formatHexColonSep = hashed.replace(/(.{2})(?!$)/g, "$1:");
    return formatHexColonSep;
};
exports.sha256 = sha256, exports.secureRandomAlphanumeric = secureRandomAlphanumeric, exports.symmetricEncryptionKey = symmetricEncryptionKey, exports.validatePassphrase = validatePassphrase, 
// Outputs a hash of the cert only, separated every two chars by a colon for readability.
// This is the standard way SAML providers display cert fingerprints.
exports.samlFingerprint = samlFingerprint;
//# sourceMappingURL=utils.js.map