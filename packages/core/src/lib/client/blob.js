"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOrphanedEnvUpdatesProducer = exports.clearOrphanedBlobPaths = void 0;
const current_encrypted_keys_1 = require("../graph/current_encrypted_keys");
const blob_1 = require("../blob");
const graph_1 = require("../graph");
const clearOrphanedBlobPaths = (blobState, currentUserId, currentDeviceId) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const paths = [];
    const envParentIds = new Set(Object.keys(blobState.envsFetchedAt).concat(Object.keys(blobState.changesetsFetchedAt)));
    const currentUserEncryptedKeys = (_b = (_a = (0, current_encrypted_keys_1.getCurrentEncryptedKeys)(blobState.graph, {
        envParentIds,
        userIds: new Set([currentUserId]),
        deviceIds: new Set([currentDeviceId]),
    }, Date.now(), true).users) === null || _a === void 0 ? void 0 : _a[currentUserId]) === null || _b === void 0 ? void 0 : _b[currentDeviceId];
    for (let composite of blobState.envs) {
        const { environmentId } = (0, blob_1.parseUserEncryptedKeyOrBlobComposite)(composite);
        if (blobState.graph[environmentId]) {
            const { envParentId } = blobState.graph[environmentId], encryptedKey = (_d = (_c = currentUserEncryptedKeys === null || currentUserEncryptedKeys === void 0 ? void 0 : currentUserEncryptedKeys[envParentId]) === null || _c === void 0 ? void 0 : _c.environments) === null || _d === void 0 ? void 0 : _d[environmentId];
            if (!encryptedKey ||
                !(encryptedKey.env || encryptedKey.meta || encryptedKey.inherits)) {
                paths.push(["envs", composite]);
            }
        }
        else {
            const [envParentId, localsUserId] = environmentId.split("|"), encryptedKey = (_f = (_e = currentUserEncryptedKeys === null || currentUserEncryptedKeys === void 0 ? void 0 : currentUserEncryptedKeys[envParentId]) === null || _e === void 0 ? void 0 : _e.locals) === null || _f === void 0 ? void 0 : _f[localsUserId];
            if (blobState.graph[envParentId]) {
                if (!encryptedKey || !encryptedKey.env) {
                    paths.push(["envs", composite]);
                }
            }
            else {
                paths.push(["envs", composite]);
            }
        }
    }
    for (let envParentId in blobState.envsFetchedAt) {
        if (blobState.graph[envParentId]) {
            if (!(currentUserEncryptedKeys === null || currentUserEncryptedKeys === void 0 ? void 0 : currentUserEncryptedKeys[envParentId])) {
                paths.push(["envsFetchedAt", envParentId]);
            }
        }
        else {
            paths.push(["envsFetchedAt", envParentId]);
        }
    }
    for (let environmentId of blobState.changesets) {
        if (blobState.graph[environmentId]) {
            const { envParentId } = blobState.graph[environmentId], blob = (_h = (_g = currentUserEncryptedKeys === null || currentUserEncryptedKeys === void 0 ? void 0 : currentUserEncryptedKeys[envParentId]) === null || _g === void 0 ? void 0 : _g.environments) === null || _h === void 0 ? void 0 : _h[environmentId];
            if (!blob || !blob.changesets) {
                paths.push(["changesets", environmentId]);
            }
        }
        else {
            const [envParentId, localsUserId] = environmentId.split("|"), blob = (_k = (_j = currentUserEncryptedKeys === null || currentUserEncryptedKeys === void 0 ? void 0 : currentUserEncryptedKeys[envParentId]) === null || _j === void 0 ? void 0 : _j.locals) === null || _k === void 0 ? void 0 : _k[localsUserId];
            if (blobState.graph[envParentId]) {
                if (!blob || !blob.env) {
                    paths.push(["changesets", environmentId]);
                }
            }
            else {
                paths.push(["changesets", environmentId]);
            }
        }
    }
    for (let envParentId in blobState.changesetsFetchedAt) {
        if (blobState.graph[envParentId]) {
            if (!(currentUserEncryptedKeys === null || currentUserEncryptedKeys === void 0 ? void 0 : currentUserEncryptedKeys[envParentId])) {
                paths.push(["changesetsFetchedAt", envParentId]);
            }
        }
        else {
            paths.push(["changesetsFetchedAt", envParentId]);
        }
    }
    return paths;
};
exports.clearOrphanedBlobPaths = clearOrphanedBlobPaths;
const clearOrphanedEnvUpdatesProducer = (draft, currentUserId) => {
    draft.pendingEnvUpdates = draft.pendingEnvUpdates.filter((update) => {
        const envParent = draft.graph[update.meta.envParentId];
        if (!envParent) {
            return false;
        }
        const environment = draft.graph[update.meta.environmentId];
        if (environment) {
            if (!graph_1.authz.canUpdateEnv(draft.graph, currentUserId, environment.id)) {
                return false;
            }
        }
        else {
            const [envParentId, localsUserId] = update.meta.environmentId.split("|");
            if (!envParentId ||
                !localsUserId ||
                !draft.graph[envParentId] ||
                !draft.graph[localsUserId]) {
                return false;
            }
            if (!graph_1.authz.canUpdateLocals(draft.graph, currentUserId, envParentId, localsUserId)) {
                return false;
            }
        }
        return true;
    });
};
exports.clearOrphanedEnvUpdatesProducer = clearOrphanedEnvUpdatesProducer;
//# sourceMappingURL=blob.js.map