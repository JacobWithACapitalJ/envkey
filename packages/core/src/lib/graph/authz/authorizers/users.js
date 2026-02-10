"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canListBlocksForUser = exports.canListAppsForUser = void 0;
const helpers_1 = require("./helpers");
const _1 = require("../../.");
const canListAppsForUser = (graph, currentUserId, userId) => {
    const user = (0, helpers_1.presence)(graph[userId], "orgUser") ||
        (0, helpers_1.presence)(graph[userId], "cliUser");
    if (!user) {
        return false;
    }
    if ((0, helpers_1.hasOrgPermission)(graph, currentUserId, user.type == "orgUser" ? "org_manage_users" : "org_manage_cli_users")) {
        return true;
    }
    return (_1.authz.getAccessGrantableOrRemovableAppsForUser(graph, currentUserId, userId)
        .length > 0);
};
exports.canListAppsForUser = canListAppsForUser;
const canListBlocksForUser = (graph, currentUserId, userId) => {
    const user = (0, helpers_1.presence)(graph[userId], "orgUser") ||
        (0, helpers_1.presence)(graph[userId], "cliUser");
    if (!user) {
        return false;
    }
    return (0, helpers_1.hasAllOrgPermissions)(graph, currentUserId, [
        user.type == "orgUser" ? "org_manage_users" : "org_manage_cli_users",
        "blocks_read_all",
    ]);
};
exports.canListBlocksForUser = canListBlocksForUser;
//# sourceMappingURL=users.js.map