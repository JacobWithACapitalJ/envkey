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
exports.getOrg = exports.getActiveGraph = exports.graphTypes = exports.graphObjects = void 0;
const R = __importStar(require("ramda"));
const memoize_1 = __importDefault(require("../utils/memoize"));
const pick_1 = require("../utils/pick");
const pluralize_1 = __importDefault(require("pluralize"));
const names_1 = require("./names");
const array_1 = require("../utils/array");
exports.graphObjects = (0, memoize_1.default)((graph) => R.sortBy((o) => { var _a; return ("orderIndex" in o ? (_a = o.orderIndex) !== null && _a !== void 0 ? _a : o.createdAt : o.createdAt); }, Object.values(graph)));
exports.graphTypes = (0, memoize_1.default)((graph) => {
    const grouped = (0, array_1.groupBy)(({ type }) => (0, pluralize_1.default)(type), (0, exports.graphObjects)(graph));
    const byType = (R.map((v) => v || [], (0, pick_1.pick)([
        "orgUserDevices",
        "orgUsers",
        "cliUsers",
        "recoveryKeys",
        "deviceGrants",
        "invites",
        "apps",
        "blocks",
        "appUserGrants",
        "appBlocks",
        "groupMemberships",
        "groups",
        "appUserGroups",
        "appGroupUserGroups",
        "appGroupUsers",
        "appGroupBlocks",
        "appBlockGroups",
        "appGroupBlockGroups",
        "servers",
        "localKeys",
        "includedAppRoles",
        "environments",
        "variableGroups",
        "generatedEnvkeys",
        "orgRoles",
        "appRoles",
        "environmentRoles",
        "appRoleEnvironmentRoles",
        "pubkeyRevocationRequests",
        "rootPubkeyReplacements",
        "externalAuthProviders",
        "scimProvisioningProviders",
        "products",
        "prices",
    ], grouped)));
    if (grouped.orgs) {
        byType.org = grouped.orgs[0];
    }
    if (grouped.licenses) {
        byType.license = grouped.licenses[0];
    }
    if (grouped.customers) {
        byType.customer = grouped.customers[0];
    }
    if (grouped.subscriptions) {
        byType.subscription = grouped.subscriptions[0];
    }
    if (grouped.paymentSources) {
        byType.paymentSource = grouped.paymentSources[0];
    }
    if (grouped.vantaConnectedAccounts) {
        byType.vantaConnectedAccount = grouped.vantaConnectedAccounts[0];
    }
    byType.environments = R.sortBy((environment) => {
        const role = graph[environment.environmentRoleId];
        if (!role) {
            return environment.createdAt;
        }
        if (typeof role.orderIndex == "number") {
            return role.orderIndex;
        }
        const name = (0, names_1.getEnvironmentName)(graph, environment.id);
        // always put Development, Staging, and Production first if they exist
        // tacking a "3" onto subsequent
        if (!environment.isSub && role.defaultName) {
            const i = ["Development", "Staging", "Production"].indexOf(role.defaultName);
            return i == -1 ? "3" + name : "0" + i.toString();
        }
        return "3" + name;
    }, byType.environments);
    byType.apps = R.sortBy(R.prop("name"), byType.apps);
    byType.blocks = R.sortBy(R.prop("name"), byType.blocks);
    byType.orgUsers = R.sortBy(R.prop("lastName"), byType.orgUsers);
    byType.cliUsers = R.sortBy(R.prop("name"), byType.cliUsers);
    byType.includedAppRoles = R.sortBy(({ appRoleId, createdAt }) => {
        var _a;
        const appRole = graph[appRoleId];
        return (_a = appRole === null || appRole === void 0 ? void 0 : appRole.orderIndex) !== null && _a !== void 0 ? _a : createdAt;
    }, byType.includedAppRoles);
    return byType;
});
const getActiveGraph = (graph) => R.filter(({ deletedAt }) => !deletedAt, graph);
exports.getActiveGraph = getActiveGraph;
const getOrg = (graph, requireOrg) => {
    let org;
    for (let id in graph) {
        if (graph[id].type == "org") {
            org = graph[id];
            break;
        }
    }
    if (!org && requireOrg !== false) {
        throw new Error("Graph is missing org");
    }
    return org;
};
exports.getOrg = getOrg;
//# sourceMappingURL=base.js.map