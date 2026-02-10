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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToObject = exports.objectIntersection = exports.objectDifference = exports.objectPaths = exports.stripEmptyRecursive = exports.stripNullsRecursive = exports.stripUndefinedRecursive = exports.allKeysDeep = exports.transformKeysDeep = exports.flattenObj = void 0;
const R = __importStar(require("ramda"));
__exportStar(require("./pick"), exports);
__exportStar(require("./prop"), exports);
const flattenObj = (obj) => {
    const go = (obj_) => R.chain(([k, v]) => {
        if (typeof v == "object") {
            return R.map(([k_, v_]) => [`${k}.${k_}`, v_], go(v));
        }
        else {
            return [[k, v]];
        }
    }, R.toPairs(obj_));
    return R.fromPairs(go(obj));
}, 
/*
 *  Recursively transforms a given set of keys within an object with a given transformer function no matter where those keys appear in an object's hierarchy.
 *  Handles nested objects and nested arrays of objects, but not nested multi-dimensional arrays.
 */
transformKeysDeep = (obj, keys, transformer) => {
    const pairs = R.toPairs(obj), transformed = pairs.map(([k, v]) => {
        if (keys.indexOf(k) > -1) {
            return [k, transformer(v)];
        }
        else if (v && typeof v === "object" && !Array.isArray(v)) {
            return [k, (0, exports.transformKeysDeep)(v, keys, transformer)];
        }
        else if (Array.isArray(v)) {
            return [
                k,
                v.map((el) => {
                    if (el && typeof el === "object" && !Array.isArray(el)) {
                        return (0, exports.transformKeysDeep)(el, keys, transformer);
                    }
                    return el;
                }),
            ];
        }
        return [k, v];
    });
    return R.fromPairs(transformed);
}, allKeysDeep = (obj) => {
    let keys = new Set([]);
    for (let k in obj) {
        keys.add(k);
        if (obj[k] && typeof obj[k] == "object") {
            if (Array.isArray(obj[k])) {
                for (let el of R.flatten(obj[k])) {
                    if (el && typeof el == "object") {
                        keys = new Set(Array.from(keys).concat((0, exports.allKeysDeep)(el)));
                    }
                }
            }
            else {
                keys = new Set(Array.from(keys).concat((0, exports.allKeysDeep)(obj[k])));
            }
        }
    }
    return Array.from(keys);
}, stripUndefinedRecursive = (obj) => {
    const clone = R.clone(obj), toDelete = [];
    for (let k in clone) {
        const v = clone[k];
        if (typeof v === "undefined")
            toDelete.push(k);
        const isObj = typeof v == "object" && v instanceof Object && !(v instanceof Array);
        if (isObj) {
            clone[k] = (0, exports.stripUndefinedRecursive)(v);
        }
    }
    for (let k of toDelete) {
        delete clone[k];
    }
    return clone;
}, stripNullsRecursive = (obj) => {
    const clone = R.clone(obj), toDelete = [];
    for (let k in clone) {
        const v = clone[k];
        if (v === null || typeof v === "undefined")
            toDelete.push(k);
        const isObj = typeof v == "object" && v instanceof Object && !(v instanceof Array);
        if (isObj) {
            clone[k] = (0, exports.stripNullsRecursive)(v);
        }
    }
    for (let k of toDelete) {
        delete clone[k];
    }
    return clone;
}, stripEmptyRecursive = (obj) => {
    const clone = R.clone(obj), toDelete = [];
    for (let k in clone) {
        const v = clone[k];
        if (typeof v == "object" && v instanceof Object) {
            if (R.isEmpty(v)) {
                toDelete.push(k);
            }
            else {
                clone[k] = (0, exports.stripEmptyRecursive)(v);
                if (R.isEmpty(clone[k])) {
                    toDelete.push(k);
                }
            }
        }
    }
    for (let k of toDelete) {
        delete clone[k];
    }
    return clone;
}, objectPaths = (obj) => {
    let paths = [];
    for (let k in obj) {
        if (k === "type") {
            continue;
        }
        let v = obj[k], path = [k];
        if (typeof v == "object" && !Array.isArray(v)) {
            const nestedPaths = (0, exports.objectPaths)(v);
            for (let nestedPath of nestedPaths) {
                paths.push([k, ...nestedPath]);
            }
        }
        else {
            paths.push(path);
        }
    }
    return paths;
}, objectDifference = (obj1, obj2) => {
    const paths1 = (0, exports.objectPaths)(obj1), paths2 = (0, exports.objectPaths)(obj2), pathsDifference = R.difference(paths1.map((path) => JSON.stringify(path)), paths2.map((path) => JSON.stringify(path))).map((json) => JSON.parse(json));
    return pathsDifference.reduce((obj, path) => R.assocPath(path, R.path(path, obj1), obj), {});
}, objectIntersection = (obj1, obj2) => {
    const paths1 = (0, exports.objectPaths)(obj1), paths2 = (0, exports.objectPaths)(obj2), pathsIntersection = R.intersection(paths1.map((path) => JSON.stringify(path)), paths2.map((path) => JSON.stringify(path))).map((json) => JSON.parse(json));
    return pathsIntersection.reduce((obj, path) => R.assocPath(path, R.path(path, obj1), obj), {});
}, setToObject = (s) => Array.from(s).reduce((agg, k) => (Object.assign(Object.assign({}, agg), { [k]: true })), {});
exports.flattenObj = flattenObj, 
/*
 *  Recursively transforms a given set of keys within an object with a given transformer function no matter where those keys appear in an object's hierarchy.
 *  Handles nested objects and nested arrays of objects, but not nested multi-dimensional arrays.
 */
exports.transformKeysDeep = transformKeysDeep, exports.allKeysDeep = allKeysDeep, exports.stripUndefinedRecursive = stripUndefinedRecursive, exports.stripNullsRecursive = stripNullsRecursive, exports.stripEmptyRecursive = stripEmptyRecursive, exports.objectPaths = objectPaths, exports.objectDifference = objectDifference, exports.objectIntersection = objectIntersection, exports.setToObject = setToObject;
//# sourceMappingURL=object.js.map