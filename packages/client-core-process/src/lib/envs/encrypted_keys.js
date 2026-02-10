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
exports.encryptedKeyParamsForEnvironments = void 0;
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const graph_1 = require("@envkey/core/lib/graph");
const blob_1 = require("@envkey/core/lib/blob");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const utils_1 = require("@envkey/core/lib/crypto/utils");
const trust_1 = require("../trust");
const client_1 = require("@envkey/core/lib/client");
const lodash_set_1 = __importDefault(require("lodash.set"));
const handler_1 = require("../../handler");
const logger_1 = require("@envkey/core/lib/utils/logger");
const constants_1 = require("./constants");
const wait_1 = require("@envkey/core/lib/utils/wait");
const encryptedKeyParamsForEnvironments = async (params) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { state, environmentIds, pending, newKeysOnly, reencryptChangesets, initEnvs, context, } = params;
    const now = Date.now(), currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
    if (!currentAuth || !currentAuth.privkey) {
        throw new Error("Authentication and decrypted privkey required");
    }
    const privkey = currentAuth.privkey;
    const org = (0, graph_1.getOrg)(state.graph);
    const environmentKeysByComposite = {};
    const changesetKeysByEnvironmentId = {};
    let keys = {};
    const toVerifyKeyableIds = new Set(), toEncrypt = [], allUserIds = [
        ...(0, graph_1.graphTypes)(state.graph).orgUsers.map(R.prop("id")),
        ...(0, graph_1.graphTypes)(state.graph).cliUsers.map(R.prop("id")),
    ];
    // for each environment, generate key and queue encryption ops for each
    // permitted device, invite, device grant, local key, server, and recovery key
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
        const envWithMeta = (0, client_1.getEnvWithMeta)(state, { envParentId, environmentId }, pending);
        const isEmpty = R.isEmpty(envWithMeta.variables);
        const parentIsEmpty = (environment === null || environment === void 0 ? void 0 : environment.isSub)
            ? R.isEmpty((0, client_1.getEnvWithMeta)(state, { envParentId, environmentId: environment.parentEnvironmentId }, pending).variables)
            : false;
        let envSymmetricKey;
        let metaSymmetricKey;
        let inheritsSymmetricKey;
        let changesetsSymmetricKey;
        let parentEnvComposite;
        let parentEnvSymmetricKey;
        const [[envComposite, existingEnvSymmetricKey], [metaComposite, existingMetaSymmetricKey], [inheritsComposite, existingInheritsSymmetricKey],] = ["env", "meta", "inherits"].map((envPart) => {
            var _a;
            const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                environmentId,
                envPart,
            });
            return [composite, (_a = state.envs[composite]) === null || _a === void 0 ? void 0 : _a.key];
        });
        if (!(newKeysOnly && existingEnvSymmetricKey) &&
            (!org.optimizeEmptyEnvs || !isEmpty || existingEnvSymmetricKey)) {
            envSymmetricKey =
                (_a = environmentKeysByComposite[envComposite]) !== null && _a !== void 0 ? _a : (0, utils_1.symmetricEncryptionKey)();
            environmentKeysByComposite[envComposite] = envSymmetricKey;
        }
        if (!(newKeysOnly && existingMetaSymmetricKey) &&
            (!org.optimizeEmptyEnvs || !isEmpty || existingMetaSymmetricKey)) {
            metaSymmetricKey = (0, utils_1.symmetricEncryptionKey)();
            environmentKeysByComposite[metaComposite] = metaSymmetricKey;
        }
        if (!localsUserId) {
            if (!(newKeysOnly && existingInheritsSymmetricKey) &&
                (!org.optimizeEmptyEnvs || !isEmpty || existingInheritsSymmetricKey)) {
                inheritsSymmetricKey = (0, utils_1.symmetricEncryptionKey)();
                environmentKeysByComposite[inheritsComposite] = inheritsSymmetricKey;
            }
        }
        if (environment === null || environment === void 0 ? void 0 : environment.isSub) {
            parentEnvComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                environmentId: environment.parentEnvironmentId,
            });
            const existingParentSymmetricKey = (_b = state.envs[parentEnvComposite]) === null || _b === void 0 ? void 0 : _b.key;
            if (!(newKeysOnly && existingParentSymmetricKey) &&
                (!org.optimizeEmptyEnvs || !parentIsEmpty || existingParentSymmetricKey)) {
                parentEnvSymmetricKey =
                    (_c = environmentKeysByComposite[parentEnvComposite]) !== null && _c !== void 0 ? _c : (0, utils_1.symmetricEncryptionKey)();
                environmentKeysByComposite[parentEnvComposite] = parentEnvSymmetricKey;
            }
        }
        let changesetsToReencrypt;
        if (pending && !reencryptChangesets) {
            changesetsSymmetricKey = (_d = state.changesets[environmentId]) === null || _d === void 0 ? void 0 : _d.key;
            if (!changesetsSymmetricKey) {
                const msg = "Missing changesets symmetric key for pending changes";
                const err = new Error(msg);
                (0, logger_1.log)(msg, { environmentId, pending, initEnvs, stack: err.stack });
                throw err;
            }
        }
        else if (initEnvs && !reencryptChangesets) {
            changesetsSymmetricKey = (0, utils_1.symmetricEncryptionKey)();
        }
        else if (reencryptChangesets) {
            (0, client_1.ensureChangesetsFetched)(state, envParentId);
            changesetsToReencrypt = (_e = state.changesets[environmentId]) === null || _e === void 0 ? void 0 : _e.changesets;
            if (changesetsToReencrypt) {
                changesetsSymmetricKey = (0, utils_1.symmetricEncryptionKey)();
            }
        }
        if (changesetsSymmetricKey) {
            changesetKeysByEnvironmentId[environmentId] = changesetsSymmetricKey;
        }
        for (let userId of allUserIds) {
            const orgRoleId = state.graph[userId]
                .orgRoleId, targetUserOrgPermissions = (0, graph_1.getOrgPermissions)(state.graph, orgRoleId), deviceIds = (0, graph_1.getDeviceIdsForUser)(state.graph, userId, now), pubkeysByDeviceId = (0, graph_1.getPubkeysByDeviceIdForUser)(state.graph, userId, now);
            if (localsUserId) {
                if (!(envSymmetricKey || metaSymmetricKey || changesetsSymmetricKey)) {
                    continue;
                }
                const targetUserEnvParentPermissions = (0, graph_1.getEnvParentPermissions)(state.graph, envParent.id, userId);
                if (graph_1.authz.canReadLocals(state.graph, userId, envParentId, localsUserId)) {
                    for (let deviceId of deviceIds) {
                        const pubkey = pubkeysByDeviceId[deviceId];
                        if (!pubkey) {
                            continue;
                        }
                        toVerifyKeyableIds.add(deviceId == "cli" ? userId : deviceId);
                        if (envSymmetricKey) {
                            toEncrypt.push([
                                [
                                    "users",
                                    userId,
                                    deviceId,
                                    envParentId,
                                    "locals",
                                    localsUserId,
                                    "env",
                                ],
                                {
                                    data: envSymmetricKey,
                                    pubkey,
                                    privkey,
                                },
                            ]);
                        }
                        if (metaSymmetricKey) {
                            toEncrypt.push([
                                [
                                    "users",
                                    userId,
                                    deviceId,
                                    envParentId,
                                    "locals",
                                    localsUserId,
                                    "meta",
                                ],
                                {
                                    data: metaSymmetricKey,
                                    pubkey,
                                    privkey,
                                },
                            ]);
                        }
                        if (graph_1.authz.canReadLocalsVersions(state.graph, userId, envParent.id, localsUserId)) {
                            if ((pending || initEnvs) &&
                                !reencryptChangesets &&
                                changesetsSymmetricKey) {
                                toEncrypt.push([
                                    [
                                        "users",
                                        userId,
                                        deviceId,
                                        envParentId,
                                        "locals",
                                        localsUserId,
                                        "changesets",
                                    ],
                                    {
                                        data: changesetsSymmetricKey,
                                        pubkey,
                                        privkey,
                                    },
                                ]);
                            }
                            else if (reencryptChangesets && changesetsToReencrypt) {
                                const path = [
                                    "users",
                                    userId,
                                    deviceId,
                                    envParentId,
                                    "locals",
                                    localsUserId,
                                    "changesets",
                                ];
                                toEncrypt.push([
                                    path,
                                    {
                                        data: changesetKeysByEnvironmentId[environmentId],
                                        pubkey,
                                        privkey,
                                    },
                                ]);
                            }
                        }
                    }
                }
            }
            else {
                const targetUserPermissions = (0, graph_1.getEnvironmentPermissions)(state.graph, environmentId, userId);
                const toEncryptKeys = [];
                if (targetUserPermissions.has("read") && envSymmetricKey) {
                    toEncryptKeys.push(["env", envSymmetricKey]);
                }
                if (targetUserPermissions.has("read_meta") && metaSymmetricKey) {
                    toEncryptKeys.push(["meta", metaSymmetricKey]);
                }
                if (targetUserPermissions.has("read_inherits") &&
                    inheritsSymmetricKey) {
                    toEncryptKeys.push(["inherits", inheritsSymmetricKey]);
                }
                for (let deviceId of deviceIds) {
                    const pubkey = pubkeysByDeviceId[deviceId];
                    if (!pubkey) {
                        continue;
                    }
                    toVerifyKeyableIds.add(deviceId == "cli" ? userId : deviceId);
                    for (let [envField, key] of toEncryptKeys) {
                        toEncrypt.push([
                            [
                                "users",
                                userId,
                                deviceId,
                                envParentId,
                                "environments",
                                environmentId,
                                envField,
                            ],
                            {
                                data: key,
                                pubkey,
                                privkey,
                            },
                        ]);
                    }
                    if (targetUserPermissions.has("read") &&
                        targetUserPermissions.has("read_history")) {
                        if ((pending || initEnvs) &&
                            !reencryptChangesets &&
                            changesetsSymmetricKey) {
                            toEncrypt.push([
                                [
                                    "users",
                                    userId,
                                    deviceId,
                                    envParentId,
                                    "environments",
                                    environmentId,
                                    "changesets",
                                ],
                                {
                                    data: changesetsSymmetricKey,
                                    pubkey,
                                    privkey,
                                },
                            ]);
                        }
                        else if (reencryptChangesets &&
                            changesetsToReencrypt &&
                            changesetsSymmetricKey) {
                            const path = [
                                "users",
                                userId,
                                deviceId,
                                envParentId,
                                "environments",
                                environmentId,
                                "changesets",
                            ];
                            toEncrypt.push([
                                path,
                                {
                                    data: changesetsSymmetricKey,
                                    pubkey,
                                    privkey,
                                },
                            ]);
                        }
                    }
                }
            }
        }
        let keyableParents = [];
        if (localsUserId) {
            if (envParent.type == "app") {
                keyableParents = keyableParents.concat((_f = (0, graph_1.getLocalKeysByLocalsComposite)(state.graph)[environmentId]) !== null && _f !== void 0 ? _f : []);
            }
            else if (envParent.type == "block") {
                const connectedApps = (0, graph_1.getConnectedAppsForBlock)(state.graph, envParent.id);
                for (let app of connectedApps) {
                    keyableParents = keyableParents.concat((_g = (0, graph_1.getLocalKeysByLocalsComposite)(state.graph)[app.id + "|" + localsUserId]) !== null && _g !== void 0 ? _g : []);
                }
            }
        }
        else if (environment) {
            let allEnvironmentIds = [
                environmentId,
                ...(0, graph_1.getConnectedEnvironments)(state.graph, environmentId).map(R.prop("id")),
            ];
            if (!environment.isSub) {
                allEnvironmentIds = [
                    ...allEnvironmentIds,
                    ...R.flatten(allEnvironmentIds.map((id) => {
                        var _a;
                        return ((_a = (0, graph_1.getSubEnvironmentsByParentEnvironmentId)(state.graph)[id]) !== null && _a !== void 0 ? _a : []).map(R.prop("id"));
                    })),
                ];
            }
            for (let id of allEnvironmentIds) {
                keyableParents = keyableParents.concat((_h = (0, graph_1.getLocalKeysByEnvironmentId)(state.graph)[id]) !== null && _h !== void 0 ? _h : []);
                keyableParents = keyableParents.concat((_j = (0, graph_1.getServersByEnvironmentId)(state.graph)[id]) !== null && _j !== void 0 ? _j : []);
            }
        }
        for (let keyableParent of keyableParents) {
            const generatedEnvkey = (0, graph_1.getActiveGeneratedEnvkeysByKeyableParentId)(state.graph)[keyableParent.id];
            if (!generatedEnvkey) {
                continue;
            }
            toVerifyKeyableIds.add(keyableParent.id);
            const basePath = [
                envParent.type == "block" ? "blockKeyableParents" : "keyableParents",
                envParent.type == "block" ? envParent.id : null,
                keyableParent.id,
                generatedEnvkey.id,
            ].filter(Boolean);
            if (keyableParent.type == "localKey" && localsUserId) {
                if (envSymmetricKey) {
                    const localOverridesPath = [...basePath, "localOverrides"];
                    toEncrypt.push([
                        [...localOverridesPath, "data"],
                        {
                            data: envSymmetricKey,
                            pubkey: generatedEnvkey.pubkey,
                            privkey,
                        },
                    ]);
                }
            }
            else if (environment) {
                // env or subenv
                if (environment.isSub) {
                    if (envSymmetricKey) {
                        toEncrypt.push([
                            [...basePath, "subEnv", "data"],
                            {
                                data: envSymmetricKey,
                                pubkey: generatedEnvkey.pubkey,
                                privkey,
                            },
                        ]);
                    }
                    if (parentEnvSymmetricKey) {
                        toEncrypt.push([
                            [...basePath, "env", "data"],
                            {
                                data: parentEnvSymmetricKey,
                                pubkey: generatedEnvkey.pubkey,
                                privkey,
                            },
                        ]);
                    }
                }
                else if (envSymmetricKey) {
                    toEncrypt.push([
                        [...basePath, "env", "data"],
                        {
                            data: envSymmetricKey,
                            pubkey: generatedEnvkey.pubkey,
                            privkey,
                        },
                    ]);
                }
            }
        }
    }
    // now generate keys for inheritance overrides if environments on either side of the relationship are being updated
    const inheritingEnvironmentIdsByEnvironmentId = {};
    const environmentIdsSet = new Set(environmentIds);
    const envParentIds = R.uniq(environmentIds
        .map((environmentId) => {
        const environment = state.graph[environmentId];
        return environment ? environment.envParentId : undefined;
    })
        .filter(Boolean));
    const baseEnvironmentsByEnvParentId = envParentIds.reduce((agg, envParentId) => {
        var _a;
        return (Object.assign(Object.assign({}, agg), { [envParentId]: ((_a = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[envParentId]) !== null && _a !== void 0 ? _a : []).filter((environment) => !environment.isSub) }));
    }, {});
    for (let envParentId of envParentIds) {
        const envParent = state.graph[envParentId];
        const baseEnvironments = baseEnvironmentsByEnvParentId[envParentId];
        const inheritingEnvironmentIdsByBaseEnvironmentId = {};
        const inheritingKeyableParentsByBaseEnvironmentId = {};
        for (let baseEnvironment of baseEnvironments) {
            const inheritingEnvironmentIds = new Set(((_k = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[envParentId]) !== null && _k !== void 0 ? _k : [])
                .filter((sibling) => sibling.id != baseEnvironment.id &&
                !(sibling.isSub &&
                    sibling.parentEnvironmentId == baseEnvironment.id))
                .map(R.prop("id")));
            inheritingEnvironmentIdsByBaseEnvironmentId[baseEnvironment.id] =
                inheritingEnvironmentIds;
            inheritingKeyableParentsByBaseEnvironmentId[baseEnvironment.id] =
                getInheritingKeyableParents({
                    state,
                    baseEnvironment,
                    inheritingEnvironmentIds,
                    environmentIdsSet,
                });
        }
        for (let baseEnvironment of baseEnvironments) {
            const inheritingEnvironmentIds = inheritingEnvironmentIdsByBaseEnvironmentId[baseEnvironment.id];
            inheritingEnvironmentIdsByEnvironmentId[baseEnvironment.id] =
                inheritingEnvironmentIds;
            addUserInheritanceOverrides({
                state,
                currentUserId: currentAuth.userId,
                baseEnvironment,
                inheritingEnvironmentIds,
                environmentIdsSet,
                envParentId,
                newKeysOnly,
                environmentKeysByComposite,
                toEncrypt,
                privkey,
                allUserIds,
                pending,
                now,
            });
            const inheritingKeyableParents = inheritingKeyableParentsByBaseEnvironmentId[baseEnvironment.id];
            addKeyableParentInheritanceOverrides({
                state,
                currentUserId: currentAuth.userId,
                baseEnvironment,
                inheritingKeyableParents,
                envParent,
                toVerifyKeyableIds,
                newKeysOnly,
                environmentKeysByComposite,
                toEncrypt,
                privkey,
                pending,
                addInheritingSubEnvironments: false,
            });
        }
        for (let baseEnvironment of baseEnvironments) {
            const inheritingKeyableParents = inheritingKeyableParentsByBaseEnvironmentId[baseEnvironment.id];
            addKeyableParentInheritanceOverrides({
                state,
                currentUserId: currentAuth.userId,
                baseEnvironment,
                inheritingKeyableParents,
                envParent,
                toVerifyKeyableIds,
                newKeysOnly,
                environmentKeysByComposite,
                toEncrypt,
                privkey,
                pending,
                addInheritingSubEnvironments: true,
            });
        }
    }
    // verify all keyables
    await Promise.all(Array.from(toVerifyKeyableIds).map((keyableId) => (0, trust_1.verifyOrgKeyable)(state, keyableId, context)));
    await (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
        payload: {
            processed: 0,
            total: toEncrypt.length,
            op: "encrypt",
            dataType: "keys",
        },
    }, context);
    // log("encryptedKeyParamsForEnvironments - starting encryption");
    let pathResults = [];
    let encryptedSinceStatusUpdate = 0;
    for (let batch of R.splitEvery(constants_1.CRYPTO_ASYMMETRIC_BATCH_SIZE, toEncrypt)) {
        const res = await Promise.all(batch.map(([path, params]) => (0, proxy_1.encrypt)(params).then((encrypted) => {
            encryptedSinceStatusUpdate++;
            if (encryptedSinceStatusUpdate >= constants_1.CRYPTO_ASYMMETRIC_STATUS_INTERVAL) {
                (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.CRYPTO_STATUS_INCREMENT,
                    payload: encryptedSinceStatusUpdate,
                }, context);
                encryptedSinceStatusUpdate = 0;
            }
            return [path, encrypted];
        })));
        await (0, wait_1.wait)(constants_1.CRYPTO_ASYMMETRIC_BATCH_DELAY_MS);
        pathResults = pathResults.concat(res);
    }
    // log("encryptedKeyParamsForEnvironments - encrypted all");
    await (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
        payload: undefined,
    }, context);
    for (let [path, data] of pathResults) {
        (0, lodash_set_1.default)(keys, path, data);
    }
    return {
        environmentKeysByComposite,
        changesetKeysByEnvironmentId,
        keys,
        environmentIdsSet,
        envParentIds,
        baseEnvironmentsByEnvParentId,
        inheritingEnvironmentIdsByEnvironmentId,
    };
};
exports.encryptedKeyParamsForEnvironments = encryptedKeyParamsForEnvironments;
const getInheritingKeyableParents = (params) => {
    var _a, _b;
    const { state, baseEnvironment, inheritingEnvironmentIds, environmentIdsSet, } = params;
    let inheritingKeyableParents = [];
    for (let inheritingEnvironmentId of inheritingEnvironmentIds) {
        const inheritingEnvironment = state.graph[inheritingEnvironmentId];
        if (!(environmentIdsSet.has(inheritingEnvironmentId) ||
            environmentIdsSet.has(baseEnvironment.id) ||
            (inheritingEnvironment.isSub &&
                environmentIdsSet.has(inheritingEnvironment.parentEnvironmentId)))) {
            continue;
        }
        let allInheritingEnvironmentIds = [
            inheritingEnvironmentId,
            ...(0, graph_1.getConnectedEnvironments)(state.graph, inheritingEnvironmentId).map(R.prop("id")),
        ];
        for (let id of allInheritingEnvironmentIds) {
            inheritingKeyableParents = inheritingKeyableParents.concat((_a = (0, graph_1.getLocalKeysByEnvironmentId)(state.graph)[id]) !== null && _a !== void 0 ? _a : []);
            inheritingKeyableParents = inheritingKeyableParents.concat((_b = (0, graph_1.getServersByEnvironmentId)(state.graph)[id]) !== null && _b !== void 0 ? _b : []);
        }
    }
    return inheritingKeyableParents;
};
const addUserInheritanceOverrides = (params) => {
    var _a;
    const { state, currentUserId, baseEnvironment, inheritingEnvironmentIds, environmentIdsSet, envParentId, newKeysOnly, environmentKeysByComposite, toEncrypt, privkey, allUserIds, pending, now, } = params;
    const org = (0, graph_1.getOrg)(state.graph);
    const nonEmptyInheritingEnvironmentIds = new Set((0, client_1.getInheritingEnvironmentIds)(state, {
        envParentId,
        environmentId: baseEnvironment.id,
    }, pending));
    for (let inheritingEnvironmentId of inheritingEnvironmentIds) {
        const inheritingEnvironment = state.graph[inheritingEnvironmentId];
        if (!(environmentIdsSet.has(inheritingEnvironmentId) ||
            environmentIdsSet.has(baseEnvironment.id) ||
            (inheritingEnvironment.isSub &&
                environmentIdsSet.has(inheritingEnvironment.parentEnvironmentId)))) {
            continue;
        }
        const currentUserBasePermissions = (0, graph_1.getEnvironmentPermissions)(state.graph, baseEnvironment.id, currentUserId);
        if (!currentUserBasePermissions.has("read")) {
            continue;
        }
        const isEmpty = !nonEmptyInheritingEnvironmentIds.has(inheritingEnvironmentId);
        const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
            environmentId: inheritingEnvironmentId,
            inheritsEnvironmentId: baseEnvironment.id,
        });
        const existing = (_a = state.envs[composite]) === null || _a === void 0 ? void 0 : _a.key;
        if (!(newKeysOnly && existing) &&
            (!org.optimizeEmptyEnvs || !isEmpty || existing)) {
            let inheritanceOverridesKey = (0, utils_1.symmetricEncryptionKey)();
            environmentKeysByComposite[composite] = inheritanceOverridesKey;
        }
        const key = environmentKeysByComposite[composite];
        if (key) {
            for (let userId of allUserIds) {
                const targetUserInheritingPermissions = (0, graph_1.getEnvironmentPermissions)(state.graph, inheritingEnvironmentId, userId);
                if (!targetUserInheritingPermissions.has("read")) {
                    continue;
                }
                const deviceIds = (0, graph_1.getDeviceIdsForUser)(state.graph, userId, now);
                const pubkeysByDeviceId = (0, graph_1.getPubkeysByDeviceIdForUser)(state.graph, userId, now);
                for (let deviceId of deviceIds) {
                    const pubkey = pubkeysByDeviceId[deviceId];
                    if (!pubkey) {
                        continue;
                    }
                    toEncrypt.push([
                        [
                            "users",
                            userId,
                            deviceId,
                            envParentId,
                            "environments",
                            inheritingEnvironmentId,
                            "inheritanceOverrides",
                            baseEnvironment.id,
                        ],
                        {
                            data: key,
                            pubkey,
                            privkey,
                        },
                    ]);
                }
            }
        }
    }
    return environmentKeysByComposite;
};
const addKeyableParentInheritanceOverrides = (params) => {
    var _a, _b;
    const { state, currentUserId, baseEnvironment, inheritingKeyableParents, envParent, toVerifyKeyableIds, newKeysOnly, environmentKeysByComposite, toEncrypt, privkey, addInheritingSubEnvironments, pending, } = params;
    const org = (0, graph_1.getOrg)(state.graph);
    const nonEmptyInheritingEnvironmentIds = new Set((0, client_1.getInheritingEnvironmentIds)(state, {
        envParentId: baseEnvironment.envParentId,
        environmentId: baseEnvironment.id,
    }, pending));
    for (let inheritingKeyableParent of inheritingKeyableParents) {
        const generatedEnvkey = (0, graph_1.getActiveGeneratedEnvkeysByKeyableParentId)(state.graph)[inheritingKeyableParent.id], inheritingKeyableParentEnvironment = state.graph[inheritingKeyableParent.environmentId];
        if (!generatedEnvkey) {
            continue;
        }
        const currentUserBasePermissions = (0, graph_1.getEnvironmentPermissions)(state.graph, baseEnvironment.id, currentUserId);
        if (!currentUserBasePermissions.has("read")) {
            continue;
        }
        const basePath = [
            envParent.type == "block" ? "blockKeyableParents" : "keyableParents",
            envParent.type == "block" ? envParent.id : null,
            inheritingKeyableParent.id,
            generatedEnvkey.id,
        ].filter(Boolean);
        let inheritingEnvironmentId;
        if (envParent.type == "block") {
            const blockEnvironment = (0, graph_1.getConnectedBlockEnvironmentsForApp)(state.graph, inheritingKeyableParentEnvironment.envParentId, envParent.id, inheritingKeyableParentEnvironment.id)[0];
            inheritingEnvironmentId = blockEnvironment.id;
        }
        else {
            inheritingEnvironmentId = inheritingKeyableParentEnvironment.id;
        }
        const inheritingEnvironment = state.graph[inheritingEnvironmentId];
        if ((addInheritingSubEnvironments && !inheritingEnvironment.isSub) ||
            (!addInheritingSubEnvironments && inheritingEnvironment.isSub)) {
            continue;
        }
        const isEmpty = !nonEmptyInheritingEnvironmentIds.has(inheritingEnvironmentId);
        toVerifyKeyableIds.add(inheritingKeyableParent.id);
        const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
            environmentId: inheritingEnvironmentId,
            inheritsEnvironmentId: baseEnvironment.id,
        });
        const existing = (_a = state.envs[composite]) === null || _a === void 0 ? void 0 : _a.key;
        if (!(newKeysOnly && existing) &&
            (!org.optimizeEmptyEnvs || !isEmpty || existing)) {
            const key = (_b = environmentKeysByComposite[composite]) !== null && _b !== void 0 ? _b : (0, utils_1.symmetricEncryptionKey)();
            environmentKeysByComposite[composite] = key;
            toEncrypt.push([
                [...basePath, "inheritanceOverrides", baseEnvironment.id, "data"],
                {
                    data: key,
                    pubkey: generatedEnvkey.pubkey,
                    privkey,
                },
            ]);
        }
    }
};
//# sourceMappingURL=encrypted_keys.js.map