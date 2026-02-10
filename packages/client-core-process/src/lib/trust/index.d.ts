import { Client, Crypto, Model, Trust } from "@envkey/core/types";
export declare const verifyCurrentUser: (initialState: Client.State, context: Client.Context) => Promise<{
    success: boolean;
    state: import("../../../../core/src/types/client/state").State;
}>, verifyKeypair: (pubkey: Crypto.Pubkey, privkey: Crypto.Privkey) => Promise<void>, verifySignedTrustedRootPubkey: (state: Client.State, pubkey: Crypto.Pubkey, context: Client.Context) => Promise<Client.DispatchResult<Client.Action.EnvkeyAction | Client.Action.SuccessAction<Client.Action.EnvkeyAction, any> | Client.Action.FailureAction<Client.Action.EnvkeyAction, import("../../../../core/src/types/api/net").Net.ErrorResult>> | {
    success: boolean;
    state: import("../../../../core/src/types/client/state").State;
}>, getTrustAttributes: (state: Client.State, keyableId: string) => {
    pubkeyId: string;
    keyableType: "orgUserDevice" | "invite" | "deviceGrant" | "recoveryKey" | "cliUser" | "generatedEnvkey";
    pubkey: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    invitePubkey: {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    };
    signedById: string;
    signedByPubkeyId: string;
    isRoot: boolean;
}, getAlreadyTrusted: (state: Client.State, pubkeyId: string, keyableType: Trust.TrustedPubkey[0], pubkey: Crypto.Pubkey, invitePubkey: Crypto.Pubkey | undefined, signedByPubkeyId: string | undefined, isRoot: boolean) => boolean, verifyOrgKeyable: (initialState: Client.State, initialKeyableId: string, context: Client.Context) => Promise<false | Client.State>, processRevocationRequestsIfNeeded: (state: Client.State, context: Client.Context) => Promise<Client.DispatchResult<Client.Action.EnvkeyAction | Client.Action.SuccessAction<Client.Action.EnvkeyAction, any> | Client.Action.FailureAction<Client.Action.EnvkeyAction, import("../../../../core/src/types/api/net").Net.ErrorResult>>>, processRootPubkeyReplacementsIfNeeded: (state: Client.State, context: Client.Context, commitTrusted?: true) => Promise<Client.DispatchResult<Client.Action.EnvkeyAction | Client.Action.SuccessAction<Client.Action.EnvkeyAction, any> | Client.Action.FailureAction<Client.Action.EnvkeyAction, import("../../../../core/src/types/api/net").Net.ErrorResult>>>, clearRevokedOrOutdatedSessionPubkeys: (state: Client.State, context: Client.Context) => void, verifyRootPubkeyReplacement: (state: Client.State, replacement: Model.RootPubkeyReplacement) => Promise<true>, verifyPubkeyWithTrustChain: (verifyPubkey: Crypto.Pubkey, trustedRoot: Trust.RootTrustChain, trustChain: Trust.UserTrustChain) => Promise<true>;
//# sourceMappingURL=index.d.ts.map