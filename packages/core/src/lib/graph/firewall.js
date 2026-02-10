"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppAllowedIps = void 0;
const base_1 = require("./base");
const getAppAllowedIps = (graph, appId, environmentRoleId) => {
    var _a, _b, _c, _d, _e, _f;
    const org = (0, base_1.getOrg)(graph);
    const app = graph[appId];
    const mergeStrategy = (_a = app.environmentRoleIpsMergeStrategies) === null || _a === void 0 ? void 0 : _a[environmentRoleId];
    // no entry for an app's environmentRoleIpsMergeStrategies means it inherits from org
    if (!mergeStrategy) {
        return (_b = org.environmentRoleIpsAllowed) === null || _b === void 0 ? void 0 : _b[environmentRoleId];
    }
    else if (mergeStrategy == "override") {
        return (_c = app.environmentRoleIpsAllowed) === null || _c === void 0 ? void 0 : _c[environmentRoleId];
    }
    else if (mergeStrategy == "extend") {
        if (!app.environmentRoleIpsAllowed) {
            return (_d = org.environmentRoleIpsAllowed) === null || _d === void 0 ? void 0 : _d[environmentRoleId];
        }
        const orgIps = (_e = org.environmentRoleIpsAllowed) === null || _e === void 0 ? void 0 : _e[environmentRoleId];
        if (!orgIps) {
            return undefined;
        }
        return [
            ...orgIps,
            ...((_f = app.environmentRoleIpsAllowed[environmentRoleId]) !== null && _f !== void 0 ? _f : []),
        ];
    }
};
exports.getAppAllowedIps = getAppAllowedIps;
//# sourceMappingURL=firewall.js.map