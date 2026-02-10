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
exports.getMinimumInfraForApi = exports.waitForEnterKeyPromise = void 0;
const semver = __importStar(require("semver"));
const readline = __importStar(require("readline"));
const waitForEnterKeyPromise = (message) => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(message, (res) => {
            rl.close();
            resolve(res);
        });
    });
};
exports.waitForEnterKeyPromise = waitForEnterKeyPromise;
const getMinimumInfraForApi = (apiToInfraVersions, apiVersionAny) => {
    var _a;
    const apiVersion = (_a = semver.coerce(apiVersionAny)) === null || _a === void 0 ? void 0 : _a.version;
    if (!apiVersion) {
        throw new TypeError(`Failed coercing apiVersion to semver version when looking for infra version: ${apiVersionAny}`);
    }
    // descending
    const listedApiVersions = semver
        .sort(Object.keys(apiToInfraVersions))
        .reverse();
    const firstApiVersion = listedApiVersions[listedApiVersions.length - 1];
    const lastApiVersion = listedApiVersions[0];
    // exact match
    if (apiToInfraVersions[apiVersion]) {
        return apiToInfraVersions[apiVersion];
    }
    // under first listed
    if (semver.lte(apiVersion, firstApiVersion)) {
        return apiToInfraVersions[firstApiVersion];
    }
    // greater than last listed
    if (semver.gte(apiVersion, lastApiVersion)) {
        return apiToInfraVersions[lastApiVersion];
    }
    // finds the first version under the desired version
    for (let i = 0; i < listedApiVersions.length; i++) {
        const testApiV = listedApiVersions[i];
        if (semver.gt(apiVersion, testApiV)) {
            return apiToInfraVersions[testApiV];
        }
    }
    return apiToInfraVersions[firstApiVersion];
};
exports.getMinimumInfraForApi = getMinimumInfraForApi;
//# sourceMappingURL=lib.js.map