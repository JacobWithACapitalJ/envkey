import { Client } from "../../types";
export declare const getEnvWithMeta: ((state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true, memoBuster?: number, debugData?: boolean) => Client.Env.EnvWithMeta) & import("memoizee").Memoized<(state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true, memoBuster?: number, debugData?: boolean) => Client.Env.EnvWithMeta>, getPendingEnvWithMeta: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, memoBuster?: number) => Client.Env.EnvWithMeta, getPendingActions: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}) => Client.Action.PendingEnvUpdateAction[], getEnvMetaOnly: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true) => Client.Env.EnvMetaOnly, getPendingEnvMeta: ((state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}) => Client.Env.EnvMetaOnly) & import("memoizee").Memoized<(state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}) => Client.Env.EnvMetaOnly>, getEnvInherits: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true) => Client.Env.EnvInheritsState, getPendingInherits: ((state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}) => Client.Env.EnvInheritsState) & import("memoizee").Memoized<(state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}) => Client.Env.EnvInheritsState>, getPendingEnvironmentIds: ((state: Client.State) => string[]) & import("memoizee").Memoized<(state: Client.State) => string[]>, getPendingActionsByEnvironmentId: ((state: Client.State) => Record<string, Client.Action.PendingEnvUpdateAction[]>) & import("memoizee").Memoized<(state: Client.State) => Record<string, Client.Action.PendingEnvUpdateAction[]>>, getEarliestEnvUpdatePendingAt: (state: Client.State, envParentOrEnvironmentId?: string) => number, getKeyableEnv: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true) => Record<string, Client.Env.EnvWithMetaCell>, getRawEnv: ((state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true) => Client.Env.RawEnv) & import("memoizee").Memoized<(state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true) => Client.Env.RawEnv>, getRawEnvWithAncestors: ((state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true) => {
    [x: string]: string;
}) & import("memoizee").Memoized<(state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}, pending?: true) => {
    [x: string]: string;
}>, getPendingKeyableEnv: ((state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}) => Record<string, Client.Env.EnvWithMetaCell>) & import("memoizee").Memoized<(state: Client.State, params: {
    envParentId: string;
    environmentId: string;
}) => Record<string, Client.Env.EnvWithMetaCell>>, getInheritanceOverrides: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
    forInheritsEnvironmentId?: string;
}, pending?: true) => {
    [environmentId: string]: Client.Env.KeyableEnv;
}, getPendingInheritanceOverrides: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
    forInheritsEnvironmentId?: string;
}) => {
    [environmentId: string]: Client.Env.KeyableEnv;
}, getEnvInheritsForVariables: (variables: (Client.Env.EnvWithMeta | Client.Env.EnvMetaState)["variables"]) => Client.Env.EnvInheritsState["inherits"], getInheritanceChain: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
} & ({
    key: string;
} | {
    newEntryVals: Record<string, Client.Env.EnvWithMetaCell>;
}), pending?: true) => string[], getPendingInheritanceChain: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
    key: string;
}) => string[], getInheritingEnvironmentIds: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
} & ({
    entryKey?: string;
} | {
    newEntryVals: Record<string, Client.Env.EnvWithMetaCell>;
} | {}), pending?: true) => Set<string>, getPendingInheritingEnvironmentIds: (state: Client.State, params: {
    envParentId: string;
    environmentId: string;
    entryKey?: string;
}) => Set<string>, getPendingUpdateDetails: (state: Client.State, params?: {
    envParentIds?: Set<string>;
    environmentIds?: Set<string>;
    entryKeys?: Set<string>;
}) => {
    filteredUpdates: Client.Action.PendingEnvUpdateAction[];
    apps: Set<string>;
    appEnvironments: Set<string>;
    appPaths: Set<string>;
    blocks: Set<string>;
    blockPaths: Set<string>;
    blockEnvironments: Set<string>;
    diffsByEnvironmentId: Record<string, Client.Env.DiffsByKey>;
    pendingLocalIds: string[];
}, getDiffsByKey: (fromVars: Client.Env.EnvWithMeta["variables"], toVars: Client.Env.EnvWithMeta["variables"], entryKeys?: Set<string>) => Client.Env.DiffsByKey, ensureEnvsFetched: (state: Client.State, envParentId: string) => void, ensureChangesetsFetched: (state: Client.State, envParentId: string) => void, envsNeedFetch: (state: Client.State, envParentId: string) => boolean, changesetsNeedFetch: (state: Client.State, envParentId: string) => boolean, getCurrentUserEnv: ((state: Client.State, currentUserId: string, environmentId: string, pending?: true) => Client.Env.UserEnv | undefined) & import("memoizee").Memoized<(state: Client.State, currentUserId: string, environmentId: string, pending?: true) => Client.Env.UserEnv | undefined>, getCurrentUserEntryKeys: ((state: Client.State, currentUserId: string, environmentIds: string[], pending?: true) => string[]) & import("memoizee").Memoized<(state: Client.State, currentUserId: string, environmentIds: string[], pending?: true) => string[]>, getCurrentUserEntryKeysSet: ((state: Client.State, currentUserId: string, environmentIds: string[], pending?: true) => Set<string>) & import("memoizee").Memoized<(state: Client.State, currentUserId: string, environmentIds: string[], pending?: true) => Set<string>>, getEnvWithMetaCellDisplay: (graph: Client.Graph.UserGraph, cell: Client.Env.EnvWithMetaCell | undefined, specialCellFormatter?: (s: string) => string) => string;
//# sourceMappingURL=envs.d.ts.map