"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canRevokeTrustedUserPubkey = void 0;
const helpers_1 = require("./helpers");
const __1 = require("../..");
const canRevokeTrustedUserPubkey = (graph, currentUserId, targetId) => {
    const currentUserRes = (0, helpers_1.authorizeUser)(graph, currentUserId);
    if (!currentUserRes) {
        return false;
    }
    const currentUser = currentUserRes[0];
    const role = graph[currentUser.orgRoleId];
    // quick fix for tricky issue with allowing basic users to re-encrypt
    // and revoke pubkeys
    // now only org owners and org admins can re-encrypt/revoke
    if (role.defaultName != "Org Owner" && role.defaultName != "Org Admin") {
        return false;
    }
    const targetKeyable = (0, helpers_1.presence)(graph[targetId], "orgUserDevice", true) ||
        (0, helpers_1.presence)(graph[targetId], "cliUser", true);
    if (!targetKeyable) {
        return false;
    }
    const environmentIds = (0, __1.getEncryptedByEnvironmentIds)(graph, targetKeyable.id);
    const localIds = (0, __1.getEncryptedByLocalIds)(graph, targetKeyable.id);
    if (environmentIds.length > 0 || localIds.length > 0) {
        return false;
    }
    // for (let environmentId of environmentIds) {
    //   if (!canUpdateEnv(graph, currentUserId, environmentId)) {
    //     return false;
    //   }
    // }
    // for (let localId of localIds) {
    //   const [envParentId, localsUserId] = localId.split("|");
    //   if (!canUpdateLocals(graph, currentUserId, envParentId, localsUserId)) {
    //     return false;
    //   }
    // }
    const signedKeyableIds = (0, __1.getSignedByKeyableIds)(graph, targetKeyable.id);
    for (let signedKeyableId of signedKeyableIds) {
        const keyable = graph[signedKeyableId];
        if (!keyable) {
            return false;
        }
    }
    return true;
};
exports.canRevokeTrustedUserPubkey = canRevokeTrustedUserPubkey;
//# sourceMappingURL=trust.js.map