"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessGrantableAppsForUser = exports.getAccessGrantableOrRemovableAppsForUser = void 0;
const _1 = require("../../.");
const getAccessGrantableOrRemovableAppsForUser = (graph, currentUserId, userId) => {
    const { apps } = (0, _1.graphTypes)(graph);
    return apps.filter(({ id: appId }) => _1.authz.canRemoveAppUserAccess(graph, currentUserId, { appId, userId }) ||
        _1.authz.getAccessGrantableAppRolesForUser(graph, currentUserId, appId, userId).length > 0);
};
exports.getAccessGrantableOrRemovableAppsForUser = getAccessGrantableOrRemovableAppsForUser;
const getAccessGrantableAppsForUser = (graph, currentUserId, userId) => {
    const { apps } = (0, _1.graphTypes)(graph);
    return apps.filter(({ id: appId }) => _1.authz.getAccessGrantableAppRolesForUser(graph, currentUserId, appId, userId).length > 0);
};
exports.getAccessGrantableAppsForUser = getAccessGrantableAppsForUser;
//# sourceMappingURL=users.js.map