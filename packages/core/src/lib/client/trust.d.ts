import { Client, Trust, Crypto } from "../../types";
export declare const getPubkeyHash: (pubkey: Crypto.Pubkey) => string;
export declare const getTrustChain: (state: Pick<Client.State, "graph" | "trustedSessionPubkeys" | "trustedRoot">, userOrDeviceId: string) => Trust.UserTrustChain;
//# sourceMappingURL=trust.d.ts.map