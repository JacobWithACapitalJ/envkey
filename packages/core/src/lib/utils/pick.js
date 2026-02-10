"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickDefined = exports.pick = void 0;
function pick(keys, obj) {
    const fn = (o) => {
        const ret = {};
        keys.forEach((key) => {
            ret[key] = o[key];
        });
        return ret;
    };
    return obj ? fn(obj) : fn;
}
exports.pick = pick;
function pickDefined(keys, obj) {
    const fn = (o) => {
        const ret = {};
        keys.forEach((key) => {
            if (typeof o[key] !== "undefined") {
                ret[key] = o[key];
            }
        });
        return ret;
    };
    return obj ? fn(obj) : fn;
}
exports.pickDefined = pickDefined;
//# sourceMappingURL=pick.js.map