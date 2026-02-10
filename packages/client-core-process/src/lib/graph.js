"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProposer = exports.deleteProposer = void 0;
const deleteProposer = (action) => (graphDraft) => {
    delete graphDraft[action.payload.id];
}, updateProposer = (action) => (graphDraft) => {
    graphDraft[action.payload.id] = Object.assign(Object.assign({}, graphDraft[action.payload.id]), action.payload);
};
exports.deleteProposer = deleteProposer, exports.updateProposer = updateProposer;
//# sourceMappingURL=graph.js.map