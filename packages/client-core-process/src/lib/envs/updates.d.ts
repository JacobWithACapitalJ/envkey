import { Draft } from "immer";
import { Client } from "@envkey/core/types";
import { Action } from "redux";
export declare const envUpdateAction: <T extends Client.Action.EnvUpdateAction>(params: {
    actionType: Client.Action.EnvUpdateAction["type"];
    updateFn: (state: Client.State, envWithMeta: Client.Env.EnvWithMeta, action: T) => Client.Env.EnvWithMeta;
}) => void, clearOverwrittenActionsProducer: (draft: Draft<Client.State>, newPending: {
    type: Client.ActionType;
    environmentId: string;
    entryKeys: string[];
}) => void, clearVoidedPendingEnvUpdatesProducer: (draft: Draft<Client.State>) => void, recalcReverseDiffsProducer: (draft: Draft<Client.State>) => void, initEnvironmentsIfNeeded: (state: Client.State, currentUserId: string, context: Client.Context) => Promise<void>;
export declare const clearNonPendingEnvsProducer: (draft: Draft<Client.State>) => void;
//# sourceMappingURL=updates.d.ts.map