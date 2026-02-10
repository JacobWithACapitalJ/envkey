"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceApplyPatch = void 0;
const rfc6902_1 = require("rfc6902");
const lodash_set_1 = __importDefault(require("lodash.set"));
const lodash_unset_1 = __importDefault(require("lodash.unset"));
/*
 * workaround for rfc6902 issue with 'add' and 'set' operations on deep paths
 * that don't exist on target object
 */
const forceApplyPatch = (object, patch) => {
    const res = (0, rfc6902_1.applyPatch)(object, patch);
    res.forEach((val, i) => {
        const op = patch[i];
        if (val !== null && (op.op == "add" || op.op == "replace")) {
            const path = op.path.split("/").slice(1);
            typeof op.value == "undefined"
                ? (0, lodash_unset_1.default)(object, path)
                : (0, lodash_set_1.default)(object, path, op.value);
            res[i] = null;
        }
    });
    return res;
};
exports.forceApplyPatch = forceApplyPatch;
//# sourceMappingURL=patch.js.map