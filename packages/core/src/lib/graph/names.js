"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectName = exports.getUserName = exports.getGroupObjectTypeLabelCamelized = exports.getGroupObjectTypeLabel = exports.getEnvironmentName = void 0;
const moment_1 = __importDefault(require("moment"));
const getEnvironmentName = (graph, environmentId) => {
    const environment = graph[environmentId];
    if (environment) {
        const role = graph[environment.environmentRoleId];
        return "subName" in environment ? environment.subName : role.name;
    }
    else {
        const [, localsUserId] = environmentId.split("|");
        if (graph[localsUserId]) {
            return (0, exports.getUserName)(graph, localsUserId, true) + " Locals";
        }
        else {
            return "";
        }
    }
};
exports.getEnvironmentName = getEnvironmentName;
const getGroupObjectTypeLabel = (graph, groupId) => {
    const group = graph[groupId];
    switch (group.objectType) {
        case "orgUser":
            return "team";
        case "app":
            return "app group";
        case "block":
            return "block group";
    }
};
exports.getGroupObjectTypeLabel = getGroupObjectTypeLabel;
const getGroupObjectTypeLabelCamelized = (graph, groupId) => {
    const group = graph[groupId];
    switch (group.objectType) {
        case "orgUser":
            return "Team";
        case "app":
            return "App Group";
        case "block":
            return "Block Group";
    }
};
exports.getGroupObjectTypeLabelCamelized = getGroupObjectTypeLabelCamelized;
const getUserName = (graph, userOrDeviceId, firstInitialOnly, lastNameFirst) => {
    const userOrDevice = graph[userOrDeviceId];
    const user = userOrDevice.type == "orgUserDevice"
        ? graph[userOrDevice.userId]
        : userOrDevice;
    if (user.type == "orgUser") {
        const first = firstInitialOnly ? user.firstName[0] + "." : user.firstName;
        return lastNameFirst
            ? `${user.lastName}, ${first}`
            : `${first} ${user.lastName}`;
    }
    return user.name;
};
exports.getUserName = getUserName;
const getObjectName = (graph, id) => {
    var _a;
    const object = graph[id];
    if (!object) {
        return "unknown";
    }
    switch (object.type) {
        case "org":
        case "orgUserDevice":
        case "app":
        case "block":
        case "server":
        case "localKey":
        case "orgRole":
        case "appRole":
        case "environmentRole":
        case "variableGroup":
        case "group":
            return object.name;
        case "license":
            return (object.plan +
                (object.provisional ? " (provisional)" : "") +
                ` - valid until ${moment_1.default.utc(object.expiresAt).format("lll")} UTC`);
        case "orgUser":
        case "cliUser":
            return (0, exports.getUserName)(graph, id);
        case "recoveryKey":
            return `${(0, exports.getUserName)(graph, object.userId)} Recovery Key - ${moment_1.default
                .utc(object.createdAt)
                .format("lll")} UTC`;
        case "environment":
            let environmentName;
            if (object.isSub) {
                environmentName =
                    (0, exports.getEnvironmentName)(graph, object.parentEnvironmentId) +
                        " > " +
                        object.subName;
            }
            else {
                environmentName = (0, exports.getEnvironmentName)(graph, id);
            }
            return environmentName;
        case "generatedEnvkey":
            return `${object.envkeyShort}…`;
        case "externalAuthProvider":
            return object.provider == "saml"
                ? `SAML Connection '{object.nickname ?? object.id}'`
                : `External Auth Provider '${object.id}'`;
        case "scimProvisioningProvider":
            return `SCIM Connection '${(_a = object.nickname) !== null && _a !== void 0 ? _a : object.endpointBaseUrl}'`;
        case "vantaConnectedAccount":
            return `Vanta Integration Connection`;
        // The following aren't printed out anywhere yet, but could be in the future
        case "deviceGrant":
        case "invite":
        case "appUserGrant":
        case "appBlock":
        case "groupMembership":
        case "appUserGroup":
        case "appGroupUserGroup":
        case "appGroupUser":
        case "appGroupBlock":
        case "appBlockGroup":
        case "appGroupBlockGroup":
        case "includedAppRole":
        case "appRoleEnvironmentRole":
        case "pubkeyRevocationRequest":
        case "rootPubkeyReplacement":
        case "product":
        case "price":
        case "customer":
        case "subscription":
        case "paymentSource":
            return "";
    }
};
exports.getObjectName = getObjectName;
//# sourceMappingURL=names.js.map