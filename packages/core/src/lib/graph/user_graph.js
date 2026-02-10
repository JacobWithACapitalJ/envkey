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
exports.orgGraphObjectToUserGraphObject = exports.getUserGraph = void 0;
const R = __importStar(require("ramda"));
const _1 = require(".");
const object_1 = require("../utils/object");
const array_1 = require("../utils/array");
const getUserGraph = (graph, userId, deviceId, includeDeleted = false) => {
    const permittedByType = (0, _1.getPermittedGraphObjects)(graph, userId, deviceId, includeDeleted);
    const permittedObjects = R.flatten(Object.values(permittedByType)).filter(Boolean);
    const userGraph = (0, array_1.indexBy)(R.prop("id"), permittedObjects.map(exports.orgGraphObjectToUserGraphObject));
    return userGraph;
}, orgGraphObjectToUserGraphObject = (obj) => {
    const baseProps = [
        "type",
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
    ];
    switch (obj.type) {
        case "org":
            return (0, object_1.pick)([
                ...baseProps,
                "name",
                "creatorId",
                "settings",
                "rbacUpdatedAt",
                "graphUpdatedAt",
                "selfHostedVersions",
                "selfHostedUpgradeStatus",
                "serverEnvkeyCount",
                "deviceLikeCount",
                "activeUserOrInviteCount",
                "upgradedCrypto-2.1.0",
                "reinitializedLocals",
                // these may filtered out in permitted_graph.ts depending on permissions
                "localIpsAllowed",
                "environmentRoleIpsAllowed",
                "billingSettings",
                "customLicense",
                "optimizeEmptyEnvs",
                "orgSettingsImported",
            ], obj);
        case "orgUser":
            return (0, object_1.pick)([
                ...baseProps,
                "email",
                "uid",
                "provider",
                "externalAuthProviderId",
                "firstName",
                "lastName",
                "invitedById",
                "isCreator",
                "inviteAcceptedAt",
                "orgRoleId",
                "deactivatedAt",
                "orgRoleUpdatedAt",
                "scim",
                "importId",
            ], obj);
        case "orgUserDevice":
            const orgUserDeviceProps = [
                ...baseProps,
                "name",
                "pubkey",
                "pubkeyId",
                "pubkeyUpdatedAt",
                "userId",
                "approvedAt",
                "approvedByType",
                "deactivatedAt",
                "isRoot",
            ];
            if (obj.approvedByType == "invite") {
                return (0, object_1.pick)([...orgUserDeviceProps, "inviteId"], obj);
            }
            else if (obj.approvedByType == "deviceGrant") {
                return (0, object_1.pick)([...orgUserDeviceProps, "deviceGrantId"], obj);
            }
            else if (obj.approvedByType == "recoveryKey") {
                return (0, object_1.pick)([...orgUserDeviceProps, "recoveryKeyId"], obj);
            }
            return (0, object_1.pick)([...orgUserDeviceProps], obj);
        case "cliUser":
            return (0, object_1.pick)([
                ...baseProps,
                "orgRoleId",
                "name",
                "pubkey",
                "pubkeyId",
                "pubkeyUpdatedAt",
                "creatorId",
                "creatorDeviceId",
                "deactivatedAt",
                "signedById",
                "orgRoleUpdatedAt",
                "importId",
            ], obj);
        case "recoveryKey":
            return (0, object_1.pick)([
                ...baseProps,
                "userId",
                "creatorDeviceId",
                "signedById",
                "pubkey",
                "pubkeyId",
                "pubkeyUpdatedAt",
                "redeemedAt",
            ], obj);
        case "invite":
            return (0, object_1.pick)([
                ...baseProps,
                "inviteeId",
                "pubkey",
                "pubkeyId",
                "pubkeyUpdatedAt",
                "acceptedAt",
                "expiresAt",
                "invitedByUserId",
                "invitedByDeviceId",
                "signedById",
                "v1Invite",
            ], obj);
        case "deviceGrant":
            return (0, object_1.pick)([
                ...baseProps,
                "granteeId",
                "pubkey",
                "pubkeyId",
                "pubkeyUpdatedAt",
                "deviceId",
                "grantedByUserId",
                "grantedByDeviceId",
                "acceptedAt",
                "expiresAt",
                "signedById",
            ], obj);
        case "app":
            return (0, object_1.pick)([
                ...baseProps,
                "name",
                "localsUpdatedAtByUserId",
                "localsUpdatedAt",
                "localsEncryptedBy",
                "envsUpdatedAt",
                "envsOrLocalsUpdatedAt",
                "localsReencryptionRequiredAt",
                "localsRequireReinit",
                "settings",
                // these may filtered out in permitted_graph.ts depending on permissions
                "environmentRoleIpsMergeStrategies",
                "environmentRoleIpsAllowed",
                "importId",
            ], obj);
        case "block":
            return (0, object_1.pick)([
                ...baseProps,
                "name",
                "localsUpdatedAtByUserId",
                "localsEncryptedBy",
                "localsUpdatedAt",
                "envsUpdatedAt",
                "envsOrLocalsUpdatedAt",
                "localsReencryptionRequiredAt",
                "localsRequireReinit",
                "settings",
                "importId",
            ], obj);
        case "appUserGrant":
            return (0, object_1.pick)([...baseProps, "userId", "appId", "appRoleId", "importId"], obj);
        case "server":
            return (0, object_1.pick)([...baseProps, "name", "appId", "environmentId", "importId"], obj);
        case "localKey":
            return (0, object_1.pick)([
                ...baseProps,
                "name",
                "appId",
                "environmentId",
                "userId",
                "deviceId",
                "autoGenerated",
                "importId",
                "isV1UpgradeKey",
            ], obj);
        case "appBlock":
            return (0, object_1.pick)([...baseProps, "appId", "blockId", "orderIndex", "importId"], obj);
        case "environment":
            const environmentProps = [
                ...baseProps,
                "envParentId",
                "environmentRoleId",
                "isSub",
                "envUpdatedAt",
                "encryptedById",
                "reencryptionRequiredAt",
                "upgradedCrypto-2.1.0",
                "importId",
                "requiresReinit",
            ];
            return obj.isSub
                ? (0, object_1.pick)([...environmentProps, "subName", "parentEnvironmentId"], obj)
                : (0, object_1.pick)([...environmentProps, "settings"], obj);
        case "variableGroup":
            return (0, object_1.pick)([...baseProps, "envParentId", "subEnvironmentId", "name"], obj);
        case "includedAppRole":
            return (0, object_1.pick)([...baseProps, "appId", "appRoleId"], obj);
        case "group":
            return (0, object_1.pick)([
                ...baseProps,
                "objectType",
                "name",
                "membershipsUpdatedAt",
                "importId",
            ], obj);
        case "groupMembership":
            return (0, object_1.pick)([...baseProps, "groupId", "objectId", "orderIndex", "importId"], obj);
        case "appUserGroup":
            return (0, object_1.pick)([...baseProps, "appId", "userGroupId", "appRoleId", "importId"], obj);
        case "appGroupUserGroup":
            return (0, object_1.pick)([...baseProps, "appGroupId", "userGroupId", "appRoleId"], obj);
        case "appGroupUser":
            return (0, object_1.pick)([...baseProps, "appGroupId", "userId", "appRoleId"], obj);
        case "appGroupBlock":
            return (0, object_1.pick)([...baseProps, "blockId", "appGroupId", "orderIndex"], obj);
        case "appBlockGroup":
            return (0, object_1.pick)([...baseProps, "blockGroupId", "appId", "orderIndex"], obj);
        case "appGroupBlockGroup":
            return (0, object_1.pick)([...baseProps, "appGroupId", "blockGroupId", "orderIndex"], obj);
        case "generatedEnvkey":
            return (0, object_1.pick)([
                ...baseProps,
                "appId",
                "keyableParentId",
                "keyableParentType",
                "envkeyShort",
                "envkeyIdPartHash",
                "pubkey",
                "pubkeyId",
                "pubkeyUpdatedAt",
                "creatorId",
                "creatorDeviceId",
                "signedById",
                "blobsUpdatedAt",
                "environmentId",
            ], obj);
        case "orgRole":
            return Object.assign(Object.assign({}, (0, object_1.pick)([
                ...baseProps,
                "name",
                "description",
                "autoAppRoleId",
                "canHaveCliUsers",
                "orderIndex",
            ], obj)), { isDefault: obj.isDefault, defaultName: obj.defaultName, extendsRoleId: obj.extendsRoleId, permissions: obj.permissions, addPermissions: obj.addPermissions, removePermissions: obj.removePermissions, canManageAllOrgRoles: obj.canManageAllOrgRoles, canManageOrgRoleIds: obj.canManageOrgRoleIds, canInviteAllOrgRoles: obj.canInviteAllOrgRoles, canInviteOrgRoleIds: obj.canInviteOrgRoleIds, defaultDescription: obj.defaultDescription });
        case "appRole":
            return Object.assign(Object.assign({}, (0, object_1.pick)([
                ...baseProps,
                "name",
                "description",
                "defaultAllApps",
                "canHaveCliUsers",
                "hasFullEnvironmentPermissions",
                "orderIndex",
            ], obj)), { isDefault: obj.isDefault, defaultName: obj.defaultName, extendsRoleId: obj.extendsRoleId, permissions: obj.permissions, addPermissions: obj.addPermissions, removePermissions: obj.removePermissions, canInviteAppRoleIds: obj.canInviteAppRoleIds, canManageAppRoleIds: obj.canManageAppRoleIds, defaultDescription: obj.defaultDescription });
        case "environmentRole":
            const environmentRoleProps = [
                ...baseProps,
                "name",
                "description",
                "isDefault",
                "hasLocalKeys",
                "hasServers",
                "defaultAllApps",
                "defaultAllBlocks",
                "settings",
                "orderIndex",
                "importId",
            ];
            return obj.isDefault
                ? (0, object_1.pick)([...environmentRoleProps, "defaultName", "defaultDescription"], obj)
                : (0, object_1.pick)([...environmentRoleProps], obj);
        case "appRoleEnvironmentRole":
            return (0, object_1.pick)([...baseProps, "appRoleId", "environmentRoleId", "permissions"], obj);
        case "pubkeyRevocationRequest":
            return (0, object_1.pick)([...baseProps, "targetId", "creatorId"], obj);
        case "rootPubkeyReplacement":
            return (0, object_1.pick)([
                ...baseProps,
                "requestId",
                "creatorId",
                "replacingPubkey",
                "signedReplacingTrustChain",
            ], obj);
        case "externalAuthProvider":
            if (obj.provider === "saml") {
                return (0, object_1.pick)([
                    ...baseProps,
                    "nickname",
                    "authMethod",
                    "provider",
                    "orgId",
                    "samlSettingsId",
                ], obj);
            }
            return (0, object_1.pick)([...baseProps, "nickname", "authMethod", "provider", "orgId"], obj);
        case "scimProvisioningProvider":
            return (0, object_1.pick)([...baseProps, "orgId", "nickname", "authScheme", "endpointBaseUrl"], obj);
        case "product":
            return (0, object_1.pick)([
                ...baseProps,
                "plan",
                "name",
                "maxUsers",
                "maxEnvkeyWatchers",
                "adjustableQuantity",
                "ssoEnabled",
                "teamsEnabled",
                "customRbacEnabled",
                "isCloudBasics",
            ], obj);
        case "price":
            return (0, object_1.pick)([...baseProps, "name", "productId", "interval", "amount"], obj);
        case "customer":
            return (0, object_1.pick)([...baseProps, "billingEmail"], obj);
        case "subscription":
            return (0, object_1.pick)([
                ...baseProps,
                "productId",
                "priceId",
                "quantity",
                "status",
                "canceledAt",
                "currentPeriodStartsAt",
                "currentPeriodEndsAt",
                "amountOff",
                "percentOff",
                "hasPromotionCode",
            ], obj);
        case "paymentSource":
            return (0, object_1.pick)([
                ...baseProps,
                "paymentType",
                "brand",
                "last4",
                "expMonth",
                "expYear",
            ], obj);
        case "vantaConnectedAccount":
            return (0, object_1.pick)([...baseProps, "lastSyncAt", "status", "error"], obj);
    }
};
exports.getUserGraph = getUserGraph, exports.orgGraphObjectToUserGraphObject = orgGraphObjectToUserGraphObject;
//# sourceMappingURL=user_graph.js.map