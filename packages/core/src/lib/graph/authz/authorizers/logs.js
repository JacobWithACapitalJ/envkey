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
Object.defineProperty(exports, "__esModule", { value: true });
exports.canFetchLogs = void 0;
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const R = __importStar(require("ramda"));
const canFetchLogs = (graph, currentUserId, currentOrgId, params) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [, , currentOrgPermissions] = currentUserRes;
    if (!params.loggableTypes && !R.equals(params.orgIds, [currentOrgId])) {
        return currentOrgPermissions.has("self_hosted_read_host_logs");
    }
    else if (!params.loggableTypes && R.equals(params.orgIds, [currentOrgId])) {
        return currentOrgPermissions.has("org_read_logs");
    }
    if (currentOrgPermissions.has("org_read_logs")) {
        return true;
    }
    if (params.loggableTypes) {
        if ((params.userIds || params.deviceIds) && !params.targetIds) {
            return currentOrgPermissions.has("org_read_logs");
        }
        if (params.targetIds) {
            for (let targetId of params.targetIds) {
                let target = graph[targetId];
                // if none of above was found, targetId may be a localCompositeId, so try to extract envParentId from that
                if (!target) {
                    target = graph[targetId.split("|")[0]];
                }
                if (!target ||
                    !["environment", "block", "app", "cliUser", "orgUser"].includes(target.type)) {
                    return false;
                }
                if (target.type == "cliUser" || target.type == "orgUser") {
                    return currentOrgPermissions.has("org_read_logs");
                }
                let envParentId;
                if (target.type == "environment") {
                    envParentId = target.envParentId;
                }
                else {
                    envParentId = targetId;
                }
                return (0, _1.getEnvParentPermissions)(graph, envParentId, currentUserId).has("app_read_logs");
            }
        }
    }
    return true;
};
exports.canFetchLogs = canFetchLogs;
//# sourceMappingURL=logs.js.map