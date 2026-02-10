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
exports.getEnvWithMetaCellDisplay = exports.getCurrentUserEntryKeysSet = exports.getCurrentUserEntryKeys = exports.getCurrentUserEnv = exports.changesetsNeedFetch = exports.envsNeedFetch = exports.ensureChangesetsFetched = exports.ensureEnvsFetched = exports.getDiffsByKey = exports.getPendingUpdateDetails = exports.getPendingInheritingEnvironmentIds = exports.getInheritingEnvironmentIds = exports.getPendingInheritanceChain = exports.getInheritanceChain = exports.getEnvInheritsForVariables = exports.getPendingInheritanceOverrides = exports.getInheritanceOverrides = exports.getPendingKeyableEnv = exports.getRawEnvWithAncestors = exports.getRawEnv = exports.getKeyableEnv = exports.getEarliestEnvUpdatePendingAt = exports.getPendingActionsByEnvironmentId = exports.getPendingEnvironmentIds = exports.getPendingInherits = exports.getEnvInherits = exports.getPendingEnvMeta = exports.getEnvMetaOnly = exports.getPendingActions = exports.getPendingEnvWithMeta = exports.getEnvWithMeta = void 0;
const pick_1 = require("../utils/pick");
const memoize_1 = __importDefault(require("../utils/memoize"));
const utils_1 = require("../crypto/utils");
const versions_1 = require("./versions");
const R = __importStar(require("ramda"));
const blob_1 = require("../blob");
const graph_1 = require("../graph");
const array_1 = require("../utils/array");
const getPendingEnvWithMeta = (state, params, memoBuster) => (0, exports.getEnvWithMeta)(state, params, true, memoBuster), getPendingActions = (state, params) => state.pendingEnvUpdates.filter(({ meta }) => params.envParentId == meta.envParentId &&
    meta.environmentId == params.environmentId), getEnvMetaOnly = (state, params, pending) => R.evolve({
    variables: R.mapObjIndexed((0, pick_1.pick)([
        "inheritsEnvironmentId",
        "isEmpty",
        "isUndefined",
    ])),
}, (pending ? exports.getPendingEnvWithMeta : exports.getEnvWithMeta)(state, params)), getEnvInherits = (state, params, pending) => (0, pick_1.pick)(["inherits"], (pending ? exports.getPendingEnvWithMeta : exports.getEnvWithMeta)(state, params)), getEarliestEnvUpdatePendingAt = (state, envParentOrEnvironmentId) => {
    let earliest;
    const pending = envParentOrEnvironmentId
        ? state.pendingEnvUpdates.filter(({ meta }) => meta.envParentId == envParentOrEnvironmentId ||
            meta.environmentId == envParentOrEnvironmentId)
        : state.pendingEnvUpdates;
    for (let { meta: { pendingAt }, } of pending) {
        if (!earliest || pendingAt < earliest) {
            earliest = pendingAt;
        }
    }
    return earliest;
}, getKeyableEnv = (state, params, pending) => (pending ? exports.getPendingEnvWithMeta : exports.getEnvWithMeta)(state, params).variables, getInheritanceOverrides = (state, params, pending) => {
    var _a;
    let res = {};
    const keyableEnv = (0, exports.getKeyableEnv)(state, params, pending);
    const environment = state.graph[params.environmentId];
    for (let k in keyableEnv) {
        let { inheritsEnvironmentId: currentInheritsEnvironmentId } = keyableEnv[k];
        while (currentInheritsEnvironmentId) {
            const inheritsKeyableEnv = (0, exports.getKeyableEnv)(state, {
                envParentId: params.envParentId,
                environmentId: currentInheritsEnvironmentId,
            }, pending);
            let inheritsKeyableVal = inheritsKeyableEnv[k];
            if (!inheritsKeyableVal || R.isEmpty(inheritsKeyableVal)) {
                const composite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
                    environmentId: params.environmentId,
                    inheritsEnvironmentId: currentInheritsEnvironmentId,
                });
                const inheritanceOverrides = (_a = state.envs[composite]) === null || _a === void 0 ? void 0 : _a.env;
                if (inheritanceOverrides) {
                    inheritsKeyableVal = inheritanceOverrides[k];
                }
            }
            if ((!inheritsKeyableVal || R.isEmpty(inheritsKeyableVal)) &&
                environment.isSub) {
                inheritsKeyableVal = { isUndefined: true };
            }
            if (inheritsKeyableVal) {
                res = R.assocPath([currentInheritsEnvironmentId, k], inheritsKeyableVal, res);
            }
            currentInheritsEnvironmentId =
                inheritsKeyableVal === null || inheritsKeyableVal === void 0 ? void 0 : inheritsKeyableVal.inheritsEnvironmentId;
        }
    }
    if (params.forInheritsEnvironmentId &&
        res[params.forInheritsEnvironmentId]) {
        res = (0, pick_1.pick)([params.forInheritsEnvironmentId], res);
    }
    return res;
}, getPendingInheritanceOverrides = (state, params) => (0, exports.getInheritanceOverrides)(state, params, true), getEnvInheritsForVariables = (variables) => {
    var _a;
    const inherits = {};
    for (let k in variables) {
        if (!variables[k]) {
            continue;
        }
        const inheritsEnvironmentId = variables[k].inheritsEnvironmentId;
        if (inheritsEnvironmentId) {
            inherits[inheritsEnvironmentId] = ((_a = inherits[inheritsEnvironmentId]) !== null && _a !== void 0 ? _a : []).concat([k]);
        }
    }
    return inherits;
}, getInheritanceChain = (state, params, pending) => {
    var _a, _b, _c, _d;
    const startEnvironment = state.graph[params.environmentId];
    let currentEnvironmentId;
    if ("key" in params) {
        let keyableEnv = (0, exports.getKeyableEnv)(state, params, pending);
        if (startEnvironment.isSub) {
            keyableEnv = R.mergeDeepRight((0, exports.getKeyableEnv)(state, Object.assign(Object.assign({}, params), { environmentId: startEnvironment.parentEnvironmentId }), pending), keyableEnv);
        }
        currentEnvironmentId = (_a = keyableEnv[params.key]) === null || _a === void 0 ? void 0 : _a.inheritsEnvironmentId;
    }
    else {
        currentEnvironmentId =
            (_b = params.newEntryVals[params.environmentId]) === null || _b === void 0 ? void 0 : _b.inheritsEnvironmentId;
    }
    if (!currentEnvironmentId) {
        return [];
    }
    const chain = [currentEnvironmentId];
    while (true) {
        const currentEnvironment = state.graph[currentEnvironmentId];
        if (!currentEnvironment) {
            break;
        }
        if ("key" in params) {
            let keyableEnv = (0, exports.getKeyableEnv)(state, Object.assign(Object.assign({}, params), { environmentId: currentEnvironmentId }), pending);
            if (currentEnvironment.isSub) {
                keyableEnv = R.mergeDeepRight((0, exports.getKeyableEnv)(state, Object.assign(Object.assign({}, params), { environmentId: currentEnvironment.parentEnvironmentId }), pending), keyableEnv);
            }
            currentEnvironmentId = (_c = keyableEnv[params.key]) === null || _c === void 0 ? void 0 : _c.inheritsEnvironmentId;
        }
        else {
            currentEnvironmentId =
                (_d = params.newEntryVals[currentEnvironmentId]) === null || _d === void 0 ? void 0 : _d.inheritsEnvironmentId;
        }
        if (currentEnvironmentId) {
            chain.push(currentEnvironmentId);
        }
        else {
            break;
        }
    }
    return chain;
}, getPendingInheritanceChain = (state, params) => (0, exports.getInheritanceChain)(state, params, true), getInheritingEnvironmentIds = (state, params, pending) => {
    var _a;
    const inheritingEnvironmentIds = new Set(), siblings = ((_a = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[params.envParentId]) !== null && _a !== void 0 ? _a : []).filter(({ id }) => id != params.environmentId);
    for (let sibling of siblings) {
        let siblingEnvWithMeta = (pending ? exports.getPendingEnvWithMeta : exports.getEnvWithMeta)(state, Object.assign(Object.assign({}, params), { environmentId: sibling.id }));
        if (sibling.isSub) {
            siblingEnvWithMeta = R.mergeDeepRight((pending ? exports.getPendingEnvWithMeta : exports.getEnvWithMeta)(state, Object.assign(Object.assign({}, params), { environmentId: sibling.parentEnvironmentId })), siblingEnvWithMeta);
        }
        if ("newEntryVals" in params) {
            const chain = (0, exports.getInheritanceChain)(state, Object.assign(Object.assign({}, params), { environmentId: sibling.id }), pending);
            if (chain.includes(params.environmentId)) {
                inheritingEnvironmentIds.add(sibling.id);
            }
        }
        else {
            const keys = "entryKey" in params && params.entryKey
                ? [params.entryKey]
                : Object.keys(siblingEnvWithMeta.variables);
            for (let key of keys) {
                const chain = (0, exports.getInheritanceChain)(state, Object.assign(Object.assign({}, params), { environmentId: sibling.id, key }), pending);
                if (chain.includes(params.environmentId)) {
                    inheritingEnvironmentIds.add(sibling.id);
                }
            }
        }
    }
    return inheritingEnvironmentIds;
}, getPendingInheritingEnvironmentIds = (state, params) => (0, exports.getInheritingEnvironmentIds)(state, params, true), getPendingUpdateDetails = (state, params = {}) => {
    const apps = new Set(), appEnvironments = new Set(), appPaths = new Set(), blocks = new Set(), blockPaths = new Set(), blockEnvironments = new Set();
    const pendingEnvUpdates = state.pendingEnvUpdates, filteredUpdates = pendingEnvUpdates.filter(({ meta }) => {
        const envParent = state.graph[meta.envParentId];
        if (!envParent) {
            return false;
        }
        const environment = state.graph[meta.environmentId];
        if (!environment) {
            const [envParentId, localsUserId] = meta.environmentId.split("|");
            if (!envParentId ||
                !localsUserId ||
                !state.graph[envParentId] ||
                !state.graph[localsUserId]) {
                return false;
            }
        }
        return (!(0, graph_1.getEnvironmentOrLocalsAutoCommitEnabled)(state.graph, meta.environmentId) &&
            (!params.envParentIds || params.envParentIds.has(meta.envParentId)) &&
            (!params.environmentIds ||
                params.environmentIds.has(meta.environmentId)) &&
            (!params.entryKeys ||
                R.any((k) => { var _a, _b; return (_b = (_a = params.entryKeys) === null || _a === void 0 ? void 0 : _a.has(k)) !== null && _b !== void 0 ? _b : false; }, meta.entryKeys)));
    }), diffsByEnvironmentId = {}, pendingLocalIds = R.uniq(pendingEnvUpdates
        .filter(({ meta }) => meta.environmentId.includes("|"))
        .map(({ meta }) => meta.environmentId));
    for (let { meta } of filteredUpdates) {
        const envParent = state.graph[meta.envParentId];
        if (!diffsByEnvironmentId[meta.environmentId]) {
            const current = (0, exports.getEnvWithMeta)(state, meta).variables;
            const pending = (0, exports.getPendingEnvWithMeta)(state, meta).variables;
            const byKey = (0, exports.getDiffsByKey)(current, pending, params.entryKeys);
            const hasDiffs = Object.keys(byKey).length > 0;
            if (hasDiffs) {
                diffsByEnvironmentId[meta.environmentId] = byKey;
            }
        }
        const byKey = diffsByEnvironmentId[meta.environmentId];
        if (byKey && Object.keys(byKey).length) {
            if (envParent.type == "app") {
                apps.add(envParent.id);
                appEnvironments.add(meta.environmentId);
                for (let k in byKey) {
                    appPaths.add([meta.environmentId, k].join("|"));
                }
            }
            else if (envParent.type == "block") {
                blocks.add(envParent.id);
                blockEnvironments.add(meta.environmentId);
                for (let k in byKey) {
                    blockPaths.add([meta.environmentId, k].join("|"));
                }
            }
        }
    }
    return {
        filteredUpdates,
        apps,
        appEnvironments,
        appPaths,
        blocks,
        blockPaths,
        blockEnvironments,
        diffsByEnvironmentId,
        pendingLocalIds,
    };
}, getDiffsByKey = (fromVars, toVars, entryKeys) => {
    const allKeys = new Set([...Object.keys(fromVars), ...Object.keys(toVars)]);
    const byKey = {};
    for (let k of allKeys) {
        if (entryKeys && !entryKeys.has(k)) {
            continue;
        }
        if (k in fromVars && fromVars[k] && !(k in toVars)) {
            byKey[k] = {
                fromValue: fromVars[k],
                toValue: undefined,
            };
        }
        else if (k in toVars && toVars[k] && !(k in fromVars)) {
            byKey[k] = {
                fromValue: undefined,
                toValue: toVars[k],
            };
        }
        else if (JSON.stringify(fromVars[k]) != JSON.stringify(toVars[k])) {
            byKey[k] = {
                fromValue: fromVars[k],
                toValue: toVars[k],
            };
        }
    }
    return byKey;
}, ensureEnvsFetched = (state, envParentId) => {
    if ((0, exports.envsNeedFetch)(state, envParentId)) {
        const envParent = state.graph[envParentId];
        if (!envParent) {
            return;
        }
        const msg = `latest envs not fetched for ${envParent.name} - ${envParent.id}`;
        console.log(msg);
        throw new Error(msg);
    }
}, ensureChangesetsFetched = (state, envParentId) => {
    var _a;
    if ((0, exports.changesetsNeedFetch)(state, envParentId)) {
        const envParent = state.graph[envParentId];
        if (!envParent) {
            return;
        }
        const msg = `latest changesets not fetched for ${envParent.name} - ${envParent.id}`;
        const fetchedAt = state.changesetsFetchedAt[envParentId];
        const envsOrLocalsUpdatedAt = (_a = envParent.envsOrLocalsUpdatedAt) !== null && _a !== void 0 ? _a : 0;
        throw new Error(msg);
    }
}, envsNeedFetch = (state, envParentId) => {
    const envParent = state.graph[envParentId];
    if (!envParent) {
        return false;
    }
    const fetchedAt = state.envsFetchedAt[envParentId];
    const envsOrLocalsUpdatedAt = envParent.envsOrLocalsUpdatedAt;
    if (!envsOrLocalsUpdatedAt) {
        return false;
    }
    if (!fetchedAt || envsOrLocalsUpdatedAt > fetchedAt) {
        return true;
    }
    return false;
}, changesetsNeedFetch = (state, envParentId) => {
    var _a, _b, _c;
    const envParent = state.graph[envParentId];
    if (!envParent) {
        return false;
    }
    const fetchedAt = state.changesetsFetchedAt[envParentId];
    const envsOrLocalsUpdatedAt = (_a = envParent.envsOrLocalsUpdatedAt) !== null && _a !== void 0 ? _a : 0;
    if (!envsOrLocalsUpdatedAt) {
        return false;
    }
    if (!fetchedAt || envsOrLocalsUpdatedAt > fetchedAt) {
        return true;
    }
    // if any changesets were created by deleted user devices / cli keys, then re-fetch
    // in order to include deleted graph
    for (let [environmentId, { changesets }] of R.toPairs(state.changesets)) {
        const environment = ((_b = state.graph[environmentId]) !== null && _b !== void 0 ? _b : state.deletedGraph[environmentId]);
        if (!((environment === null || environment === void 0 ? void 0 : environment.envParentId) == envParentId ||
            environmentId.includes(envParentId))) {
            continue;
        }
        for (let { createdById } of changesets) {
            if (!((_c = state.graph[createdById]) !== null && _c !== void 0 ? _c : state.deletedGraph[createdById])) {
                return true;
            }
        }
    }
    return false;
}, getEnvWithMetaCellDisplay = (graph, cell, specialCellFormatter = R.identity) => {
    if (!cell) {
        return specialCellFormatter("undefined");
    }
    if (cell.inheritsEnvironmentId) {
        const name = (0, graph_1.getEnvironmentName)(graph, cell.inheritsEnvironmentId);
        return `inherits:${name.toLowerCase()}`;
    }
    else if (cell.isUndefined) {
        return specialCellFormatter("undefined");
    }
    else if (cell.isEmpty) {
        return specialCellFormatter("empty string");
    }
    else if (cell.val) {
        return cell.val;
    }
    return specialCellFormatter("undefined");
};
exports.getEnvWithMeta = (0, memoize_1.default)((state, params, pending, memoBuster, debugData) => {
    var _a;
    const { environmentId } = params;
    let envWithMeta;
    const envComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
        environmentId,
    });
    const metaComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
        environmentId,
        envPart: "meta",
    });
    const inheritsComposite = (0, blob_1.getUserEncryptedKeyOrBlobComposite)({
        environmentId,
        envPart: "inherits",
    });
    if (state.envs[envComposite] ||
        state.envs[metaComposite] ||
        state.envs[inheritsComposite]) {
        envWithMeta = Object.assign(Object.assign({}, R.mergeDeepRight(state.envs[envComposite]
            ? { variables: state.envs[envComposite].env }
            : { variables: {} }, state.envs[metaComposite]
            ? state.envs[metaComposite].env
            : { variables: {} })), (state.envs[inheritsComposite]
            ? state.envs[inheritsComposite].env
            : { inherits: {} }));
    }
    if (!envWithMeta) {
        envWithMeta = {
            inherits: {},
            variables: {},
        };
    }
    if (pending) {
        const pendingActions = (0, exports.getPendingActions)(state, params);
        if (pendingActions.length > 0) {
            envWithMeta = (0, versions_1.getEnvWithMetaForActions)(pendingActions, envWithMeta);
        }
    }
    // for sanitized debug output, replace keys and values with dummy data
    if (debugData) {
        envWithMeta = R.clone(envWithMeta);
        const salt = (0, utils_1.secureRandomAlphanumeric)(22);
        const keyMap = {};
        for (let k in envWithMeta.variables) {
            const cell = envWithMeta.variables[k];
            const keyHash = (_a = keyMap[k]) !== null && _a !== void 0 ? _a : (0, utils_1.sha256)(salt + k).slice(0, 10);
            keyMap[k] = keyHash;
            envWithMeta.variables[keyHash] = cell.val
                ? Object.assign(Object.assign({}, cell), { val: (0, utils_1.sha256)(salt + cell.val).slice(10) })
                : cell;
            for (let k in keyMap) {
                delete envWithMeta.variables[k];
            }
            for (let environmentId in envWithMeta.inherits) {
                envWithMeta.inherits[environmentId] = envWithMeta.inherits[environmentId].map((k) => keyMap[k]);
            }
        }
    }
    return envWithMeta;
}), exports.getPendingEnvWithMeta = getPendingEnvWithMeta, exports.getPendingActions = getPendingActions, exports.getEnvMetaOnly = getEnvMetaOnly, exports.getPendingEnvMeta = (0, memoize_1.default)((state, params) => (0, exports.getEnvMetaOnly)(state, params, true)), exports.getEnvInherits = getEnvInherits, exports.getPendingInherits = (0, memoize_1.default)((state, params) => (0, exports.getEnvInherits)(state, params, true)), exports.getPendingEnvironmentIds = (0, memoize_1.default)((state) => R.uniq(state.pendingEnvUpdates.map(({ meta }) => meta.environmentId))), exports.getPendingActionsByEnvironmentId = (0, memoize_1.default)((state) => (0, array_1.groupBy)((action) => action.meta.environmentId, state.pendingEnvUpdates)), exports.getEarliestEnvUpdatePendingAt = getEarliestEnvUpdatePendingAt, exports.getKeyableEnv = getKeyableEnv, exports.getRawEnv = (0, memoize_1.default)((state, params, pending) => {
    var _a;
    const res = {}, keyableEnv = (0, exports.getKeyableEnv)(state, params, pending), environment = state.graph[params.environmentId];
    if (environment) {
        const inheritanceOverrides = (0, exports.getInheritanceOverrides)(state, params, pending);
        for (let k in keyableEnv) {
            const { val, inheritsEnvironmentId } = keyableEnv[k];
            if (inheritsEnvironmentId) {
                let inherited = {
                    inheritsEnvironmentId,
                };
                while (inherited && inherited.inheritsEnvironmentId) {
                    inherited = ((_a = inheritanceOverrides[inherited.inheritsEnvironmentId]) !== null && _a !== void 0 ? _a : {})[k];
                }
                if (inherited && typeof inherited.val !== "undefined") {
                    res[k] = inherited.val;
                }
            }
            else if (typeof val !== "undefined") {
                res[k] = val;
            }
        }
    }
    else {
        // locals
        for (let k in keyableEnv) {
            const { val } = keyableEnv[k];
            if (typeof val !== "undefined") {
                res[k] = val;
            }
        }
    }
    return res;
}), exports.getRawEnvWithAncestors = (0, memoize_1.default)((state, params, pending) => {
    var _a;
    const envParent = state.graph[params.envParentId], environment = state.graph[params.environmentId];
    let baseEnv = {}, overrides = {};
    if (environment) {
        let baseEnvironment, subEnvironment, connectedBaseEnvironments = [], connectedSubEnvironments = [];
        if (environment.isSub) {
            baseEnvironment = state.graph[environment.parentEnvironmentId];
            subEnvironment = environment;
        }
        else {
            baseEnvironment = environment;
        }
        if (envParent.type == "app") {
            connectedBaseEnvironments = (0, graph_1.getConnectedBlockEnvironmentsForApp)(state.graph, envParent.id, undefined, baseEnvironment.id);
            if (subEnvironment) {
                connectedSubEnvironments = (0, graph_1.getConnectedBlockEnvironmentsForApp)(state.graph, envParent.id, undefined, subEnvironment.id);
            }
        }
        const connectedEnvironments = R.flatten(Object.values(R.groupBy(R.pipe(R.props(["envParentId", "environmentRoleId"]), R.join("|")), [...connectedBaseEnvironments, ...connectedSubEnvironments])));
        for (let connected of connectedEnvironments) {
            baseEnv = Object.assign(Object.assign({}, baseEnv), (0, exports.getRawEnv)(state, {
                envParentId: connected.envParentId,
                environmentId: connected.id,
            }, pending));
        }
        baseEnv = Object.assign(Object.assign({}, baseEnv), (0, exports.getRawEnv)(state, {
            envParentId: baseEnvironment.envParentId,
            environmentId: baseEnvironment.id,
        }, pending));
        if (subEnvironment) {
            baseEnv = Object.assign(Object.assign({}, baseEnv), (0, exports.getRawEnv)(state, {
                envParentId: subEnvironment.envParentId,
                environmentId: subEnvironment.id,
            }, pending));
        }
    }
    else {
        const localsUserId = params.environmentId.split("|")[1], localsEnvironment = ((_a = (0, graph_1.getEnvironmentsByEnvParentId)(state.graph)[envParent.id]) !== null && _a !== void 0 ? _a : []).filter(({ environmentRoleId }) => state.graph[environmentRoleId]
            .hasLocalKeys)[0];
        const connectedBlocks = (0, graph_1.getConnectedBlocksForApp)(state.graph, envParent.id);
        for (let block of connectedBlocks) {
            overrides = Object.assign(Object.assign({}, overrides), (0, exports.getRawEnv)(state, {
                envParentId: block.id,
                environmentId: [block.id, localsUserId].join("|"),
            }, pending));
        }
        if (localsEnvironment && envParent.type == "app") {
            const connectedEnvironments = (0, graph_1.getConnectedBlockEnvironmentsForApp)(state.graph, envParent.id, undefined, localsEnvironment.id);
            for (let connected of connectedEnvironments) {
                baseEnv = Object.assign(Object.assign({}, baseEnv), (0, exports.getRawEnv)(state, {
                    envParentId: connected.envParentId,
                    environmentId: connected.id,
                }, pending));
            }
        }
        if (localsEnvironment) {
            baseEnv = Object.assign(Object.assign({}, baseEnv), (0, exports.getRawEnv)(state, {
                envParentId: params.envParentId,
                environmentId: localsEnvironment.id,
            }, pending));
        }
        overrides = Object.assign(Object.assign({}, overrides), (0, exports.getRawEnv)(state, params));
    }
    return Object.assign(Object.assign({}, baseEnv), overrides);
}), exports.getPendingKeyableEnv = (0, memoize_1.default)((state, params) => (0, exports.getKeyableEnv)(state, params, true)), exports.getInheritanceOverrides = getInheritanceOverrides, exports.getPendingInheritanceOverrides = getPendingInheritanceOverrides, exports.getEnvInheritsForVariables = getEnvInheritsForVariables, exports.getInheritanceChain = getInheritanceChain, exports.getPendingInheritanceChain = getPendingInheritanceChain, exports.getInheritingEnvironmentIds = getInheritingEnvironmentIds, exports.getPendingInheritingEnvironmentIds = getPendingInheritingEnvironmentIds, exports.getPendingUpdateDetails = getPendingUpdateDetails, exports.getDiffsByKey = getDiffsByKey, exports.ensureEnvsFetched = ensureEnvsFetched, exports.ensureChangesetsFetched = ensureChangesetsFetched, exports.envsNeedFetch = envsNeedFetch, exports.changesetsNeedFetch = changesetsNeedFetch, exports.getCurrentUserEnv = (0, memoize_1.default)((state, currentUserId, environmentId, pending) => {
    const environment = state.graph[environmentId];
    let localsUserId;
    let envParentId;
    if (environment) {
        envParentId = environment.envParentId;
    }
    else {
        [envParentId, localsUserId] = environmentId.split("|");
        if (!localsUserId) {
            return undefined;
        }
    }
    if (localsUserId ||
        graph_1.authz.canReadEnv(state.graph, currentUserId, environmentId)) {
        return (pending ? exports.getPendingEnvWithMeta : exports.getEnvWithMeta)(state, {
            envParentId,
            environmentId,
        });
    }
    else if (graph_1.authz.canReadEnvMeta(state.graph, currentUserId, environmentId)) {
        return (0, exports.getEnvMetaOnly)(state, { envParentId, environmentId }, pending);
    }
    else if (graph_1.authz.canReadEnvInherits(state.graph, currentUserId, environmentId)) {
        return (0, exports.getEnvInherits)(state, { envParentId, environmentId }, pending);
    }
    return undefined;
}), exports.getCurrentUserEntryKeys = (0, memoize_1.default)((state, currentUserId, environmentIds, pending) => Array.from((0, exports.getCurrentUserEntryKeysSet)(state, currentUserId, environmentIds, pending)).sort()), exports.getCurrentUserEntryKeysSet = (0, memoize_1.default)((state, currentUserId, environmentIds, pending) => new Set(environmentIds.flatMap((environmentId) => {
    var _a, _b;
    return Object.keys((_b = (_a = (0, exports.getCurrentUserEnv)(state, currentUserId, environmentId, pending)) === null || _a === void 0 ? void 0 : _a.variables) !== null && _b !== void 0 ? _b : {});
}))), exports.getEnvWithMetaCellDisplay = getEnvWithMetaCellDisplay;
//# sourceMappingURL=envs.js.map