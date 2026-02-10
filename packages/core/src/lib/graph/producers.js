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
exports.getUpdateEnvironmentRoleProducer = exports.getUpdateAppRoleProducer = exports.getUpdateOrgRoleProducer = exports.deleteExpiredAuthObjects = exports.getDeleteExpiredAuthObjectsProducer = exports.deleteGraphObjects = exports.getDeleteGraphObjectsProducer = exports.getDeleteKeyableParentProducer = exports.getDeleteEnvironmentProducer = exports.getDeleteGroupProducer = exports.getDeleteBlockProducer = exports.getDeleteAppProducer = void 0;
const uuid_1 = require("uuid");
const immer_1 = __importDefault(require("immer"));
const _1 = require(".");
const R = __importStar(require("ramda"));
const object_1 = require("../utils/object");
const array_1 = require("../utils/array");
const base_1 = require("./base");
const getDeleteAppProducer = (id, now) => (graphDraft) => {
    (0, exports.getDeleteGraphObjectsProducer)([id, ...(0, _1.getDeleteAppAssociations)(graphDraft, id).map(R.prop("id"))], now)(graphDraft);
}, getDeleteBlockProducer = (id, now) => (graphDraft) => {
    (0, exports.getDeleteGraphObjectsProducer)([id, ...(0, _1.getDeleteBlockAssociations)(graphDraft, id).map(R.prop("id"))], now)(graphDraft);
}, getDeleteGroupProducer = (id, now) => (graphDraft) => {
    (0, exports.getDeleteGraphObjectsProducer)([id, ...(0, _1.getDeleteGroupAssociations)(graphDraft, id).map(R.prop("id"))], now)(graphDraft);
}, getDeleteEnvironmentProducer = (id, now) => (graphDraft) => {
    (0, exports.getDeleteGraphObjectsProducer)([
        id,
        ...(0, _1.getDeleteEnvironmentAssociations)(graphDraft, id).map(R.prop("id")),
    ], now)(graphDraft);
}, getDeleteKeyableParentProducer = (id, now) => (graphDraft) => {
    (0, exports.getDeleteGraphObjectsProducer)([
        id,
        ...(0, _1.getDeleteKeyableParentAssociations)(graphDraft, id).map(R.prop("id")),
    ], now)(graphDraft);
}, getDeleteGraphObjectsProducer = (ids, now) => (graphDraft) => {
    let deletedServerEnvkeys = 0;
    for (let id of ids) {
        const obj = graphDraft[id];
        if (obj.type == "generatedEnvkey" &&
            obj.keyableParentType == "server") {
            deletedServerEnvkeys++;
        }
        graphDraft[id].deletedAt = now;
    }
    if (deletedServerEnvkeys > 0) {
        const org = (0, base_1.getOrg)(graphDraft);
        org.serverEnvkeyCount -= deletedServerEnvkeys;
        org.updatedAt = now;
    }
}, deleteGraphObjects = (graph, ids, now) => (0, immer_1.default)(graph, (0, exports.getDeleteGraphObjectsProducer)(ids, now)), getDeleteExpiredAuthObjectsProducer = (graph, now) => (graphDraft) => {
    // for invites and deviceGrants, we want to keep only the latest expired object per user, and delete any older ones
    const expiredFilterFn = ({ acceptedAt, expiresAt, deletedAt, }) => !acceptedAt && !deletedAt && now >= expiresAt;
    const byType = (0, _1.graphTypes)(graph), authObjects = [
        (0, array_1.groupBy)(R.prop("inviteeId"), byType.invites.filter(expiredFilterFn)),
        (0, array_1.groupBy)(R.prop("granteeId"), byType.deviceGrants.filter(expiredFilterFn)),
    ], toDeleteIds = R.flatten(authObjects.map((objectsByUserId) => R.flatten(Object.values(R.map((objects) => R.tail(R.sortBy(({ expiresAt }) => -expiresAt, objects)).map(R.prop("id")), objectsByUserId)))));
    (0, exports.getDeleteGraphObjectsProducer)(toDeleteIds, now)(graphDraft);
    if (toDeleteIds.length > 0) {
        const org = (0, base_1.getOrg)(graphDraft);
        org.activeUserOrInviteCount = (0, _1.getNumActiveOrInvitedUsers)(graphDraft, now);
        org.updatedAt = now;
    }
}, deleteExpiredAuthObjects = (graph, now) => (0, immer_1.default)(graph, (0, exports.getDeleteExpiredAuthObjectsProducer)(graph, now)), getUpdateOrgRoleProducer = (params, now) => (graphDraft) => {
    const orgRole = graphDraft[params.id];
    let toUpdate = params;
    if (orgRole.isDefault) {
        toUpdate = (0, object_1.pickDefined)(["name", "description"], toUpdate);
    }
    graphDraft[orgRole.id] = Object.assign(Object.assign(Object.assign({}, orgRole), toUpdate), { updatedAt: now });
    if (params.canBeManagedByOrgRoleIds) {
        for (let managingOrgRoleId of params.canBeManagedByOrgRoleIds) {
            const managingOrgRoleDraft = graphDraft[managingOrgRoleId];
            if (!managingOrgRoleDraft.canManageAllOrgRoles &&
                !managingOrgRoleDraft.canManageOrgRoleIds.includes(orgRole.id)) {
                managingOrgRoleDraft.canManageOrgRoleIds.push(orgRole.id);
                managingOrgRoleDraft.updatedAt = now;
            }
        }
    }
    if (params.canBeInvitedByOrgRoleIds) {
        for (let invitingOrgRoleId of params.canBeInvitedByOrgRoleIds) {
            const invitingOrgRoleDraft = graphDraft[invitingOrgRoleId];
            if (!invitingOrgRoleDraft.canInviteAllOrgRoles &&
                !invitingOrgRoleDraft.canInviteOrgRoleIds.includes(orgRole.id)) {
                invitingOrgRoleDraft.canInviteOrgRoleIds.push(orgRole.id);
                invitingOrgRoleDraft.updatedAt = now;
            }
        }
    }
    const orphanedLocalKeyIds = (0, _1.getOrphanedLocalKeyIds)(graphDraft);
    if (orphanedLocalKeyIds.length > 0) {
        (0, exports.getDeleteGraphObjectsProducer)(orphanedLocalKeyIds, now)(graphDraft);
    }
    const orphanedRecoveryKeyIds = (0, _1.getOrphanedRecoveryKeyIds)(graphDraft);
    if (orphanedRecoveryKeyIds.length > 0) {
        (0, exports.getDeleteGraphObjectsProducer)(orphanedRecoveryKeyIds, now)(graphDraft);
    }
}, getUpdateAppRoleProducer = (params, now) => (graphDraft) => {
    const appRole = graphDraft[params.id], keys = (appRole.isDefault
        ? ["name", "description"]
        : [
            "name",
            "description",
            "defaultAllApps",
            "canInviteAllAppRoles",
            "canManageAppRoleIds",
            "canInviteAppRoleIds",
            "hasFullEnvironmentPermissions",
            "permissions",
            "extendsRoleId",
            "addPermissions",
            "removePermissions",
        ]).filter((k) => k in params);
    graphDraft[appRole.id] = Object.assign(Object.assign(Object.assign({}, appRole), (0, object_1.pickDefined)(keys, params)), { updatedAt: now });
    if (!appRole.isDefault && params.canBeManagedByAppRoleIds) {
        for (let managingAppRoleId of params.canBeManagedByAppRoleIds) {
            const managingAppRoleDraft = graphDraft[managingAppRoleId];
            if (!managingAppRoleDraft.canManageAppRoleIds.includes(appRole.id)) {
                managingAppRoleDraft.canManageAppRoleIds.push(appRole.id);
                managingAppRoleDraft.updatedAt = now;
            }
        }
    }
    if (!appRole.isDefault && params.canBeInvitedByAppRoleIds) {
        for (let invitingAppRoleId of params.canBeInvitedByAppRoleIds) {
            const invitingAppRoleDraft = graphDraft[invitingAppRoleId];
            if (!invitingAppRoleDraft.canInviteAppRoleIds.includes(appRole.id)) {
                invitingAppRoleDraft.canInviteAppRoleIds.push(appRole.id);
                invitingAppRoleDraft.updatedAt = now;
            }
        }
    }
    if (params.appRoleEnvironmentRoles) {
        for (let environmentRoleId in params.appRoleEnvironmentRoles) {
            const appRoleEnvironmentRole = (0, _1.getAppRoleEnvironmentRolesByComposite)(graphDraft)[[appRole.id, environmentRoleId].join("|")], updatedPermissions = params.appRoleEnvironmentRoles[environmentRoleId];
            if (!R.equals(R.clone(appRoleEnvironmentRole.permissions).sort(), R.clone(updatedPermissions).sort())) {
                graphDraft[appRoleEnvironmentRole.id] = Object.assign(Object.assign({}, appRoleEnvironmentRole), { permissions: updatedPermissions, updatedAt: now });
            }
        }
    }
    if (!appRole.isDefault &&
        !appRole.defaultAllApps &&
        "defaultAllApps" in params &&
        params.defaultAllApps) {
        // add included app roles
        const apps = (0, _1.graphTypes)(graphDraft).apps;
        for (let app of apps) {
            const existing = (0, _1.getIncludedAppRolesByComposite)(graphDraft)[[appRole.id, app.id].join("|")];
            if (!existing) {
                const id = (0, uuid_1.v4)(), includedAppRole = {
                    type: "includedAppRole",
                    id,
                    appRoleId: appRole.id,
                    appId: app.id,
                    createdAt: now,
                    updatedAt: now,
                };
                graphDraft[includedAppRole.id] =
                    includedAppRole;
            }
        }
    }
    if (!appRole.isDefault) {
        const orphanedLocalKeyIds = (0, _1.getOrphanedLocalKeyIds)(graphDraft);
        if (orphanedLocalKeyIds) {
            (0, exports.getDeleteGraphObjectsProducer)(orphanedLocalKeyIds, now)(graphDraft);
        }
    }
}, getUpdateEnvironmentRoleProducer = (params, now) => (graphDraft) => {
    const environmentRole = graphDraft[params.id], keys = [
        "name",
        "description",
        "hasLocalKeys",
        "hasServers",
        "defaultAllApps",
        "defaultAllBlocks",
        "settings",
    ].filter((k) => k in params);
    graphDraft[environmentRole.id] = Object.assign(Object.assign(Object.assign({}, environmentRole), (0, object_1.pickDefined)(keys, params)), { updatedAt: now });
    if (!environmentRole.isDefault &&
        !environmentRole.defaultAllApps &&
        params.defaultAllApps) {
        // add app environments
        (0, _1.graphTypes)(graphDraft).apps.forEach((app) => {
            var _a;
            const existingEnvironmentForRole = (0, array_1.indexBy)(R.prop("environmentRoleId"), (_a = (0, _1.getEnvironmentsByEnvParentId)(graphDraft)[app.id]) !== null && _a !== void 0 ? _a : [])[environmentRole.id];
            if (!existingEnvironmentForRole) {
                const id = (0, uuid_1.v4)(), environment = {
                    type: "environment",
                    id,
                    envParentId: app.id,
                    environmentRoleId: environmentRole.id,
                    envUpdatedAt: now,
                    isSub: false,
                    settings: {},
                    createdAt: now,
                    updatedAt: now,
                };
                graphDraft[environment.id] = environment;
            }
        });
    }
    if (!environmentRole.isDefault &&
        !environmentRole.defaultAllBlocks &&
        params.defaultAllBlocks) {
        // add block environments
        (0, _1.graphTypes)(graphDraft).blocks.forEach((block) => {
            var _a;
            const existingEnvironmentForRole = (0, array_1.indexBy)(R.prop("environmentRoleId"), (_a = (0, _1.getEnvironmentsByEnvParentId)(graphDraft)[block.id]) !== null && _a !== void 0 ? _a : [])[environmentRole.id];
            if (!existingEnvironmentForRole) {
                const id = (0, uuid_1.v4)(), environment = {
                    type: "environment",
                    id,
                    envParentId: block.id,
                    environmentRoleId: environmentRole.id,
                    envUpdatedAt: now,
                    isSub: false,
                    settings: {},
                    createdAt: now,
                    updatedAt: now,
                };
                graphDraft[environment.id] = environment;
            }
        });
    }
    if (params.appRoleEnvironmentRoles) {
        for (let appRoleId in params.appRoleEnvironmentRoles) {
            const appRole = graphDraft[appRoleId];
            if (appRole.hasFullEnvironmentPermissions) {
                continue;
            }
            const appRoleEnvironmentRole = (0, _1.getAppRoleEnvironmentRolesByComposite)(graphDraft)[[appRoleId, environmentRole.id].join("|")], updatedPermissions = params.appRoleEnvironmentRoles[appRoleId];
            if (!R.equals(R.clone(appRoleEnvironmentRole.permissions).sort(), R.clone(updatedPermissions).sort())) {
                graphDraft[appRoleEnvironmentRole.id] = Object.assign(Object.assign({}, appRoleEnvironmentRole), { permissions: updatedPermissions, updatedAt: now });
            }
        }
    }
    let toDeleteIds = [];
    if (environmentRole.hasLocalKeys &&
        "hasLocalKeys" in params &&
        !params.hasLocalKeys) {
        // delete all connected local keys
        const localKeysByEnvironmentId = (0, _1.getLocalKeysByEnvironmentId)(graphDraft), environments = (0, _1.getEnvironmentsByRoleId)(graphDraft)[environmentRole.id] || [];
        for (let environment of environments) {
            const localKeys = localKeysByEnvironmentId[environment.id] || [];
            toDeleteIds = toDeleteIds.concat(localKeys.map(R.prop("id")));
        }
    }
    if (environmentRole.hasServers &&
        "hasServers" in params &&
        !params.hasServers) {
        // delete all connected servers
        const serversByEnvironmentId = (0, _1.getServersByEnvironmentId)(graphDraft), environments = (0, _1.getEnvironmentsByRoleId)(graphDraft)[environmentRole.id] || [];
        for (let environment of environments) {
            const servers = serversByEnvironmentId[environment.id] || [];
            toDeleteIds = toDeleteIds.concat(servers.map(R.prop("id")));
        }
    }
    if (toDeleteIds.length > 0) {
        (0, exports.getDeleteGraphObjectsProducer)(toDeleteIds, now)(graphDraft);
    }
    return graphDraft;
};
exports.getDeleteAppProducer = getDeleteAppProducer, exports.getDeleteBlockProducer = getDeleteBlockProducer, exports.getDeleteGroupProducer = getDeleteGroupProducer, exports.getDeleteEnvironmentProducer = getDeleteEnvironmentProducer, exports.getDeleteKeyableParentProducer = getDeleteKeyableParentProducer, exports.getDeleteGraphObjectsProducer = getDeleteGraphObjectsProducer, exports.deleteGraphObjects = deleteGraphObjects, exports.getDeleteExpiredAuthObjectsProducer = getDeleteExpiredAuthObjectsProducer, exports.deleteExpiredAuthObjects = deleteExpiredAuthObjects, exports.getUpdateOrgRoleProducer = getUpdateOrgRoleProducer, exports.getUpdateAppRoleProducer = getUpdateAppRoleProducer, exports.getUpdateEnvironmentRoleProducer = getUpdateEnvironmentRoleProducer;
//# sourceMappingURL=producers.js.map