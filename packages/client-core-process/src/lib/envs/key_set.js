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
exports.encryptedKeyParamsForKeySet = exports.requiredEnvsForKeySet = exports.keySetForGraphProposal = void 0;
const immer_1 = __importDefault(require("immer"));
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const graph_1 = require("@envkey/core/lib/graph");
const blob_1 = require("@envkey/core/lib/blob");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const trust_1 = require("../trust");
const client_1 = require("@envkey/core/lib/client");
const lodash_set_1 = __importDefault(require("lodash.set"));
const handler_1 = require("../../handler");
const constants_1 = require("./constants");
const wait_1 = require("@envkey/core/lib/utils/wait");
const keySetForGraphProposal = (graph, now, producer, scope = "all") => {
    // log("keySetForGraphProposal", { scope });
    // const start = Date.now();
    const currentKeys = (0, graph_1.getCurrentEncryptedKeys)(graph, scope, now, true);
    // log("currentKeys " + (Date.now() - start).toString());
    const proposedGraph = (0, immer_1.default)(graph, producer);
    // log("proposedGraph " + (Date.now() - start).toString());
    const proposedKeys = (0, graph_1.getCurrentEncryptedKeys)(proposedGraph, scope, now, true);
    // log("proposedKeys " + (Date.now() - start).toString());
    const diff = (0, blob_1.keySetDifference)(proposedKeys, currentKeys);
    // log("got diff " + (Date.now() - start).toString());
    // log("keySetForGraphProposal finished " + (Date.now() - start).toString());
    return diff;
}, requiredEnvsForKeySet = (graph, toSet) => {
    const requiredEnvs = new Set(), requiredChangesets = new Set();
    if (toSet.users) {
        for (let userId in toSet.users) {
            for (let deviceId in toSet.users[userId]) {
                const deviceToSet = toSet.users[userId][deviceId];
                for (let envParentId in deviceToSet) {
                    const { environments, locals } = deviceToSet[envParentId];
                    if (environments) {
                        for (let environmentId in environments) {
                            const environmentToSet = environments[environmentId];
                            if (environmentToSet.env ||
                                environmentToSet.meta ||
                                environmentToSet.inherits) {
                                requiredEnvs.add(envParentId);
                            }
                            if (environmentToSet.changesets) {
                                requiredChangesets.add(envParentId);
                            }
                        }
                    }
                    if (locals) {
                        requiredEnvs.add(envParentId);
                    }
                }
            }
        }
    }
    if (toSet.blockKeyableParents) {
        for (let blockId in toSet.blockKeyableParents) {
            requiredEnvs.add(blockId);
        }
    }
    if (toSet.keyableParents) {
        for (let keyableParentId in toSet.keyableParents) {
            const keyableParent = graph[keyableParentId];
            requiredEnvs.add(keyableParent.appId);
        }
    }
    return {
        requiredEnvs,
        requiredChangesets,
    };
}, encryptedKeyParamsForKeySet = async (params) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    let state = params.state;
    const { context, toSet } = params, currentAuth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
    if (!currentAuth || !currentAuth.privkey) {
        throw new Error("Action requires authentication and decrypted privkey");
    }
    const privkey = currentAuth.privkey, toVerifyKeyableIds = new Set(), toEncrypt = [];
    let keys = {};
    if (toSet.keyableParents) {
        for (let keyableParentId in toSet.keyableParents) {
            toVerifyKeyableIds.add(keyableParentId);
            const keyableParent = state.graph[keyableParentId], environment = state.graph[keyableParent.environmentId];
            const generatedEnvkeyId = Object.keys(toSet.keyableParents[keyableParentId])[0], generatedEnvkey = state.graph[generatedEnvkeyId], envkeyToSet = toSet.keyableParents[keyableParentId][generatedEnvkeyId];
            if (envkeyToSet.env) {
                const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId: environment.isSub
                        ? environment.parentEnvironmentId
                        : environment.id,
                });
                const key = (_a = state.envs[composite]) === null || _a === void 0 ? void 0 : _a.key;
                if (key) {
                    toEncrypt.push([
                        [
                            "keyableParents",
                            keyableParent.id,
                            generatedEnvkey.id,
                            "env",
                            "data",
                        ],
                        {
                            data: key,
                            pubkey: generatedEnvkey.pubkey,
                            privkey,
                        },
                    ]);
                }
            }
            if (envkeyToSet.subEnv) {
                const key = (_b = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId: environment.id,
                })]) === null || _b === void 0 ? void 0 : _b.key;
                if (key) {
                    toEncrypt.push([
                        [
                            "keyableParents",
                            keyableParent.id,
                            generatedEnvkey.id,
                            "subEnv",
                            "data",
                        ],
                        {
                            data: key,
                            pubkey: generatedEnvkey.pubkey,
                            privkey,
                        },
                    ]);
                }
            }
            if (envkeyToSet.localOverrides && keyableParent.type == "localKey") {
                const key = (_c = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId: keyableParent.appId + "|" + keyableParent.userId,
                })]) === null || _c === void 0 ? void 0 : _c.key;
                if (key) {
                    toEncrypt.push([
                        [
                            "keyableParents",
                            keyableParent.id,
                            generatedEnvkey.id,
                            "localOverrides",
                            "data",
                        ],
                        {
                            data: key,
                            pubkey: generatedEnvkey.pubkey,
                            privkey,
                        },
                    ]);
                }
            }
            // inheritance overrides
            if (envkeyToSet.inheritanceOverrides) {
                for (let inheritanceOverridesEnvironmentId of envkeyToSet.inheritanceOverrides) {
                    const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                        environmentId: keyableParent.environmentId,
                        inheritsEnvironmentId: inheritanceOverridesEnvironmentId,
                    });
                    let key = (_d = state.envs[composite]) === null || _d === void 0 ? void 0 : _d.key;
                    if (key) {
                        toEncrypt.push([
                            [
                                "keyableParents",
                                keyableParent.id,
                                generatedEnvkey.id,
                                "inheritanceOverrides",
                                inheritanceOverridesEnvironmentId,
                                "data",
                            ],
                            {
                                data: key,
                                pubkey: generatedEnvkey.pubkey,
                                privkey,
                            },
                        ]);
                    }
                }
            }
        }
    }
    if (toSet.blockKeyableParents) {
        for (let blockId in toSet.blockKeyableParents) {
            for (let keyableParentId in toSet.blockKeyableParents[blockId]) {
                toVerifyKeyableIds.add(keyableParentId);
                const keyableParent = state.graph[keyableParentId], appEnvironment = state.graph[keyableParent.environmentId], blockEnvironment = (0, graph_1.getConnectedBlockEnvironmentsForApp)(state.graph, keyableParent.appId, blockId, appEnvironment.id)[0];
                const generatedEnvkeyId = Object.keys(toSet.blockKeyableParents[blockId][keyableParentId])[0], generatedEnvkey = state.graph[generatedEnvkeyId], envkeyToSet = toSet.blockKeyableParents[blockId][keyableParentId][generatedEnvkeyId];
                if (envkeyToSet.env) {
                    const key = (_e = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                        environmentId: blockEnvironment.isSub
                            ? blockEnvironment.parentEnvironmentId
                            : blockEnvironment.id,
                    })]) === null || _e === void 0 ? void 0 : _e.key;
                    if (key) {
                        toEncrypt.push([
                            [
                                "blockKeyableParents",
                                blockId,
                                keyableParent.id,
                                generatedEnvkey.id,
                                "env",
                                "data",
                            ],
                            {
                                data: key,
                                pubkey: generatedEnvkey.pubkey,
                                privkey,
                            },
                        ]);
                    }
                }
                if (envkeyToSet.subEnv && blockEnvironment.isSub) {
                    const key = (_f = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                        environmentId: blockEnvironment.id,
                    })]) === null || _f === void 0 ? void 0 : _f.key;
                    if (key) {
                        toEncrypt.push([
                            [
                                "blockKeyableParents",
                                blockId,
                                keyableParent.id,
                                generatedEnvkey.id,
                                "subEnv",
                                "data",
                            ],
                            {
                                data: key,
                                pubkey: generatedEnvkey.pubkey,
                                privkey,
                            },
                        ]);
                    }
                }
                if (envkeyToSet.localOverrides && keyableParent.type == "localKey") {
                    const key = (_g = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                        environmentId: blockId + "|" + keyableParent.userId,
                    })]) === null || _g === void 0 ? void 0 : _g.key;
                    if (key) {
                        toEncrypt.push([
                            [
                                "blockKeyableParents",
                                blockId,
                                keyableParent.id,
                                generatedEnvkey.id,
                                "localOverrides",
                                "data",
                            ],
                            {
                                data: key,
                                pubkey: generatedEnvkey.pubkey,
                                privkey,
                            },
                        ]);
                    }
                }
                // inheritance overrides
                if (envkeyToSet.inheritanceOverrides) {
                    for (let inheritanceOverridesEnvironmentId of envkeyToSet.inheritanceOverrides) {
                        const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                            environmentId: blockEnvironment.id,
                            inheritsEnvironmentId: inheritanceOverridesEnvironmentId,
                        });
                        let key = (_h = state.envs[composite]) === null || _h === void 0 ? void 0 : _h.key;
                        if (key) {
                            toEncrypt.push([
                                [
                                    "blockKeyableParents",
                                    blockId,
                                    keyableParent.id,
                                    generatedEnvkey.id,
                                    "inheritanceOverrides",
                                    inheritanceOverridesEnvironmentId,
                                    "data",
                                ],
                                {
                                    data: key,
                                    pubkey: generatedEnvkey.pubkey,
                                    privkey,
                                },
                            ]);
                        }
                    }
                }
            }
        }
    }
    if (toSet.users) {
        for (let userId in toSet.users) {
            const user = state.graph[userId];
            if (user.type == "cliUser") {
                toVerifyKeyableIds.add(userId);
            }
            for (let deviceId in toSet.users[userId]) {
                let pubkey;
                if (deviceId == "cli" && user.type == "cliUser") {
                    pubkey = user.pubkey;
                }
                else {
                    pubkey = state.graph[deviceId].pubkey;
                    toVerifyKeyableIds.add(deviceId);
                }
                const deviceToSet = toSet.users[userId][deviceId];
                for (let envParentId in deviceToSet) {
                    const { environments, locals } = deviceToSet[envParentId];
                    if (environments) {
                        for (let environmentId in environments) {
                            const environmentToSet = environments[environmentId];
                            if (environmentToSet.env) {
                                const key = (_j = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({ environmentId })]) === null || _j === void 0 ? void 0 : _j.key;
                                if (key) {
                                    toEncrypt.push([
                                        [
                                            "users",
                                            userId,
                                            deviceId,
                                            envParentId,
                                            "environments",
                                            environmentId,
                                            "env",
                                        ],
                                        {
                                            data: key,
                                            pubkey,
                                            privkey,
                                        },
                                    ]);
                                }
                            }
                            if (environmentToSet.meta) {
                                const key = (_k = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                                    environmentId,
                                    envPart: "meta",
                                })]) === null || _k === void 0 ? void 0 : _k.key;
                                if (key) {
                                    toEncrypt.push([
                                        [
                                            "users",
                                            userId,
                                            deviceId,
                                            envParentId,
                                            "environments",
                                            environmentId,
                                            "meta",
                                        ],
                                        {
                                            data: key,
                                            pubkey,
                                            privkey,
                                        },
                                    ]);
                                }
                            }
                            if (environmentToSet.inherits) {
                                const key = (_l = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                                    environmentId,
                                    envPart: "inherits",
                                })]) === null || _l === void 0 ? void 0 : _l.key;
                                if (key) {
                                    toEncrypt.push([
                                        [
                                            "users",
                                            userId,
                                            deviceId,
                                            envParentId,
                                            "environments",
                                            environmentId,
                                            "inherits",
                                        ],
                                        {
                                            data: key,
                                            pubkey,
                                            privkey,
                                        },
                                    ]);
                                }
                            }
                            if (environmentToSet.changesets) {
                                const { key } = (_m = state.changesets[environmentId]) !== null && _m !== void 0 ? _m : {};
                                if (key) {
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
                                            data: key,
                                            pubkey,
                                            privkey,
                                        },
                                    ]);
                                }
                            }
                            // inheritance overrides
                            if (environmentToSet.inheritanceOverrides) {
                                for (let inheritsEnvironmentId of environmentToSet.inheritanceOverrides) {
                                    const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                                        environmentId,
                                        inheritsEnvironmentId,
                                    });
                                    const key = (_o = state.envs[composite]) === null || _o === void 0 ? void 0 : _o.key;
                                    if (key) {
                                        toEncrypt.push([
                                            [
                                                "users",
                                                userId,
                                                deviceId,
                                                envParentId,
                                                "environments",
                                                environmentId,
                                                "inheritanceOverrides",
                                                inheritsEnvironmentId,
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
                    }
                    if (locals) {
                        for (let localsUserId in locals) {
                            const environmentId = envParentId + "|" + localsUserId;
                            const localsToSet = locals[localsUserId];
                            if (localsToSet.env) {
                                const key = (_p = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                                    environmentId,
                                })]) === null || _p === void 0 ? void 0 : _p.key;
                                if (key) {
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
                                            data: key,
                                            pubkey,
                                            privkey,
                                        },
                                    ]);
                                }
                            }
                            if (localsToSet.meta) {
                                const key = (_q = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                                    environmentId,
                                    envPart: "meta",
                                })]) === null || _q === void 0 ? void 0 : _q.key;
                                if (key) {
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
                                            data: key,
                                            pubkey,
                                            privkey,
                                        },
                                    ]);
                                }
                            }
                            if (localsToSet.changesets) {
                                const { key } = (_r = state.changesets[envParentId + "|" + localsUserId]) !== null && _r !== void 0 ? _r : {};
                                if (key) {
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
                                            data: key,
                                            pubkey,
                                            privkey,
                                        },
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
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
    // log("encryptedKeyParamsForKeySet - starting encryption");
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
    // log("encryptedKeyParamsForKeySet - encrypted all");
    await (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
        payload: undefined,
    }, context);
    // log("key_set", { keyPathResults });
    for (let [path, data] of pathResults) {
        (0, lodash_set_1.default)(keys, path, data);
    }
    let encryptedByTrustChain;
    const hasKeyables = Object.keys((_s = toSet.keyableParents) !== null && _s !== void 0 ? _s : {}).length +
        Object.keys((_t = toSet.blockKeyableParents) !== null && _t !== void 0 ? _t : {}).length >
        0;
    if (hasKeyables) {
        const trustChain = (0, client_1.getTrustChain)(state, currentAuth.type == "clientUserAuth"
            ? currentAuth.deviceId
            : currentAuth.userId);
        encryptedByTrustChain = await (0, proxy_1.signJson)({
            data: trustChain,
            privkey,
        });
    }
    return {
        keys,
        blobs: {},
        encryptedByTrustChain: encryptedByTrustChain
            ? { data: encryptedByTrustChain }
            : undefined,
    };
};
exports.keySetForGraphProposal = keySetForGraphProposal, exports.requiredEnvsForKeySet = requiredEnvsForKeySet, exports.encryptedKeyParamsForKeySet = encryptedKeyParamsForKeySet;
//# sourceMappingURL=key_set.js.map