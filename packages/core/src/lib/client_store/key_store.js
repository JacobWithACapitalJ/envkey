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
exports.enableLogging = exports.getCoreProcAuthToken = exports.lock = exports.unlock = exports.isLocked = exports.hasDeviceKey = exports.getDeviceKey = exports.initDeviceKey = exports.initKeyStore = void 0;
const logger_1 = require("../utils/logger");
const conf_1 = __importDefault(require("conf"));
const inline_1 = require("../crypto/inline");
const utils_1 = require("../crypto/utils");
const tweetnacl_util_1 = require("tweetnacl-util");
const types_1 = require("../../types");
const R = __importStar(require("ramda"));
const os = __importStar(require("os"));
const needsKeytar = ["darwin", "win32"].includes(os.platform());
// uses node-keytar to store sensitive data in the os keychain when one is available
// - keychain on mac
// - credential manager on windows
// - libsecret is available on Linux, but the behavior was flaky across distros during testing,
//   so it has been disabled below.
// keytar is added next to the cli.js bundle inside pkg, or in extraResources in an electron.
// This key_store.ts file is implicitly imported by anything referencing @core, so we put
// this in a getter using try/catch.
let _keytar;
const getKeytar = () => {
    if (_keytar) {
        return _keytar;
    }
    // electron and CLI
    if (typeof __non_webpack_require__ !== "undefined") {
        maybeLog("CLI inside `pkg`");
        // this one is first for a little faster CLI commands
        if (process.env.ENVKEY_CLI_BUILD_VERSION) {
            try {
                maybeLog("loading keytar from ./envkey-keytar.node");
                _keytar = __non_webpack_require__("./envkey-keytar.node"); // deployed to the same folder
                maybeLog("keytar was loaded");
                return _keytar;
            }
            catch (loadErr) {
                maybeLog("did not load keytar", {
                    loadErr,
                });
            }
        }
        if (process.env.IS_ELECTRON) {
            // electron
            try {
                maybeLog("loading keytar from __non_webpack_require__('keytar')");
                _keytar = __non_webpack_require__("keytar");
                maybeLog("loaded keytar from __non_webpack_require__('keytar')");
                return _keytar;
            }
            catch (loadErr) {
                maybeLog("did not load non-webpack keytar from 'keytar'", {
                    loadErr: loadErr.message,
                });
            }
        }
    }
    // local dev, probably
    try {
        maybeLog("loading keytar from require('keytar')");
        _keytar = require("keytar");
        maybeLog("keytar was loaded from require('keytar')");
        return _keytar;
    }
    catch (loadErr) {
        maybeLog("did not load keytar from require('keytar')", {
            loadErr: loadErr.message,
        });
    }
    throw new Error("keytar unavailable to key_store");
};
const SERVICE_NAME = "com.envkey.local-server.root-device-key", DEVICE_KEY = "root-device-key";
const initKeyStore = async () => {
    await resolveLocked();
}, initDeviceKey = async (passphrase) => {
    maybeLog("Initializing root device key...");
    // if we're replacing an existing device key, keep the same auth key
    // for authenticating requests
    const existingDeviceKey = await (0, exports.getDeviceKey)(), auth = existingDeviceKey
        ? existingDeviceKey.auth
        : (0, utils_1.secureRandomAlphanumeric)(22), key = (0, utils_1.secureRandomAlphanumeric)(22);
    let deviceKey;
    if (passphrase) {
        const encryptedKey = await (0, inline_1.encryptSymmetricWithPassphrase)({
            data: key,
            passphrase,
        });
        deviceKey = { auth, encryptedKey, key };
    }
    else {
        deviceKey = { auth, key };
    }
    await setDeviceKey(deviceKey);
    locked = false;
    maybeLog("Initialized root device key.");
    return deviceKey;
}, getDeviceKey = () => getKey(DEVICE_KEY), hasDeviceKey = () => getKey(DEVICE_KEY).then(Boolean), isLocked = () => locked, unlock = async (passphrase) => {
    maybeLog("Unlocking device...");
    let deviceKey = await (0, exports.getDeviceKey)();
    if (!deviceKey) {
        throw new Error("Device key not found.");
    }
    if ("key" in deviceKey && deviceKey.key) {
        maybeLog("Device already unlocked.");
        return deviceKey;
    }
    else if ("encryptedKey" in deviceKey && deviceKey.encryptedKey) {
        const key = await (0, inline_1.decryptSymmetricWithPassphrase)({
            encrypted: deviceKey.encryptedKey,
            passphrase,
        });
        if (!key) {
            throw new Error("Decryption failed");
        }
        deviceKey = Object.assign(Object.assign({}, deviceKey), { key });
        await setDeviceKey(deviceKey);
        locked = false;
        maybeLog("Unlocked device.");
        return deviceKey;
    }
}, lock = async () => {
    maybeLog("Locking out device...");
    const deviceKey = await (0, exports.getDeviceKey)();
    if (!deviceKey) {
        throw new Error("Device key not found.");
    }
    if (!("key" in deviceKey)) {
        maybeLog("Device already locked.");
        return;
    }
    if ("encryptedKey" in deviceKey) {
        await setDeviceKey(R.omit(["key"], deviceKey));
        locked = true;
        maybeLog("Device locked.");
    }
    else {
        maybeLog("keyStore - Can't lock device that has no passphrase set.");
    }
}, getCoreProcAuthToken = async () => {
    if (encryptedAuthToken) {
        return encryptedAuthToken;
    }
    else if (encryptedAuthTokenPromise) {
        await encryptedAuthTokenPromise;
        return encryptedAuthToken;
    }
    const deviceKey = await (0, exports.getDeviceKey)();
    if (!deviceKey || !("auth" in deviceKey) || !deviceKey.auth) {
        throw new Error("Invalid device key");
    }
    const encrypted = (0, inline_1.encryptSymmetricWithKey)({
        data: types_1.Client.CORE_PROC_AUTH_TOKEN,
        encryptionKey: deviceKey.auth,
    });
    encryptedAuthToken = (0, tweetnacl_util_1.encodeBase64)((0, tweetnacl_util_1.decodeUTF8)(JSON.stringify(encrypted)));
    return encryptedAuthToken;
}, enableLogging = () => (loggingEnabled = true);
exports.initKeyStore = initKeyStore, exports.initDeviceKey = initDeviceKey, exports.getDeviceKey = getDeviceKey, exports.hasDeviceKey = hasDeviceKey, exports.isLocked = isLocked, exports.unlock = unlock, exports.lock = lock, exports.getCoreProcAuthToken = getCoreProcAuthToken, exports.enableLogging = enableLogging;
let loggingEnabled = Boolean(process.env.IS_ELECTRON) || Boolean(process.env.ENVKEY_DEBUG), fallback, cache = {}, promiseCache = {}, locked = false, encryptedAuthToken, encryptedAuthTokenPromise;
const maybeLog = (msg, data) => {
    if (loggingEnabled) {
        (0, logger_1.log)(msg, data);
    }
}, setDeviceKey = (deviceKey) => {
    return putKey(DEVICE_KEY, deviceKey);
}, resolveLocked = async () => {
    const deviceKey = await (0, exports.getDeviceKey)();
    if (!deviceKey) {
        throw new Error("Device key not found.");
    }
    locked = Boolean("encryptedKey" in deviceKey && !("key" in deviceKey));
}, fallbackStore = () => {
    // conf for file system fallback - stored in platform config dir
    if (!fallback) {
        fallback = new conf_1.default({
            // 👇 conf encryption key is not set for security purposes, just ensures integrity of config file (plus a little obscurity)
            encryptionKey: "7d359d90209b490b9771c3658543a06d",
            configName: "envkey-keystore-fallback",
            // necessary because package.json is normally used, but discarded during executable packaging.
            // also Conf internals would use file paths that don't work with `vercel/pkg`
            projectName: "envkey",
            projectSuffix: "",
        });
        maybeLog("Fallback store initialized.", { path: fallback.path });
    }
    return fallback;
}, putKey = async (k, v) => {
    if (cache[k] && cache[k] === v) {
        return;
    }
    cache[k] = v;
    if (needsKeytar) {
        maybeLog(`Setting ${k} in OS credential store...`);
        await getKeytar().setPassword(SERVICE_NAME, k, JSON.stringify(v));
    }
    else {
        maybeLog(`Setting ${k} in file store...`);
        fallbackStore().set(k, v);
    }
    maybeLog(`${k} set.`);
}, deleteKey = async (k) => {
    if (needsKeytar) {
        return getKeytar().deletePassword(SERVICE_NAME, k);
    }
    return fallbackStore().delete(k);
}, getKey = async (k) => {
    var _a;
    if (promiseCache[k]) {
        return promiseCache[k];
    }
    if (cache[k]) {
        return cache[k];
    }
    if (needsKeytar) {
        maybeLog(`Fetching ${k} from OS credential store...`);
        promiseCache[k] = getKeytar()
            .getPassword(SERVICE_NAME, k)
            .then((v) => (v ? JSON.parse(v) : v));
        cache[k] = await promiseCache[k];
        delete promiseCache[k];
    }
    else {
        maybeLog(`Fetching ${k} from file store...`);
        cache[k] = ((_a = fallbackStore().get(k)) !== null && _a !== void 0 ? _a : null);
    }
    maybeLog(cache[k] ? `Fetched ${k}.` : `${k} is null.`);
    return cache[k];
};
//# sourceMappingURL=key_store.js.map