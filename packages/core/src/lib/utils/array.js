"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = exports.indexBy = exports.filterJoin = exports.shuffle = void 0;
const shuffle = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};
exports.shuffle = shuffle;
const filterJoin = (sep, ...args) => {
    let res = "";
    for (let s of args) {
        if (s) {
            if (res) {
                res += sep;
            }
            res += s;
        }
    }
    return res;
};
exports.filterJoin = filterJoin;
const indexBy = (fn, a) => {
    const idx = {};
    for (let el of a) {
        idx[fn(el)] = el;
    }
    return idx;
};
exports.indexBy = indexBy;
const groupBy = (fn, a) => {
    const idx = {};
    for (let el of a) {
        const id = fn(el);
        if (idx[id]) {
            idx[id].push(el);
        }
        else {
            idx[id] = [el];
        }
    }
    return idx;
};
exports.groupBy = groupBy;
//# sourceMappingURL=array.js.map