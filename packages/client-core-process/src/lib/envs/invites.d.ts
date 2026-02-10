import { Client, Api, Model, Crypto } from "@envkey/core/types";
export declare const encryptedKeyParamsForDeviceOrInvitee: (params: {
    state: Client.State;
    privkey: Crypto.Privkey;
    pubkey: Crypto.Pubkey;
    userId?: string;
    accessParams?: Model.AccessParams;
    context: Client.Context;
}) => Promise<Api.Net.EnvParams>;
//# sourceMappingURL=invites.d.ts.map