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
exports.intersection = exports.flatten = exports.zodPrimitive = exports.ZodLiteralRecord = void 0;
const z = __importStar(require("zod"));
const ZodLiteralRecord = (keys, zodValueType) => z.object(keys.reduce((agg, k) => (Object.assign(Object.assign({}, agg), { [k]: zodValueType.optional() })), {})), flatten = (schema) => {
    let res;
    if (schema._def.t == "union") {
        let schemas = [];
        for (let opt of schema._def.options) {
            if (opt._def.t == "union") {
                schemas = [...schemas, (0, exports.flatten)(opt)];
            }
            else {
                schemas.push(opt);
            }
        }
        res = z.union(schemas);
    }
    else {
        res = schema;
    }
    return res;
}, intersection = (left, right) => {
    /*
      recursively merges object-like/unions of object-like
      see https://github.com/vriad/zod/issues/59
    */
    let res;
    if (left._def.t == "object" && right._def.t == "object") {
        res = left.merge(right);
    }
    else {
        const leftFlat = (0, exports.flatten)(left), rightFlat = (0, exports.flatten)(right), schemas = [];
        if (leftFlat._def.t == "union") {
            for (let leftOpt of leftFlat._def.options) {
                if (rightFlat._def.t == "union") {
                    for (let rightOpt of rightFlat._def.options) {
                        schemas.push(exports.intersection(leftOpt, rightOpt));
                    }
                }
                else {
                    schemas.push(exports.intersection(leftOpt, rightFlat));
                }
            }
        }
        else if (rightFlat._def.t == "union") {
            for (let rightOpt of rightFlat._def.options) {
                schemas.push(exports.intersection(leftFlat, rightOpt));
            }
        }
        res = z.union(schemas);
    }
    return res;
};
exports.ZodLiteralRecord = ZodLiteralRecord, exports.zodPrimitive = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.undefined(),
    z.null(),
]), exports.flatten = flatten, exports.intersection = intersection;
//# sourceMappingURL=utils.js.map