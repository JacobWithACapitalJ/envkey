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
exports.encryptedKeyParamsForDeviceOrInvitee = void 0;
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const graph_1 = require("@envkey/core/lib/graph");
const blob_1 = require("@envkey/core/lib/blob");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const handler_1 = require("../../handler");
const lodash_set_1 = __importDefault(require("lodash.set"));
const constants_1 = require("./constants");
const wait_1 = require("@envkey/core/lib/utils/wait");
const encryptedKeyParamsForDeviceOrInvitee = async (params) => {
    // log("encryptedKeyParamsForDeviceOrInvitee");
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { state, privkey, pubkey, userId, accessParams, context } = params;
    let keys = {}, orgRoleId;
    if (userId) {
        ({ orgRoleId } = state.graph[userId]);
    }
    else if (accessParams) {
        orgRoleId = accessParams.orgRoleId;
    }
    else {
        throw new Error("Either userId or accessParams is required");
    }
    const orgPermissions = (0, graph_1.getOrgPermissions)(state.graph, orgRoleId), byType = (0, graph_1.graphTypes)(state.graph), allEnvironments = byType.environments, allEnvParents = [...byType.apps, ...byType.blocks], toEncrypt = [], inheritanceOverridesByEnvironmentId = R.groupBy(([composite]) => (0, blob_1.parseUserEncryptedKeyOrBlobComposite)(composite).environmentId, R.toPairs(state.envs).filter(([composite]) => (0, blob_1.parseUserEncryptedKeyOrBlobComposite)(composite).inheritsEnvironmentId));
    for (let environment of allEnvironments) {
        const environmentPermissions = (0, graph_1.getEnvironmentPermissions)(state.graph, environment.id, userId, accessParams);
        if (environmentPermissions.has("read")) {
            const key = (_a = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                environmentId: environment.id,
            })]) === null || _a === void 0 ? void 0 : _a.key;
            if (key) {
                toEncrypt.push([
                    [
                        "newDevice",
                        environment.envParentId,
                        "environments",
                        environment.id,
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
        if (environmentPermissions.has("read_meta")) {
            const key = (_b = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                environmentId: environment.id,
                envPart: "meta",
            })]) === null || _b === void 0 ? void 0 : _b.key;
            if (key) {
                toEncrypt.push([
                    [
                        "newDevice",
                        environment.envParentId,
                        "environments",
                        environment.id,
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
        if (environmentPermissions.has("read_inherits")) {
            const key = (_c = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                environmentId: environment.id,
                envPart: "inherits",
            })]) === null || _c === void 0 ? void 0 : _c.key;
            if (key) {
                toEncrypt.push([
                    [
                        "newDevice",
                        environment.envParentId,
                        "environments",
                        environment.id,
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
        if (environmentPermissions.has("read_history")) {
            const { key } = (_d = state.changesets[environment.id]) !== null && _d !== void 0 ? _d : {};
            if (key) {
                const path = [
                    "newDevice",
                    environment.envParentId,
                    "environments",
                    environment.id,
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
        if (environmentPermissions.has("read")) {
            // add any inheritanceOverrides for this environment
            const environmentInheritanceOverrides = (_e = inheritanceOverridesByEnvironmentId[environment.id]) !== null && _e !== void 0 ? _e : [];
            for (let [composite] of environmentInheritanceOverrides) {
                const { inheritsEnvironmentId } = (0, blob_1.parseUserEncryptedKeyOrBlobComposite)(composite);
                const key = state.envs[composite].key;
                if (key) {
                    toEncrypt.push([
                        [
                            "newDevice",
                            environment.envParentId,
                            "environments",
                            environment.id,
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
    for (let envParent of allEnvParents) {
        const envParentPermissions = (0, graph_1.getEnvParentPermissions)(state.graph, envParent.id, userId, accessParams);
        for (let localsUserId in envParent.localsUpdatedAtByUserId) {
            if (localsUserId == userId ||
                (envParent.type == "block" && orgPermissions.has("blocks_read_all")) ||
                envParentPermissions.has("app_read_user_locals")) {
                const environmentId = envParent.id + "|" + localsUserId;
                const key = (_f = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId,
                })]) === null || _f === void 0 ? void 0 : _f.key;
                const metaKey = (_g = state.envs[(0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId,
                    envPart: "meta",
                })]) === null || _g === void 0 ? void 0 : _g.key;
                if (key) {
                    toEncrypt.push([
                        ["newDevice", envParent.id, "locals", localsUserId, "env"],
                        {
                            data: key,
                            pubkey,
                            privkey,
                        },
                    ]);
                }
                if (metaKey) {
                    toEncrypt.push([
                        ["newDevice", envParent.id, "locals", localsUserId, "meta"],
                        {
                            data: metaKey,
                            pubkey,
                            privkey,
                        },
                    ]);
                }
            }
            if (localsUserId == userId ||
                (envParent.type == "block" && orgPermissions.has("blocks_read_all")) ||
                envParentPermissions.has("app_read_user_locals_history")) {
                const { key } = (_h = state.changesets[envParent.id + "|" + localsUserId]) !== null && _h !== void 0 ? _h : {};
                if (key) {
                    const path = [
                        "newDevice",
                        envParent.id,
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
    // log("encryptedKeyParamsForDeviceOrInvitee - got toEncrypt", {
    //   toEncrypt: toEncrypt.length,
    // });
    await (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
        payload: {
            processed: 0,
            total: toEncrypt.length,
            op: "encrypt",
            dataType: "keys",
        },
    }, context);
    // log("encryptedKeyParamsForDeviceOrInvitee - starting encryption");
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
    // log("encryptedKeyParamsForDeviceOrInvitee - encrypted all");
    await (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.SET_CRYPTO_STATUS,
        payload: undefined,
    }, context);
    for (let [path, data] of pathResults) {
        (0, lodash_set_1.default)(keys, path, data);
    }
    // log("encryptedKeyParamsForDeviceOrInvitee - set pathResults");
    // log("invites", { pathResults });
    return {
        keys,
        blobs: {},
    };
};
exports.encryptedKeyParamsForDeviceOrInvitee = encryptedKeyParamsForDeviceOrInvitee;
//# sourceMappingURL=invites.js.map