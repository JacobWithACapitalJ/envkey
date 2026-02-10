"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizeDeepAll = exports.memoizeShallowAll = exports.memoizeShallowFirstDeepRest = exports.configureMemoization = void 0;
const memoizee_1 = __importDefault(require("memoizee"));
let cacheNumItems = 10000;
let cacheMaxAge = 1000 * 60 * 10; // 10 minutes
const stringify = (o) => JSON.stringify(o, (k, v) => (v instanceof Set ? Array.from(v) : v));
const configureMemoization = (numItems, maxAge) => {
    cacheNumItems = numItems;
    cacheMaxAge = maxAge;
};
exports.configureMemoization = configureMemoization;
const memoizeShallowFirstDeepRest = (fn) => (0, memoizee_1.default)(fn, {
    max: cacheNumItems,
    maxAge: cacheMaxAge,
    normalizer: (args) => {
        let res = "";
        for (let i = 0; i < args.length; i++) {
            if (i == 0 && typeof args[i] == "object") {
                res += objectId(args[i]);
            }
            else {
                res += stringify(args[i]);
            }
        }
        return res;
    },
});
exports.memoizeShallowFirstDeepRest = memoizeShallowFirstDeepRest;
const memoizeShallowAll = (fn) => (0, memoizee_1.default)(fn, {
    max: cacheNumItems,
    maxAge: cacheMaxAge,
    normalizer: (args) => {
        let res = "";
        for (let i = 0; i < args.length; i++) {
            res +=
                typeof args[i] == "object" ? objectId(args[i]) : stringify(args[i]);
        }
        return res;
    },
});
exports.memoizeShallowAll = memoizeShallowAll;
const memoizeDeepAll = (fn) => (0, memoizee_1.default)(fn, {
    max: cacheNumItems,
    maxAge: cacheMaxAge,
    normalizer: (args) => {
        let res = "";
        for (let i = 0; i < args.length; i++) {
            res += stringify(args[i]);
        }
        return res;
    },
});
exports.memoizeDeepAll = memoizeDeepAll;
exports.default = exports.memoizeShallowFirstDeepRest;
let currentId = 0;
const map = new WeakMap();
const objectId = (object) => {
    if (!map.has(object)) {
        map.set(object, ++currentId);
    }
    return map.get(object);
};
//# sourceMappingURL=memoize.js.map