import { Action } from "./action";
export declare namespace Env {
    type EnvWithMetaCell = {
        val: string;
        inheritsEnvironmentId?: undefined;
        isEmpty?: undefined;
        isUndefined?: undefined;
    } | {
        val?: undefined;
        inheritsEnvironmentId: string;
        isEmpty?: undefined;
        isUndefined?: undefined;
    } | {
        val: "";
        inheritsEnvironmentId?: undefined;
        isEmpty: true;
        isUndefined?: undefined;
    } | {
        val?: undefined;
        inheritsEnvironmentId?: undefined;
        isEmpty?: undefined;
        isUndefined: true;
    };
    type EnvMetaCell = {
        val?: undefined;
    } & ({
        inheritsEnvironmentId: string;
        isEmpty?: undefined;
        isUndefined?: undefined;
    } | {
        inheritsEnvironmentId?: undefined;
        isEmpty: true;
        isUndefined?: undefined;
    } | {
        inheritsEnvironmentId?: undefined;
        isEmpty?: undefined;
        isUndefined: true;
    } | {
        inheritsEnvironmentId?: undefined;
        isEmpty?: undefined;
        isUndefined?: undefined;
    });
    type UserEnvCell = EnvWithMetaCell | EnvMetaCell;
    type KeyableEnvVal = EnvWithMetaCell;
    type EnvWithMeta = {
        inherits: Record<string, string[]>;
        variables: Record<string, EnvWithMetaCell>;
    };
    type EnvMetaOnly = {
        inherits: Record<string, string[]>;
        variables: Record<string, EnvMetaCell>;
    };
    type EnvInheritsOnly = {
        inherits: Record<string, string[]>;
        variables?: undefined;
    };
    type UserEnv = EnvWithMeta | EnvMetaOnly | EnvInheritsOnly;
    type EnvMetaState = {
        variables: Record<string, EnvMetaCell>;
    };
    type EnvInheritsState = {
        inherits: Record<string, string[]>;
    };
    type KeyableEnv = Record<string, KeyableEnvVal>;
    type RawEnv = {
        [k: string]: string;
    };
    type VariableNote = {
        note: string;
        authorId: string;
        createdAt: string;
    };
    type VariableData = Record<string, {
        notes?: VariableNote[];
        variableGroupId?: string;
    }>;
    type ChangesetPayload = {
        actions: Action.ReplayableEnvUpdateAction[];
        message?: string;
    };
    type Changeset = ChangesetPayload & {
        createdAt: number;
        encryptedById: string;
        createdById: string;
        id: string;
    };
    type ListVersionsParams = {
        envParentId: string;
        environmentId: string;
        entryKeys?: string[];
        createdAfter?: number;
        reverse?: true;
    };
    type TargetVersionParams = ListVersionsParams & {
        version: number;
    };
    type PotentialConflict = {
        entryKey: string;
        changeset: Changeset;
        action: Action.ReplayableEnvUpdateAction;
    };
    type DiffsByKey = Record<string, {
        fromValue: EnvWithMetaCell | undefined;
        toValue: EnvWithMetaCell | undefined;
    }>;
}
//# sourceMappingURL=envs.d.ts.map