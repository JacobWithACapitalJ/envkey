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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("../lib/graph");
const object_1 = require("@envkey/core/lib/utils/object");
const client_1 = require("@envkey/core/lib/client");
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const status_1 = require("../lib/status");
const graph_2 = require("@envkey/core/lib/graph");
const logger_1 = require("@envkey/core/lib/utils/logger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const envs_1 = require("../lib/envs");
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "asyncClientAction", actionType: types_1.Client.ActionType.CREATE_APP, serialAction: true }, (0, status_1.statusProducers)("isCreatingApp", "createAppError")), { handler: async (state, action, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const res = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.CREATE_APP,
            payload: R.omit(["path"], action.payload),
        }, context);
        if (res.success) {
            if (action.payload.path) {
                const app = (0, graph_2.graphTypes)(res.state.graph).apps.find(R.propEq("createdAt", res.state.graphUpdatedAt));
                try {
                    await new Promise((resolve, reject) => fs_1.default.writeFile(path_1.default.join(action.payload.path, ".envkey"), JSON.stringify({ orgId: auth.orgId, appId: app.id }), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    }));
                }
                catch (err) {
                    (0, logger_1.log)("Couldn't create new app .envkey config file", {
                        path: action.payload.path,
                        err,
                    });
                }
            }
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
        const app = R.last(R.sortBy(R.prop("createdAt"), (0, graph_2.graphTypes)(state.graph).apps));
        const environmentIds = ((_a = (0, graph_2.getEnvironmentsByEnvParentId)(state.graph)[app.id]) !== null && _a !== void 0 ? _a : []).map(R.prop("id"));
        const { orgUsers, cliUsers } = (0, graph_2.graphTypes)(state.graph);
        const localIds = [...orgUsers, ...cliUsers]
            .filter((user) => graph_2.authz.canUpdateLocals(state.graph, auth.userId, app.id, user.id))
            .map((user) => `${app.id}|${user.id}`);
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
    actionType: types_1.Api.ActionType.CREATE_APP,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RENAME_APP, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.renameObjectProducers));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.UPDATE_APP_SETTINGS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.updateSettingsProducers));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.SET_APP_ALLOWED_IPS, loggableType: "orgAction", loggableType2: "updateFirewallAction", authenticated: true, graphAction: true, serialAction: true }, status_1.updateFirewallProducers));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_APP, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: ({ payload: { id } }) => (0, graph_2.getDeleteAppProducer)(id, Date.now()), encryptedKeysScopeFn: (graph, { payload: { id } }) => ({
        envParentIds: new Set([
            id,
            ...(0, graph_2.getConnectedBlocksForApp)(graph, id).map(R.prop("id")),
        ]),
        userIds: "all",
        keyableParentIds: "all",
    }) }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.REMOVE_APP_ACCESS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer, encryptedKeysScopeFn: (graph, { payload: { id } }) => {
        const { appId, userId } = graph[id];
        return {
            envParentIds: new Set([
                appId,
                ...(0, graph_2.getConnectedBlocksForApp)(graph, appId).map(R.prop("id")),
            ]),
            userIds: new Set([userId]),
            environmentIds: "all",
            keyableParentIds: "all",
        };
    } }));
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.GRANT_APPS_ACCESS,
    serialAction: true,
    stateProducer: (draft, { payload }) => {
        for (let path of appAccessStatusPaths(payload)) {
            draft.isGrantingAppAccess = R.assocPath(path, true, draft.isGrantingAppAccess);
            draft.grantAppAccessErrors = R.dissocPath(path, draft.grantAppAccessErrors);
        }
        draft.grantAppAccessErrors = (0, object_1.stripEmptyRecursive)(draft.grantAppAccessErrors);
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        for (let path of appAccessStatusPaths(rootAction.payload)) {
            draft.grantAppAccessErrors = R.assocPath(path, {
                error: payload,
                payload: rootAction.payload,
            }, draft.grantAppAccessErrors);
        }
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        for (let path of appAccessStatusPaths(rootAction.payload)) {
            draft.isGrantingAppAccess = R.dissocPath(path, draft.isGrantingAppAccess);
        }
        draft.isGrantingAppAccess = (0, object_1.stripEmptyRecursive)(draft.isGrantingAppAccess);
    },
    bulkApiDispatcher: true,
    apiActionCreator: async (payload) => {
        const { appId, appGroupId, userId, userGroupId } = payload;
        let actionType;
        if (appId && userId) {
            actionType = types_1.Api.ActionType.GRANT_APP_ACCESS;
        }
        else if (appId && userGroupId) {
            actionType = types_1.Api.ActionType.CREATE_APP_USER_GROUP;
        }
        else if (appGroupId && userId) {
            actionType = types_1.Api.ActionType.CREATE_APP_GROUP_USER;
        }
        else if (appGroupId && userGroupId) {
            actionType = types_1.Api.ActionType.CREATE_APP_GROUP_USER_GROUP;
        }
        return {
            action: {
                type: actionType,
                payload: (0, object_1.pickDefined)([
                    "appId",
                    "appGroupId",
                    "userId",
                    "userGroupId",
                    "appRoleId",
                    "importId",
                ], payload),
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
        await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.CLEAR_CACHED }, context);
    },
});
const getGraphProposer = (objectType) => (action) => (graphDraft) => {
    const now = Date.now(), { appId, appGroupId, userId, userGroupId, appRoleId } = action.payload, proposalId = [appId, appGroupId, userId, userGroupId]
        .filter(Boolean)
        .join("|"), object = Object.assign({ type: objectType, id: proposalId, createdAt: now, updatedAt: now, appRoleId }, (0, object_1.pickDefined)(["appId", "appGroupId", "userId", "userGroupId"], action.payload));
    graphDraft[proposalId] = object;
};
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.GRANT_APP_ACCESS,
    bulkDispatchOnly: true,
    graphProposer: getGraphProposer("appUserGrant"),
    encryptedKeysScopeFn: (graph, { payload: { appId, userId } }) => ({
        envParentIds: new Set([
            appId,
            ...(0, graph_2.getConnectedBlocksForApp)(graph, appId).map(R.prop("id")),
        ]),
        userIds: new Set([userId]),
        environmentIds: "all",
        keyableParentIds: "all",
    }),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_APP_USER_GROUP,
    bulkDispatchOnly: true,
    graphProposer: getGraphProposer("appUserGroup"),
    encryptedKeysScopeFn: (graph, { payload: { appId, userGroupId } }) => (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, userGroupId), {
        envParentIds: new Set([
            appId,
            ...(0, graph_2.getConnectedBlocksForApp)(graph, appId).map(R.prop("id")),
        ]),
    }),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_APP_GROUP_USER,
    bulkDispatchOnly: true,
    graphProposer: getGraphProposer("appGroupUser"),
    encryptedKeysScopeFn: (graph, { payload: { appGroupId, userId } }) => (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, appGroupId, true), {
        userIds: new Set([userId]),
    }),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CREATE_APP_GROUP_USER_GROUP,
    bulkDispatchOnly: true,
    graphProposer: getGraphProposer("appGroupUserGroup"),
    encryptedKeysScopeFn: (graph, { payload: { appGroupId, userGroupId } }) => (0, graph_2.mergeAccessScopes)((0, graph_2.getOrgAccessScopeForGroupMembers)(graph, appGroupId, true), (0, graph_2.getOrgAccessScopeForGroupMembers)(graph, userGroupId)),
});
const appAccessStatusPaths = (payload) => {
    const res = [];
    // index status by both app and user
    for (let params of payload) {
        let appTargetId, userTargetId;
        if ("appId" in params) {
            appTargetId = params.appId;
        }
        else {
            appTargetId = params.appGroupId;
        }
        if ("userId" in params) {
            userTargetId = params.userId;
        }
        else {
            userTargetId = params.userGroupId;
        }
        res.push([appTargetId, params.appRoleId, userTargetId], [userTargetId, params.appRoleId, appTargetId]);
    }
    return res;
};
//# sourceMappingURL=apps.js.map