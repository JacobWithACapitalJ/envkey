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
exports.decryptedEnvsStateProducer = exports.decryptChangesets = exports.decryptEnvs = void 0;
const R = __importStar(require("ramda"));
const g = __importStar(require("@envkey/core/lib/graph"));
const types_1 = require("@envkey/core/types");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const blob_1 = require("@envkey/core/lib/blob");
const trust_1 = require("../trust");
const logger_1 = require("@envkey/core/lib/utils/logger");
const handler_1 = require("../../handler");
const wait_1 = require("@envkey/core/lib/utils/wait");
const constants_1 = require("./constants");
const decryptEnvs = async (state, encryptedKeys, encryptedBlobs, currentUserPrivkey, context, keysOnly) => {
    // log("decrypt envs", {
    //   keys: encryptedKeys.length,
    //   blobs: encryptedBlobs.length,
    // });
    const toVerifyKeyableIds = new Set(), toDecryptKeys = [];
    for (let compositeId in encryptedKeys) {
        const encryptedKey = encryptedKeys[compositeId];
        const encryptedBy = state.graph[encryptedKey.encryptedById];
        if (!encryptedBy || !encryptedBy.pubkey) {
            (0, logger_1.log)("encryptedById not found in graph OR missing pubkey", {
                encryptedKey,
            });
            throw new Error("encryptedById not found in graph OR missing pubkey");
        }
        toVerifyKeyableIds.add(encryptedKey.encryptedById);
        toDecryptKeys.push([
            compositeId,
            {
                encrypted: encryptedKey.data,
                pubkey: encryptedBy.pubkey,
                privkey: currentUserPrivkey,
            },
        ]);
    }
    // log("decryptEnvs - got toVerifyKeyableIds and toDecryptKeys", {
    //   toVerifyKeyableIds: toVerifyKeyableIds.size,
    //   toDecryptKeys: toDecryptKeys.length,
    // });
    // verify all keyables
    await Promise.all(Array.from(toVerifyKeyableIds).map((keyableId) => (0, trust_1.verifyOrgKeyable)(state, keyableId, context)));
    // log("decryptEnvs - verified keyables");
    // decrypt all
    const encryptedKeyComposites = Object.keys(encryptedKeys);
    const encryptedBlobComposites = Object.keys(encryptedBlobs);
    if (!keysOnly) {
        const missingBlobs = R.difference(encryptedKeyComposites, encryptedBlobComposites);
        if (missingBlobs.length) {
            (0, logger_1.log)("missing blobs:", {
                missingBlobs,
                keys: R.pick(missingBlobs, encryptedKeys),
            });
            throw new Error("Missing blob keys");
        }
    }
    const emptyKeys = keysOnly
        ? []
        : R.difference(encryptedBlobComposites, encryptedKeyComposites);
    // if (missingKeys.length) {
    //   log("missing encrypted keys:", missingKeys);
    //   throw new Error("Missing encrypted keys");
    // }
    // log("decryptEnvs - got missingBlobs and emptyKeys");
    // log("decryptEnvs - starting decryption");
    let decryptRes = [];
    let decryptedSinceStatusUpdate = 0;
    for (let batch of R.splitEvery(constants_1.CRYPTO_ASYMMETRIC_BATCH_SIZE, toDecryptKeys)) {
        const batchRes = await Promise.all(batch.map(([compositeId, params]) => (0, proxy_1.decrypt)(params).then(async (decryptedKey) => {
            if (keysOnly) {
                decryptedSinceStatusUpdate++;
                if (decryptedSinceStatusUpdate >= constants_1.CRYPTO_ASYMMETRIC_STATUS_INTERVAL) {
                    (0, handler_1.dispatch)({
                        type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
                        payload: decryptedSinceStatusUpdate,
                    }, context);
                    decryptedSinceStatusUpdate = 0;
                }
                return {
                    [compositeId]: {
                        key: decryptedKey,
                        env: {},
                    },
                };
            }
            const encryptedBlob = encryptedBlobs[compositeId];
            if (!encryptedBlob) {
                (0, logger_1.log)("missing encryptedBlob", { compositeId, decryptedKey });
                throw new Error("Missing encrypted blob");
            }
            return (0, proxy_1.decryptSymmetricWithKey)({
                encrypted: encryptedBlob.data,
                encryptionKey: decryptedKey,
            })
                .then((decryptedBlob) => {
                const env = JSON.parse(decryptedBlob);
                decryptedSinceStatusUpdate++;
                if (decryptedSinceStatusUpdate >=
                    constants_1.CRYPTO_ASYMMETRIC_STATUS_INTERVAL) {
                    (0, handler_1.dispatch)({
                        type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
                        payload: decryptedSinceStatusUpdate,
                    }, context);
                    decryptedSinceStatusUpdate = 0;
                }
                return {
                    [compositeId]: {
                        key: decryptedKey,
                        env,
                    },
                };
            })
                .catch((err) => {
                (0, logger_1.log)("decryption failed", {
                    compositeId,
                    encryptedBlob,
                    err,
                });
                throw err;
            });
        })));
        await (0, wait_1.wait)(constants_1.CRYPTO_ASYMMETRIC_BATCH_DELAY_MS);
        decryptRes = decryptRes.concat(batchRes);
    }
    if (decryptedSinceStatusUpdate > 0) {
        (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
            payload: decryptedSinceStatusUpdate,
        }, context);
        decryptedSinceStatusUpdate = 0;
    }
    // log("decryptedEnvs - decrypted all");
    const decrypted = R.mergeAll(decryptRes);
    // log("decryptedEnvs - merged all");
    for (let batch of R.splitEvery(constants_1.CRYPTO_ASYMMETRIC_BATCH_SIZE, emptyKeys)) {
        for (let composite of batch) {
            if (!encryptedBlobs[composite]) {
                (0, logger_1.log)("Missing blob for empty key", {
                    composite,
                    data: encryptedBlobs[composite].data.data,
                    object: g.getEnvironmentName(state.graph, composite.split("||")[0]),
                });
                throw new Error("Missing blob for empty key");
            }
            if (!(0, blob_1.isValidEmptyVal)(encryptedBlobs[composite].data.data)) {
                (0, logger_1.log)("Invalid empty value", {
                    composite,
                    data: encryptedBlobs[composite].data.data,
                    object: g.getEnvironmentName(state.graph, composite.split("||")[0]),
                });
                throw new Error("invalid empty value");
            }
            decrypted[composite] = {
                key: "",
                env: JSON.parse(encryptedBlobs[composite].data.data),
            };
        }
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
            payload: batch.length,
        }, context);
    }
    // log("decrypted envs");
    return decrypted;
}, decryptChangesets = async (state, encryptedKeys, encryptedBlobs, currentUserPrivkey, context, keysOnly) => {
    // log("decrypt changesets", {
    //   keys: encryptedKeys.length,
    //   blobs: encryptedBlobs.length,
    // });
    const toVerifyKeyableIds = new Set(), toDecryptKeys = [];
    for (let environmentId in encryptedKeys) {
        const encryptedKey = encryptedKeys[environmentId];
        const encryptedBy = state.graph[encryptedKey.encryptedById];
        if (!encryptedBy || !encryptedBy.pubkey) {
            (0, logger_1.log)("encryptedById not found in graph OR missing pubkey", {
                encryptedKey,
            });
            throw new Error("encryptedById not found in graph OR missing pubkey");
        }
        toVerifyKeyableIds.add(encryptedKey.encryptedById);
        toDecryptKeys.push([
            environmentId,
            {
                encrypted: encryptedKey.data,
                pubkey: encryptedBy.pubkey,
                privkey: currentUserPrivkey,
            },
        ]);
    }
    // log("decryptChangesets - got toVerifyKeyableIds and toDecryptKeys", {
    //   toVerifyKeyableIds: toVerifyKeyableIds.size,
    //   toDecryptKeys: toDecryptKeys.length,
    // });
    // verify all keyables
    await Promise.all(Array.from(toVerifyKeyableIds).map((keyableId) => (0, trust_1.verifyOrgKeyable)(state, keyableId, context)));
    // log("decryptChangesets - verified keyables");
    // log("decryptChangesets - beginning decryption");
    // decrypt all
    let decryptRes = [];
    let decryptedSinceStatusUpdate = 0;
    for (let batch of R.splitEvery(constants_1.CRYPTO_ASYMMETRIC_BATCH_SIZE, toDecryptKeys)) {
        const batchRes = await Promise.all(batch.map(([environmentId, params]) => (0, proxy_1.decrypt)(params).then(async (decryptedKey) => {
            var _a;
            if (keysOnly) {
                decryptedSinceStatusUpdate++;
                if (decryptedSinceStatusUpdate >= constants_1.CRYPTO_ASYMMETRIC_STATUS_INTERVAL) {
                    (0, handler_1.dispatch)({
                        type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
                        payload: decryptedSinceStatusUpdate,
                    }, context);
                    decryptedSinceStatusUpdate = 0;
                }
                return {
                    [environmentId]: {
                        key: decryptedKey,
                        changesets: [],
                    },
                };
            }
            const environmentEncrypedBlobs = (_a = encryptedBlobs[environmentId]) !== null && _a !== void 0 ? _a : [];
            const decryptedBlobs = await Promise.all(environmentEncrypedBlobs.map((encryptedBlob) => (0, proxy_1.decryptSymmetricWithKey)({
                encryptionKey: decryptedKey,
                encrypted: encryptedBlob.data,
            })
                .then((decryptedBlob) => {
                const decryptedChangesets = JSON.parse(decryptedBlob);
                decryptedSinceStatusUpdate++;
                if (decryptedSinceStatusUpdate >=
                    constants_1.CRYPTO_ASYMMETRIC_STATUS_INTERVAL) {
                    (0, handler_1.dispatch)({
                        type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
                        payload: decryptedSinceStatusUpdate,
                    }, context);
                    decryptedSinceStatusUpdate = 0;
                }
                return decryptedChangesets.map((changesetPayload) => {
                    var _a;
                    return (Object.assign(Object.assign({}, changesetPayload), { createdAt: encryptedBlob.createdAt, encryptedById: encryptedBlob.encryptedById, createdById: (_a = encryptedBlob.createdById) !== null && _a !== void 0 ? _a : encryptedBlob.encryptedById, id: encryptedBlob.changesetId }));
                });
            })
                .catch((err) => {
                (0, logger_1.log)("changeset decryption failed", {
                    environmentId,
                    encryptedBlob,
                    err,
                });
                throw err;
            })));
            return {
                [environmentId]: {
                    key: decryptedKey,
                    changesets: R.flatten(decryptedBlobs),
                },
            };
        })));
        await (0, wait_1.wait)(constants_1.CRYPTO_ASYMMETRIC_BATCH_DELAY_MS);
        decryptRes = decryptRes.concat(batchRes);
    }
    if (decryptedSinceStatusUpdate > 0) {
        (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
            payload: decryptedSinceStatusUpdate,
        }, context);
        decryptedSinceStatusUpdate = 0;
    }
    // log("decryptChangesets - decrypted all");
    const res = R.mergeAll(decryptRes);
    // log("decryptChangesets - merged all");
    // log("decrypted changesets");
    return res;
}, decryptedEnvsStateProducer = (draft, action, fetchAction) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { payload: { envs, changesets, timestamp, notModified }, } = action;
    if (notModified) {
        return draft;
    }
    else if (!timestamp) {
        throw new Error("request timestamp is required");
    }
    if (envs) {
        const updatedEnvParentIds = new Set();
        for (let composite in envs) {
            const { environmentId } = (0, blob_1.parseUserEncryptedKeyOrBlobComposite)(composite);
            let envParentId;
            const environment = draft.graph[environmentId];
            if (environment) {
                envParentId = environment.envParentId;
            }
            else {
                [envParentId] = environmentId.split("|");
            }
            if (!(timestamp > ((_a = draft.envsFetchedAt[envParentId]) !== null && _a !== void 0 ? _a : 0))) {
                continue;
            }
            if (draft.graph[envParentId]) {
                updatedEnvParentIds.add(envParentId);
            }
            else {
                (0, logger_1.log)("missing env parent", {
                    envParentId,
                    composite,
                    "envs[composite]": envs[composite],
                });
            }
            draft.envs[composite] = envs[composite];
        }
        for (let envParentId of updatedEnvParentIds) {
            const envParent = draft.graph[envParentId];
            if (!envParent) {
                continue;
            }
            if (envParent.envsOrLocalsUpdatedAt) {
                draft.envsFetchedAt[envParentId] = envParent.envsOrLocalsUpdatedAt;
            }
        }
        // this is slow with many pending actions -- removing for now
        // clearVoidedPendingEnvUpdatesProducer(draft);
    }
    if (changesets) {
        const updatedEnvParentIds = new Set();
        for (let environmentId in changesets) {
            let envParentId;
            const environment = draft.graph[environmentId];
            if (environment) {
                envParentId = environment.envParentId;
            }
            else {
                [envParentId] = environmentId.split("|");
            }
            if (!(timestamp > ((_b = draft.changesetsFetchedAt[envParentId]) !== null && _b !== void 0 ? _b : 0))) {
                continue;
            }
            if (((_c = changesets[environmentId]) === null || _c === void 0 ? void 0 : _c.changesets.length) > 0) {
                updatedEnvParentIds.add(envParentId);
                draft.changesets[environmentId] = changesets[environmentId];
            }
            else if ((_d = changesets[environmentId]) === null || _d === void 0 ? void 0 : _d.key) {
                draft.changesets[environmentId] = {
                    key: changesets[environmentId].key,
                    changesets: (_f = (_e = draft.changesets[environmentId]) === null || _e === void 0 ? void 0 : _e.changesets) !== null && _f !== void 0 ? _f : [],
                };
            }
        }
        // if changesets were specifically requested (meaning we got them all), set changesetsFetchetAt
        // otherwise we only got a small set to notify user of a potential conflict--in that case, clear out changesetsFetchedAt
        for (let envParentId of updatedEnvParentIds) {
            if (fetchAction &&
                ((_g = fetchAction.payload.byEnvParentId[envParentId]) === null || _g === void 0 ? void 0 : _g.changesets)) {
                draft.changesetsFetchedAt[envParentId] = timestamp;
            }
            else if (fetchAction &&
                !((_h = fetchAction.payload.byEnvParentId[envParentId]) === null || _h === void 0 ? void 0 : _h.changesets)) {
                delete draft.changesetsFetchedAt[envParentId];
            }
        }
    }
};
exports.decryptEnvs = decryptEnvs, exports.decryptChangesets = decryptChangesets, exports.decryptedEnvsStateProducer = decryptedEnvsStateProducer;
//# sourceMappingURL=decrypt.js.map