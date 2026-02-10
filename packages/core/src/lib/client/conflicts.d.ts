import { Client } from "../../types";
export declare const getEnvironmentPendingConflicts: ((state: Client.State, environmentId: string) => Client.Env.PotentialConflict[]) & import("memoizee").Memoized<(state: Client.State, environmentId: string) => Client.Env.PotentialConflict[]>, getAllPendingConflicts: ((state: Client.State, envParentIdsArg?: string[], environmentIdsArg?: string[]) => {
    [envParentId: string]: {
        [environmentId: string]: Client.Env.PotentialConflict[];
    };
}) & import("memoizee").Memoized<(state: Client.State, envParentIdsArg?: string[], environmentIdsArg?: string[]) => {
    [envParentId: string]: {
        [environmentId: string]: Client.Env.PotentialConflict[];
    };
}>;
export declare const getNumPendingConflicts: ((state: Client.State, envParentIds?: string[], environmentIds?: string[]) => number) & import("memoizee").Memoized<(state: Client.State, envParentIds?: string[], environmentIds?: string[]) => number>;
export declare const hasPendingConflicts: (state: Client.State, envParentIds?: string[], environmentIds?: string[]) => boolean;
//# sourceMappingURL=conflicts.d.ts.map