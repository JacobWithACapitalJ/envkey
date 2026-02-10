"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrustChain = exports.getPubkeyHash = void 0;
const utils_1 = require("../crypto/utils");
const getPubkeyHash = (pubkey) => (0, utils_1.sha256)(JSON.stringify(pubkey));
exports.getPubkeyHash = getPubkeyHash;
const getTrustChain = (state, userOrDeviceId) => {
    const trustedSessionPubkeys = state.trustedSessionPubkeys, trustedRoot = state.trustedRoot;
    if (!trustedRoot) {
        throw new Error("Verified trustedUserPubkeys required.");
    }
    const trustChain = {}, checked = {}, authId = userOrDeviceId, { pubkey: currentUserPubkey } = state.graph[authId];
    let currentKeyableId = authId;
    let currentPubkeyId = (0, exports.getPubkeyHash)(currentUserPubkey);
    while (true) {
        if (checked[currentPubkeyId]) {
            throw new Error("Circular trust chain. Couldn't find trusted root pubkey.");
        }
        checked[currentPubkeyId] = true;
        if (trustedRoot[currentPubkeyId]) {
            return trustChain;
        }
        const trusted = trustedSessionPubkeys[currentPubkeyId];
        if (!trusted) {
            throw new Error("Trusted pubkey chain broken.");
        }
        let trustedInviter = state.graph[currentKeyableId];
        if (!trustedInviter || !trustedInviter.pubkey) {
            throw new Error("Trusted inviter not found. Chain broken.");
        }
        // if creator of org and NOT the trusted root, throw an error
        if (trustedInviter.type == "orgUserDevice" &&
            trustedInviter.approvedByType == "creator") {
            throw new Error("Trusted pubkey chain broken.");
        }
        if (trustedInviter.type == "cliUser") {
            const { pubkey: inviterPubkey } = state.graph[trustedInviter.signedById];
            const inviterPubkeyId = (0, exports.getPubkeyHash)(inviterPubkey);
            trustChain[currentPubkeyId] = [
                "cliUser",
                trustedInviter.pubkey,
                inviterPubkeyId,
            ];
            currentKeyableId = trustedInviter.signedById;
            currentPubkeyId = inviterPubkeyId;
        }
        else {
            let intermediateKeyableId;
            switch (trustedInviter.approvedByType) {
                case "invite":
                    intermediateKeyableId = trustedInviter.inviteId;
                    break;
                case "deviceGrant":
                    intermediateKeyableId = trustedInviter.deviceGrantId;
                    break;
                case "recoveryKey":
                    intermediateKeyableId = trustedInviter.recoveryKeyId;
                    break;
            }
            const intermediateKeyable = state.graph[intermediateKeyableId];
            const signedById = intermediateKeyable.signedById;
            const { pubkey: signedByPubkey } = state.graph[signedById];
            const signedByPubkeyId = (0, exports.getPubkeyHash)(signedByPubkey);
            trustChain[currentPubkeyId] = [
                "orgUserDevice",
                trustedInviter.pubkey,
                intermediateKeyable.pubkey,
                signedByPubkeyId,
            ];
            currentKeyableId = signedById;
            currentPubkeyId = signedByPubkeyId;
        }
    }
};
exports.getTrustChain = getTrustChain;
//# sourceMappingURL=trust.js.map