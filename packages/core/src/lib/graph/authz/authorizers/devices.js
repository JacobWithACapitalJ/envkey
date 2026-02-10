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
exports.canManageAnyUserDevicesOrGrants = exports.canManageAnyDevicesOrGrants = exports.canRevokeDevice = exports.canRevokeDeviceGrant = exports.canCreateDeviceGrant = void 0;
const devices_1 = require("../scopes/devices");
const R = __importStar(require("ramda"));
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const canCreateDeviceGrant = (graph, currentUserId, granteeId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [_, currentOrgRole, currentOrgPermissions] = currentUserRes;
    // only org users can have devices granted (not cli users)
    const targetUserRes = (0, helpers_1.authorizeUser)(graph, granteeId, [
        "orgUser",
    ]);
    if (!targetUserRes) {
        return false;
    }
    const [targetOrgUser] = targetUserRes, isInviter = targetOrgUser.invitedById == currentUserId;
    if (!(targetOrgUser.isCreator || targetOrgUser.inviteAcceptedAt)) {
        return false;
    }
    // allow users with 'org_manage_user_devices' to authorize new devices
    // (but not necessarily revoke them) for all users
    // in practice, allows Org Admins to authorize devices for an Org Owner
    // which is low risk and could be very helpful for restoring access to
    // an org if the Org Owner leaves or is locked out somehow
    if (currentOrgPermissions.has("org_manage_user_devices")) {
        return true;
    }
    if (!(currentOrgRole.canInviteAllOrgRoles ||
        currentOrgRole.canInviteOrgRoleIds.includes(targetOrgUser.orgRoleId) ||
        isInviter)) {
        return false;
    }
    if (currentOrgPermissions.has("org_approve_devices_for_permitted")) {
        // ensure user has approve device permissions for each of the target user's apps
        const currentUserAppRoles = (0, _1.getUserAppRolesByAppId)(graph, currentUserId), targetAppUserRoles = (0, _1.getUserAppRolesByAppId)(graph, currentUserId);
        for (let appId in targetAppUserRoles) {
            const currentUserAppRole = currentUserAppRoles[appId];
            if (!currentUserAppRole) {
                return false;
            }
            const targetUserAppRole = targetAppUserRoles[appId];
            if (!((0, helpers_1.hasAllAppPermissions)(graph, currentUserId, appId, [
                "app_approve_user_devices",
            ]) &&
                currentUserAppRole.canInviteAppRoleIds.includes(targetUserAppRole.id))) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}, canRevokeDeviceGrant = (graph, currentUserId, deviceGrantId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [_, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const toRevokeGrant = (0, helpers_1.presence)(graph[deviceGrantId], "deviceGrant");
    if (!toRevokeGrant || toRevokeGrant.acceptedAt) {
        return false;
    }
    if (!(0, exports.canCreateDeviceGrant)(graph, currentUserId, toRevokeGrant.granteeId)) {
        return false;
    }
    const targetOrgUser = (0, helpers_1.presence)(graph[toRevokeGrant.granteeId], "orgUser");
    if (!targetOrgUser) {
        return false;
    }
    return (toRevokeGrant.grantedByUserId == currentUserId ||
        (currentOrgPermissions.has("org_manage_user_devices") &&
            (currentOrgRole.canManageAllOrgRoles ||
                currentOrgRole.canManageOrgRoleIds.includes(targetOrgUser.orgRoleId))));
}, canRevokeDevice = (graph, currentUserId, deviceId) => {
    var _a;
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const [_, currentOrgRole, currentOrgPermissions] = currentUserRes;
    const orgUserDevice = (0, helpers_1.presence)(graph[deviceId], "orgUserDevice");
    if (!orgUserDevice) {
        return false;
    }
    const targetOrgUser = (0, helpers_1.presence)(graph[orgUserDevice.userId], "orgUser");
    if (!targetOrgUser) {
        return false;
    }
    // cannot remove the last remaining owner's last remaining device
    const targetOrgRole = graph[targetOrgUser.orgRoleId];
    if (targetOrgRole.isDefault && targetOrgRole.defaultName == "Org Owner") {
        const numOwners = (0, _1.getActiveOrgUsers)(graph).filter(R.propEq("orgRoleId", targetOrgRole.id)).length;
        if (numOwners == 1) {
            const numDevices = ((_a = (0, _1.getActiveOrgUserDevicesByUserId)(graph)[targetOrgUser.id]) !== null && _a !== void 0 ? _a : []).length;
            if (numDevices == 1) {
                return false;
            }
        }
    }
    return (currentOrgPermissions.has("org_manage_user_devices") &&
        (currentOrgRole.canManageAllOrgRoles ||
            currentOrgRole.canManageOrgRoleIds.includes(targetOrgUser.orgRoleId)));
}, canManageAnyDevicesOrGrants = (graph, currentUserId) => (0, devices_1.getDeviceApprovableUsers)(graph, currentUserId).length > 0 ||
    (0, devices_1.getRevokableDevices)(graph, currentUserId).length > 0 ||
    (0, devices_1.getRevokableDeviceGrants)(graph, currentUserId).length > 0, canManageAnyUserDevicesOrGrants = (graph, currentUserId, userId) => (0, devices_1.getDeviceApprovableUsers)(graph, currentUserId).filter(R.propEq("id", userId)).length == 1 ||
    (0, devices_1.getRevokableDevices)(graph, currentUserId).filter(R.propEq("userId", userId))
        .length > 0 ||
    (0, devices_1.getRevokableDeviceGrants)(graph, currentUserId).filter(R.propEq("granteeId", userId)).length > 0;
exports.canCreateDeviceGrant = canCreateDeviceGrant, exports.canRevokeDeviceGrant = canRevokeDeviceGrant, exports.canRevokeDevice = canRevokeDevice, exports.canManageAnyDevicesOrGrants = canManageAnyDevicesOrGrants, exports.canManageAnyUserDevicesOrGrants = canManageAnyUserDevicesOrGrants;
//# sourceMappingURL=devices.js.map