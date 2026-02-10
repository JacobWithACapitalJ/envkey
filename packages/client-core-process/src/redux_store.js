"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTempStore = exports.clearStore = exports.getDefaultStore = exports.getNewStore = void 0;
const redux_1 = require("redux");
const handler_1 = require("./handler");
// ensure all action handlers get loaded prior to running clientReducer
require("./handlers");
let defaultStore;
const getNewStore = (initialState) => {
    const store = (0, redux_1.createStore)((0, handler_1.clientReducer)(), initialState);
    return store;
};
exports.getNewStore = getNewStore;
const getDefaultStore = () => {
    if (!defaultStore) {
        defaultStore = (0, exports.getNewStore)();
    }
    return defaultStore;
}, clearStore = () => {
    defaultStore = undefined;
};
exports.getDefaultStore = getDefaultStore, exports.clearStore = clearStore;
const getTempStore = (storeArg) => {
    const store = storeArg !== null && storeArg !== void 0 ? storeArg : (0, exports.getDefaultStore)();
    return (0, exports.getNewStore)(store.getState());
};
exports.getTempStore = getTempStore;
//# sourceMappingURL=redux_store.js.map