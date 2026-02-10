import { Client } from "../../types";
import { Draft } from "immer";
type BlobState = Pick<Client.State, "graph" | "envsFetchedAt" | "changesetsFetchedAt"> & {
    envs: string[];
    changesets: string[];
};
export declare const clearOrphanedBlobPaths: (blobState: BlobState, currentUserId: string, currentDeviceId: string) => string[][];
export declare const clearOrphanedEnvUpdatesProducer: (draft: Draft<Client.PartialAccountState>, currentUserId: string) => void;
export {};
//# sourceMappingURL=blob.d.ts.map