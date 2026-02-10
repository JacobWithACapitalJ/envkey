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
exports.isValidEmptyVal = exports.getUpdatedEnvironmentIdsForBlobSet = exports.getUpdatedEnvironmentIdsForKeySet = exports.filterKeySetByBlobPaths = exports.parseUserEncryptedKeyOrBlobComposite = exports.getUserEncryptedKeyOrBlobComposite = exports.getGeneratedEnvkeyEncryptedKeyOrBlobComposite = exports.getBlobParamsEnvironmentAndLocalIds = exports.getBlobParamsEnvParentIds = exports.mergeKeySets = exports.keySetEmpty = exports.keySetIsSubset = exports.keySetIntersection = exports.keySetDifference = exports.encryptedBlobPkey = exports.getSkey = exports.getScope = exports.getSkeyOrScope = exports.userEncryptedKeyPkey = void 0;
const object_1 = require("../utils/object");
const lodash_set_1 = __importDefault(require("lodash.set"));
const R = __importStar(require("ramda"));
const g = __importStar(require("../graph"));
const userEncryptedKeyPkey = (params) => [
    "encryptedKeys",
    ...R.props(["orgId", "userId", "deviceId"], params).filter(Boolean),
].join("|"), getSkeyOrScope = (params) => {
    const path = [];
    if (params.blobType) {
        path.push(params.blobType);
    }
    if (params.blobType && params.envParentId) {
        path.push(params.envParentId);
        if (params.blobType == "env") {
            if (params.environmentId) {
                path.push(params.environmentId);
                if (params.envPart) {
                    path.push(params.envPart);
                    if ("envType" in params) {
                        path.push(params.envType);
                        if (params.envType == "inheritanceOverrides") {
                            path.push(params.inheritsEnvironmentId);
                        }
                    }
                }
            }
        }
        else if (params.environmentId) {
            path.push(params.environmentId);
        }
        if (params.blobType == "changeset" && "id" in params && params.id) {
            path.push(params.id);
        }
    }
    return path.join("|") || undefined;
}, getScope = (params) => (0, exports.getSkeyOrScope)(params), getSkey = (params) => (0, exports.getSkeyOrScope)(params), encryptedBlobPkey = (params) => ["encryptedBlobs", params.orgId].join("|"), keySetDifference = (set1, set2) => {
    return Object.assign(Object.assign({}, (0, object_1.objectDifference)(set1, set2)), { type: "keySet" });
}, keySetIntersection = (set1, set2) => {
    return Object.assign(Object.assign({}, (0, object_1.objectIntersection)(set1, set2)), { type: "keySet" });
}, keySetIsSubset = (maybeSubset, maybeSuperset) => !R.equals((0, exports.keySetDifference)(maybeSubset, maybeSuperset), {
    type: "keySet",
}), keySetEmpty = (keySet) => R.equals(keySet, { type: "keySet" }), mergeKeySets = (res1, res2) => R.mergeDeepWith((l, r) => Array.isArray(l) && Array.isArray(r)
    ? Array.from(new Set([...l, ...r]))
    : r, res1, res2), getBlobParamsEnvParentIds = (blobs) => {
    const envParentIds = new Set();
    for (let envParentId in blobs) {
        envParentIds.add(envParentId);
    }
    return envParentIds;
}, getBlobParamsEnvironmentAndLocalIds = (blobs) => {
    const ids = new Set();
    for (let envParentId in blobs) {
        const { environments, locals } = blobs[envParentId];
        if (environments) {
            for (let environmentId in environments) {
                ids.add(environmentId);
            }
        }
        if (locals) {
            for (let localsUserId in locals) {
                ids.add([envParentId, localsUserId].join("|"));
            }
        }
    }
    return ids;
}, getGeneratedEnvkeyEncryptedKeyOrBlobComposite = ({ blockId, environmentId, envType, inheritsEnvironmentId, }) => [blockId, environmentId, envType, inheritsEnvironmentId]
    .filter(Boolean)
    .join("||"), getUserEncryptedKeyOrBlobComposite = ({ environmentId, envPart, inheritsEnvironmentId, }) => [environmentId, envPart !== null && envPart !== void 0 ? envPart : "env", inheritsEnvironmentId]
    .filter(Boolean)
    .join("||"), parseUserEncryptedKeyOrBlobComposite = (composite) => {
    const [environmentId, envPart, inheritsEnvironmentId] = composite.split("||");
    return {
        environmentId,
        inheritsEnvironmentId,
        envPart,
    };
}, filterKeySetByBlobPaths = (graph, keySet, blobPaths) => {
    let filteredKeySet = { type: "keySet" };
    if (keySet.users) {
        for (let userId in keySet.users) {
            for (let deviceId in keySet.users[userId]) {
                const paths = (0, object_1.objectPaths)(keySet.users[userId][deviceId]);
                const filtered = paths.filter((path) => blobPaths.has(path.join("|")));
                for (let path of filtered) {
                    (0, lodash_set_1.default)(filteredKeySet, ["users", userId, deviceId, ...path], true);
                }
            }
        }
    }
    if (keySet.blockKeyableParents) {
        for (let blockId in keySet.blockKeyableParents) {
            for (let keyableParentId in keySet.blockKeyableParents[blockId]) {
                const keyableParent = graph[keyableParentId];
                const [blockEnvironment] = g.getConnectedBlockEnvironmentsForApp(graph, keyableParent.appId, blockId, keyableParent.environmentId);
                if (blobPaths.has([blockId, "environments", blockEnvironment.id, "env"].join("|")) ||
                    (keyableParent.type == "localKey" &&
                        blobPaths.has([blockId, "locals", keyableParent.userId, "env"].join("|")))) {
                    (0, lodash_set_1.default)(filteredKeySet, ["blockKeyableParents", blockId, keyableParent.id], true);
                }
            }
        }
    }
    if (keySet.keyableParents) {
        for (let keyableParentId in keySet.keyableParents) {
            const keyableParent = graph[keyableParentId];
            if (blobPaths.has([
                keyableParent.appId,
                "environments",
                keyableParent.environmentId,
                "env",
            ].join("|")) ||
                (keyableParent.type == "localKey" &&
                    blobPaths.has([keyableParent.appId, "locals", keyableParent.userId, "env"].join("|")))) {
                (0, lodash_set_1.default)(filteredKeySet, ["keyableParents", keyableParent.id], true);
            }
        }
    }
    return filteredKeySet;
}, getUpdatedEnvironmentIdsForKeySet = (keySet) => {
    const environmentIds = new Set();
    if (keySet.users) {
        for (let userId in keySet.users) {
            for (let deviceId in keySet.users[userId]) {
                for (let envParentId in keySet.users[userId][deviceId]) {
                    const { environments, locals } = keySet.users[userId][deviceId][envParentId];
                    for (let environmentId in environments !== null && environments !== void 0 ? environments : {}) {
                        environmentIds.add(environmentId);
                    }
                    for (let userId in locals !== null && locals !== void 0 ? locals : {}) {
                        environmentIds.add([envParentId, userId].join("|"));
                    }
                }
            }
        }
    }
    return Array.from(environmentIds);
}, getUpdatedEnvironmentIdsForBlobSet = (blobSet) => {
    const environmentIds = new Set();
    for (let envParentId in blobSet) {
        const { environments, locals } = blobSet[envParentId];
        for (let environmentId in environments !== null && environments !== void 0 ? environments : {}) {
            environmentIds.add(environmentId);
        }
        for (let userId in locals !== null && locals !== void 0 ? locals : {}) {
            environmentIds.add([envParentId, userId].join("|"));
        }
    }
    return Array.from(environmentIds);
};
exports.userEncryptedKeyPkey = userEncryptedKeyPkey, exports.getSkeyOrScope = getSkeyOrScope, exports.getScope = getScope, exports.getSkey = getSkey, exports.encryptedBlobPkey = encryptedBlobPkey, exports.keySetDifference = keySetDifference, exports.keySetIntersection = keySetIntersection, exports.keySetIsSubset = keySetIsSubset, exports.keySetEmpty = keySetEmpty, exports.mergeKeySets = mergeKeySets, exports.getBlobParamsEnvParentIds = getBlobParamsEnvParentIds, exports.getBlobParamsEnvironmentAndLocalIds = getBlobParamsEnvironmentAndLocalIds, exports.getGeneratedEnvkeyEncryptedKeyOrBlobComposite = getGeneratedEnvkeyEncryptedKeyOrBlobComposite, exports.getUserEncryptedKeyOrBlobComposite = getUserEncryptedKeyOrBlobComposite, exports.parseUserEncryptedKeyOrBlobComposite = parseUserEncryptedKeyOrBlobComposite, exports.filterKeySetByBlobPaths = filterKeySetByBlobPaths, exports.getUpdatedEnvironmentIdsForKeySet = getUpdatedEnvironmentIdsForKeySet, exports.getUpdatedEnvironmentIdsForBlobSet = getUpdatedEnvironmentIdsForBlobSet;
const emptyVals = [
    JSON.stringify({}),
    JSON.stringify({ variables: {}, inherits: {} }),
    JSON.stringify({ inherits: {}, variables: {} }),
    JSON.stringify({ variables: {} }),
    JSON.stringify({ inherits: {} }),
];
const isValidEmptyVal = (json) => emptyVals.includes(json);
exports.isValidEmptyVal = isValidEmptyVal;
//# sourceMappingURL=index.js.map