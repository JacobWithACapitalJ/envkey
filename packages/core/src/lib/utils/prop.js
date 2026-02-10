"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prop = void 0;
function prop(key, obj) {
    const fn = (o) => o[key];
    return obj ? fn(obj) : fn;
}
exports.prop = prop;
//# sourceMappingURL=prop.js.map