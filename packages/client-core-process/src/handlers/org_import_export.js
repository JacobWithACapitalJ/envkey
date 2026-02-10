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
const blob_1 = require("@envkey/core/lib/blob");
const object_1 = require("@envkey/core/lib/utils/object");
const client_1 = require("@envkey/core/lib/client");
const R = __importStar(require("ramda"));
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
const status_1 = require("../lib/status");
const g = __importStar(require("@envkey/core/lib/graph"));
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const utils_1 = require("@envkey/core/lib/crypto/utils");
const envs_1 = require("@envkey/client-core-process/lib/envs");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const wait_1 = require("@envkey/core/lib/utils/wait");
const logger_1 = require("@envkey/core/lib/utils/logger");
const status_2 = require("@envkey/client-core-process/lib/envs/status");
const client_2 = require("@envkey/core/lib/client");
const defaults_1 = require("@envkey/core/lib/client/defaults");
const proc_status_worker_1 = require("../proc_status_worker");
const IMPORT_ENVS_BATCH_SIZE = 10;
const updateImportStatus = async (status, context, withDelay = true) => {
    if (process.env.NODE_ENV != "test") {
        (0, logger_1.log)("import status: " + (status !== null && status !== void 0 ? status : "undefined"));
    }
    const res = await (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.SET_IMPORT_ORG_STATUS,
        payload: { status },
    }, context);
    const state = res.state;
    if (res.success) {
        await (0, status_2.updateLocalSocketImportStatusIfNeeded)(state, context);
        if (withDelay) {
            await (0, wait_1.wait)(1500);
        }
    }
    else {
        (0, logger_1.log)("Error updating import status", { res: res.resultAction });
    }
};
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.STARTED_ORG_IMPORT,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    serialAction: true,
});
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.FINISHED_ORG_IMPORT,
    loggableType: "orgAction",
    authenticated: true,
    graphAction: true,
    serialAction: true,
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.V1_CLIENT_ALIVE,
    stateProducer: (draft) => {
        draft.v1ClientAliveAt = Date.now();
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_ORG_IMPORT,
    stateProducer: (draft) => {
        delete draft.unfilteredOrgArchive;
        delete draft.filteredOrgArchive;
        delete draft.decryptOrgArchiveError;
        delete draft.isDecryptingOrgArchive;
        delete draft.isImportingOrg;
        delete draft.importOrgStatus;
        delete draft.importOrgError;
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.DECRYPT_ORG_ARCHIVE,
    stateProducer: (draft) => {
        delete draft.unfilteredOrgArchive;
        delete draft.filteredOrgArchive;
        delete draft.decryptOrgArchiveError;
        draft.isDecryptingOrgArchive = true;
    },
    successStateProducer: (draft, { payload }) => {
        draft.unfilteredOrgArchive = payload.unfiltered;
        draft.filteredOrgArchive = payload.filtered;
    },
    failureStateProducer: (draft, { payload, meta }) => {
        draft.decryptOrgArchiveError = payload;
        if (meta.rootAction.payload.isV1Upgrade) {
            draft.v1UpgradeError = payload;
        }
    },
    endStateProducer: (draft) => {
        delete draft.isDecryptingOrgArchive;
    },
    handler: async (state, { payload }, { context, dispatchSuccess, dispatchFailure }) => {
        var _a;
        const encryptionKey = payload.encryptionKey;
        const filePath = "fileName" in payload
            ? path_1.default.join(os_1.default.homedir(), ".envkey", "archives", payload.fileName)
            : payload.filePath;
        let encrypted;
        let archiveJson;
        let archive;
        try {
            const encryptedJson = await new Promise((resolve, reject) => {
                fs_1.default.readFile(filePath, null, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.toString());
                    }
                });
            });
            try {
                encrypted = JSON.parse(encryptedJson);
            }
            catch (err) {
                (0, logger_1.log)("Error parsing encrypted archive", { err });
                throw new Error("Error parsing encrypted archive");
            }
            try {
                archiveJson = await (0, proxy_1.decryptSymmetricWithKey)({
                    encrypted,
                    encryptionKey,
                });
            }
            catch (err) {
                (0, logger_1.log)("Invalid encryption key", { err });
                throw new Error("Invalid encryption key");
            }
            try {
                archive = JSON.parse(archiveJson);
            }
            catch (err) {
                (0, logger_1.log)("Error parsing decrypted archive", { err });
                throw new Error("Error parsing decrypted archive");
            }
            const existingEmails = new Set([
                ...g.graphTypes(state.graph).orgUsers.map(R.prop("email")),
            ]);
            const alreadyImportedIds = new Set(Object.values(state.graph)
                .map((o) => ("importId" in o ? o.importId : undefined))
                .filter(Boolean));
            const filteredArchive = Object.assign(Object.assign({}, (0, object_1.pick)([
                "schemaVersion",
                "isV1Upgrade",
                "org",
                "defaultOrgRoles",
                "defaultAppRoles",
                "defaultEnvironmentRoles",
                "envs", // have to filter this later with knowledge of id mappings
            ], archive)), { apps: R.sortBy(R.prop("name"), archive.apps.filter((app) => !alreadyImportedIds.has(app.id))), blocks: R.sortBy(R.prop("name"), archive.blocks.filter((block) => !alreadyImportedIds.has(block.id))), appBlocks: archive.appBlocks.filter((appBlock) => !alreadyImportedIds.has([appBlock.appId, appBlock.blockId].join("|"))), nonDefaultEnvironmentRoles: archive.nonDefaultEnvironmentRoles.filter((environmentRole) => !alreadyImportedIds.has(environmentRole.id)), nonDefaultAppRoleEnvironmentRoles: archive.nonDefaultAppRoleEnvironmentRoles.filter((appRoleEnvironmentRole) => !alreadyImportedIds.has(appRoleEnvironmentRole.environmentRoleId)), baseEnvironments: archive.baseEnvironments.filter((environment) => !alreadyImportedIds.has(environment.id)), subEnvironments: archive.subEnvironments.filter((environment) => !alreadyImportedIds.has(environment.id)), localKeys: ((_a = archive.localKeys) !== null && _a !== void 0 ? _a : []).filter((localKey) => !alreadyImportedIds.has([localKey.environmentId, localKey.userId, localKey.name].join("|"))), servers: archive.servers.filter((server) => !alreadyImportedIds.has([server.environmentId, server.name].join("|"))), orgUsers: R.sortBy((ou) => [ou.lastName, ou.firstName].join(" "), archive.orgUsers.filter((orgUser) => !alreadyImportedIds.has(orgUser.id) &&
                    !existingEmails.has(orgUser.email))), cliUsers: R.sortBy(R.prop("name"), archive.cliUsers.filter((cliUser) => !alreadyImportedIds.has(cliUser.id))), appUserGrants: archive.appUserGrants.filter((appUserGrant) => !alreadyImportedIds.has([appUserGrant.appId, appUserGrant.userId].join("|"))) });
            return dispatchSuccess({ unfiltered: archive, filtered: filteredArchive }, context);
        }
        catch (err) {
            return dispatchFailure(err, context);
        }
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.IMPORT_ORG,
    stateProducer: (draft) => {
        draft.isImportingOrg = true;
        delete draft.importOrgServerErrors;
        delete draft.importOrgLocalKeyErrors;
    },
    failureStateProducer: (draft, { payload, meta }) => {
        draft.importOrgError = payload;
        delete draft.unfilteredOrgArchive;
        delete draft.filteredOrgArchive;
        if (meta.rootAction.payload.isV1Upgrade) {
            draft.v1UpgradeStatus = "error";
            draft.v1UpgradeError = payload;
            delete draft.v1IsUpgrading;
            delete draft.v1UpgradeAccountId;
        }
    },
    successStateProducer: (draft, { payload, meta }) => {
        if (meta.rootAction.payload.isV1Upgrade) {
            draft.v1UpgradeStatus = "finished";
        }
        draft.importOrgServerErrors = payload.importOrgServerErrors;
        draft.importOrgLocalKeyErrors = payload.importOrgLocalKeyErrors;
    },
    endStateProducer: (draft) => {
        delete draft.isImportingOrg;
        delete draft.importOrgStatus;
    },
    successHandler: async (state, action, payload, context) => {
        (0, proc_status_worker_1.sendMainToWorkerMessage)({
            type: "v1UpgradeStatus",
            v1UpgradeStatus: state.v1UpgradeStatus,
            generatedInvites: state.generatedInvites,
        });
        await updateImportStatus(state.importOrgStatus, context);
    },
    failureHandler: async (state, action, payload, context) => {
        (0, proc_status_worker_1.sendMainToWorkerMessage)({
            type: "v1UpgradeStatus",
            v1UpgradeStatus: state.v1UpgradeStatus,
        });
        await updateImportStatus(undefined, context);
    },
    handler: async (initialState, { payload: { importOrgUsers, importServers, importLocalKeys, importCliUsers, regenServerKeys, importEnvParentIds, importOrgUserIds, importCliUserIds, isV1UpgradeIntoExistingOrg, v1Upgrade, }, }, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        let state = initialState;
        const auth = (0, client_2.getAuth)(state, context.accountIdOrCliKey);
        if (!auth || ("token" in auth && !auth.token)) {
            throw new Error("Action requires authentication");
        }
        const unfilteredArchive = state.unfilteredOrgArchive;
        const archive = state.filteredOrgArchive;
        if (!archive || !unfilteredArchive) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "Import error",
                    message: "Archive not loaded",
                },
            }, context);
        }
        const byType = g.graphTypes(state.graph);
        const license = byType.license;
        if (byType.org.id == archive.org.id) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "Import error",
                    message: "Cannot import back into the same org",
                },
            }, context);
        }
        let importOrgServerErrors;
        let importOrgLocalKeyErrors;
        const now = Date.now();
        const licenseExpired = license.expiresAt != -1 && now > license.expiresAt;
        if (licenseExpired) {
            return dispatchFailure({
                type: "clientError",
                error: { name: "License error", message: "License expired" },
            }, context);
        }
        await updateImportStatus("Starting import", context);
        const importEnvParentIdsSet = importEnvParentIds
            ? new Set(importEnvParentIds)
            : undefined;
        const importOrgUserIdsSet = importOrgUsers
            ? importOrgUserIds
                ? new Set(importOrgUserIds)
                : undefined
            : new Set();
        const importCliUserIdsSet = importCliUsers
            ? importCliUserIds
                ? new Set(importCliUserIds)
                : undefined
            : new Set();
        const idMap = {};
        // idempotency: pre-fill idMap with objects that were previously imported
        for (let id in state.graph) {
            const o = state.graph[id];
            if ("importId" in o && o.importId) {
                idMap[o.importId] = id;
            }
        }
        // idempotency: add any users with duplicate emails to idMap
        const existingOrgUsersByEmail = R.indexBy(R.prop("email"), byType.orgUsers);
        const duplicateArchiveOrgUsers = unfilteredArchive.orgUsers.filter(({ email }) => Boolean(existingOrgUsersByEmail[email]));
        for (let archiveOrgUser of duplicateArchiveOrgUsers) {
            const existingOrgUser = existingOrgUsersByEmail[archiveOrgUser.email];
            idMap[archiveOrgUser.id] = existingOrgUser.id;
        }
        const archiveOrgUsersById = R.indexBy(R.prop("id"), unfilteredArchive.orgUsers);
        const archiveCliUsersById = R.indexBy(R.prop("id"), unfilteredArchive.cliUsers);
        const filteredAgainArchive = Object.assign(Object.assign({}, (0, object_1.pick)([
            "schemaVersion",
            "isV1Upgrade",
            "org",
            "defaultOrgRoles",
            "defaultAppRoles",
            "defaultEnvironmentRoles",
            "nonDefaultEnvironmentRoles",
            "nonDefaultAppRoleEnvironmentRoles",
            "envs", // have to filter this later with knowledge of id mappings
        ], archive)), { apps: archive.apps.filter((app) => !(importEnvParentIdsSet && !importEnvParentIdsSet.has(app.id))), blocks: archive.blocks.filter((block) => !(importEnvParentIdsSet && !importEnvParentIdsSet.has(block.id))), appBlocks: archive.appBlocks.filter((appBlock) => !(importEnvParentIdsSet &&
                !((importEnvParentIdsSet.has(appBlock.appId) ||
                    idMap[appBlock.appId]) &&
                    (importEnvParentIdsSet.has(appBlock.blockId) ||
                        idMap[appBlock.blockId])))), baseEnvironments: archive.baseEnvironments.filter((environment) => !(importEnvParentIdsSet &&
                !(importEnvParentIdsSet.has(environment.envParentId) ||
                    idMap[environment.envParentId]))), subEnvironments: archive.subEnvironments.filter((environment) => !(importEnvParentIdsSet &&
                !(importEnvParentIdsSet.has(environment.envParentId) ||
                    idMap[environment.envParentId]))), servers: importServers
                ? archive.servers.filter((server) => !(importEnvParentIdsSet &&
                    !(importEnvParentIdsSet.has(server.appId) || idMap[server.appId])))
                : [], localKeys: importLocalKeys && archive.localKeys
                ? archive.localKeys.filter((localKey) => !(importEnvParentIdsSet &&
                    !(importEnvParentIdsSet.has(localKey.appId) ||
                        idMap[localKey.appId])))
                : [], orgUsers: importOrgUsers
                ? archive.orgUsers.filter((orgUser) => !(importOrgUserIdsSet && !importOrgUserIdsSet.has(orgUser.id)))
                : [], cliUsers: importCliUsers
                ? archive.cliUsers.filter((cliUser) => !(importCliUserIdsSet && !importCliUserIdsSet.has(cliUser.id)))
                : [], appUserGrants: archive.appUserGrants.filter((appUserGrant) => {
                // if both the app and the user have already been imported, import the grant
                if (idMap[appUserGrant.appId] && idMap[appUserGrant.userId]) {
                    return true;
                }
                const isOrgUser = idMap[appUserGrant.userId]
                    ? state.graph[idMap[appUserGrant.userId]].type == "orgUser"
                    : Boolean(archiveOrgUsersById[appUserGrant.userId]);
                const isCliUser = !isOrgUser &&
                    (idMap[appUserGrant.userId]
                        ? state.graph[idMap[appUserGrant.userId]].type == "cliUser"
                        : Boolean(archiveCliUsersById[appUserGrant.userId]));
                // if we're selecting a subset of apps and this one isn't included, don't include the grant
                if (importEnvParentIdsSet &&
                    !importEnvParentIdsSet.has(appUserGrant.appId)) {
                    return false;
                }
                // if we're selecting a subset of org users and this one isn't included, don't include the grant
                if (isOrgUser &&
                    (!importOrgUsers ||
                        (importOrgUserIdsSet &&
                            !importOrgUserIdsSet.has(appUserGrant.userId)))) {
                    return false;
                }
                // if we're selecting a subset of cli users and this one isn't included, don't include the grant
                if (isCliUser &&
                    (!importCliUsers ||
                        (importCliUserIdsSet &&
                            !importCliUserIdsSet.has(appUserGrant.userId)))) {
                    return false;
                }
                return true;
            }) });
        const numActiveUserOrInvites = byType.org.activeUserOrInviteCount;
        if (!isV1UpgradeIntoExistingOrg &&
            license.maxUsers &&
            license.maxUsers != -1 &&
            (numActiveUserOrInvites !== null && numActiveUserOrInvites !== void 0 ? numActiveUserOrInvites : 0) +
                filteredAgainArchive.orgUsers.length +
                filteredAgainArchive.cliUsers.length >
                license.maxUsers) {
            return dispatchFailure({
                type: "clientError",
                error: { name: "License error", message: "License limits exceeded" },
            }, context);
        }
        const rolesByComposite = R.indexBy((role) => (role.isDefault ? [role.type, role.defaultName].join("|") : ""), [byType.orgRoles, byType.appRoles, byType.environmentRoles].flat());
        let res = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.STARTED_ORG_IMPORT,
            payload: isV1UpgradeIntoExistingOrg && v1Upgrade
                ? {
                    isV1UpgradeIntoExistingOrg,
                    v1Upgrade,
                }
                : {
                    isV1UpgradeIntoExistingOrg: false,
                },
        }, context);
        if (!res.success) {
            return dispatchFailure((_a = res.resultAction) === null || _a === void 0 ? void 0 : _a.payload, context);
        }
        for (let [type, archiveRoles] of [
            ["orgRole", filteredAgainArchive.defaultOrgRoles],
            ["appRole", filteredAgainArchive.defaultAppRoles],
            ["environmentRole", filteredAgainArchive.defaultEnvironmentRoles],
        ]) {
            for (let archiveRole of archiveRoles) {
                if (!archiveRole.defaultName) {
                    continue;
                }
                const existingRole = rolesByComposite[[type, archiveRole.defaultName].join("|")];
                idMap[archiveRole.id] = existingRole.id;
                if (existingRole.type == "environmentRole" &&
                    "settings" in archiveRole &&
                    !R.equals(existingRole.settings, archiveRole
                        .settings)) {
                    const res = await (0, handler_1.dispatch)({
                        type: types_1.Api.ActionType.RBAC_UPDATE_ENVIRONMENT_ROLE_SETTINGS,
                        payload: {
                            id: existingRole.id,
                            settings: archiveRole.settings,
                        },
                    }, context);
                    if (res.success) {
                        state = res.state;
                    }
                    else {
                        return dispatchFailure((_b = res.resultAction) === null || _b === void 0 ? void 0 : _b.payload, context);
                    }
                }
            }
        }
        // const orgNameNeedsUpdate = filteredArchive.org.name != byType.org.name;
        const orgSettingsNeedUpdate = !byType.org.orgSettingsImported &&
            !R.equals(filteredAgainArchive.org.settings, byType.org.settings);
        if (orgSettingsNeedUpdate) {
            await updateImportStatus("Importing org settings", context);
            const res = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.UPDATE_ORG_SETTINGS,
                payload: filteredAgainArchive.org.settings,
            }, context);
            if (res.success) {
                state = res.state;
            }
            else {
                return dispatchFailure((_c = res.resultAction) === null || _c === void 0 ? void 0 : _c.payload, context);
            }
        }
        if (orgSettingsNeedUpdate &&
            Object.values((_d = filteredAgainArchive.org.environmentRoleIpsAllowed) !== null && _d !== void 0 ? _d : {}).some((ips) => ips && ips.length > 0)) {
            await updateImportStatus("Importing org firewall settings", context);
            const res = await (0, handler_1.dispatch)({
                type: types_1.Api.ActionType.SET_ORG_ALLOWED_IPS,
                payload: {
                    environmentRoleIpsAllowed: R.toPairs((_e = filteredAgainArchive.org.environmentRoleIpsAllowed) !== null && _e !== void 0 ? _e : {}).reduce((agg, [roleId, ips]) => {
                        if (ips) {
                            agg[idMap[roleId]] = ips;
                        }
                        return agg;
                    }, {}),
                },
            }, context);
            if (res.success) {
                state = res.state;
            }
            else {
                return dispatchFailure((_f = res.resultAction) === null || _f === void 0 ? void 0 : _f.payload, context);
            }
        }
        if (filteredAgainArchive.apps.length > 0) {
            await updateImportStatus(`Importing ${filteredAgainArchive.apps.length} app${filteredAgainArchive.apps.length == 1 ? "" : "s"}`, context);
            for (let [i, archiveApp] of filteredAgainArchive.apps.entries()) {
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.CREATE_APP,
                    payload: {
                        name: archiveApp.name,
                        settings: archiveApp.settings,
                        importId: archiveApp.id,
                    },
                }, context);
                if (res.success) {
                    state = res.state;
                    const createdApp = R.last(R.sortBy(R.prop("createdAt"), g.graphTypes(res.state.graph).apps));
                    idMap[archiveApp.id] = createdApp.id;
                    await updateImportStatus(`Imported ${i + 1}/${filteredAgainArchive.apps.length} app${filteredAgainArchive.apps.length == 1 ? "" : "s"}`, context, i == filteredAgainArchive.apps.length - 1);
                }
                else {
                    return dispatchFailure((_g = res.resultAction) === null || _g === void 0 ? void 0 : _g.payload, context);
                }
            }
            const appsWithFirewallSettings = filteredAgainArchive.apps.filter((archiveApp) => {
                var _a, _b;
                return Object.values((_a = archiveApp.environmentRoleIpsAllowed) !== null && _a !== void 0 ? _a : {}).some((ips) => ips && ips.length > 0) ||
                    Object.values((_b = archiveApp.environmentRoleIpsMergeStrategies) !== null && _b !== void 0 ? _b : {}).some(R.identity);
            });
            if (appsWithFirewallSettings.length > 0) {
                await updateImportStatus("Importing app firewall settings", context);
                for (let archiveApp of appsWithFirewallSettings) {
                    const res = await (0, handler_1.dispatch)({
                        type: types_1.Api.ActionType.SET_APP_ALLOWED_IPS,
                        payload: {
                            id: idMap[archiveApp.id],
                            environmentRoleIpsAllowed: R.toPairs((_h = archiveApp.environmentRoleIpsAllowed) !== null && _h !== void 0 ? _h : {}).reduce((agg, [roleId, ips]) => {
                                if (ips) {
                                    agg[idMap[roleId]] = ips;
                                }
                                return agg;
                            }, {}),
                            environmentRoleIpsMergeStrategies: R.toPairs((_j = archiveApp.environmentRoleIpsMergeStrategies) !== null && _j !== void 0 ? _j : {}).reduce((agg, [roleId, strategy]) => {
                                if (strategy) {
                                    agg[idMap[roleId]] = strategy;
                                }
                                return agg;
                            }, {}),
                        },
                    }, context);
                    if (res.success) {
                        state = res.state;
                    }
                    else {
                        return dispatchFailure((_k = res.resultAction) === null || _k === void 0 ? void 0 : _k.payload, context);
                    }
                }
            }
        }
        if (filteredAgainArchive.blocks.length > 0) {
            await updateImportStatus(`Importing ${filteredAgainArchive.blocks.length} block${filteredAgainArchive.blocks.length == 1 ? "" : "s"}`, context);
            for (let [i, archiveBlock] of filteredAgainArchive.blocks.entries()) {
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.CREATE_BLOCK,
                    payload: {
                        name: archiveBlock.name,
                        settings: archiveBlock.settings,
                        importId: archiveBlock.id,
                    },
                }, context);
                if (res.success) {
                    state = res.state;
                    const createdBlock = R.last(R.sortBy(R.prop("createdAt"), g.graphTypes(res.state.graph).blocks));
                    idMap[archiveBlock.id] = createdBlock.id;
                    await updateImportStatus(`Imported ${i + 1}/${filteredAgainArchive.blocks.length} block${filteredAgainArchive.blocks.length == 1 ? "" : "s"}`, context, i == filteredAgainArchive.blocks.length - 1);
                }
                else {
                    return dispatchFailure((_l = res.resultAction) === null || _l === void 0 ? void 0 : _l.payload, context);
                }
            }
        }
        if (filteredAgainArchive.appBlocks.length > 0) {
            await updateImportStatus(`Importing ${filteredAgainArchive.appBlocks.length} app-block connection${filteredAgainArchive.appBlocks.length == 1 ? "" : "s"}`, context);
            const batches = R.splitEvery(25, filteredAgainArchive.appBlocks.filter(({ appId, blockId }) => idMap[appId] && idMap[blockId]));
            for (let [i, batch] of batches.entries()) {
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.CONNECT_BLOCKS,
                    payload: batch.map(({ appId, blockId, orderIndex }, i) => ({
                        appId: idMap[appId],
                        blockId: idMap[blockId],
                        importId: [appId, blockId].join("|"),
                        orderIndex,
                    })),
                }, context);
                if (res.success) {
                    state = res.state;
                    await updateImportStatus(`Imported ${Math.min(i * 25 + batch.length)}/${filteredAgainArchive.appBlocks.length} app-block connection${filteredAgainArchive.appBlocks.length == 1 ? "" : "s"}`, context, i == batches.length - 1);
                }
                else {
                    return dispatchFailure((_m = res.resultAction) === null || _m === void 0 ? void 0 : _m.payload, context);
                }
            }
        }
        if (filteredAgainArchive.nonDefaultEnvironmentRoles.length > 0 ||
            filteredAgainArchive.baseEnvironments.length > 0 ||
            filteredAgainArchive.subEnvironments.length > 0) {
            await updateImportStatus("Importing environment and branch metadata", context);
            const defaultAppRoleEnvironmentRolesByEnvironmentRoleId = R.groupBy(R.prop("environmentRoleId"), byType.appRoleEnvironmentRoles);
            const nonDefaultAppRoleEnvironmentRolesByEnvironmentRoleId = R.groupBy(R.prop("environmentRoleId"), filteredAgainArchive.nonDefaultAppRoleEnvironmentRoles);
            for (let role of filteredAgainArchive.nonDefaultEnvironmentRoles) {
                const nonDefaultEnvironmentRoles = (_o = nonDefaultAppRoleEnvironmentRolesByEnvironmentRoleId[role.id]) !== null && _o !== void 0 ? _o : [];
                const defaultEnvironmentRoles = (_p = defaultAppRoleEnvironmentRolesByEnvironmentRoleId[role.id]) !== null && _p !== void 0 ? _p : [];
                const appRoleEnvironmentRoles = R.fromPairs([...nonDefaultEnvironmentRoles, ...defaultEnvironmentRoles]
                    .map(({ permissions, appRoleId }) => {
                    var _a;
                    return [(_a = idMap[appRoleId]) !== null && _a !== void 0 ? _a : appRoleId, permissions];
                })
                    .filter(([appRoleId]) => !state.graph[appRoleId]
                    .hasFullEnvironmentPermissions));
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.RBAC_CREATE_ENVIRONMENT_ROLE,
                    payload: Object.assign(Object.assign({}, R.omit(["id"], role)), { importId: role.id, appRoleEnvironmentRoles }),
                }, context);
                if (res.success) {
                    state = res.state;
                    const createdRole = g
                        .graphTypes(res.state.graph)
                        .environmentRoles.find(R.propEq("createdAt", res.state.graphUpdatedAt));
                    idMap[role.id] = createdRole.id;
                }
                else {
                    return dispatchFailure((_q = res.resultAction) === null || _q === void 0 ? void 0 : _q.payload, context);
                }
            }
            const existingBaseEnvironmentsByComposite = R.indexBy(({ envParentId, environmentRoleId }) => envParentId + "|" + environmentRoleId, g
                .graphTypes(state.graph)
                .environments.filter(R.complement(R.prop("isSub"))));
            const toCreateBaseEnvironments = [];
            const filteredAgainBaseEnvironmentsById = R.indexBy(R.prop("id"), filteredAgainArchive.baseEnvironments);
            for (let archiveEnvironment of unfilteredArchive.baseEnvironments) {
                const mappedEnvParentId = idMap[archiveEnvironment.envParentId];
                const mappedEnvironmentRoleId = idMap[archiveEnvironment.environmentRoleId];
                const composite = [mappedEnvParentId, mappedEnvironmentRoleId].join("|");
                const existingBaseEnvironment = existingBaseEnvironmentsByComposite[composite];
                if (existingBaseEnvironment) {
                    idMap[archiveEnvironment.id] = existingBaseEnvironment.id;
                }
                else if (filteredAgainBaseEnvironmentsById[archiveEnvironment.id]) {
                    toCreateBaseEnvironments.push(archiveEnvironment);
                }
            }
            if (toCreateBaseEnvironments.length > 0) {
                await updateImportStatus(`Importing ${toCreateBaseEnvironments.length} base environment${toCreateBaseEnvironments.length == 1 ? "" : "s"}`, context);
                for (let [i, archiveEnvironment,] of toCreateBaseEnvironments.entries()) {
                    const res = await (0, handler_1.dispatch)({
                        type: types_1.Api.ActionType.CREATE_ENVIRONMENT,
                        payload: {
                            environmentRoleId: idMap[archiveEnvironment.environmentRoleId],
                            envParentId: idMap[archiveEnvironment.envParentId],
                            importId: archiveEnvironment.id,
                        },
                    }, context);
                    if (res.success) {
                        state = res.state;
                        const createdEnvironment = R.last(R.sortBy(R.prop("createdAt"), g.graphTypes(res.state.graph).environments));
                        idMap[archiveEnvironment.id] = createdEnvironment.id;
                        if (!R.equals(archiveEnvironment.settings, createdEnvironment.settings)) {
                            const res = await (0, handler_1.dispatch)({
                                type: types_1.Api.ActionType.UPDATE_ENVIRONMENT_SETTINGS,
                                payload: {
                                    id: createdEnvironment.id,
                                    settings: archiveEnvironment.settings,
                                },
                            }, context);
                            if (res.success) {
                                state = res.state;
                                await updateImportStatus(`Imported ${i + 1}/${toCreateBaseEnvironments.length} base environment${toCreateBaseEnvironments.length == 1 ? "" : "s"}`, context, i == toCreateBaseEnvironments.length - 1);
                            }
                            else {
                                return dispatchFailure((_r = res.resultAction) === null || _r === void 0 ? void 0 : _r.payload, context);
                            }
                        }
                    }
                    else {
                        return dispatchFailure((_s = res.resultAction) === null || _s === void 0 ? void 0 : _s.payload, context);
                    }
                }
            }
            if (filteredAgainArchive.subEnvironments.length > 0) {
                await updateImportStatus(`Importing ${filteredAgainArchive.subEnvironments.length} branch${filteredAgainArchive.subEnvironments.length == 1 ? "" : "es"}`, context);
                for (let [i, archiveEnvironment,] of filteredAgainArchive.subEnvironments.entries()) {
                    const res = await (0, handler_1.dispatch)({
                        type: types_1.Api.ActionType.CREATE_ENVIRONMENT,
                        payload: {
                            isSub: true,
                            environmentRoleId: (_t = idMap[archiveEnvironment.environmentRoleId]) !== null && _t !== void 0 ? _t : archiveEnvironment.environmentRoleId,
                            envParentId: idMap[archiveEnvironment.envParentId],
                            parentEnvironmentId: idMap[archiveEnvironment.parentEnvironmentId],
                            subName: archiveEnvironment.subName,
                            importId: archiveEnvironment.id,
                        },
                    }, context);
                    if (res.success) {
                        state = res.state;
                        const createdEnvironment = R.last(R.sortBy(R.prop("createdAt"), g.graphTypes(res.state.graph).environments));
                        idMap[archiveEnvironment.id] = createdEnvironment.id;
                        await updateImportStatus(`Imported ${i + 1}/${filteredAgainArchive.subEnvironments.length} branch${filteredAgainArchive.subEnvironments.length == 1 ? "" : "es"}`, context, i == filteredAgainArchive.subEnvironments.length - 1);
                    }
                    else {
                        return dispatchFailure((_u = res.resultAction) === null || _u === void 0 ? void 0 : _u.payload, context);
                    }
                }
            }
        }
        if (importOrgUsers && filteredAgainArchive.orgUsers.length > 0) {
            await updateImportStatus(`${filteredAgainArchive.isV1Upgrade ? "Importing" : "Re-inviting"} ${filteredAgainArchive.orgUsers.length} user${filteredAgainArchive.orgUsers.length == 1 ? "" : "s"}`, context);
            const batches = R.splitEvery(25, filteredAgainArchive.orgUsers);
            for (let [i, batch] of batches.entries()) {
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.INVITE_USERS,
                    payload: batch.map((archiveOrgUser) => ({
                        user: Object.assign(Object.assign({}, (0, object_1.pick)(["email", "firstName", "lastName", "provider", "uid"], archiveOrgUser)), { importId: archiveOrgUser.id, orgRoleId: idMap[archiveOrgUser.orgRoleId] }),
                        v1Token: archiveOrgUser.v1Token,
                    })),
                }, context);
                if (res.success) {
                    state = res.state;
                    const orgUsers = g.graphTypes(res.state.graph).orgUsers;
                    const orgUsersByEmail = R.indexBy(R.prop("email"), orgUsers);
                    for (let archiveOrgUser of batch) {
                        const created = orgUsersByEmail[archiveOrgUser.email];
                        idMap[archiveOrgUser.id] = created.id;
                    }
                    await updateImportStatus(`${filteredAgainArchive.isV1Upgrade ? "Imported" : "Re-invited"} ${i * 25 + batch.length}/${filteredAgainArchive.orgUsers.length} user${filteredAgainArchive.orgUsers.length == 1 ? "" : "s"}`, context, i == batches.length - 1);
                }
                else {
                    return dispatchFailure((_v = res.resultAction) === null || _v === void 0 ? void 0 : _v.payload, context);
                }
            }
        }
        if (filteredAgainArchive.cliUsers.length > 0) {
            await updateImportStatus(`Regenerating ${filteredAgainArchive.cliUsers.length} CLI key${filteredAgainArchive.cliUsers.length == 1 ? "" : "s"}`, context);
            for (let [i, archiveCliUser] of filteredAgainArchive.cliUsers.entries()) {
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.CREATE_CLI_USER,
                    payload: {
                        name: archiveCliUser.name,
                        orgRoleId: idMap[archiveCliUser.orgRoleId],
                        importId: archiveCliUser.id,
                    },
                }, context);
                if (res.success) {
                    state = res.state;
                    const created = R.last(R.sortBy(R.prop("createdAt"), g.graphTypes(res.state.graph).cliUsers));
                    idMap[archiveCliUser.id] = created.id;
                    await updateImportStatus(`Regenerated ${i + 1}/${filteredAgainArchive.cliUsers.length} CLI key${filteredAgainArchive.cliUsers.length == 1 ? "" : "s"}`, context, i == filteredAgainArchive.cliUsers.length - 1);
                }
                else {
                    return dispatchFailure((_w = res.resultAction) === null || _w === void 0 ? void 0 : _w.payload, context);
                }
            }
        }
        if (filteredAgainArchive.appUserGrants.length > 0) {
            await updateImportStatus(`Importing ${filteredAgainArchive.appUserGrants.length} app access grant${filteredAgainArchive.appUserGrants.length == 1 ? "" : "s"}`, context);
            const batches = R.splitEvery(25, filteredAgainArchive.appUserGrants.filter(({ appId, userId, appRoleId }) => idMap[appId] &&
                idMap[userId] &&
                g.authz.canGrantAppRoleToUser(state.graph, auth.userId, {
                    appId: idMap[appId],
                    userId: idMap[userId],
                    appRoleId: idMap[appRoleId],
                })));
            for (let [i, batch] of batches.entries()) {
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.GRANT_APPS_ACCESS,
                    payload: batch.map(({ appId, userId, appRoleId }) => {
                        var _a;
                        return ({
                            appId: idMap[appId],
                            userId: (_a = idMap[userId]) !== null && _a !== void 0 ? _a : userId,
                            appRoleId: idMap[appRoleId],
                            importId: [appId, userId].join("|"),
                        });
                    }),
                }, context);
                if (res.success) {
                    state = res.state;
                    await updateImportStatus(`Imported ${i * 25 + batch.length}/${filteredAgainArchive.appUserGrants.length} app access grant${filteredAgainArchive.appUserGrants.length == 1 ? "" : "s"}`, context, i == batches.length - 1);
                }
                else {
                    return dispatchFailure((_x = res.resultAction) === null || _x === void 0 ? void 0 : _x.payload, context);
                }
            }
        }
        if (importServers && filteredAgainArchive.servers.length > 0) {
            await updateImportStatus(`${regenServerKeys && !filteredAgainArchive.isV1Upgrade
                ? "Regenerating"
                : "Importing"} ${filteredAgainArchive.servers.length} server${filteredAgainArchive.servers.length == 1 ? "" : "s"}`, context);
            for (let [i, archiveServer] of filteredAgainArchive.servers.entries()) {
                const payload = {
                    appId: idMap[archiveServer.appId],
                    environmentId: idMap[archiveServer.environmentId],
                    name: archiveServer.name,
                    skipGenerateKey: !regenServerKeys,
                    importId: [archiveServer.environmentId, archiveServer.name].join("|"),
                    v1Payload: filteredAgainArchive.isV1Upgrade
                        ? archiveServer.v1Payload
                        : undefined,
                    v1EnvkeyIdPart: filteredAgainArchive.isV1Upgrade
                        ? archiveServer.v1EnvkeyIdPart
                        : undefined,
                    v1EncryptionKey: filteredAgainArchive.isV1Upgrade
                        ? archiveServer.v1EncryptionKey
                        : undefined,
                };
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.CREATE_SERVER,
                    payload,
                }, context);
                if (res.success) {
                    state = res.state;
                }
                else {
                    if (!importOrgServerErrors) {
                        importOrgServerErrors = {};
                    }
                    const appId = idMap[archiveServer.appId];
                    const environmentId = idMap[archiveServer.environmentId];
                    const app = state.graph[appId];
                    const label = `${app.name} > ${g.getObjectName(state.graph, environmentId)} > ${archiveServer.name}`;
                    const err = (_y = res.resultAction) === null || _y === void 0 ? void 0 : _y.payload;
                    let errorMessage = "Unknown error";
                    if (err instanceof Error) {
                        errorMessage = err.message;
                    }
                    else if ("error" in err && err.error && "message" in err.error) {
                        errorMessage = err.error.message;
                    }
                    else if ("errorReason" in err && err.errorReason) {
                        errorMessage = err.errorReason;
                    }
                    (0, logger_1.log)(`Error importing server ${label}: ${errorMessage}`, {
                        err,
                        archiveServer: (0, object_1.pick)(["appId", "environmentId", "name"], archiveServer),
                    });
                    importOrgServerErrors[label] = errorMessage;
                }
                const numErrors = Object.keys(importOrgServerErrors !== null && importOrgServerErrors !== void 0 ? importOrgServerErrors : {}).length;
                await updateImportStatus(`${regenServerKeys && !filteredAgainArchive.isV1Upgrade
                    ? "Regenerated"
                    : "Imported"} ${i + 1 - numErrors}/${filteredAgainArchive.servers.length} server${filteredAgainArchive.servers.length > 1 ? "s" : ""}${numErrors > 0
                    ? ` (${numErrors} error${numErrors > 1 ? "s" : ""})`
                    : ""}`, context, i == filteredAgainArchive.servers.length - 1);
            }
        }
        if (importLocalKeys &&
            filteredAgainArchive.localKeys &&
            filteredAgainArchive.localKeys.length > 0) {
            await updateImportStatus(`Importing ${filteredAgainArchive.localKeys.length} local key${filteredAgainArchive.localKeys.length > 1 ? "s" : ""}`, context);
            for (let [i, archiveLocalKey,] of filteredAgainArchive.localKeys.entries()) {
                const payload = {
                    appId: idMap[archiveLocalKey.appId],
                    environmentId: idMap[archiveLocalKey.environmentId],
                    name: archiveLocalKey.name,
                    importId: [
                        archiveLocalKey.environmentId,
                        archiveLocalKey.userId,
                        archiveLocalKey.name,
                    ].join("|"),
                    isV1UpgradeKey: filteredAgainArchive.isV1Upgrade || undefined,
                    userId: idMap[archiveLocalKey.userId],
                    v1Payload: filteredAgainArchive.isV1Upgrade
                        ? archiveLocalKey.v1Payload
                        : undefined,
                    v1EnvkeyIdPart: filteredAgainArchive.isV1Upgrade
                        ? archiveLocalKey.v1EnvkeyIdPart
                        : undefined,
                    v1EncryptionKey: filteredAgainArchive.isV1Upgrade
                        ? archiveLocalKey.v1EncryptionKey
                        : undefined,
                };
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.CREATE_LOCAL_KEY,
                    payload,
                }, context);
                if (res.success) {
                    state = res.state;
                }
                else {
                    if (!importOrgLocalKeyErrors) {
                        importOrgLocalKeyErrors = {};
                    }
                    const appId = idMap[archiveLocalKey.appId];
                    const userId = idMap[archiveLocalKey.userId];
                    const app = state.graph[appId];
                    const label = `${app.name} > ${g.getUserName(state.graph, userId)} > ${archiveLocalKey.name}`;
                    const err = (_z = res.resultAction) === null || _z === void 0 ? void 0 : _z.payload;
                    let errorMessage = "Unknown error";
                    if (err instanceof Error) {
                        errorMessage = err.message;
                    }
                    else if ("error" in err && err.error && "message" in err.error) {
                        errorMessage = err.error.message;
                    }
                    else if ("errorReason" in err && err.errorReason) {
                        errorMessage = err.errorReason;
                    }
                    (0, logger_1.log)(`Error importing local key ${label}: ${errorMessage}`, {
                        err,
                        archiveLocalKey: (0, object_1.pick)(["appId", "userId", "name"], archiveLocalKey),
                    });
                    importOrgLocalKeyErrors[label] = errorMessage;
                }
                const numErrors = Object.keys(importOrgLocalKeyErrors !== null && importOrgLocalKeyErrors !== void 0 ? importOrgLocalKeyErrors : {}).length;
                await updateImportStatus(`Imported ${i + 1 - numErrors}/${filteredAgainArchive.localKeys.length} local key${filteredAgainArchive.localKeys.length > 1 ? "s" : ""}${numErrors > 0
                    ? ` (${numErrors} error${numErrors > 1 ? "s" : ""})`
                    : ""}`, context, i == filteredAgainArchive.localKeys.length - 1);
            }
        }
        if (!R.isEmpty(filteredAgainArchive.envs)) {
            await updateImportStatus("Importing, encrypting, and syncing environments and locals", context);
            const allArchiveEnvironmentIds = Object.keys(filteredAgainArchive.envs);
            const toFetchChangesetsEnvParentIds = new Set(allArchiveEnvironmentIds
                .map((environmentId) => {
                let mappedEnvParentId;
                let mappedLocalsUserId;
                const environment = state.graph[idMap[environmentId]];
                if (environment) {
                    mappedEnvParentId = environment.envParentId;
                }
                else {
                    [mappedEnvParentId, mappedLocalsUserId] = environmentId
                        .split("|")
                        .map((id) => idMap[id]);
                }
                if (!(mappedEnvParentId && (environment || mappedLocalsUserId))) {
                    return undefined;
                }
                const envParent = state.graph[mappedEnvParentId];
                if (!envParent ||
                    !envParent.importId ||
                    !envParent.envsOrLocalsUpdatedAt) {
                    return undefined;
                }
                if (environment && environment.isSub && !environment.importId) {
                    return undefined;
                }
                if (environment && !environment.envUpdatedAt) {
                    return undefined;
                }
                return mappedEnvParentId;
            })
                .filter(Boolean));
            if (toFetchChangesetsEnvParentIds.size > 0) {
                const fetchChangesetsRes = await (0, envs_1.fetchRequiredEnvs)(state, new Set([]), toFetchChangesetsEnvParentIds, context);
                if (fetchChangesetsRes === null || fetchChangesetsRes === void 0 ? void 0 : fetchChangesetsRes.success) {
                    state = fetchChangesetsRes.state;
                }
                else if (fetchChangesetsRes && !fetchChangesetsRes.success) {
                    return dispatchFailure((_0 = fetchChangesetsRes.resultAction) === null || _0 === void 0 ? void 0 : _0.payload, context);
                }
            }
            const filteredEnvironmentIds = Object.keys(filteredAgainArchive.envs).filter((environmentId) => {
                let mappedEnvParentId;
                let mappedLocalsUserId;
                const environment = state.graph[idMap[environmentId]];
                if (environment) {
                    mappedEnvParentId = environment.envParentId;
                }
                else {
                    [mappedEnvParentId, mappedLocalsUserId] = environmentId
                        .split("|")
                        .map((id) => idMap[id]);
                }
                if (!(mappedEnvParentId && (environment || mappedLocalsUserId))) {
                    return false;
                }
                const mappedEnvironmentId = environment
                    ? environment.id
                    : [mappedEnvParentId, mappedLocalsUserId].join("|");
                const envParent = state.graph[mappedEnvParentId];
                if (!envParent) {
                    return false;
                }
                if (!envParent.importId || !envParent.envsOrLocalsUpdatedAt) {
                    return true;
                }
                if (environment && environment.isSub && !environment.importId) {
                    return true;
                }
                if (environment && !environment.envUpdatedAt) {
                    return true;
                }
                const changesets = (0, client_1.getChangesets)(state, {
                    envParentId: mappedEnvParentId,
                    environmentId: mappedEnvironmentId,
                });
                return changesets.length == 0;
            });
            await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.CLEAR_CACHED,
            }, context);
            if (filteredEnvironmentIds.length > 0) {
                await updateImportStatus(`Importing ${filteredEnvironmentIds.length} environments`, context);
                const batches = R.splitEvery(IMPORT_ENVS_BATCH_SIZE, filteredEnvironmentIds);
                for (let [i, batch] of batches.entries()) {
                    for (let environmentId of batch) {
                        let envParentId;
                        let localsUserId;
                        const environment = state.graph[idMap[environmentId]];
                        if (environment) {
                            envParentId = environment.envParentId;
                        }
                        else {
                            [envParentId, localsUserId] = environmentId
                                .split("|")
                                .map((id) => idMap[id]);
                        }
                        const mappedEnvironmentId = environment
                            ? environment.id
                            : [envParentId, localsUserId].join("|");
                        const parsed = R.mapObjIndexed((v) => {
                            const update = (0, object_1.stripNullsRecursive)(v);
                            if (update.inheritsEnvironmentId) {
                                const mappedInheritsId = idMap[update.inheritsEnvironmentId];
                                update.inheritsEnvironmentId = mappedInheritsId;
                            }
                            return update.inheritsEnvironmentId
                                ? `inherits:${update.inheritsEnvironmentId}`
                                : update.val;
                        }, filteredAgainArchive.envs[environmentId].variables);
                        await (0, handler_1.dispatch)({
                            type: types_1.Client.ActionType.IMPORT_ENVIRONMENT,
                            payload: {
                                envParentId,
                                environmentId: mappedEnvironmentId,
                                parsed,
                            },
                        }, context);
                    }
                    const pendingEnvironmentIds = batch.map((environmentId) => {
                        const environment = state.graph[idMap[environmentId]];
                        if (environment) {
                            return environment.id;
                        }
                        else {
                            const [envParentId, localsUserId] = environmentId
                                .split("|")
                                .map((id) => idMap[id]);
                            return [envParentId, localsUserId].join("|");
                        }
                    });
                    const res = await (0, handler_1.dispatch)({
                        type: types_1.Client.ActionType.COMMIT_ENVS,
                        payload: {
                            pendingEnvironmentIds,
                        },
                    }, context);
                    if (res.success) {
                        const clearCachedRes = await (0, handler_1.dispatch)({
                            type: types_1.Client.ActionType.CLEAR_CACHED,
                        }, context);
                        await updateImportStatus(`Imported ${i * IMPORT_ENVS_BATCH_SIZE + batch.length}/${filteredEnvironmentIds.length} environments`, context, i == batches.length - 1);
                        if (clearCachedRes.success) {
                            state = clearCachedRes.state;
                        }
                        else {
                            state = res.state;
                        }
                    }
                    else {
                        return dispatchFailure((_1 = res.resultAction) === null || _1 === void 0 ? void 0 : _1.payload, context);
                    }
                }
            }
        }
        if (v1Upgrade) {
            let elapsed = Date.now() - ((_2 = state.v1ClientAliveAt) !== null && _2 !== void 0 ? _2 : 0);
            (0, logger_1.log)("elapsed since v1 active", {
                elapsed,
                v1ClientAliveAt: state.v1ClientAliveAt,
                now: Date.now(),
            });
            if (elapsed > 40000) {
                return dispatchFailure({
                    type: "error",
                    error: true,
                    errorReason: "EnvKey v1 is not running",
                    errorStatus: 404,
                }, context);
            }
        }
        await updateImportStatus("Finishing import", context);
        res = await (0, handler_1.dispatch)({
            type: types_1.Api.ActionType.FINISHED_ORG_IMPORT,
            payload: {},
        }, context);
        if (!res.success) {
            return dispatchFailure((_3 = res.resultAction) === null || _3 === void 0 ? void 0 : _3.payload, context);
        }
        await (0, wait_1.wait)(1000);
        if (filteredAgainArchive.isV1Upgrade) {
            await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.CLEAR_ALL_GENERATED_ENVKEYS,
            }, context);
        }
        return dispatchSuccess({
            importOrgServerErrors,
            importOrgLocalKeyErrors,
        }, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.SET_IMPORT_ORG_STATUS,
    stateProducer: (draft, { payload: { status } }) => {
        draft.importOrgStatus = status;
    },
});
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "asyncClientAction", actionType: types_1.Client.ActionType.EXPORT_ORG }, (0, status_1.statusProducers)("isExportingOrg", "exportOrgError")), { handler: async (initialState, { payload: { filePath, debugData } }, { context, dispatchSuccess, dispatchFailure }) => {
        let state = initialState;
        const byType = g.graphTypes(state.graph);
        // first we gotta make sure all the envs have been fetched
        const fetchRes = await (0, envs_1.fetchRequiredEnvs)(state, new Set([
            ...byType.apps.map(R.prop("id")),
            ...byType.blocks.map(R.prop("id")),
        ]), new Set(), context);
        if (fetchRes) {
            if (fetchRes.success) {
                state = fetchRes.state;
            }
            else {
                return dispatchFailure(fetchRes.resultAction.payload, context);
            }
        }
        const encryptionKey = debugData
            ? "debug-key"
            : (0, utils_1.secureRandomAlphanumeric)(22);
        const now = Date.now();
        const archive = {
            schemaVersion: "1",
            org: (0, object_1.pick)(["id", "name", "settings"], byType.org),
            apps: byType.apps.map((0, object_1.pick)(["id", "name", "settings"])),
            blocks: byType.blocks.map((0, object_1.pick)(["id", "name", "settings"])),
            appBlocks: byType.appBlocks.map((0, object_1.pick)(["appId", "blockId", "orderIndex"])),
            defaultOrgRoles: byType.orgRoles.map((0, object_1.pick)(["id", "defaultName"])),
            defaultAppRoles: byType.appRoles.map((0, object_1.pick)(["id", "defaultName"])),
            defaultEnvironmentRoles: byType.environmentRoles
                .filter(R.prop("isDefault"))
                .map((0, object_1.pick)(["id", "defaultName", "settings"])),
            nonDefaultEnvironmentRoles: byType.environmentRoles
                .filter(R.complement(R.prop("isDefault")))
                .map((0, object_1.pick)([
                "id",
                "name",
                "settings",
                "description",
                "hasLocalKeys",
                "hasServers",
                "defaultAllApps",
                "defaultAllBlocks",
            ])),
            nonDefaultAppRoleEnvironmentRoles: byType.appRoleEnvironmentRoles
                .filter(({ environmentRoleId }) => !state.graph[environmentRoleId].isDefault)
                .map((0, object_1.pick)(["appRoleId", "environmentRoleId", "permissions"])),
            baseEnvironments: byType.environments
                .filter((environment) => !environment.isSub)
                .map((0, object_1.pick)(["id", "envParentId", "environmentRoleId", "settings"])),
            subEnvironments: byType.environments
                .filter((environment) => environment.isSub)
                .map((0, object_1.pick)([
                "id",
                "envParentId",
                "environmentRoleId",
                "parentEnvironmentId",
                "subName",
            ])),
            servers: byType.servers.map((server) => (Object.assign({}, (0, object_1.pick)(["appId", "environmentId", "name"], server)))),
            cliUsers: byType.cliUsers
                .filter((u) => !u.deactivatedAt && !u.deletedAt)
                .map((0, object_1.pick)(["id", "orgRoleId", "name"])),
            orgUsers: byType.orgUsers
                .filter((ou) => !ou.deactivatedAt &&
                !ou.deletedAt &&
                ["creator", "accepted", "pending"].includes(g.getInviteStatus(state.graph, ou.id, now)))
                .map((0, object_1.pick)([
                "id",
                "firstName",
                "lastName",
                "email",
                "provider",
                "orgRoleId",
                "uid",
                "externalAuthProviderId",
                "scim",
            ])),
            appUserGrants: byType.appUserGrants.map((0, object_1.pick)(["appId", "userId", "appRoleId"])),
            envs: R.fromPairs(R.toPairs(state.envs).map(([composite]) => {
                var _a;
                const { environmentId } = (0, blob_1.parseUserEncryptedKeyOrBlobComposite)(composite);
                const environment = state.graph[environmentId];
                const envParentId = (_a = environment === null || environment === void 0 ? void 0 : environment.envParentId) !== null && _a !== void 0 ? _a : environmentId.split("|")[0];
                return [
                    environmentId,
                    (0, client_1.getEnvWithMeta)(state, { envParentId, environmentId }, undefined, undefined, debugData),
                ];
            })),
        };
        const encryptedArchive = await (0, proxy_1.encryptSymmetricWithKey)({
            data: JSON.stringify(archive),
            encryptionKey,
        });
        try {
            await new Promise((resolve, reject) => fs_1.default.writeFile(filePath, JSON.stringify(encryptedArchive), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            }));
            return dispatchSuccess({ encryptionKey, filePath }, context);
        }
        catch (err) {
            return dispatchFailure(err, context);
        }
    } }));
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.LOAD_V1_UPGRADE,
    stateProducer: (draft, { payload }) => {
        draft.v1UpgradeLoaded = payload;
        draft.v1UpgradeStatus = "loaded";
    },
    handler: async (state) => {
        (0, proc_status_worker_1.sendMainToWorkerMessage)({
            type: "v1UpgradeStatus",
            v1UpgradeStatus: state.v1UpgradeStatus,
        });
    },
});
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.START_V1_UPGRADE,
    stateProducer: (draft, { payload }) => {
        draft.v1IsUpgrading = true;
        delete draft.v1UpgradeError;
        delete draft.importOrgError;
        delete draft.importOrgStatus;
        if (!payload.accountId) {
            draft.isRegistering = true;
        }
        draft.v1UpgradeStatus = "upgrading";
        draft.v1ActiveUpgrade = payload;
    },
    failureStateProducer: (draft, action) => {
        draft.v1UpgradeError = action.payload;
        draft.v1UpgradeStatus = "error";
        delete draft.v1IsUpgrading;
    },
    successStateProducer: (draft, action) => {
        draft.v1UpgradeAccountId = action.payload.accountId;
    },
    endStateProducer: (draft) => {
        delete draft.isRegistering;
    },
    handler: async (initialState, { payload }, { context, dispatchSuccess, dispatchFailure }) => {
        var _a, _b, _c;
        let state = initialState;
        if (state.v1UpgradeAccountId) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "AlreadyUpgradingError",
                    message: "Already upgrading",
                },
            }, context);
        }
        (0, proc_status_worker_1.sendMainToWorkerMessage)({
            type: "v1UpgradeStatus",
            v1UpgradeStatus: state.v1UpgradeStatus,
        });
        let elapsed = Date.now() - ((_a = state.v1ClientAliveAt) !== null && _a !== void 0 ? _a : 0);
        (0, logger_1.log)("elapsed since v1 active", {
            elapsed,
            v1ClientAliveAt: state.v1ClientAliveAt,
            now: Date.now(),
        });
        if (elapsed > 40000) {
            return dispatchFailure({
                type: "error",
                error: true,
                errorReason: "EnvKey v1 is not running",
                errorStatus: 404,
            }, context);
        }
        if (!state.v1UpgradeLoaded) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "NoV1UpgradeDataError",
                    message: "No v1 upgrade data loaded",
                },
            }, context);
        }
        let accountId;
        let numUsers;
        if (payload.accountId) {
            const auth = (0, client_2.getAuth)(state, payload.accountId);
            if (!auth || ("token" in auth && !auth.token)) {
                throw new Error("Action requires authentication");
            }
            accountId = payload.accountId;
            if (!state.filteredOrgArchive) {
                const accountContext = Object.assign(Object.assign({}, context), { accountIdOrCliKey: accountId });
                const decryptRes = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.DECRYPT_ORG_ARCHIVE,
                    payload: Object.assign(Object.assign({}, state.v1UpgradeLoaded), { isV1Upgrade: true }),
                }, accountContext);
                if (decryptRes.success) {
                    state = decryptRes.state;
                }
                else {
                    updateImportStatus(undefined, accountContext, false);
                    return dispatchFailure(decryptRes.resultAction.payload, accountContext);
                }
            }
            if (!state.filteredOrgArchive) {
                return dispatchFailure({
                    type: "clientError",
                    error: {
                        name: "Upgrade error",
                        message: "Archive not loaded",
                    },
                }, context);
            }
            numUsers = state.filteredOrgArchive.orgUsers.length;
        }
        else {
            numUsers = state.v1UpgradeLoaded.numUsers;
        }
        if (!state.v1UpgradeLoaded) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "NoV1UpgradeDataError",
                    message: "v1 upgrade data not loaded",
                },
            }, context);
        }
        const v1Upgrade = Object.assign(Object.assign(Object.assign({}, (0, object_1.pick)([
            "ts",
            "signature",
            "stripeCustomerId",
            "stripeSubscriptionId",
            "signedPresetBilling",
        ], state.v1UpgradeLoaded)), (state.v1UpgradeLoaded.signedPresetBilling
            ? {}
            : (0, object_1.pick)(["billingInterval", "ssoEnabled", "freeTier", "newProductId"], payload))), { numUsers });
        if (!payload.accountId) {
            const registerAction = {
                type: types_1.Client.ActionType.REGISTER,
                payload: {
                    hostType: "cloud",
                    provider: "email",
                    user: state.v1UpgradeLoaded.creator,
                    org: {
                        name: state.v1UpgradeLoaded.orgName,
                        settings: (0, defaults_1.getDefaultOrgSettings)(),
                    },
                    device: {
                        name: (_c = (_b = payload.deviceName) !== null && _b !== void 0 ? _b : state.defaultDeviceName) !== null && _c !== void 0 ? _c : "v1-upgraded-device",
                    },
                    emailVerificationToken: "v1-upgrade",
                    v1Upgrade,
                },
            };
            const registerRes = await (0, handler_1.dispatch)(registerAction, context);
            if (registerRes.success) {
                const successPayload = registerRes.resultAction
                    .payload;
                accountId = successPayload.userId;
            }
            else {
                return dispatchFailure(registerRes.resultAction.payload, context);
            }
        }
        if (!accountId) {
            return dispatchFailure({
                type: "clientError",
                error: {
                    name: "Upgrade error",
                    message: "No account id",
                },
            }, context);
        }
        const registeredContext = Object.assign(Object.assign({}, context), { accountIdOrCliKey: accountId });
        if (!payload.accountId) {
            const decryptRes = await (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.DECRYPT_ORG_ARCHIVE,
                payload: Object.assign(Object.assign({}, state.v1UpgradeLoaded), { isV1Upgrade: true }),
            }, registeredContext);
            if (!decryptRes.success) {
                updateImportStatus(undefined, registeredContext, false);
                return dispatchFailure(decryptRes.resultAction.payload, registeredContext);
            }
        }
        //import in background
        (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.IMPORT_ORG,
            payload: {
                importOrgUsers: payload.importOrgUsers,
                importLocalKeys: payload.importLocalKeys,
                importCliUsers: false,
                importServers: true,
                regenServerKeys: true,
                isV1Upgrade: true,
                isV1UpgradeIntoExistingOrg: Boolean(payload.accountId),
                v1Upgrade,
            },
        }, registeredContext);
        return dispatchSuccess({ accountId }, registeredContext);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.RESET_V1_UPGRADE,
    stateProducer: (draft, { payload }) => {
        delete draft.v1UpgradeLoaded;
        delete draft.v1IsUpgrading;
        delete draft.v1UpgradeError;
        delete draft.v1UpgradeInviteToken;
        delete draft.v1UpgradeEncryptionToken;
        delete draft.v1UpgradeAccountId;
        delete draft.v1UpgradeStatus;
        delete draft.v1UpgradeAcceptedInvite;
        delete draft.v1UpgradeInviteToken;
        delete draft.v1UpgradeEncryptionToken;
        delete draft.unfilteredOrgArchive;
        delete draft.filteredOrgArchive;
        delete draft.decryptOrgArchiveError;
        delete draft.isDecryptingOrgArchive;
        delete draft.isImportingOrg;
        delete draft.importOrgStatus;
        delete draft.importOrgError;
        delete draft.v1ActiveUpgrade;
        delete draft.v1ClientAliveAt;
        delete draft.hasV1PendingUpgrade;
        if (payload.cancelUpgrade) {
            draft.v1UpgradeStatus = "canceled";
        }
    },
    handler: async (state, action, context) => {
        (0, proc_status_worker_1.sendMainToWorkerMessage)({
            type: "v1UpgradeStatus",
            v1UpgradeStatus: state.v1UpgradeStatus,
        });
        return updateImportStatus(undefined, context);
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.LOAD_V1_UPGRADE_INVITE,
    stateProducer: (draft, { payload }) => {
        draft.v1UpgradeInviteToken = payload.upgradeToken;
        draft.v1UpgradeEncryptionToken = payload.encryptionToken;
    },
});
//# sourceMappingURL=org_import_export.js.map