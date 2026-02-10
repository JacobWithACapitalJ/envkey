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
exports.getPermittedGraphObjects = void 0;
const R = __importStar(require("ramda"));
const pick_1 = require("../utils/pick");
const base_1 = require("./base");
const permissions_1 = require("./permissions");
const indexed_graph_1 = require("./indexed_graph");
const authz = __importStar(require("./authz"));
const user_blocks_1 = require("./user_blocks");
const getPermittedGraphObjects = (graph, userId, deviceId, includeDeleted = false) => {
    var _a, _b, _c;
    const filteredGraph = includeDeleted
        ? graph
        : R.filter(({ deletedAt }) => !deletedAt, graph), byType = (0, base_1.graphTypes)(filteredGraph);
    const org = byType.org, user = filteredGraph[userId], currentOrgRole = user
        ? filteredGraph[user.orgRoleId]
        : undefined, currentOrgPermissions = currentOrgRole
        ? (0, permissions_1.getOrgPermissions)(filteredGraph, currentOrgRole.id)
        : new Set();
    // permitted apps/blocks and associations
    if (!user || !currentOrgRole) {
        return {
            org,
            apps: [],
            blocks: [],
            orgUsers: [],
            orgUserDevices: [],
            cliUsers: [],
            deviceGrants: [],
            invites: [],
            appUserGrants: [],
            appBlocks: [],
            groupMemberships: [],
            groups: [],
            appUserGroups: [],
            appGroupUserGroups: [],
            appGroupUsers: [],
            appGroupBlocks: [],
            appBlockGroups: [],
            appGroupBlockGroups: [],
            servers: [],
            localKeys: [],
            includedAppRoles: [],
            environments: [],
            variableGroups: [],
            generatedEnvkeys: [],
            recoveryKeys: [],
            orgRoles: [],
            appRoles: [],
            environmentRoles: [],
            appRoleEnvironmentRoles: [],
            externalAuthProviders: [],
            scimProvisioningProviders: [],
            pubkeyRevocationRequests: [],
            rootPubkeyReplacements: [],
            products: [],
            prices: [],
            customer: undefined,
            subscription: undefined,
            paymentSource: undefined,
            vantaConnectedAccount: undefined,
        };
    }
    const permittedApps = (currentOrgRole === null || currentOrgRole === void 0 ? void 0 : currentOrgRole.autoAppRoleId)
        ? byType.apps
        : byType.apps.filter(({ id: appId }) => (0, permissions_1.getEnvParentPermissions)(filteredGraph, appId, userId).size > 0), permittedAppIds = new Set(permittedApps.map(R.prop("id"))), permittedAppBlocks = currentOrgPermissions.has("blocks_read_all")
        ? byType.appBlocks
        : byType.appBlocks.filter(({ appId }) => permittedAppIds.has(appId)), permittedBlocks = (0, user_blocks_1.getPermittedBlocksForUser)(filteredGraph, userId), permittedBlockIds = new Set(permittedBlocks.map(R.prop("id"))), permittedAppUserGrants = (currentOrgRole === null || currentOrgRole === void 0 ? void 0 : currentOrgRole.autoAppRoleId)
        ? byType.appUserGrants
        : byType.appUserGrants.filter(({ appId }) => permittedAppIds.has(appId));
    const permittedOrgUsers = byType.orgUsers, permittedCliUsers = byType.cliUsers, permittedUserIds = new Set([
        ...permittedOrgUsers.map(R.prop("id")),
        ...permittedCliUsers.map(R.prop("id")),
    ]);
    const [permittedOrgUserDevices, permittedDeviceGrants, permittedInvites, permittedRecoveryKeys,] = [
        byType.orgUserDevices,
        byType.deviceGrants,
        byType.invites,
        byType.recoveryKeys,
    ], 
    // app-level associations based on permitted apps
    [permittedServers, permittedLocalKeys, permittedIncludedAppRoles, permittedGeneratedEnvkeys,] = (currentOrgRole === null || currentOrgRole === void 0 ? void 0 : currentOrgRole.autoAppRoleId)
        ? [
            byType.servers,
            byType.localKeys,
            byType.includedAppRoles,
            byType.generatedEnvkeys,
        ]
        : [
            byType.servers,
            byType.localKeys,
            byType.includedAppRoles,
            byType.generatedEnvkeys,
        ].map((objects) => objects.filter((obj) => permittedAppIds.has(obj.appId))), permittedEnvironments = byType.environments.filter(({ envParentId }) => permittedAppIds.has(envParentId) || permittedBlockIds.has(envParentId)), permittedEnvironmentIds = new Set(permittedEnvironments.map(R.prop("id"))), permittedVariableGroups = byType.variableGroups.filter((variableGroup) => variableGroup.subEnvironmentId
        ? permittedEnvironmentIds.has(variableGroup.subEnvironmentId)
        : permittedAppIds.has(variableGroup.envParentId) ||
            permittedBlockIds.has(variableGroup.envParentId)), permittedGroupMembers = byType.groupMemberships.filter((member) => {
        const group = filteredGraph[member.groupId];
        switch (group.objectType) {
            case "app":
                return permittedAppIds.has(member.objectId);
            case "block":
                return permittedBlockIds.has(member.objectId);
            case "orgUser":
                return permittedUserIds.has(member.objectId);
        }
    }), permittedMemberGroupIds = new Set(permittedGroupMembers.map(R.prop("groupId")));
    let permittedGroups = [];
    if (currentOrgPermissions.has("org_manage_app_groups") ||
        currentOrgPermissions.has("org_manage_teams") ||
        currentOrgPermissions.has("org_manage_block_groups")) {
        const groupsByObjectType = (0, indexed_graph_1.getGroupsByObjectType)(filteredGraph);
        if (currentOrgPermissions.has("org_manage_app_groups")) {
            permittedGroups = permittedGroups.concat((_a = groupsByObjectType["app"]) !== null && _a !== void 0 ? _a : []);
        }
        if (currentOrgPermissions.has("org_manage_teams")) {
            permittedGroups = permittedGroups.concat((_b = groupsByObjectType["orgUser"]) !== null && _b !== void 0 ? _b : []);
        }
        if (currentOrgPermissions.has("org_manage_block_groups")) {
            permittedGroups = permittedGroups.concat((_c = groupsByObjectType["block"]) !== null && _c !== void 0 ? _c : []);
        }
    }
    else {
        permittedGroups = byType.groups.filter(({ id }) => permittedMemberGroupIds.has(id));
    }
    const permittedGroupIds = new Set(permittedGroups.map(R.prop("id"))), [permittedAppUserGroups, permittedAppGroupUserGroups, permittedAppGroupUsers, permittedAppGroupBlocks, permittedAppBlockGroups, permittedAppGroupBlockGroups,] = [
        [
            byType.appUserGroups,
            { appId: permittedAppIds, userGroupId: permittedGroupIds },
        ],
        [
            byType.appGroupUserGroups,
            {
                appGroupId: permittedGroupIds,
                userGroupId: permittedGroupIds,
            },
        ],
        [
            byType.appGroupUsers,
            { userId: permittedUserIds, appGroupId: permittedGroupIds },
        ],
        [
            byType.appGroupBlocks,
            { blockId: permittedBlockIds, appGroupId: permittedGroupIds },
        ],
        [
            byType.appBlockGroups,
            { appId: permittedAppIds, blockGroupId: permittedGroupIds },
        ],
        [
            byType.appGroupBlockGroups,
            {
                appGroupId: permittedGroupIds,
                blockGroupId: permittedGroupIds,
            },
        ],
    ].map(([objects, propSets]) => objects.filter((obj) => {
        for (let k in propSets) {
            if (!propSets[k].has(obj[k])) {
                return false;
            }
        }
        return true;
    }));
    const permitted = Object.assign(Object.assign({ org, apps: permittedApps, blocks: permittedBlocks, orgUsers: permittedOrgUsers, orgUserDevices: permittedOrgUserDevices, cliUsers: permittedCliUsers, deviceGrants: permittedDeviceGrants, invites: permittedInvites, recoveryKeys: permittedRecoveryKeys, appUserGrants: permittedAppUserGrants, appBlocks: permittedAppBlocks, groupMemberships: permittedGroupMembers, groups: permittedGroups, appUserGroups: permittedAppUserGroups, appGroupUserGroups: permittedAppGroupUserGroups, appGroupUsers: permittedAppGroupUsers, appGroupBlocks: permittedAppGroupBlocks, appBlockGroups: permittedAppBlockGroups, appGroupBlockGroups: permittedAppGroupBlockGroups, servers: permittedServers, localKeys: permittedLocalKeys, includedAppRoles: permittedIncludedAppRoles, environments: permittedEnvironments, variableGroups: permittedVariableGroups, generatedEnvkeys: permittedGeneratedEnvkeys }, (0, pick_1.pick)([
        "orgRoles",
        "appRoles",
        "environmentRoles",
        "appRoleEnvironmentRoles",
        "externalAuthProviders",
        "scimProvisioningProviders",
    ], byType)), { pubkeyRevocationRequests: byType.pubkeyRevocationRequests.filter((request) => !request.deletedAt &&
            authz.canRevokeTrustedUserPubkey(filteredGraph, userId, request.targetId)), rootPubkeyReplacements: byType.rootPubkeyReplacements.filter((replacement) => {
            return "processedAtById" in replacement
                ? replacement.processedAtById[deviceId !== null && deviceId !== void 0 ? deviceId : userId] === false
                : true;
        }), products: currentOrgPermissions.has("org_manage_billing")
            ? byType.products
            : [], prices: currentOrgPermissions.has("org_manage_billing")
            ? byType.prices
            : [], customer: currentOrgPermissions.has("org_manage_billing")
            ? byType.customer
            : undefined, subscription: currentOrgPermissions.has("org_manage_billing")
            ? byType.subscription
            : undefined, paymentSource: currentOrgPermissions.has("org_manage_billing")
            ? byType.paymentSource
            : undefined, vantaConnectedAccount: currentOrgPermissions.has("org_manage_integrations")
            ? byType.vantaConnectedAccount
            : undefined });
    return permitted;
};
exports.getPermittedGraphObjects = getPermittedGraphObjects;
//# sourceMappingURL=permitted_graph.js.map