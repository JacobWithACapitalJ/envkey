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
const object_1 = require("@envkey/core/lib/utils/object");
const status_1 = require("../lib/status");
const graph_1 = require("../lib/graph");
const client_1 = require("@envkey/core/lib/client");
const g = __importStar(require("@envkey/core/lib/graph"));
const graph_2 = require("@envkey/core/lib/graph");
const logger_1 = require("@envkey/core/lib/utils/logger");
const envs_1 = require("../lib/envs");
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.CREATE_GROUP_MEMBERSHIPS,
    serialAction: true,
    stateProducer: (draft, { payload }) => {
        for (let path of createMembershipStatusPaths(payload)) {
            draft.isCreatingGroupMemberships = R.assocPath(path, true, draft.isCreatingGroupMemberships);
            draft.createGroupMembershipErrors = R.dissocPath(path, draft.createGroupMembershipErrors);
        }
        draft.createGroupMembershipErrors = (0, object_1.stripEmptyRecursive)(draft.createGroupMembershipErrors);
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        for (let path of createMembershipStatusPaths(rootAction.payload)) {
            draft.createGroupMembershipErrors = R.assocPath(path, {
                error: payload,
                payload: rootAction.payload,
            }, draft.createGroupMembershipErrors);
        }
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        for (let path of createMembershipStatusPaths(rootAction.payload)) {
            draft.isCreatingGroupMemberships = R.dissocPath(path, draft.isCreatingGroupMemberships);
        }
        draft.isCreatingGroupMemberships = (0, object_1.stripEmptyRecursive)(draft.isCreatingGroupMemberships);
    },
    bulkApiDispatcher: true,
    apiActionCreator: async (payload) => ({
        action: {
            type: types_1.Api.ActionType.CREATE_GROUP_MEMBERSHIP,
            payload: (0, object_1.pick)(["groupId", "objectId", "orderIndex"], payload),
        },
    }),
    successHandler: async (state, action, res, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await (0, envs_1.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
        await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.CLEAR_CACHED }, context);
    },
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_GROUP_MEMBERSHIP,
    bulkDispatchOnly: true,
    graphProposer: ({ payload: { groupId, objectId, orderIndex } }) => (graphDraft) => {
        const now = Date.now(), proposalId = [groupId, objectId].join("|"), group = graphDraft[groupId];
        graphDraft[proposalId] = {
            type: "groupMembership",
            id: proposalId,
            groupId,
            objectId,
            orderIndex: group.objectType == "block" ? now : undefined,
            createdAt: now,
            updatedAt: now,
        };
    },
    encryptedKeysScopeFn: (graph, { payload: { groupId, objectId } }) => g.getOrgAccessScopeForGroupMembership(graph, groupId, objectId),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_GROUP,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    serialAction: true,
    stateProducer: (draft, { payload: { objectType } }) => {
        draft.isCreatingGroup[objectType] = true;
        delete draft.createGroupErrors[objectType];
    },
    failureStateProducer: (draft, { meta: { rootAction: { payload: { objectType }, }, }, payload, }) => {
        draft.createGroupErrors[objectType] = payload;
    },
    endStateProducer: (draft, { meta: { rootAction: { payload: { objectType }, }, }, }) => {
        delete draft.isCreatingGroup[objectType];
    },
});
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_GROUP, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: ({ payload: { id } }) => g.getDeleteGroupProducer(id, Date.now()), encryptedKeysScopeFn: (graph, { payload: { id } }) => (0, graph_2.getOrgAccessScopeForGroupMembers)(graph, id) }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_GROUP_MEMBERSHIP, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { groupId, objectId } = graph[id];
        return (0, graph_2.getOrgAccessScopeForGroupMembership)(graph, groupId, objectId);
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_APP_USER_GROUP, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { appId, userGroupId } = graph[id];
        return (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, userGroupId), {
            envParentIds: new Set([
                appId,
                ...(0, graph_2.getConnectedBlocksForApp)(graph, appId).map(R.prop("id")),
            ]),
        });
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_APP_GROUP_USER, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { userId, appGroupId } = graph[id];
        return (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, appGroupId, true), {
            userIds: new Set([userId]),
        });
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_APP_GROUP_USER_GROUP, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { userGroupId, appGroupId } = graph[id];
        return (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, appGroupId, true), (0, graph_2.getOrgAccessScopeForGroupMembers)(graph, userGroupId));
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_APP_BLOCK_GROUP, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { appId, blockGroupId } = graph[id];
        const scope = (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, blockGroupId), {
            userIds: "all",
            keyableParentIds: "all",
            envParentIds: new Set([appId]),
        });
        return scope;
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_APP_GROUP_BLOCK, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { appGroupId, blockId } = graph[id];
        return (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, appGroupId), {
            userIds: "all",
            keyableParentIds: "all",
            envParentIds: new Set([blockId]),
        });
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_APP_GROUP_BLOCK_GROUP, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { blockGroupId, appGroupId } = graph[id];
        return (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, appGroupId), (0, graph_2.getOrgAccessScopeForGroupMembers)(graph, blockGroupId), {
            userIds: "all",
            keyableParentIds: "all",
        });
    } }));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REORDER_APP_BLOCK_GROUPS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.reorderStatusProducers)("appBlockGroup")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REORDER_APP_GROUP_BLOCKS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.reorderStatusProducers)("appGroupBlock")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REORDER_APP_GROUP_BLOCK_GROUPS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.reorderStatusProducers)("appGroupBlockGroup")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REORDER_GROUP_MEMBERSHIPS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.reorderStatusProducers)("groupMembership")));
const createMembershipStatusPaths = (payload) => {
    const res = [];
    for (let { groupId, objectId } of payload) {
        res.push([groupId, objectId], [objectId, groupId]);
    }
    return res;
};
//# sourceMappingURL=groups.js.map