import { Client } from "../../types";
export declare const getAuth: <T extends Client.ClientUserAuth | Client.ClientCliAuth = Client.ClientUserAuth | Client.ClientCliAuth>(state: Client.State, accountIdOrCliKey: string | undefined) => T, getApiAuthParams: (accountAuth: Client.ClientUserAuth | Client.ClientCliAuth) => {
    type?: "bearerTokenAuthParams";
    providerId?: string;
    secret?: string;
} | {
    type?: "tokenAuthParams";
    signature?: string;
    token?: string;
    userId?: string;
    orgId?: string;
    deviceId?: string;
} | {
    type?: "cliAuthParams";
    signature?: string;
    userId?: string;
    orgId?: string;
} | {
    type?: "loadInviteAuthParams";
    identityHash?: string;
    emailToken?: string;
} | {
    type?: "loadDeviceGrantAuthParams";
    identityHash?: string;
    emailToken?: string;
} | {
    type?: "loadRecoveryKeyAuthParams";
    identityHash?: string;
} | {
    type?: "acceptInviteAuthParams";
    signature?: string;
    identityHash?: string;
    emailToken?: string;
} | {
    type?: "acceptDeviceGrantAuthParams";
    signature?: string;
    identityHash?: string;
    emailToken?: string;
} | {
    type?: "redeemRecoveryKeyAuthParams";
    signature?: string;
    identityHash?: string;
};
//# sourceMappingURL=auth.d.ts.map