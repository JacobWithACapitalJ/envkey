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
const graph_1 = require("../lib/graph");
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const object_1 = require("@envkey/core/lib/utils/object");
const client_1 = require("@envkey/core/lib/client");
const status_1 = require("../lib/status");
const logger_1 = require("@envkey/core/lib/utils/logger");
const graph_2 = require("@envkey/core/lib/graph");
const envs_1 = require("../lib/envs");
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "asyncClientAction", actionType: types_1.Client.ActionType.CREATE_BLOCK, serialAction: true }, (0, status_1.statusProducers)("isCreatingBlock", "createBlockError")), { handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const res = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.CREATE_BLOCK,
            payload: action.payload,
        }, context);
        if (res.success) {
            return dispatchSuccess(null, context);
        }
        else {
            return dispatchFailure((_a = res.resultAction) === null || _a === void 0 ? void 0 : _a.payload, context);
        }
    }, successHandler: async (state, action, res, context) => {
        var _a;
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const block = R.last(R.sortBy(R.prop("createdAt"), (0, graph_2.graphTypes)(state.graph).blocks));
        const environmentIds = ((_a = (0, graph_2.getEnvironmentsByEnvParentId)(state.graph)[block.id]) !== null && _a !== void 0 ? _a : []).map(R.prop("id"));
        const { orgUsers, cliUsers } = (0, graph_2.graphTypes)(state.graph);
        const localIds = [...orgUsers, ...cliUsers]
            .filter((user) => graph_2.authz.canUpdateLocals(state.graph, auth.userId, block.id, user.id))
            .map((user) => `${block.id}|${user.id}`);
        await (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.COMMIT_ENVS,
            payload: {
                pendingEnvironmentIds: environmentIds.concat(localIds),
                initEnvs: true,
            },
        }, context);
    } }));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_BLOCK,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RENAME_BLOCK, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.renameObjectProducers));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.UPDATE_BLOCK_SETTINGS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.updateSettingsProducers));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_BLOCK, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { encryptedKeysScopeFn: (graph, { payload: { id } }) => ({
        envParentIds: new Set([id]),
        userIds: "all",
        keyableParentIds: "all",
    }) }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DISCONNECT_BLOCK, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { appId, blockId } = graph[id];
        return {
            envParentIds: new Set([appId, blockId]),
            userIds: "all",
            keyableParentIds: "all",
        };
    } }));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REORDER_BLOCKS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.reorderStatusProducers)("appBlock")));
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CONNECT_BLOCKS,
    serialAction: true,
    stateProducer: (draft, { payload }) => {
        for (let path of connectBlockStatusPaths(payload)) {
            draft.isConnectingBlocks = R.assocPath(path, true, draft.isConnectingBlocks);
            draft.connectBlocksErrors = R.dissocPath(path, draft.connectBlocksErrors);
        }
        draft.connectBlocksErrors = (0, object_1.stripEmptyRecursive)(draft.connectBlocksErrors);
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        for (let path of connectBlockStatusPaths(rootAction.payload)) {
            draft.connectBlocksErrors = R.assocPath(path, {
                error: payload,
                payload: rootAction.payload,
            }, draft.connectBlocksErrors);
        }
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        for (let path of connectBlockStatusPaths(rootAction.payload)) {
            draft.isConnectingBlocks = R.dissocPath(path, draft.isConnectingBlocks);
        }
        draft.isConnectingBlocks = (0, object_1.stripEmptyRecursive)(draft.isConnectingBlocks);
    },
    bulkApiDispatcher: true,
    apiActionCreator: async (payload) => {
        const { appId, blockId, appGroupId, blockGroupId } = payload;
        let actionType;
        if (appId && blockId) {
            actionType = types_1.Api.ActionType.CONNECT_BLOCK;
        }
        else if (appId && blockGroupId) {
            actionType = types_1.Api.ActionType.CREATE_APP_BLOCK_GROUP;
        }
        else if (appGroupId && blockId) {
            actionType = types_1.Api.ActionType.CREATE_APP_GROUP_BLOCK;
        }
        else if (appGroupId && blockGroupId) {
            actionType = types_1.Api.ActionType.CREATE_APP_GROUP_BLOCK_GROUP;
        }
        return {
            action: {
                type: actionType,
                payload: (0, object_1.pickDefined)(["appId", "appGroupId", "blockId", "blockGroupId", "orderIndex"], payload),
            },
        };
    },
    successHandler: async (state, action, res, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await (0, envs_1.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
        if (action.payload.clearCached) {
            await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.CLEAR_CACHED }, context);
        }
    },
});
const getGraphProposer = (objectType) => (action) => (graphDraft) => {
    const now = Date.now(), { appId, appGroupId, blockId, blockGroupId } = action.payload, proposalId = [appId, appGroupId, blockId, blockGroupId]
        .filter(Boolean)
        .join("|"), object = Object.assign({ type: objectType, id: proposalId, createdAt: now, updatedAt: now }, (0, object_1.pickDefined)(["appId", "appGroupId", "blockId", "blockGroupId", "orderIndex"], action.payload));
    graphDraft[proposalId] = object;
};
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CONNECT_BLOCK,
    bulkDispatchOnly: true,
    graphProposer: getGraphProposer("appBlock"),
    encryptedKeysScopeFn: (graph, { payload: { appId, blockId } }) => ({
        envParentIds: new Set([appId, blockId]),
        userIds: "all",
        keyableParentIds: "all",
    }),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_APP_BLOCK_GROUP,
    bulkDispatchOnly: true,
    graphProposer: getGraphProposer("appBlockGroup"),
    encryptedKeysScopeFn: (graph, { payload: { appId, blockGroupId } }) => (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, blockGroupId), {
        userIds: "all",
        keyableParentIds: "all",
        envParentIds: new Set([appId]),
    }),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_APP_GROUP_BLOCK,
    bulkDispatchOnly: true,
    graphProposer: getGraphProposer("appGroupBlock"),
    encryptedKeysScopeFn: (graph, { payload: { blockId, appGroupId } }) => (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, appGroupId), {
        userIds: "all",
        keyableParentIds: "all",
        envParentIds: new Set([blockId]),
    }),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_APP_GROUP_BLOCK_GROUP,
    bulkDispatchOnly: true,
    graphProposer: getGraphProposer("appGroupBlockGroup"),
    encryptedKeysScopeFn: (graph, { payload: { blockGroupId, appGroupId } }) => (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, appGroupId), (0, graph_2.getOrgAccessScopeForGroupMembers)(graph, blockGroupId), {
        userIds: "all",
        keyableParentIds: "all",
    }),
});
const connectBlockStatusPaths = (payload) => {
    const res = [];
    // index status by both app and block
    for (let params of payload) {
        let appTargetId, blockTargetId;
        if ("appId" in params) {
            appTargetId = params.appId;
        }
        else {
            appTargetId = params.appGroupId;
        }
        if ("blockId" in params) {
            blockTargetId = params.blockId;
        }
        else {
            blockTargetId = params.blockGroupId;
        }
        res.push([appTargetId, blockTargetId], [blockTargetId, appTargetId]);
    }
    return res;
};
//# sourceMappingURL=blocks.js.map