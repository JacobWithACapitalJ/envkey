"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentOrLocalsAutoCommitEnabled = void 0;
const base_1 = require("./base");
const getEnvironmentOrLocalsAutoCommitEnabled = (graph, environmentOrLocalsId) => {
    var _a, _b, _c, _d, _e, _f;
    let autoCommit;
    const org = (0, base_1.getOrg)(graph);
    let envParentId;
    const environment = graph[environmentOrLocalsId];
    if (environment) {
        envParentId = environment.envParentId;
    }
    else {
        [envParentId] = environmentOrLocalsId.split("|");
    }
    const envParent = graph[envParentId];
    if (environment) {
        if (environment.isSub) {
            const parentEnvironment = graph[environment.parentEnvironmentId];
            if (!parentEnvironment.isSub && ((_a = parentEnvironment.settings) === null || _a === void 0 ? void 0 : _a.autoCommit)) {
                autoCommit = true;
            }
        }
        else if ((_b = environment.settings) === null || _b === void 0 ? void 0 : _b.autoCommit) {
            autoCommit = true;
        }
    }
    else if (typeof envParent.settings.autoCommitLocals == "boolean") {
        autoCommit = envParent.settings.autoCommitLocals;
    }
    if (typeof autoCommit == "undefined") {
        if (environment) {
            const environmentRole = graph[environment.environmentRoleId];
            autoCommit = (_d = (_c = environmentRole.settings) === null || _c === void 0 ? void 0 : _c.autoCommit) !== null && _d !== void 0 ? _d : false;
        }
        else {
            autoCommit = (_f = (_e = org.settings.envs) === null || _e === void 0 ? void 0 : _e.autoCommitLocals) !== null && _f !== void 0 ? _f : false;
        }
    }
    return autoCommit;
};
exports.getEnvironmentOrLocalsAutoCommitEnabled = getEnvironmentOrLocalsAutoCommitEnabled;
//# sourceMappingURL=settings.js.map