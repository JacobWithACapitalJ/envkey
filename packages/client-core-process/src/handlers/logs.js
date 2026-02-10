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
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.CLEAR_LOGS,
    stateProducer: (draft) => {
        draft.loggedActionsWithTransactionIds = [];
        draft.deletedGraph = {};
        draft.logIps = [];
        delete draft.fetchLogParams;
        delete draft.fetchLogsError;
        delete draft.logsTotalCount;
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.FETCH_LOGS,
    authenticated: true,
    loggableType: "fetchLogsAction",
    stateProducer: (draft, { payload }) => {
        draft.isFetchingLogs = true;
        delete draft.fetchLogsError;
        const params = R.omit(["pageNum"], payload);
        if (payload.pageNum == 0 &&
            draft.fetchLogParams &&
            !R.equals(draft.fetchLogParams, params)) {
            draft.loggedActionsWithTransactionIds = [];
            delete draft.logsTotalCount;
            delete draft.logsCountReachedLimit;
        }
    },
    successStateProducer: (draft, { payload, meta: { rootAction: { payload: rootPayload }, }, }) => {
        var _a, _b;
        draft.loggedActionsWithTransactionIds = [
            ...draft.loggedActionsWithTransactionIds,
            ...R.toPairs(R.groupBy(R.prop("transactionId"), payload.logs)),
        ];
        if (rootPayload.pageNum == 0) {
            const params = R.omit(["pageNum"], rootPayload);
            draft.logsTotalCount = payload.totalCount;
            draft.logsCountReachedLimit = payload.countReachedLimit;
            draft.deletedGraph = (_a = payload.deletedGraph) !== null && _a !== void 0 ? _a : {};
            draft.logIps = (_b = payload.ips) !== null && _b !== void 0 ? _b : [];
            draft.fetchLogParams = params;
        }
    },
    failureStateProducer: (draft, { payload }) => {
        draft.fetchLogsError = payload;
        draft.deletedGraph = {};
        draft.logIps = [];
    },
    endStateProducer: (draft) => {
        delete draft.isFetchingLogs;
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.FETCH_DELETED_GRAPH,
    authenticated: true,
    loggableType: "fetchLogsAction",
    stateProducer: (draft, { payload }) => {
        draft.isFetchingDeletedGraph = true;
        delete draft.fetchDeletedGraphError;
    },
    successStateProducer: (draft, { payload }) => {
        draft.deletedGraph = Object.assign(Object.assign({}, draft.deletedGraph), payload.deletedGraph);
    },
    failureStateProducer: (draft, { payload }) => {
        draft.fetchDeletedGraphError = payload;
    },
    endStateProducer: (draft) => {
        delete draft.isFetchingDeletedGraph;
    },
});
//# sourceMappingURL=logs.js.map