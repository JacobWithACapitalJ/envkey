import { Draft } from "immer";
import { Client, Blob, Crypto } from "@envkey/core/types";
export declare const decryptEnvs: (state: Client.State, encryptedKeys: Blob.UserEncryptedKeysByEnvironmentIdOrComposite, encryptedBlobs: Blob.UserEncryptedBlobsByComposite, currentUserPrivkey: Crypto.Privkey, context: Client.Context, keysOnly?: boolean) => Promise<Record<string, {
    key: string;
    env: Client.Env.EnvMetaState | Client.Env.EnvInheritsState | Client.Env.KeyableEnv;
}>>, decryptChangesets: (state: Client.State, encryptedKeys: Blob.UserEncryptedChangesetKeysByEnvironmentId, encryptedBlobs: Blob.UserEncryptedBlobsByEnvironmentId, currentUserPrivkey: Crypto.Privkey, context: Client.Context, keysOnly?: boolean) => Promise<Record<string, {
    key: string;
    changesets: Client.Env.Changeset[];
}>>, decryptedEnvsStateProducer: (draft: Draft<Client.State>, action: {
    payload: Partial<Pick<Client.State, "envs" | "changesets">> & {
        timestamp?: number;
        notModified?: true;
    };
}, fetchAction?: Client.Action.ClientActions["FetchEnvs"]) => import("immer/dist/internal").WritableDraft<import("../../../../core/src/types/client/state").State>;
//# sourceMappingURL=decrypt.d.ts.map