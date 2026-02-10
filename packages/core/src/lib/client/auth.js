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
exports.getApiAuthParams = exports.getAuth = void 0;
const utils_1 = require("../crypto/utils");
const pick_1 = require("../utils/pick");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const R = __importStar(require("ramda"));
const getAuth = (state, accountIdOrCliKey) => {
    var _a;
    return (accountIdOrCliKey
        ? (_a = state.orgUserAccounts[accountIdOrCliKey]) !== null && _a !== void 0 ? _a : state.cliKeyAccounts[(0, utils_1.sha256)(accountIdOrCliKey)]
        : undefined);
}, getApiAuthParams = (accountAuth) => {
    let authPropsBase, toSign;
    if (accountAuth.type == "clientCliAuth") {
        const props = ["userId", "orgId"];
        toSign = R.props(props, accountAuth);
        authPropsBase = Object.assign({ type: "cliAuthParams" }, (0, pick_1.pick)(props, accountAuth));
    }
    else {
        if (!accountAuth.token) {
            throw new Error("Action requires authentication.");
        }
        const props = [
            "token",
            "userId",
            "orgId",
            "deviceId",
        ];
        toSign = R.props(props, accountAuth);
        authPropsBase = Object.assign({ type: "tokenAuthParams" }, (0, pick_1.pick)(props, accountAuth));
    }
    return Object.assign(Object.assign({}, authPropsBase), { signature: tweetnacl_util_1.default.encodeBase64(tweetnacl_1.default.sign.detached(tweetnacl_util_1.default.decodeUTF8(JSON.stringify(toSign)), tweetnacl_util_1.default.decodeBase64(accountAuth.privkey.keys.signingKey))) });
};
exports.getAuth = getAuth, exports.getApiAuthParams = getApiAuthParams;
//# sourceMappingURL=auth.js.map