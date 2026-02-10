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
exports.envParamsForEnvironments = void 0;
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const client_1 = require("@envkey/core/lib/client");
const graph_1 = require("@envkey/core/lib/graph");
const _1 = require(".");
const blob_1 = require("@envkey/core/lib/blob");
const lodash_set_1 = __importDefault(require("lodash.set"));
const logger_1 = require("@envkey/core/lib/utils/logger");
const rfc6902_1 = require("rfc6902");
const handler_1 = require("../../handler");
const constants_1 = require("./constants");
const wait_1 = require("@envkey/core/lib/utils/wait");
const envParamsForEnvironments = async (params) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const { state, context, pending, message, rotateKeys, reencryptChangesets, initEnvs, } = params;
    const currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
    if (!currentAuth || !currentAuth.privkey) {
        throw new Error("Authentication and decrypted privkey required");
    }
    const org = (0, graph_1.getOrg)(state.graph);
    let environmentIds = params.environmentIds;
    if (rotateKeys) {
        environmentIds = environmentIds.filter((environmentId) => {
            const environment = state.graph[environmentId];
            if (environment) {
                return Boolean(environment.envUpdatedAt);
            }
            else {
                const [envParentId, localsUserId] = environmentId.split("|");
                const envParent = state.graph[envParentId];
                return Boolean(envParent.localsUpdatedAtByUserId[localsUserId]);
            }
        });
    }
    const toEncrypt = [];
    const addPaths = [];
    const { environmentKeysByComposite, changesetKeysByEnvironmentId, keys, environmentIdsSet, envParentIds, baseEnvironmentsByEnvParentId, inheritingEnvironmentIdsByEnvironmentId, } = await (0, _1.encryptedKeyParamsForEnvironments)(Object.assign(Object.assign({}, params), { environmentIds, newKeysOnly: !rotateKeys }));
    let blobs = {};
    // for each environment, queue encryption ops for each
    // permitted device, invite, device grant, local key, server,
    // and recovery key
    for (let environmentId of environmentIds) {
        let envParentId, localsUserId;
        const environment = state.graph[environmentId];
        if (environment) {
            envParentId = environment.envParentId;
        }
        else {
            [envParentId, localsUserId] = environmentId.split("|");
        }
        const envParent = state.graph[envParentId];
        (0, client_1.ensureEnvsFetched)(state, envParentId);
        let blobBasePath = [envParentId];
        if (localsUserId) {
            blobBasePath = [...blobBasePath, "locals", localsUserId];
        }
        else if (environment) {
            blobBasePath = [...blobBasePath, "environments", environmentId];
        }
        const env = (0, client_1.getKeyableEnv)(state, {
            envParentId,
            environmentId,
        }, pending);
        const envIsEmpty = R.isEmpty(env);
        const envComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({ environmentId });
        const envSymmetricKey = (_a = environmentKeysByComposite[envComposite]) !== null && _a !== void 0 ? _a : (_b = state.envs[envComposite]) === null || _b === void 0 ? void 0 : _b.key;
        environmentKeysByComposite[envComposite] = envSymmetricKey;
        toEncrypt.push([
            [...blobBasePath, "env"],
            {
                data: JSON.stringify(env),
                encryptionKey: envSymmetricKey,
            },
        ]);
        const meta = (0, client_1.getEnvMetaOnly)(state, {
            envParentId,
            environmentId,
        }, pending);
        const metaComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
            environmentId,
            envPart: "meta",
        });
        const metaSymmetricKey = (_c = environmentKeysByComposite[metaComposite]) !== null && _c !== void 0 ? _c : (_d = state.envs[metaComposite]) === null || _d === void 0 ? void 0 : _d.key;
        environmentKeysByComposite[metaComposite] = metaSymmetricKey;
        toEncrypt.push([
            [...blobBasePath, "meta"],
            {
                data: JSON.stringify(meta),
                encryptionKey: metaSymmetricKey,
            },
        ]);
        if (!localsUserId) {
            const inherits = (0, client_1.getEnvInherits)(state, {
                envParentId,
                environmentId,
            }, pending);
            const inheritsComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                environmentId,
                envPart: "inherits",
            });
            const inheritsSymmetricKey = (_e = environmentKeysByComposite[inheritsComposite]) !== null && _e !== void 0 ? _e : (_f = state.envs[inheritsComposite]) === null || _f === void 0 ? void 0 : _f.key;
            environmentKeysByComposite[inheritsComposite] = inheritsSymmetricKey;
            toEncrypt.push([
                [...blobBasePath, "inherits"],
                {
                    data: JSON.stringify(inherits),
                    encryptionKey: inheritsSymmetricKey,
                },
            ]);
        }
        const changesetsSymmetricKey = (_g = changesetKeysByEnvironmentId[environmentId]) !== null && _g !== void 0 ? _g : (_h = state.changesets[environmentId]) === null || _h === void 0 ? void 0 : _h.key;
        if (changesetsSymmetricKey) {
            changesetKeysByEnvironmentId[environmentId] = changesetsSymmetricKey;
        }
        if (reencryptChangesets || (initEnvs && envIsEmpty)) {
            if (!initEnvs) {
                (0, client_1.ensureChangesetsFetched)(state, envParentId);
            }
            const changesets = initEnvs
                ? []
                : (_k = (_j = state.changesets[environmentId]) === null || _j === void 0 ? void 0 : _j.changesets) !== null && _k !== void 0 ? _k : [];
            if (changesets.length > 0 && !changesetsSymmetricKey) {
                throw new Error("Missing changeset encryption key");
            }
            if (changesetsSymmetricKey) {
                const byId = R.groupBy(R.prop("id"), changesets);
                for (let changesetId in byId) {
                    const changesetPayloads = byId[changesetId].map(R.pick(["actions", "message"]));
                    toEncrypt.push([
                        [...blobBasePath, "changesetsById", changesetId, "data"],
                        {
                            data: JSON.stringify(changesetPayloads),
                            encryptionKey: changesetsSymmetricKey,
                        },
                    ]);
                    addPaths.push([
                        [...blobBasePath, "changesetsById", changesetId, "createdAt"],
                        byId[changesetId][0].createdAt,
                    ]);
                    addPaths.push([
                        [...blobBasePath, "changesetsById", changesetId, "createdById"],
                        byId[changesetId][0].createdById,
                    ]);
                }
            }
            if (changesets.length == 0) {
                addPaths.push([[...blobBasePath, "changesetsById"], {}]);
            }
        }
        else if (pending || (initEnvs && !envIsEmpty)) {
            if (!changesetsSymmetricKey) {
                throw new Error("Missing changeset encryption key");
            }
            const changeset = initEnvs
                ? {
                    actions: [
                        {
                            type: types_1.Client.ActionType.IMPORT_ENVIRONMENT,
                            payload: {
                                diffs: (0, rfc6902_1.createPatch)({
                                    inherits: {},
                                    variables: {},
                                }, { inherits: {}, variables: env }),
                                reverse: (0, rfc6902_1.createPatch)({ inherits: {}, variables: env }, {
                                    inherits: {},
                                    variables: {},
                                }),
                            },
                            meta: {
                                envParentId,
                                environmentId,
                                entryKeys: Object.keys(env),
                            },
                        },
                    ],
                }
                : {
                    actions: (0, client_1.getPendingActionsByEnvironmentId)(state)[environmentId].map((action) => (Object.assign(Object.assign({}, action), { meta: R.omit(["pendingAt"], action.meta) }))),
                    message,
                };
            toEncrypt.push([
                [...blobBasePath, "changesets"],
                {
                    data: JSON.stringify([changeset]),
                    encryptionKey: changesetsSymmetricKey,
                },
            ]);
        }
    }
    // now queue encryption ops for inheritance overrides if environments on either side of the relationship are being updated
    for (let envParentId of envParentIds) {
        const baseEnvironments = baseEnvironmentsByEnvParentId[envParentId];
        for (let baseEnvironment of baseEnvironments) {
            const inheritingEnvironmentIds = inheritingEnvironmentIdsByEnvironmentId[baseEnvironment.id];
            for (let inheritingEnvironmentId of inheritingEnvironmentIds) {
                const inheritingEnvironment = state.graph[inheritingEnvironmentId];
                if (!(environmentIdsSet.has(inheritingEnvironmentId) ||
                    environmentIdsSet.has(baseEnvironment.id) ||
                    (inheritingEnvironment.isSub &&
                        environmentIdsSet.has(inheritingEnvironment.parentEnvironmentId)))) {
                    continue;
                }
                const currentUserBasePermissions = (0, graph_1.getEnvironmentPermissions)(state.graph, baseEnvironment.id, currentAuth.userId);
                if (!currentUserBasePermissions.has("read")) {
                    continue;
                }
                const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId: inheritingEnvironmentId,
                    inheritsEnvironmentId: baseEnvironment.id,
                });
                const encryptionKey = (_l = environmentKeysByComposite[composite]) !== null && _l !== void 0 ? _l : (_m = state.envs[composite]) === null || _m === void 0 ? void 0 : _m.key;
                if (encryptionKey) {
                    environmentKeysByComposite[composite] = encryptionKey;
                    let overrides = (_o = (0, client_1.getInheritanceOverrides)(state, {
                        envParentId,
                        environmentId: inheritingEnvironmentId,
                        forInheritsEnvironmentId: baseEnvironment.id,
                    }, pending)[baseEnvironment.id]) !== null && _o !== void 0 ? _o : {};
                    if (inheritingEnvironment.isSub) {
                        overrides = Object.assign(Object.assign({}, ((_p = (0, client_1.getInheritanceOverrides)(state, {
                            envParentId,
                            environmentId: inheritingEnvironment.parentEnvironmentId,
                            forInheritsEnvironmentId: baseEnvironment.id,
                        }, pending)[baseEnvironment.id]) !== null && _p !== void 0 ? _p : {})), overrides);
                    }
                    const data = JSON.stringify(overrides);
                    toEncrypt.push([
                        [
                            envParentId,
                            "environments",
                            inheritingEnvironmentId,
                            "inheritanceOverrides",
                            baseEnvironment.id,
                        ],
                        {
                            data,
                            encryptionKey,
                        },
                    ]);
                }
            }
        }
    }
    await (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
        payload: {
            processed: 0,
            total: toEncrypt.length,
            op: "encrypt",
            dataType: "blobs",
        },
    }, context);
    // log("envParamsForEnvironments - starting encryption");
    let pathResults = [];
    let encryptedSinceStatusUpdate = 0;
    for (let batch of R.splitEvery(constants_1.CRYPTO_SYMMETRIC_BATCH_SIZE, toEncrypt)) {
        const res = await Promise.all(batch.map(([path, params]) => {
            if (params.encryptionKey) {
                return (0, proxy_1.encryptSymmetricWithKey)({
                    data: params.data,
                    encryptionKey: params.encryptionKey,
                }).then((encrypted) => {
                    encryptedSinceStatusUpdate++;
                    if (encryptedSinceStatusUpdate >= constants_1.CRYPTO_SYMMETRIC_STATUS_INTERVAL) {
                        (0, handler_1.dispatch)({
                            type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
                            payload: encryptedSinceStatusUpdate,
                        }, context);
                        encryptedSinceStatusUpdate = 0;
                    }
                    return [path, encrypted];
                });
            }
            if (!org.optimizeEmptyEnvs) {
                (0, logger_1.log)("Missing encrypted key for blob", {
                    path: path.map((p) => state.graph[p] ? (0, graph_1.getObjectName)(state.graph, p) : p),
                    params,
                    pending,
                    message,
                    rotateKeys,
                    reencryptChangesets,
                    initEnvs,
                });
                throw new Error("Missing encrypted key for blob");
            }
            if (!(0, blob_1.isValidEmptyVal)(params.data)) {
                (0, logger_1.log)("invalid empty value", {
                    path: path.map((p) => state.graph[p] ? (0, graph_1.getObjectName)(state.graph, p) : p),
                    params,
                    pending,
                    message,
                    rotateKeys,
                    reencryptChangesets,
                    initEnvs,
                });
                throw new Error("invalid empty value");
            }
            if (encryptedSinceStatusUpdate >= constants_1.CRYPTO_SYMMETRIC_STATUS_INTERVAL) {
                (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
                    payload: encryptedSinceStatusUpdate,
                }, context);
                encryptedSinceStatusUpdate = 0;
            }
            return [path, { data: params.data, nonce: "" }];
        }));
        await (0, wait_1.wait)(constants_1.CRYPTO_SYMMETRIC_BATCH_DELAY_MS);
        pathResults = pathResults.concat(res);
    }
    // log("envParamsForEnvironments - encrypted all");
    await (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
        payload: undefined,
    }, context);
    for (let [path, data] of pathResults) {
        (0, lodash_set_1.default)(blobs, path, data);
    }
    for (let [path, data] of addPaths) {
        (0, lodash_set_1.default)(blobs, path, data);
    }
    // log("params", { pathResults });
    return {
        keys,
        blobs,
        environmentKeysByComposite,
        changesetKeysByEnvironmentId,
    };
};
exports.envParamsForEnvironments = envParamsForEnvironments;
//# sourceMappingURL=params.js.map