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
const status_1 = require("../lib/status");
const client_1 = require("@envkey/core/lib/client");
const object_1 = require("@envkey/core/lib/utils/object");
const graph_1 = require("../lib/graph");
const graph_2 = require("@envkey/core/lib/graph");
const envs_1 = require("../lib/envs");
const logger_1 = require("@envkey/core/lib/utils/logger");
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "asyncClientAction", serialAction: true, actionType: types_1.Client.ActionType.RBAC_UPDATE_ORG_ROLE }, status_1.updateObjectProducers), { apiActionCreator: async (payload) => ({
        action: {
            type: types_1.Api.ActionType.RBAC_UPDATE_ORG_ROLE,
            payload,
        },
    }), successHandler: async (state, action, res, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await (0, envs_1.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
        await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.CLEAR_CACHED }, context);
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "asyncClientAction", serialAction: true, actionType: types_1.Client.ActionType.RBAC_UPDATE_APP_ROLE }, status_1.updateObjectProducers), { apiActionCreator: async (payload) => ({
        action: {
            type: types_1.Api.ActionType.RBAC_UPDATE_APP_ROLE,
            payload,
        },
    }), successHandler: async (state, action, res, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await (0, envs_1.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
        await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.CLEAR_CACHED }, context);
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "asyncClientAction", serialAction: true, actionType: types_1.Client.ActionType.RBAC_UPDATE_ENVIRONMENT_ROLE }, status_1.updateObjectProducers), { apiActionCreator: async (payload) => ({
        action: {
            type: types_1.Api.ActionType.RBAC_UPDATE_ENVIRONMENT_ROLE,
            payload,
        },
    }) }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "asyncClientAction", serialAction: true, actionType: types_1.Client.ActionType.RBAC_CREATE_ENVIRONMENT_ROLE }, (0, status_1.statusProducers)("isCreatingRbacEnvironmentRole", "createRbacEnvironmentRoleError")), { apiActionCreator: async (payload) => ({
        action: {
            type: types_1.Api.ActionType.RBAC_CREATE_ENVIRONMENT_ROLE,
            payload,
        },
    }), successHandler: async (state, action, res, context) => {
        const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        await (0, envs_1.initEnvironmentsIfNeeded)(state, auth.userId, context).catch((err) => {
            (0, logger_1.log)("Error initializing locals", { err });
        });
        await (0, handler_1.dispatch)({ type: types_1.Client.ActionType.CLEAR_CACHED }, context);
    } }));
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    serialAction: true,
    actionType: types_1.Client.ActionType.INCLUDE_APP_ROLES,
    stateProducer: (draft, { payload }) => {
        for (let { appId, appRoleId } of payload) {
            draft.isIncludingAppRoles = R.assocPath([appId, appRoleId], true, draft.isIncludingAppRoles);
            draft.includeAppRoleErrors = (0, object_1.stripEmptyRecursive)(R.dissocPath([appId, appRoleId], draft.includeAppRoleErrors));
        }
    },
    failureStateProducer: (draft, { meta: { rootAction }, payload }) => {
        for (let { appId, appRoleId } of rootAction.payload) {
            draft.includeAppRoleErrors = R.assocPath([appId, appRoleId], payload, draft.includeAppRoleErrors);
        }
    },
    endStateProducer: (draft, { meta: { rootAction } }) => {
        for (let { appId, appRoleId } of rootAction.payload) {
            draft.isIncludingAppRoles = (0, object_1.stripEmptyRecursive)(R.dissocPath([appId, appRoleId], draft.isIncludingAppRoles));
        }
    },
    bulkApiDispatcher: true,
    apiActionCreator: async (payload) => ({
        action: {
            type: types_1.Api.ActionType.RBAC_CREATE_INCLUDED_APP_ROLE,
            payload: (0, object_1.pick)(["appId", "appRoleId"], payload),
        },
    }),
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RBAC_CREATE_ORG_ROLE, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isCreatingRbacOrgRole", "createRbacOrgRoleError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RBAC_DELETE_ORG_ROLE, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.RBAC_UPDATE_ORG_ROLE,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    graphProposer: ({ payload }) => (0, graph_2.getUpdateOrgRoleProducer)(payload, Date.now()),
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RBAC_CREATE_APP_ROLE, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isCreatingRbacAppRole", "createRbacAppRoleError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RBAC_DELETE_APP_ROLE, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.RBAC_UPDATE_APP_ROLE,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    graphProposer: ({ payload }) => (0, graph_2.getUpdateAppRoleProducer)(payload, Date.now()),
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.RBAC_CREATE_ENVIRONMENT_ROLE,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RBAC_DELETE_ENVIRONMENT_ROLE, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.RBAC_UPDATE_ENVIRONMENT_ROLE,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    graphProposer: ({ payload }) => (0, graph_2.getUpdateEnvironmentRoleProducer)(payload, Date.now()),
});
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RBAC_UPDATE_ENVIRONMENT_ROLE_SETTINGS, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.updateSettingsProducers));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.RBAC_REORDER_ENVIRONMENT_ROLES, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isReorderingEnvironmentRoles", "reorderEnvironmentRolesError")));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.DELETE_INCLUDED_APP_ROLE, loggableType: "orgAction", authenticated: true, graphAction: true, serialAction: true }, status_1.removeObjectProducers), { graphProposer: graph_1.deleteProposer }));
//# sourceMappingURL=rbac.js.map