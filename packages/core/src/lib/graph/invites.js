"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInviteStatus = void 0;
const indexed_graph_1 = require("./indexed_graph");
const getInviteStatus = (graph, userId, now) => {
    var _a;
    const user = graph[userId];
    if (user.isCreator) {
        return "creator";
    }
    if (user.inviteAcceptedAt) {
        return "accepted";
    }
    const invites = (_a = (0, indexed_graph_1.getActiveOrExpiredInvitesByInviteeId)(graph)[user.id]) !== null && _a !== void 0 ? _a : [];
    const mostRecentInvite = invites[invites.length - 1];
    if (!mostRecentInvite) {
        return "failed";
    }
    else if (now > mostRecentInvite.expiresAt) {
        return "expired";
    }
    else if (mostRecentInvite.v1Invite) {
        return "pending-v1-upgrade";
    }
    return "pending";
};
exports.getInviteStatus = getInviteStatus;
//# sourceMappingURL=invites.js.map