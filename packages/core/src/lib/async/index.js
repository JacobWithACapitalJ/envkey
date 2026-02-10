"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOrphanedBlobPaths = exports.asyncify = void 0;
const object_1 = require("../utils/object");
const start_1 = require("../../worker/start");
// makes supplied function run on background thread and return promise
const asyncify = (name, fn) => async (...params) => {
    const proxy = await (0, start_1.getProxy)();
    return proxy[name](...params);
};
exports.asyncify = asyncify;
const clearOrphanedBlobPaths = async (state, currentUserId, currentDeviceId) => {
    const proxy = await (0, start_1.getProxy)();
    return proxy.clearOrphanedBlobPaths(Object.assign(Object.assign({}, (0, object_1.pick)(["graph", "envsFetchedAt", "changesetsFetchedAt"], state)), { envs: Object.keys(state.envs), changesets: Object.keys(state.changesets) }), currentUserId, currentDeviceId);
};
exports.clearOrphanedBlobPaths = clearOrphanedBlobPaths;
//# sourceMappingURL=index.js.map