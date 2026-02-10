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
exports.verifyPubkeyWithTrustChain = exports.verifyRootPubkeyReplacement = exports.clearRevokedOrOutdatedSessionPubkeys = exports.processRootPubkeyReplacementsIfNeeded = exports.processRevocationRequestsIfNeeded = exports.verifyOrgKeyable = exports.getAlreadyTrusted = exports.getTrustAttributes = exports.verifySignedTrustedRootPubkey = exports.verifyKeypair = exports.verifyCurrentUser = void 0;
const types_1 = require("@envkey/core/types");
const proxy_1 = require("@envkey/core/lib/crypto/proxy");
const handler_1 = require("../../handler");
const R = __importStar(require("ramda"));
const graph_1 = require("@envkey/core/lib/graph");
const client_1 = require("@envkey/core/lib/client");
const logger_1 = require("@envkey/core/lib/utils/logger");
const verifyCurrentUser = async (initialState, context) => {
    let state = initialState;
    const auth = (0, client_1.getAuth)(state, context.accountIdOrCliKey);
    if (!auth || !auth.privkey || !context.accountIdOrCliKey) {
        throw new Error("Action requires authentication and decrypted privkey");
    }
    let pubkey;
    let keyableId;
    const user = state.graph[auth.userId];
    if (!user) {
        throw new Error("authenticated user or cli user not found in graph");
    }
    if (user.type == "cliUser") {
        pubkey = user.pubkey;
        keyableId = user.id;
    }
    else if (auth.type == "clientUserAuth") {
        const currentOrgUserDevice = state.graph[auth.deviceId];
        if (!currentOrgUserDevice) {
            throw new Error("currentOrgUserDevice not found in graph");
        }
        pubkey = currentOrgUserDevice.pubkey;
        keyableId = currentOrgUserDevice.id;
    }
    if (!pubkey || !keyableId) {
        throw new Error("pubkey or keyableId undefined");
    }
    const [verifyRes, _] = await Promise.all([
        (0, exports.verifySignedTrustedRootPubkey)(state, pubkey, context),
        (0, exports.verifyKeypair)(pubkey, auth.privkey),
    ]);
    if (!verifyRes.success) {
        return verifyRes;
    }
    const replacementsRes = await (0, exports.processRootPubkeyReplacementsIfNeeded)(verifyRes.state, context, true);
    if (replacementsRes && !replacementsRes.success) {
        throw new Error("couldn't process root pubkey replacements");
    }
    const res = await (0, exports.verifyOrgKeyable)((replacementsRes !== null && replacementsRes !== void 0 ? replacementsRes : verifyRes).state, keyableId, context);
    if (!res) {
        throw new Error("current user pubkey couldn't be verified");
    }
    return { success: true, state: res };
}, verifyKeypair = async (pubkey, privkey) => {
    const data = { message: "test" }, [encrypted, signed] = await Promise.all([
        (0, proxy_1.encryptJson)({
            data,
            pubkey,
            privkey,
        }),
        (0, proxy_1.signJson)({ data, privkey }),
    ]), [decrypted, verified] = await Promise.all([
        (0, proxy_1.decryptJson)({
            encrypted,
            privkey,
            pubkey,
        }),
        (0, proxy_1.verifyJson)({ signed, pubkey }).catch((err) => undefined),
    ]);
    if (!verified || !R.equals(data, decrypted) || !R.equals(data, verified)) {
        throw new Error("keypair verification failed");
    }
}, verifySignedTrustedRootPubkey = async (state, pubkey, context) => {
    if (state.trustedRoot) {
        return { success: true, state };
    }
    if (!state.signedTrustedRoot) {
        throw new Error("signedTrustedRoot undefined");
    }
    const verified = (await (0, proxy_1.verifyJson)({
        signed: state.signedTrustedRoot.data,
        pubkey: pubkey,
    }));
    return (0, handler_1.dispatch)({
        type: types_1.Client.ActionType.VERIFIED_SIGNED_TRUSTED_ROOT_PUBKEY,
        payload: verified,
    }, context);
}, getTrustAttributes = (state, keyableId) => {
    if (!keyableId) {
        throw new Error("keyableId undefined");
    }
    const keyable = state.graph[keyableId];
    if (!keyable) {
        throw new Error("Keyable not found");
    }
    let pubkey, invitePubkey, signedById, isRoot = false, keyableType;
    if (keyable.type == "localKey" || keyable.type == "server") {
        const generatedEnvkey = (0, graph_1.getActiveGeneratedEnvkeysByKeyableParentId)(state.graph)[keyable.id];
        if (!generatedEnvkey) {
            throw new Error("No envkey generated for keyableParent.");
        }
        keyableType = "generatedEnvkey";
        pubkey = generatedEnvkey.pubkey;
        signedById = generatedEnvkey.signedById;
    }
    else {
        if (!keyable.pubkey) {
            throw new Error("Keyable pubkey not generated");
        }
        pubkey = keyable.pubkey;
        switch (keyable.type) {
            case "orgUserDevice":
                keyableType = "orgUserDevice";
                if (keyable.approvedByType == "creator" || keyable.isRoot) {
                    isRoot = true;
                }
                else {
                    let intermediateKeyableId;
                    switch (keyable.approvedByType) {
                        case "invite":
                            intermediateKeyableId = keyable.inviteId;
                            break;
                        case "deviceGrant":
                            intermediateKeyableId = keyable.deviceGrantId;
                            break;
                        case "recoveryKey":
                            intermediateKeyableId = keyable.recoveryKeyId;
                            break;
                    }
                    const intermediateKeyable = state.graph[intermediateKeyableId];
                    signedById = intermediateKeyable.signedById;
                    invitePubkey = intermediateKeyable.pubkey;
                }
                break;
            case "cliUser":
            case "invite":
            case "deviceGrant":
            case "recoveryKey":
                keyableType = keyable.type;
                signedById = keyable.signedById;
                break;
        }
    }
    let signedByPubkeyId;
    if (signedById) {
        const { pubkey: signedByPubkey } = state.graph[signedById];
        signedByPubkeyId = (0, client_1.getPubkeyHash)(signedByPubkey);
    }
    return {
        pubkeyId: (0, client_1.getPubkeyHash)(pubkey),
        keyableType,
        pubkey,
        invitePubkey,
        signedById,
        signedByPubkeyId,
        isRoot,
    };
}, getAlreadyTrusted = (state, pubkeyId, keyableType, pubkey, invitePubkey, signedByPubkeyId, isRoot) => {
    let alreadyTrusted;
    if (isRoot === true) {
        alreadyTrusted = state.trustedRoot[pubkeyId];
    }
    else {
        alreadyTrusted = state.trustedSessionPubkeys[pubkeyId];
    }
    if (alreadyTrusted) {
        const shouldEq = [
            isRoot ? "root" : keyableType,
            pubkey,
            invitePubkey,
            signedByPubkeyId,
        ].filter(Boolean);
        if (!R.equals(shouldEq, alreadyTrusted)) {
            return false;
        }
        return true;
    }
    return false;
}, verifyOrgKeyable = async (initialState, initialKeyableId, context) => {
    let state = initialState;
    if (!state.trustedRoot || R.isEmpty(state.trustedRoot)) {
        throw new Error("Verified trustedRoot required.");
    }
    const { pubkeyId: initialPubkeyId, keyableType: initialKeyableType, pubkey: initialPubkey, invitePubkey: initialInvitePubkey, signedById: initialSignedById, signedByPubkeyId: initialSignedByPubkeyId, isRoot: initialIsRoot, } = (0, exports.getTrustAttributes)(state, initialKeyableId);
    // Check if initial keyable is already trusted
    if ((0, exports.getAlreadyTrusted)(state, initialPubkeyId, initialKeyableType, initialPubkey, initialInvitePubkey, initialSignedByPubkeyId, initialIsRoot)) {
        return state;
    }
    // If keyable is not yet trusted, attempt to verify back to a signer who *is* trusted
    let verifyingChain = [
        [
            initialPubkeyId,
            [
                initialKeyableType,
                initialPubkey,
                initialInvitePubkey,
                initialSignedByPubkeyId,
            ].filter(Boolean),
        ],
    ];
    let currentKeyableId = initialSignedById;
    while (true) {
        const { pubkeyId, keyableType, signedById, signedByPubkeyId, pubkey, invitePubkey, isRoot, } = (0, exports.getTrustAttributes)(state, currentKeyableId);
        if (!isRoot) {
            const { pubkey: signerPubkey } = (0, exports.getTrustAttributes)(state, signedById);
            if (invitePubkey) {
                // ensure pubkey is signed by invite pubkey, and invite pubkey is signed by signer
                // verification throws error if invalid
                await Promise.all([
                    (0, proxy_1.verifyPublicKeySignature)({
                        signedPubkey: pubkey,
                        signerPubkey: invitePubkey,
                    }),
                    (0, proxy_1.verifyPublicKeySignature)({
                        signedPubkey: invitePubkey,
                        signerPubkey,
                    }),
                ]);
            }
            else {
                // ensure pubkey is signed by signer
                // verification throws error if invalid
                await (0, proxy_1.verifyPublicKeySignature)({
                    signedPubkey: pubkey,
                    signerPubkey,
                });
            }
        }
        if ((0, exports.getAlreadyTrusted)(state, pubkeyId, keyableType, pubkey, invitePubkey, signedByPubkeyId, isRoot)) {
            for (let [verifiedPubkeyId, verifiedTrustedPubkey] of verifyingChain) {
                const res = await (0, handler_1.dispatch)({
                    type: types_1.Client.ActionType.ADD_TRUSTED_SESSION_PUBKEY,
                    payload: {
                        id: verifiedPubkeyId,
                        trusted: verifiedTrustedPubkey,
                    },
                }, context);
                if (res.success) {
                    state = res.state;
                }
            }
            return state;
        }
        else {
            if (!signedById || !signedByPubkeyId) {
                (0, logger_1.log)("Keyable could not be verified.", {
                    currentKeyableId,
                    pubkeyId,
                    keyableType,
                    signedById,
                    signedByPubkeyId,
                    pubkey,
                    invitePubkey,
                    isRoot,
                    verifyingChain,
                });
                throw new Error("Keyable could not be verified.");
            }
            verifyingChain.push([
                pubkeyId,
                [keyableType, pubkey, invitePubkey, signedByPubkeyId].filter(Boolean),
            ]);
            currentKeyableId = signedById;
        }
    }
    throw new Error("Keyable could not be verified.");
}, processRevocationRequestsIfNeeded = async (state, context) => {
    // this function is intended to be called asynchronously by the handler after graph updates, not awaited (doing so would block state updates/rendering for no good reason)
    let { pubkeyRevocationRequests } = (0, graph_1.graphTypes)(state.graph);
    if (!state.isProcessingRevocationRequests &&
        pubkeyRevocationRequests.length > 0) {
        return (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.PROCESS_REVOCATION_REQUESTS,
        }, context);
    }
}, processRootPubkeyReplacementsIfNeeded = async (state, context, commitTrusted) => {
    const { rootPubkeyReplacements } = (0, graph_1.graphTypes)(state.graph);
    if (!state.isProcessingRootPubkeyReplacements &&
        rootPubkeyReplacements.length > 0) {
        return (0, handler_1.dispatch)({
            type: types_1.Client.ActionType.PROCESS_ROOT_PUBKEY_REPLACEMENTS,
            payload: { commitTrusted },
        }, context);
    }
}, clearRevokedOrOutdatedSessionPubkeys = (state, context) => {
    if (R.isEmpty(state.trustedSessionPubkeys)) {
        return;
    }
    const keyablesByPubkeyId = (0, graph_1.getKeyablesByPubkeyId)(state.graph);
    for (let trustedPubkeyId in state.trustedSessionPubkeys) {
        let shouldClear = false;
        if (keyablesByPubkeyId[trustedPubkeyId]) {
            // apart from clearing keys that have been revoked and are no longer in the graph, we should also clear any whose trust attributes have been updated
            const keyableId = keyablesByPubkeyId[trustedPubkeyId].id;
            const { pubkeyId, keyableType, signedByPubkeyId, pubkey, invitePubkey, isRoot, } = (0, exports.getTrustAttributes)(state, keyableId);
            shouldClear = !(0, exports.getAlreadyTrusted)(state, pubkeyId, keyableType, pubkey, invitePubkey, signedByPubkeyId, isRoot);
        }
        else {
            shouldClear = true;
        }
        if (shouldClear) {
            (0, handler_1.dispatch)({
                type: types_1.Client.ActionType.CLEAR_TRUSTED_SESSION_PUBKEY,
                payload: { id: trustedPubkeyId },
            }, context);
        }
    }
}, verifyRootPubkeyReplacement = async (state, replacement) => {
    if (!state.trustedRoot) {
        throw new Error("trustedRoot undefined");
    }
    const replacingTrustChain = (await (0, proxy_1.verifyJson)({
        signed: replacement.signedReplacingTrustChain.data,
        pubkey: replacement.replacingPubkey,
    }));
    return (0, exports.verifyPubkeyWithTrustChain)(replacement.replacingPubkey, state.trustedRoot, replacingTrustChain);
}, verifyPubkeyWithTrustChain = async (verifyPubkey, trustedRoot, trustChain) => {
    var _a;
    const checked = {};
    let currentPubkey = verifyPubkey;
    let currentPubkeyId = (0, client_1.getPubkeyHash)(currentPubkey);
    while (true) {
        if (checked[currentPubkeyId]) {
            throw new Error("Circular trust chain. Couldn't find trusted root pubkey.");
        }
        if (trustedRoot[currentPubkeyId]) {
            return true;
        }
        const trusted = trustChain[currentPubkeyId];
        if (!trusted) {
            throw new Error("Trusted pubkey chain broken.");
        }
        let trustedSignerId;
        let invitePubkey;
        if (trusted[0] == "orgUserDevice") {
            invitePubkey = trusted[2];
            trustedSignerId = trusted[3];
        }
        else {
            trustedSignerId = trusted[2];
        }
        const trustedSigner = ((_a = trustChain[trustedSignerId]) !== null && _a !== void 0 ? _a : trustedRoot[trustedSignerId]);
        if (!trustedSigner) {
            throw new Error("Trusted pubkey chain broken.");
        }
        const signerPubkey = trustedSigner[1];
        if (invitePubkey) {
            // ensure pubkey is signed by invite pubkey, and invite pubkey is signed by signer
            // verification throws error if invalid
            await Promise.all([
                (0, proxy_1.verifyPublicKeySignature)({
                    signedPubkey: currentPubkey,
                    signerPubkey: invitePubkey,
                }),
                (0, proxy_1.verifyPublicKeySignature)({
                    signedPubkey: invitePubkey,
                    signerPubkey,
                }),
            ]);
        }
        else {
            // ensure pubkey is signed by signer
            // verification throws error if invalid
            await (0, proxy_1.verifyPublicKeySignature)({
                signedPubkey: currentPubkey,
                signerPubkey,
            });
        }
        if (trustedSigner[0] == "root") {
            return true;
        }
        else {
            currentPubkey = signerPubkey;
            currentPubkeyId = trustedSignerId;
        }
    }
    throw new Error("Unreachable");
};
exports.verifyCurrentUser = verifyCurrentUser, exports.verifyKeypair = verifyKeypair, exports.verifySignedTrustedRootPubkey = verifySignedTrustedRootPubkey, exports.getTrustAttributes = getTrustAttributes, exports.getAlreadyTrusted = getAlreadyTrusted, exports.verifyOrgKeyable = verifyOrgKeyable, exports.processRevocationRequestsIfNeeded = processRevocationRequestsIfNeeded, exports.processRootPubkeyReplacementsIfNeeded = processRootPubkeyReplacementsIfNeeded, exports.clearRevokedOrOutdatedSessionPubkeys = clearRevokedOrOutdatedSessionPubkeys, exports.verifyRootPubkeyReplacement = verifyRootPubkeyReplacement, exports.verifyPubkeyWithTrustChain = verifyPubkeyWithTrustChain;
//# sourceMappingURL=index.js.map